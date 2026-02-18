import { supabase } from '../lib/supabase';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DbSpot {
  id: string;
  name: string;
  spot_type: string | null;
  address: string | null;
  duration_minutes: number | null;
  price_range: string | null;
  tips: string | null;
  highlight: boolean;
  latitude: number | null;
  longitude: number | null;
}

export interface DbDay {
  id: string;
  day_number: number;
  location: string | null;
  destination_id: string | null;
  theme: string | null;
  accommodation_name: string | null;
  breakfast_spot: string | null;
  lunch_spot: string | null;
  dinner_spot: string | null;
  validated: boolean;
  spots: DbSpot[];
}

export interface DbTrip {
  id: string;
  trip_title: string;
  vibe: string | null;
  duration_days: number;
  source_url: string;
  content_creator_handle: string | null;
  destination: string;
  days: DbDay[];
}

export type SpotUpdatePayload = Partial<Pick<
  DbSpot,
  'name' | 'spot_type' | 'address' | 'duration_minutes' | 'price_range' | 'tips' | 'highlight'
>>;

// ── Fetch ─────────────────────────────────────────────────────────────────────

export async function fetchTripForReview(tripId: string): Promise<DbTrip | null> {
  const { data: trip, error } = await supabase
    .from('trips')
    .select('id, trip_title, vibe, duration_days, source_url, content_creator_handle')
    .eq('id', tripId)
    .single();

  if (error || !trip) return null;

  const { data: destinations } = await supabase
    .from('destinations')
    .select('city, country')
    .eq('trip_id', tripId)
    .order('visit_order')
    .limit(1);

  const destination = destinations?.[0]
    ? [destinations[0].city, destinations[0].country].filter(Boolean).join(', ')
    : 'Destination inconnue';

  const { data: days } = await supabase
    .from('itinerary_days')
    .select('*')
    .eq('trip_id', tripId)
    .order('day_number');

  const dayIds = (days ?? []).map((d) => d.id);
  const { data: spots } = dayIds.length > 0
    ? await supabase.from('spots').select('*').in('itinerary_day_id', dayIds)
    : { data: [] };

  const dbDays: DbDay[] = (days ?? []).map((d) => ({
    id:                 d.id,
    day_number:         d.day_number,
    location:           d.location,
    destination_id:     d.destination_id ?? null,
    theme:              d.theme,
    accommodation_name: d.accommodation_name,
    breakfast_spot:     d.breakfast_spot,
    lunch_spot:         d.lunch_spot,
    dinner_spot:        d.dinner_spot,
    validated:          d.validated ?? true,
    spots: (spots ?? [])
      .filter((s) => s.itinerary_day_id === d.id)
      .sort((a, b) => (a.spot_order ?? 0) - (b.spot_order ?? 0))
      .map((s) => ({
        id:               s.id,
        name:             s.name,
        spot_type:        s.spot_type,
        address:          s.address,
        duration_minutes: s.duration_minutes,
        price_range:      s.price_range,
        tips:             s.tips,
        highlight:        s.highlight ?? false,
        latitude:         s.latitude,
        longitude:        s.longitude,
      })),
  }));

  return { ...trip, destination, days: dbDays };
}

// ── Day mutations ─────────────────────────────────────────────────────────────

export async function setDayValidated(dayId: string, validated: boolean): Promise<void> {
  const { error } = await supabase
    .from('itinerary_days')
    .update({ validated })
    .eq('id', dayId);

  if (error) throw error;
}

/**
 * Appelé au moment du save dans ReviewMode (usage unique).
 *
 * Ce que fait cette fonction :
 * 1. Supprime les spots des jours non-validés
 * 2. Supprime les jours non-validés
 * 3. Supprime les destinations qui n'ont plus aucun jour
 * 4. Met à jour days_spent sur les destinations restantes
 * 5. Recalcule visit_order séquentiel
 *
 * Prérequis : destination_id est renseigné par le backend Python à l'insertion
 * (supabase_service.py — city_to_dest_id mapping).
 */
export async function syncDestinations(tripId: string): Promise<void> {
  // 1. Charger tous les jours
  const { data: allDays, error: daysError } = await supabase
    .from('itinerary_days')
    .select('id, destination_id, validated')
    .eq('trip_id', tripId);

  if (daysError) throw daysError;
  if (!allDays || allDays.length === 0) return;

  const invalidDays = allDays.filter(d => !d.validated);
  const validDays   = allDays.filter(d =>  d.validated);

  // 2. Supprimer spots + jours non-validés
  if (invalidDays.length > 0) {
    const invalidIds = invalidDays.map(d => d.id);

    const { error: spotsError } = await supabase
      .from('spots')
      .delete()
      .in('itinerary_day_id', invalidIds);
    if (spotsError) throw spotsError;

    const { error: daysDelError } = await supabase
      .from('itinerary_days')
      .delete()
      .in('id', invalidIds);
    if (daysDelError) throw daysDelError;
  }

  // 3. Destinations encore référencées par un jour validé
  const activeDestIds = new Set(validDays.map(d => d.destination_id).filter(Boolean));

  // 4. Supprimer les destinations orphelines
  const { data: allDests, error: destsError } = await supabase
    .from('destinations')
    .select('id')
    .eq('trip_id', tripId);
  if (destsError) throw destsError;

  const orphanIds = (allDests ?? [])
    .filter(d => !activeDestIds.has(d.id))
    .map(d => d.id);

  if (orphanIds.length > 0) {
    const { error: delError } = await supabase
      .from('destinations')
      .delete()
      .in('id', orphanIds);
    if (delError) throw delError;
  }

  // 5. Mettre à jour days_spent
  const daysByDest = new Map<string, number>();
  for (const day of validDays) {
    if (!day.destination_id) continue;
    daysByDest.set(day.destination_id, (daysByDest.get(day.destination_id) ?? 0) + 1);
  }

  await Promise.all(
    [...daysByDest.entries()].map(([destId, count]) =>
      supabase.from('destinations').update({ days_spent: count }).eq('id', destId)
    )
  );

  // 6. Recalculer visit_order séquentiel
  const { data: remaining, error: remainError } = await supabase
    .from('destinations')
    .select('id, visit_order')
    .eq('trip_id', tripId)
    .order('visit_order');

  if (remainError) throw remainError;
  if (!remaining || remaining.length === 0) return;

  await Promise.all(
    remaining.map((dest, i) =>
      supabase.from('destinations').update({ visit_order: i + 1 }).eq('id', dest.id)
    )
  );
}

// ── Spot mutations ────────────────────────────────────────────────────────────

export async function updateSpot(spotId: string, payload: SpotUpdatePayload): Promise<void> {
  const { error } = await supabase
    .from('spots')
    .update(payload)
    .eq('id', spotId);

  if (error) throw error;
}

export async function deleteSpot(spotId: string): Promise<void> {
  const { error } = await supabase
    .from('spots')
    .delete()
    .eq('id', spotId);

  if (error) throw error;
}
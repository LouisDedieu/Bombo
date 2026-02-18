import { supabase } from '@/lib/supabase';

/** Full trip with nested relations — only validated itinerary days */
export async function getTrip(tripId: string) {
  const { data, error } = await supabase
    .from('trips')
    .select(`
      *,
      destinations(*),
      logistics(*),
      budgets(*),
      practical_info(*)
    `)
    .eq('id', tripId)
    .single();

  if (error) throw error;

  // Fetch uniquement les jours validés avec leurs spots
  const { data: validatedDays, error: daysError } = await supabase
    .from('itinerary_days')
    .select('*, spots(*)')
    .eq('trip_id', tripId)
    .eq('validated', true)
    .order('day_number');

  if (daysError) throw daysError;

  return { ...data, itinerary_days: validatedDays ?? [] };
}

/** All public trips (for a discovery feed) */
export async function getPublicTrips(limit = 20) {
  const { data, error } = await supabase
    .from('trip_details')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

/** All trips that belong to one user */
export async function getUserTrips(userId: string) {
  const { data, error } = await supabase
    .from('trip_details')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/** Delete a trip (user must own it — enforced by RLS) */
export async function deleteTrip(tripId: string) {
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', tripId);

  if (error) throw error;
}

// ── Saved trips ──────────────────────────────────────────────────────────────

/** Check if a trip is already saved by the user */
export async function isTripSaved(userId: string, tripId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_saved_trips')
    .select('id')
    .eq('user_id', userId)
    .eq('trip_id', tripId)
    .maybeSingle();

  if (error) throw error;
  return data !== null;
}

/** Save a trip for a user (idempotent) */
export async function saveTrip(
  userId: string,
  tripId: string,
  notes?: string
): Promise<void> {
  const { error } = await supabase
    .from('user_saved_trips')
    .upsert(
      { user_id: userId, trip_id: tripId, notes },
      { onConflict: 'user_id,trip_id', ignoreDuplicates: true }
    );

  if (error) throw error;
}

/** Remove a saved trip */
export async function unsaveTrip(userId: string, tripId: string): Promise<void> {
  const { error } = await supabase
    .from('user_saved_trips')
    .delete()
    .eq('user_id', userId)
    .eq('trip_id', tripId);

  if (error) throw error;
}

/** Toggle save/unsave — returns the new saved state */
export async function toggleSaveTrip(
  userId: string,
  tripId: string,
  notes?: string
): Promise<boolean> {
  const already = await isTripSaved(userId, tripId);
  if (already) {
    await unsaveTrip(userId, tripId);
    return false;
  } else {
    await saveTrip(userId, tripId, notes);
    return true;
  }
}

/** Get all trips saved by a user */
export async function getUserSavedTrips(userId: string) {
  const { data, error } = await supabase
    .from('user_saved_trips')
    .select(`
      id,
      notes,
      created_at,
      trips (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function updateSpotCoordinates(spotId: string, lat: number, lon: number) {
  const { error } = await supabase
    .from('spots')
    .update({ latitude: lat, longitude: lon })
    .eq('id', spotId);

  if (error) console.error(`Erreur update spot ${spotId}:`, error);
}

export async function updateDestinationCoordinates(destId: string, lat: number, lon: number) {
  const { error } = await supabase
    .from('destinations')
    .update({ latitude: lat, longitude: lon })
    .eq('id', destId);

  if (error) console.error(`Erreur update destination ${destId}:`, error);
}

export function normalizeTextForLocationIQAPI(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ðþæø]/gi, (char) => {
      const map: { [key: string]: string } = {
        'ð': 'd', 'þ': 'th', 'æ': 'ae', 'ø': 'o',
        'Ð': 'D', 'Þ': 'TH', 'Æ': 'AE', 'Ø': 'O',
      };
      return map[char] || char;
    });
}
export interface AnalysisResponse {
  job_id: string;
  trip_id: string | null;        // Supabase row ID (set by backend)
  duration_seconds: number;
  source_url: string;
  raw_json: TripData;
}

export interface AnalysisError {
  error: string;
  message: string;
}

// ── Shape of the AI output ─────────────────────────────────────────────────

export interface TripData {
  trip_title: string;
  vibe?: string;
  duration_days?: number;
  best_season?: string;
  destinations?: Destination[];
  itinerary?: ItineraryDay[];
  logistics?: LogisticsItem[];
  budget?: Budget;
  practical_info?: PracticalInfo;
  content_creator?: ContentCreator;
}

export interface Destination {
  id: string;
  city: string | null;
  country: string | null;
  days_spent: number | null;
  visit_order: number;
  latitude: number | null;
  longitude: number | null;
}

export interface ItineraryDay {
  day: number;
  location: string;
  theme?: string;
  accommodation?: Accommodation;
  meals?: Meals;
  spots?: Spot[];
}

export interface Accommodation {
  name: string;
  type?: string;
  price_per_night?: number;
  tips?: string;
}

export interface Meals {
  breakfast?: string;
  lunch?: string;
  dinner?: string;
}

export interface Spot {
  name: string;
  type?: string;
  address?: string;
  duration_minutes?: number;
  price_range?: string;
  price_detail?: string;
  tips?: string;
  highlight?: boolean;
  verified?: boolean;
}

export interface LogisticsItem {
  from: string;
  to: string;
  mode: string;
  duration?: string;
  cost?: string;
  tips?: string;
}

export interface Budget {
  total_estimated?: number;
  currency?: string;
  per_day?: { min: number; max: number };
  breakdown?: { accommodation?: number; food?: number; transport?: number; activities?: number };
  money_saving_tips?: string[];
}

export interface PracticalInfo {
  visa_required?: boolean;
  local_currency?: string;
  language?: string;
  best_apps?: string[];
  what_to_pack?: string[];
  safety_tips?: string[];
  avoid?: string[];
}

export interface ContentCreator {
  handle?: string;
  links_mentioned?: string[];
}
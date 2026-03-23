/**
 * Définition des types de spots valides.
 *
 * Ce fichier est la SOURCE UNIQUE DE VÉRITÉ pour les valeurs de spot_type côté frontend.
 * Les valeurs ici doivent correspondre EXACTEMENT à l'enum défini dans PostgreSQL.
 *
 * Enum PostgreSQL: spot_type
 * Valeurs: attraction | restaurant | bar | hotel | activite | transport | shopping
 */

/**
 * Types de spots valides dans la base de données.
 * NE PAS MODIFIER sans mettre à jour la DB.
 */
export const VALID_SPOT_TYPES = [
  'attraction',
  'restaurant',
  'bar',
  'hotel',
  'activite',
  'transport',
  'shopping',
] as const;

export type SpotType = (typeof VALID_SPOT_TYPES)[number];

/**
 * Valeur par défaut quand le type n'est pas spécifié ou invalide.
 */
export const DEFAULT_SPOT_TYPE: SpotType = 'attraction';

/**
 * Set des valeurs valides pour validation rapide.
 */
export const VALID_SPOT_TYPES_SET = new Set<string>(VALID_SPOT_TYPES);

/**
 * Valide et normalise un spot_type.
 *
 * @param spotType - Le type de spot à valider (peut être null/undefined)
 * @returns Un spot_type valide (DEFAULT_SPOT_TYPE si l'entrée est invalide)
 *
 * @example
 * validateSpotType('restaurant') // 'restaurant'
 * validateSpotType('other') // 'attraction' (invalide -> défaut)
 * validateSpotType(null) // 'attraction'
 */
export function validateSpotType(spotType: string | null | undefined): SpotType {
  if (!spotType) {
    return DEFAULT_SPOT_TYPE;
  }

  const normalized = spotType.toLowerCase().trim();

  if (VALID_SPOT_TYPES_SET.has(normalized)) {
    return normalized as SpotType;
  }

  return DEFAULT_SPOT_TYPE;
}

/**
 * Vérifie si un spot_type est valide.
 *
 * @param spotType - Le type de spot à vérifier
 * @returns true si valide, false sinon
 */
export function isValidSpotType(spotType: string | null | undefined): spotType is SpotType {
  if (!spotType) return false;
  return VALID_SPOT_TYPES_SET.has(spotType.toLowerCase().trim());
}

/**
 * Mapping des catégories UI vers les types DB valides.
 * Utilisé par SpotFormModal pour convertir la sélection utilisateur.
 */
export const CATEGORY_TO_SPOT_TYPE: Record<string, SpotType> = {
  food: 'restaurant',
  culture: 'attraction',
  nature: 'activite',
  shopping: 'shopping',
  nightlife: 'bar',
  other: 'attraction', // "other" n'existe pas en DB, on utilise "attraction"
};

/**
 * Mapping inverse: types DB vers catégories UI.
 */
export const SPOT_TYPE_TO_CATEGORY: Record<string, string> = {
  // Types DB valides
  restaurant: 'food',
  bar: 'nightlife',
  hotel: 'other',
  attraction: 'culture',
  activite: 'nature',
  transport: 'other',
  shopping: 'shopping',
  // Alias/legacy (pour rétrocompatibilité avec anciennes données)
  food: 'food',
  café: 'food',
  cafe: 'food',
  club: 'nightlife',
  museum: 'culture',
  monument: 'culture',
  park: 'nature',
  garden: 'nature',
  shop: 'shopping',
  market: 'shopping',
};

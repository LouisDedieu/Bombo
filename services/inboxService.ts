/**
 * services/inboxService.ts
 *
 * Gestion des jobs d'analyse dans l'inbox :
 * - Récupération des jobs
 * - Suppression de jobs
 * - Lancement d'analyses
 * - Helpers et types associés
 */

import { apiFetch, apiPost, apiDelete } from '@/lib/api';
import { JobCardStatus } from '@/components/JobCard';

// ── Types ─────────────────────────────────────────────────────────────────────

export type JobStatus = 'pending' | 'downloading' | 'analyzing' | 'done' | 'error';
export type EntityType = 'trip' | 'city';
export type Platform = 'tiktok' | 'instagram' | 'unknown';

export interface InboxJob {
  jobId: string;
  tripId: string | null;
  cityId: string | null;
  entityType: EntityType;
  title: string;
  sourceUrl: string;
  platform: Platform;
  createdAt: string;
  status: JobStatus;
  progressPct: number;
  errorMessage: string | null;
  isLocal?: boolean;
  highlightsCount?: number;
}

export interface JobCardDisplayProps {
  status: JobCardStatus;
  pillLabel: string;
  pillBackgroundColor: string;
  pillTextColor: string;
  cardBackgroundColor: string;
  iconLabel: string;
  iconLabelBackgroundColor: string;
  subtitle: string;
}

// ── Design Tokens ─────────────────────────────────────────────────────────────

export const CARD_COLORS = {
  cardDone: '#363276',
  cardTrip: '#363276',
  cardLoading: 'rgba(54, 50, 118, 0.35)',
  cardError: 'rgba(87, 41, 42, 0.19)',

  pillDone: '#142C28',
  pillLoading: '#5F57C1',
  pillError: '#732D2D',

  pillTextDone: '#79B881',
  pillTextLoading: '#CECBF5',
  pillTextError: '#CECBF5',

  iconCity: '#306A9F',
  iconTrip: '#656E57',
  iconLoading: '#5F57C1',
} as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

export function detectPlatform(url: string): Platform {
  if (/tiktok\.com/i.test(url)) return 'tiktok';
  if (/instagram\.com/i.test(url)) return 'instagram';
  return 'unknown';
}

export function isValidUrl(url: string): boolean {
  return /^https?:\/\/.+/i.test(url.trim());
}

export function formatRelativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Now';
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Hier';
  return `${days}j`;
}

export function isJobInProgress(status: JobStatus): boolean {
  return ['pending', 'downloading', 'analyzing'].includes(status);
}

// ── Job Card Mapper ───────────────────────────────────────────────────────────

export function mapJobToCardProps(job: InboxJob): JobCardDisplayProps {
  const isCity = job.entityType === 'city';
  const relativeTime = formatRelativeTime(job.createdAt);

  // Error status
  if (job.status === 'error') {
    return {
      status: 'error',
      pillLabel: 'Erreur',
      pillBackgroundColor: CARD_COLORS.pillError,
      pillTextColor: CARD_COLORS.pillTextError,
      cardBackgroundColor: CARD_COLORS.cardError,
      iconLabel: '',
      iconLabelBackgroundColor: '',
      subtitle: job.errorMessage || 'Une erreur est survenue',
    };
  }

  // Loading states
  if (isJobInProgress(job.status)) {
    const statusLabels: Record<string, string> = {
      pending: 'En attente...',
      downloading: 'Téléchargement...',
      analyzing: 'Analyse en cours...',
    };
    return {
      status: 'loading',
      pillLabel: statusLabels[job.status],
      pillBackgroundColor: CARD_COLORS.pillLoading,
      pillTextColor: CARD_COLORS.pillTextLoading,
      cardBackgroundColor: CARD_COLORS.cardLoading,
      iconLabel: isCity ? 'Ville' : 'Trip',
      iconLabelBackgroundColor: CARD_COLORS.iconLoading,
      subtitle: job.progressPct > 0 ? `${job.progressPct}%` : 'Traitement en cours...',
    };
  }

  // Done - City
  if (isCity) {
    const highlightsText = job.highlightsCount ? `${job.highlightsCount} Lieux` : '';
    return {
      status: 'done',
      pillLabel: 'Terminé ✓',
      pillBackgroundColor: CARD_COLORS.pillDone,
      pillTextColor: CARD_COLORS.pillTextDone,
      cardBackgroundColor: CARD_COLORS.cardDone,
      iconLabel: 'Ville',
      iconLabelBackgroundColor: CARD_COLORS.iconCity,
      subtitle: [highlightsText, relativeTime].filter(Boolean).join(' · '),
    };
  }

  // Done - Trip
  return {
    status: 'trip',
    pillLabel: 'Terminé ✓',
    pillBackgroundColor: CARD_COLORS.pillDone,
    pillTextColor: CARD_COLORS.pillTextDone,
    cardBackgroundColor: CARD_COLORS.cardTrip,
    iconLabel: 'Trip',
    iconLabelBackgroundColor: CARD_COLORS.iconTrip,
    subtitle: relativeTime,
  };
}

// ── API Functions ─────────────────────────────────────────────────────────────

/**
 * Récupère tous les jobs de l'inbox
 */
export async function fetchInboxJobs(): Promise<InboxJob[]> {
  return apiFetch<InboxJob[]>('/inbox');
}

/**
 * Supprime un job de l'inbox
 */
export async function deleteInboxJob(jobId: string): Promise<void> {
  return apiDelete(`/inbox/${jobId}`);
}

/**
 * Lance une nouvelle analyse pour une URL
 */
export async function startAnalysis(url: string, userId: string): Promise<void> {
  await apiPost('/analyze/url', { url, user_id: userId });
}

/**
 * Crée un job optimiste pour l'affichage immédiat
 */
export function createOptimisticJob(url: string): InboxJob {
  return {
    jobId: `optimistic-${Date.now()}`,
    tripId: null,
    cityId: null,
    entityType: 'trip',
    title: url,
    sourceUrl: url,
    platform: detectPlatform(url),
    createdAt: new Date().toISOString(),
    status: 'pending',
    progressPct: 0,
    errorMessage: null,
    isLocal: true,
  };
}

/**
 * Fusionne les jobs optimistes avec les jobs fetchés
 * Garde les optimistes récents qui ne sont pas encore dans la DB
 */
export function mergeWithOptimisticJobs(
  previousJobs: InboxJob[],
  fetchedJobs: InboxJob[],
  maxOptimisticAgeMs = 15_000
): InboxJob[] {
  const now = Date.now();
  const keepOptimistic = previousJobs.filter(
    (j) =>
      j.isLocal &&
      !fetchedJobs.some((f) => f.sourceUrl === j.sourceUrl) &&
      now - new Date(j.createdAt).getTime() < maxOptimisticAgeMs
  );
  return [...keepOptimistic, ...fetchedJobs];
}

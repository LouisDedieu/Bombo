/**
 * Design System Colors
 *
 * Ces couleurs sont synchronisées avec tailwind.config.js
 * Utiliser ces constantes pour les props JS (ex: Icon color)
 * Utiliser les classes NativeWind pour le styling (ex: text-accent)
 */

export const colors = {
  // ── Background ───────────────────────────────────────────────────────────
  bgPrimary: '#1a1744',

  // ── Accent / Brand ───────────────────────────────────────────────────────
  accent: '#5248D4',
  violet: '#5248D4',

  // ── Text Colors ──────────────────────────────────────────────────────────
  textPrimary: '#FAFAFF',
  textSecondary: 'rgba(255, 255, 255, 0.65)',
  textMuted: 'rgba(255, 255, 255, 0.60)',
  textSubtle: 'rgba(255, 255, 255, 0.30)',

  // ── Social / Links ───────────────────────────────────────────────────────
  social: '#8C92B5',

  // ── Borders / Dividers ───────────────────────────────────────────────────
  divider: 'rgba(255, 255, 255, 0.20)',

  // ── Error ────────────────────────────────────────────────────────────────
  error: '#F87171',
  errorBg: 'rgba(248, 113, 113, 0.15)',

  // ── Shadows ──────────────────────────────────────────────────────────────
  shadowDark: 'rgba(0, 0, 0, 0.25)',

  // ── Chips ───────────────────────────────────────────────────────────────
  chipBg: '#49447D',
  chipBadgeBg: '#292461',
  chipBadgeText: '#8E6DE8',
} as const;

export type ColorKey = keyof typeof colors;

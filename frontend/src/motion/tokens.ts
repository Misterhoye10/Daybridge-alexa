/**
 * Daybridge motion tokens (DESIGN.md §6) → GSAP.
 * Motion is a sentence (#5): origin, status, connection — never decoration.
 */
export const motion = {
  fast: 0.12,
  base: 0.2,
  slow: 0.32,
  /** Highlight fade on changed rows (DESIGN duration.fade) */
  fade: 1.2,
  /** ease.enter — things arriving */
  enter: 'power3.out',
  /** ease.standard */
  standard: 'power2.out',
  /** ease.exit — things leaving */
  exit: 'power2.in'
} as const;

/** Entrance distance for chat bubbles / chips (DESIGN: rise 8px) */
export const RISE_Y = 8;

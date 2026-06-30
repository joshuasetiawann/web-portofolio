// Motion primitive constants: canonical durations, easings, and stagger values.
// Single source of truth consumed by the animations/* layer and motion config.

/** Named animation durations in seconds. */
export const DURATIONS = {
  instant: 0.08,
  fast: 0.16,
  base: 0.28,
  moderate: 0.42,
  slow: 0.64,
  cinematic: 0.9,
} as const;

/** Cubic-bezier easing tuples ([x1, y1, x2, y2]) for Framer Motion. */
export const EASINGS = {
  out: [0.22, 1, 0.36, 1],
  outExpo: [0.16, 1, 0.3, 1],
  inOut: [0.83, 0, 0.17, 1],
  back: [0.34, 1.56, 0.64, 1],
} as const;

/** Stagger delays (seconds) between children in a container. */
export const STAGGER = {
  tight: 0.03,
  base: 0.06,
  loose: 0.09,
} as const;

export type DurationName = keyof typeof DURATIONS;
export type EasingName = keyof typeof EASINGS;
export type StaggerName = keyof typeof STAGGER;

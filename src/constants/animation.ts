// Motion primitive constants: canonical durations, easings, and stagger values.
// Single source of truth consumed by the animations/* layer and motion config.
// DATUM motion is mechanical and snap-precise — short durations, no spring overshoot.

/** Named animation durations in seconds. */
export const DURATIONS = {
  instant: 0.08,
  fast: 0.12,
  base: 0.15,
  moderate: 0.18,
  slow: 0.24, // page transitions
  cinematic: 0.4, // the one pinned calibration sweep
} as const;

/** Cubic-bezier easing tuples ([x1, y1, x2, y2]). */
export const EASINGS = {
  snap: [0.2, 0, 0, 1], // DATUM canonical — reveals/entrances/UI state/hover
  gantry: [0.83, 0, 0.17, 1], // scan sweeps, pinned scrubs
  linear: [0, 0, 1, 1], // paired with steps(); scrub tweens
  out: [0.22, 1, 0.36, 1], // legacy fallback
  outExpo: [0.16, 1, 0.3, 1], // legacy
  inOut: [0.83, 0, 0.17, 1], // legacy
  back: [0.34, 1.56, 0.64, 1], // retired from chrome; retained for API compatibility
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

// Easing/duration re-exports plus CSS cubic-bezier string helpers.
// Bridges the typed constant tuples to both Framer Motion and raw CSS usage.

import { DURATIONS, EASINGS } from "@/constants/animation";
import type { EasingName } from "@/constants/animation";

/** Easing tuples for Framer Motion (readonly cubic-bezier control points). */
export const EASE = EASINGS;

/** Named durations in seconds. */
export const DURATION = DURATIONS;

/** Convert a cubic-bezier tuple to a CSS `cubic-bezier(...)` string. */
export function toCssBezier(bezier: readonly [number, number, number, number]): string {
  return `cubic-bezier(${bezier[0]}, ${bezier[1]}, ${bezier[2]}, ${bezier[3]})`;
}

/** CSS cubic-bezier strings keyed by easing name, for transitions/keyframes. */
export const CSS_EASINGS = Object.fromEntries(
  (Object.keys(EASINGS) as EasingName[]).map((name) => [name, toCssBezier(EASINGS[name])]),
) as Record<EasingName, string>;

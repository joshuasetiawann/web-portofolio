// Framework-agnostic scroll math helpers (no React/Framer dependency).
// Pure functions usable by Lenis bridges, parallax layers, and scroll progress UI.

import { clamp } from "@/utils/clamp";

/**
 * Map a normalized scroll progress (0..1) to a parallax pixel offset.
 * progress 0.5 yields 0; strength scales the maximum travel in px.
 */
export function parallaxOffset(progress: number, strength: number = 100): number {
  const centered = clamp(progress, 0, 1) - 0.5;
  return centered * strength;
}

/**
 * Linear interpolation between a and b by t (t is clamped to 0..1).
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

/**
 * Normalize a value within [min, max] to a 0..1 range (clamped).
 */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

/**
 * Re-map a value from one numeric range to another (clamped to the output).
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return lerp(outMin, outMax, normalize(value, inMin, inMax));
}

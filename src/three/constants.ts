// Three.js foundation constants: DPR clamping, default camera, frameloop, and quality tiers.
// Centralized so every R3F surface shares the same performance-safe defaults.

import type { Vector3Tuple } from "three";

/** Device pixel ratio clamp range — never render below 1x nor above ~1.75x for perf. */
export const DPR_RANGE: readonly [number, number] = [1, 1.75] as const;

/** Render only on demand (invalidate) by default to conserve battery/GPU. */
export const FRAMELOOP = "demand" as const;

/** Default perspective camera configuration for R3F <Canvas camera={...}>. */
export const DEFAULT_CAMERA = {
  position: [0, 0, 6] as Vector3Tuple,
  fov: 45,
  near: 0.1,
  far: 100,
} as const;

/** Default WebGL context options — favor crisp output without premultiplied surprises. */
export const GL_DEFAULTS = {
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
  stencil: false,
  depth: true,
} as const;

/** Discrete quality tiers used to scale scene complexity by device capability. */
export const QUALITY_TIERS = {
  low: "low",
  medium: "medium",
  high: "high",
} as const;

export type QualityTier = (typeof QUALITY_TIERS)[keyof typeof QUALITY_TIERS];

/** Ordered list of tiers, lowest to highest. */
export const QUALITY_TIER_ORDER: readonly QualityTier[] = [
  QUALITY_TIERS.low,
  QUALITY_TIERS.medium,
  QUALITY_TIERS.high,
] as const;

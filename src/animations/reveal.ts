// Reveal variant presets (hidden/visible) with directional travel + optional blur.
// Consumed by the shared Reveal component for scroll/in-view entrances.

import type { Variants } from "framer-motion";
import { DURATION, EASE } from "@/animations/easings";

/** Direction a reveal travels in from. */
export type RevealDirection = "up" | "down" | "left" | "right" | "none";

interface RevealOptions {
  /** Travel direction of the hidden->visible motion. */
  direction?: RevealDirection;
  /** Pixel distance travelled (defaults to 28). */
  distance?: number;
  /** Whether to animate a 6px -> 0px blur. DATUM default: off (mechanical arrive). */
  blur?: boolean;
  /** Override duration in seconds. */
  duration?: number;
  /** Delay before the animation starts, in seconds. */
  delay?: number;
}

function offsetFor(direction: RevealDirection, distance: number): { x?: number; y?: number } {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
    case "none":
    default:
      return {};
  }
}

/**
 * Build a reveal variant with directional travel and optional blur.
 * Uses transform/opacity (+ filter when blur is enabled) only.
 */
export function createReveal(options: RevealOptions = {}): Variants {
  const {
    direction = "up",
    distance = 28,
    blur = false,
    duration = DURATION.moderate,
    delay = 0,
  } = options;

  const offset = offsetFor(direction, distance);

  return {
    hidden: {
      opacity: 0,
      ...offset,
      ...(blur ? { filter: "blur(6px)" } : {}),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      ...(blur ? { filter: "blur(0px)" } : {}),
      transition: { duration, delay, ease: EASE.snap },
    },
  };
}

/** Default upward reveal with blur. */
export const reveal: Variants = createReveal();

/** Upward reveal preset. */
export const revealUp: Variants = createReveal({ direction: "up" });

/** Downward reveal preset. */
export const revealDown: Variants = createReveal({ direction: "down" });

/** Leftward reveal preset. */
export const revealLeft: Variants = createReveal({ direction: "left" });

/** Rightward reveal preset. */
export const revealRight: Variants = createReveal({ direction: "right" });

// Reusable Framer Motion transition presets built from EASE/DURATION.
// Shared by page transitions, section reveals, and interactive springs.

import type { Transition } from "framer-motion";
import { DURATION, EASE } from "@/animations/easings";

/** Route/page-level transition. */
export const pageTransition: Transition = {
  duration: DURATION.slow,
  ease: EASE.outExpo,
};

/** Section entrance transition for in-view reveals. */
export const sectionReveal: Transition = {
  duration: DURATION.moderate,
  ease: EASE.out,
};

/** Snappy transition for small UI state changes. */
export const snappy: Transition = {
  duration: DURATION.fast,
  ease: EASE.out,
};

/** Smooth spring for magnetic / interactive elements. */
export const smoothSpring: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 28,
  mass: 0.9,
};

/** Bouncy spring for playful emphasis. */
export const bounceSpring: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 18,
  mass: 0.8,
};

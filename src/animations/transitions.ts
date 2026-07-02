// Reusable Framer Motion transition presets built from EASE/DURATION.
// DATUM: springs are banned — every preset is a snap-eased tween.

import type { Transition } from "framer-motion";
import { DURATION, EASE } from "@/animations/easings";

/** Route/page-level transition. */
export const pageTransition: Transition = {
  duration: DURATION.slow,
  ease: EASE.snap,
};

/** Section entrance transition for in-view reveals. */
export const sectionReveal: Transition = {
  duration: DURATION.moderate,
  ease: EASE.snap,
};

/** Snappy transition for small UI state changes (badges/tabs/tooltip/dropdown/toggle). */
export const snappy: Transition = {
  duration: DURATION.fast,
  ease: EASE.snap,
};

/** @deprecated Springs are banned in DATUM — aliased to a snap tween. */
export const smoothSpring: Transition = {
  duration: DURATION.moderate,
  ease: EASE.snap,
};

/** @deprecated Springs are banned in DATUM — aliased to a snap tween. */
export const bounceSpring: Transition = {
  duration: DURATION.fast,
  ease: EASE.snap,
};

// Core reusable Framer Motion variants (transform/opacity only).
// DATUM: snap easing, no scale/spring — mechanical entrances.

import type { Variants } from "framer-motion";
import { DURATION, EASE } from "@/animations/easings";
import { STAGGER } from "@/constants/animation";

/** Simple opacity fade. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE.snap },
  },
};

/** Fade while rising from below. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.moderate, ease: EASE.snap },
  },
};

/** Fade while descending from above. */
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.moderate, ease: EASE.snap },
  },
};

/** Plain fade — DATUM drops the scale (no zoom/spring). Kept for API compatibility. */
export const scaleIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE.snap },
  },
};

/**
 * Container variant factory that staggers its children's entrance.
 * @param stagger seconds between each child (defaults to STAGGER.base).
 */
export function staggerContainer(stagger: number = STAGGER.base): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: stagger,
      },
    },
  };
}

// Core reusable Framer Motion variants (transform/opacity only).
// Used across reveal, list, and container animations throughout the app.

import type { Variants } from "framer-motion";
import { DURATION, EASE } from "@/animations/easings";
import { STAGGER } from "@/constants/animation";

/** Simple opacity fade. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE.out },
  },
};

/** Fade while rising from below. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.moderate, ease: EASE.out },
  },
};

/** Fade while descending from above. */
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.moderate, ease: EASE.out },
  },
};

/** Fade with a subtle scale-up. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE.outExpo },
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

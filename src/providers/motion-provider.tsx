// Framer Motion configuration provider.
// LazyMotion injects the `domAnimation` feature set the app's `m.*` components
// need (animation, exit, in-view, hover/focus/tap) — without it, m.* renders are
// inert and content stays at its `initial` styles. `strict` blocks the heavier
// full `motion.*` API at dev time. MotionConfig honors OS reduced-motion.
"use client";

import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

// ScrollProgress: fixed top progress bar reflecting page scroll; hidden when reduced motion is preferred.
"use client";

import { m } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";

export interface ScrollProgressProps {
  className?: string;
}

export function ScrollProgress({ className }: ScrollProgressProps) {
  const reducedMotion = useReducedMotion();
  const progress = useScrollProgress();

  // Respect reduced motion: avoid a constantly moving element entirely.
  if (reducedMotion) {
    return null;
  }

  return (
    <m.div
      className={cn("fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-primary", className)}
      style={{ scaleX: progress }}
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    />
  );
}

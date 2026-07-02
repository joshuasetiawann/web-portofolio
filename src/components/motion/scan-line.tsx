// ScanLine — a one-shot orange calibration sweep. A hairline that draws across its
// container the first time it enters view (Framer, snap-eased). Decorative and
// reduced-motion safe (renders a static full-length orange rule instead of sweeping).
"use client";

import { m } from "framer-motion";

import { EASE, DURATION } from "@/animations/easings";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface ScanLineProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  /** Viewport fraction that must be visible to trigger (0..1). */
  amount?: number;
}

export function ScanLine({ orientation = "horizontal", className, amount = 0.6 }: ScanLineProps) {
  const reducedMotion = useReducedMotion();
  const horizontal = orientation === "horizontal";
  const base = cn(horizontal ? "h-px w-full origin-left" : "h-full w-px origin-top", "bg-signal");

  if (reducedMotion) {
    return <span aria-hidden="true" className={cn(base, className)} />;
  }

  return (
    <m.span
      aria-hidden="true"
      className={cn(base, className)}
      initial={horizontal ? { scaleX: 0 } : { scaleY: 0 }}
      whileInView={horizontal ? { scaleX: 1 } : { scaleY: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration: DURATION.cinematic, ease: EASE.gantry }}
    />
  );
}

// Magnetic: wraps a single interactive child so it subtly follows the pointer; disabled on touch + reduced motion.
"use client";

import { type ReactNode } from "react";
import { m } from "framer-motion";

import { useMagnetic } from "@/hooks/use-magnetic";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface MagneticProps {
  children: ReactNode;
  /** Magnetic pull strength multiplier. */
  strength?: number;
  className?: string;
}

export function Magnetic({ children, strength, className }: MagneticProps) {
  const reducedMotion = useReducedMotion();
  const isTouch = useMediaQuery("(pointer: coarse)");
  const { ref } = useMagnetic({ strength });

  // Disable the effect on touch devices and when reduced motion is requested.
  if (reducedMotion || isTouch) {
    return <span className={cn("inline-block", className)}>{children}</span>;
  }

  return (
    <m.span ref={ref} className={cn("inline-block", className)}>
      {children}
    </m.span>
  );
}

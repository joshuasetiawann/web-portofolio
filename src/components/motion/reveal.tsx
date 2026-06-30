// Reveal: animates children into view with a fadeInUp; instant when reduced motion is preferred.
"use client";

import { type ReactNode } from "react";
import { m } from "framer-motion";

import { fadeInUp } from "@/animations/variants";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay (in seconds) before the reveal animation starts. */
  delay?: number;
  /** Only animate the first time the element enters the viewport. */
  once?: boolean;
  /** Fraction of the element that must be visible to trigger (0..1). */
  amount?: number;
}

export function Reveal({ children, className, delay = 0, once = true, amount = 0.3 }: RevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={cn(className)}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ delay }}
    >
      {children}
    </m.div>
  );
}

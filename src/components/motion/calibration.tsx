// Calibration — the one-per-route "power-on" moment. When the wrapped block scrolls
// into view, a single orange scan band sweeps through it once (GSAP + ScrollTrigger,
// slaved to Lenis, never re-fires on scroll-up). Reduced motion renders nothing extra;
// the wrapped content is the default SSR DOM, never gated behind motion.
"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { getGsap } from "@/lib/motion/gsap";
import { useLenis } from "@/hooks/use-lenis";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface CalibrationProps {
  children: ReactNode;
  className?: string;
  /** ScrollTrigger start position (default "top 75%"). */
  start?: string;
}

export function Calibration({ children, className, start = "top 75%" }: CalibrationProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const scope = scopeRef.current;
    const scan = scanRef.current;
    if (!scope || !scan || reducedMotion) return;

    const { gsap, ScrollTrigger } = getGsap();
    const onScroll = () => ScrollTrigger.update();
    lenis?.on("scroll", onScroll);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        scan,
        { yPercent: -120, opacity: 0.9 },
        {
          yPercent: 220,
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          scrollTrigger: { trigger: scope, start, toggleActions: "play none none none" },
        },
      );
    }, scope);

    return () => {
      lenis?.off("scroll", onScroll);
      ctx.revert();
    };
  }, [lenis, reducedMotion, start]);

  return (
    <div ref={scopeRef} className={cn("relative overflow-hidden", className)}>
      <span
        ref={scanRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-transparent via-signal/25 to-transparent opacity-0"
      />
      {children}
    </div>
  );
}

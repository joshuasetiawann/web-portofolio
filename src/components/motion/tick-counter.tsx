// TickCounter — a stepped, instrument-style count-up. Animates once when scrolled
// into view via a short bounded rAF (not a persistent loop). Renders tabular mono so
// width never jitters. Reduced motion shows the final value immediately.
"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface TickCounterProps {
  value: number;
  from?: number;
  steps?: number;
  durationMs?: number;
  format?: (n: number) => string;
  className?: string;
}

export function TickCounter({
  value,
  from = 0,
  steps = 24,
  durationMs = 400,
  format,
  className,
}: TickCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(from);
  const played = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || played.current) continue;
          played.current = true;
          io.disconnect();
          const start = performance.now();
          const run = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs);
            const stepped = Math.round(t * steps) / steps;
            setDisplay(Math.round(from + (value - from) * stepped));
            if (t < 1) raf = requestAnimationFrame(run);
            else setDisplay(value);
          };
          raf = requestAnimationFrame(run);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, from, steps, durationMs, reducedMotion]);

  return (
    <span ref={ref} className={cn("tabular", className)}>
      {format ? format(display) : display}
    </span>
  );
}

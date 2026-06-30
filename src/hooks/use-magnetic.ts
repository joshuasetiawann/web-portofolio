// Magnetic pointer effect foundation: translates an element toward the cursor
// while it is within `radius`. Respects reduced motion and only runs on fine pointers.
"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface UseMagneticOptions {
  /** Fraction of the cursor offset applied as translation (0..1). */
  strength?: number;
  /** Activation radius in pixels around the element center. */
  radius?: number;
}

export function useMagnetic<T extends HTMLElement = HTMLElement>(options: UseMagneticOptions = {}) {
  const { strength = 0.35, radius = 120 } = options;
  const ref = useRef<T | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    if (typeof window === "undefined" || !window.matchMedia) return;
    // Pointer-fine only: skip touch / coarse pointer devices.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;

    const reset = () => {
      el.style.transform = "translate3d(0, 0, 0)";
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const within = Math.hypot(dx, dy) <= radius;

      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = within
          ? `translate3d(${dx * strength}px, ${dy * strength}px, 0)`
          : "translate3d(0, 0, 0)";
      });
    };

    const onPointerLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(reset);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    el.addEventListener("pointerleave", onPointerLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      reset();
    };
  }, [radius, strength, reducedMotion]);

  return { ref };
}

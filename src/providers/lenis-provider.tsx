// Provides a Lenis smooth-scroll instance via React context.
// Skips initialization entirely when reduced motion is preferred. The exported
// LenisContext is consumed by the use-lenis hook.
"use client";

import Lenis from "lenis";
import { createContext, useEffect, useState, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

export const LenisContext = createContext<Lenis | null>(null);

export function LenisProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    // Geared, not floaty — a higher lerp makes scroll feel mechanical (DATUM).
    const instance = new Lenis({
      lerp: 0.14,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- store the externally-created Lenis instance so it propagates through context
    setLenis(instance);

    // Bridge Lenis' internal loop onto requestAnimationFrame.
    let frame = 0;
    const raf = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      setLenis(null);
    };
  }, [reducedMotion]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

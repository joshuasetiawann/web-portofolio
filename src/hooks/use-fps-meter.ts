// Samples the live frame rate for the instrument StatusBar. Returns null under
// reduced motion (telemetry reads "—") and pauses while the tab is hidden.
// Updates state at most once per second to stay off the hot path.
"use client";

import { useEffect, useState } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function useFpsMeter(): number | null {
  const reducedMotion = useReducedMotion();
  const [fps, setFps] = useState<number | null>(null);

  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") return;

    let raf = 0;
    let frames = 0;
    let last = performance.now();
    let stopped = false;

    const loop = (now: number) => {
      if (stopped) return;
      frames += 1;
      const elapsed = now - last;
      if (elapsed >= 1000) {
        setFps(Math.round((frames * 1000) / elapsed));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (stopped) return;
      last = performance.now();
      frames = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    document.addEventListener("visibilitychange", onVisibility);
    if (!document.hidden) start();

    return () => {
      stopped = true;
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion]);

  return reducedMotion ? null : fps;
}

// Tracks vertical page scroll progress as a 0..1 value.
// Uses a passive scroll listener throttled to a single rAF frame per tick.
"use client";

import { useEffect, useState } from "react";

import { clamp } from "@/utils/clamp";

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollTop = window.scrollY ?? doc.scrollTop;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? clamp(scrollTop / max, 0, 1) : 0);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return progress;
}

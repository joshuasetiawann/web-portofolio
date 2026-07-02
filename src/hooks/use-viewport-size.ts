// Live viewport size for the hero telemetry readout. useSyncExternalStore keeps a
// stable snapshot (same object reference until the size actually changes) and returns
// zeros on the server so the first client paint has fixed-width slots (no CLS).
"use client";

import { useSyncExternalStore } from "react";

export interface ViewportSize {
  w: number;
  h: number;
}

let cache: ViewportSize = { w: 0, h: 0 };

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("resize", callback, { passive: true });
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot(): ViewportSize {
  if (typeof window === "undefined") return cache;
  if (cache.w !== window.innerWidth || cache.h !== window.innerHeight) {
    cache = { w: window.innerWidth, h: window.innerHeight };
  }
  return cache;
}

function getServerSnapshot(): ViewportSize {
  return { w: 0, h: 0 };
}

export function useViewportSize(): ViewportSize {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

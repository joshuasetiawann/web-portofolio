// Resolves the effective reduced-motion preference.
// "reduced" forces true, "full" forces false, "system" follows the OS media query.
// The OS preference is read via useSyncExternalStore (no setState-in-effect).
"use client";

import { useSyncExternalStore } from "react";

import { useUIStore } from "@/stores/ui-store";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  const motionPreference = useUIStore((state) => state.motionPreference);
  const systemReduced = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (motionPreference === "reduced") return true;
  if (motionPreference === "full") return false;
  return systemReduced;
}

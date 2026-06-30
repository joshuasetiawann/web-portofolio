// Reads the active Lenis smooth-scroll instance from the LenisProvider context.
// Returns null when smooth scrolling is disabled (e.g. reduced motion) or unmounted.
"use client";

import { useContext } from "react";
import type Lenis from "lenis";

import { LenisContext } from "@/providers/lenis-provider";

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

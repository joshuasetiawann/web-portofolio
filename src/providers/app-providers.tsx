// Root client provider composition for the application.
// Order: Theme > Motion > Tooltip > Lenis, with a global Toaster.
// (No data-fetching provider: the only live data — GitHub — is fetched server-side
// with ISR, which is faster and SEO-friendly, so TanStack Query is not needed.)
"use client";

import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LenisProvider } from "@/providers/lenis-provider";
import { MotionProvider } from "@/providers/motion-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MotionProvider>
        <TooltipProvider>
          <LenisProvider>
            {children}
            <Toaster />
          </LenisProvider>
        </TooltipProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}

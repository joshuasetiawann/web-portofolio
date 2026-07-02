// Root client provider composition for the application.
// Order: Theme > Motion > Tooltip > Lenis > Gutter, with a global Toaster.
// The fixed instrument StatusBar is DATUM chrome and lives in the (site)
// layout — the (home) landing scene has its own chrome.
// (No data-fetching provider: the only live data — GitHub — is fetched server-side
// with ISR, which is faster and SEO-friendly, so TanStack Query is not needed.)
"use client";

import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GutterProvider } from "@/components/layout/gutter-context";
import { LenisProvider } from "@/providers/lenis-provider";
import { MotionProvider } from "@/providers/motion-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MotionProvider>
        <TooltipProvider>
          <LenisProvider>
            <GutterProvider>{children}</GutterProvider>
            <Toaster />
          </LenisProvider>
        </TooltipProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}

// Root client provider composition for the application.
// Order: Theme > Motion > Tooltip > Lenis > Gutter, with a global Toaster and the
// fixed instrument StatusBar (inside GutterProvider so it can read section state).
// (No data-fetching provider: the only live data — GitHub — is fetched server-side
// with ISR, which is faster and SEO-friendly, so TanStack Query is not needed.)
"use client";

import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GutterProvider } from "@/components/layout/gutter-context";
import { StatusBar } from "@/components/layout/status-bar";
import { LenisProvider } from "@/providers/lenis-provider";
import { MotionProvider } from "@/providers/motion-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MotionProvider>
        <TooltipProvider>
          <LenisProvider>
            <GutterProvider>
              {children}
              <StatusBar />
            </GutterProvider>
            <Toaster />
          </LenisProvider>
        </TooltipProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}

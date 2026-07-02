// Home route group — the SIGNAL landing scene (design baru handoff).
// Loads its own voices (Space Grotesk + Geist) so the DATUM routes never pay
// for them, and scopes the scene tokens via the `.landing` wrapper.
import type { Viewport } from "next";
import { Geist, Space_Grotesk } from "next/font/google";

import { LandingScene } from "@/components/landing/landing-scene";
import "@/styles/landing.css";

const fontSg = Space_Grotesk({
  variable: "--font-sg",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const fontGeist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

// The scene is always dark, regardless of the site theme toggle.
export const viewport: Viewport = {
  themeColor: "#05070d",
  colorScheme: "dark",
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <LandingScene className={`${fontSg.variable} ${fontGeist.variable}`}>{children}</LandingScene>
  );
}

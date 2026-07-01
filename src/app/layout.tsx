import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AppProviders } from "@/providers/app-providers";
import { rootMetadata } from "@/lib/metadata";
import "@/styles/globals.css";

// DATUM display voice — oversized marks only. Archivo's variable width axis
// (wdth) drives the "expanded" look via font-variation-settings on `.font-display`.
const fontDisplay = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  preload: true,
  fallback: ["Arial Narrow", "system-ui", "sans-serif"],
});

// DATUM reading voice — prose + UI.
const fontSans = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

// DATUM connective voice — labels, indices, coordinates, timestamps, numerals.
const fontMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

// <pre>/<code> only; below the fold, not preloaded.
const fontCode = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0f" },
    { media: "(prefers-color-scheme: light)", color: "#edebe3" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable} ${fontCode.variable}`}
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

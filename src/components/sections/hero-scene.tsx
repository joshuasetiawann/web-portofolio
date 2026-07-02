"use client";

// Framed WebGL window for the landing hero (DATUM Calibration Field). Renders the
// oscilloscope trace on capable devices over a CSS graph-paper backdrop, with a mono
// telemetry overlay; falls back to a static SVG poster otherwise. Point count scales
// down on small screens. Decorative only — the hero copy/<h1> lives in the DOM.

import dynamic from "next/dynamic";

import { SceneCanvas } from "@/components/three/scene-canvas";
import { HeroPoster } from "@/components/sections/hero-poster";
import { HeroTelemetry } from "@/components/sections/hero-telemetry";
import { useMediaQuery } from "@/hooks/use-media-query";

// Lazy-load the scene so three/@react-three/fiber stay OUT of the landing first-load
// bundle — they download only when the canvas actually mounts.
const CalibrationField = dynamic(
  () => import("@/three/scenes/signal-field").then((m) => m.CalibrationField),
  { ssr: false },
);

export function HeroScene() {
  const isSmall = useMediaQuery("(max-width: 640px)");

  return (
    <div
      aria-hidden
      className="relative aspect-square w-full overflow-hidden border border-border bg-surface-1"
    >
      {/* Graph-paper backdrop (pure CSS, masked). */}
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(var(--rule)_1px,transparent_1px),linear-gradient(90deg,var(--rule)_1px,transparent_1px)] [mask-image:radial-gradient(72%_72%_at_50%_45%,black,transparent)] [background-size:32px_32px] opacity-60" />

      <SceneCanvas className="absolute inset-0" poster={<HeroPoster />}>
        <CalibrationField count={isSmall ? 900 : 1600} />
      </SceneCanvas>

      <HeroTelemetry />

      <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 font-mono text-mono-label tracking-wider text-foreground-subtle uppercase">
        Fig. 00 · Calibration Field
      </div>
    </div>
  );
}

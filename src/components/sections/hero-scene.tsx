"use client";

// Framed WebGL window for the landing hero. Renders the Signal Field on capable
// devices, a graceful gradient poster otherwise. Point count scales down on small
// screens. Decorative only — carries no information (the hero copy lives in the DOM).

import dynamic from "next/dynamic";

import { SceneCanvas } from "@/components/three/scene-canvas";
import { useMediaQuery } from "@/hooks/use-media-query";

// Lazy-load the scene so `three`/@react-three/fiber stay OUT of the landing
// first-load bundle — they download only when the canvas actually mounts.
const SignalField = dynamic(
  () => import("@/three/scenes/signal-field").then((m) => m.SignalField),
  { ssr: false },
);

export function HeroScene() {
  const isSmall = useMediaQuery("(max-width: 640px)");

  return (
    <div
      aria-hidden
      className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-surface-1"
    >
      <SceneCanvas
        className="absolute inset-0"
        poster={
          <>
            <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_70%_20%,color-mix(in_oklab,var(--color-primary)_28%,transparent),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_90%,color-mix(in_oklab,var(--color-accent-2)_22%,transparent),transparent_60%)]" />
          </>
        }
      >
        <SignalField count={isSmall ? 1600 : 3800} />
      </SceneCanvas>

      <div className="pointer-events-none absolute inset-0 ring-1 ring-border/50 ring-inset" />
      <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] tracking-widest text-foreground-subtle uppercase">
        signal field
      </div>
    </div>
  );
}

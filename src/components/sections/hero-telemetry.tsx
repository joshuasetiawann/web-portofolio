// Hero telemetry — a decorative mono readout layered over the Calibration Field.
// Real values (viewport, scroll fraction, commit ref, FPS); fixed-width slots so it
// never shifts. Inert (aria-hidden, pointer-events-none). FPS reads "——" under
// reduced motion (the meter is suppressed there).
"use client";

import { useFpsMeter } from "@/hooks/use-fps-meter";
import { useMounted } from "@/hooks/use-mounted";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { useViewportSize } from "@/hooks/use-viewport-size";

const REF = process.env.NEXT_PUBLIC_COMMIT_SHA ?? "unknown";

export function HeroTelemetry() {
  const { w, h } = useViewportSize();
  const y = useScrollProgress();
  const fps = useFpsMeter();
  const mounted = useMounted();

  const vp = mounted && w ? `${w}×${h}` : "----×----";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 font-mono tabular text-mono-meta text-foreground-subtle"
    >
      <span className="absolute top-3 left-3">VP {vp}</span>
      <span className="absolute top-3 right-3">
        Y <span className="text-signal">{y.toFixed(2)}</span>
      </span>
      <span className="absolute bottom-3 left-3">REF {REF}</span>
      <span className="absolute right-3 bottom-3">FPS {fps === null ? "——" : fps}</span>
    </div>
  );
}

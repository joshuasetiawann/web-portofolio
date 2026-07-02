// Visible "Pause motion" control (the brand's a11y stance): freezes the signal
// field, marquee, and reveals scene-wide via the LandingScene switch. Hidden
// when the system already prefers reduced motion — everything is static then.
"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useLandingMotion } from "./landing-scene";

export function MotionToggle() {
  const { paused, setPaused } = useLandingMotion();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <button
      type="button"
      className="font-gm fixed bottom-5 left-5 z-40 inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-[rgba(var(--header-rgb),0.6)] px-3.5 py-2 text-[11px] tracking-[0.08em] text-foreground-muted uppercase backdrop-blur-md transition-colors hover:border-border-strong hover:text-foreground"
      aria-pressed={paused}
      onClick={() => setPaused(!paused)}
    >
      <span
        className={`size-1.5 rounded-full ${paused ? "bg-foreground-subtle" : "bg-accent-2"}`}
        aria-hidden="true"
      />
      {paused ? "Play motion" : "Pause motion"}
    </button>
  );
}

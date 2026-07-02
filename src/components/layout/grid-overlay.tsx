// DATUM GridOverlay — the page admits its own N-column grid. Pure CSS via a single
// repeating-linear-gradient (no per-column DOM, no CLS). Decorative and inert.
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface GridOverlayProps {
  cols?: number;
  className?: string;
}

export function GridOverlay({ cols = 12, className }: GridOverlayProps) {
  const style = {
    backgroundImage:
      "repeating-linear-gradient(to right, var(--rule) 0, var(--rule) 1px, transparent 1px, transparent calc(100% / var(--grid-cols)))",
    opacity: 0.5,
    "--grid-cols": cols,
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      role="presentation"
      className={cn("pointer-events-none select-none", className)}
      style={style}
    />
  );
}

// CoverPlate — the one sanctioned stand-in for a missing cover/media image: a filed
// instrument plate (graphite grid, corner reticle ticks, centred filing index) so every
// project reads as deliberately catalogued instead of broken. Decorative only — the
// accessible name lives on the surrounding card/figure.

interface CoverPlateProps {
  /** Filing prefix, e.g. "PRJ" for projects, "FIG" for case-study media. */
  prefix: string;
  index: number;
  /** Small uppercase caption under the index, e.g. the project category. */
  label?: string;
}

const TICK_POSITIONS = [
  "top-3 left-3 border-t border-l",
  "top-3 right-3 border-t border-r",
  "bottom-3 left-3 border-b border-l",
  "bottom-3 right-3 border-b border-r",
] as const;

export function CoverPlate({ prefix, index, label }: CoverPlateProps) {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center bg-surface-1 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:32px_32px]"
    >
      {TICK_POSITIONS.map((position) => (
        <span key={position} className={`absolute size-3 border-border-strong ${position}`} />
      ))}
      <div className="flex flex-col items-center gap-1.5 border border-border bg-background px-5 py-3">
        <span className="font-mono tabular text-lg tracking-widest text-foreground-muted">
          {prefix}-{String(index).padStart(3, "0")}
        </span>
        {label ? (
          <span className="font-mono text-[10px] tracking-[0.2em] text-foreground-subtle uppercase">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}

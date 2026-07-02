// LoadingState — DATUM instrument loader: a mono "ACQUIRING" readout over a pulsing
// orange hairline (no spinner). Pulse is motion-safe; screen readers get a polite label.
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({ label = "Acquiring…", className }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 text-foreground-muted",
        className,
      )}
    >
      <span aria-hidden="true" className="block h-px w-10 bg-signal motion-safe:animate-pulse" />
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="font-mono text-xs tracking-wider uppercase">
        {label}
      </span>
    </div>
  );
}

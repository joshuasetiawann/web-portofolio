// AvailabilityBadge — status pill with a reduced-motion-safe pulsing dot.
import { cn } from "@/lib/utils";

interface AvailabilityBadgeProps {
  available?: boolean;
  label?: string;
  className?: string;
}

export function AvailabilityBadge({ available = true, label, className }: AvailabilityBadgeProps) {
  const text = label ?? (available ? "Available for work" : "Currently unavailable");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-surface-1 px-3 py-1 text-sm font-medium text-foreground",
        className,
      )}
    >
      <span className="relative flex size-2.5 shrink-0" aria-hidden="true">
        {available ? (
          <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 motion-safe:animate-ping" />
        ) : null}
        <span
          className={cn(
            "relative inline-flex size-2.5 rounded-full",
            available ? "bg-success" : "bg-foreground-subtle",
          )}
        />
      </span>
      {text}
    </span>
  );
}

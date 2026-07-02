// AvailabilityBadge — DATUM status chip: hairline, square, mono. A static square tick
// (no continuous ping) signals state; the label carries meaning (never colour alone).
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
        "inline-flex items-center gap-2 border border-border px-2.5 py-1 font-mono text-xs tracking-wider text-foreground-muted uppercase",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 shrink-0", available ? "bg-signal" : "bg-foreground-subtle")}
      />
      {text}
    </span>
  );
}

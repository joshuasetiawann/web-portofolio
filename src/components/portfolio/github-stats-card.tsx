// Compact GitHub statistic tile (label + value + optional icon) for the GitHub activity section.
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";

interface GitHubStatsCardProps {
  label: string;
  value: string;
  icon?: string;
}

export function GitHubStatsCard({ label, value, icon }: GitHubStatsCardProps) {
  const Icon = getIcon(icon);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border bg-surface-1 p-5",
        "transition-all hover:-translate-y-0.5 hover:border-border-strong",
      )}
    >
      <div className="flex items-center gap-2 text-foreground-muted">
        {Icon ? (
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-lg bg-surface-2 text-primary"
          >
            <Icon className="size-4" />
          </span>
        ) : null}
        <span className="text-xs font-medium tracking-wide text-foreground-subtle uppercase">
          {label}
        </span>
      </div>
      <p className="font-display text-2xl font-semibold text-foreground tabular-nums">{value}</p>
    </div>
  );
}

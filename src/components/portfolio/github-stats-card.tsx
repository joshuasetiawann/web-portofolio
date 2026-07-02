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
        "flex flex-col gap-3 rounded-none border border-border p-5",
        "transition-colors hover:border-border-strong",
      )}
    >
      <div className="flex items-center gap-2 text-foreground-muted">
        {Icon ? (
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-none border border-border text-foreground-subtle"
          >
            <Icon className="size-4" />
          </span>
        ) : null}
        <span className="font-mono text-mono-label text-foreground-subtle uppercase">{label}</span>
      </div>
      <p className="font-mono tabular text-mono-metric text-foreground">{value}</p>
    </div>
  );
}

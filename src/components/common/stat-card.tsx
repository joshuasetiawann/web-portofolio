// StatCard — compact metric tile with optional icon, value, label and supporting description.
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon?: string;
  description?: string;
  className?: string;
}

export function StatCard({ label, value, icon, description, className }: StatCardProps) {
  const Icon = getIcon(icon);

  return (
    <div className={cn("group border border-border p-5 sm:p-6", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-mono-label text-foreground-subtle uppercase">{label}</p>
        {Icon ? (
          <span
            className="flex size-8 shrink-0 items-center justify-center border border-border text-foreground-subtle"
            aria-hidden="true"
          >
            <Icon className="size-4" />
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-display tabular text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {value}
      </p>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{description}</p>
      ) : null}
    </div>
  );
}

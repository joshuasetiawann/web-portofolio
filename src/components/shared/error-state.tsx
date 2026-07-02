// Presentational error block (icon + message + optional action) for failed/rate-limited data fetches.
import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content right now. Please try again in a moment.",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-4 border border-border px-6 py-12 text-center",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center border border-destructive/40 text-destructive"
      >
        <AlertTriangle className="size-6" />
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="font-display text-base font-semibold text-foreground">{title}</p>
        {description ? (
          <p className="mx-auto max-w-prose text-sm text-foreground-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}

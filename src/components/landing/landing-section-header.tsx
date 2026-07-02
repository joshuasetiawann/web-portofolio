// Landing section header: gradient-diamond eyebrow + balanced H2, with an
// optional trailing action pill — the recurring header of every scene section.
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function LandingSectionHeader({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-[22px] gap-y-5", className)}>
      <div className="max-w-[640px]">
        <div className="l-section-eyebrow">
          <span className="l-diamond rounded-[1px]" aria-hidden="true" />
          {eyebrow}
        </div>
        <h2 className="l-section-title">{title}</h2>
      </div>
      {action}
    </div>
  );
}

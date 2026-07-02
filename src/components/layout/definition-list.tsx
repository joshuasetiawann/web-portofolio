// DATUM DefinitionList — data-as-decoration primitive. `rows` = spec-header ledger
// (mono field / value, hairline between rows); `grid` = metric tiles (hairline block/inline
// start, no boxes). Semantic <dl>.
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Rule } from "@/components/layout/rule";

export interface DefinitionItem {
  field: string;
  value: ReactNode;
  /** Render the value in tabular mono (metrics, counts, coordinates). */
  numeric?: boolean;
}

interface DefinitionListProps {
  items: DefinitionItem[];
  layout?: "rows" | "grid";
  dense?: boolean;
  rule?: boolean;
  className?: string;
}

export function DefinitionList({
  items,
  layout = "rows",
  dense = false,
  rule = true,
  className,
}: DefinitionListProps) {
  if (layout === "grid") {
    return (
      <dl className={cn("grid grid-cols-2 md:grid-cols-4", className)}>
        {items.map((item) => (
          <div
            key={item.field}
            className="flex flex-col gap-1.5 border-t border-l border-border py-4 pl-4"
          >
            <dt className="font-mono text-mono-label text-foreground-subtle uppercase">
              {item.field}
            </dt>
            <dd className="font-mono tabular text-mono-metric text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <dl className={className}>
      {items.map((item, i) => (
        <div key={item.field}>
          {rule && i > 0 ? <Rule /> : null}
          <div
            className={cn(
              "grid grid-cols-[minmax(9rem,12rem)_1fr] items-baseline gap-x-6",
              dense ? "py-2" : "py-3",
            )}
          >
            <dt className="font-mono text-mono-label text-foreground-subtle uppercase">
              {item.field}
            </dt>
            <dd
              className={cn(item.numeric ? "font-mono tabular text-foreground" : "text-foreground")}
            >
              {item.value}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

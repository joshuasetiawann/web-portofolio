// ExperienceCard — a single role entry: title, company, date range, location, summary, highlights, and tech stack.
import { MapPin } from "lucide-react";

import { TechStackList } from "@/components/portfolio/tech-stack-list";
import type { ExperienceItem } from "@/data/experience";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";

interface ExperienceCardProps {
  item: ExperienceItem;
}

function formatPeriod(value: string): string {
  if (value.trim().toLowerCase() === "present") return "Present";
  return formatDate(value, { month: "short", year: "numeric" }) || value;
}

export function ExperienceCard({ item }: ExperienceCardProps) {
  const start = formatPeriod(item.start);
  const end = formatPeriod(item.end);

  return (
    <article
      className={cn(
        "group flex h-full flex-col gap-4 border border-border p-6",
        "transition-colors hover:border-border-strong",
      )}
    >
      <header className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-2 size-2.5 shrink-0 border border-border-strong" />
          <div className="min-w-0">
            <h3 className="font-display text-lg leading-snug font-semibold text-foreground transition-colors group-hover:text-signal">
              {item.role}
            </h3>
            <p className="text-sm text-foreground-muted">{item.company}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-mono-meta tracking-wide text-foreground-subtle uppercase">
          <span className="tabular" aria-label={`From ${start} to ${end}`}>
            {start} <span aria-hidden="true">–</span> {end}
          </span>
          {item.location ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" aria-hidden="true" />
              {item.location}
            </span>
          ) : null}
        </div>
      </header>

      <p className="text-sm text-foreground-muted">{item.summary}</p>

      {item.highlights.length > 0 ? (
        <ul className="flex flex-col gap-1.5">
          {item.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2.5 text-sm text-foreground-muted">
              <span aria-hidden="true" className="mt-2.5 h-px w-2.5 shrink-0 bg-signal" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {item.stack.length > 0 ? <TechStackList stack={item.stack} className="mt-auto pt-1" /> : null}
    </article>
  );
}

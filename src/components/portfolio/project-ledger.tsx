// ProjectLedger — client island: a mono category filter over the DATUM project ledger.
// Keeps the projects route an RSC (for metadata) while restoring interactive filtering,
// rendered as LedgerRows (not cards). A live count reads out as an instrument value.
"use client";

import { useMemo, useState } from "react";

import { LedgerList, LedgerRow } from "@/components/layout/ledger-row";
import type { Project } from "@/types/project";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const ALL = "All";

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  archived: "Archived",
  wip: "In progress",
};

interface ProjectLedgerProps {
  projects: Project[];
  categories: string[];
}

export function ProjectLedger({ projects, categories }: ProjectLedgerProps) {
  const [selected, setSelected] = useState<string>(ALL);
  const chips = useMemo(() => [ALL, ...categories], [categories]);
  const filtered = useMemo(
    () =>
      selected === ALL ? projects : projects.filter((project) => project.category === selected),
    [projects, selected],
  );

  return (
    <div className="space-y-6">
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const active = chip === selected;
          return (
            <button
              key={chip}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(chip)}
              className={cn(
                "inline-flex min-h-9 items-center gap-2 border px-4 py-1.5 font-mono text-xs tracking-wide uppercase transition-colors focus-visible:border-primary focus-visible:outline-none",
                active
                  ? "border-primary text-primary"
                  : "border-border text-foreground-muted hover:border-border-strong hover:text-foreground",
              )}
            >
              <span
                aria-hidden="true"
                className={cn("block h-3 w-px", active ? "bg-signal" : "bg-transparent")}
              />
              {chip}
            </button>
          );
        })}
      </div>

      <p
        aria-live="polite"
        className="font-mono text-xs tracking-wide text-foreground-subtle uppercase"
      >
        Showing{" "}
        <span className="tabular text-foreground">{String(filtered.length).padStart(2, "0")}</span>{" "}
        / <span className="tabular">{String(projects.length).padStart(2, "0")}</span>
      </p>

      <LedgerList
        label="Projects"
        header={
          <>
            <span className="w-16 shrink-0">Index</span>
            <span className="min-w-0 flex-1">Project · Stack · Year · Role</span>
            <span className="hidden md:block">Category · Status</span>
            <span>Metric</span>
          </>
        }
      >
        {filtered.map((project) => {
          const firstMetric = project.metrics?.[0];
          return (
            <LedgerRow
              key={project.slug}
              prefix="PRJ"
              index={project.order}
              title={project.title}
              href={`${ROUTES.projects}/${project.slug}`}
              coordinate={`${project.category} · ${STATUS_LABEL[project.status] ?? project.status}`}
              specs={[project.stack.join(" / "), String(project.year), project.role]}
              metric={firstMetric ? { value: firstMetric.value } : undefined}
            />
          );
        })}
      </LedgerList>
    </div>
  );
}

// Client-side category filter: a chip row (All + categories) that narrows the ProjectGrid.
"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { FolderGit2 } from "lucide-react";

import { ProjectCard } from "@/components/portfolio/project-card";
import { ProjectGrid } from "@/components/portfolio/project-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { DURATION, EASE } from "@/animations/easings";
import { STAGGER } from "@/constants/animation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";

interface ProjectFilterProps {
  projects: Project[];
  categories: string[];
}

const ALL = "All";

// How many entering cards share the staggered ramp before the delay caps out.
const MAX_STAGGER_STEPS = 6;

export function ProjectFilter({ projects, categories }: ProjectFilterProps) {
  const [selected, setSelected] = useState<string>(ALL);
  const reducedMotion = useReducedMotion();

  const chips = useMemo(() => [ALL, ...categories], [categories]);

  const filtered = useMemo(
    () =>
      selected === ALL ? projects : projects.filter((project) => project.category === selected),
    [projects, selected],
  );

  return (
    <div className="space-y-8">
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const isActive = chip === selected;
          return (
            <button
              key={chip}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelected(chip)}
              className={cn(
                "inline-flex min-h-9 items-center rounded-full border px-4 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                isActive
                  ? "border-primary bg-primary font-semibold text-primary-foreground ring-2 ring-ring/40"
                  : "border-border bg-surface-1 font-medium text-foreground-muted hover:border-border-strong hover:text-foreground",
              )}
            >
              {chip}
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {filtered.length} project{filtered.length === 1 ? "" : "s"} shown
      </p>

      {filtered.length > 0 ? (
        reducedMotion ? (
          // Reduced motion: instant reorder via the unanimated grid (content fully visible).
          <ProjectGrid projects={filtered} />
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* popLayout pulls exiting cards out of flow so survivors glide to their new slots. */}
            <AnimatePresence mode="popLayout" initial={false}>
              {filtered.map((project, index) => (
                <m.li
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: {
                      duration: DURATION.base,
                      ease: [...EASE.out],
                      delay: Math.min(index, MAX_STAGGER_STEPS) * STAGGER.tight,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                    transition: { duration: DURATION.fast, ease: [...EASE.out] },
                  }}
                  transition={{ layout: { duration: DURATION.base, ease: [...EASE.out] } }}
                  className="flex"
                >
                  <div className="flex w-full">
                    <ProjectCard project={project} />
                  </div>
                </m.li>
              ))}
            </AnimatePresence>
          </ul>
        )
      ) : (
        <EmptyState
          icon={FolderGit2}
          title="No projects in this category"
          description="Try a different category or view all projects."
        />
      )}
    </div>
  );
}

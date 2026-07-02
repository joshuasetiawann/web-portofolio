// Compact project card linking to a case-study page; flat graphite grid cover placeholder when no cover image.
"use client";

import Image from "next/image";
import Link from "next/link";
import { m, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { DURATION, EASE } from "@/animations/easings";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

const MAX_TAGS = 3;

// Motion-enabled Link so whileHover/whileFocus propagate the cover zoom to the real interactive element.
const MotionLink = m.create(Link);

// Cover gently scales within the overflow-clipped frame (transform only).
const coverVariants: Variants = {
  rest: { scale: 1, transition: { duration: DURATION.base, ease: [...EASE.out] } },
  active: { scale: 1.03, transition: { duration: DURATION.slow, ease: [...EASE.out] } },
};

export function ProjectCard({ project }: ProjectCardProps) {
  const reducedMotion = useReducedMotion();
  const isTouch = useMediaQuery("(pointer: coarse)");
  // Motion (transforms) only for hover-capable pointers with motion allowed; otherwise color/border only.
  const interactive = !reducedMotion && !isTouch;

  const tags = project.tags.slice(0, MAX_TAGS);
  const extraTags = project.tags.length - tags.length;

  return (
    <MotionLink
      href={`/projects/${project.slug}`}
      className="group relative flex h-full flex-col overflow-hidden border border-border transition-colors hover:border-border-strong focus-visible:border-primary focus-visible:outline-none"
      initial={interactive ? "rest" : undefined}
      animate={interactive ? "rest" : undefined}
      whileHover={interactive ? "active" : undefined}
      whileFocus={interactive ? "active" : undefined}
    >
      {/* Cover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <m.div variants={interactive ? coverVariants : undefined} className="absolute inset-0">
          {project.cover ? (
            <Image
              src={project.cover}
              alt={`${project.title} cover`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="h-full w-full border border-border bg-surface-1 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:28px_28px]"
            />
          )}
        </m.div>

        <span className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-none border border-border bg-background text-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-focus-visible:border-primary group-focus-visible:bg-primary group-focus-visible:text-primary-foreground">
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary">{project.category}</Badge>
          <span className="font-mono tabular text-xs tracking-wide text-foreground-subtle uppercase">
            {project.year}
          </span>
        </div>

        <h3 className="font-display text-lg leading-snug font-semibold text-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary">
          {project.title}
        </h3>

        <p className="line-clamp-2 text-sm text-foreground-muted">{project.summary}</p>

        {tags.length > 0 ? (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <li key={tag}>
                <Badge variant="outline" className="font-normal">
                  {tag}
                </Badge>
              </li>
            ))}
            {extraTags > 0 ? (
              <li>
                <Badge variant="ghost" className="font-normal text-foreground-subtle">
                  +{extraTags}
                </Badge>
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
    </MotionLink>
  );
}

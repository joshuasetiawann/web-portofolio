// Compact project card linking to a case-study page; gradient cover placeholder when no cover image.
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
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
}

const MAX_TAGS = 3;

// Motion-enabled Link so whileHover/whileFocus drive the lift on the real interactive element.
const MotionLink = m.create(Link);

// Card lifts on hover/focus; springs up, eases back down.
const liftVariants: Variants = {
  rest: { y: 0, transition: { duration: DURATION.base, ease: [...EASE.out] } },
  active: { y: -4, transition: { type: "spring", stiffness: 320, damping: 26, mass: 0.7 } },
};

// Cover gently scales within the overflow-clipped frame (transform only).
const coverVariants: Variants = {
  rest: { scale: 1, transition: { duration: DURATION.base, ease: [...EASE.out] } },
  active: { scale: 1.03, transition: { duration: DURATION.slow, ease: [...EASE.out] } },
};

// Inset border glow fades in for emphasis (opacity only).
const glowVariants: Variants = {
  rest: { opacity: 0, transition: { duration: DURATION.base, ease: [...EASE.out] } },
  active: { opacity: 1, transition: { duration: DURATION.base, ease: [...EASE.out] } },
};

export function ProjectCard({ project }: ProjectCardProps) {
  const reducedMotion = useReducedMotion();
  const isTouch = useMediaQuery("(pointer: coarse)");
  // Motion (transforms) only for hover-capable pointers with motion allowed; otherwise color/border only.
  const interactive = !reducedMotion && !isTouch;

  const tags = project.tags.slice(0, MAX_TAGS);
  const extraTags = project.tags.length - tags.length;
  const accentStyle = project.accent
    ? {
        backgroundImage: `radial-gradient(120% 120% at 25% 15%, ${project.accent}59, transparent 60%), linear-gradient(135deg, ${project.accent}26, transparent 70%)`,
      }
    : undefined;

  return (
    <MotionLink
      href={`/projects/${project.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-1 transition-colors hover:border-border-strong focus-visible:border-border-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      variants={interactive ? liftVariants : undefined}
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
              className={cn(
                "h-full w-full",
                !project.accent && "bg-gradient-to-br from-surface-2 to-surface-3",
              )}
              style={accentStyle}
            >
              <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:28px_28px]" />
            </div>
          )}
        </m.div>

        <span className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur transition-colors group-hover:bg-primary group-hover:text-primary-foreground group-focus-visible:bg-primary group-focus-visible:text-primary-foreground">
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary">{project.category}</Badge>
          <span className="font-mono text-xs text-foreground-subtle">{project.year}</span>
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

      {/* Hover/focus glow emphasis (decorative; transform-free, hover-capable pointers only). */}
      {interactive ? (
        <m.span
          aria-hidden="true"
          variants={glowVariants}
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-primary/30 ring-inset"
        />
      ) : null}
    </MotionLink>
  );
}

// Larger editorial featured-project card: cover/gradient on one side, narrative + stack on the other.
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

interface FeaturedProjectCardProps {
  project: Project;
}

const MAX_STACK = 5;

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

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const reducedMotion = useReducedMotion();
  const isTouch = useMediaQuery("(pointer: coarse)");
  // Motion (transforms) only for hover-capable pointers with motion allowed; otherwise color/border only.
  const interactive = !reducedMotion && !isTouch;

  const stack = project.stack.slice(0, MAX_STACK);
  const extraStack = project.stack.length - stack.length;
  const accentStyle = project.accent
    ? {
        backgroundImage: `radial-gradient(120% 120% at 30% 20%, ${project.accent}66, transparent 60%), linear-gradient(135deg, ${project.accent}33, transparent 70%)`,
      }
    : undefined;

  return (
    <MotionLink
      href={`/projects/${project.slug}`}
      className="group relative grid overflow-hidden rounded-2xl border border-border bg-surface-1 transition-colors hover:border-border-strong focus-visible:border-border-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none md:grid-cols-2"
      variants={interactive ? liftVariants : undefined}
      initial={interactive ? "rest" : undefined}
      animate={interactive ? "rest" : undefined}
      whileHover={interactive ? "active" : undefined}
      whileFocus={interactive ? "active" : undefined}
    >
      {/* Visual */}
      <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-auto md:min-h-72">
        <m.div variants={interactive ? coverVariants : undefined} className="absolute inset-0">
          {project.cover ? (
            <Image
              src={project.cover}
              alt={`${project.title} cover`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
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
              <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>
          )}
        </m.div>
      </div>

      {/* Narrative */}
      <div className="flex flex-col gap-4 p-6 md:p-8">
        <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-accent-2 uppercase">
          <span>Featured</span>
          <span aria-hidden="true" className="text-foreground-subtle">
            /
          </span>
          <span className="text-foreground-muted">{project.category}</span>
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-2xl leading-tight font-semibold text-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary">
            {project.title}
          </h3>
          <p className="text-sm text-foreground-muted sm:text-base">{project.summary}</p>
        </div>

        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex items-baseline gap-1.5">
            <dt className="text-foreground-subtle">Role</dt>
            <dd className="font-medium text-foreground">{project.role}</dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="text-foreground-subtle">Year</dt>
            <dd className="font-mono font-medium text-foreground">{project.year}</dd>
          </div>
        </dl>

        {stack.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {stack.map((item) => (
              <li key={item}>
                <Badge variant="outline" className="font-normal">
                  {item}
                </Badge>
              </li>
            ))}
            {extraStack > 0 ? (
              <li>
                <Badge variant="ghost" className="font-normal text-foreground-subtle">
                  +{extraStack}
                </Badge>
              </li>
            ) : null}
          </ul>
        ) : null}

        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-primary">
          View case study
          <ArrowUpRight
            className={cn(
              "size-4",
              interactive &&
                "transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5",
            )}
            aria-hidden="true"
          />
        </span>
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

// Larger editorial featured-project card: cover/graphite grid on one side, narrative + stack on the other.
"use client";

import Image from "next/image";
import Link from "next/link";
import { m, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CoverPlate } from "@/components/portfolio/cover-plate";
import { DURATION, EASE } from "@/animations/easings";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Project } from "@/types/project";

interface FeaturedProjectCardProps {
  project: Project;
}

const MAX_STACK = 5;

// Motion-enabled Link so whileHover/whileFocus propagate the cover zoom to the real interactive element.
const MotionLink = m.create(Link);

// Cover gently scales within the overflow-clipped frame (transform only).
const coverVariants: Variants = {
  rest: { scale: 1, transition: { duration: DURATION.base, ease: [...EASE.out] } },
  active: { scale: 1.03, transition: { duration: DURATION.slow, ease: [...EASE.out] } },
};

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const reducedMotion = useReducedMotion();
  const isTouch = useMediaQuery("(pointer: coarse)");
  // Motion (transforms) only for hover-capable pointers with motion allowed; otherwise color/border only.
  const interactive = !reducedMotion && !isTouch;

  const stack = project.stack.slice(0, MAX_STACK);
  const extraStack = project.stack.length - stack.length;

  return (
    <MotionLink
      href={`/projects/${project.slug}`}
      className="group relative grid overflow-hidden border border-border transition-colors hover:border-border-strong focus-visible:border-primary focus-visible:outline-none md:grid-cols-2"
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
            <CoverPlate prefix="PRJ" index={project.order} label={project.category} />
          )}
        </m.div>
      </div>

      {/* Narrative */}
      <div className="flex flex-col gap-4 p-6 md:p-8">
        <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-signal uppercase">
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
            <dt className="font-mono text-xs tracking-wide text-foreground-subtle uppercase">
              Role
            </dt>
            <dd className="font-medium text-foreground">{project.role}</dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="font-mono text-xs tracking-wide text-foreground-subtle uppercase">
              Year
            </dt>
            <dd className="font-mono tabular font-medium text-foreground">{project.year}</dd>
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

        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-mono text-xs tracking-wide text-primary uppercase">
          View case study
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </MotionLink>
  );
}

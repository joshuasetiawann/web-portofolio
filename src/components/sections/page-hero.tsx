// PageHero: standard page header block with eyebrow, title, description, and optional actions/children.
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  actions?: ReactNode;
  children?: ReactNode;
}

export function PageHero({
  eyebrow,
  title,
  description,
  align = "left",
  actions,
  children,
}: PageHeroProps) {
  const centered = align === "center";

  return (
    <header className="relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(50%_100%_at_50%_0%,color-mix(in_oklab,var(--color-primary)_12%,transparent),transparent_70%)]"
      />
      <Container>
        <div
          className={cn(
            "flex flex-col",
            centered ? "items-center text-center" : "items-start text-left",
          )}
        >
          {eyebrow ? (
            <Reveal>
              <p className="font-mono text-xs tracking-[0.2em] text-foreground-muted uppercase sm:text-sm">
                {eyebrow}
              </p>
            </Reveal>
          ) : null}

          <Reveal delay={eyebrow ? 0.05 : 0}>
            <h1 className="mt-4 font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {title}
            </h1>
          </Reveal>

          {description ? (
            <Reveal delay={0.1}>
              <p
                className={cn(
                  "mt-4 text-base leading-relaxed text-pretty text-foreground-muted sm:text-lg",
                  centered ? "max-w-2xl" : "max-w-3xl",
                )}
              >
                {description}
              </p>
            </Reveal>
          ) : null}

          {actions ? (
            <Reveal delay={0.15}>
              <div
                className={cn(
                  "mt-8 flex flex-col gap-3 sm:flex-row sm:items-center",
                  centered && "justify-center",
                )}
              >
                {actions}
              </div>
            </Reveal>
          ) : null}

          {children ? <div className="mt-10 w-full">{children}</div> : null}
        </div>
      </Container>
    </header>
  );
}

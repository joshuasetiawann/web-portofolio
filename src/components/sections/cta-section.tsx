// CTASection: reusable conversion band on an elevated surface with primary/secondary actions.
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export interface CTASectionProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTASection({
  title = "Have a project in mind?",
  description = "Let's build something thoughtful, fast, and accessible together.",
  primaryLabel = "Get in touch",
  primaryHref = ROUTES.contact,
  secondaryLabel,
  secondaryHref,
}: CTASectionProps) {
  return (
    <section className="py-[var(--spacing-section)]">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-2 px-6 py-12 text-center sm:px-12 sm:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_120%_at_50%_0%,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_70%)]"
            />
            <h2 className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl lg:text-4xl">
              {title}
            </h2>
            {description ? (
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pretty text-foreground-muted sm:text-lg">
                {description}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Magnetic>
                <Button asChild size="lg" className="group">
                  <Link href={primaryHref}>
                    {primaryLabel}
                    <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </Magnetic>
              {secondaryLabel && secondaryHref ? (
                <Button asChild size="lg" variant="outline">
                  <Link href={secondaryHref}>{secondaryLabel}</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

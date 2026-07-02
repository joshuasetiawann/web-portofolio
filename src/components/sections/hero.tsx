// Landing hero (DATUM). The LCP <h1> is DOM text (never gated behind JS); the WebGL
// Calibration Field + telemetry are decorative. Mono eyebrow, oversized display name,
// one plainspoken line, one primary + one secondary CTA (primary magnetic).
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { HeroScene } from "@/components/sections/hero-scene";
import { Rule } from "@/components/layout/rule";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-[var(--spacing-section)]">
      {/* Instrument grid backdrop. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--border)_70%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_70%,transparent)_1px,transparent_1px)] [mask-image:radial-gradient(70%_70%_at_50%_20%,black,transparent)] [background-size:64px_64px] opacity-40"
      />

      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Copy column — visible immediately; holds the LCP <h1>. */}
          <div className="flex flex-col items-start text-left">
            <p className="inline-flex items-center gap-2 font-mono text-mono-eyebrow tracking-wider text-signal uppercase">
              <Rule signal />
              00 · Reference Instrument
            </p>

            <h1 className="mt-6 font-display text-display-2xl text-balance text-foreground">
              {siteConfig.name}
            </h1>

            <p className="mt-3 font-mono text-mono-label tracking-wider text-foreground-muted uppercase">
              {siteConfig.author.jobTitle}
            </p>

            <p className="mt-6 max-w-xl text-body-lg text-pretty text-foreground-muted">
              I build interfaces where rigorous engineering meets expressive design — fast,
              accessible, quietly ambitious software, and the occasional thing that moves.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Magnetic>
                <Button asChild size="lg" className="group">
                  <Link href={ROUTES.projects}>
                    See the work
                    <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </Magnetic>
              <Button asChild size="lg" variant="outline" className="group">
                <Link href={ROUTES.contact}>
                  Get in touch
                  <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Calibration Field (decorative; reduced-motion / no-WebGL → SVG poster). */}
          <Reveal delay={0.2} className="w-full">
            <HeroScene />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

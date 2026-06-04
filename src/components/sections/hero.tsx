// Landing hero: eyebrow kicker, display headline, positioning line, dual CTA, and a static visual placeholder for the Phase 4 WebGL scene.
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { HeroScene } from "@/components/sections/hero-scene";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-[var(--spacing-section)]">
      {/* Decorative ambient backdrop (Phase 4 WebGL hero lands here) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--color-primary)_18%,transparent),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--color-border)_60%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--color-border)_60%,transparent)_1px,transparent_1px)] [mask-image:radial-gradient(70%_70%_at_50%_30%,black,transparent)] bg-[size:64px_64px] opacity-40" />
      </div>

      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Copy column — rendered visible immediately (it holds the LCP <h1>; never gated behind a JS entrance) */}
          <div className="flex flex-col items-start text-left">
            <p className="font-mono text-xs tracking-[0.2em] text-foreground-muted uppercase sm:text-sm">
              {siteConfig.author.jobTitle}
            </p>

            <h1 className="mt-6 font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="block text-foreground">{siteConfig.name}</span>
              <span className="text-gradient mt-1 block">builds immersive software.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-foreground-muted sm:text-lg">
              Designing and engineering performant, accessible interfaces where thoughtful
              interaction meets production-grade systems.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Magnetic>
                <Button asChild size="lg" className="group">
                  <Link href={ROUTES.projects}>
                    View work
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

          {/* WebGL Signal Field (decorative; reduced-motion/no-WebGL → gradient poster) */}
          <Reveal delay={0.2} className="w-full">
            <HeroScene />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

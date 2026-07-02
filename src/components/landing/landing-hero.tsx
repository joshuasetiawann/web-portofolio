// Landing hero: layered Signal Field scene (glow → grid → canvas → spotlight)
// with the load-staggered reveal sequence from the handoff. The pointer feeds
// both the CSS spotlight (--mx/--my) and the canvas repel/brighten math via a
// shared mutable ref.
"use client";

import { useRef } from "react";
import { m } from "framer-motion";

import { Magnetic } from "@/components/motion/magnetic";
import { useLandingMotion } from "./landing-scene";
import { SignalField, type FieldPointer } from "./signal-field";
import { useSectionScroll } from "./use-section-scroll";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

function HeroReveal({
  delay,
  className,
  children,
}: {
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  const { motionOn } = useLandingMotion();
  if (!motionOn) return <div className={className}>{children}</div>;
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </m.div>
  );
}

export function LandingHero() {
  const { toSection } = useSectionScroll();
  const heroRef = useRef<HTMLElement>(null);
  const pointerRef = useRef<FieldPointer>({ x: -9999, y: -9999, active: false });

  const handlePointerMove = (e: React.PointerEvent) => {
    const hero = heroRef.current;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    hero.style.setProperty("--mx", `${x}px`);
    hero.style.setProperty("--my", `${y}px`);
    pointerRef.current.x = x;
    pointerRef.current.y = y;
    pointerRef.current.active = true;
  };

  const handlePointerLeave = () => {
    pointerRef.current.active = false;
    pointerRef.current.x = -9999;
    pointerRef.current.y = -9999;
  };

  return (
    <section
      id="top"
      ref={heroRef}
      className="l-hero"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="l-hero-glow" aria-hidden="true" />
      <div className="l-hero-grid" aria-hidden="true" />
      <SignalField pointer={pointerRef} />
      <div className="l-hero-spot" aria-hidden="true" />

      <div className="l-container relative z-2 w-full">
        <HeroReveal delay={0} className="inline-flex flex-wrap items-center gap-3.5">
          <span className="font-gm inline-flex items-center gap-2.5 text-xs font-medium tracking-[0.22em] whitespace-nowrap text-foreground-muted uppercase">
            <span className="l-diamond rounded-[1px]" aria-hidden="true" />
            AI Engineer · Software Developer
          </span>
          <span className="l-availability">
            <span className="l-availability-dot" aria-hidden="true" />
            Open to new work
          </span>
        </HeroReveal>

        <h1 className="l-hero-h1">
          <HeroReveal delay={0.08} className="block">
            <span className="block">Joshua</span>
          </HeroReveal>
          <HeroReveal delay={0.17} className="block">
            <span className="block">
              <span className="l-grad-text">Setiawan</span>
              <span className="text-accent-2">.</span>
            </span>
          </HeroReveal>
        </h1>

        <HeroReveal delay={0.28}>
          <p className="mt-[34px] max-w-[600px] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.65] text-pretty text-foreground-muted">
            I build intelligent systems — from a bootable x86 kernel written from scratch to
            multi-agent AI platforms — combining performance with thoughtful user experience.
          </p>
        </HeroReveal>

        <HeroReveal delay={0.38} className="mt-10 flex flex-wrap gap-3.5">
          <Magnetic>
            <a
              href="#work"
              className="l-pill l-pill-gradient text-[15px] shadow-[0_10px_34px_rgba(var(--glow-rgb),0.3)] hover:shadow-[0_16px_46px_rgba(var(--glow-rgb),0.44)] hover:brightness-[1.08]"
              onClick={(e) => {
                e.preventDefault();
                toSection("work");
              }}
            >
              See the work <span className="text-[17px]">→</span>
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#contact"
              className="l-pill l-pill-outline bg-white/2 text-[15px] hover:border-accent hover:bg-[rgba(var(--glow-rgb),0.08)]"
              onClick={(e) => {
                e.preventDefault();
                toSection("contact");
              }}
            >
              Get in touch <span className="text-[15px]">↗</span>
            </a>
          </Magnetic>
        </HeroReveal>
      </div>

      <div className="l-cue" aria-hidden="true">
        <span className="font-gm text-[10px] tracking-[0.3em] text-foreground-subtle uppercase">
          Scroll
        </span>
        <span className="l-cue-line" />
      </div>
    </section>
  );
}

"use client";

// TimelineRail — client island for the /timeline page. Renders the year-grouped
// milestones as a single vertical rail. A lazy GSAP ScrollTrigger scrub grows the
// primary progress line (scaleY 0→1) as the section scrolls, and each milestone
// fades/slides in as it enters the viewport. Reduced motion (OS query OR the in-app
// preference) gets the static full-height line with every item fully visible — which
// is also the default server-rendered DOM, so content is never gated behind motion.
import { useEffect, useRef } from "react";

import type { TimelineEvent } from "@/data/timeline";
import { TimelineItem } from "@/components/portfolio/timeline-item";
import { getGsap } from "@/lib/motion/gsap";
import { useLenis } from "@/hooks/use-lenis";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { DURATION } from "@/animations/easings";

interface TimelineRailProps {
  groups: { year: number; events: TimelineEvent[] }[];
}

export function TimelineRail({ groups }: TimelineRailProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const scope = scopeRef.current;
    const progress = progressRef.current;
    if (!scope) return;

    const { gsap, ScrollTrigger } = getGsap();

    // Keep ScrollTrigger in sync with Lenis' virtualized scroll position.
    const handleLenisScroll = () => ScrollTrigger.update();
    lenis?.on("scroll", handleLenisScroll);

    // A11y safeguard: if a keyboard user focuses a control inside a not-yet-revealed
    // milestone (e.g. its "View details" link), reveal it immediately so focus is
    // never trapped on an invisible element. No-op once the item is already shown.
    const handleFocusIn = (event: FocusEvent) => {
      const item = (event.target as HTMLElement | null)?.closest("li");
      if (item) gsap.set(item, { opacity: 1, y: 0 });
    };
    scope.addEventListener("focusin", handleFocusIn);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Honor an explicit in-app "reduced" choice even when the OS allows motion.
        // The default DOM already shows the full line + every item, so we simply opt out.
        if (reducedMotion) return;

        // Progress line: scrub its scaleY from 0→1 across the rail's scroll range.
        if (progress) {
          gsap.fromTo(
            progress,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: scope,
                start: "top 80%",
                end: "bottom 20%",
                scrub: true,
              },
            },
          );
        }

        // Milestones: fade + slide each entry up as it enters. Reveal once and stay
        // (no re-hide on scroll-up) so reading and keyboard navigation stay stable.
        const milestones = gsap.utils.toArray<HTMLElement>(scope.querySelectorAll("li"));
        milestones.forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: DURATION.base,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        });
      });
      // (prefers-reduced-motion: reduce) intentionally registers no animation:
      // the static full-height line and all-visible items are the default render.
    }, scope);

    return () => {
      scope.removeEventListener("focusin", handleFocusIn);
      lenis?.off("scroll", handleLenisScroll);
      ctx.revert(); // reverts tweens + kills ScrollTriggers, restoring the static DOM.
    };
  }, [lenis, reducedMotion]);

  return (
    <div ref={scopeRef} className="relative pl-6">
      {/* Static rail track. */}
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-border" />
      {/* Scrubbed progress line — full height by default (static/reduced-motion state). */}
      <span
        ref={progressRef}
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-px origin-top bg-primary"
      />

      <div className="flex flex-col gap-12">
        {groups.map(({ year, events }) => (
          <section
            key={year}
            aria-labelledby={`timeline-year-${year}`}
            className="flex flex-col gap-6"
          >
            <h2
              id={`timeline-year-${year}`}
              className="font-display text-2xl font-semibold text-foreground"
            >
              {year}
            </h2>
            <ol className="flex flex-col">
              {events.map((event) => (
                <TimelineItem key={`${event.date}-${event.title}`} event={event} />
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

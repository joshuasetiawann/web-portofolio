// TechMarquee — a full-bleed hairline band of capability words set in OUTLINED Archivo
// Expanded (transparent fill + graphite text-stroke), punctuated by small rotated-square
// orange diamonds. A duplicated list scrolls via a CSS translateX loop that PAUSES while
// off-screen (IntersectionObserver) and is fully static under reduced motion.
"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const TECH = [
  "Design Systems",
  "WebGL",
  "Motion",
  "Performance",
  "Accessibility",
  "TypeScript",
  "React",
  "Three.js",
  "Realtime",
  "Shaders",
  "Next.js",
  "Systems Thinking",
] as const;

// Scoped keyframes — a self-contained loop that never touches globals. Duplicating the
// sequence and translating exactly one sequence width (-50%) yields a seamless wrap.
const KEYFRAMES =
  "@keyframes datum-tech-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}";

function Sequence({ hidden }: { hidden?: boolean }) {
  return (
    <>
      {TECH.map((word) => (
        <li
          key={`${hidden ? "dup" : "seq"}-${word}`}
          aria-hidden={hidden || undefined}
          className="mr-8 flex shrink-0 items-center gap-8 md:mr-12 md:gap-12"
        >
          <span className="font-display text-display-md leading-none whitespace-nowrap text-transparent [-webkit-text-stroke:1px_var(--border-strong)]">
            {word}
          </span>
          <span aria-hidden="true" className="size-2 shrink-0 rotate-45 bg-signal" />
        </li>
      ))}
    </>
  );
}

export function TechMarquee({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animate = inView && !reducedMotion;

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden border-y border-border py-6 md:py-8", className)}
    >
      <style>{KEYFRAMES}</style>
      <ul
        aria-label="Core capabilities"
        className="flex w-max items-center"
        style={
          reducedMotion
            ? undefined
            : {
                animation: "datum-tech-marquee 40s linear infinite",
                animationPlayState: animate ? "running" : "paused",
              }
        }
      >
        <Sequence />
        <Sequence hidden />
      </ul>
    </div>
  );
}

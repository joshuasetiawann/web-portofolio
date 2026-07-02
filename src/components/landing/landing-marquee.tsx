// Tech marquee: full-bleed alt band of outlined capability words separated by
// gradient diamonds. Duplicated sequence + translateX(-50%) = seamless loop;
// pauses off-screen (IntersectionObserver). The scene-level motion switch and
// prefers-reduced-motion freeze it via landing.css.
"use client";

import { useEffect, useRef, useState } from "react";

import { useLandingMotion } from "./landing-scene";

// Curated cross-section of the real toolkit (src/data/skills.ts).
const MARQUEE_ITEMS = [
  "AI / ML",
  "Computer Vision",
  "TypeScript",
  "Python",
  "React",
  "Next.js",
  "PyTorch",
  "FastAPI",
  "Systems Programming",
  "PostgreSQL",
  "Performance",
  "Accessibility",
] as const;

function Sequence({ hidden }: { hidden?: boolean }) {
  return (
    <>
      {MARQUEE_ITEMS.map((word) => (
        <li
          key={`${hidden ? "dup" : "seq"}-${word}`}
          aria-hidden={hidden || undefined}
          className="flex shrink-0 items-center gap-[30px] px-[30px]"
        >
          <span className="l-marquee-word">{word}</span>
          <span
            className="size-[9px] shrink-0 rotate-45 rounded-[1px] bg-accent"
            aria-hidden="true"
          />
        </li>
      ))}
    </>
  );
}

export function LandingMarquee() {
  const { motionOn } = useLandingMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="l-marquee" aria-hidden="true">
      <ul
        className="l-marquee-track"
        style={{ animationPlayState: motionOn && inView ? "running" : "paused" }}
      >
        <Sequence />
        <Sequence hidden />
      </ul>
    </div>
  );
}

// useSectionScroll: in-page navigation that routes through the active Lenis
// instance (so programmatic scrolls don't fight its lerp loop), falling back
// to native scrolling when Lenis is off (reduced motion) or unmounted.
// Applies the landing's -60px fixed-header offset everywhere.
"use client";

import { useCallback } from "react";

import { useLenis } from "@/hooks/use-lenis";
import { useLandingMotion } from "./landing-scene";
import { scrollToId, scrollToTop } from "./scroll-to";

export function useSectionScroll() {
  const lenis = useLenis();
  const { motionOn } = useLandingMotion();

  const toSection = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (lenis && motionOn) lenis.scrollTo(el, { offset: -60 });
      else scrollToId(id, motionOn);
    },
    [lenis, motionOn],
  );

  const toTop = useCallback(() => {
    if (lenis && motionOn) lenis.scrollTo(0);
    else scrollToTop(motionOn);
  }, [lenis, motionOn]);

  return { toSection, toTop };
}

// LandingReveal: the repo Reveal, additionally honoring the scene's master
// motion switch — a paused scene shows everything immediately (same contract
// as prefers-reduced-motion).
"use client";

import { Reveal, type RevealProps } from "@/components/motion/reveal";
import { useLandingMotion } from "./landing-scene";

export function LandingReveal(props: RevealProps) {
  const { motionOn } = useLandingMotion();
  if (!motionOn) return <div className={props.className}>{props.children}</div>;
  return <Reveal {...props} />;
}

// LandingScene: client wrapper for the SIGNAL landing — owns the master motion
// switch (visible "Pause motion" control + prefers-reduced-motion) and exposes
// it to the hero canvas, marquee, and reveals via context. Sets data-motion on
// the `.landing` scope so CSS loops pause too (see landing.css).
"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { MotionToggle } from "./motion-toggle";

interface LandingMotionContextValue {
  /** Resolved switch: user toggle AND system preference. */
  motionOn: boolean;
  /** User toggle state (independent of the system preference). */
  paused: boolean;
  setPaused: (paused: boolean) => void;
  /** Jump Menu open state — shared so the footer's ⌘K hint can open it too. */
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const LandingMotionContext = createContext<LandingMotionContextValue | null>(null);

export function useLandingMotion(): LandingMotionContextValue {
  const ctx = useContext(LandingMotionContext);
  if (!ctx) throw new Error("useLandingMotion must be used inside <LandingScene>");
  return ctx;
}

export function LandingScene({ className, children }: { className?: string; children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const motionOn = !paused && !reducedMotion;

  const value = useMemo(
    () => ({ motionOn, paused, setPaused, menuOpen, setMenuOpen }),
    [motionOn, paused, menuOpen],
  );

  return (
    <LandingMotionContext.Provider value={value}>
      <div className={cn("landing", className)} data-motion={motionOn ? "on" : "off"}>
        {children}
        <MotionToggle />
      </div>
    </LandingMotionContext.Provider>
  );
}

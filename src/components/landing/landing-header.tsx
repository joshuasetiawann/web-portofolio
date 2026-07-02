// Landing header: fixed chrome with the scroll-driven collapse (--hdr 0→1 at
// scrollY > 32 — background, blur, hairline, wordmark→monogram crossfade all
// derive from that one variable in landing.css). Owns the Jump Menu open state
// and the global ⌘K / Ctrl+K shortcut.
"use client";

import { useEffect, useRef } from "react";

import { Magnetic } from "@/components/motion/magnetic";
import { JumpMenu } from "./jump-menu";
import { useLandingMotion } from "./landing-scene";
import { useSectionScroll } from "./use-section-scroll";

export function LandingHeader() {
  const { menuOpen, setMenuOpen } = useLandingMotion();
  const { toSection, toTop } = useSectionScroll();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const onScroll = () => {
      header.style.setProperty("--hdr", window.scrollY > 32 ? "1" : "0");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setMenuOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setMenuOpen]);

  return (
    <>
      <header ref={headerRef} className="l-header">
        <div className="l-header-inner">
          <a
            href="#top"
            className="l-wordmark"
            aria-label="Joshua Setiawan — top"
            onClick={(e) => {
              e.preventDefault();
              toTop();
            }}
          >
            <span className="l-wordmark-full">
              Joshua Setiawan<span className="text-accent-2">.</span>
            </span>
            <span className="l-wordmark-mono" aria-hidden="true">
              JS<span className="text-accent-2">.</span>
            </span>
          </a>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="l-menu-button"
              aria-label="Open jump menu"
              onClick={() => setMenuOpen(true)}
            >
              Menu <span className="opacity-65">⌘K</span>
            </button>
            <Magnetic>
              <a
                href="#contact"
                className="l-pill l-pill-gradient !px-[18px] !py-[11px] shadow-[0_8px_26px_rgba(var(--glow-rgb),0.26)] hover:shadow-[0_12px_34px_rgba(var(--glow-rgb),0.4)] hover:brightness-[1.08]"
                onClick={(e) => {
                  e.preventDefault();
                  toSection("contact");
                }}
              >
                Get in touch <span className="text-[15px]">→</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </header>

      <JumpMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </>
  );
}

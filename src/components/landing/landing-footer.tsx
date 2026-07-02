// Landing footer: wordmark + sign-off, Navigate / Elsewhere link columns, and
// the bottom bar with the ⌘K hint (which opens the Jump Menu).
"use client";

import { socialLinks } from "@/data/social-links";
import { JUMP_NAV } from "./jump-menu";
import { useLandingMotion } from "./landing-scene";
import { useSectionScroll } from "./use-section-scroll";

export function LandingFooter() {
  const { setMenuOpen } = useLandingMotion();
  const { toSection, toTop } = useSectionScroll();

  return (
    <footer className="relative border-t border-border bg-band pt-14 pb-11">
      <div className="l-container">
        <div className="flex flex-wrap justify-between gap-8">
          <div className="max-w-[340px]">
            <a
              href="#top"
              className="font-sg text-xl font-semibold tracking-[-0.02em] text-foreground no-underline"
              onClick={(e) => {
                e.preventDefault();
                toTop();
              }}
            >
              Joshua Setiawan<span className="text-accent-2">.</span>
            </a>
            <p className="mt-3.5 text-sm leading-[1.6] text-foreground-muted">
              Built by Joshua Setiawan. Designed and engineered end to end.
            </p>
          </div>

          <div className="flex flex-wrap gap-11">
            <div>
              <div className="font-gm text-[11px] tracking-[0.16em] text-foreground-subtle uppercase">
                Navigate
              </div>
              <div className="mt-4 flex flex-col gap-[9px]">
                {JUMP_NAV.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="text-sm text-foreground-muted transition-colors hover:text-foreground"
                    onClick={(e) => {
                      e.preventDefault();
                      toSection(item.id);
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="font-gm text-[11px] tracking-[0.16em] text-foreground-subtle uppercase">
                Elsewhere
              </div>
              <div className="mt-4 flex flex-col gap-[9px]">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sm text-foreground-muted transition-colors hover:text-foreground"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="font-gm mt-11 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-border pt-6 text-xs text-foreground-subtle">
          <span>© {new Date().getFullYear()} Joshua Setiawan</span>
          <span>Fast · accessible · built in the open</span>
          <button
            type="button"
            className="cursor-pointer transition-colors hover:text-foreground"
            onClick={() => setMenuOpen(true)}
          >
            Press ⌘K to jump anywhere
          </button>
        </div>
      </div>
    </footer>
  );
}

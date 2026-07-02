// DATUM IndexGutter — the persistent left instrument rail (lg+ only). Three zones:
// route index (top), scroll-aligned section ticks (middle, from GutterContext), and
// scroll telemetry (bottom). Fixed + decorative (aria-hidden, pointer-events-none) so
// it never affects flow or focus order; PageShell pads content clear of it on lg+.
"use client";

import { usePathname } from "next/navigation";

import { useGutter } from "@/components/layout/gutter-context";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";

const ROUTE_CODES: { match: string; code: string }[] = [
  { match: "/projects", code: "PRJ" },
  { match: "/experience", code: "EXP" },
  { match: "/timeline", code: "TL" },
  { match: "/achievements", code: "ACH" },
  { match: "/certificates", code: "CERT" },
  { match: "/research", code: "RES" },
  { match: "/blog", code: "NOTE" },
  { match: "/gallery", code: "FIG" },
  { match: "/open-source", code: "OSS" },
  { match: "/github", code: "REPO" },
  { match: "/about", code: "ABT" },
  { match: "/philosophy", code: "PHL" },
  { match: "/contact", code: "TX" },
];

function routeCode(pathname: string): string {
  if (pathname === "/") return "HOME";
  const hit = ROUTE_CODES.find((r) => pathname === r.match || pathname.startsWith(`${r.match}/`));
  return hit ? hit.code : "SYS";
}

export function IndexGutter() {
  const pathname = usePathname();
  const { sections, activeId } = useGutter();
  const progress = useScrollProgress();
  const code = routeCode(pathname);

  return (
    <aside
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-30 hidden h-svh w-[var(--gutter-w)] flex-col justify-between border-r border-rule pt-24 pb-[calc(var(--statusbar-h)+1.5rem)] lg:flex"
    >
      {/* Route index */}
      <span className="rotate-180 self-center font-mono text-mono-label tracking-[0.24em] text-signal [writing-mode:vertical-rl]">
        {code}
      </span>

      {/* Section ticks (populated as sections register) */}
      <ul className="flex flex-col items-start gap-3 self-center">
        {sections.map((section) => {
          const active = section.id === activeId;
          return (
            <li key={section.id} className="flex items-center gap-2">
              <span
                className={cn("h-px transition-all", active ? "w-5 bg-signal" : "w-3 bg-rule")}
              />
              <span
                className={cn(
                  "font-mono tabular text-mono-label",
                  active ? "text-signal" : "text-foreground-subtle",
                )}
              >
                {section.index}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Scroll telemetry */}
      <span className="rotate-180 self-center font-mono tabular text-mono-meta text-foreground-subtle [writing-mode:vertical-rl]">
        Y {progress.toFixed(2)}
      </span>
    </aside>
  );
}

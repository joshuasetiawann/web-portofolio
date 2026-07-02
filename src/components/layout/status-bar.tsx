// DATUM StatusBar — the fixed bottom telemetry bar. Reports live instrument state
// site-wide: scroll fraction, active section, theme, git ref, FPS. Decorative
// (aria-hidden) until the contact form wires the live TX slot in a later phase.
// Height reserved globally via `body { padding-bottom }`, so it never occludes content.
"use client";

import { useTheme } from "next-themes";

import { useGutter } from "@/components/layout/gutter-context";
import { Rule } from "@/components/layout/rule";
import { useFpsMeter } from "@/hooks/use-fps-meter";
import { useMounted } from "@/hooks/use-mounted";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

const COMMIT = process.env.NEXT_PUBLIC_COMMIT_SHA ?? "unknown";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function StatusBar() {
  const { activeOrdinal, sections } = useGutter();
  const progress = useScrollProgress();
  const fps = useFpsMeter();
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  const theme = !mounted ? "—" : resolvedTheme === "light" ? "DATASHEET" : "INSTRUMENT";
  const total = sections.length;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[var(--statusbar-h)] items-center gap-3 border-t border-rule bg-status-bar px-3 font-mono tabular text-mono-status text-status-bar-foreground [contain:layout_style_paint]"
    >
      <span>
        <span className="text-foreground-subtle">Y </span>
        <span className="text-foreground">{progress.toFixed(2)}</span>
      </span>

      <Rule orientation="vertical" className="h-3" />

      <span>
        <span className="text-foreground-subtle">SECT </span>
        <span className="text-signal">{pad2(activeOrdinal)}</span>
        <span className="text-foreground-subtle">/{pad2(total)}</span>
      </span>

      <Rule orientation="vertical" className="hidden h-3 sm:block" />
      <span className="hidden items-center gap-1.5 sm:inline-flex">
        <span className="size-1.5 bg-signal" aria-hidden="true" />
        <span className="text-foreground">{theme}</span>
      </span>

      <Rule orientation="vertical" className="hidden h-3 sm:block" />
      <span className="hidden sm:inline">
        <span className="text-foreground-subtle">git </span>
        <span className="text-foreground">{COMMIT}</span>
      </span>

      <span className="ml-auto hidden items-center gap-2 sm:inline-flex">
        <Rule orientation="vertical" className="h-3" />
        <span>
          <span className="text-foreground">{fps === null ? "—" : fps}</span>
          <span className="text-foreground-subtle"> FPS</span>
        </span>
      </span>
    </div>
  );
}

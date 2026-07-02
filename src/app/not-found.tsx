import type { Metadata } from "next";
import Link from "next/link";

import { Rule } from "@/components/layout/rule";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="grid min-h-dvh place-items-center px-6">
      <div className="flex w-full max-w-[640px] flex-col items-start gap-6">
        <span className="inline-flex items-center gap-3">
          <Rule signal className="w-10" />
          <span className="font-mono tabular text-mono-eyebrow text-foreground uppercase">
            ERR · 404
          </span>
        </span>

        <h1 className="font-display text-display-lg text-balance text-foreground">Signal lost</h1>

        <p className="max-w-[60ch] text-pretty text-foreground-muted">
          The coordinate you requested isn&rsquo;t on the instrument — it may have moved, been
          retired, or was never plotted.
        </p>

        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-2 border-t border-border pt-4 font-mono text-mono-status text-foreground-muted uppercase transition-colors hover:text-signal"
        >
          Return to index
        </Link>
      </div>
    </main>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Rule } from "@/components/layout/rule";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with a real error sink (e.g. Sentry) in a later phase.
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" tabIndex={-1} className="grid min-h-dvh place-items-center px-6">
      <div className="flex w-full max-w-[640px] flex-col items-start gap-6">
        <span className="inline-flex items-center gap-3">
          <Rule signal className="w-10" />
          <span className="font-mono tabular text-mono-eyebrow text-foreground uppercase">
            ERR · 500
          </span>
        </span>

        <h1 className="font-display text-display-lg text-balance text-foreground">
          Calibration fault
        </h1>

        <p className="max-w-[60ch] text-pretty text-foreground-muted">
          The instrument hit an unexpected fault while rendering this view. You can recalibrate, or
          return to the index.
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={reset}
            className="font-mono text-mono-status text-foreground uppercase transition-colors hover:text-signal"
          >
            Recalibrate
          </button>
          <Link
            href="/"
            className="font-mono text-mono-status text-foreground-muted uppercase transition-colors hover:text-signal"
          >
            Return to index
          </Link>
        </div>

        {error.digest ? (
          <p className="font-mono tabular text-mono-meta text-foreground-subtle">
            DIGEST: {error.digest}
          </p>
        ) : null}
      </div>
    </main>
  );
}

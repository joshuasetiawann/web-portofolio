"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <main
      id="main-content"
      tabIndex={-1}
      className="grid min-h-dvh place-items-center px-6 text-center"
    >
      <div className="max-w-md space-y-4">
        <p className="font-mono text-xs tracking-widest text-accent-2 uppercase">Error</p>
        <h1 className="font-display text-3xl tracking-tight">Something went wrong</h1>
        <p className="text-foreground-muted">
          An unexpected error occurred on our end. You can try again or head back home.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

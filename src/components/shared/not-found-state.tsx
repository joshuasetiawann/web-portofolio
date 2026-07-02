// Branded 404 content block with primary links back to home and work.
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotFoundStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function NotFoundState({
  title = "Page not found",
  description = "The page you’re looking for doesn’t exist or may have moved.",
  className,
}: NotFoundStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-6 py-16 text-center", className)}
    >
      <span
        aria-hidden="true"
        className="font-display text-6xl font-bold tracking-tight text-signal sm:text-7xl"
      >
        404
      </span>
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
        <p className="mx-auto max-w-prose text-foreground-muted">{description}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/projects">
            <Compass className="size-4" aria-hidden="true" />
            Browse projects
          </Link>
        </Button>
      </div>
    </div>
  );
}

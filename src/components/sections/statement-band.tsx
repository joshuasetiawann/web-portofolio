// StatementBand — a full-bleed, hairline-bounded point-of-view mark. An oversized
// flush-left Archivo Expanded statement with a single Signal-orange phrase, closed by a
// mono attribution. Pure RSC markup; no motion, no fills.
import { Container } from "@/components/layout/container";
import { Rule } from "@/components/layout/rule";
import { cn } from "@/lib/utils";

export function StatementBand({ className }: { className?: string }) {
  return (
    <div className={cn("border-y border-border py-[var(--spacing-section)]", className)}>
      <Container>
        <p className="inline-flex items-center gap-2 font-mono text-mono-eyebrow text-signal uppercase">
          <Rule signal />
          Point of view
        </p>

        <blockquote className="mt-8">
          <p className="max-w-[22ch] font-display text-display-md text-balance text-foreground md:text-display-lg">
            I don&apos;t ship what I <span className="text-signal">can&apos;t explain</span> — from
            kernel space to the browser, understanding is the real deliverable.
          </p>
          <footer className="mt-8 font-mono text-mono-label text-foreground-subtle uppercase">
            — how I approach every build
          </footer>
        </blockquote>
      </Container>
    </div>
  );
}

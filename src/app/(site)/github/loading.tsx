import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

// Instrument-panel loading state: hairline placeholder module rows + STATE: ACQUIRING.
// Motion is gated behind `motion-safe`, so reduced-motion users see a static skeleton.
const MODULES = ["01", "02", "03", "04", "05"];

export default function GitHubLoading() {
  return (
    <div role="status" aria-live="polite">
      <Section className="pt-28 pb-8 sm:pt-32">
        <Container>
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-3">
              <span
                aria-hidden="true"
                className="block h-px w-8 bg-signal motion-safe:animate-pulse"
              />
              <span className="font-mono tabular text-mono-eyebrow text-foreground-muted uppercase">
                STATE: <span className="text-signal">ACQUIRING…</span>
              </span>
            </span>
            <h1 className="font-display text-display-lg text-foreground">Live from GitHub</h1>
            <span
              aria-hidden="true"
              className="block h-4 w-3/4 max-w-xl bg-surface-2 motion-safe:animate-pulse"
            />
          </div>
        </Container>
      </Section>

      <Section rule className="pt-0">
        <Container>
          <div className="border-b border-border" aria-hidden="true">
            {MODULES.map((n) => (
              <div
                key={n}
                className="flex items-baseline gap-4 border-t border-border py-5 md:gap-6"
              >
                <span className="w-16 shrink-0 font-mono tabular text-mono-label text-foreground-subtle">
                  {n}
                </span>
                <div className="min-w-0 flex-1 space-y-2">
                  <span className="block h-4 w-2/3 bg-surface-3 motion-safe:animate-pulse" />
                  <span className="block h-3 w-1/3 bg-surface-2 motion-safe:animate-pulse" />
                </div>
                <span className="hidden h-6 w-12 shrink-0 bg-surface-2 motion-safe:animate-pulse md:block" />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <span className="sr-only">Loading GitHub data…</span>
    </div>
  );
}

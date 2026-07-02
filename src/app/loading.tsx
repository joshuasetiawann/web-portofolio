import { Container } from "@/components/layout/container";

// Hairline placeholder ledger for the root route-transition state. Motion is gated behind
// `motion-safe`, so reduced-motion users see a static datasheet skeleton.
const ROWS = ["01", "02", "03", "04", "05"];

export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="min-h-[70vh] pt-28 pb-16 sm:pt-32">
      <Container>
        {/* State readout. */}
        <div className="flex items-center gap-3 pb-8">
          <span aria-hidden="true" className="block h-px w-8 bg-signal motion-safe:animate-pulse" />
          <span className="font-mono tabular text-mono-eyebrow text-foreground-muted uppercase">
            STATE: <span className="text-signal">ACQUIRING…</span>
          </span>
        </div>

        {/* Placeholder ledger rows — hairlines over faint graphite fills. */}
        <div className="border-b border-border" aria-hidden="true">
          {ROWS.map((n) => (
            <div key={n} className="flex items-baseline gap-4 border-t border-border py-5 md:gap-6">
              <span className="w-16 shrink-0 font-mono tabular text-mono-label text-foreground-subtle">
                {n}
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <span className="block h-4 w-2/3 bg-surface-3 motion-safe:animate-pulse" />
                <span className="block h-3 w-1/3 bg-surface-2 motion-safe:animate-pulse" />
              </div>
              <span className="hidden h-3 w-16 shrink-0 bg-surface-2 motion-safe:animate-pulse md:block" />
            </div>
          ))}
        </div>

        <span className="sr-only">Loading</span>
      </Container>
    </div>
  );
}

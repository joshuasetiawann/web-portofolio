// Timeline — DATUM declassified chronological ledger: year bands (full-width hairline
// headers) over hairline TL-### rows, tracked by a single sanctioned orange rail trace.
import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { LedgerList, LedgerRow } from "@/components/layout/ledger-row";
import { Calibration } from "@/components/motion/calibration";
import { getTimelineByYear, type TimelineEventType } from "@/data/timeline";
import { buildMetadata } from "@/lib/metadata";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/utils/format-date";

export const metadata: Metadata = buildMetadata({
  title: "Timeline",
  description:
    "A year-by-year record of milestones, roles, launches, talks, and awards along the way.",
  path: ROUTES.timeline,
});

const TYPE_LABEL: Record<TimelineEventType, string> = {
  role: "Role",
  launch: "Launch",
  award: "Award",
  talk: "Talk",
  education: "Education",
  milestone: "Milestone",
};

export default function TimelinePage() {
  const years = getTimelineByYear();

  // Global filing numbers across the whole chronology (newest = TL-001).
  const filing = new Map<string, number>();
  let counter = 0;
  for (const { events } of years) {
    for (const event of events) filing.set(`${event.date}-${event.title}`, ++counter);
  }

  return (
    <>
      <PageHero
        eyebrow="Index · TL"
        title="Milestones over the years"
        description="The launches, roles, talks, and moments that mark the path so far — newest first."
      />

      <Section index="01" label="Timeline">
        <Container size="content">
          <div className="relative pl-6">
            {/* Static rail track + the one sanctioned orange trace (full-height default state). */}
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-border" />
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-signal" />

            <div className="flex flex-col gap-12">
              {years.map(({ year, events }, groupIndex) => {
                const band = (
                  <section aria-labelledby={`tl-${year}`} className="flex flex-col gap-4">
                    <div className="flex items-baseline justify-between border-y border-border py-3">
                      <h2
                        id={`tl-${year}`}
                        className="font-mono tabular text-2xl font-semibold tracking-wide text-foreground"
                      >
                        {year}
                      </h2>
                      <span className="font-mono text-mono-label tracking-wider text-foreground-subtle uppercase">
                        {events.length} {events.length === 1 ? "entry" : "entries"}
                      </span>
                    </div>

                    <LedgerList label={`Timeline ${year}`}>
                      {events.map((event) => (
                        <LedgerRow
                          key={`${event.date}-${event.title}`}
                          prefix="TL"
                          index={filing.get(`${event.date}-${event.title}`) ?? 0}
                          title={event.title}
                          href={event.ref}
                          timestamp={
                            formatDate(event.date, { month: "short", year: "numeric" }) ||
                            event.date
                          }
                          specs={[TYPE_LABEL[event.type], event.description]}
                        />
                      ))}
                    </LedgerList>
                  </section>
                );

                // The one calibration moment: the first (most recent) year band powers on.
                return groupIndex === 0 ? (
                  <Calibration key={year}>{band}</Calibration>
                ) : (
                  <div key={year}>{band}</div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}

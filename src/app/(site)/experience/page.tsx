// Experience — DATUM "THE LEDGER": one continuous hairline ledger of roles (EXP-###),
// newest first. Each row files role · company / stack · location, pins the start–end
// span as a mono coordinate, and unfolds highlights as indented orange-ticked mono lines.
import type { Metadata } from "next";
import { Fragment } from "react";

import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { LedgerList, LedgerRow } from "@/components/layout/ledger-row";
import { Calibration } from "@/components/motion/calibration";
import { experience } from "@/data/experience";
import { formatDate } from "@/utils/format-date";
import { buildMetadata } from "@/lib/metadata";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = buildMetadata({
  title: "Experience",
  description:
    "A timeline of the teams, roles, and product work that shaped how I build for the web.",
  path: ROUTES.experience,
});

function formatPeriod(value: string): string {
  if (value.trim().toLowerCase() === "present") return "Present";
  return formatDate(value, { month: "short", year: "numeric" }) || value;
}

export default function ExperiencePage() {
  return (
    <>
      <PageHero
        eyebrow="Index · EXP"
        title="Where I have worked"
        description="Roles, responsibilities, and the impact I delivered across product and creative engineering teams — filed newest first."
      />

      <Section index="01" label="Roles" rule>
        <Container>
          <SectionHeader
            eyebrow="Career log"
            title="Experience ledger"
            description="Every role, filed by index. Hover a row to trace it; each entry unfolds its highlights below."
          />
          <Calibration className="mt-10">
            <LedgerList
              label="Professional experience"
              header={
                <>
                  <span className="w-16 shrink-0">Index</span>
                  <span className="min-w-0 flex-1">Role · Company · Stack · Location</span>
                  <span className="hidden md:block">Period</span>
                </>
              }
            >
              {experience.map((item, i) => {
                const period = `${formatPeriod(item.start)} – ${formatPeriod(item.end)}`;
                const specs = [item.stack.join(" / "), item.location].filter(
                  (value): value is string => Boolean(value),
                );
                return (
                  <Fragment key={`${item.company}-${item.role}`}>
                    <LedgerRow
                      prefix="EXP"
                      index={i + 1}
                      title={
                        <>
                          {item.role}{" "}
                          <span className="text-foreground-muted">· {item.company}</span>
                        </>
                      }
                      specs={specs}
                      coordinate={period}
                    />
                    <li className="pb-6">
                      <div className="flex gap-4 md:gap-6">
                        <span aria-hidden="true" className="w-16 shrink-0" />
                        <div className="flex min-w-0 flex-1 flex-col gap-3">
                          <p className="text-sm text-foreground-muted">{item.summary}</p>
                          {item.highlights.length > 0 ? (
                            <ul className="flex flex-col gap-1.5">
                              {item.highlights.map((highlight) => (
                                <li
                                  key={highlight}
                                  className="flex gap-2.5 font-mono text-mono-meta text-foreground-muted"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="mt-2 h-px w-2.5 shrink-0 bg-signal"
                                  />
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  </Fragment>
                );
              })}
            </LedgerList>
          </Calibration>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}

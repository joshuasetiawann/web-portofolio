// Achievements — DATUM "THE LEDGER": a register of vitals (counts ticking up on
// calibration) above one continuous hairline ledger of recognitions (ACH-###),
// each row filing category · date, newest first.
import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { DefinitionList, type DefinitionItem } from "@/components/layout/definition-list";
import { LedgerList, LedgerRow } from "@/components/layout/ledger-row";
import { Calibration } from "@/components/motion/calibration";
import { TickCounter } from "@/components/motion/tick-counter";
import { EmptyState } from "@/components/shared/empty-state";
import { achievements } from "@/data/achievements";
import { formatDate } from "@/utils/format-date";
import { buildMetadata } from "@/lib/metadata";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = buildMetadata({
  title: "Achievements",
  description:
    "Awards, recognitions, and milestones — from Site of the Day honors to hackathon wins and open-source impact.",
  path: ROUTES.achievements,
});

export default function AchievementsPage() {
  const categoryCount = new Set(achievements.map((a) => a.category)).size;
  const awardCount = achievements.filter((a) => a.category === "Award").length;

  const vitals: DefinitionItem[] = [
    { field: "Recognitions", value: <TickCounter value={achievements.length} /> },
    { field: "Categories", value: <TickCounter value={categoryCount} /> },
    { field: "Awards", value: <TickCounter value={awardCount} /> },
  ];

  return (
    <>
      <PageHero
        eyebrow="Index · ACH"
        title="Recognition & milestones"
        description="Moments where the work was noticed — awards, community honors, and competition wins picked up along the way."
      />

      {achievements.length > 0 ? (
        <Section index="01" label="Register">
          <Container>
            <SectionHeader
              eyebrow="Register"
              title="Recognition vitals"
              description="The record at a glance — counts read out on calibration."
            />
            <Calibration className="mt-10">
              <DefinitionList items={vitals} layout="grid" />
            </Calibration>
          </Container>
        </Section>
      ) : null}

      <Section index="02" label="Index" rule>
        <Container>
          <SectionHeader
            eyebrow="Selected recognitions"
            title="Achievement ledger"
            description="Every recognition, filed by index. Hover a row to trace it."
          />
          <div className="mt-10">
            {achievements.length > 0 ? (
              <LedgerList
                label="Achievements"
                header={
                  <>
                    <span className="w-16 shrink-0">Index</span>
                    <span className="min-w-0 flex-1">Recognition · Category · Date</span>
                  </>
                }
              >
                {achievements.map((achievement, i) => (
                  <LedgerRow
                    key={`${achievement.title}-${achievement.date}`}
                    prefix="ACH"
                    index={i + 1}
                    title={achievement.title}
                    specs={[
                      achievement.category,
                      formatDate(achievement.date, { month: "short", year: "numeric" }) ||
                        achievement.date,
                    ]}
                    href={achievement.link}
                    external={Boolean(achievement.link)}
                  />
                ))}
              </LedgerList>
            ) : (
              <EmptyState
                title="No achievements yet"
                description="Recognitions and milestones will be listed here as they happen."
              />
            )}
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}

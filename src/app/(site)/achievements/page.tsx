import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { AchievementCard } from "@/components/portfolio/achievement-card";
import { StatCard } from "@/components/common/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { achievements } from "@/data/achievements";
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

  const stats = [
    { label: "Recognitions", value: String(achievements.length), icon: "Trophy" },
    { label: "Categories", value: String(categoryCount), icon: "LayoutGrid" },
    { label: "Awards", value: String(awardCount), icon: "Award" },
  ];

  return (
    <>
      <PageHero
        eyebrow="Achievements"
        title="Recognition & milestones"
        description="Moments where the work was noticed — awards, community honors, and competition wins picked up along the way."
      />

      {achievements.length > 0 ? (
        <Section>
          <Container>
            <Reveal>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <StatCard
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                  />
                ))}
              </dl>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container>
          <SectionHeader
            eyebrow="Highlights"
            title="Selected recognitions"
            description="A closer look at the awards and milestones that shaped the journey."
          />
          {achievements.length > 0 ? (
            <Reveal>
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {achievements.map((achievement) => (
                  <li key={`${achievement.title}-${achievement.date}`} className="flex">
                    <AchievementCard achievement={achievement} />
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : (
            <EmptyState
              title="No achievements yet"
              description="Recognitions and milestones will be listed here as they happen."
            />
          )}
        </Container>
      </Section>

      <CTASection />
    </>
  );
}

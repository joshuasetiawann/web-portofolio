import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { TimelineRail } from "@/components/portfolio/timeline-rail";
import { getTimelineByYear } from "@/data/timeline";
import { buildMetadata } from "@/lib/metadata";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = buildMetadata({
  title: "Timeline",
  description:
    "A year-by-year record of milestones, roles, launches, talks, and awards along the way.",
  path: ROUTES.timeline,
});

export default function TimelinePage() {
  const years = getTimelineByYear();

  return (
    <>
      <PageHero
        eyebrow="Timeline"
        title="Milestones over the years"
        description="The launches, roles, talks, and moments that mark the path so far — newest first."
      />

      <Section>
        <Container size="content">
          <TimelineRail groups={years} />
        </Container>
      </Section>

      <CTASection />
    </>
  );
}

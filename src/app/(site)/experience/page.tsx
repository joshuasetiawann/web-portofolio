import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { ExperienceCard } from "@/components/portfolio/experience-card";
import { experience } from "@/data/experience";
import { buildMetadata } from "@/lib/metadata";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = buildMetadata({
  title: "Experience",
  description:
    "A timeline of the teams, roles, and product work that shaped how I build for the web.",
  path: ROUTES.experience,
});

export default function ExperiencePage() {
  return (
    <>
      <PageHero
        eyebrow="Experience"
        title="Where I have worked"
        description="Roles, responsibilities, and the impact I delivered across product and creative engineering teams."
      />

      <Section>
        <Container size="content">
          <Reveal>
            <ol className="flex flex-col gap-6">
              {experience.map((item) => (
                <li key={`${item.company}-${item.role}`}>
                  <ExperienceCard item={item} />
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}

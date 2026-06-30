// Research — featured write-ups and an archive of notes, preprints, and explorations.
import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { ResearchCard } from "@/components/portfolio/research-card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { EmptyState } from "@/components/shared/empty-state";
import { getAllResearch, getFeaturedResearch, researchCategories } from "@/data/research";
import { buildMetadata } from "@/lib/metadata";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = buildMetadata({
  title: "Research",
  description:
    "Notes, preprints, and explorations across design engineering, graphics, and distributed systems — practical research that feeds back into the work.",
  path: ROUTES.research,
});

export default function ResearchPage() {
  const featured = getFeaturedResearch();
  const all = getAllResearch();

  return (
    <>
      <PageHero
        eyebrow="Research"
        title="Research & Explorations"
        description="Write-ups, preprints, and working notes where I dig into the problems behind the products — color science, GPU performance, and the architecture of realtime systems."
      >
        {researchCategories.length > 0 ? (
          <ul className="flex flex-wrap gap-2" aria-label="Research areas">
            {researchCategories.map((category) => (
              <li key={category}>
                <Badge variant="outline">{category}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </PageHero>

      {featured.length > 0 ? (
        <Section>
          <Container>
            <SectionHeader
              eyebrow="Featured"
              title="Highlighted work"
              description="The threads I keep pulling on."
            />
            <ul className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {featured.map((item, index) => (
                <li key={item.slug} className="flex">
                  <Reveal delay={Math.min(index, 4) * 0.05} className="flex w-full">
                    <ResearchCard item={item} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container>
          <SectionHeader
            eyebrow="Archive"
            title="All research"
            description="Every note and preprint, newest first."
          />
          <div className="mt-10">
            {all.length > 0 ? (
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {all.map((item, index) => (
                  <li key={item.slug} className="flex">
                    <Reveal delay={Math.min(index, 5) * 0.05} className="flex w-full">
                      <ResearchCard item={item} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={FlaskConical}
                title="No research published yet"
                description="Write-ups and preprints will appear here as they're released. Check back soon."
              />
            )}
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}

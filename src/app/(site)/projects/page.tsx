// Projects listing — featured case studies + a filterable grid of all work.
import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { FeaturedProjectCard } from "@/components/portfolio/featured-project-card";
import { ProjectFilter } from "@/components/portfolio/project-filter";
import { Reveal } from "@/components/motion/reveal";
import { getAllProjects, getFeaturedProjects, projectCategories } from "@/data/projects";
import { buildMetadata } from "@/lib/metadata";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Selected projects and case studies — design systems, web apps, creative WebGL, and open-source tooling.",
  path: ROUTES.projects,
});

export default function ProjectsPage() {
  const featured = getFeaturedProjects();
  const all = getAllProjects();

  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Selected Projects"
        description="Case studies spanning design systems, real-time web apps, immersive WebGL, and open-source tooling — each built to be fast, accessible, and considered."
      />

      {featured.length > 0 ? (
        <Section>
          <Container>
            <SectionHeader
              eyebrow="Featured"
              title="Highlighted case studies"
              description="A closer look at the work I'm most proud of."
            />
            <div className="mt-10 flex flex-col gap-8">
              {featured.map((project, index) => (
                <Reveal key={project.slug} delay={Math.min(index, 4) * 0.05}>
                  <FeaturedProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container>
          <SectionHeader
            eyebrow="All work"
            title="Browse every project"
            description="Filter by category to narrow the list."
          />
          <div className="mt-10">
            <ProjectFilter projects={all} categories={projectCategories} />
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}

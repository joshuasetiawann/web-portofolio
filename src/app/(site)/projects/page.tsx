// Projects index — DATUM "THE LEDGER": a collection-vitals readout above one
// continuous hairline ledger of every project (PRJ-###), filed by project order.
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
import { getAllProjects, projectCategories } from "@/data/projects";
import { buildMetadata } from "@/lib/metadata";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Selected projects and case studies — design systems, web apps, creative WebGL, and open-source tooling.",
  path: ROUTES.projects,
});

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  archived: "Archived",
  wip: "In progress",
};

export default function ProjectsPage() {
  const all = getAllProjects();
  const liveCount = all.filter((project) => project.status === "live").length;
  const featuredCount = all.filter((project) => project.featured).length;

  const vitals: DefinitionItem[] = [
    { field: "Total", value: <TickCounter value={all.length} /> },
    { field: "Live", value: <TickCounter value={liveCount} /> },
    { field: "Featured", value: <TickCounter value={featuredCount} /> },
    { field: "Categories", value: <TickCounter value={projectCategories.length} /> },
  ];

  return (
    <>
      <PageHero
        eyebrow="Index · PRJ"
        title="Selected Projects"
        description="Case studies spanning design systems, real-time web apps, immersive WebGL, and open-source tooling — each built to be fast, accessible, and considered."
      />

      <Section index="01" label="Summary">
        <Container>
          <SectionHeader
            eyebrow="Register"
            title="Collection vitals"
            description="The catalogue at a glance — counts read out on calibration."
          />
          <Calibration className="mt-10">
            <DefinitionList items={vitals} layout="grid" />
          </Calibration>
        </Container>
      </Section>

      <Section index="02" label="Index" rule>
        <Container>
          <SectionHeader
            eyebrow="All work"
            title="Project ledger"
            description="Every project, filed by index. Hover a row to trace it."
          />
          <div className="mt-10">
            <LedgerList
              label="All projects"
              header={
                <>
                  <span className="w-16 shrink-0">Index</span>
                  <span className="min-w-0 flex-1">Project · Stack · Year · Role</span>
                  <span className="hidden md:block">Category · Status</span>
                  <span>Metric</span>
                </>
              }
            >
              {all.map((project) => {
                const firstMetric = project.metrics?.[0];
                return (
                  <LedgerRow
                    key={project.slug}
                    prefix="PRJ"
                    index={project.order}
                    title={project.title}
                    href={`${ROUTES.projects}/${project.slug}`}
                    coordinate={`${project.category} · ${STATUS_LABEL[project.status] ?? project.status}`}
                    specs={[project.stack.join(" / "), String(project.year), project.role]}
                    metric={firstMetric ? { value: firstMetric.value } : undefined}
                  />
                );
              })}
            </LedgerList>
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}

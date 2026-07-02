// Landing — the SIGNAL scene (design baru handoff): one continuous page from
// Signal Field hero to contact, composed from the real data layer.
import { CapabilitiesSection } from "@/components/landing/capabilities-section";
import { ContactSection } from "@/components/landing/contact-section";
import { ExperienceSection } from "@/components/landing/experience-section";
import { GallerySection } from "@/components/landing/gallery-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingMarquee } from "@/components/landing/landing-marquee";
import { PhilosophySection } from "@/components/landing/philosophy-section";
import { StatementSection } from "@/components/landing/statement-section";
import { StatsStrip, type LandingStat } from "@/components/landing/stats-strip";
import { WorkSection } from "@/components/landing/work-section";
import { WritingSection } from "@/components/landing/writing-section";
import { JsonLd } from "@/components/shared/json-ld";

import { siteConfig } from "@/config/site";
import { experience } from "@/data/experience";
import { getAllProjects, getFeaturedProjects } from "@/data/projects";
import { getAllResearch } from "@/data/research";
import { getAllPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({ path: "/" });

const GRID_CARD_COUNT = 5;

function buildStats(): LandingStat[] {
  const firstYear = Math.min(...experience.map((item) => Number(item.start.slice(0, 4))));
  const years = Math.max(1, new Date().getFullYear() - firstYear);
  const projectCount = getAllProjects().length;
  const ossCount = getAllProjects().filter((project) => project.kind === "oss").length;
  const writingCount = getAllPosts().length + getAllResearch().length;

  return [
    {
      label: "Building since",
      value: `${years}+ yrs`,
      note: "From bare-metal kernels to multi-agent AI platforms.",
    },
    {
      label: "Projects shipped",
      value: String(projectCount),
      note: "Operating systems, AI workspaces, and production business apps.",
    },
    {
      label: "Open source",
      value: `${ossCount}+`,
      note: "Repositories and tools released in the open on GitHub.",
    },
    {
      label: "Writing & research",
      value: `${writingCount}+`,
      note: "Essays and research notes on AI, systems, and craft.",
    },
  ];
}

export default function HomePage() {
  const featured = getFeaturedProjects();
  const all = getAllProjects();
  const [lead, ...restFeatured] = featured;
  const gridProjects = [...restFeatured, ...all.filter((project) => !project.featured)].slice(
    0,
    GRID_CARD_COUNT,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteConfig.name,
        url: siteConfig.url,
        jobTitle: siteConfig.author.jobTitle,
        sameAs: [siteConfig.links.github],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        publisher: { "@id": `${siteConfig.url}/#person` },
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <LandingHeader />

      <main>
        <LandingHero />
        <StatsStrip stats={buildStats()} />
        <LandingMarquee />
        {lead ? <WorkSection lead={lead} rest={gridProjects} /> : null}
        <StatementSection />
        <PhilosophySection />
        <CapabilitiesSection />
        <ExperienceSection />
        <WritingSection />
        <GallerySection />
        <ContactSection />
      </main>

      <LandingFooter />
    </>
  );
}

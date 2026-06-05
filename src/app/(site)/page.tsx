import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Hero } from "@/components/sections/hero";
import { CTASection } from "@/components/sections/cta-section";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

import { StatCard } from "@/components/common/stat-card";
import { FeaturedProjectCard } from "@/components/portfolio/featured-project-card";
import { ProjectGrid } from "@/components/portfolio/project-grid";
import { ContentCard } from "@/components/portfolio/content-card";
import { TechStackList } from "@/components/portfolio/tech-stack-list";
import { ExperienceCard } from "@/components/portfolio/experience-card";
import { BlogGrid } from "@/components/portfolio/blog-grid";
import { ResearchCard } from "@/components/portfolio/research-card";
import { GalleryItem } from "@/components/portfolio/gallery-item";
import { JsonLd } from "@/components/shared/json-ld";

import { getAllProjects, getFeaturedProjects } from "@/data/projects";
import { getAllResearch, getFeaturedResearch } from "@/data/research";
import { experience } from "@/data/experience";
import { skills } from "@/data/skills";
import { gallery } from "@/data/gallery";
import { getAllPosts, getFeaturedPosts } from "@/lib/content";

import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({ path: "/" });

const PRINCIPLES = [
  {
    eyebrow: "01",
    title: "Performance is a feature",
    description:
      "Core Web Vitals are a design constraint, not an afterthought. Every interaction earns its frame budget on a mid-range phone.",
  },
  {
    eyebrow: "02",
    title: "Accessible by default",
    description:
      "Semantic markup, keyboard paths, and reduced-motion fallbacks ship from day one — not bolted on before launch.",
  },
  {
    eyebrow: "03",
    title: "Systems over screens",
    description:
      "Token-driven design systems and typed data layers keep large surfaces consistent, themeable, and cheap to evolve.",
  },
];

export default function HomePage() {
  const featured = getFeaturedProjects();
  const [lead, ...rest] = featured;

  const ossProjects = getAllProjects().filter((project) => project.kind === "oss");
  const recentExperience = experience.slice(0, 2);

  const featuredPosts = getFeaturedPosts();
  const blogPosts = (featuredPosts.length > 0 ? featuredPosts : getAllPosts()).slice(0, 3);
  const featuredResearch = getFeaturedResearch().slice(0, 2);
  const galleryPreview = gallery.slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteConfig.name,
        url: siteConfig.url,
        jobTitle: siteConfig.author.jobTitle,
        sameAs: [siteConfig.links.github, siteConfig.links.linkedin, siteConfig.links.twitter],
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

      <Hero />

      {/* Proof / stats strip */}
      <Section className="!pt-0">
        <Container>
          <dl className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            <StatCard
              icon="Briefcase"
              label="Building since"
              value="5+ yrs"
              description="Shipping production interfaces across startups and studios."
            />
            <StatCard
              icon="Rocket"
              label="Projects shipped"
              value={`${getAllProjects().length}+`}
              description="From design systems to immersive WebGL launches."
            />
            <StatCard
              icon="FolderGit2"
              label="Open source"
              value={`${ossProjects.length || 1}+`}
              description="Libraries and tools released for the community."
            />
            <StatCard
              icon="PenLine"
              label="Writing & research"
              value={`${getAllPosts().length + getAllResearch().length}+`}
              description="Essays and notes on craft, performance, and systems."
            />
          </dl>
        </Container>
      </Section>

      {/* Featured work */}
      <Section className="bg-surface-1/30">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Selected work"
              title="Featured projects"
              description="A few builds that capture how I approach design, engineering, and performance."
            />
            <Button asChild variant="outline" className="shrink-0">
              <Link href={ROUTES.projects}>
                See all work
                <ArrowRight />
              </Link>
            </Button>
          </div>

          {lead ? (
            <Reveal className="mt-10">
              <FeaturedProjectCard project={lead} />
            </Reveal>
          ) : null}

          {rest.length > 0 ? <ProjectGrid projects={rest} className="mt-8" /> : null}
        </Container>
      </Section>

      {/* Engineering philosophy preview */}
      <Section>
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="How I work"
              title="Engineering philosophy"
              description="The principles that guide every decision, from the first token to the final frame."
            />
            <Button asChild variant="ghost" className="shrink-0">
              <Link href={ROUTES.philosophy}>
                Read the philosophy
                <ArrowRight />
              </Link>
            </Button>
          </div>

          <Reveal className="mt-10">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              {PRINCIPLES.map((principle) => (
                <ContentCard
                  key={principle.eyebrow}
                  href={ROUTES.philosophy}
                  eyebrow={principle.eyebrow}
                  title={principle.title}
                  description={principle.description}
                />
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Capabilities / tech */}
      <Section className="bg-surface-1/30">
        <Container>
          <SectionHeader
            eyebrow="Capabilities"
            title="A pragmatic, modern toolkit"
            description="The languages, frameworks, and platforms I reach for to ship fast, accessible products."
          />

          <div className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-2">
            {skills.map((group) => (
              <div
                key={group.category}
                className="rounded-2xl border border-border bg-surface-1 p-6"
              >
                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                  {group.category}
                </h3>
                <TechStackList stack={group.items} className="mt-4" />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Experience preview */}
      <Section>
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Experience"
              title="Where I've been building"
              description="Recent roles where I led platform work, motion, and design-system efforts."
            />
            <Button asChild variant="ghost" className="shrink-0">
              <Link href={ROUTES.experience}>
                Full experience
                <ArrowRight />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-2">
            {recentExperience.map((item) => (
              <ExperienceCard key={`${item.company}-${item.role}`} item={item} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Open-source preview */}
      <Section className="bg-surface-1/30">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="In the open"
              title="Open-source work"
              description="Tools, libraries, and experiments I maintain and share publicly."
            />
            <div className="flex shrink-0 flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href={ROUTES.openSource}>Open source</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href={ROUTES.github}>
                  GitHub
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>

          {ossProjects.length > 0 ? (
            <ProjectGrid projects={ossProjects.slice(0, 3)} className="mt-10" />
          ) : (
            <div className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-2">
              <ContentCard
                href={ROUTES.openSource}
                eyebrow="Repositories"
                title="Browse the open-source catalogue"
                description="Design-system primitives, performance utilities, and creative-coding experiments."
              />
              <ContentCard
                href={ROUTES.github}
                external
                eyebrow="GitHub"
                title="Follow the work in progress"
                description="Commits, issues, and contribution activity, live from GitHub."
              />
            </div>
          )}
        </Container>
      </Section>

      {/* Writing & research preview */}
      <Section>
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Writing & research"
              title="Notes on the craft"
              description="Essays on engineering and design, plus deeper research into performance and systems."
            />
            <div className="flex shrink-0 flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href={ROUTES.blog}>
                  All writing
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href={ROUTES.research}>Research</Link>
              </Button>
            </div>
          </div>

          <div className="mt-10">
            <BlogGrid posts={blogPosts} />
          </div>

          {featuredResearch.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-2">
              {featuredResearch.map((item) => (
                <ResearchCard key={item.slug} item={item} />
              ))}
            </div>
          ) : null}
        </Container>
      </Section>

      {/* Gallery preview */}
      <Section className="bg-surface-1/30">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Gallery"
              title="Selected visuals"
              description="Stills and frames from interface work, motion studies, and creative coding."
            />
            <Button asChild variant="ghost" className="shrink-0">
              <Link href={ROUTES.gallery}>
                View gallery
                <ArrowRight />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {galleryPreview.map((item) => (
              <GalleryItem key={item.id} item={item} />
            ))}
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}

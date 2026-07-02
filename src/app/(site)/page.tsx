import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Hero } from "@/components/sections/hero";
import { TechMarquee } from "@/components/sections/tech-marquee";
import { StatementBand } from "@/components/sections/statement-band";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { DefinitionList } from "@/components/layout/definition-list";
import { LedgerList, LedgerRow } from "@/components/layout/ledger-row";
import { Calibration } from "@/components/motion/calibration";
import { TickCounter } from "@/components/motion/tick-counter";
import { Magnetic } from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";

import { FeaturedProjectCard } from "@/components/portfolio/featured-project-card";
import { TechStackList } from "@/components/portfolio/tech-stack-list";
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
import { formatDate } from "@/utils/format-date";

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
  const recentExperience = experience.slice(0, 3);

  const featuredPosts = getFeaturedPosts();
  const blogPosts = (featuredPosts.length > 0 ? featuredPosts : getAllPosts()).slice(0, 3);
  const featuredResearch = getFeaturedResearch().slice(0, 2);
  const galleryPreview = gallery.slice(0, 4);

  const projectCount = getAllProjects().length;
  const ossCount = ossProjects.length || 1;
  const writingCount = getAllPosts().length + getAllResearch().length;

  const stats = [
    {
      field: "Building since",
      value: (
        <span className="inline-flex items-baseline gap-1.5">
          <TickCounter value={5} />
          <span className="text-mono-label text-foreground-subtle">+ YRS</span>
        </span>
      ),
      numeric: true,
    },
    {
      field: "Projects shipped",
      value: (
        <span className="inline-flex items-baseline gap-1">
          <TickCounter value={projectCount} />
          <span className="text-mono-label text-foreground-subtle">+</span>
        </span>
      ),
      numeric: true,
    },
    {
      field: "Open source",
      value: (
        <span className="inline-flex items-baseline gap-1">
          <TickCounter value={ossCount} />
          <span className="text-mono-label text-foreground-subtle">+</span>
        </span>
      ),
      numeric: true,
    },
    {
      field: "Writing & research",
      value: (
        <span className="inline-flex items-baseline gap-1">
          <TickCounter value={writingCount} />
          <span className="text-mono-label text-foreground-subtle">+</span>
        </span>
      ),
      numeric: true,
    },
  ];

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

      {/* 01 — Hero (WebGL calibration field; component left intact) */}
      <Section id="hero" index="01" label="Reference instrument" className="!py-0">
        <Hero />
      </Section>

      {/* 02 — Signals / stats */}
      <Section id="signals" index="02" label="Signals" rule>
        <Container>
          <DefinitionList layout="grid" items={stats} />
        </Container>
      </Section>

      {/* 03 — Tech marquee (full-bleed capability band) */}
      <Section id="stack" index="03" label="Stack" className="!py-0">
        <TechMarquee />
      </Section>

      {/* 04 — Selected work */}
      <Section id="work" index="04" label="Selected work" rule>
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              index="01"
              eyebrow="Selected work"
              title="Real problems, measured outcomes."
              description="A few builds that show how I approach design, engineering, and performance — and the numbers they moved."
            />
            <Button asChild variant="outline" className="shrink-0">
              <Link href={ROUTES.contact}>
                Start a project
                <ArrowRight />
              </Link>
            </Button>
          </div>

          {lead ? (
            <Calibration className="mt-10">
              <FeaturedProjectCard project={lead} />
            </Calibration>
          ) : null}

          {rest.length > 0 ? (
            <LedgerList
              className="mt-8"
              label="Selected work"
              header={
                <>
                  <span className="w-16 shrink-0">Index</span>
                  <span className="min-w-0 flex-1">Project</span>
                  <span className="hidden shrink-0 md:block">Year</span>
                  <span className="w-4 shrink-0" aria-hidden="true" />
                </>
              }
            >
              {rest.map((project) => (
                <LedgerRow
                  key={project.slug}
                  prefix="PRJ"
                  index={project.order}
                  timestamp={String(project.year)}
                  title={project.title}
                  href={`/projects/${project.slug}`}
                  specs={[project.category, project.role]}
                />
              ))}
            </LedgerList>
          ) : null}
        </Container>
      </Section>

      {/* 05 — Statement band */}
      <Section id="point-of-view" index="05" label="Point of view" className="!py-0">
        <StatementBand />
      </Section>

      {/* 06 — Philosophy */}
      <Section id="philosophy" index="06" label="Principles" rule>
        <Container>
          <SectionHeader
            index="02"
            eyebrow="How I work"
            title="Principles I do not compromise on."
            description="The convictions that guide every decision, from the first token to the final frame."
          />

          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
            {PRINCIPLES.map((principle) => (
              <div key={principle.eyebrow} className="border-t border-border pt-6">
                <span className="font-mono tabular text-mono-metric-lg text-foreground-subtle">
                  {principle.eyebrow}
                </span>
                <h3 className="mt-5 font-display text-display-sm text-foreground">
                  {principle.title}
                </h3>
                <p className="mt-3 text-pretty text-foreground-muted">{principle.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 07 — Capabilities */}
      <Section id="capabilities" index="07" label="Capabilities" rule>
        <Container>
          <SectionHeader
            eyebrow="Capabilities"
            title="A pragmatic, modern toolkit."
            description="The languages, frameworks, and platforms I reach for to ship fast, accessible products."
          />

          <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2">
            {skills.map((group) => (
              <div key={group.category} className="border-t border-border pt-5">
                <p className="font-mono text-mono-label text-signal uppercase">{group.category}</p>
                <TechStackList stack={group.items} className="mt-4" />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 08 — Experience */}
      <Section id="experience" index="08" label="Experience" rule>
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              index="03"
              eyebrow="Experience"
              title="Where I have been building."
              description="Recent roles where I led platform work, motion, and design-system efforts."
            />
            <Button asChild variant="outline" className="shrink-0">
              <Link href={ROUTES.experience}>
                Full experience
                <ArrowRight />
              </Link>
            </Button>
          </div>

          <LedgerList
            className="mt-10"
            label="Experience"
            header={
              <>
                <span className="w-16 shrink-0">Index</span>
                <span className="min-w-0 flex-1">Role</span>
                <span className="hidden shrink-0 md:block">Tenure</span>
              </>
            }
          >
            {recentExperience.map((item, i) => (
              <LedgerRow
                key={`${item.company}-${item.role}`}
                prefix="EXP"
                index={i + 1}
                timestamp={`${item.start} – ${item.end}`}
                title={item.role}
                specs={[item.company, item.location].filter(Boolean) as string[]}
              />
            ))}
          </LedgerList>
        </Container>
      </Section>

      {/* 09 — Writing & research */}
      <Section id="writing" index="09" label="Writing & research" rule>
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              index="04"
              eyebrow="Writing & research"
              title="Notes on the craft."
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

          <LedgerList
            className="mt-10"
            label="Writing and research"
            header={
              <>
                <span className="w-16 shrink-0">Index</span>
                <span className="min-w-0 flex-1">Title</span>
                <span className="hidden shrink-0 md:block">Date</span>
                <span className="w-4 shrink-0" aria-hidden="true" />
              </>
            }
          >
            {blogPosts.map((post, i) => (
              <LedgerRow
                key={post.slug}
                prefix="NOTE"
                index={i + 1}
                timestamp={formatDate(post.date, { year: "numeric", month: "short" })}
                title={post.title}
                href={post.url}
                specs={[`${post.readingTime} MIN`, ...post.tags.slice(0, 1)]}
              />
            ))}
            {featuredResearch.map((item, i) => (
              <LedgerRow
                key={item.slug}
                prefix="RES"
                index={i + 1}
                timestamp={formatDate(item.date, { year: "numeric", month: "short" })}
                title={item.title}
                href={item.links.pdf ?? item.links.doi ?? item.links.code}
                external
                specs={[item.status.toUpperCase(), ...item.tags.slice(0, 1)]}
              />
            ))}
          </LedgerList>
        </Container>
      </Section>

      {/* 10 — Gallery */}
      <Section id="gallery" index="10" label="Gallery" rule>
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Gallery"
              title="Selected visuals."
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

      {/* 11 — Transmission / CTA */}
      <Section id="contact-cta" index="11" label="Transmission" rule>
        <Container>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Transmission"
              title="Let’s talk."
              description="Have a project that deserves the same care? Tell me what you’re building and where it’s stuck."
            />
            <Magnetic className="shrink-0">
              <Button asChild size="lg">
                <Link href={ROUTES.contact}>
                  Start a transmission
                  <ArrowRight />
                </Link>
              </Button>
            </Magnetic>
          </div>
        </Container>
      </Section>
    </>
  );
}

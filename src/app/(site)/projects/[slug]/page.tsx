// Project detail — DATUM "CASE STUDY": a DefinitionList spec header (+ synthetic COORD)
// above Archivo prose on a 720 measure, mono HOME / WORK / {slug} path, section rules +
// gutter ticks between gated blocks, the media figure as the one calibration moment, and
// metrics that count up once.
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Github } from "@/lib/icons";

import { CTASection } from "@/components/sections/cta-section";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { DefinitionList, type DefinitionItem } from "@/components/layout/definition-list";
import { GutterIndex } from "@/components/layout/gutter-index";
import { Rule } from "@/components/layout/rule";
import { LedgerList, LedgerRow } from "@/components/layout/ledger-row";
import { CoverPlate } from "@/components/portfolio/cover-plate";
import { TechStackList } from "@/components/portfolio/tech-stack-list";
import { Calibration } from "@/components/motion/calibration";
import { TickCounter } from "@/components/motion/tick-counter";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "@/components/shared/external-link";
import { JsonLd } from "@/components/shared/json-ld";
import { projects, getProjectBySlug, getRelatedProjects } from "@/data/projects";
import { buildMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  archived: "Archived",
  wip: "In progress",
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Not found" };
  }

  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `${ROUTES.projects}/${project.slug}`,
    type: "article",
  });
}

// Renders a metric string ("2.1s", "−60%", "<50ms") as a stepped count-up on the leading
// numeral while preserving any prefix/suffix. Falls back to the raw string if non-numeric.
function MetricValue({ value }: { value: string }) {
  const match = value.match(/^(\D*?)(-?\d+(?:\.\d+)?)(\D*)$/);
  if (!match) return <>{value}</>;
  const [, prefix, num, suffix] = match;
  return <TickCounter value={parseFloat(num)} prefix={prefix} suffix={suffix} group={false} />;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const related = getRelatedProjects(project.slug);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`${ROUTES.projects}/${project.slug}`),
    dateCreated: String(project.year),
    keywords: project.tags.join(", "),
    creator: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    ...(project.client ? { sourceOrganization: project.client } : {}),
    ...(project.links.live ? { sameAs: project.links.live } : {}),
  };

  // Synthetic filing coordinate for the spec header (instrument decoration).
  const coordinate = `${String(project.order).padStart(3, "0")} · ${project.year} · ${project.kind.toUpperCase()}`;

  const specItems: DefinitionItem[] = [
    { field: "Role", value: project.role },
    { field: "Year", value: String(project.year), numeric: true },
    { field: "Status", value: STATUS_LABEL[project.status] ?? project.status },
    ...(project.client ? [{ field: "Client", value: project.client }] : []),
    ...(project.team ? [{ field: "Team", value: project.team }] : []),
    ...(project.timeline ? [{ field: "Timeline", value: project.timeline }] : []),
    { field: "Coord", value: coordinate, numeric: true },
  ];

  // The one calibration moment: the media figure when present, else the metrics readout.
  const calibrateMedia = Boolean(project.media && project.media.length > 0);

  // Sequential gutter indices for whichever gated blocks actually render (hero = 01).
  let sectionCount = 1;
  const nextIndex = () => String(++sectionCount).padStart(2, "0");

  return (
    <>
      <JsonLd data={jsonLd} />

      <Section index="01" label="Spec" className="pt-24 sm:pt-28 lg:pt-32">
        <Container>
          <nav
            aria-label="Breadcrumb"
            className="font-mono text-mono-label tracking-wider text-foreground-subtle uppercase"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href={ROUTES.landing} className="transition-colors hover:text-signal">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={ROUTES.projects} className="transition-colors hover:text-signal">
                  Work
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">
                {project.slug}
              </li>
            </ol>
          </nav>

          <div className="mt-8 flex flex-col gap-6">
            <span className="inline-flex items-center gap-3 font-mono text-mono-eyebrow text-signal uppercase">
              <Rule signal />
              <GutterIndex prefix="PRJ" index={project.order} />
              <span className="text-foreground-subtle">{project.category}</span>
            </span>

            <h1 className="max-w-3xl font-display text-display-xl text-balance text-foreground">
              {project.title}
            </h1>

            <p className="max-w-2xl text-pretty text-foreground-muted">{project.summary}</p>

            <DefinitionList items={specItems} className="mt-2 max-w-2xl" />

            {project.stack.length > 0 ? (
              <TechStackList stack={project.stack} className="mt-2" />
            ) : null}

            {project.links.live || project.links.repo ? (
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                {project.links.live ? (
                  <Button asChild size="lg">
                    <ExternalLink href={project.links.live}>
                      View live
                      <ArrowUpRight aria-hidden="true" />
                    </ExternalLink>
                  </Button>
                ) : null}
                {project.links.repo ? (
                  <Button asChild size="lg" variant="outline">
                    <ExternalLink href={project.links.repo}>
                      <Github aria-hidden="true" />
                      Source code
                    </ExternalLink>
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </Container>
      </Section>

      {project.overview ? (
        <Section index={nextIndex()} label="Overview" rule>
          <Container size="prose">
            <SectionHeader eyebrow="Overview" title="What it is" />
            <p className="mt-6 text-pretty text-foreground-muted">{project.overview}</p>
          </Container>
        </Section>
      ) : null}

      {project.problem ? (
        <Section index={nextIndex()} label="Problem" rule>
          <Container size="prose">
            <SectionHeader eyebrow="Problem" title="The challenge" />
            <p className="mt-6 text-pretty text-foreground-muted">{project.problem}</p>
          </Container>
        </Section>
      ) : null}

      {project.role || (project.constraints && project.constraints.length > 0) ? (
        <Section index={nextIndex()} label="Constraints" rule>
          <Container size="prose">
            <SectionHeader eyebrow="Role & constraints" title="My part, and the limits" />
            <p className="mt-6 text-pretty text-foreground-muted">
              As <span className="text-foreground">{project.role}</span>, I owned delivery within a
              tight set of constraints.
            </p>
            {project.constraints && project.constraints.length > 0 ? (
              <ul className="mt-6 space-y-3">
                {project.constraints.map((constraint) => (
                  <li key={constraint} className="flex gap-3 text-foreground-muted">
                    <Rule signal className="mt-3 shrink-0" />
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Container>
        </Section>
      ) : null}

      {project.solution ? (
        <Section index={nextIndex()} label="Solution" rule>
          <Container size="prose">
            <SectionHeader eyebrow="Solution" title="The approach" />
            <p className="mt-6 text-pretty text-foreground-muted">{project.solution}</p>
          </Container>
        </Section>
      ) : null}

      {project.architecture ? (
        <Section index={nextIndex()} label="Architecture" rule>
          <Container size="prose">
            <SectionHeader eyebrow="Architecture" title="How it fits together" />
            <p className="mt-6 text-pretty text-foreground-muted">{project.architecture}</p>
          </Container>
        </Section>
      ) : null}

      {project.features && project.features.length > 0 ? (
        <Section index={nextIndex()} label="Features" rule>
          <Container>
            <SectionHeader eyebrow="Features" title="What it does" />
            <DefinitionList
              className="mt-8"
              items={project.features.map((feature) => ({
                field: feature.title,
                value: feature.description,
              }))}
            />
          </Container>
        </Section>
      ) : null}

      {project.media && project.media.length > 0 ? (
        <Section index={nextIndex()} label="Media" rule>
          <Container>
            <SectionHeader eyebrow="Media" title="A look inside" />
            <Calibration className="mt-10">
              {/* A lone figure spans the full measure — a half-filled 2-col grid reads as a hole. */}
              <ul
                className={
                  project.media.length > 1
                    ? "grid grid-cols-1 gap-6 sm:grid-cols-2"
                    : "grid grid-cols-1 gap-6"
                }
              >
                {project.media.map((item, index) => (
                  <li key={`${item.alt}-${index}`}>
                    <figure className="border border-border bg-surface-1">
                      <div
                        role="img"
                        aria-label={item.alt}
                        className="relative aspect-[16/10] w-full bg-surface-1"
                      >
                        {item.src && item.type !== "video" ? (
                          <Image
                            src={item.src}
                            alt=""
                            fill
                            sizes="(min-width: 640px) 50vw, 100vw"
                            className="object-cover"
                          />
                        ) : (
                          <CoverPlate prefix="FIG" index={index + 1} label={project.title} />
                        )}
                      </div>
                      {item.caption ? (
                        <figcaption className="border-t border-border px-4 py-3 font-mono text-mono-meta text-foreground-muted">
                          {item.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  </li>
                ))}
              </ul>
            </Calibration>
          </Container>
        </Section>
      ) : null}

      {project.metrics && project.metrics.length > 0 ? (
        <Section index={nextIndex()} label="Metrics" rule>
          <Container>
            <SectionHeader eyebrow="Metrics" title="The outcome" />
            {calibrateMedia ? (
              <DefinitionList
                className="mt-10"
                layout="grid"
                items={project.metrics.map((metric) => ({
                  field: metric.label,
                  value: <MetricValue value={metric.value} />,
                }))}
              />
            ) : (
              <Calibration className="mt-10">
                <DefinitionList
                  layout="grid"
                  items={project.metrics.map((metric) => ({
                    field: metric.label,
                    value: <MetricValue value={metric.value} />,
                  }))}
                />
              </Calibration>
            )}
          </Container>
        </Section>
      ) : null}

      {project.lessons && project.lessons.length > 0 ? (
        <Section index={nextIndex()} label="Reflection" rule>
          <Container size="prose">
            <SectionHeader eyebrow="Reflection" title="Lessons learned" />
            <ul className="mt-6 space-y-4">
              {project.lessons.map((lesson) => (
                <li key={lesson} className="flex gap-3 text-pretty text-foreground-muted">
                  <Rule signal className="mt-3 shrink-0" />
                  <span>{lesson}</span>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {project.tags.length > 0 ? (
        <Section rule>
          <Container>
            <ul className="flex flex-wrap gap-2 font-mono text-mono-label tracking-wider text-foreground-muted uppercase">
              {project.tags.map((tag) => (
                <li key={tag} className="border border-border px-3 py-1.5">
                  {tag}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {related.length > 0 ? (
        <Section index={nextIndex()} label="Related" rule>
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeader eyebrow="More work" title="Related projects" />
              <Button asChild variant="ghost" size="sm">
                <Link href={ROUTES.projects}>All projects</Link>
              </Button>
            </div>
            <div className="mt-10">
              <LedgerList label="Related projects">
                {related.map((item) => {
                  const firstMetric = item.metrics?.[0];
                  return (
                    <LedgerRow
                      key={item.slug}
                      prefix="PRJ"
                      index={item.order}
                      title={item.title}
                      href={`${ROUTES.projects}/${item.slug}`}
                      coordinate={`${item.category} · ${STATUS_LABEL[item.status] ?? item.status}`}
                      specs={[item.stack.join(" / "), String(item.year), item.role]}
                      metric={firstMetric ? { value: firstMetric.value } : undefined}
                    />
                  );
                })}
              </LedgerList>
            </div>
          </Container>
        </Section>
      ) : null}

      <CTASection />
    </>
  );
}

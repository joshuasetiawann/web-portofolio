// Project detail / case study — narrative sections gated on available content.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Github } from "@/lib/icons";

import { CTASection } from "@/components/sections/cta-section";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { ProjectGrid } from "@/components/portfolio/project-grid";
import { TechStackList } from "@/components/portfolio/tech-stack-list";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { StatCard } from "@/components/common/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "@/components/shared/external-link";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/motion/reveal";
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

  const meta: { label: string; value: string }[] = [
    { label: "Role", value: project.role },
    { label: "Year", value: String(project.year) },
    { label: "Status", value: STATUS_LABEL[project.status] ?? project.status },
    ...(project.client ? [{ label: "Client", value: project.client }] : []),
    ...(project.team ? [{ label: "Team", value: project.team }] : []),
    ...(project.timeline ? [{ label: "Timeline", value: project.timeline }] : []),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <Section className="pt-24 sm:pt-28 lg:pt-32">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: ROUTES.landing },
              { label: "Work", href: ROUTES.projects },
              { label: project.title },
            ]}
          />

          <div className="mt-8 flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs tracking-wider text-accent-2 uppercase">
              <span>{project.category}</span>
              <span aria-hidden="true" className="text-foreground-subtle">
                /
              </span>
              <span className="text-foreground-muted">
                {STATUS_LABEL[project.status] ?? project.status}
              </span>
            </div>

            <h1 className="max-w-3xl font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {project.title}
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-pretty text-foreground-muted sm:text-lg">
              {project.summary}
            </p>

            <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              {meta.map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5">
                  <dt className="font-mono text-xs tracking-wide text-foreground-subtle uppercase">
                    {item.label}
                  </dt>
                  <dd className="font-medium text-foreground">{item.value}</dd>
                </div>
              ))}
            </dl>

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
        <Section className="pt-0">
          <Container size="prose">
            <Reveal>
              <SectionHeader eyebrow="Overview" title="What it is" />
              <p className="mt-6 text-base leading-relaxed text-pretty text-foreground-muted sm:text-lg">
                {project.overview}
              </p>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {project.problem ? (
        <Section className="pt-0">
          <Container size="prose">
            <Reveal>
              <SectionHeader eyebrow="Problem" title="The challenge" />
              <p className="mt-6 text-base leading-relaxed text-pretty text-foreground-muted sm:text-lg">
                {project.problem}
              </p>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {project.role || (project.constraints && project.constraints.length > 0) ? (
        <Section className="pt-0">
          <Container size="prose">
            <Reveal>
              <SectionHeader eyebrow="Role & constraints" title="My part, and the limits" />
              <p className="mt-6 text-base leading-relaxed text-pretty text-foreground-muted sm:text-lg">
                As <span className="font-medium text-foreground">{project.role}</span>, I owned
                delivery within a tight set of constraints.
              </p>
              {project.constraints && project.constraints.length > 0 ? (
                <ul className="mt-6 space-y-3">
                  {project.constraints.map((constraint) => (
                    <li key={constraint} className="flex gap-3 text-base text-foreground-muted">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-2"
                      />
                      <span>{constraint}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {project.solution ? (
        <Section className="pt-0">
          <Container size="prose">
            <Reveal>
              <SectionHeader eyebrow="Solution" title="The approach" />
              <p className="mt-6 text-base leading-relaxed text-pretty text-foreground-muted sm:text-lg">
                {project.solution}
              </p>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {project.architecture ? (
        <Section className="pt-0">
          <Container size="prose">
            <Reveal>
              <SectionHeader eyebrow="Architecture" title="How it fits together" />
              <p className="mt-6 text-base leading-relaxed text-pretty text-foreground-muted sm:text-lg">
                {project.architecture}
              </p>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {project.features && project.features.length > 0 ? (
        <Section className="pt-0">
          <Container>
            <Reveal>
              <SectionHeader eyebrow="Features" title="What it does" />
              <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {project.features.map((feature) => (
                  <li
                    key={feature.title}
                    className="rounded-2xl border border-border bg-surface-1 p-6 transition-colors hover:border-border-strong"
                  >
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                      {feature.description}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {project.media && project.media.length > 0 ? (
        <Section className="pt-0">
          <Container>
            <Reveal>
              <SectionHeader eyebrow="Media" title="A look inside" />
              <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {project.media.map((item, index) => (
                  <li key={`${item.alt}-${index}`}>
                    <figure className="overflow-hidden rounded-2xl border border-border bg-surface-1">
                      <div
                        role="img"
                        aria-label={item.alt}
                        className="relative aspect-[16/10] w-full bg-gradient-to-br from-surface-2 to-surface-3"
                      >
                        <div
                          aria-hidden="true"
                          className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px]"
                        />
                      </div>
                      {item.caption ? (
                        <figcaption className="border-t border-border px-4 py-3 text-sm text-foreground-muted">
                          {item.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {project.metrics && project.metrics.length > 0 ? (
        <Section className="pt-0">
          <Container>
            <Reveal>
              <SectionHeader eyebrow="Metrics" title="The outcome" />
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {project.metrics.map((metric) => (
                  <StatCard key={metric.label} label={metric.label} value={metric.value} />
                ))}
              </div>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {project.lessons && project.lessons.length > 0 ? (
        <Section className="pt-0">
          <Container size="prose">
            <Reveal>
              <SectionHeader eyebrow="Reflection" title="Lessons learned" />
              <ul className="mt-6 space-y-4">
                {project.lessons.map((lesson) => (
                  <li
                    key={lesson}
                    className="flex gap-3 text-base leading-relaxed text-pretty text-foreground-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                    />
                    <span>{lesson}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {project.tags.length > 0 ? (
        <Section className="pt-0">
          <Container>
            <ul className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li key={tag}>
                  <Badge variant="outline" className="font-normal">
                    {tag}
                  </Badge>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {related.length > 0 ? (
        <Section>
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeader eyebrow="More work" title="Related projects" />
              <Button asChild variant="ghost" size="sm">
                <Link href={ROUTES.projects}>All projects</Link>
              </Button>
            </div>
            <div className="mt-10">
              <ProjectGrid projects={related} />
            </div>
          </Container>
        </Section>
      ) : null}

      <CTASection />
    </>
  );
}

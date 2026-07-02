// Selected work: featured lead card (cover + meta + metrics + stack + links)
// and the auto-fit grid of project cards, all fed from the real data layer.
import Image from "next/image";
import Link from "next/link";

import { LandingReveal as Reveal } from "./landing-reveal";
import type { Project } from "@/types/project";
import { LandingSectionHeader } from "./landing-section-header";
import { ScrollLink } from "./scroll-link";

const STATUS_LABEL: Record<Project["status"], string> = {
  live: "Live",
  wip: "In progress",
  archived: "Archived",
};

function StatusText({ status }: { status: Project["status"] }) {
  return (
    <span className={status === "live" ? "text-accent-2" : undefined}>{STATUS_LABEL[status]}</span>
  );
}

function Cover({ project, sizes }: { project: Project; sizes: string }) {
  if (!project.cover) return <div className="l-cover-fallback" aria-hidden="true" />;
  return (
    <Image
      src={project.cover}
      alt={`${project.title} — cover`}
      fill
      sizes={sizes}
      className="object-cover"
    />
  );
}

function FeaturedCard({ project }: { project: Project }) {
  const metrics = project.metrics?.slice(0, 3) ?? [];
  const caseStudyHref = project.links.caseStudy ?? `/projects/${project.slug}`;

  return (
    <div className="l-card-featured">
      <div className="relative min-h-[400px]">
        <Cover project={project} sizes="(max-width: 800px) 100vw, 50vw" />
        <div className="l-featured-chip">★ Featured project</div>
      </div>

      <div className="flex flex-col p-[clamp(28px,3vw,46px)]">
        <div className="l-meta-row">
          <span>{project.category}</span>
          <span className="text-border-strong">/</span>
          <span>{project.year}</span>
          <span className="text-border-strong">/</span>
          <StatusText status={project.status} />
        </div>

        <h3 className="font-sg mt-4 text-[clamp(1.7rem,2.7vw,2.4rem)] leading-[1.05] font-semibold tracking-[-0.02em] text-foreground">
          {project.title}
        </h3>
        <p className="mt-[15px] text-base leading-[1.65] text-foreground-muted">
          {project.summary}
        </p>

        {metrics.length > 0 ? (
          <div className="mt-[26px] grid grid-cols-3 gap-3.5 border-t border-border pt-[26px]">
            {metrics.map((metric, i) => (
              <div key={metric.label}>
                <div className={`l-metric-value ${i === metrics.length - 1 ? "l-grad-text" : ""}`}>
                  {metric.value}
                </div>
                <div className="l-metric-label">{metric.label}</div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((item) => (
            <span key={item} className="l-chip-round">
              {item}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-5 pt-7">
          {project.links.live ? (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="l-card-link l-card-link-primary"
            >
              Live <span className="text-[13px]">↗</span>
            </a>
          ) : null}
          {project.links.repo ? (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className={`l-card-link ${project.links.live ? "" : "l-card-link-primary"}`}
            >
              Repo <span className="text-[13px]">↗</span>
            </a>
          ) : null}
          <Link href={caseStudyHref} className="l-card-link">
            Case study <span className="text-sm">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link href={`/projects/${project.slug}`} className="l-card h-full">
      <div className="relative aspect-[16/10] border-b border-border">
        <Cover project={project} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        <div className="l-index-chip">/{String(index).padStart(2, "0")}</div>
      </div>
      <div className="flex flex-1 flex-col p-[22px]">
        <div className="font-gm text-[11px] tracking-[0.1em] text-foreground-subtle uppercase">
          {project.category} · {project.year}
        </div>
        <h4 className="font-sg mt-[11px] text-xl font-semibold tracking-[-0.01em] text-foreground">
          {project.title}
        </h4>
        <p className="mt-2.5 flex-1 text-sm leading-[1.6] text-foreground-muted">
          {project.summary}
        </p>
        <div className="mt-[18px] flex flex-wrap gap-[7px]">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="l-chip-round l-chip-dim">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function WorkSection({ lead, rest }: { lead: Project; rest: Project[] }) {
  return (
    <section id="work" className="l-section relative">
      <div className="l-container">
        <Reveal>
          <LandingSectionHeader
            eyebrow="Selected work — 01"
            title="Real problems, measured outcomes."
            action={
              <ScrollLink to="contact" className="l-pill-action">
                Start a project <span>→</span>
              </ScrollLink>
            }
          />
        </Reveal>

        <Reveal amount={0.15}>
          <FeaturedCard project={lead} />
        </Reveal>

        <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
          {rest.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.07} amount={0.15} className="h-full">
              <ProjectCard project={project} index={i + 2} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

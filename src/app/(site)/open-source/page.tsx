// Open Source — contribution philosophy, repository highlights, packages, and community involvement.
import type { Metadata } from "next";
import Link from "next/link";
import { Github } from "@/lib/icons";
import { GitFork } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { ProjectCard } from "@/components/portfolio/project-card";
import { ContentCard } from "@/components/portfolio/content-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { EmptyState } from "@/components/shared/empty-state";
import { ExternalLink } from "@/components/shared/external-link";
import { projects } from "@/data/projects";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = buildMetadata({
  title: "Open Source",
  description:
    "How I think about open source — the repositories I maintain, the packages and tools I publish, and the communities I contribute to.",
  path: ROUTES.openSource,
});

const PACKAGES = [
  {
    title: "ledger",
    href: "https://github.com/joshuasetiawan/ledger",
    eyebrow: "CLI toolkit",
    description:
      "A zero-config, type-safe CLI toolkit with first-class TypeScript inference and Zod-validated commands.",
    meta: "TypeScript · MIT",
    tags: ["CLI", "TypeScript", "Zod"],
  },
  {
    title: "oklch-ramps",
    href: "https://github.com/joshuasetiawan/oklch-ramps",
    eyebrow: "Color utility",
    description:
      "Generate perceptually-even OKLCH color ramps that hold contrast across light and dark themes.",
    meta: "TypeScript · MIT",
    tags: ["Color", "OKLCH", "Accessibility"],
  },
  {
    title: "particle-budget",
    href: "https://github.com/joshuasetiawan/particle-budget",
    eyebrow: "WebGL helper",
    description:
      "Frame-budget scheduling primitives for keeping instanced GPU particle systems inside a target FPS.",
    meta: "TypeScript · MIT",
    tags: ["WebGL", "Performance", "Shaders"],
  },
];

const HIGHLIGHTS = [
  {
    title: "radix-ui",
    href: "https://github.com/radix-ui/primitives",
    eyebrow: "Contributor",
    description:
      "Accessibility fixes and documentation improvements across the headless primitive library.",
    meta: "Upstream contributions",
    tags: ["Accessibility", "React"],
  },
  {
    title: "next.js",
    href: "https://github.com/vercel/next.js",
    eyebrow: "Contributor",
    description: "Bug reports and small patches around the App Router and metadata APIs.",
    meta: "Upstream contributions",
    tags: ["Next.js", "Tooling"],
  },
];

export default function OpenSourcePage() {
  const ossProjects = projects.filter((project) => project.kind === "oss");

  return (
    <>
      <PageHero
        eyebrow="Open Source"
        title="Building in the Open"
        description="Open source is how I learn fastest and give back most. I maintain a handful of focused libraries, contribute upstream where I can, and try to leave every codebase I touch a little more accessible than I found it."
        actions={
          <>
            <Button asChild>
              <ExternalLink href={siteConfig.links.github}>
                <Github aria-hidden="true" />
                View GitHub profile
              </ExternalLink>
            </Button>
            <Button asChild variant="outline">
              <Link href={ROUTES.github}>GitHub activity</Link>
            </Button>
          </>
        }
      />

      <Section>
        <Container size="prose">
          <SectionHeader
            eyebrow="Philosophy"
            title="How I contribute"
            description="A few principles that guide the work I share publicly."
          />
          <div className="mt-8 space-y-4 text-base leading-relaxed text-pretty text-foreground-muted">
            <p>
              I publish things I actually use. Every library here started as a real problem in real
              product work — extracted, hardened, and documented only once it earned its keep. That
              keeps the surface area small and the APIs honest.
            </p>
            <p>
              Accessibility and developer experience are not afterthoughts. A tool that ships
              keyboard support, sensible defaults, and a readable error the first time it&apos;s
              wrong is worth more than one with twice the features and half the care.
            </p>
            <p>
              Maintenance is part of the promise. I&apos;d rather support a few projects well —
              triaging issues, keeping changelogs honest, and reviewing contributions with patience
              — than abandon a long list of half-finished repos.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-surface-1/40">
        <Container>
          <SectionHeader
            eyebrow="Repositories"
            title="Project highlights"
            description="Open-source projects I maintain, plus a couple of upstream codebases I contribute to."
          />
          <div className="mt-10 space-y-8">
            {ossProjects.length > 0 ? (
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {ossProjects.map((project, index) => (
                  <li key={project.slug} className="flex">
                    <Reveal delay={Math.min(index, 5) * 0.05} className="flex w-full">
                      <ProjectCard project={project} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={GitFork}
                title="No open-source projects yet"
                description="Maintained repositories will be listed here as they go public."
              />
            )}

            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {HIGHLIGHTS.map((item, index) => (
                <li key={item.href} className="flex">
                  <Reveal delay={Math.min(index, 4) * 0.05} className="flex w-full">
                    <ContentCard
                      href={item.href}
                      title={item.title}
                      description={item.description}
                      eyebrow={item.eyebrow}
                      meta={item.meta}
                      tags={item.tags}
                      external
                    />
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow="Packages & tools"
            title="Published on npm"
            description="Small, focused packages you can drop into your own projects."
          />
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PACKAGES.map((pkg, index) => (
              <li key={pkg.href} className="flex">
                <Reveal delay={Math.min(index, 5) * 0.05} className="flex w-full">
                  <ContentCard
                    href={pkg.href}
                    title={pkg.title}
                    description={pkg.description}
                    eyebrow={pkg.eyebrow}
                    meta={pkg.meta}
                    tags={pkg.tags}
                    external
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="bg-surface-1/40">
        <Container>
          <Reveal>
            <div className="flex flex-col items-start gap-6 rounded-2xl border border-border bg-surface-1 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-semibold text-balance text-foreground">
                  Want to collaborate or contribute?
                </h2>
                <p className="max-w-xl text-base leading-relaxed text-pretty text-foreground-muted">
                  Issues, pull requests, and ideas are always welcome. Browse the repositories, open
                  a discussion, or follow along with what I&apos;m shipping next.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild>
                  <ExternalLink href={siteConfig.links.github}>
                    <Github aria-hidden="true" />
                    Star on GitHub
                  </ExternalLink>
                </Button>
                <Button asChild variant="outline">
                  <Link href={ROUTES.github}>See live activity</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container size="prose">
          <SectionHeader
            eyebrow="Community"
            title="Beyond the code"
            description="Contribution isn't only commits."
          />
          <div className="mt-8 space-y-4 text-base leading-relaxed text-pretty text-foreground-muted">
            <p>
              I help run a local frontend meetup, where I&apos;ve given talks on accessible motion
              and color systems for dark interfaces. Teaching forces me to understand things deeply
              enough to explain them simply.
            </p>
            <p>
              Much of my best work happens in the margins — reviewing pull requests, answering
              questions in issue threads, and mentoring newer contributors through their first
              merged change. Lowering the barrier to that first contribution is some of the
              highest-leverage work in any community.
            </p>
            <p>
              If you maintain a project I rely on and want a second pair of hands, or you&apos;re
              looking for a mentor for your first open-source PR, reach out — I&apos;m glad to help.
            </p>
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}

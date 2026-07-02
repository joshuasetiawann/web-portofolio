// Open Source — DATUM datasheet: prose philosophy (720 measure) interleaved with hairline
// ledger bands — OSS-### maintained repos, PKG-### published packages, PR-### upstream
// contributions. The "collaborate" callout is the route's single calibration moment: a
// rule draws in and one orange scan-line sweeps the panel.
import type { Metadata } from "next";
import Link from "next/link";
import { Github } from "@/lib/icons";
import { GitFork } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { LedgerList, LedgerRow } from "@/components/layout/ledger-row";
import { Calibration } from "@/components/motion/calibration";
import { ScanLine } from "@/components/motion/scan-line";
import { EmptyState } from "@/components/shared/empty-state";
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

// Hairline mono button — flush-square, no fill, orange on hover/focus.
const buttonClass =
  "inline-flex items-center gap-2 border border-border px-4 py-2.5 font-mono text-mono-label text-foreground uppercase transition-colors hover:border-border-strong hover:text-signal focus-visible:border-signal focus-visible:outline-none";

export default function OpenSourcePage() {
  const ossProjects = projects.filter((project) => project.kind === "oss");

  return (
    <>
      <PageHero
        eyebrow="Index · OSS"
        title="Building in the Open"
        description="Open source is how I learn fastest and give back most. I maintain a handful of focused libraries, contribute upstream where I can, and try to leave every codebase I touch a little more accessible than I found it."
        actions={
          <>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass}
            >
              <Github className="size-4" aria-hidden="true" />
              GitHub profile
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <Link href={ROUTES.github} className={buttonClass}>
              GitHub activity
            </Link>
          </>
        }
      />

      {/* 01 — Philosophy */}
      <Section index="01" label="Philosophy">
        <Container size="prose">
          <SectionHeader
            eyebrow="Philosophy"
            title="How I contribute"
            description="A few principles that guide the work I share publicly."
          />
          <div className="mt-8 space-y-4 text-pretty text-foreground-muted">
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

      {/* 02 — Maintained repositories */}
      <Section index="02" label="Repositories" rule>
        <Container>
          <SectionHeader
            eyebrow="Repositories"
            title="Maintained repositories"
            description="Open-source projects I maintain, filed by index."
          />
          <div className="mt-10">
            {ossProjects.length > 0 ? (
              <LedgerList
                label="Maintained open-source repositories"
                header={
                  <>
                    <span className="w-16 shrink-0">Index</span>
                    <span className="min-w-0 flex-1">Repository · Role · Stack</span>
                    <span className="hidden md:block">Since</span>
                  </>
                }
              >
                {ossProjects.map((project, i) => (
                  <LedgerRow
                    key={project.slug}
                    prefix="OSS"
                    index={i + 1}
                    title={project.title}
                    href={
                      project.links.repo ??
                      project.links.live ??
                      `${ROUTES.projects}/${project.slug}`
                    }
                    external={Boolean(project.links.repo ?? project.links.live)}
                    specs={[project.role, project.stack.join(" / ")].filter(Boolean)}
                    coordinate={String(project.year)}
                  />
                ))}
              </LedgerList>
            ) : (
              <EmptyState
                icon={GitFork}
                title="No open-source projects yet"
                description="Maintained repositories will be listed here as they go public."
              />
            )}
          </div>
        </Container>
      </Section>

      {/* 03 — Published packages */}
      <Section index="03" label="Packages" rule>
        <Container>
          <SectionHeader
            eyebrow="Packages & tools"
            title="Published on npm"
            description="Small, focused packages you can drop into your own projects."
          />
          <div className="mt-10">
            <LedgerList
              label="Published packages"
              header={
                <>
                  <span className="w-16 shrink-0">Index</span>
                  <span className="min-w-0 flex-1">Package · Kind · License</span>
                </>
              }
            >
              {PACKAGES.map((pkg, i) => (
                <LedgerRow
                  key={pkg.href}
                  prefix="PKG"
                  index={i + 1}
                  title={pkg.title}
                  href={pkg.href}
                  external
                  specs={[pkg.eyebrow, pkg.meta].filter(Boolean)}
                />
              ))}
            </LedgerList>
          </div>
        </Container>
      </Section>

      {/* 04 — Upstream contributions */}
      <Section index="04" label="Upstream" rule>
        <Container>
          <SectionHeader
            eyebrow="Upstream"
            title="Contributions upstream"
            description="Codebases I contribute to — fixes, docs, and small patches."
          />
          <div className="mt-10">
            <LedgerList
              label="Upstream contributions"
              header={
                <>
                  <span className="w-16 shrink-0">Index</span>
                  <span className="min-w-0 flex-1">Project · Role · Detail</span>
                </>
              }
            >
              {HIGHLIGHTS.map((item, i) => (
                <LedgerRow
                  key={item.href}
                  prefix="PR"
                  index={i + 1}
                  title={item.title}
                  href={item.href}
                  external
                  specs={[item.eyebrow, item.description].filter(Boolean)}
                />
              ))}
            </LedgerList>
          </div>
        </Container>
      </Section>

      {/* Collaborate callout — the route's single calibration moment */}
      <Section rule>
        <Container>
          <Calibration>
            <div className="border border-border p-8 sm:p-10">
              <ScanLine className="mb-8" />
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-xl space-y-2">
                  <h2 className="font-display text-display-md text-balance text-foreground">
                    Want to collaborate or contribute?
                  </h2>
                  <p className="text-pretty text-foreground-muted">
                    Issues, pull requests, and ideas are always welcome. Browse the repositories,
                    open a discussion, or follow along with what I&apos;m shipping next.
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass}
                  >
                    <Github className="size-4" aria-hidden="true" />
                    Star on GitHub
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                  <Link href={ROUTES.github} className={buttonClass}>
                    See live activity
                  </Link>
                </div>
              </div>
            </div>
          </Calibration>
        </Container>
      </Section>

      {/* 05 — Community */}
      <Section index="05" label="Community" rule>
        <Container size="prose">
          <SectionHeader
            eyebrow="Community"
            title="Beyond the code"
            description="Contribution isn't only commits."
          />
          <div className="mt-8 space-y-4 text-pretty text-foreground-muted">
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

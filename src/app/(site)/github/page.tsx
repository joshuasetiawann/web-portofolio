// GitHub — DATUM "THE INSTRUMENT PANEL": a stack of hairline modules, no cards/fills.
// 01 Identity → 02 Vitals (DefinitionList + count-up) → 03 Repository ledger (REPO-###)
// → 04 Language spectrum (all graphite, only the top language Signal Orange) → 05 Activity
// log. Async data flow is unchanged; Error/Empty degrade to instrument fault readouts.
import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";

import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Rule } from "@/components/layout/rule";
import { DefinitionList } from "@/components/layout/definition-list";
import { LedgerList, LedgerRow } from "@/components/layout/ledger-row";
import { Calibration } from "@/components/motion/calibration";
import { TickCounter } from "@/components/motion/tick-counter";
import { getGitHubUser, getGitHubRepos } from "@/lib/github";
import { getTopRepos, getLanguageStats, summarizeRepoStats } from "@/lib/github-stats";
import { buildMetadata } from "@/lib/metadata";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "GitHub",
  description:
    "A live snapshot of my open-source activity — profile, repository highlights, language distribution, and recent commits straight from the GitHub API.",
  path: ROUTES.github,
});

// Instrument fault readout — a hairline panel that reports a data outage as telemetry.
function FaultReadout({
  code,
  signal,
  title,
  description,
  role,
}: {
  code: string;
  signal: string;
  title: string;
  description: string;
  role?: "alert";
}) {
  return (
    <div role={role} className="border border-border p-8 sm:p-10">
      <span className="inline-flex items-center gap-3 font-mono text-mono-label text-signal uppercase">
        <Rule signal />
        <span className="tabular">{code}</span>
        <span className="text-foreground-subtle">· {signal}</span>
      </span>
      <p className="mt-5 font-display text-display-sm text-foreground">{title}</p>
      <p className="mt-2 max-w-[720px] text-pretty text-foreground-muted">{description}</p>
    </div>
  );
}

export default async function GitHubPage() {
  const [user, repos] = await Promise.all([getGitHubUser(), getGitHubRepos()]);

  if (!user) {
    return (
      <>
        <PageHero
          eyebrow="GitHub"
          title="Live from GitHub"
          description="Profile, repositories, and recent activity pulled directly from the GitHub API."
        />
        <Section index="01" label="Fault" rule>
          <Container size="wide">
            <FaultReadout
              role="alert"
              code="ERR 503"
              signal="SIGNAL LOST"
              title="Could not load GitHub data"
              description="The GitHub API is unavailable or rate-limited right now. Telemetry will resume when the feed reconnects — check back soon."
            />
          </Container>
        </Section>
      </>
    );
  }

  const summary = summarizeRepoStats(repos);
  const topRepos = getTopRepos(repos, 6);
  const languages = getLanguageStats(repos);
  const recentRepos = [...repos]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const vitals: { field: string; value: ReactNode }[] = [
    { field: "Followers", value: <TickCounter value={user.followers} /> },
    { field: "Following", value: <TickCounter value={user.following} /> },
    { field: "Public repos", value: <TickCounter value={user.publicRepos} /> },
    { field: "Total stars", value: <TickCounter value={summary.totalStars} /> },
    { field: "Total forks", value: <TickCounter value={summary.totalForks} /> },
  ];

  return (
    <>
      <PageHero
        eyebrow="GitHub"
        title="Live from GitHub"
        description="Profile, repositories, and recent activity pulled directly from the GitHub API."
      />

      {/* 01 — Identity */}
      <Section index="01" label="Identity" rule>
        <Container size="wide">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
            <Image
              src={user.avatarUrl}
              alt={`${user.name}'s GitHub avatar`}
              width={112}
              height={112}
              className="size-28 shrink-0 rounded-none border border-border"
            />
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 font-mono text-mono-eyebrow text-signal uppercase">
                <Rule signal />
                Identity
              </span>
              <h2 className="mt-3 font-display text-display-lg text-balance text-foreground">
                {user.name}
              </h2>
              <p className="mt-1 font-mono tabular text-mono-meta text-foreground-subtle">
                @{user.login}
              </p>
              {user.bio ? (
                <p className="mt-4 max-w-[720px] text-pretty text-foreground-muted">{user.bio}</p>
              ) : null}
              <a
                href={user.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-fit items-center gap-2 border border-border px-4 py-2.5 font-mono text-mono-label text-foreground uppercase transition-colors hover:border-border-strong hover:text-signal focus-visible:border-signal focus-visible:outline-none"
              >
                View profile →<span className="sr-only"> (opens in new tab)</span>
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* 02 — Vitals */}
      <Section index="02" label="Vitals" rule>
        <Container size="wide">
          <SectionHeader
            eyebrow="Vitals"
            title="Signal readout"
            description="Live counts pulled from the GitHub API, tallied on load."
          />
          <Calibration className="mt-10">
            <DefinitionList layout="grid" items={vitals} />
          </Calibration>
        </Container>
      </Section>

      {/* 03 — Repository ledger */}
      <Section index="03" label="Repositories" rule>
        <Container size="wide">
          <SectionHeader
            eyebrow="Repositories"
            title="Repository highlights"
            description="A selection of my most-starred public repositories, filed by stars."
          />
          <div className="mt-10">
            {topRepos.length === 0 ? (
              <FaultReadout
                code="NIL 000"
                signal="NO SIGNAL"
                title="No public repositories yet"
                description="There are no public repositories to show right now. Check back soon."
              />
            ) : (
              <LedgerList
                label="Repository highlights"
                header={
                  <>
                    <span className="w-16 shrink-0">Index</span>
                    <span className="min-w-0 flex-1">Repository · Stars · Forks · Language</span>
                  </>
                }
              >
                {topRepos.map((repo, i) => (
                  <LedgerRow
                    key={repo.name}
                    prefix="REPO"
                    index={i + 1}
                    title={repo.name}
                    href={repo.url}
                    external
                    specs={[
                      `★ ${repo.stars.toLocaleString("en-US")}`,
                      `⑂ ${repo.forks.toLocaleString("en-US")}`,
                      repo.language,
                    ].filter(Boolean)}
                  />
                ))}
              </LedgerList>
            )}
          </div>
        </Container>
      </Section>

      {/* 04 — Language spectrum */}
      {languages.length > 0 ? (
        <Section index="04" label="Languages" rule>
          <Container size="wide">
            <SectionHeader
              eyebrow="Languages"
              title="Language spectrum"
              description="Distribution across my public repositories — the dominant language holds the live trace."
            />
            <dl className="mt-10 border-t border-border">
              {languages.map((language, i) => (
                <div
                  key={language.name}
                  className="flex flex-col gap-2.5 border-b border-border py-4"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-mono text-mono-label text-foreground uppercase">
                      {language.name}
                    </dt>
                    <dd className="font-mono tabular text-mono-meta text-foreground-muted">
                      {language.percentage}%
                    </dd>
                  </div>
                  <div className="h-2 w-full" role="presentation">
                    <span
                      className={cn("block h-full", i === 0 ? "bg-signal" : "bg-rule")}
                      style={{ width: `${language.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </dl>
          </Container>
        </Section>
      ) : null}

      {/* 05 — Activity log */}
      {recentRepos.length > 0 ? (
        <Section index="05" label="Activity" rule>
          <Container size="wide">
            <SectionHeader
              eyebrow="Activity"
              title="Activity log"
              description="The repositories I've pushed to most recently, timestamped."
            />
            <div className="mt-10">
              <LedgerList
                label="Recently updated repositories"
                header={
                  <>
                    <span className="w-16 shrink-0">Index</span>
                    <span className="min-w-0 flex-1">Repository · Language · Detail</span>
                    <span className="hidden md:block">Updated</span>
                  </>
                }
              >
                {recentRepos.map((repo, i) => (
                  <LedgerRow
                    key={repo.name}
                    prefix="REPO"
                    index={i + 1}
                    title={repo.name}
                    href={repo.url}
                    external
                    specs={[repo.language, repo.description].filter(Boolean)}
                    timestamp={formatDate(repo.updatedAt)}
                  />
                ))}
              </LedgerList>
            </div>
          </Container>
        </Section>
      ) : null}

      <CTASection
        title="Like what you see?"
        description="Browse the source, star a repo, or reach out to collaborate."
      />
    </>
  );
}

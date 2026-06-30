import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { GitHubStatsCard } from "@/components/portfolio/github-stats-card";
import { ContentCard } from "@/components/portfolio/content-card";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { getGitHubUser, getGitHubRepos } from "@/lib/github";
import { getTopRepos, getLanguageStats, summarizeRepoStats } from "@/lib/github-stats";
import { buildMetadata } from "@/lib/metadata";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/utils/format-date";

export const metadata: Metadata = buildMetadata({
  title: "GitHub",
  description:
    "A live snapshot of my open-source activity — profile, repository highlights, language distribution, and recent commits straight from the GitHub API.",
  path: ROUTES.github,
});

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
        <Section>
          <Container>
            <ErrorState
              title="Could not load GitHub data"
              description="The GitHub API is unavailable or rate-limited right now. Check back soon."
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

  return (
    <>
      <PageHero
        eyebrow="GitHub"
        title="Live from GitHub"
        description="Profile, repositories, and recent activity pulled directly from the GitHub API."
      />

      {/* Profile summary */}
      <Section className="pt-0">
        <Container>
          <Reveal>
            <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface-1 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
              <Image
                src={user.avatarUrl}
                alt={`${user.name}'s GitHub avatar`}
                width={80}
                height={80}
                className="size-20 shrink-0 rounded-full border border-border"
              />
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                    {user.name}
                  </h2>
                  <span className="font-mono text-sm text-foreground-subtle">@{user.login}</span>
                </div>
                {user.bio ? (
                  <p className="max-w-2xl text-sm text-pretty text-foreground-muted">{user.bio}</p>
                ) : null}
                <a
                  href={user.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground focus-visible:underline focus-visible:outline-none"
                >
                  View full profile
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Stats row */}
      <Section className="pt-0">
        <Container>
          <SectionHeader eyebrow="At a glance" title="Profile statistics" />
          <Reveal>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <GitHubStatsCard
                label="Followers"
                value={user.followers.toLocaleString()}
                icon="Users"
              />
              <GitHubStatsCard
                label="Following"
                value={user.following.toLocaleString()}
                icon="User"
              />
              <GitHubStatsCard
                label="Public repos"
                value={user.publicRepos.toLocaleString()}
                icon="FolderGit2"
              />
              <GitHubStatsCard
                label="Total stars"
                value={summary.totalStars.toLocaleString()}
                icon="Star"
              />
              <GitHubStatsCard
                label="Total forks"
                value={summary.totalForks.toLocaleString()}
                icon="GitFork"
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Repository highlights */}
      <Section className="pt-0">
        <Container>
          <SectionHeader
            eyebrow="Repositories"
            title="Repository highlights"
            description="A selection of my most-starred public repositories."
          />
          {repos.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="No public repositories yet"
                description="There are no public repositories to show right now. Check back soon."
              />
            </div>
          ) : (
            <Reveal>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {topRepos.map((repo) => (
                  <ContentCard
                    key={repo.name}
                    href={repo.url}
                    external
                    title={repo.name}
                    description={repo.description}
                    meta={`★ ${repo.stars.toLocaleString()}`}
                    tags={repo.topics.slice(0, 3)}
                  />
                ))}
              </div>
            </Reveal>
          )}
        </Container>
      </Section>

      {/* Language distribution */}
      {languages.length > 0 ? (
        <Section className="pt-0">
          <Container>
            <SectionHeader
              eyebrow="Languages"
              title="Language distribution"
              description="The languages I reach for most across my public repositories."
            />
            <Reveal>
              <ul className="mt-8 flex flex-col gap-5 rounded-2xl border border-border bg-surface-1 p-6 sm:p-8">
                {languages.map((language) => (
                  <li key={language.name} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium text-foreground">
                        <span
                          aria-hidden="true"
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: language.color }}
                        />
                        {language.name}
                      </span>
                      <span className="font-mono text-foreground-muted tabular-nums">
                        {language.percentage}%
                      </span>
                    </div>
                    <div
                      className="h-2 w-full overflow-hidden rounded-full bg-surface-2"
                      role="presentation"
                    >
                      <span
                        className="block h-full rounded-full"
                        style={{
                          width: `${language.percentage}%`,
                          backgroundColor: language.color,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* Activity overview */}
      {recentRepos.length > 0 ? (
        <Section className="pt-0">
          <Container>
            <SectionHeader
              eyebrow="Activity"
              title="Recently updated"
              description="The repositories I've pushed to most recently."
            />
            <Reveal>
              <ul className="mt-8 flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface-1">
                {recentRepos.map((repo) => (
                  <li key={repo.name}>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col gap-1 p-5 transition-colors hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    >
                      <span className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 font-display text-base font-semibold text-foreground">
                          {repo.name}
                          <ArrowUpRight
                            className="size-4 text-foreground-subtle opacity-0 transition-opacity group-hover:opacity-100"
                            aria-hidden="true"
                          />
                          <span className="sr-only"> (opens in new tab)</span>
                        </span>
                        {repo.description ? (
                          <span className="line-clamp-1 text-sm text-foreground-muted">
                            {repo.description}
                          </span>
                        ) : null}
                      </span>
                      <span className="flex shrink-0 items-center gap-4 text-xs text-foreground-subtle">
                        {repo.language ? <span className="font-mono">{repo.language}</span> : null}
                        <time dateTime={repo.updatedAt} className="tabular-nums">
                          {formatDate(repo.updatedAt)}
                        </time>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
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

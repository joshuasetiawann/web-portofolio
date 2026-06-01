// Pure helpers that derive dashboard stats from fetched GitHub repos.
import type { GitHubRepo, LanguageStat } from "@/types/github";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572a5",
  Rust: "#dea584",
  Go: "#00add8",
  GLSL: "#5686a5",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  default: "#687085",
};

export function languageColor(name: string): string {
  return LANGUAGE_COLORS[name] ?? LANGUAGE_COLORS.default;
}

/** Language distribution (by repo count) across the given repos. */
export function getLanguageStats(repos: GitHubRepo[], limit = 6): LanguageStat[] {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (!repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
  if (total === 0) return [];
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
      color: languageColor(name),
    }));
}

/** Most-starred repos first. */
export function getTopRepos(repos: GitHubRepo[], limit = 6): GitHubRepo[] {
  return [...repos].sort((a, b) => b.stars - a.stars).slice(0, limit);
}

export interface RepoSummary {
  totalStars: number;
  totalForks: number;
  repoCount: number;
}

export function summarizeRepoStats(repos: GitHubRepo[]): RepoSummary {
  return {
    totalStars: repos.reduce((sum, repo) => sum + repo.stars, 0),
    totalForks: repos.reduce((sum, repo) => sum + repo.forks, 0),
    repoCount: repos.length,
  };
}

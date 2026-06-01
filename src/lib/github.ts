// github.ts — server-side GitHub REST API helpers.
// Fetches public user + repo data with ISR revalidation and optional auth.
// All failures degrade gracefully to null / empty array.
import { env } from "@/lib/env";
import { siteConfig } from "@/config/site";
import type { GitHubUser, GitHubRepo } from "@/types/github";

const GITHUB_API = "https://api.github.com";
const REVALIDATE_SECONDS = 3600;

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  }
  return headers;
}

/** Derive a default GitHub username from the configured profile link. */
function defaultUsername(): string {
  try {
    const segments = new URL(siteConfig.links.github).pathname.split("/").filter(Boolean);
    return segments[0] ?? "github";
  } catch {
    return "github";
  }
}

interface RawGitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
}

interface RawGitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
  fork: boolean;
}

export async function getGitHubUser(
  username: string = defaultUsername(),
): Promise<GitHubUser | null> {
  try {
    const res = await fetch(`${GITHUB_API}/users/${username}`, {
      headers: buildHeaders(),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as RawGitHubUser;
    return {
      login: data.login,
      name: data.name ?? data.login,
      avatarUrl: data.avatar_url,
      bio: data.bio ?? "",
      followers: data.followers,
      following: data.following,
      publicRepos: data.public_repos,
      htmlUrl: data.html_url,
    };
  } catch {
    return null;
  }
}

export async function getGitHubRepos(username: string = defaultUsername()): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`, {
      headers: buildHeaders(),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];

    const data = (await res.json()) as RawGitHubRepo[];
    if (!Array.isArray(data)) return [];

    return data.map((repo) => ({
      name: repo.name,
      description: repo.description ?? "",
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language ?? "",
      topics: repo.topics ?? [],
      updatedAt: repo.updated_at,
    }));
  } catch {
    return [];
  }
}

// GitHub domain shapes for the /github page and lib/github fetchers.

export interface GitHubUser {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  followers: number;
  following: number;
  publicRepos: number;
  htmlUrl: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  topics: string[];
  updatedAt: string;
}

export interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

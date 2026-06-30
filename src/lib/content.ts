// content.ts — typed accessors over the Velite-generated blog collection.
// The single import boundary for blog content; pages never touch `#site/content` directly.
import { posts as allPosts, type Post } from "#site/content";

export type { Post };

const isProd = process.env.NODE_ENV === "production";

/** All non-draft posts (drafts shown only outside production), newest first. */
export function getAllPosts(): Post[] {
  return [...allPosts]
    .filter((post) => (isProd ? !post.draft : true))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedPosts(): Post[] {
  return getAllPosts().filter((post) => post.featured);
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getAllPostTags(): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts()) post.tags.forEach((tag) => tags.add(tag));
  return [...tags].sort((a, b) => a.localeCompare(b));
}

/** Posts sharing the most tags with the given slug. */
export function getRelatedPosts(slug: string, limit = 2): Post[] {
  const current = getPostBySlug(slug);
  if (!current) return [];
  return getAllPosts()
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      shared: post.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map((entry) => entry.post);
}

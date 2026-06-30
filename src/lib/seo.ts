// seo.ts — URL helpers for canonical/OG/metadata building.
// Joins a path onto the validated public site URL, normalizing slashes.
import { env } from "@/lib/env";

/**
 * Build an absolute URL for the given path against NEXT_PUBLIC_SITE_URL.
 * - Strips any trailing slash from the base.
 * - Ensures the path has exactly one leading slash.
 */
export function absoluteUrl(path = "/"): string {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  const normalizedPath = path === "" ? "/" : `/${path.replace(/^\/+/, "")}`;
  return `${base}${normalizedPath}`;
}

// Pure slug helper: lowercase, ASCII-fold accents, hyphenate, dedupe dashes.

/**
 * Convert an arbitrary string into a URL-safe slug.
 * "Crème Brûlée & Co." -> "creme-brulee-co"
 */
export function slugify(input: string): string {
  return (
    input
      .normalize("NFKD")
      // Strip combining diacritical marks left by NFKD decomposition.
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim()
      // Replace any run of non-alphanumeric characters with a single hyphen.
      .replace(/[^a-z0-9]+/g, "-")
      // Collapse repeated hyphens.
      .replace(/-{2,}/g, "-")
      // Trim leading/trailing hyphens.
      .replace(/^-+|-+$/g, "")
  );
}

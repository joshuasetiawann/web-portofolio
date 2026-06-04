# Content (MDX sources)

Authoring home for long-form MDX:

- `blog/` — writing/blog posts (compiled by **Velite** into typed collections)

## How it works

`blog/*.mdx` is validated and compiled at build time by Velite (`velite.config.ts`)
into the gitignored `.velite/` output, imported through `@/lib/content`
(`getAllPosts`, `getPostBySlug`, …) and rendered by `@/components/mdx/mdx-content`.
Frontmatter mirrors the Velite schema (title, description, date, tags, draft,
featured, optional cover).

**Projects, research, experience, timeline, gallery, certificates, and
achievements are structured typed data** in `src/data/*` (not MDX) — richer to
query and better suited to the card/detail layouts.

Replace the sample posts and `src/data/*` entries with real content per
`docs/CONTENT-CHECKLIST.md`.

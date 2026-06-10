# Content Editing Guide

How to edit every content type on the site. There are two content systems:

| System | Lives in | Used by | How to update |
| --- | --- | --- | --- |
| **Blog** | `src/content/blog/*.mdx` (MDX) | `/blog`, `/blog/[slug]` | Add/edit an `.mdx` file, then run `pnpm content` |
| **Everything else** | `src/data/*.ts` (typed arrays) | Projects, Research, Experience, Timeline, Gallery, Certificates, Achievements, Skills, Social | Edit the TypeScript array directly |

The current data is **placeholder sample content**. Replace it with the real thing using the intake list in [`CONTENT-CHECKLIST.md`](./CONTENT-CHECKLIST.md). For the full blog authoring workflow (frontmatter, supported elements, code blocks), see [`mdx-guide.md`](./mdx-guide.md).

> Type safety is your guardrail: every `src/data/*` file is typed. If you get a shape wrong, `pnpm typecheck` (and `pnpm build`) will fail with a clear error before anything ships.

---

## Blog posts (MDX)

Blog is the **only** content compiled through [Velite](https://velite.js.org). Posts are MDX files in `src/content/blog/`.

```bash
# 1. Create a post (filename becomes the slug)
src/content/blog/my-post.mdx        # -> /blog/my-post

# 2. Compile content into the gitignored .velite/ directory
pnpm content

# Or watch while writing
pnpm content:watch
```

`pnpm dev` and `pnpm build` both run `velite` first, so you usually do not need to run `pnpm content` by hand during development — it is mainly useful for a one-off compile or to surface frontmatter validation errors.

A minimal post:

```mdx
---
title: My Post Title
description: A one-sentence summary used in listings, meta tags, and OG images.
date: 2026-06-30
tags: [Performance, React]
---

Your MDX body starts here.
```

Posts flow: **Velite compiles** `src/content/blog/*.mdx` -> `.velite/` -> imported via the `#site/content` alias -> wrapped by `@/lib/content` -> rendered by `@/components/mdx/mdx-content`. Pages never import `#site/content` directly; they call the typed accessors in `src/lib/content.ts`:

- `getAllPosts()` — non-draft posts, newest first (drafts are shown in dev, hidden in production).
- `getFeaturedPosts()` — posts with `featured: true`.
- `getPostBySlug(slug)`, `getAllPostTags()`, `getRelatedPosts(slug, limit)`.

Full frontmatter reference and the list of supported MDX elements live in [`mdx-guide.md`](./mdx-guide.md).

---

## Typed data (`src/data/*`)

Everything that is not a blog post is a typed array. Each file exports its array and (where relevant) accessor/derived helpers. To edit, open the file, add or change an object in the array, save, and let `pnpm typecheck` confirm the shape. No build step beyond the normal one is required.

Path alias: import types with `@/types/*` (e.g. `import type { Project } from "@/types/project"`).

### Projects — `src/data/projects.ts`

Shape: `Project` (`src/types/project.ts`). Drives `/projects` (cards) and `/projects/[slug]` (case-study detail). The detail fields are all optional — a card-only project just omits them.

**Required (every project):**

| Field | Type | Notes |
| --- | --- | --- |
| `slug` | `string` | URL slug, must be unique (`/projects/<slug>`) |
| `title` | `string` | |
| `summary` | `string` | One line, used on cards |
| `role` | `string` | e.g. `"Lead Engineer"` |
| `year` | `number` | |
| `status` | `"live" \| "archived" \| "wip"` | |
| `kind` | `"software" \| "creative" \| "research" \| "oss"` | Drives JSON-LD type |
| `category` | `string` | Powers the project filter (e.g. `"Web App"`) |
| `tags` | `string[]` | Also used to compute related projects |
| `stack` | `string[]` | Tech list |
| `featured` | `boolean` | Show in featured/landing rails |
| `order` | `number` | Sort order, ascending (`getAllProjects` sorts by this) |
| `links` | `{ live?, repo?, caseStudy? }` | All optional URLs |

**Optional presentation / case-study fields:** `cover` (string path), `accent` (hex, e.g. `"#5e8bff"`), `client`, `team`, `timeline`, `overview`, `problem`, `solution`, `architecture`, `constraints` (`string[]`), `lessons` (`string[]`), `features` (`{ title, description }[]`), `metrics` (`{ label, value }[]`), `media` (`{ alt, src?, caption?, type? }[]`).

> Tip: omit `src` on a `media`/cover entry and the UI renders a tasteful placeholder until real assets exist.

Accessors: `getAllProjects()` (sorted by `order`), `getFeaturedProjects()`, `getProjectBySlug(slug)`, `getRelatedProjects(slug, limit)`, plus the derived `projectCategories` list.

### Research — `src/data/research.ts`

Shape: `Research` (`src/types/research.ts`). Drives `/research`.

| Field | Type | Notes |
| --- | --- | --- |
| `slug` | `string` | unique |
| `title` | `string` | |
| `abstract` | `string` | |
| `date` | `string` | ISO `YYYY-MM-DD` |
| `authors` | `string[]` | |
| `status` | `"published" \| "preprint" \| "wip"` | |
| `category` | `string` | Powers the research filter |
| `tags` | `string[]` | |
| `venue` | `string?` | optional |
| `featured` | `boolean?` | optional |
| `readingStatus` | `"reading" \| "implemented" \| "exploring"`? | optional personal note |
| `links` | `{ pdf?, doi?, code? }` | optional URLs |

Accessors: `getAllResearch()` (newest first by `date`), `getFeaturedResearch()`, derived `researchCategories`.

### Experience — `src/data/experience.ts`

Shape: `ExperienceItem` (defined in-file). Drives `/experience`.

| Field | Type | Notes |
| --- | --- | --- |
| `role` | `string` | |
| `company` | `string` | |
| `start` | `string` | e.g. `"2023-06"` |
| `end` | `string` | date or `"Present"` |
| `summary` | `string` | 1–2 lines |
| `highlights` | `string[]` | bullets |
| `stack` | `string[]` | |
| `location` | `string?` | optional |

Order in the array is the order rendered (list newest-first).

### Timeline — `src/data/timeline.ts`

Shape: `TimelineEvent` (defined in-file). Drives `/timeline`.

| Field | Type | Notes |
| --- | --- | --- |
| `date` | `string` | ISO `YYYY-MM` or `YYYY-MM-DD` |
| `year` | `number` | used for grouping |
| `title` | `string` | |
| `type` | `"role" \| "launch" \| "award" \| "talk" \| "education" \| "milestone"` | |
| `description` | `string` | |
| `ref` | `string?` | optional internal link, e.g. `"/projects/aurora-design-system"` |

Helper `getTimelineByYear()` returns events grouped by `year`, newest year first.

### Gallery — `src/data/gallery.ts`

Shape: `GalleryItem` (defined in-file). Drives `/gallery`. Provide intrinsic `width`/`height` to prevent layout shift.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `string` | unique |
| `title` | `string` | |
| `category` | `string` | powers the gallery filter |
| `alt` | `string` | required for a11y |
| `date` | `string` | `YYYY-MM` |
| `type` | `"image" \| "video"` | |
| `width` | `number` | intrinsic px |
| `height` | `number` | intrinsic px |
| `caption` | `string?` | optional |
| `src` | `string?` | omit to render a gradient placeholder |
| `accent` | `string?` | optional hex |

Derived `galleryCategories` list is generated from the items.

### Certificates — `src/data/certificates.ts`

Shape: `Certificate`. Drives `/certificates`.

| Field | Type | Notes |
| --- | --- | --- |
| `name` | `string` | |
| `issuer` | `string` | |
| `date` | `string` | `YYYY-MM` |
| `skills` | `string[]` | |
| `credentialId` | `string?` | optional |
| `url` | `string?` | optional verification link |

### Achievements — `src/data/achievements.ts`

Shape: `Achievement`. Drives `/achievements`.

| Field | Type | Notes |
| --- | --- | --- |
| `title` | `string` | |
| `date` | `string` | `YYYY-MM` |
| `category` | `string` | e.g. `"Award"`, `"Community"`, `"Competition"` |
| `description` | `string` | |
| `link` | `string?` | optional proof URL |

### Skills — `src/data/skills.ts`

Shape: `SkillGroup` (`{ category: string; items: string[] }`). Each group is a labeled cluster; `items` are plain strings. Add a group or extend `items`.

### Social links — `src/data/social-links.ts`

Shape: `SocialLink` (`{ label: string; href: string; icon: string }`). Used in the header/footer and Contact.

- `icon` is a **lucide-react icon name** (e.g. `"Github"`, `"Linkedin"`, `"Twitter"`, `"Mail"`). Brand glyphs lucide dropped are provided as inline SVGs in `src/lib/icons.tsx` — check there if an icon name does not resolve.
- `href` may be a URL or a `mailto:`/`tel:` scheme.

---

## After editing

1. `pnpm content` if you touched blog MDX (otherwise covered by `pnpm dev`/`pnpm build`).
2. `pnpm typecheck` to validate data shapes.
3. `pnpm check` before shipping (runs typecheck, lint, format check, and build).

Use [`CONTENT-CHECKLIST.md`](./CONTENT-CHECKLIST.md) to track which placeholders still need real content. For launch the critical path is **3–4 fully fleshed projects, bio/identity, links, and the production domain/GitHub username**.

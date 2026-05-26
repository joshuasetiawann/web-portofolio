# SEO Strategy

> Purpose: the authoritative, enforceable SEO contract for Joshua Setiawan's portfolio — metadata generation, title/description patterns, canonical & robots policy, OpenGraph & Twitter/X cards, build-time OG images, the full structured-data (JSON-LD) graph, per-content (blog/project/research) SEO, image alt-text, internal linking, heading hierarchy, machine routes (sitemap/robots/manifest/RSS), and the CI gates that keep all of it true.

Related: [Information Architecture](./information-architecture.md) · [Navigation Structure](./navigation-structure.md) · [Page Specifications](./page-specifications.md) · [Performance Strategy](./performance-strategy.md) · [Component Inventory](./component-inventory.md) · [Typography System](./typography-system.md) · [Content Checklist](./CONTENT-CHECKLIST.md) · [Phase 1 Foundation](./PHASE-1-FOUNDATION.md)

---

## 0. How to read this document

Three terms are used precisely throughout:

- **Source** — where a metadata value originates (front-matter field, typed data record, or a static string in the SEO config). SEO values are **never hand-duplicated**; they derive from one source.
- **Guard** — a build/runtime condition that forces a metadata state (e.g. the non-prod `noindex` guard).
- **Assumption:** — a professional default chosen here because LOCKED did not specify it; binding until revisited.

Every rule traces back to the LOCKED **SEO** section and to the IA in [information-architecture §2/§3/§11](./information-architecture.md). Canonical domain is written as `https://joshuasetiawan.com` throughout. **Assumption:** this is a placeholder; the real apex domain is resolved at build time from `NEXT_PUBLIC_SITE_URL` and replaces the placeholder before launch (tracked in [CONTENT-CHECKLIST](./CONTENT-CHECKLIST.md)). No canonical, OG URL, or JSON-LD `url` is ever hard-coded — all are composed from `metadataBase`.

---

## 1. SEO principles

| # | Principle | Consequence |
|---|---|---|
| 1 | **One source of truth per value.** | Titles/descriptions/OG/JSON-LD derive from Velite front-matter `seo`, typed data, or `src/lib/seo/config.ts`. No string is written twice. |
| 2 | **Content is server-rendered HTML.** | Every indexable route is RSC/SSG (or SSR+ISR for live routes); crawlers see full content with zero client JS. A CI assertion greps built HTML for the `<h1>` and body copy. |
| 3 | **Index intentionally, never accidentally.** | Default is `index,follow` on production content; everything non-prod, every utility/UI-state URL, and 404 are explicitly `noindex`. |
| 4 | **Canonical points to the clean path.** | Query-param (filter/sort) URLs are not separate documents; their canonical is the bare route. Trailing slash off. |
| 5 | **Metadata is typed.** | `generateMetadata`/`metadata` return Next.js `Metadata`; JSON-LD is typed with `schema-dts`. Bad shapes fail `tsc`. |
| 6 | **OG images are build-time, co-located.** | No runtime `/api/og`; each OG is a static co-located `opengraph-image.tsx` (root + per project/post/paper), so OG never adds runtime cost or cache-miss latency. |
| 7 | **Structured data mirrors reality.** | JSON-LD describes only what the page actually shows; no fabricated ratings, no keyword stuffing, no schema for content not on the page. |
| 8 | **E-E-A-T by construction.** | Author identity (Person), real dates, real venues, verifiable links (repo/DOI/credential URLs) are surfaced as machine-readable signals. |

---

## 2. SEO infrastructure (config + helpers)

A single config module holds immutable constants; thin helpers compose `Metadata` and JSON-LD from a typed input. This mirrors [component-inventory → SeoMeta / JsonLd](./component-inventory.md) (`lib/seo.ts` + `components/utility/json-ld.tsx`).

| Module | Path | Responsibility |
|---|---|---|
| **Site config** | `src/lib/seo/config.ts` | `SITE_URL` (from `NEXT_PUBLIC_SITE_URL`), `SITE_NAME`, `AUTHOR` (name, role, sameAs[], email), `TITLE_TEMPLATE`, `DEFAULT_DESCRIPTION`, `TWITTER_HANDLE`, `LOCALE` (`en_US`), `OG_DEFAULTS`, `AI_CRAWLERS_ALLOWED` flag. Immutable. |
| **Metadata builder** | `src/lib/seo/metadata.ts` | `buildMetadata(input: SeoInput): Metadata` — applies title template, description, canonical, robots (incl. non-prod guard), OG, Twitter. The only place `Metadata` is constructed. |
| **JSON-LD builders** | `src/lib/seo/schema.ts` | Typed (`schema-dts`) factories: `personSchema()`, `webSiteSchema()`, `profilePageSchema()`, `creativeWorkSchema()`, `softwareSourceCodeSchema()`, `blogPostingSchema()`, `scholarlyArticleSchema()`, `breadcrumbListSchema()`. |
| **JSON-LD renderer** | `src/components/utility/json-ld.tsx` | RSC `<JsonLd schema={…} />` → `<script type="application/ld+json">` with safe serialization. |

`metadataBase` is set **once** in the root `app/layout.tsx` `metadata` export from `new URL(SITE_URL)`. Every relative `canonical`, `openGraph.url`, and image path then resolves to an absolute URL automatically. `SeoInput` shape:

```
type SeoInput = {
  title?: string;            // omitted on root (base title only)
  description: string;
  path: string;              // e.g. "/projects/realtime-canvas" → canonical
  ogType?: "website" | "article" | "profile";
  image?: string;            // co-located opengraph-image resolves by default
  noindex?: boolean;         // forced true under the non-prod guard
  publishedTime?: string;    // article OG
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
};
```

---

## 3. Non-production noindex guard (the single most important rule)

Implemented inside `buildMetadata` and applied to **every** route — no page can opt out.

```
const isProd = process.env.VERCEL_ENV === "production";
robots: isProd && !input.noindex
  ? { index: true,  follow: true,  googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
  : { index: false, follow: false, nocache: true }
```

| Environment | `VERCEL_ENV` | Robots emitted |
|---|---|---|
| Production | `production` | `index, follow` (unless route is explicitly `noindex`) |
| Preview deploy | `preview` | `noindex, nofollow, noarchive` |
| Local / dev | `undefined` / `development` | `noindex, nofollow, noarchive` |

A defensive `robots.ts` disallow-all is **also** emitted when `VERCEL_ENV !== 'production'` (see §19). Belt and suspenders: preview deploys must never appear in the index, even if a meta tag is missed. Canonicals on preview point at the preview origin (via `NEXT_PUBLIC_SITE_URL`) so a leaked preview never claims to be the production canonical.

---

## 4. Title strategy

| Aspect | Rule |
|---|---|
| Template | `title.template = "%s — Joshua Setiawan"` (em dash, set in root layout). |
| Root | `title.default = "Joshua Setiawan — Creative Developer & Software Engineer"` — **no** template suffix (it would double the name). |
| Child routes | Pass only the page title (`"Projects"`, `"About"`); template appends ` — Joshua Setiawan`. |
| Dynamic routes | `generateMetadata` returns the content title (`"{Project}"`, `"{Post}"`, `"{Paper}"`) → template suffix applied. |
| Length | Aim ≤ 60 chars **including** suffix so it doesn't truncate in SERPs; the `h1` (display type) may be longer/more expressive than the `<title>`. |
| 404 | `"Page not found — Joshua Setiawan"` (still `noindex`). |
| Casing | Title case for proper page names; content titles preserve the author's front-matter casing. |
| Uniqueness | Every route resolves to a unique `<title>`; a CI script asserts no two indexable routes share a title. |

**Title source per page family**

| Family | `<title>` source |
|---|---|
| Static routes | Static string in the route's `metadata` export (e.g. `"About"`). |
| `/projects/[slug]` | Velite `projects.title` (overridable by `seo.title`). |
| `/blog/[slug]` | Velite `blog.title` (overridable by `seo.title`). |
| `/research/[slug]` | Velite `research.title` (overridable by `seo.title`). |

---

## 5. Description strategy

Descriptions are the SERP snippet and the OG/Twitter description. Rules:

| Aspect | Rule |
|---|---|
| Length | 120–160 chars; front-loaded with the primary intent. Truncation-safe. |
| Voice | Active, specific, benefit/skill-oriented; no keyword stuffing; written for humans. |
| Default | `DEFAULT_DESCRIPTION` in config is the fallback **only** for the root and any page lacking a better source. |
| Per-content | Prefer explicit `seo.description`; else fall back to the content's own summary field. |
| Uniqueness | No two indexable pages share a description (CI-checked alongside titles). |

**Description source per route family (precedence: explicit `seo` → content summary → static):**

| Family | Description source (in order) |
|---|---|
| Root `/` | `seo`-style static positioning line in config. |
| `/about`, `/philosophy`, `/experience`, etc. | Static, hand-written per route `metadata`. |
| `/projects/[slug]` | `seo.description` → `projects.summary`. |
| `/blog/[slug]` | `seo.description` → `blog.description`. |
| `/research/[slug]` | `seo.description` → `research.abstract` (trimmed to ≤160). |
| Index routes (`/projects`, `/blog`, `/research`) | Static collection-level description in route `metadata`. |

---

## 6. Canonical URL strategy

| Rule | Detail |
|---|---|
| Absolute canonicals | `alternates.canonical` is a path; `metadataBase` makes it absolute. Every indexable route emits a self-canonical. |
| Clean path | Filter/sort query params (`?tag=`, `?kind=`, `?sort=`) are UI state only; the canonical is the bare route. These URLs are therefore deduplicated to the clean path, never indexed separately (per [IA §3](./information-architecture.md)). |
| Trailing slash | Off (Next default). `/projects` is canonical; `/projects/` would 308 to it. |
| Slugs | Stable, kebab-case, derived from front-matter `slug`; never reused (per [IA §3](./information-architecture.md)). |
| Index vs detail | Plural index canonical to itself; each detail canonical to itself. No cross-canonicalization. |
| Pagination | None in v1 (curated volumes), so no `rel=prev/next` concerns. |
| WWW / host | Single host; `www` → apex 308 redirect handled at the platform. Only the apex appears in canonicals. |

---

## 7. Robots & indexation matrix

| Route group | Index? | Reason |
|---|---|---|
| All primary content (1–16) **in prod** | ✅ `index,follow` | Public portfolio content. |
| `/privacy` | ✅ `index,follow` | Legitimate utility page; thin but valid. **Assumption:** indexable (transparency signal). |
| Filter/sort query-param URLs | ⛔ canonicalized away | Not separate documents (§6). |
| `not-found.tsx` (404) | ⛔ `noindex` + **HTTP 404** | Correct soft-404 avoidance (per [page-specs](./page-specifications.md)). |
| `loading.tsx` skeletons | n/a | Never a standalone URL. |
| Any non-prod deploy | ⛔ `noindex` | §3 guard. |
| `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, `rss.xml` | n/a | Machine routes; not HTML documents. |

`googleBot` directives on indexable pages: `max-image-preview: large`, `max-snippet: -1`, `max-video-preview: -1` (rich, untruncated snippets and large image previews).

---

## 8. Per-route metadata table (all 18 pages + utility)

Title shown is the **child** value (template appends ` — Joshua Setiawan`); root is the exception (base title, no suffix). OG image = the resolved co-located `opengraph-image` (build-time) unless noted.

| # | Route | `<title>` (pre-suffix) | Description source | Robots | OG type / image | JSON-LD type(s) |
|---|---|---|---|---|---|---|
| 1 | `/` | *(base)* `Joshua Setiawan — Creative Developer & Software Engineer` | Static (config positioning) | index | `website` / root OG | **Person** + **WebSite** (w/ SearchAction) |
| 2 | `/about` | `About` | Static | index | `profile` / root OG | **ProfilePage** (refs root Person) |
| 3 | `/philosophy` | `Engineering Philosophy` | Static | index | `website` / root OG | — |
| 4 | `/projects` | `Projects` | Static (collection) | index | `website` / root OG | — |
| 5 | `/projects/[slug]` | `{Project title}` | `seo.description` → `summary` | index | `article` / **co-located** project OG | **CreativeWork** *or* **SoftwareSourceCode** + **BreadcrumbList** |
| 6 | `/research` | `Research` | Static (collection) | index | `website` / root OG | — |
| — | `/research/[slug]` | `{Paper title}` | `seo.description` → `abstract` | index | `article` / **co-located** research OG | **ScholarlyArticle** + **BreadcrumbList** |
| 7 | `/open-source` | `Open Source` | Static | index | `website` / root OG | — |
| 8 | `/blog` | `Blog` | Static (collection) | index | `website` / root OG | — |
| 9 | `/blog/[slug]` | `{Post title}` | `seo.description` → `description` | index | `article` / **co-located** post OG | **BlogPosting** + **BreadcrumbList** |
| 10 | `/experience` | `Experience` | Static | index | `website` / root OG | — |
| 11 | `/timeline` | `Timeline` | Static | index | `website` / root OG | — |
| 12 | `/gallery` | `Gallery` | Static | index | `website` / root OG | — |
| 13 | `/certificates` | `Certificates` | Static | index | `website` / root OG | — |
| 14 | `/achievements` | `Achievements` | Static | index | `website` / root OG | — |
| 15 | `/github` | `GitHub Dashboard` | Static | index | `website` / root OG | — |
| 16 | `/contact` | `Contact` | Static | index | `website` / root OG | — |
| — | `/privacy` | `Privacy` | Static | index | `website` / root OG | — |
| 17 | `not-found.tsx` | `Page not found` | Static | **noindex** + HTTP 404 | — (root OG fallback) | — |
| 18 | `loading.tsx` | n/a (streamed skeleton) | n/a | n/a | n/a | — |

Machine routes (not in the page count): `sitemap.ts` → `/sitemap.xml`, `robots.ts` → `/robots.txt`, `manifest.ts` → `/manifest.webmanifest`, blog `rss.xml`. See §19–§22.

---

## 9. OpenGraph strategy

Set globally in root `openGraph`, overridden per route via `buildMetadata`.

| Field | Value |
|---|---|
| `og:site_name` | `Joshua Setiawan` |
| `og:locale` | `en_US` |
| `og:type` | `website` (most routes), `profile` (`/about`), `article` (project/blog/research detail) |
| `og:title` | the resolved `<title>` (with suffix) |
| `og:description` | the page description |
| `og:url` | absolute canonical (from `metadataBase` + path) |
| `og:image` | resolved co-located `opengraph-image` (1200×630) or root OG fallback |
| `og:image:alt` | descriptive, content-specific alt (see §16) |

**`article`-type extras** (project/blog/research detail): `article:published_time`, `article:modified_time` (blog `updated`, project — n/a unless set), `article:author` (`Joshua Setiawan`), `article:tag[]` (front-matter `tags`). `profile`-type (`/about`): `profile:first_name`, `profile:last_name`, `profile:username`.

---

## 10. Twitter / X cards

| Field | Value |
|---|---|
| `twitter:card` | `summary_large_image` (all routes — the OG image is always 1200×630) |
| `twitter:title` | resolved `<title>` |
| `twitter:description` | page description |
| `twitter:image` | same resolved OG image (single source; no separate Twitter image) |
| `twitter:image:alt` | same alt as `og:image:alt` |
| `twitter:creator` / `twitter:site` | `TWITTER_HANDLE` from config (**Assumption:** `@joshsetiawan` placeholder until confirmed in [CONTENT-CHECKLIST](./CONTENT-CHECKLIST.md)) |

Twitter fields are emitted by Next's `twitter` metadata object so they fall back gracefully to OG values; we set them explicitly to control `card` and `creator`.

---

## 11. Build-time OG image generation

OG images are **static, co-located** `opengraph-image.tsx` files rendered at build via Next's ImageResponse (Satori). No runtime `/api/og` route (cut per [PHASE-1-FOUNDATION](./PHASE-1-FOUNDATION.md)). This keeps OG off the request path and inside the build budget.

| Location | Scope | Content |
|---|---|---|
| `app/opengraph-image.tsx` | Site default (all static routes) | Wordmark `Joshua Setiawan`, role line, signature azure→teal gradient mark on brand-black `#05070D`. |
| `app/projects/[slug]/opengraph-image.tsx` | Per project | Project title, `role · year · status`, kind badge, accent gradient; brand-black bg. |
| `app/blog/[slug]/opengraph-image.tsx` | Per post | Post title, `date · reading time`, up to 2 tags; brand-black bg. |
| `app/research/[slug]/opengraph-image.tsx` | Per paper | Paper title, `venue · status · year`, authors line; brand-black bg. |

**OG image spec (canonical):**

| Property | Value |
|---|---|
| Dimensions | `1200 × 630` (1.91:1), `size`/`contentType` exported |
| Background | brand-black `#05070D` (the one true black — manifest `theme_color`, OG bg, shader clear color all share it, per [design-tokens](./design-tokens.md)) |
| Accent | `--gradient-accent` `linear-gradient(135deg,#5E8BFF,#38E8C8)` for the mark/underline |
| Type | Display = **Space Grotesk** (title), labels = **Geist Mono** uppercase eyebrow; fonts loaded as buffers in the route |
| Foreground | `#EAEDF5` title, `#A4ABBD` meta line |
| Safe area | ≥ 60px padding; title ≤ 3 lines, auto-fit font size |
| Weight | Static PNG output; no per-request cost; counts against build, not runtime |

`generateStaticParams` drives one OG per slug at build. `twitter-image` is **not** duplicated — Next reuses `opengraph-image` for Twitter automatically.

---

## 12. Structured data (JSON-LD)

All schemas are typed with `schema-dts`, built in `src/lib/seo/schema.ts`, rendered by `<JsonLd>` (RSC). The root graph (Person + WebSite) is injected **once** in `app/layout.tsx`; page-specific schema is additive and self-contained per route. `@id` anchors enable cross-references (e.g. ProfilePage → Person, articles → author Person).

### 12.1 Schema placement matrix

| Schema | Emitted on | `@id` / key links |
|---|---|---|
| **Person** | Root layout (all pages) | `@id: {SITE_URL}/#person`; `name`, `url`, `jobTitle`, `sameAs[]` (GitHub, LinkedIn, X), `email`, `image`, `knowsAbout[]` |
| **WebSite** | Root layout (all pages) | `@id: {SITE_URL}/#website`; `publisher`/`author` → `#person`; `potentialAction` = `SearchAction` |
| **ProfilePage** | `/about` | `mainEntity` → `#person`; `dateModified` |
| **CreativeWork** | `/projects/[slug]` where `kind ∈ {creative, research}` | `author` → `#person`; `name`, `about`, `keywords`, `image`, `url`, `dateCreated` |
| **SoftwareSourceCode** | `/projects/[slug]` where `kind ∈ {software, oss}` | `author` → `#person`; `name`, `programmingLanguage` (from `stack[]`), `codeRepository` (`links.repo`), `url`, `keywords` |
| **BlogPosting** | `/blog/[slug]` | `author`/`publisher` → `#person`; `headline`, `datePublished`, `dateModified` (from `updated`), `keywords`, `image`, `wordCount`/`timeRequired` |
| **ScholarlyArticle** | `/research/[slug]` | `author[]` (from `authors[]`, lead → `#person`), `headline`, `abstract`, `datePublished`, `publication` (`venue`), `identifier` (DOI), `sameAs` (PDF/code) |
| **BreadcrumbList** | every nested (depth-2) route | mirrors the visible breadcrumb (per [navigation-structure §9](./navigation-structure.md)) |

### 12.2 WebSite `SearchAction` (sitelinks search)

Points at the in-site search intent (command palette / flat content search). Even though search is client-side, exposing a `SearchAction` is valid because a deep-link target exists.

```
"potentialAction": {
  "@type": "SearchAction",
  "target": { "@type": "EntryPoint", "urlTemplate": "https://joshuasetiawan.com/search?q={search_term_string}" },
  "query-input": "required name=search_term_string"
}
```

**Assumption:** a minimal `/search?q=` deep-link (or `/blog?q=`) is wired to satisfy the `SearchAction` target; if no GET search endpoint ships, the `SearchAction` is omitted rather than faked (tracked in [CONTENT-CHECKLIST](./CONTENT-CHECKLIST.md)).

### 12.3 Field mapping — content schemas

| Schema field | Project (`CreativeWork`/`SoftwareSourceCode`) | Blog (`BlogPosting`) | Research (`ScholarlyArticle`) |
|---|---|---|---|
| `name` / `headline` | `title` | `title` | `title` |
| description/abstract | `summary` | `description` | `abstract` |
| primary date | `year` → `dateCreated` | `date` → `datePublished` | `date` → `datePublished` |
| modified date | — | `updated` → `dateModified` | — |
| author | `#person` | `#person` | `authors[]` (lead → `#person`) |
| keywords/tags | `tags[]` | `tags[]` | `tags[]` |
| image | `cover` (absolute) | `cover` (absolute, optional) | OG image |
| canonical `url` | self | self | self |
| extra | `programmingLanguage` ← `stack[]`, `codeRepository` ← `links.repo` (software/oss) | `timeRequired` ← `readingTime` | `identifier` ← DOI, `publication` ← `venue`, `sameAs` ← `links.pdf`/`links.code` |

### 12.4 Validation

JSON-LD must pass Google **Rich Results Test** and **schema.org validator** with zero errors/zero warnings. This is a launch gate (per [product-strategy](./product-strategy.md): "Rich Results validity → Zero errors").

---

## 13. Blog SEO

| Concern | Rule |
|---|---|
| Render | SSG via `generateStaticParams`; **drafts excluded** from params, sitemap, and RSS (per [page-specs](./page-specifications.md)). |
| Title | `blog.title` → `"{Post} — Joshua Setiawan"`. |
| Description | `seo.description` → `blog.description`. |
| Dates | `datePublished` ← `date`; `dateModified` ← `updated` (BlogPosting + `article:modified_time`). |
| Reading time | `readingTime` → `timeRequired` (ISO 8601 duration) + shown on page and OG. |
| Canonical | self; included in `rss.xml`. |
| Schema | `BlogPosting` + `BreadcrumbList`. |
| TOC | `<nav aria-label="On this page">`; in-page anchors from `rehype-slug` (stable IDs). |
| Tags | `tags[]` → `keywords` + `article:tag`; tag filter pages are query-param (non-indexed). |
| Feed | Single `rss.xml` via `feed` (per LOCKED). |

---

## 14. Project SEO

| Concern | Rule |
|---|---|
| Render | SSG via `generateStaticParams`. |
| Title | `projects.title` → `"{Project} — Joshua Setiawan"`. |
| Description | `seo.description` → `projects.summary`. |
| Schema selection | `kind ∈ {software, oss}` → **SoftwareSourceCode**; `kind ∈ {creative, research}` → **CreativeWork**. Plus `BreadcrumbList`. (Per [IA §2](./information-architecture.md).) |
| Repo / live links | `links.repo` → `codeRepository`; `links.live` surfaced as an outbound link (and `sameAs` where apt). External links flagged per [ExternalLink](./component-inventory.md). |
| Metrics | `metrics[]` shown on page only — **not** invented as `AggregateRating` (no fake review schema). |
| Stack | `stack[]` → `programmingLanguage`/`keywords`. |
| Canonical | self. |
| OG | co-located build-time project OG (§11). |

---

## 15. Research SEO

| Concern | Rule |
|---|---|
| Render | Index SSG; detail SSG via `generateStaticParams`. |
| Title | `research.title` → `"{Paper} — Joshua Setiawan"`. |
| Description | `seo.description` → `research.abstract` (trimmed ≤160). |
| Schema | **ScholarlyArticle** + `BreadcrumbList`. |
| Authors | `authors[]` → `author[]` (lead author linked to `#person` when it is Joshua). |
| Venue / status | `venue` → `publication`; `status (published\|preprint\|wip)` reflected in copy (not faked as peer-reviewed if `preprint`/`wip`). |
| Identifiers | `links.doi` → `identifier`/`sameAs`; `links.pdf`, `links.code` → `sameAs`. |
| Canonical | self. Index route has no special schema. |

---

## 16. Image alt-text strategy

Alt text serves a11y **and** image SEO; the two are unified (per [LOCKED Accessibility](./information-architecture.md) and [responsive-strategy](./responsive-strategy.md)).

| Image class | Alt rule |
|---|---|
| Content images (project covers, gallery, certificates) | Descriptive, specific, source-driven: gallery `alt`/`caption`, certificate `name` + `issuer`, project `cover` described in front-matter. Never the filename. |
| Decorative / canvas / dividers | `alt=""` (empty) + `aria-hidden` + `tabindex=-1` for the WebGL canvas; conveys "decorative" to crawlers and AT. |
| OG images | `og:image:alt` / `twitter:image:alt` describes the card content (title + role), not "OG image". |
| LCP poster | Meaningful alt (it is the hero's static fallback and the LCP element). |
| Diagrams/charts (GitHub dashboard) | Text alternative summarizing the data; never color-only meaning. |

Enforcement: `jsx-a11y/alt-text` (lint), `jest-axe`/`axe-playwright` (no `image-alt` violations). Gallery/certificate/project front-matter **requires** an `alt`/descriptive field (Velite/typed-data schema makes it non-optional).

---

## 17. Internal linking strategy

A flat IA (max depth 2) means navigation, footer, and contextual links carry the link-equity graph.

| Mechanism | SEO role |
|---|---|
| **Footer sitemap** | Real `<a>` to **all** routes (crawlable, JS-off safe) — gives every page an inbound link and a flat crawl index (per [navigation-structure §8](./navigation-structure.md)). |
| **Primary nav + Explore mega-menu** | Real anchors to clustered destinations; the home page is the strongest hub (per [page-specs](./page-specifications.md)). |
| **Breadcrumbs** | Reinforce hierarchy on nested routes (Home › Projects › *Title*) + BreadcrumbList. |
| **Contextual cross-links** | Project ↔ related blog/research; blog ↔ referenced project; timeline ↔ experience/projects; About ↔ resume/projects. Descriptive anchor text (the title), never "click here". |
| **Index → detail** | `/projects`, `/blog`, `/research` link to every (non-draft) item; detail pages link back to their index and to siblings. |
| **No orphans** | Every indexable URL is reachable from at least the footer; a CI link-graph check (or sitemap-vs-crawl diff) flags orphans. |
| **External links** | Outbound (repo/live/social) use `rel` as appropriate; social profiles double as `Person.sameAs`. |

Anchor-text discipline: descriptive and unique; avoid repeating the exact same anchor to different targets.

---

## 18. Heading hierarchy

Headings are an SEO **and** a11y contract (one `h1`, logical order — per [LOCKED Accessibility](./information-architecture.md) and [typography-system](./typography-system.md)).

| Rule | Detail |
|---|---|
| Exactly one `<h1>` per route | The hero **display type IS the `h1`** (display-2xl on landing, route title elsewhere). Never a second `h1`. |
| No skipped levels | `h1 → h2 → h3` in order; `h3` is Geist 600 per the type scale; sections use `h2`. |
| Visual ≠ semantic | A large visual label that isn't a section heading uses a `<p>`/eyebrow class, not an `<hX>`. |
| Detail pages | Article `h1` = content title (below breadcrumb); MDX body starts at `h2` (front-matter title is the `h1`, so MDX never emits its own `h1`). |
| TOC | Built from `h2`/`h3` via `rehype-slug` + autolink; stable, unique slug IDs. |
| Landmarks | One labeled landmark of each type; `<main id="main-content">` wraps the `h1` (skip-link target). |

Enforcement: `jsx-a11y/heading-has-content`, axe `heading-order` + `page-has-heading-one` (light/dark/reduced-motion/forced-colors runs).

---

## 19. `sitemap.ts`

`app/sitemap.ts` returns a typed `MetadataRoute.Sitemap` built from the same content accessors used to render pages (single source).

| Aspect | Rule |
|---|---|
| Includes | All indexable routes: the static set + every project/blog/research slug + `/privacy`. |
| Excludes | Drafts, 404, query-param URLs, anything `noindex`, all machine routes. |
| `lastModified` | From content dates (`updated`/`date`/`year`) or build time for static pages. |
| `changeFrequency` / `priority` | `/` highest; index routes high; details normal. **Assumption:** these are advisory only (Google largely ignores them) — kept minimal. |
| URLs | Absolute via `SITE_URL`. |
| Non-prod | Under the §3 guard, the sitemap may be generated but `robots.txt` disallows all, so it is never fetched/indexed. |

---

## 20. `robots.ts`

`app/robots.ts` returns `MetadataRoute.Robots`.

| Environment | Output |
|---|---|
| Production | `User-agent: *` → `allow: /`; `disallow:` UI-state/query paths if any; `sitemap: {SITE_URL}/sitemap.xml`; `host: {SITE_URL}`. |
| Non-production (`VERCEL_ENV !== 'production'`) | `User-agent: *` → `disallow: /` (block everything). |

AI crawler policy is config-flag driven (§23) and reflected in the `rules[]` array.

---

## 21. `manifest.ts`

`app/manifest.ts` returns `MetadataRoute.Manifest` (PWA-lite / installability + correct theming).

| Field | Value |
|---|---|
| `name` / `short_name` | `Joshua Setiawan` / `J. Setiawan` |
| `description` | `DEFAULT_DESCRIPTION` |
| `start_url` | `/` |
| `display` | `standalone` |
| `background_color` / `theme_color` | brand-black `#05070D` (the one true black — shared with OG bg + shader clear, per [design-tokens](./design-tokens.md)) |
| `icons[]` | 192/512 + maskable; favicon/apple-touch via root `app/icon`/`apple-icon` |
| `lang` / `dir` | `en` / `ltr` |

---

## 22. RSS feed

Single blog feed at `app/rss.xml/route.ts` (or `app/feed.xml`) generated with the `feed` library (per LOCKED).

| Aspect | Rule |
|---|---|
| Scope | Blog only; **drafts excluded**; newest first; **Assumption:** latest 20 items full-list (curated volume, no pagination). |
| Item fields | `title`, absolute `link`, `description` (post `description`), `date`, `author` (Joshua Setiawan), `category[]` (tags), `guid` = canonical URL. |
| Discovery | `<link rel="alternate" type="application/rss+xml">` in root `metadata.alternates.types`. |
| Content | Summary/description (not full body) for v1. |

---

## 23. AI crawler policy

LOCKED: "AI crawlers allowed via config flag." A single `AI_CRAWLERS_ALLOWED` boolean in `src/lib/seo/config.ts` drives `robots.ts`.

| Flag | `robots.txt` behavior |
|---|---|
| `true` (default) | No extra disallows for `GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`, `PerplexityBot`, etc. — they inherit `allow: /`. |
| `false` | Emit explicit `disallow: /` rules for the named AI user-agents while keeping `*` allowed. |

Flipping the flag is the **only** change needed to opt out later; no code edits elsewhere.

---

## 24. Internationalization readiness (hreflang)

LOCKED: "English only (hreflang-ready)." For v1:

- `<html lang="en">`; `og:locale = en_US`; manifest `lang: en`.
- No `hreflang` tags emitted (single locale → self-referential hreflang adds noise).
- Architecture leaves room: `buildMetadata` could later populate `alternates.languages`; routes are not locale-prefixed yet. **Assumption:** no `i18n` routing in v1; revisit only if a second locale is added.

---

## 25. Velite `seo` front-matter contract

Each content collection (`projects`, `blog`, `research`) carries an **optional** `seo` object so authors can override derived metadata without touching code. Defaults come from the content fields (§5).

| `seo.*` field | Overrides | Default if omitted |
|---|---|---|
| `seo.title` | `<title>` (pre-suffix) | content `title` |
| `seo.description` | meta/OG/Twitter description | `summary` / `description` / `abstract` |
| `seo.image` | OG/Twitter image | co-located `opengraph-image` |
| `seo.noindex` | per-item index guard | `false` (indexable) |
| `seo.canonical` | rarely — external canonical (e.g. cross-posted blog) | self-canonical |

`seo.canonical` exists specifically so a **cross-posted** blog post can point its canonical at the original source (avoids duplicate-content penalties). Velite schema validates these via Zod at build.

---

## 26. Validation & CI gates

SEO regressions fail the build, mirroring the enforcement posture of [performance-strategy §17](./performance-strategy.md).

| Gate | Tool | Asserts |
|---|---|---|
| **Raw-HTML content** | CI grep of built output | Every indexable route renders its `<h1>` + body copy in static HTML (RSC/SSG, not JS-injected). |
| **Title/description uniqueness** | Custom script over the route manifest | No two indexable routes share a `<title>` or meta description; lengths within bounds. |
| **Canonical presence** | Script | Every indexable route emits a self-canonical absolute URL; non-prod emits `noindex`. |
| **JSON-LD validity** | `schema-dts` types (compile) + Rich Results Test (manual/CI) | Typed at build; zero Rich-Results errors on launch (per [product-strategy](./product-strategy.md)). |
| **OG image presence** | Build assertion | Each project/blog/research slug produces a `1200×630` OG; root OG exists. |
| **Heading order** | `jsx-a11y` + axe `heading-order`/`page-has-heading-one` | Exactly one `h1`; no skipped levels. |
| **Alt text** | `jsx-a11y/alt-text` + axe `image-alt` | No missing alts; decorative images `alt=""`. |
| **Sitemap/robots correctness** | Script | Sitemap excludes drafts/noindex; prod robots allows, non-prod disallows; sitemap URL present in robots. |
| **No-orphan crawl** | Sitemap-vs-link-graph diff | Every sitemap URL is linked from at least the footer. |
| **Non-prod guard** | Snapshot test | `VERCEL_ENV !== 'production'` ⇒ global `noindex,nofollow` + robots `disallow: /`. |

---

## 27. Assumptions register

| # | Assumption | Revisit when |
|---|---|---|
| 1 | Apex domain `joshuasetiawan.com` is a placeholder; real domain from `NEXT_PUBLIC_SITE_URL`. | Domain confirmed ([CONTENT-CHECKLIST](./CONTENT-CHECKLIST.md)). |
| 2 | Twitter handle `@joshsetiawan` is a placeholder. | Real handle confirmed. |
| 3 | `WebSite.SearchAction` ships only if a GET `/search?q=` deep-link exists; else omitted, not faked. | Search endpoint decision. |
| 4 | `/privacy` is indexable (transparency). | If thin-content concerns arise. |
| 5 | RSS = latest 20 summaries, blog only. | If feed scope/full-content is requested. |
| 6 | No `hreflang`/i18n routing in v1. | Second locale added. |
| 7 | `changeFrequency`/`priority` advisory and minimal. | n/a (low impact). |
| 8 | AI crawlers allowed by default (`AI_CRAWLERS_ALLOWED = true`). | Policy change → flip flag. |

---

*Cross-references: [Information Architecture](./information-architecture.md) (routes, canonicals, schema placement) · [Navigation Structure](./navigation-structure.md) (breadcrumbs, footer sitemap) · [Page Specifications](./page-specifications.md) (per-page SEO goals) · [Performance Strategy](./performance-strategy.md) (SSG/HTML, OG build cost) · [Design Tokens](./design-tokens.md) (OG colors/black) · [Typography System](./typography-system.md) (heading hierarchy) · [Component Inventory](./component-inventory.md) (SeoMeta / JsonLd).*

# Information Architecture

> Purpose: Define the canonical sitemap, route and URL structure, page hierarchy, content grouping, and the full content model (Velite MDX collections + typed static data + live GitHub API) that every other doc and the eventual implementation build on.

Related: [User Journey](./user-journey.md) · [UX Flow](./ux-flow.md) · [Navigation Structure](./navigation-structure.md) · [Phase 1 Foundation](./PHASE-1-FOUNDATION.md) · [Content Checklist](./CONTENT-CHECKLIST.md)

---

## 1. Sitemap (tree)

```
/                                  1  Landing
├── /about                         2  About (ProfilePage)
├── /philosophy                    3  Engineering Philosophy
├── /projects                      4  Projects (index)
│   └── /projects/[slug]           5  Project Detail (CreativeWork / SoftwareSourceCode)
├── /research                      6  Research (index)
│   └── /research/[slug]              Research Detail (ScholarlyArticle)
├── /open-source                   7  Open Source (curated + live repos)
├── /blog                          8  Blog (index)
│   └── /blog/[slug]               9  Blog Detail (BlogPosting)
├── /experience                   10  Experience
├── /timeline                     11  Timeline
├── /gallery                      12  Gallery
├── /certificates                 13  Certificates
├── /achievements                 14  Achievements
├── /github                       15  GitHub Dashboard (live API + ISR)
├── /contact                      16  Contact (Server Action)
├── /privacy                          Privacy (utility — PII policy)
│
├── not-found.tsx                 17  404 (global)
├── loading.tsx                   18  Loading (global + per-segment skeletons)
│
└── (build/runtime utilities)
    ├── sitemap.ts
    ├── robots.ts
    ├── manifest.ts
    ├── rss.xml  (blog feed)
    └── opengraph-image.tsx  (root + co-located per projects/blog/research)
```

**Depth rule:** the IA is deliberately **flat (max depth 2)**. Only four route families nest (`projects`, `research`, `blog`, and conceptually `github`'s data). Everything else is a top-level destination, which is why navigation needs grouping (see [Navigation Structure](./navigation-structure.md)) rather than nested menus.

---

## 2. Route structure (App Router)

| # | Route | Segment file(s) | Render strategy | Dynamic? | Schema (JSON-LD) |
|---|---|---|---|---|---|
| 1 | `/` | `app/page.tsx` | SSG | — | Person + WebSite (root) |
| 2 | `/about` | `app/about/page.tsx` | SSG | — | ProfilePage |
| 3 | `/philosophy` | `app/philosophy/page.tsx` | SSG (MDX) | — | — |
| 4 | `/projects` | `app/projects/page.tsx` | SSG | — | — |
| 5 | `/projects/[slug]` | `app/projects/[slug]/page.tsx` | SSG (`generateStaticParams`) | ✓ | CreativeWork / SoftwareSourceCode + BreadcrumbList |
| 6 | `/research` | `app/research/page.tsx` | SSG | — | — |
| — | `/research/[slug]` | `app/research/[slug]/page.tsx` | SSG (`generateStaticParams`) | ✓ | ScholarlyArticle + BreadcrumbList |
| 7 | `/open-source` | `app/open-source/page.tsx` | SSR + ISR (`revalidate`) | — | — |
| 8 | `/blog` | `app/blog/page.tsx` | SSG | — | — |
| 9 | `/blog/[slug]` | `app/blog/[slug]/page.tsx` | SSG (`generateStaticParams`) | ✓ | BlogPosting + BreadcrumbList |
| 10 | `/experience` | `app/experience/page.tsx` | SSG | — | — |
| 11 | `/timeline` | `app/timeline/page.tsx` | SSG | — | — |
| 12 | `/gallery` | `app/gallery/page.tsx` | SSG | — | — |
| 13 | `/certificates` | `app/certificates/page.tsx` | SSG | — | — |
| 14 | `/achievements` | `app/achievements/page.tsx` | SSG | — | — |
| 15 | `/github` | `app/github/page.tsx` | SSR + ISR (~3600s) + client React Query | — | — |
| 16 | `/contact` | `app/contact/page.tsx` (+ Server Action) | SSG shell + dynamic action | — | — |
| — | `/privacy` | `app/privacy/page.tsx` | SSG | — | — |
| 17 | 404 | `app/not-found.tsx` | static | — | — |
| 18 | loading | `app/loading.tsx` + per-segment `loading.tsx` | streamed skeleton | — | — |

**Error boundaries:** one root `app/error.tsx` (group-level) + `app/global-error.tsx`. Per-segment `error.tsx` is intentionally **not** added for every route (see foundation decision record).

**Default posture:** all primary content is **RSC / SSG** (raw-HTML CI assertion enforces this). Only `/open-source` and `/github` fetch live data, both via **server-fetch + ISR for first paint** with optional **React Query** client refresh — the sole justified home of TanStack Query.

---

## 3. URL structure & conventions

| Concern | Convention |
|---|---|
| Casing | lowercase, kebab-case (`/open-source`, `/projects/realtime-canvas`) |
| Slugs | derived from content filename / front-matter `slug`; stable, never re-used |
| Trailing slash | off (Next default) |
| Canonicals | per-route absolute canonical via `metadataBase`; nested routes get self-canonical |
| Index vs detail | plural collection index (`/projects`), singular item via slug (`/projects/[slug]`) |
| Pagination | none for v1 (curated volumes); filtering is client-side query params (`?tag=`, `?kind=`) that **do not** create indexable URLs |
| Query params | UI state only (filters, sort) — `noindex`-neutral, canonical points to clean path |
| Utility | `/privacy`; machine routes `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, `rss.xml` |
| Non-prod guard | `VERCEL_ENV !== 'production'` → global `noindex` |

---

## 4. Dynamic routes

| Pattern | Source | Params generated by | Fallback | 404 trigger |
|---|---|---|---|---|
| `/projects/[slug]` | Velite `projects` collection | `generateStaticParams` from all project slugs | none (fully static) | unknown slug → `notFound()` |
| `/research/[slug]` | Velite `research` collection | `generateStaticParams` from research slugs | none | unknown slug → `notFound()` |
| `/blog/[slug]` | Velite `blog` collection (excl. `draft`) | `generateStaticParams` from published slugs | none | unknown/draft slug → `notFound()` |

Each dynamic route exports `generateMetadata` (title template `"%s — Joshua Setiawan"`, canonical, OG via co-located `opengraph-image.tsx`) and emits `BreadcrumbList` JSON-LD.

---

## 5. Page hierarchy & content grouping

Routes group into five **information clusters**. Clustering drives both the Explore mega-menu and the footer sitemap (see [Navigation Structure](./navigation-structure.md)).

| Cluster | Routes | Purpose |
|---|---|---|
| **Work** | `/projects`, `/projects/[slug]`, `/open-source`, `/github` | What was built — shipped + source + live activity |
| **Writing** | `/blog`, `/blog/[slug]`, `/research`, `/research/[slug]` | What was thought + published |
| **Profile** | `/about`, `/philosophy`, `/experience`, `/timeline` | Who, why, and the arc |
| **Proof** | `/certificates`, `/achievements`, `/gallery` | Credentials, recognition, taste |
| **Connect / Utility** | `/contact`, `/privacy`, 404, loading, machine routes | Convert + house-keeping |

**Primary navigation** promotes one anchor from the funnel (Projects, About, Blog, Contact). The remaining nine destinations live in the grouped **Explore** menu + command palette; the **footer** carries the full sitemap.

---

## 6. Content model

Three content sources, by responsibility:

1. **Velite MDX collections** — long-form, authored content (projects, blog, research, philosophy).
2. **Typed static data** — structured records that are lists, not prose (experience, timeline, certificates, achievements, gallery, open-source curation).
3. **Live GitHub API** — `/github` dashboard + `/open-source` repo cards.

### 6.1 Velite MDX collections

| Collection | Path | Output route | Key fields |
|---|---|---|---|
| `projects` | `src/content/projects/*.mdx` | `/projects/[slug]` | `slug, title, summary, role, year, status(live\|archived\|wip), kind(software\|creative\|research\|oss), tags[], stack[], featured, order, cover(Image), gallery(Image[]), links{live?, repo?, caseStudy?}, metrics[{label,value}], color?, body, toc, seo` |
| `blog` | `src/content/blog/*.mdx` | `/blog/[slug]` | `slug, title, description, date, updated?, tags[], draft, readingTime, cover?, toc, body, seo` |
| `research` | `src/content/research/*.mdx` | `/research/[slug]` | `slug, title, abstract, date, authors[], venue?, status(published\|preprint\|wip), tags[], links{pdf?, doi?, code?}, body, seo` |
| `philosophy` | `src/content/philosophy(.mdx \| /*.mdx)` | `/philosophy` | MDX singleton OR structured principle sections (`principle, statement, rationale, order`) |

**Validation:** every collection schema is a **Zod** schema in Velite config; `Image` fields are processed by `sharp` (AVIF + `blurDataURL`). Slugs and `seo` are required and validated at build (build fails on malformed content).

### 6.2 Typed static data

| Dataset | Path (`src/data/`) | Record shape |
|---|---|---|
| `experience` | `experience.ts` | `role, company, start, end, location, summary, highlights[], stack[]` |
| `timeline` | `timeline.ts` | `events: { date, title, type(role\|launch\|award\|talk\|education\|milestone), description, ref? }` — may aggregate experience + achievements + project launches |
| `certificates` | `certificates.ts` | `name, issuer, date, credentialId?, url?, image, skills[]` |
| `achievements` | `achievements.ts` | `title, date, category, description, link?, proof?` |
| `gallery` | `gallery.ts` | `src, alt, caption, category, width, height, blurDataURL, date` |
| `open-source` (curated) | `open-source.ts` | curated highlights `{ repo, title, why, role, tags[] }` merged with live repo data |

All datasets are typed in `src/types` and (where they share shape with content) validated with the same Zod primitives for consistency.

### 6.3 Live GitHub API

`/github` (and the curated `/open-source` cards) read live data server-side using `GITHUB_TOKEN`, cached via **ISR (`revalidate ≈ 3600s`)** for first paint, with an optional **React Query** client refresh on interaction. See §10 for the data model.

---

## 7. MDX strategy

| Concern | Decision |
|---|---|
| Engine | **Velite** (not Contentlayer) — type-safe collections, Zod schemas, asset pipeline |
| Components | central MDX registry in `src/mdx` — headings (auto-anchored), `pre`/`code` via **Shiki dual-theme** (semantic dark), callouts, images (`next/image` w/ `blurDataURL`), embeds |
| TOC | generated by Velite (`toc` field) → rendered as a sticky in-article nav on detail pages |
| Reading time | computed at build (`readingTime`) for blog |
| Drafts | `draft: true` excluded from `generateStaticParams`, sitemap, RSS, and lists (visible only in dev) |
| Syntax theme | tokens locked: keyword `#5E8BFF`, function `#38E8C8`, string `#3DD68C`, number `#F5B544`, comment `#687085`, type `#A78BFA`, tag `#FF6B6B` (see foundation) |
| Rendering | RSC at build — zero client MDX runtime in first-load chunk |

---

## 8. Project taxonomy

| Facet | Field | Values | Use |
|---|---|---|---|
| **Kind** | `kind` | `software`, `creative`, `research`, `oss` | Primary filter; signals the hybrid range |
| **Status** | `status` | `live`, `archived`, `wip` | Badge + filter |
| **Year** | `year` | int | Sort + filter |
| **Featured** | `featured` | bool | Landing + index ordering |
| **Order** | `order` | int | Manual tiebreak within featured/year |
| **Tags** | `tags[]` | free taxonomy (e.g. `webgl`, `dx`, `realtime`, `design-system`) | Cross-link / filter |
| **Stack** | `stack[]` | tech labels (e.g. `Next.js`, `R3F`, `Postgres`) | Engineer signal + filter |
| **Links** | `links` | `live`, `repo`, `caseStudy` | CTAs |
| **Metrics** | `metrics[]` | `{label, value}` | Outcome proof |

**Default index sort:** `featured desc → year desc → order asc`. Filters (kind, status, tag, stack) are client-side, URL-state only.

---

## 9. Blog & research taxonomies

### 9.1 Blog taxonomy

| Facet | Field | Values | Use |
|---|---|---|---|
| **Tags** | `tags[]` | topical (e.g. `performance`, `webgl`, `react`, `career`) | Filter + related posts |
| **Date / Updated** | `date`, `updated?` | ISO date | Sort, freshness, RSS |
| **Draft** | `draft` | bool | Visibility gate |
| **Reading time** | `readingTime` | minutes (computed) | Scan affordance |
| **Cover** | `cover?` | Image | Card + OG |

**Default sort:** `date desc`, drafts excluded. RSS (`/rss.xml`) is generated from published posts only.

### 9.2 Research taxonomy

| Facet | Field | Values | Use |
|---|---|---|---|
| **Status** | `status` | `published`, `preprint`, `wip` | Badge + credibility filter |
| **Venue** | `venue?` | string | Authority signal |
| **Authors** | `authors[]` | string[] | Attribution |
| **Date** | `date` | ISO date | Sort |
| **Tags** | `tags[]` | research areas | Filter |
| **Links** | `links` | `pdf`, `doi`, `code` | Verifiable artifacts |

**Default sort:** `date desc`; `published` surfaced above `preprint`/`wip` where ranked.

---

## 10. GitHub Dashboard data model

`/github` is the primary justification for TanStack Query + GitHub API caching. Server-fetched + ISR for first paint; client React Query for on-demand refresh.

| Block | Source (GitHub API) | Fields | Refresh |
|---|---|---|---|
| **Profile stats** | `users/{login}` + GraphQL | followers, public repos, total stars, total contributions | ISR 3600s |
| **Contribution calendar** | GraphQL `contributionsCollection` | weeks[] → days[{date, count, level}] | ISR 3600s |
| **Top repos** | `users/{login}/repos` (sorted) | name, description, stars, forks, primaryLanguage, updatedAt, url | ISR 3600s |
| **Language breakdown** | aggregate repo languages | `[{language, bytes, pct, color}]` | ISR 3600s |
| **Open-source highlights** | curated `open-source.ts` ⨯ live repo lookup | curated `why/role` + live stars/lang/lastCommit | ISR + client refresh |

**Visualization tokens (locked):** chart-1…6 `#5E8BFF / #38E8C8 / #A78BFA / #F5B544 / #FF6B6B / #3DD68C`; contribution heat ramp (dark) `#10131F → #1F3A5F → #2F6FB0 → #4F9BFF → #8FC2FF`.

**Failure posture:** if the live fetch fails, the ISR-cached snapshot renders; if there is no snapshot, a graceful **empty/degraded state** is shown (see [UX Flow §Error/Empty states](./ux-flow.md)) — the page never hard-fails.

---

## 11. Metadata & machine routes

| File | Output | Notes |
|---|---|---|
| `sitemap.ts` | `/sitemap.xml` | all indexable routes incl. dynamic slugs (excl. drafts, utility noindex) |
| `robots.ts` | `/robots.txt` | AI crawlers allowed via config flag; non-prod disallow |
| `manifest.ts` | `/manifest.webmanifest` | `theme_color` = brand-black `#05070D` |
| `rss.xml` | blog feed | published posts, `feed` lib |
| `opengraph-image.tsx` | OG images | root + co-located per `projects/blog/research`, build-time |

JSON-LD (typed via `schema-dts`): Person + WebSite (root), ProfilePage (`/about`), CreativeWork/SoftwareSourceCode (`/projects/[slug]`), BlogPosting (`/blog/[slug]`), ScholarlyArticle (`/research/[slug]`), BreadcrumbList (all nested routes).

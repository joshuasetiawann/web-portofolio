# SEO Checklist

Production/as-built SEO reference for the Joshua Setiawan portfolio (Next.js 16 App
Router). Each item lists what is implemented and how to verify it. Status legend:

- **Done** — implemented and shipping.
- **Verify** — implemented, but value depends on runtime/config; confirm in production.
- **Action** — requires a production-time setting or content step.

> Critical prerequisite: `NEXT_PUBLIC_SITE_URL` must be set to the real canonical
> origin in production (it defaults to `http://localhost:3000`). Canonicals, OpenGraph
> URLs, `metadataBase`, the sitemap, and `robots` host all derive from it
> (`src/lib/env.ts`, `src/lib/seo.ts`). If unset, every absolute URL breaks.

---

## 1. Metadata foundation

| Item | Status | Detail |
| --- | --- | --- |
| `metadataBase` set | Done | `new URL(env.NEXT_PUBLIC_SITE_URL)` in `rootMetadata` (`src/lib/metadata.ts`). |
| Title template | Done | `title.template` + `title.default` from `defaultMetadataConfig` (`src/config/seo.ts`). |
| Default description / keywords | Done | `rootMetadata.description`, `keywords` (`src/lib/metadata.ts`). |
| Authors / creator / applicationName | Done | Set from `siteConfig` in `rootMetadata`. |
| Viewport + themeColor (dark/light) | Done | `export const viewport` in `src/app/layout.tsx` (`#05070d` dark, `#f7f8fb` light). |
| `lang="en"` on `<html>` | Done | `src/app/layout.tsx`. |

**Verify:** `curl -s https://<domain>/ | grep -i '<title>\|og:\|canonical'`, or run
Lighthouse SEO audit and inspect the rendered `<head>`.

## 2. Per-page (static) metadata

| Item | Status | Detail |
| --- | --- | --- |
| Every route exports metadata | Done | All 16 static `(site)` routes call `buildMetadata({ title, description, path })` — landing, about, philosophy, projects, research, open-source, blog, experience, timeline, gallery, certificates, achievements, github, contact (verified via `export const metadata`). |
| Per-page canonical | Done | `buildMetadata` sets `alternates.canonical = absoluteUrl(path)`. |
| Per-page OpenGraph + Twitter | Done | `buildMetadata` emits `openGraph` (type/url/title/description/siteName/locale) and `twitter` (`summary_large_image`, creator/site handle). |

**Verify:** View source on each route; confirm `<link rel="canonical">` matches the
absolute page URL and `og:url`/`og:title` are present.

## 3. Dynamic metadata (detail routes)

| Item | Status | Detail |
| --- | --- | --- |
| Project `[slug]` metadata | Done | `generateMetadata` in `src/app/(site)/projects/[slug]/page.tsx` — title=`project.title`, description=`project.summary`, `type:"article"`, returns `{ title: "Not found" }` for unknown slugs. |
| Blog `[slug]` metadata | Done | `generateMetadata` in `src/app/(site)/blog/[slug]/page.tsx` — title/description from the post, `type:"article"`, fallback metadata for missing posts. |
| `generateStaticParams` (SSG) | Done | Projects + blog detail routes pre-render all slugs (data array / Velite posts). |

**Verify:** Visit `/projects/<slug>` and `/blog/<slug>`; confirm title/description/canonical
reflect the specific item. Hit an invalid slug to confirm `notFound()` (404).

## 4. OpenGraph / social images

| Item | Status | Detail |
| --- | --- | --- |
| Default site OG image | Done | `src/app/opengraph-image.tsx` renders a branded 1200×630 PNG via `renderOgImage` (`src/lib/og.tsx`, `next/og` / Satori). `alt`, `size`, `contentType` exported. |
| Per-project OG image | Done | `src/app/(site)/projects/[slug]/opengraph-image.tsx` (+ `generateStaticParams`). |
| Per-post OG image | Done | `src/app/(site)/blog/[slug]/opengraph-image.tsx` (+ `generateStaticParams`). |
| Twitter card type | Done | `summary_large_image` inherits the OG image via the file convention. |

Note: OG images come from the `opengraph-image` file convention, NOT from
`metadata.openGraph.images` — `buildMetadata` deliberately omits image fields so the
nearest `opengraph-image` route wins.

**Verify:** Open `https://<domain>/opengraph-image`, `/projects/<slug>/opengraph-image`,
`/blog/<slug>/opengraph-image` directly. Validate cards with the
[opengraph.xyz](https://www.opengraph.xyz/) debugger or the platform-native validators.

## 5. Canonical URLs

| Item | Status | Detail |
| --- | --- | --- |
| Root canonical | Done | `alternates.canonical: "/"` in `rootMetadata`. |
| Slash normalization | Done | `absoluteUrl()` strips trailing base slash and forces a single leading slash (`src/lib/seo.ts`). |
| Absolute, origin-correct | Verify | Correct only when `NEXT_PUBLIC_SITE_URL` is the production origin. |

**Verify:** Confirm no duplicate/relative canonicals; ensure trailing-slash behavior is
consistent with Next defaults (no `trailingSlash` override in `next.config.ts`).

## 6. Sitemap

| Item | Status | Detail |
| --- | --- | --- |
| Static routes | Done | `ROUTE_PATHS` (all 14 nav routes) mapped in `src/app/sitemap.ts`; `/` priority 1 / weekly, others 0.7 / monthly. |
| Dynamic project routes | Done | Each `projects[]` entry → `/projects/<slug>`, `lastModified` from `project.year`, priority 0.8. |
| Dynamic blog routes | Done | `getAllPosts()` → post URLs, `lastModified` from `post.updated ?? post.date`. |
| Research detail | N/A (by design) | Research has no detail route, so none are emitted. |

**Verify:** `curl -s https://<domain>/sitemap.xml`; confirm absolute URLs and that counts
match data + posts. Submit in Google Search Console.

## 7. robots.txt

| Item | Status | Detail |
| --- | --- | --- |
| Production indexable | Done | `src/app/robots.ts`: when `VERCEL_ENV === "production"`, allows `/`, disallows `/api/`, advertises `sitemap` + `host`. |
| Preview blocked | Done | Any non-production env returns `disallow: "/"` so previews never compete for ranking. |

**Verify:** `curl https://<domain>/robots.txt` on production (expect allow + sitemap) and on
a Vercel preview deploy (expect `Disallow: /`).

## 8. Web App Manifest

| Item | Status | Detail |
| --- | --- | --- |
| Manifest route | Done | `src/app/manifest.ts` — name/short_name/description from `siteConfig`, `display: standalone`, background/theme `#05070d`, `start_url: "/"`. |
| Icons | Done | `/icon.svg` (`src/app/icon.svg`) referenced; `favicon.ico` present (`src/app/favicon.ico`). |

**Verify:** `curl https://<domain>/manifest.webmanifest`; Lighthouse PWA/installability
section. Consider adding raster (PNG) maskable icons if a richer install experience is wanted.

## 9. Structured data (JSON-LD)

| Item | Status | Detail |
| --- | --- | --- |
| Renderer | Done | `JsonLd` component injects a typed `application/ld+json` script (`src/components/shared/json-ld.tsx`). |
| Landing `@graph` | Done | `Person` + `WebSite` nodes with `@id` cross-refs and `sameAs` social links (`src/app/(site)/page.tsx`). |
| Project detail | Done | `CreativeWork` (name/description/url/dateCreated/keywords/creator, conditional `sourceOrganization`/`sameAs`). |
| Blog detail | Done | `BlogPosting` (headline/description/datePublished/dateModified/author/url/mainEntityOfPage). |
| Contact page | Done | `ContactPage` with `Person` `mainEntity` (`src/app/(site)/contact/page.tsx`). |

**Verify:** Run each URL through the
[Rich Results Test](https://search.google.com/test/rich-results) and the
[Schema Markup Validator](https://validator.schema.org/).

## 10. Headings & semantic structure

| Item | Status | Detail |
| --- | --- | --- |
| Single H1 per page | Verify | Page heroes (`PageHero`/`Hero`) provide the H1; section titles use H2 (`SectionHeader`). Spot-check no duplicate H1. |
| Landmarks | Done | `<header>`, `<main id="main-content">`, `<footer>`, labeled `<nav>` in `src/components/layout/page-shell.tsx` + header/footer. |
| Logical heading order | Verify | Confirm no skipped levels (e.g. H2→H4) on content-rich pages. |

**Verify:** Browser a11y tree / [HeadingsMap] extension; Lighthouse "Document has a
logical heading order".

## 11. Internal linking

| Item | Status | Detail |
| --- | --- | --- |
| `next/link` navigation | Done | Header, footer, mobile menu, breadcrumbs, cards, CTA sections use `next/link`. |
| Breadcrumbs on detail pages | Done | `Breadcrumbs` on project + blog detail routes. |
| Related content cross-links | Done | `getRelatedProjects` / `getRelatedPosts` render related cards. |

**Verify:** Crawl with Screaming Frog or `npx linkinator https://<domain>` to catch broken
internal links and orphan pages.

## 12. Image alt text

| Item | Status | Detail |
| --- | --- | --- |
| Card/cover images | Done | Project/blog/featured cards use descriptive alt (`` `${title} cover` ``). |
| Gallery images | Done | `gallery-item.tsx` uses authored `item.alt` from data. |
| MDX images | Done | `mdx-components.tsx` passes through `alt`. |
| GitHub avatar | Done | `` `${user.name}'s GitHub avatar` `` on the GitHub page. |
| Decorative visuals | Done | Hero WebGL scene marked `aria-hidden`; decorative icons `aria-hidden`. |

**Verify:** Ensure every `gallery` data entry ships a meaningful `alt` (see
`docs/CONTENT-CHECKLIST.md`); Lighthouse "Image elements have `[alt]`".

## 13. Crawl / rendering hygiene

| Item | Status | Detail |
| --- | --- | --- |
| Content server-rendered | Done | RSC pages; hero copy is real DOM (not gated behind JS/motion). 3D/GSAP are decorative and code-split. |
| GitHub data SEO-friendly | Done | Server fetch + ISR (1h) — content is in the HTML, not client-fetched (`src/lib/github.ts`). |
| 404 handling | Done | `not-found.tsx`; invalid detail slugs call `notFound()`. |
| Analytics non-blocking | Done | `@vercel/analytics` + `@vercel/speed-insights` injected after content in `layout.tsx`. |

**Verify:** Disable JS and confirm primary content + headings still render; use Google
Search Console URL Inspection ("View crawled page") to confirm the rendered HTML.

---

### Quick verification commands

```bash
# Absolute-URL artifacts
curl -s https://<domain>/sitemap.xml | head
curl -s https://<domain>/robots.txt
curl -s https://<domain>/manifest.webmanifest

# Head tags for a route
curl -s https://<domain>/projects/<slug> | grep -iE 'canonical|og:|twitter:|<title>'

# OG image renders
open https://<domain>/opengraph-image
```

Recommended audits: Lighthouse (SEO category), Google Rich Results Test, Schema Markup
Validator, opengraph.xyz, and Google Search Console (coverage + sitemap submission).

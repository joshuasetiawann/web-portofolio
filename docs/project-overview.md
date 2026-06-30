# Project Overview

## What this is

This repository is the personal portfolio of **Joshua Setiawan** — a single, statically-optimized Next.js (App Router) application that presents his work, writing, and open-source activity as an immersive but accessible experience.

It is a finished, production-targeted site: every page is built, the content model is in place (seeded with replaceable placeholders), and the typecheck / lint / format / build pipeline is green. The deploy target is Vercel.

## Goals

- **Showcase, credibly.** Present projects, research, experience, certificates, and achievements with detail-rich, purpose-built layouts rather than a generic template.
- **Feel crafted.** Use 3D, scroll, and micro-motion to create a memorable first impression — without sacrificing load performance or accessibility.
- **Stay honest with motion.** Respect user intent: all animation is gated on a reduced-motion preference (the OS setting and an in-app toggle), and the heavy 3D / GSAP work is code-split off the critical path.
- **Be findable.** Treat SEO as a first-class concern — centralized metadata, dynamic Open Graph images, structured data, sitemap, robots, and manifest are all generated from a single source of truth.
- **Stay maintainable.** A typed content model, validated environment, strict TypeScript, and enforced commit/formatting conventions keep the project easy to evolve.

## Page map

The canonical route map lives in `src/constants/routes.ts`. The site comprises **18 pages** under the `(site)` route group, plus root-level App Router files.

| Page | Route | Purpose |
| --- | --- | --- |
| Landing | `/` | Hero with the 3D "Signal Field" and an overview of everything else. |
| About | `/about` | Personal narrative and background. |
| Engineering Philosophy | `/philosophy` | How Joshua approaches building software. |
| Projects | `/projects` | Project index. |
| Project detail | `/projects/[slug]` | Per-project case study. |
| Research | `/research` | Research work and writing. |
| Open Source | `/open-source` | Contribution philosophy, repo highlights, published packages. |
| Blog | `/blog` | MDX blog index. |
| Blog post | `/blog/[slug]` | Rendered MDX article. |
| Experience | `/experience` | Professional history. |
| Timeline | `/timeline` | GSAP + ScrollTrigger scroll narrative (the only GSAP route). |
| Gallery | `/gallery` | Visual gallery. |
| Certificates | `/certificates` | Credentials. |
| Achievements | `/achievements` | Awards and milestones. |
| GitHub | `/github` | Live GitHub dashboard (profile, top repos, language stats, recent activity). |
| Contact | `/contact` | Contact form (React Hook Form + Zod + Server Action). |

> The Projects and Blog index pages each pair with a `[slug]` dynamic route, which is why the 14 top-level entries above expand to 18 pages.

Root-level App Router files supply the surrounding chrome and platform integration: `layout.tsx`, `loading.tsx`, `error.tsx` / `global-error.tsx`, `not-found.tsx` (custom 404), `sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`, and the `icon.svg` / `favicon.ico` assets.

## High-level architecture

### Rendering model

Built on the **Next.js App Router** with React 19. Most pages are static or statically optimized. The two places that reach outside the build are:

- **The GitHub dashboard** (`/github`) and the Open Source page, which fetch public GitHub data **server-side with ISR** (hourly revalidation, `src/lib/github.ts` + `src/lib/github-stats.ts`). There is deliberately no client-side data-fetching layer — server fetch + ISR is faster and SEO-friendly.
- **The contact form**, which posts to a typed **Server Action** (`src/actions/contact.ts`).

### Content model

Two complementary sources:

- **Blog → MDX.** Posts live in `src/content/blog/*.mdx`. [Velite](https://velite.js.org) (`velite.config.ts`) validates frontmatter and compiles each post into the typed `.velite` output, surfaced through `@/lib/content` and rendered by the MDX component registry in `@/components/mdx`.
- **Everything else → typed data arrays.** Projects, research, experience, timeline, gallery, certificates, achievements, skills, and social links are TypeScript arrays in `src/data/*`. These carry richer, layout-specific shapes than frontmatter could comfortably express, which suits the card and detail views.

Placeholders are replaced by following `docs/CONTENT-CHECKLIST.md`.

### Providers & client composition

Client concerns are composed in a single tree (`src/providers/app-providers.tsx`) in the order **Theme → Motion → Tooltip → Lenis**, with a global toaster:

- **Theme** — `next-themes`, dark by default with a light option.
- **Motion** — establishes Framer Motion's `LazyMotion` + `domAnimation` context (so only `m.*` components are used, keeping the bundle small) and the reduced-motion state.
- **Tooltip** — Radix tooltip context.
- **Lenis** — smooth scrolling.

### Motion & 3D strategy

- **Reduced-motion first.** A single `useReducedMotion` source combines the OS preference with an in-app toggle; animations everywhere respect it. Hero copy renders visibly (not gated), and page transitions are transform-only so they remain safe for LCP and degrade gracefully with JS off.
- **3D is lazy.** The Three.js "Signal Field" (`src/three/scenes/signal-field.tsx`, mounted via `src/three/components/r3f-canvas.tsx`) is `dynamic`-imported with `ssr: false`, keeping it off the server render and the critical path.
- **GSAP is route-scoped.** GSAP + ScrollTrigger is accessed only through `src/lib/motion/gsap.ts`, imported solely by the Timeline page, so GSAP never enters the shared first-load bundle.

### Styling & design system

Tailwind CSS v4 with a **CSS-first `@theme`** configuration in `src/styles/globals.css` (plus `tokens.css`). UI primitives come from **shadcn/ui** built on the unified `radix-ui` package. Icons are `lucide-react`, supplemented by inline brand SVGs in `src/lib/icons.tsx` (lucide dropped brand icons).

### Configuration & environment

Site identity and navigation are centralized in `src/config/*` and `src/constants/*`, composed from a **typed, build-time-validated environment** (`src/lib/env.ts` via `@t3-oss/env-nextjs`). Invalid env values fail the build. `NEXT_PUBLIC_SITE_URL` is the canonical origin that feeds metadata, OG images, and the sitemap — it must point at the real domain in production.

### SEO, accessibility & performance

- **SEO** — centralized metadata helpers (`@/lib/metadata`, `@/lib/seo`), dynamic OG images (`app/opengraph-image.tsx` and per-`[slug]`), a static + dynamic `sitemap.ts`, `robots.ts`, `manifest.ts`, and JSON-LD.
- **Accessibility** — WCAG 2.2 AA, including corrected light-theme contrast.
- **Performance** — `next/image` (AVIF/WebP), `next/font`, ISR for GitHub data, `sharp` for image optimization, and the code-split 3D/GSAP described above. `@vercel/analytics` and `@vercel/speed-insights` provide field telemetry.

## Where to go next

- **Run it / deploy it:** the root [`README.md`](../README.md).
- **Technology choices and rationale:** [`tech-stack.md`](tech-stack.md).
- **Filling in real content:** [`CONTENT-CHECKLIST.md`](CONTENT-CHECKLIST.md).
- **Folder-by-folder reference:** [`folder-structure.md`](folder-structure.md).

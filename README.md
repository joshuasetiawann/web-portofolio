# Joshua Setiawan — Portfolio

A production-grade personal portfolio for **Joshua Setiawan**, built with the Next.js App Router. It pairs an immersive, motion-rich front end with a disciplined content model, first-class accessibility, and SEO that is correct by construction.

> **Live data, real motion, no fluff.** An interactive 3D hero, GSAP scroll storytelling, an MDX blog, and a GitHub dashboard fed straight from the GitHub API — all reduced-motion aware and WCAG 2.2 AA compliant.

---

## Highlights

- **18 content pages** (App Router): Landing, About, Engineering Philosophy, Projects (+ detail), Research, Open Source, Blog (+ detail), Experience, Timeline, Gallery, Certificates, Achievements, GitHub, and Contact — plus a custom 404 and route-level loading states.
- **Immersive 3D hero** — a Three.js "Signal Field" rendered through `@react-three/fiber`, lazily `dynamic`-imported with `ssr: false` so it never blocks first paint.
- **Considered motion** — Framer Motion 12 via `LazyMotion` + `domAnimation` (`m.*` only, smaller bundle), GSAP + ScrollTrigger for the Timeline (lazy, route-scoped), and Lenis smooth scroll. Every animation is gated on a reduced-motion preference (OS setting **and** an in-app toggle).
- **Dark / light theming** — `next-themes` with a dark default, driven by Tailwind v4 CSS-first `@theme` tokens.
- **MDX blog** — authored in `src/content/blog/*.mdx`, compiled and validated by [Velite](https://velite.js.org) into a typed `.velite` output, rendered through a controlled MDX component registry.
- **Live GitHub dashboard** — profile, top repositories, language distribution, and recent activity fetched server-side with ISR (hourly revalidation), no client-side data layer required.
- **Accessible & SEO-correct** — WCAG 2.2 AA, centralized metadata, dynamic Open Graph images, static + dynamic sitemap, robots, web manifest, and JSON-LD.

For the full technology breakdown and rationale see **[`docs/tech-stack.md`](docs/tech-stack.md)**; for the architecture and page map see **[`docs/project-overview.md`](docs/project-overview.md)**.

---

## Tech stack at a glance

| Area      | Choice                                                        |
| --------- | ------------------------------------------------------------- |
| Framework | Next.js 16.2.9 (App Router), React 19.2.4                     |
| Language  | TypeScript 5 (strict)                                         |
| Styling   | Tailwind CSS v4 (CSS-first `@theme`), shadcn/ui on `radix-ui` |
| Motion    | Framer Motion 12 (`LazyMotion`), GSAP + ScrollTrigger, Lenis  |
| 3D        | Three.js + `@react-three/fiber`                               |
| State     | Zustand (UI store)                                            |
| Forms     | React Hook Form + Zod (+ a typed Server Action)               |
| Content   | Velite (MDX blog) + typed data arrays (`src/data/*`)          |
| Theming   | `next-themes` (dark default)                                  |
| Env       | `@t3-oss/env-nextjs` (typed, build-time validated)            |
| Analytics | `@vercel/analytics` + `@vercel/speed-insights`                |
| Tooling   | pnpm 11.9, ESLint, Prettier, Husky + commitlint               |

---

## Project structure

```
src/
  app/            App Router. (site)/* holds the 18 pages; root holds layout,
                  loading, error, not-found, sitemap, robots, manifest,
                  opengraph-image, icons.
  components/     ui (shadcn), layout, sections, portfolio, common, motion,
                  three, shared, forms, mdx, transitions.
  providers/      Composed client providers (Theme > Motion > Tooltip > Lenis).
  hooks/          Reusable React hooks.
  lib/            utils, env, metadata, seo, content, github, github-stats,
                  icons, og, motion/gsap.
  animations/     easings, variants, reveal, scroll, transitions.
  three/          scenes/signal-field, components/r3f-canvas, constants.
  stores/         Zustand UI store.
  config/         site, navigation, seo.
  constants/      routes, site, animation.
  data/           Typed content: projects, research, experience, timeline,
                  gallery, certificates, achievements, skills, social-links.
  actions/        Server Actions (contact form).
  types/ utils/   Shared types and helpers.
  styles/         globals.css, tokens.css.
  content/blog/   MDX blog posts (compiled by Velite into .velite).
```

**Path aliases:** `@/*` → `src/*`, and `#site/content` → `.velite` (Velite output).

A deeper structural reference lives in [`docs/folder-structure.md`](docs/folder-structure.md).

---

## Getting started

### Prerequisites

- **Node.js** — `>= 20.9.0` (the repo pins **Node 26** via `.nvmrc`; run `nvm use`).
- **pnpm** — `11.9` (declared in `packageManager`; enable with `corepack enable`).

### Install & run

```bash
pnpm install
cp .env.example .env.local   # then edit values (see below)
pnpm dev                     # runs `velite` then `next dev`
```

The dev server starts on http://localhost:3000. The `dev`, `build`, and `typecheck` scripts all run Velite first so the compiled blog content in `.velite` is always present and current.

---

## Environment variables

Copy the example file and fill it in:

```bash
cp .env.example .env.local
```

| Variable                      | Scope  | Required       | Purpose                                                                                                                                                |
| ----------------------------- | ------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`        | Public | **Yes (prod)** | Canonical production origin (no trailing slash). Drives metadata, canonicals, Open Graph images, and the sitemap. Defaults to `http://localhost:3000`. |
| `NEXT_PUBLIC_SITE_NAME`       | Public | No             | Display name used across metadata and structured data. Defaults to `Joshua Setiawan`.                                                                  |
| `NEXT_PUBLIC_GITHUB_USERNAME` | Public | No             | GitHub username powering the GitHub dashboard and Open Source page.                                                                                    |
| `GITHUB_TOKEN`                | Server | No             | Read-only PAT that raises the GitHub API rate limit.                                                                                                   |
| `RESEND_API_KEY`              | Server | No             | Reserved for the contact form (see note below).                                                                                                        |
| `CONTACT_TO_EMAIL`            | Server | No             | Reserved destination inbox for contact submissions.                                                                                                    |

> **⚠️ Production warning:** `NEXT_PUBLIC_SITE_URL` **must** be set to your real domain in production. If it is left at the localhost default, canonical URLs, Open Graph images, and the sitemap will all point at `localhost` and break.

Environment variables are validated at build time via `@t3-oss/env-nextjs` (`src/lib/env.ts`); **invalid values fail the build** rather than surfacing at runtime.

> **Contact form note:** the contact Server Action currently validates input (with a honeypot + minimum fill-time bot check) and returns a friendly success message **without sending an email**. Wiring `RESEND_API_KEY` + `CONTACT_TO_EMAIL` to an actual transactional send is a follow-up.

---

## Scripts

| Script               | What it does                                                       |
| -------------------- | ------------------------------------------------------------------ |
| `pnpm dev`           | `velite && next dev` — compile content, then start the dev server. |
| `pnpm build`         | `velite && next build` — compile content, then production build.   |
| `pnpm start`         | Serve the production build.                                        |
| `pnpm content`       | Run Velite once (compile MDX → `.velite`).                         |
| `pnpm content:watch` | Run Velite in watch mode.                                          |
| `pnpm lint`          | ESLint.                                                            |
| `pnpm lint:fix`      | ESLint with autofix.                                               |
| `pnpm typecheck`     | `velite && tsc --noEmit`.                                          |
| `pnpm format`        | Prettier write.                                                    |
| `pnpm format:check`  | Prettier check (no writes).                                        |
| `pnpm check`         | Full gate: `typecheck && lint && format:check && build`.           |
| `pnpm prepare`       | Install Husky git hooks.                                           |

**Git hooks (Husky):** `pre-commit` runs `lint-staged`; `commit-msg` runs `commitlint` (Conventional Commits required).

---

## Editing content

- **Blog posts** are MDX in `src/content/blog/*.mdx`, compiled and validated by Velite (`velite.config.ts`) into `.velite`, accessed through `@/lib/content`, and rendered by `@/components/mdx`.
- **Everything else** (projects, research, experience, timeline, gallery, certificates, achievements, skills, social links) is a **typed data array** under `src/data/*` — richer shapes purpose-built for card and detail layouts.

Replace the seeded placeholders by following **[`docs/CONTENT-CHECKLIST.md`](docs/CONTENT-CHECKLIST.md)**.

---

## Build & deploy

The deploy target is **[Vercel](https://vercel.com)**.

1. Push the repository to GitHub and import it into Vercel.
2. Set the environment variables above in the Vercel project — at minimum a real `NEXT_PUBLIC_SITE_URL`.
3. Vercel uses the standard build command `pnpm build` (which runs Velite first) and serves the App Router output. ISR keeps the GitHub dashboard fresh (hourly revalidation).

Before shipping, run the full quality gate locally:

```bash
pnpm check
```

For step-by-step deployment guidance and the pre-launch sign-off, see **[`docs/deployment.md`](docs/deployment.md)** and **[`docs/final-production-checklist.md`](docs/final-production-checklist.md)**.

---

## Quality

- `typecheck`, `lint`, `format:check`, and `build` all pass.
- **Accessibility:** WCAG 2.2 AA (including corrected light-theme contrast).
- **SEO:** centralized metadata, dynamic OG images, static + dynamic sitemap, robots, manifest, JSON-LD.
- **Performance:** `next/image` (AVIF/WebP), `next/font`, ISR for GitHub data, and code-split 3D/GSAP off the critical path.

---

## License

_License: TBD — add a `LICENSE` file before publishing._

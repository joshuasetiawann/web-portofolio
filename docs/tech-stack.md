# Tech Stack

This document lists every significant technology in the portfolio, the role it plays, and why it was chosen. Versions reflect the as-built `package.json`.

## Runtime & tooling

| Tech | Version | Role & why |
| --- | --- | --- |
| **Node.js** | `>= 20.9.0` (`.nvmrc` pins **26**) | Runtime. `engines` enforces a floor; `.nvmrc` pins the development version. |
| **pnpm** | `11.9.0` | Package manager. Fast, disk-efficient, strict dependency resolution; pinned via `packageManager`. |
| **TypeScript** | `5` (strict) | Type safety across the whole codebase. `strict` is on; `exactOptionalPropertyTypes` is intentionally off. |

## Framework & UI runtime

| Tech | Version | Role & why |
| --- | --- | --- |
| **Next.js** | `16.2.9` | App Router framework. Server Components, Server Actions, ISR, image/font optimization, and file-based metadata in one toolchain. The deploy target (Vercel) is first-party. |
| **React** | `19.2.4` | UI runtime, paired with the matching `react-dom`. |

## Styling & design system

| Tech | Version | Role & why |
| --- | --- | --- |
| **Tailwind CSS** | `v4` | Styling, configured **CSS-first** via `@theme` in `src/styles/globals.css` + `tokens.css` — no JS config file. Design tokens live in CSS. |
| **@tailwindcss/postcss** | `4` | Tailwind v4 PostCSS pipeline. |
| **@tailwindcss/typography** | `0.5` | Prose styling for rendered MDX blog posts. |
| **shadcn/ui** on **radix-ui** | `radix-ui ^1.6` | Accessible, unstyled primitives composed into the project's own components. Uses the unified `radix-ui` package rather than per-primitive installs. |
| **class-variance-authority**, **clsx**, **tailwind-merge** | — | Variant and className composition utilities standard to a shadcn setup. |
| **tw-animate-css** | `1.4` | Lightweight utility animations. |
| **lucide-react** | `1.22` | Icon set. Supplemented by **inline brand SVGs** in `src/lib/icons.tsx` because lucide dropped brand icons. |
| **next-themes** | `0.4` | Dark/light theming. Dark is the default; light is fully supported. |
| **sonner** | `2.0` | Toast notifications (global toaster). |
| **cmdk** | `1.1` | Command-menu primitive. |

## Motion & 3D

| Tech | Version | Role & why |
| --- | --- | --- |
| **Framer Motion** | `12` | Primary animation library, used via **`LazyMotion` + `domAnimation`** so only `m.*` components ship — a meaningfully smaller motion bundle. All motion is reduced-motion gated. |
| **GSAP + ScrollTrigger** | `gsap ^3.15` | Scroll-driven storytelling on the **Timeline page only**. Loaded lazily through `src/lib/motion/gsap.ts`, registered once on the client, so GSAP never enters the shared first-load bundle. |
| **Lenis** | `1.3` | Smooth scrolling, wired through `src/providers/lenis-provider.tsx`. |
| **Three.js** | `0.185` | Powers the hero **"Signal Field"** 3D scene. |
| **@react-three/fiber** | `9.6` | React renderer for Three.js. The canvas is `dynamic`-imported with `ssr: false`, keeping 3D off the server render and the critical path. |

## State, forms & validation

| Tech | Version | Role & why |
| --- | --- | --- |
| **Zustand** | `5.0` | Minimal global UI store (`src/stores/ui-store.ts`) for cross-component UI state. |
| **React Hook Form** | `7.80` | Contact form state and validation, with **@hookform/resolvers** (`5.4`) bridging Zod. |
| **Zod** | `4.4` | Schema validation for the contact form and for typed environment variables. |

## Content

| Tech | Version | Role & why |
| --- | --- | --- |
| **Velite** | `0.4` | Compiles and validates the MDX blog (`src/content/blog/*.mdx`) into the typed `.velite` output, accessed via `@/lib/content`. Chosen for type-safe, build-time content over a runtime MDX pipeline. |

> Everything that is **not** the blog (projects, research, experience, timeline, gallery, certificates, achievements, skills, social links) is modeled as **typed TypeScript data arrays** in `src/data/*`, which carry richer, layout-specific shapes than frontmatter would.

## Platform, config & observability

| Tech | Version | Role & why |
| --- | --- | --- |
| **@t3-oss/env-nextjs** | `0.13` | Typed, **build-time-validated** environment variables (`src/lib/env.ts`). Invalid values fail the build instead of breaking at runtime. |
| **sharp** | `0.35` | High-performance image optimization (AVIF/WebP) behind `next/image`. |
| **@vercel/analytics** | `2.0` | Privacy-friendly web analytics. |
| **@vercel/speed-insights** | `2.0` | Real-user Core Web Vitals field data. |

## Quality & developer experience

| Tech | Version | Role & why |
| --- | --- | --- |
| **ESLint** + **eslint-config-next** | `9` / `16.2.9` | Linting aligned to the Next.js version. |
| **Prettier** + **prettier-plugin-tailwindcss** | `3.9` / `0.8` | Formatting, including automatic Tailwind class sorting. |
| **Husky** | `9.1` | Git hooks: `pre-commit` runs `lint-staged`; `commit-msg` runs commitlint. |
| **lint-staged** | `17` | Runs ESLint + Prettier only on staged files. |
| **@commitlint/cli** + **config-conventional** | `21` | Enforces Conventional Commits. |

## Removed in Phase 5 (and why)

Several dependencies present earlier were removed once they proved unused, keeping the dependency surface and bundle lean:

| Removed | Why |
| --- | --- |
| **@react-three/drei** | The hand-rolled "Signal Field" scene needed none of drei's helpers. |
| **@tanstack/react-query** | Unused — the only live data (GitHub) is fetched **server-side with ISR**, not via client React Query. No client data layer is required. |
| **@gsap/react** | The `useGSAP` hook wasn't needed; GSAP is accessed through the lazy `src/lib/motion/gsap.ts` helper instead. |
| **@mdx-js/react** | Velite compiles MDX at build time and the project renders through its own component registry, so the runtime MDX provider was redundant. |
| **tunnel-rat** | No cross-tree portaling pattern ended up being used. |
| **web-vitals** | Superseded by `@vercel/speed-insights` for field vitals. |

## Path aliases

- `@/*` → `src/*`
- `#site/content` → `.velite` (Velite's generated output)

---

For how these pieces fit together at runtime, see [`project-overview.md`](project-overview.md). For setup and scripts, see the root [`README.md`](../README.md).

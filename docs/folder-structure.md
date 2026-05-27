# Folder Structure

The as-built layout of the codebase. This is the production reference for *where
things live and why*. Everything application-related lives under `src/`; blog
content lives under `src/content/`.

> Stack context: Next.js 16 (App Router) · React 19 · TypeScript 5 (strict) ·
> Tailwind CSS v4 (CSS-first) · Velite (blog MDX) · typed data arrays for
> everything else. See `docs/component-guide.md` for the component taxonomy.

## Path aliases

Defined in `tsconfig.json` (`compilerOptions.paths`):

| Alias            | Resolves to | Used for |
| ---------------- | ----------- | -------- |
| `@/*`            | `./src/*`   | All application imports (`@/components/...`, `@/lib/...`, `@/data/...`). Always prefer this over relative `../../` paths. |
| `#site/content`  | `./.velite` | The Velite-generated, typed blog collection. **Imported in exactly one place** — `src/lib/content.ts` — which re-exports typed accessors. Pages never import `#site/content` directly. |

`.velite/` is generated (gitignored) by running `velite` (the `content`,
`dev`, `build`, and `typecheck` scripts all run it first). Velite also emits
processed blog assets into `public/static/`.

## Top-level layout

```
web-portofolio/
├── src/                 # All application code (see tree below)
├── public/              # Static assets served at the web root
│   └── static/          # Velite-processed blog assets (generated)
├── docs/                # Planning specs + this production reference set
├── .velite/             # Generated typed content (gitignored)
├── velite.config.ts     # Blog MDX pipeline config (collections → .velite)
├── next.config.ts       # Next.js config (image formats, etc.)
├── tsconfig.json        # TS config + path aliases
├── eslint.config.mjs    # Flat ESLint config
├── postcss.config.mjs   # Tailwind v4 via @tailwindcss/postcss
├── components.json      # shadcn/ui generator config
├── .env.example         # Documented env contract (see docs/environment-variables.md)
├── .nvmrc               # Node 26
└── package.json         # pnpm 11.9; scripts in docs/scripts.md
```

## `src/` tree

```
src/
├── app/                 # Next.js App Router — routes, layouts, route handlers
│   ├── layout.tsx           # Root layout: <html>, fonts, AppProviders, Analytics, root metadata + viewport
│   ├── loading.tsx          # Root loading UI
│   ├── not-found.tsx        # Global 404
│   ├── error.tsx            # Route-segment error boundary (client)
│   ├── global-error.tsx     # Root error boundary (client)
│   ├── opengraph-image.tsx  # Default dynamic OG image (next/og)
│   ├── icon.svg / favicon.ico   # App icons (file conventions)
│   ├── manifest.ts          # PWA web manifest
│   ├── robots.ts            # robots.txt route handler
│   ├── sitemap.ts           # Dynamic sitemap (static routes + blog/project slugs)
│   └── (site)/              # Route group — the public site, wrapped by the shared shell
│       ├── layout.tsx           # ScrollProgress + PageShell (header/footer) + PageTransition
│       ├── page.tsx             # Landing
│       ├── about/page.tsx
│       ├── philosophy/page.tsx          # Engineering Philosophy
│       ├── projects/page.tsx            # Listing (featured + filterable grid)
│       ├── projects/[slug]/page.tsx     # Case-study detail
│       ├── projects/[slug]/opengraph-image.tsx  # Per-project OG image
│       ├── research/page.tsx
│       ├── open-source/page.tsx
│       ├── blog/page.tsx                # Listing (Velite posts)
│       ├── blog/[slug]/page.tsx         # Post detail (renders compiled MDX)
│       ├── blog/[slug]/opengraph-image.tsx      # Per-post OG image
│       ├── experience/page.tsx
│       ├── timeline/page.tsx            # The only GSAP/ScrollTrigger page
│       ├── gallery/page.tsx
│       ├── certificates/page.tsx
│       ├── achievements/page.tsx
│       ├── contact/page.tsx             # React Hook Form + Zod + server action
│       └── github/                      # Live GitHub data (server fetch + ISR)
│           ├── page.tsx
│           └── loading.tsx              # Suspense fallback for the GitHub fetch
│
├── components/          # All React components, grouped by role (see component-guide.md)
│   ├── ui/                  # shadcn/ui primitives (radix-ui based)
│   ├── layout/             # Structural chrome: Header, Footer, PageShell, Container, Section, ...
│   ├── sections/           # Page-level composed blocks: Hero, HeroScene, PageHero, CTASection
│   ├── portfolio/          # Domain cards/grids bound to src/data (projects, research, timeline, ...)
│   ├── common/             # Small reusable display atoms (badges, stat cards, tag lists, ...)
│   ├── motion/             # Framer Motion wrappers (Reveal, Magnetic, ScrollProgress)
│   ├── three/              # WebGL entry boundary (SceneCanvas) — client + lazy
│   ├── shared/             # Cross-cutting helpers (links, copy button, empty/error/loading states, JsonLd)
│   ├── forms/              # Contact form + field/message primitives
│   ├── mdx/                # MDX renderer + element→component registry
│   └── transitions/        # Route transition (PageTransition)
│
├── providers/          # Client context providers (composed by AppProviders)
│   ├── app-providers.tsx    # Theme > Motion > Tooltip > Lenis + global Toaster
│   ├── theme-provider.tsx   # next-themes (dark default + light)
│   ├── motion-provider.tsx  # LazyMotion(domAnimation) + MotionConfig(reducedMotion:"user")
│   └── lenis-provider.tsx   # Lenis smooth scroll
│
├── hooks/              # Reusable client hooks
│   ├── use-reduced-motion.ts    # OS pref + in-app toggle → effective reduced-motion
│   ├── use-lenis.ts             # Access the Lenis instance
│   ├── use-magnetic.ts          # Pointer-follow magnetic effect
│   ├── use-media-query.ts
│   ├── use-scroll-progress.ts
│   ├── use-mounted.ts
│   └── use-isomorphic-layout-effect.ts
│
├── lib/                # Framework-agnostic helpers and integrations
│   ├── utils.ts             # cn() (clsx + tailwind-merge) and misc helpers
│   ├── env.ts               # @t3-oss/env-nextjs typed env (validated at build)
│   ├── metadata.ts          # rootMetadata + buildMetadata() per-page SEO helper
│   ├── seo.ts               # absoluteUrl() and URL helpers
│   ├── og.tsx               # Shared 1200×630 OG card renderer (next/og)
│   ├── content.ts           # Typed accessors over the Velite blog collection (the #site/content boundary)
│   ├── mdx.ts               # MDX types shared by the registry
│   ├── github.ts            # Server-side GitHub REST helpers (ISR, optional token)
│   ├── github-stats.ts      # Derive language/top-repo/summary stats from repos
│   ├── icons.tsx            # Name→icon resolver (lucide + inline brand SVGs)
│   ├── motion/gsap.ts       # Lazy GSAP + ScrollTrigger registration (timeline page only)
│   └── validations/contact.ts   # Zod schema for the contact form
│
├── actions/            # Server Actions
│   └── contact.ts           # "use server" — validates + honeypot; returns typed state (Resend wiring is a follow-up)
│
├── animations/         # Motion design tokens (data, not components)
│   ├── easings.ts           # DURATION + EASE curves
│   ├── variants.ts          # Framer Motion variants (fadeInUp, ...)
│   ├── reveal.ts            # Reveal presets
│   ├── scroll.ts            # Scroll-driven helpers
│   └── transitions.ts       # Transition presets
│
├── three/              # WebGL implementation (code-split off the critical path)
│   ├── components/r3f-canvas.tsx    # The @react-three/fiber <Canvas> (ssr:false, dynamic)
│   ├── scenes/signal-field.tsx      # The hero "Signal Field" scene
│   ├── shaders/                     # GLSL (placeholder, .gitkeep)
│   ├── utils/                       # Three helpers (reserved)
│   └── constants.ts                 # Scene tuning constants
│
├── stores/             # Zustand state
│   └── ui-store.ts          # Mobile menu, command palette, persisted motionPreference
│
├── config/             # App configuration objects
│   ├── site.ts              # siteConfig (name, url, author, links)
│   ├── navigation.ts        # Primary nav model
│   └── seo.ts               # Default SEO config (titles, keywords)
│
├── constants/          # Frozen constant values
│   ├── routes.ts            # ROUTES map (typed route strings)
│   ├── site.ts
│   └── animation.ts
│
├── data/               # Typed content arrays + accessors (everything except blog)
│   ├── projects.ts          # + getAllProjects/getFeaturedProjects/projectCategories
│   ├── research.ts
│   ├── experience.ts
│   ├── timeline.ts
│   ├── gallery.ts
│   ├── certificates.ts
│   ├── achievements.ts
│   ├── skills.ts
│   └── social-links.ts
│
├── types/              # Shared TypeScript types
│   ├── project.ts
│   ├── research.ts
│   ├── github.ts
│   ├── navigation.ts
│   └── common.ts
│
├── utils/              # Tiny pure utilities
│   ├── format-date.ts
│   ├── format-number.ts
│   ├── get-reading-time.ts
│   ├── slugify.ts
│   └── clamp.ts
│
├── styles/             # Global CSS (Tailwind v4 CSS-first)
│   ├── globals.css          # @theme tokens, base layer, utilities
│   └── tokens.css           # Design-token CSS variables
│
└── content/            # Authored content (source of truth for the blog)
    └── blog/*.mdx           # Posts → validated/compiled by Velite into .velite
```

## Where does X go?

| You're adding…                         | Put it in |
| -------------------------------------- | --------- |
| A new route/page                       | `src/app/(site)/<route>/page.tsx` |
| A blog post                            | `src/content/blog/<slug>.mdx` |
| Structured content (project, cert, …)  | the matching array in `src/data/*` |
| A shadcn primitive                     | `src/components/ui/` (via the shadcn CLI) |
| A composed UI piece                    | the role folder under `src/components/*` (see component-guide.md) |
| A reusable hook                        | `src/hooks/` |
| A pure helper / integration            | `src/lib/` (`src/utils/` for tiny pure functions) |
| A Server Action                        | `src/actions/` |
| Env access                             | import from `src/lib/env.ts` — never `process.env` directly |
| A constant / route string              | `src/constants/` |

## Conventions

- **Server-first.** Files are React Server Components unless they open with
  `"use client"`. Keep `"use client"` at the leaves; pages and layouts stay
  server components where possible.
- **One content boundary.** Blog data is reached only through
  `@/lib/content.ts`; structured data only through the `src/data/*` accessors.
- **No raw env.** All environment access flows through `@/lib/env` so it is
  validated at build time.
- **Generated, not committed.** `.velite/` and `public/static/` are produced by
  Velite; run `pnpm content` (or any `dev`/`build` script) to regenerate.

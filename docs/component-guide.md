# Component Guide

The component taxonomy, the server-vs-client convention, the props of the key
components, and the recipes for adding a new component or page consistently.

> See `docs/folder-structure.md` for where everything lives and the path
> aliases. All component imports use the `@/components/...` alias.

## Taxonomy

Components live under `src/components/` grouped by **role**, not by page. Pick a
folder by answering "what *kind* of thing is this?":

| Folder         | Responsibility | Examples |
| -------------- | -------------- | -------- |
| `ui/`          | shadcn/ui primitives (radix-ui based). Unopinionated, app-agnostic building blocks. Generated/managed via the shadcn CLI. | `button`, `card`, `dialog`, `sheet`, `tabs`, `accordion`, `command`, `dropdown-menu`, `input`, `textarea`, `label`, `badge`, `separator`, `skeleton`, `tooltip`, `sonner` |
| `layout/`      | Structural chrome and spacing primitives that frame pages. | `Header`, `Footer`, `PageShell`, `Container`, `Section`, `SectionHeader`, `MobileMenu`, `ThemeToggle` |
| `sections/`    | Larger composed blocks placed directly on pages. | `Hero`, `HeroScene`, `PageHero`, `CTASection` |
| `portfolio/`   | Domain components bound to `src/data/*` — the cards and grids that render projects, research, experience, etc. | `ProjectCard`, `FeaturedProjectCard`, `ProjectGrid`, `ProjectFilter`, `ResearchCard`, `ExperienceCard`, `TimelineItem`, `TimelineRail`, `BlogCard`, `BlogGrid`, `CertificateCard`, `AchievementCard`, `GalleryItem`, `GithubStatsCard`, `ContentCard`, `TechStackList` |
| `common/`      | Small, reusable display atoms used across many pages. | `SkillBadge`, `AvailabilityBadge`, `Breadcrumbs`, `SocialLinks`, `StatCard`, `TagList`, `CodeSnippet` |
| `motion/`      | Framer Motion wrappers; all reduced-motion gated. | `Reveal`, `Magnetic`, `ScrollProgress` |
| `three/`       | The WebGL entry boundary. Lazy, client-only. | `SceneCanvas` |
| `shared/`      | Cross-cutting utility components and state placeholders. | `ExternalLink`, `CopyButton`, `CodeBlock`, `JsonLd`, `EmptyState`, `ErrorState`, `NotFoundState`, `LoadingState`, `LoadingSkeleton` |
| `forms/`       | Form composition. | `ContactForm`, `FormField`, `FormMessage` |
| `mdx/`         | Blog MDX rendering. | `MDXContent` (renderer), `mdxComponents` (element registry) |
| `transitions/` | Route-level transitions. | `PageTransition` |

**Rule of thumb:** a `ui/` primitive knows nothing about the portfolio; a
`portfolio/` component knows about a specific `src/data` shape; `common/` sits
in between (reusable but app-styled).

## Server vs client convention

The project is **server-first**. A component is a React Server Component unless
its file begins with `"use client"`. Keep the client boundary as low in the tree
as possible.

**Default to a server component.** Add `"use client"` only when the component
needs one of:

- React state/effects or event handlers (`useState`, `useEffect`, `onClick`, …)
- Browser APIs (`window`, `matchMedia`, `localStorage`)
- Framer Motion `m.*`, GSAP, Three.js, or any hook from `src/hooks/`
- A store subscription (`useUIStore`) or a radix-ui interactive primitive

Currently client (`"use client"`): all interactive `ui/` primitives (`dialog`,
`sheet`, `tabs`, `accordion`, `command`, `dropdown-menu`, `tooltip`, `sonner`,
`label`, `separator`), `layout/header`, `layout/mobile-menu`,
`layout/theme-toggle`, every `motion/*`, `three/scene-canvas`,
`transitions/page-transition`, `forms/*`, `shared/copy-button`,
`sections/hero-scene`, and the interactive `portfolio/*` cards
(`project-card`, `featured-project-card`, `project-filter`, `certificate-card`,
`gallery-item`, `timeline-rail`).

Everything else — pages, layouts, `Hero`, `PageHero`, `Section`, `Container`,
`MDXContent`, most `portfolio/*` cards, `lib/*` — is a server component.

**Server/client patterns used here:**

- **Lazy client islands.** `HeroScene` and `SceneCanvas` use
  `next/dynamic(..., { ssr: false })` so `three`/@react-three/fiber never enter
  the landing first-load bundle. GSAP loads the same way on `/timeline` only.
- **Server data, client render.** `/github` fetches on the server with ISR
  (`getGitHubUser` / `getGitHubRepos` in `@/lib/github`, 1h revalidate) and
  passes plain data into presentational cards — no client data-fetching library.
- **Server Actions.** The contact form (client) calls the `submitContact`
  server action via `useActionState`.

## Key components and props

### Layout

**`PageShell`** (server) — skip link, `Header`, the `<main id="main-content">`
landmark, and `Footer`. Wraps every `(site)` route via `(site)/layout.tsx`.
Props: `{ children }`.

**`Container`** (server) — centered max-width gutter wrapper. **`Section`**
(server) — vertical rhythm wrapper applying `py-[var(--spacing-section)]`. Props:
`{ id?, className?, children }`. **`SectionHeader`** — eyebrow/title/description
block for in-page sections.

### Sections

**`PageHero`** (server) — the standard page header.

```ts
interface PageHeroProps {
  eyebrow?: string;
  title: string;              // required
  description?: string;
  align?: "left" | "center";  // default "left"
  actions?: ReactNode;        // e.g. CTA buttons
  children?: ReactNode;
}
```

**`Hero`** (server) — the landing hero. Renders the LCP `<h1>` **visibly and
ungated** (never hidden behind a JS entrance) and composes `HeroScene`. No props.

**`HeroScene`** (client) — the framed WebGL window. Dynamically imports the
`SignalField` scene (`ssr:false`), scales point count down on small screens, and
is `aria-hidden` (decorative). **`CTASection`** — the shared end-of-page call to
action.

### Motion

**`Reveal`** (client) — fade-in-up on viewport entry; renders children instantly
(unwrapped) under reduced motion.

```ts
interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;   // seconds, default 0
  once?: boolean;   // default true
  amount?: number;  // 0..1 visibility threshold, default 0.3
}
```

**`Magnetic`** (client) — pointer-follow wrapper for CTAs. **`ScrollProgress`**
(client) — the top reading-progress bar.

### Three

**`SceneCanvas`** (client) — the single entry point for all WebGL. Mounts the R3F
canvas only when motion is allowed **and** WebGL is feature-detected; otherwise
renders `poster`. Pauses rendering when scrolled out of view.

```ts
interface SceneCanvasProps {
  children?: ReactNode;   // the scene (e.g. <SignalField />)
  className?: string;
  poster?: ReactNode;     // static fallback (reduced motion / no WebGL)
}
```

### Transitions

**`PageTransition`** (client) — keyed on `pathname`; **transform-only** (`y: 8 →
0`, no opacity gate) so content is always painted, never delays LCP, never adds
CLS, and stays visible with JS off. Fully bypassed under reduced motion.

### Forms

**`ContactForm`** (client) — React Hook Form + `zodResolver(contactSchema)` for
client validation, wired to the `submitContact` server action through
`useActionState`. Includes a honeypot (`company`) and a captured `startedAt` for
the server's fill-time anti-spam check. **`FormField`** / **`FormMessage`** are
the accessible field/error primitives.

### MDX

**`MDXContent`** (server) — `{ code }`: evaluates a Velite-compiled MDX body
string against the **`mdxComponents`** registry (the registry maps `h1…h6`, `a`,
`pre`/`code`, lists, etc. to themed components — `a` routes internal links
through `next/link` and external through `shared/ExternalLink`).

### UI primitives

`ui/button` is the canonical shadcn pattern: `class-variance-authority` variants
(`default | destructive | outline | secondary | ghost | link`) and sizes
(`default | xs | sm | lg | icon | icon-xs | icon-sm | icon-lg`), plus `asChild`
(radix `Slot`) to render as a `<Link>`. Other `ui/*` primitives follow the same
shadcn conventions and are styled by the design tokens in `src/styles`.

## Providers and motion gating

`AppProviders` (in `(site)`'s root layout) composes **Theme > Motion > Tooltip >
Lenis** plus a global Toaster. The Motion provider is
`LazyMotion(domAnimation, strict)` + `MotionConfig(reducedMotion: "user")`, which
is what makes the lightweight `m.*` API work — use `m.div`, never `motion.div`
(strict mode blocks it).

Reduced motion is resolved by **`useReducedMotion()`**, which combines the OS
`prefers-reduced-motion` media query with the in-app toggle persisted in
`useUIStore` (`motionPreference: "system" | "reduced" | "full"`). Every motion
component must honor it — either bail to a static render (like `Reveal` /
`PageTransition`) or pass through to the poster (like `SceneCanvas`).

## Adding a new component

1. **Pick the folder** by role from the taxonomy table. A new shadcn primitive →
   `ui/` (prefer the shadcn CLI). A data-bound card → `portfolio/`. A reusable
   atom → `common/`.
2. **Decide the boundary.** Start as a server component. Add `"use client"` only
   if it needs state, effects, browser APIs, motion, or a store.
3. **Name and export.** Kebab-case file (`my-thing.tsx`), named export
   (`export function MyThing(...)`). One primary component per file.
4. **Type the props** with an exported `interface`/`type` when the component is
   reusable.
5. **Style with tokens + `cn`.** Use Tailwind utilities backed by the design
   tokens; merge incoming `className` via `cn()` from `@/lib/utils`. Accept a
   `className?` prop on layout-ish components.
6. **Gate motion.** Any animation must respect `useReducedMotion()` and use
   `m.*` (not `motion.*`).
7. **Keep heavy deps lazy.** Anything pulling Three.js or GSAP goes behind
   `next/dynamic(..., { ssr: false })`, mirroring `HeroScene` / `SceneCanvas`.
8. **A11y.** Real landmarks/roles, focus-visible states, `aria-hidden` for purely
   decorative visuals. Target WCAG 2.2 AA.
9. **Verify.** `pnpm typecheck && pnpm lint && pnpm format:check` (or `pnpm
   check`).

## Adding a new page

1. **Create the route:** `src/app/(site)/<route>/page.tsx`. It inherits the
   shared shell (header/footer/scroll progress/transition) automatically from
   `(site)/layout.tsx` — no need to re-add chrome.
2. **Export metadata** with the SEO helper:

   ```ts
   import type { Metadata } from "next";
   import { buildMetadata } from "@/lib/metadata";
   import { ROUTES } from "@/constants/routes";

   export const metadata: Metadata = buildMetadata({
     title: "My Page",
     description: "…",
     path: ROUTES.myPage,
   });
   ```

   Add the route string to `src/constants/routes.ts` and, if it should appear in
   the nav, to `src/config/navigation.ts`.
3. **Compose, don't reinvent.** Build the page from `PageHero` →
   `Section`/`Container` → `SectionHeader` → `portfolio/*` cards, ending with
   `CTASection`. Wrap entrance animations in `Reveal`.
4. **Source content correctly.** Structured content comes from a `src/data/*`
   accessor; blog content from `@/lib/content`. Keep the page a server component
   and fetch/read data there.
5. **Dynamic routes** (`[slug]`) also add an `opengraph-image.tsx` (use the
   shared renderer in `@/lib/og`) and should implement `generateStaticParams` +
   `generateMetadata` where applicable, matching `projects/[slug]` and
   `blog/[slug]`.
6. **Register for discovery.** Static routes and content slugs are emitted by
   `src/app/sitemap.ts` — extend it if the new route isn't covered.

# Dependency Plan

> Purpose: the authoritative, categorized inventory of every runtime and tooling dependency for Joshua Setiawan's portfolio — for each one its purpose, why it was selected over alternatives, where in the codebase it is used, its performance cost and how that cost is contained — plus an explicit "Dependencies to AVOID" list so no contributor reintroduces weight the LOCKED decisions already rejected.

Related: [Performance Strategy](./performance-strategy.md) · [Three.js Strategy](./three-strategy.md) · [Animation Strategy](./animation-strategy.md) · [Design Tokens](./design-tokens.md) · [Design System](./design-system.md) · [Component Inventory](./component-inventory.md) · [SEO Strategy](./seo-strategy.md) · [Accessibility Strategy](./accessibility-strategy.md) · [Information Architecture](./information-architecture.md) · [Responsive Strategy](./responsive-strategy.md)

---

## 0. How to read this document

Every dependency is a **liability with a justification**, not a convenience. A package earns its place only when it solves a problem we cannot solve cheaply ourselves *and* respects the per-route bundle budgets in [performance-strategy](./performance-strategy.md#per-route-first-load-budgets). Three rules govern this list:

- **Zero `three` / `gsap` / `framer-motion` in any first-load chunk.** These three libraries are real, but they are *opt-in per route/interaction* via dynamic import. Their presence in this plan never implies presence in a shared baseline chunk.
- **Live data is the only justification for TanStack Query.** It is scoped to the GitHub Dashboard and Open Source repo data, not adopted as a general fetching layer.
- **Assumption:** — labels a version, sub-dependency, or usage choice that LOCKED did not pin explicitly; it is a professional default, binding until revisited.

Categories below follow the mandated stack verbatim: Core framework, Styling, UI system, Animation, 3D, State management, Data fetching, Forms and validation, Content/MDX, Icons, Theme, Developer experience, SEO/utilities. Each entry uses a fixed field block so entries stay comparable.

### Entry field legend

| Field | Meaning |
|---|---|
| **Purpose** | The single job this package does for us. |
| **Why selected** | The decision rationale, tied to a LOCKED constraint where one exists. |
| **Where used** | The folders/routes/features (per the target structure) that import it. |
| **Performance** | Its weight and the exact mechanism that keeps that weight off the wrong chunk. |
| **Alternative** | What we would otherwise use, and why we did not — omitted when there is no credible alternative. |

---

## 1. Dependency map at a glance

| Category | Packages | First-load-safe? | Budget owner |
|---|---|---|---|
| Core framework | `next`, `react`, `react-dom`, `typescript` | Yes (baseline) | Shared ≤95KB gz |
| Styling | `tailwindcss@4`, `@tailwindcss/postcss`, `clsx`, `tailwind-merge`, `class-variance-authority`, `tailwindcss-animate` (Assumption) | Yes (CSS + tiny JS) | CSS ≤25KB gz |
| UI system | `shadcn/ui` (vendored), `@radix-ui/*`, `cmdk`, `sonner`, `vaul` (Assumption) | Per-component | Per-route |
| Animation | `framer-motion`, `gsap`, `lenis` | **No — opt-in** | Per-route, dynamic |
| 3D | `three`, `@react-three/fiber`, `@react-three/drei`, `three-stdlib`, `tunnel-rat` | **No — `ssr:false` only** | ≤200KB gz routes |
| State management | `zustand` | Yes (tiny) | Shared baseline |
| Data fetching | `@tanstack/react-query`, `@octokit/request` (Assumption) | **Live-data routes only** | GitHub/OSS routes |
| Forms & validation | `react-hook-form`, `zod`, `@hookform/resolvers` | Contact route only | Light route |
| Content/MDX | `velite`, `@mdx-js/react`, `shiki`, `rehype-*`/`remark-*`, `feed`, `reading-time` (Assumption) | **Build-time mostly** | Detail routes |
| Icons | `lucide-react` | Yes (tree-shaken) | Per-icon |
| Theme | `next-themes` | Yes (tiny) | Shared baseline |
| Developer experience | `eslint`, `prettier`, `husky`, `lint-staged`, `@commitlint/*`, `size-limit`, `@next/bundle-analyzer`, `vitest`/`jest`, `jest-axe`, `@axe-core/playwright`, `@playwright/test` | Dev-only (zero runtime) | n/a |
| SEO/utilities | `schema-dts`, `sharp`, `web-vitals`, `@t3-oss/env-nextjs`, `@vercel/analytics`, `resend`, `react-email`/`@react-email/components` (Assumption) | Mixed | Per-surface |

---

## 2. Core framework

### `next` (Next.js, latest stable App Router)
- **Purpose:** The application framework — App Router routing, RSC/SSG/ISR, route handlers, image optimization, metadata API, build pipeline.
- **Why selected:** Mandated. The entire architecture (RSC-first content, ISR for the GitHub Dashboard, build-time OG images, `metadataBase`/sitemap/robots/manifest) depends on App Router primitives. See [seo-strategy](./seo-strategy.md) and [performance-strategy](./performance-strategy.md).
- **Where used:** `src/app/**` (all 18 routes + utility routes), `next.config.ts`, route handlers for `rss.xml`/sitemap.
- **Performance:** RSC keeps primary content out of the client bundle entirely; `next/font`, `next/image`, and automatic per-route code-splitting are the backbone of the budget. **Assumption:** React Compiler stays off for v1 (stability) and is revisited once stable.
- **Alternative:** Astro (better default zero-JS, weaker for the interactive React islands and live dashboard we need) or Remix/React Router (no equal SSG/ISR + RSC story for this content mix). Rejected.

### `react` + `react-dom`
- **Purpose:** The rendering library underpinning RSC and client islands.
- **Why selected:** Required by Next.js; non-negotiable.
- **Where used:** Everywhere, but the majority of components are **Server** Components and ship no client runtime.
- **Performance:** The lever is *how much* runs on the client. Client components are minimized to interactive islands (`features/*`, `components/motion`, palette, theme toggle) per [component-inventory](./component-inventory.md).

### `typescript` (strict, `exactOptionalPropertyTypes` OFF)
- **Purpose:** Static types across the whole codebase.
- **Why selected:** Mandated strict mode. Catches content-shape and prop errors at build, not runtime. `exactOptionalPropertyTypes` is deliberately OFF to avoid friction with optional MDX frontmatter and third-party prop types.
- **Where used:** All `.ts`/`.tsx`; `src/types` holds domain types; Velite generates types consumed by `lib` accessors.
- **Performance:** Compile-time only; zero runtime cost.

---

## 3. Styling

### `tailwindcss` v4 (CSS-first `@theme`, no `tailwind.config.js`)
- **Purpose:** Utility-first styling engine and the home of all design tokens.
- **Why selected:** Mandated v4. The CSS-first `@theme` block is the single source of truth for the canonical token values in [design-tokens](./design-tokens.md); no JS config file exists by design.
- **Where used:** `src/styles/globals.css` (`@theme`, base layers), every component's `className`.
- **Performance:** Compiles to atomic CSS; the build-time content scan keeps output to the **≤25KB gz** CSS budget. No runtime CSS-in-JS cost.
- **Alternative:** CSS Modules (loses the token system + utility velocity) or a CSS-in-JS lib like styled-components/emotion (runtime cost, conflicts with RSC). Rejected.

### `@tailwindcss/postcss`
- **Purpose:** The PostCSS plugin that runs Tailwind v4 in the Next build.
- **Why selected:** v4's official integration path with Next.
- **Where used:** `postcss.config.mjs`.
- **Performance:** Build-time only.

### `clsx`
- **Purpose:** Conditional `className` composition.
- **Why selected:** ~0.5KB, the standard primitive for joining class strings.
- **Where used:** Throughout `components/**`; wrapped by the `cn()` helper in `src/lib/utils.ts`.
- **Performance:** Negligible.

### `tailwind-merge`
- **Purpose:** De-conflict overlapping Tailwind utilities so later props win deterministically.
- **Why selected:** Lets variant-driven components accept overriding `className` without specificity bugs.
- **Where used:** Inside `cn()` alongside `clsx`.
- **Performance:** Small (~a few KB); runs client-side only where `cn()` executes in client components. **Assumption:** kept out of hot render loops by memoizing variant class strings where measurable.

### `class-variance-authority` (CVA)
- **Purpose:** Type-safe component variants (size/intent/state) for shadcn primitives.
- **Why selected:** Mandated. Pairs with `clsx`+`tailwind-merge` to give Button/Badge/Card their variant APIs in [component-inventory](./component-inventory.md).
- **Where used:** `components/ui/*` variant definitions.
- **Performance:** Tiny; variant maps are static.

### `tailwindcss-animate` — **Assumption**
- **Purpose:** Keyframe utilities for Radix enter/exit states (accordion, dropdown, palette).
- **Why selected:** Standard shadcn companion; covers small CSS-only transitions so we don't load Framer for trivial UI motion.
- **Where used:** Radix-backed `components/ui/*`.
- **Performance:** Pure CSS; obeys reduced-motion via the global gate in [animation-strategy](./animation-strategy.md).
- **Alternative:** Hand-written keyframes in `globals.css` (viable; this just saves boilerplate).

---

## 4. UI system

### `shadcn/ui` (vendored components, not a runtime dependency)
- **Purpose:** Accessible, unstyled-then-themed component source we copy into `components/ui` and own.
- **Why selected:** Mandated. Code lives in our repo, so it is tree-shaken like our own code and themed directly from the tokens — no opaque component library in `node_modules`.
- **Where used:** `components/ui/*` (Button, Card, Dialog, Sheet, Tabs, Tooltip, Badge, Input, etc.).
- **Performance:** Only the primitives we install ship; nothing global. Each is a client component **only if** it needs interactivity.

### `@radix-ui/react-*` (primitives behind shadcn)
- **Purpose:** Accessible behavior for overlays, menus, tabs, tooltip, dialog/sheet — focus trap, `inert`, return-to-trigger, keyboard nav.
- **Why selected:** Directly satisfies the WCAG 2.2 overlay requirements in [accessibility-strategy](./accessibility-strategy.md) (focus management, ARIA wiring) without us re-implementing them.
- **Where used:** Nav mega-menu, command palette host, modals, tooltips, mobile sheet.
- **Performance:** Per-component packages, imported only where used; **never** a barrel import of all of Radix. Client-only.
- **Alternative:** Headless UI (smaller surface, weaker menu/focus ergonomics) or hand-rolled (a11y risk). Rejected.

### `cmdk`
- **Purpose:** The Cmd+K command palette (fuzzy search over the 16 destinations + actions).
- **Why selected:** Mandated. Purpose-built, accessible combobox/command primitive that matches the navigation model in [navigation-structure](./navigation-structure.md).
- **Where used:** `features/command-palette/*`, triggered from the primary nav.
- **Performance:** Loaded **on demand** — dynamically imported on first palette open (or key listener), never in the shared header chunk.

### `sonner`
- **Purpose:** Toast notifications (contact success/failure, copy-to-clipboard confirmations).
- **Why selected:** Mandated. Lightweight, accessible, animates cheaply; pairs with the contact Server Action result.
- **Where used:** `providers` (Toaster mount) + `features/contact`.
- **Performance:** Small; the Toaster is a thin client component, toasts are CSS-driven and respect reduced-motion.

### `vaul` — **Assumption**
- **Purpose:** Drawer/bottom-sheet behavior on mobile (nav, filters).
- **Why selected:** shadcn's drawer is built on it; gives a native-feeling mobile sheet that satisfies the ≥24px target and focus rules.
- **Where used:** `components/ui/drawer`, mobile nav in [responsive-strategy](./responsive-strategy.md).
- **Performance:** Small, client-only, mobile-route-scoped.
- **Alternative:** Radix Dialog styled as a sheet (works; vaul adds the drag affordance). Optional — drop if budget pressures the mobile route.

---

## 5. Animation

> **Hard rule:** none of the three packages below may appear in any first-load chunk. They are imported dynamically per route/interaction. See [performance-strategy](./performance-strategy.md#animation) and [animation-strategy](./animation-strategy.md).

### `framer-motion` (imported via `LazyMotion` + `m.*`)
- **Purpose:** State/lifecycle motion — enter/exit, `layout`/`layoutId`, gestures, the page-transition curtain.
- **Why selected:** Mandated and best-in-class for React lifecycle animation. **LazyMotion + `m`** is the load-bearing choice: we import the `m` component (feather-light) and feed features (`domAnimation`) lazily, instead of the full `motion` API.
- **Where used:** `components/motion/*`, `animations/` (Framer variant factories), page transitions in `app` providers, gesture-driven cards in `features/*`.
- **Performance:** Full `motion` import is ~34KB+ gz; `LazyMotion` with `domAnimation` cuts the initial surface dramatically and code-splits the rest. The provider that supplies features is itself dynamically loaded. **Never** `import { motion } from "framer-motion"`.
- **Alternative:** CSS transitions + Web Animations API (used for trivial cases via `tailwindcss-animate`); Framer is reserved for shared-layout and orchestration CSS cannot do.

### `gsap` (+ ScrollTrigger)
- **Purpose:** Scroll progress, pinning, scrub, multi-step timelines, horizontal scroll.
- **Why selected:** Mandated; the only library with robust pin/scrub/timeline ergonomics. Owns the scroll-driven half of the [motion division of labor](./animation-strategy.md#motion-division-of-labor).
- **Where used:** `animations/` (GSAP timeline factories), scroll-heavy sections in `features/*` and `page-specifications` (pinned project showcase, horizontal galleries).
- **Performance:** Loaded only on routes with scroll choreography, dynamically, after first paint. ScrollTrigger registers once. All GSAP runs inside `gsap.matchMedia` so reduced-motion yields static layouts (no pin/scrub). **Single rAF:** `gsap.ticker` drives `lenis.raf`; no competing loops.
- **Alternative:** ScrollTimeline / `animation-timeline` CSS (promising but uneven support for pin/scrub today). Revisit post-v1.

### `lenis`
- **Purpose:** Smooth scroll and the **single** authoritative scroll value the whole app reads.
- **Why selected:** Mandated as the sole scroll authority. It animates nothing itself; it provides the normalized scroll position that GSAP and R3F consume.
- **Where used:** `providers/SmoothScroll`, read by GSAP (`lenis.on('scroll', ScrollTrigger.update)`) and the R3F scroll store.
- **Performance:** Small. **Not instantiated at all** under reduced-motion/saveData → native scroll, which is also the faster path. No scroll-jacking.
- **Alternative:** `@studio-freight/react-lenis` wrapper or raw scroll — we use core Lenis directly for one-rAF control.

---

## 6. 3D

> **Hard rule:** all of the below load only via `dynamic(..., { ssr:false })` behind a single persistent `<Canvas>`; zero `three` in any first-load chunk; a static AVIF poster is always the LCP. See [three-strategy](./three-strategy.md).

### `three`
- **Purpose:** The WebGL engine for the Hero "Signal Field", project-cover hover shader, About aurora mesh, and the optional GitHub constellation.
- **Why selected:** Mandated; the industry-standard WebGL library.
- **Where used:** `src/three/**` scenes and materials only.
- **Performance:** Large (~150KB+ gz). Contained by: `ssr:false` dynamic import, `frameloop="demand"`, DPR clamp `[1,1.75]`, IntersectionObserver pause, capability-tier gating to a poster, and full disposal on unmount. **Assumption:** we import from `three` submodules where it meaningfully reduces graph size and never pull the examples barrel.

### `@react-three/fiber`
- **Purpose:** React renderer for Three — declarative scene graph, lifecycle, hooks.
- **Why selected:** Mandated; lets scenes be components and integrates disposal/Suspense with React.
- **Where used:** `three/Canvas` host + all scenes.
- **Performance:** Thin over `three`; same dynamic-import containment.

### `@react-three/drei`
- **Purpose:** Helpers — `PerformanceMonitor` (downgrade tiers), instancing helpers, loaders, controls.
- **Why selected:** Mandated; `PerformanceMonitor` is the concrete mechanism for the LOCKED auto-downgrade.
- **Where used:** Inside scenes in `src/three`.
- **Performance:** **Cherry-pick imports only** (`@react-three/drei/core/...` style) — never the index barrel, which is huge. Each helper pulled individually.
- **Alternative:** Hand-rolled helpers (more code, same weight if careful). Drei's value is the tuned `PerformanceMonitor`.

### `three-stdlib`
- **Purpose:** Stable, tree-shakeable home for `three/examples` modules drei may need (loaders, post stubs).
- **Why selected:** Avoids fragile deep imports into `three/examples/jsm`.
- **Where used:** Transitively via drei; direct use only if a loader is unavoidable.
- **Performance:** Tree-shaken; only the touched modules ship.

### `tunnel-rat`
- **Purpose:** Portal arbitrary route-level R3F content **into** the single persistent `<Canvas>` without remounting it.
- **Why selected:** Mandated single-canvas + tunnel-rat model. Lets per-route scenes render into one shared context.
- **Where used:** `three/tunnel` + each route's scene island.
- **Performance:** Tiny; it is the enabler of the single-context guarantee that *saves* GPU/memory.

> **Deferred:** `@react-three/postprocessing` is explicitly **out of scope for v1** (LOCKED). Glow comes from emissive materials + sprites, avoiding a full post-processing pass and its render-target cost. Revisit only if a v2 effect demands it.

---

## 7. State management

### `zustand`
- **Purpose:** Tiny global stores — the motion/reduced-motion slice (`<html data-motion>`), the shared scroll/pointer store R3F reads, palette open-state, theme-adjacent UI state.
- **Why selected:** Mandated. Outside-React subscriptions (selectors) avoid the re-render storms a Context would cause for high-frequency scroll/pointer values.
- **Where used:** `src/stores` (or `hooks` wrappers), read by `three`, `animations`, providers, nav.
- **Performance:** ~1KB; selector subscriptions mean only components reading a changed slice re-render. Critical for keeping scroll/pointer updates off the React commit path.
- **Alternative:** React Context (re-renders all consumers on every change — wrong for 60fps values) or Redux (overkill). Rejected.

---

## 8. Data fetching

> **Scope guard:** TanStack Query exists for **live data only** — the GitHub Dashboard and Open Source repo data. First paint comes from server fetch + ISR; React Query handles client refresh/interaction on those routes. It is **not** a general data layer; static content uses RSC + Velite directly.

### `@tanstack/react-query`
- **Purpose:** Client cache, background refetch, and refresh UX for live GitHub data (profile stats, contribution calendar, top repos, language breakdown) and OSS repo cards.
- **Why selected:** Mandated and scoped. Server components fetch with ISR (`revalidate ~3600s`) for instant first paint; React Query hydrates from that and powers manual refresh/interactive filters without refetch waterfalls.
- **Where used:** `features/github-dashboard/*`, `features/open-source/*`, a `providers/Query` mounted **only** within those route subtrees (not app-global).
- **Performance:** ~12–13KB gz, isolated to two routes within the ≤200KB GitHub-route budget. `dehydrate`/`HydrationBoundary` seed the cache from the server fetch so the client makes no redundant initial request.
- **Alternative:** SWR (lighter, but weaker mutation/invalidation and devtools); plain RSC + `revalidate` (used for everything else, but lacks the client refresh/interaction UX the dashboard wants). Both rejected for these two routes specifically.

### `@octokit/request` (or thin `fetch` wrapper) — **Assumption**
- **Purpose:** Typed, minimal GitHub REST/GraphQL calls in the **server** fetch layer.
- **Why selected:** A focused request helper beats hand-rolled URL/string building and handles auth headers + rate-limit headers cleanly with `GITHUB_TOKEN`.
- **Where used:** `src/lib/github/*` (server-only), consumed by the dashboard's RSC fetch and route revalidation.
- **Performance:** Server-only — **zero** client bytes. We use `@octokit/request` (small), not the full `@octokit/rest` SDK. **Alternative:** native `fetch` with typed wrappers (perfectly viable; Octokit just standardizes pagination + rate-limit parsing).

---

## 9. Forms and validation

### `react-hook-form`
- **Purpose:** The contact form — uncontrolled inputs, validation wiring, submit state.
- **Why selected:** Mandated. Uncontrolled model minimizes re-renders; integrates with the a11y requirements (aria-invalid, aria-describedby, focus-to-error-summary) in [accessibility-strategy](./accessibility-strategy.md).
- **Where used:** `features/contact/*` only.
- **Performance:** Small and **scoped to one light route**; not in the shared baseline.

### `zod`
- **Purpose:** The single shared validation schema for the contact form — used by both the client (RHF resolver) and the Server Action.
- **Why selected:** Mandated "one shared Zod schema" decision; also powers `@t3-oss/env-nextjs` typed env. One schema, two consumers, no drift.
- **Where used:** `src/lib/validations/contact.ts` (shared), `src/lib/env.ts`.
- **Performance:** Modest; the contact schema ships on the contact route, the env schema runs server/build-time.
- **Alternative:** Valibot (smaller bundle, compelling) — **Assumption:** we stay on Zod for ecosystem maturity, `schema-dts`/RHF familiarity, and the env tool's first-class support; revisit if the contact route bundle is pressured.

### `@hookform/resolvers`
- **Purpose:** Bridges the Zod schema into React Hook Form.
- **Why selected:** Standard, lets the same Zod schema validate client-side.
- **Where used:** `features/contact`.
- **Performance:** Tiny; contact route only.

---

## 10. Content / MDX

> Mandated decision: content is authored in MDX and compiled by **Velite** (NOT Contentlayer). Most cost here is **build-time**; rendered output is RSC HTML.

### `velite`
- **Purpose:** Compile and **type** the MDX collections (projects, blog, research) + validate frontmatter against schemas; emit typed data consumed by `lib` accessors.
- **Why selected:** Mandated over Contentlayer (which is effectively unmaintained and brittle on latest Next). Velite uses Zod schemas, is actively maintained, and outputs plain typed JSON/ESM we import without a runtime.
- **Where used:** `velite.config.ts`, `src/content/**` sources, `src/lib/content/*` accessors, every content route.
- **Performance:** Runs at build. The site ships compiled HTML/JSON, **not** an MDX runtime. Keeps detail routes within their ≤175KB budget.
- **Alternative:** Contentlayer (rejected — maintenance), `next-mdx-remote` (runtime compile cost, rejected for static content), raw `@next/mdx` (loses typed frontmatter + collections). Rejected.

### `@mdx-js/react` — **Assumption**
- **Purpose:** Provide the MDX component registry (`mdx-components`) mapping custom components into prose.
- **Why selected:** Lets MDX use our themed `components/ui` (callouts, code blocks, images) per `src/mdx`.
- **Where used:** `src/mdx/*`, content route renderers.
- **Performance:** Only the mapped components ship, on the routes that render that content.

### `shiki`
- **Purpose:** Build-time syntax highlighting with the LOCKED dual-theme semantic palette (keyword `#5E8BFF`, function `#38E8C8`, etc.).
- **Why selected:** Mandated dual-theme Shiki. Highlighting happens at build, producing static, theme-aware HTML — no client highlighter.
- **Where used:** Velite/rehype pipeline; output rendered in blog/research/project bodies.
- **Performance:** **Build-time only** — zero client JS for highlighting. Grammars/themes loaded during build, not shipped. **Assumption:** language grammars are restricted to those actually used to keep build memory/time bounded.
- **Alternative:** Prism/`rehype-prism` (lighter grammars but weaker theming); `highlight.js` runtime (client cost). Rejected.

### `rehype-*` / `remark-*` plugins (e.g. `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`) — **Assumption**
- **Purpose:** GFM tables, heading slugs/anchors, and the `toc` generation declared in the content model.
- **Why selected:** Standard, composable MDX transforms; satisfy the `toc` + anchor-link requirements of detail pages.
- **Where used:** Velite pipeline config.
- **Performance:** Build-time only.

### `feed`
- **Purpose:** Generate the single `rss.xml` for the blog.
- **Why selected:** Mandated (`feed` for RSS). Generates valid RSS/Atom from the typed blog collection.
- **Where used:** `app/rss.xml/route.ts`, reading Velite blog data.
- **Performance:** Runs in a route handler at build/revalidate; not in any client bundle.

### `reading-time` — **Assumption**
- **Purpose:** Compute the `readingTime` field on blog posts.
- **Why selected:** Tiny, deterministic; runs inside the Velite transform so the value is static frontmatter.
- **Where used:** `velite.config.ts` transform.
- **Performance:** Build-time only.

---

## 11. Icons

### `lucide-react`
- **Purpose:** The icon set across nav, UI, social links, metadata badges.
- **Why selected:** Mandated. Consistent stroke style matching the "precise/technical" brand feel; each icon is an individual ES module.
- **Where used:** `components/**`, nav, footer, feature islands.
- **Performance:** **Per-icon tree-shaking** — `import { ArrowUpRight } from "lucide-react"` ships only that icon. **Assumption:** we lint against any namespace/`* as Icons` import that would defeat tree-shaking.
- **Alternative:** `@radix-ui/react-icons` (smaller set, less coverage); inline SVG sprites (more manual). Lucide chosen for coverage + consistency.

---

## 12. Theme

### `next-themes`
- **Purpose:** Light/dark theming with **dark as default**, no flash, system-preference aware.
- **Why selected:** Mandated. Writes the theme class before paint (no FOUC), drives the dual token sets in [design-tokens](./design-tokens.md).
- **Where used:** `providers/Theme`, the header theme toggle, every token consumer (all CSS).
- **Performance:** Tiny; an inline pre-hydration script sets the class, so there is no flash and no layout shift (protects the CLS ≤0.02 budget).
- **Alternative:** Hand-rolled theme script (works but re-implements the no-flash handling next-themes already nails). Rejected.

---

## 13. Developer experience (dev-only — zero runtime weight)

| Package | Purpose | Why selected |
|---|---|---|
| `eslint` + `eslint-config-next` (flat: `next/core-web-vitals` + `jsx-a11y`) | Lint correctness, web-vitals rules, a11y rules | Mandated flat config; `jsx-a11y` enforces the a11y baseline at lint time |
| `prettier` + `prettier-plugin-tailwindcss` | Formatting + canonical Tailwind class ordering | Mandated; deterministic class order aids diff/review |
| `husky` | Git hooks runner | Mandated; wires pre-commit/commit-msg |
| `lint-staged` | Run lint/format on staged files only | Mandated; keeps commits fast |
| `@commitlint/cli` + `@commitlint/config-conventional` | Enforce Conventional Commits | Mandated; enables clean history/changelogs |
| `@next/bundle-analyzer` | Per-route bundle inspection + budget assertion | Enforces the per-route budgets + the "zero three/gsap/framer in first-load" chunk-content assertion |
| `size-limit` (+ `@size-limit/preset-app`) | Hard byte ceilings per entry, in CI | The gate that fails a build crossing a JS budget |
| `vitest` **or** `jest` + `@testing-library/react` — **Assumption: Vitest** | Unit/component tests | Faster, ESM-native; pairs with Velite/TS |
| `jest-axe` (or `vitest-axe`) | Component-level a11y assertions | Mandated a11y enforcement |
| `@playwright/test` + `@axe-core/playwright` | E2E + axe across dark/light/reduced-motion/forced-colors | Mandated a11y matrix testing |
| `@lhci/cli` (Lighthouse CI) | Throttled-mobile CWV/a11y/SEO gates | Enforces the Lighthouse score floors |

- **Performance:** All of the above are `devDependencies`; **none** ship to the client. They exist to *protect* the runtime budgets, not add to them.

---

## 14. SEO / utilities

### `schema-dts`
- **Purpose:** Typed JSON-LD (Person, WebSite, ProfilePage, CreativeWork/SoftwareSourceCode, BlogPosting, ScholarlyArticle, BreadcrumbList).
- **Why selected:** Mandated. Types the structured data so the schemas in [seo-strategy](./seo-strategy.md) can't drift from spec.
- **Where used:** `src/lib/seo/jsonld.ts`, injected per route as RSC `<script type="application/ld+json">`.
- **Performance:** Types are compile-time; emitted JSON is tiny static text in the server-rendered HTML.

### `sharp`
- **Purpose:** Build-time image processing — AVIF/WebP generation, blur placeholders (`blurDataURL`), OG image rendering.
- **Why selected:** Mandated. Powers `next/image` optimization and the gallery's `blurDataURL` pipeline; produces the ≤120KB AVIF LCP images.
- **Where used:** Build pipeline, `next/image`, OG image generation, gallery data prep in `scripts/`.
- **Performance:** Build/server-side only; reduces *delivered* image weight (a net performance win), zero client cost.

### `web-vitals`
- **Purpose:** Field RUM — capture real p75 LCP/INP/CLS with attribution.
- **Why selected:** Mandated. The "field is the truth" half of the performance contract; complements Lighthouse CI's lab gate.
- **Where used:** A tiny client reporter in `providers` (or `app`), posting to Vercel Analytics / an endpoint.
- **Performance:** ~2KB, loaded after interactive; uses `attribution` build only where needed.

### `@t3-oss/env-nextjs`
- **Purpose:** Typed, validated environment variables (e.g. `GITHUB_TOKEN`, `RESEND_API_KEY`, `VERCEL_ENV`).
- **Why selected:** Mandated. Fails the build on missing/invalid env and enforces the server/client boundary (no secret leaks to the client bundle).
- **Where used:** `src/lib/env.ts`, imported by server fetchers, email, and the SEO non-prod noindex guard.
- **Performance:** Build/server-time validation; client schema only exposes `NEXT_PUBLIC_*`.

### `@vercel/analytics` (+ Speed Insights)
- **Purpose:** Cookieless, privacy-respecting analytics + Speed Insights.
- **Why selected:** Mandated (Vercel cookieless analytics). No consent banner needed; aligns with `/privacy`.
- **Where used:** `providers`/`app` mount.
- **Performance:** Lightweight, deferred script; cookieless avoids consent-management weight.

### `resend` (+ `react-email`/`@react-email/components` — **Assumption**)
- **Purpose:** Send the contact email from the Server Action; optionally template it with React Email.
- **Why selected:** Mandated email provider (Resend). Server-side send keeps keys off the client; the shared Zod schema validates the payload first.
- **Where used:** `src/lib/email/*` (server-only), invoked by the contact Server Action.
- **Performance:** **Server-only — zero client bytes.** `react-email` renders to HTML at send time, never shipped to the browser. **Alternative:** plain HTML string templates (drop `react-email` if unused).

---

## 15. Dependencies to AVOID

> These are explicitly rejected. CI (bundle-analyzer chunk assertions + `size-limit` + an import-lint rule) should make reintroducing them visible. Each has a sanctioned replacement already in this plan.

| Avoid | Why it's harmful here | Use instead |
|---|---|---|
| `moment` | ~70KB, mutable, not tree-shakeable; we only format ISO dates from frontmatter | Native `Intl.DateTimeFormat` / `Date`; `date-fns` (modular) only if real date math appears |
| `axios` | ~13KB for what `fetch` does natively in Node/RSC + browser; duplicates capability | Native `fetch` (server + client); `@octokit/request` for GitHub |
| `lodash` (full) | Huge barrel; defeats tree-shaking when imported as `import _ from 'lodash'` | Native ES (`map`/`filter`/`Object.*`); `lodash-es/<fn>` per-function only if truly needed |
| `contentlayer` | Explicitly rejected by LOCKED — effectively unmaintained, breaks on latest Next | **Velite** (§10) |
| `framer-motion` full import (`import { motion }`) | Ships the entire feature set into first-load; violates the zero-framer-in-baseline rule | `LazyMotion` + `m` with lazy `domAnimation` (§5) |
| `@react-three/drei` index barrel (`import { X } from '@react-three/drei'` for many helpers) | Pulls a very large surface; balloons 3D-route bundles | Cherry-picked deep imports per helper (§6) |
| `@react-three/postprocessing` | Deferred by LOCKED for v1; adds render-target passes and weight | Emissive materials + sprites for glow (§6) |
| Heavy carousel libs (`swiper`, `slick-carousel`, `react-slick`, `embla` if avoidable) | Large, jQuery-era DOM weight or extra deps; we already own GSAP horizontal scroll + Framer + native scroll-snap | GSAP horizontal-scroll timeline / CSS scroll-snap with accessible Prev/Next (per [accessibility-strategy](./accessibility-strategy.md) 2.5.7) |
| `styled-components` / `emotion` / runtime CSS-in-JS | Runtime cost, RSC-incompatible, duplicates Tailwind | Tailwind v4 `@theme` (§3) |
| `react-icons` (multi-pack) | Encourages mixed icon sets + poor tree-shaking across packs | `lucide-react` per-icon (§11) |
| `gsap` Club/`ScrollSmoother` for smoothing | Duplicates Lenis; would create a second scroll authority + competing rAF | **Lenis** as sole scroll authority (§5) |
| `next-mdx-remote` | Runtime MDX compilation cost for content that is fully static | **Velite** build-time compile (§10) |
| `redux` / `@reduxjs/toolkit` / `recoil` / `jotai` (as global store) | Overkill for our small global state; Context-style re-renders hurt 60fps scroll values | **Zustand** selectors (§7) |
| `chart.js` / `recharts` / `nivo` (if heavy) for the GitHub charts | Large; the dashboard needs only a contribution heatmap + a few bars/breakdowns | Lightweight SVG drawn from the chart tokens (chart-1…6, heat ramp) — **Assumption:** add a small lib like `visx` primitives *only* if hand-rolled SVG proves insufficient |
| `dayjs` plugins sprawl / `luxon` | Unneeded weight for ISO formatting | `Intl` (as above) |
| `react-query` (legacy v3 name) | Outdated; wrong package | `@tanstack/react-query` v5 (§8) |
| Polyfill packs (`core-js` broad) | We target evergreen browsers; Next handles needed transforms | Next default browserslist; no manual broad polyfills |

---

## 16. Cross-references

- Per-route byte budgets and the CI gates that enforce them: [performance-strategy](./performance-strategy.md).
- The single-canvas, `ssr:false`, poster-LCP rules constraining the 3D stack: [three-strategy](./three-strategy.md).
- The motion division of labor (Framer vs GSAP vs Lenis vs R3F) and reduced-motion gate: [animation-strategy](./animation-strategy.md).
- Canonical token values consumed by Tailwind v4 `@theme`: [design-tokens](./design-tokens.md).
- Which components are Server vs Client (and therefore which deps ship): [component-inventory](./component-inventory.md).
- Structured data, sitemap/robots/manifest, and the non-prod noindex guard: [seo-strategy](./seo-strategy.md).
- WCAG 2.2 obligations that justify Radix, RHF wiring, and carousel Prev/Next: [accessibility-strategy](./accessibility-strategy.md).

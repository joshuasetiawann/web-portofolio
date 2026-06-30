# Technical Architecture

> Purpose: the authoritative engineering blueprint for Joshua Setiawan's portfolio — App Router structure and route groups, the server/client component boundary, every data-fetching path (RSC + Velite + GitHub API ISR + React Query islands), content and MDX strategy, state/form/theme strategy, the animation and Three.js architecture and their library boundaries, error/loading handling, typed environment variables, the testing pyramid, and the Vercel deployment + ISR + preview-noindex model.

Related: [Information Architecture](./information-architecture.md) · [Folder Structure](./folder-structure.md) · [Performance Strategy](./performance-strategy.md) · [Three.js Strategy](./three-strategy.md) · [Animation Strategy](./animation-strategy.md) · [SEO Strategy](./seo-strategy.md) · [Component Inventory](./component-inventory.md) · [Page Specifications](./page-specifications.md) · [Responsive Strategy](./responsive-strategy.md) · [Design Tokens](./design-tokens.md) · [Phase 1 Foundation](./PHASE-1-FOUNDATION.md)

---

## 0. How to read this document

Three terms are used precisely:

- **RSC** — a React Server Component: runs only at build/request time, ships **zero** client JS, and is the default for every file under `src/app` and `src/components` unless it carries `"use client"`.
- **Island** — a `"use client"` subtree mounted inside an RSC page for interactivity (palette, forms, charts, canvas portals). Islands are the *only* place heavy client libraries (`three`, `gsap`, `framer-motion`, `@tanstack/react-query`) may appear, and they are loaded per-route, never in the shared baseline.
- **Assumption:** — a professional default chosen here because LOCKED did not specify it; binding until revisited.

Every decision traces back to LOCKED and to the rendering table in [information-architecture §3](./information-architecture.md). This document never invents a route, budget, or token; it operationalizes them.

---

## 1. Architectural principles

| # | Principle | Consequence |
|---|---|---|
| 1 | **Server-first by default.** | Pages, layouts, and content rendering are RSC/SSG. Client code is opt-in, isolated to islands, and budgeted. |
| 2 | **Content is data, never markup-in-components.** | All prose lives in Velite MDX/typed data; pages *read* a typed accessor, never inline content. One content change = one file, no redeploy of component logic. |
| 3 | **One source of truth per concern.** | Routes/nav → `config`; tokens → CSS `@theme`; validation → one shared Zod schema; SEO → `lib/seo`; content → Velite/`data`. No value is authored twice. |
| 4 | **Heavy libs are route-local.** | `three`/`gsap`/`framer-motion`/`react-query` are forbidden in any first-load chunk (see [performance-strategy §1](./performance-strategy.md)); they enter only via `dynamic(..., { ssr: false })` islands. |
| 5 | **One scroll authority, one rAF.** | Lenis owns scroll; `gsap.ticker` drives Lenis; Lenis drives `ScrollTrigger.update`; R3F reads from a shared store. No competing loops. |
| 6 | **One WebGL context for the whole app.** | A single persistent `<Canvas>` is portaled into via tunnel-rat; routes never mount their own canvas. |
| 7 | **Fail soft, never blank.** | Live data falls back to ISR snapshot → degraded empty state; WebGL/low-end/reduced-motion → static poster; JS-off renders complete content. |
| 8 | **Types are the contract.** | `tsc` (strict, `exactOptionalPropertyTypes` OFF), typed env, `schema-dts` JSON-LD, and Zod make bad shapes fail the build, not production. |

---

## 2. App Router structure & route groups

The app uses **non-URL-affecting route groups** to organize 18 routes + utility routes by rendering posture and shared chrome. Route groups (`(group)`) do **not** change URLs — `app/(marketing)/about/page.tsx` still resolves to `/about`, so the resolved paths in [information-architecture §3](./information-architecture.md) remain exact. **Assumption:** the grouping below is an organizational layer LOCKED did not mandate; it is chosen to share layouts and isolate the two live routes.

| Route group | Owns | Rendering posture | Shared chrome |
|---|---|---|---|
| `(marketing)` | `/`, `/about`, `/philosophy`, `/contact`, `/privacy` | SSG (contact = SSG shell + Server Action) | Header + Footer + persistent Canvas mount point |
| `(content)` | `/projects`, `/projects/[slug]`, `/research`, `/research/[slug]`, `/blog`, `/blog/[slug]` | SSG + `generateStaticParams`; MDX via Velite | Header + Footer + prose container |
| `(showcase)` | `/experience`, `/timeline`, `/gallery`, `/certificates`, `/achievements` | SSG from typed `data` | Header + Footer |
| `(live)` | `/open-source`, `/github` | SSR + ISR (`revalidate ≈ 3600`) + React Query islands | Header + Footer + QueryClient provider boundary |

```
src/app/
├── layout.tsx                 # root RSC: <html>, fonts, metadataBase, JSON-LD (Person+WebSite),
│                              #   Providers tree, persistent <Canvas> host, skip-link, #main-content
├── page.tsx                   # 1  Landing  (/)            — SSG
├── loading.tsx                # global route skeleton
├── not-found.tsx              # 17 404                      — noindex
├── error.tsx                  # root error boundary (client)
├── global-error.tsx           # last-resort boundary for the root layout
├── manifest.ts • robots.ts • sitemap.ts        # machine routes
├── opengraph-image.tsx        # build-time root OG image
├── (marketing)/
│   ├── about/page.tsx                          # 2  + opengraph-image, ProfilePage JSON-LD
│   ├── philosophy/page.tsx                     # 3  MDX singleton
│   ├── contact/page.tsx                        # 16 SSG shell; imports actions.ts
│   ├── contact/actions.ts          ("use server") contact Server Action
│   └── privacy/page.tsx                        # utility
├── (content)/
│   ├── projects/page.tsx                       # 4  index (filter/sort island)
│   ├── projects/[slug]/page.tsx                # 5  + generateStaticParams + opengraph-image.tsx
│   ├── research/page.tsx • research/[slug]/page.tsx   # 6
│   ├── blog/page.tsx • blog/[slug]/page.tsx          # 8/9 + loading.tsx skeletons
│   └── blog/rss.xml/route.ts                   # RSS feed route handler
├── (showcase)/
│   ├── experience/page.tsx • timeline/page.tsx       # 10/11
│   ├── gallery/page.tsx • certificates/page.tsx      # 12/13
│   └── achievements/page.tsx                         # 14
└── (live)/
    ├── open-source/page.tsx                    # 7  SSR+ISR, curated × live repo data
    ├── github/page.tsx                         # 15 SSR+ISR + React Query refresh island
    ├── github/loading.tsx                      # dashboard skeleton (no CLS)
    └── (live)/error.tsx                        # segment boundary → ISR/degraded fallback
```

Conventions: exactly one `<h1>` per route (the hero display type); each segment may add `loading.tsx` (skeleton) and `error.tsx` (boundary). Per-route `generateMetadata` and co-located `opengraph-image.tsx` live with the page (see [seo-strategy](./seo-strategy.md)). Full tree for `src/` outside `app` is in [folder-structure](./folder-structure.md).

---

## 3. Server vs. client component boundary

The default is **RSC**. A component earns `"use client"` only for: state/effects, browser APIs, event handlers, context that needs hydration, or a heavy interactive lib. The boundary is pushed **as deep as possible** — pages stay RSC and pass already-resolved, serializable data into small client leaves.

| Concern | Component kind | Notes |
|---|---|---|
| Pages, layouts, content rendering (MDX, prose, lists, cards) | **RSC** | Read Velite/`data` accessors at build; ship HTML only. |
| Header shell, footer, section layout | **RSC** | Static markup; interactive bits (theme toggle, palette trigger, mega-menu) are nested client leaves. |
| Theme toggle, Cmd+K palette, mega-menu, mobile nav | **Client island** | Small; depend on `next-themes`, `cmdk`, Zustand UI slice. |
| Project/blog filter & sort | **Client island** | Operates on RSC-provided, fully-serialized list; URL-state via `nuqs`/searchParams. **Assumption:** filter state mirrors to the URL for shareable/canonical-clean views. |
| Contact form | **Client island** | RHF + Zod resolver; submits to Server Action. |
| GitHub dashboard charts + refresh | **Client island** | React Query reads server-hydrated initial data; Recharts/visx render. |
| Persistent `<Canvas>` + all scenes | **Client island** | `dynamic(ssr:false)`; portaled via tunnel-rat. |
| Motion wrappers (reveal, magnetic, page curtain) | **Client island** | Framer `m.*` under `LazyMotion`; content is visible without them. |

**RSC↔Client handoff rules:** server components pass **serializable props only** (no functions, no class instances); shared types live in `src/types`; a client island never imports a server-only module (`lib/email`, `lib/github` server fetchers, `env.server`). Server-only modules carry `import "server-only"`; client-only entry points carry `import "client-only"`.

---

## 4. Data-fetching architecture

Four lanes, each with a single owner. Nothing fetches the same thing twice.

| Lane | Source | Where it runs | Caching | Routes |
|---|---|---|---|---|
| **Static content** | Velite MDX → typed objects | Build (RSC) | Baked into the bundle; rebuild on content change | projects, blog, research, philosophy |
| **Typed static data** | TS modules in `src/data` | Build (RSC) | Compiled in | experience, timeline, gallery, certificates, achievements |
| **Live GitHub (server)** | GitHub REST + GraphQL via `lib/github` | Server fetch with `next: { revalidate: 3600 }` | **ISR ~3600s** | `/github`, `/open-source` |
| **Live GitHub (client refresh)** | Same accessors via a route handler / server action | Client island | TanStack Query (`staleTime` 5m, refetch on demand) | `/github` interaction only |

**Live-data flow (the one justification for TanStack Query):**

1. The `(live)` page is an **RSC** that calls `lib/github` server fetchers with `revalidate: 3600`. This produces the **first paint** from the ISR cache — fully server-rendered, indexable, zero client JS required.
2. That server result is passed as `initialData`/`HydrationBoundary` dehydrated state into a **client island** holding `<QueryClientProvider>`.
3. On user action (refresh button, tab focus), React Query refetches via a thin route handler that re-calls the same `lib/github` accessors. No duplicate fetch logic.
4. **Failure posture:** server fetch fails → last ISR snapshot renders; no snapshot → degraded empty state (see [information-architecture §10](./information-architecture.md) and [ux-flow](./ux-flow.md)). The page never hard-fails.

`QueryClient` is created **per request on the server** (never a module singleton) and **once on the client**, to avoid cross-request state bleed. TanStack Query is **scoped strictly to `(live)`**; no other route mounts a provider — keeping it out of every other first-load chunk.

---

## 5. Content & MDX strategy (Velite pipeline)

Content is compiled by **Velite** (NOT Contentlayer) at build/dev into typed, validated objects, consumed through `lib/content` accessors and the `#site/content` alias.

**Pipeline:** `src/content/*.mdx` + assets → `velite.config.ts` (Zod-validated collections) → `.velite/` output (`index.js` + typed `index.d.ts`, copied/optimized images, blur placeholders) → imported via `#site/content` → wrapped by typed accessors in `src/lib/content` (e.g. `getAllProjects()`, `getProjectBySlug()`, `getSortedPosts()`, sibling/prev-next, tag indexes).

| Collection | Schema highlights (per LOCKED content model) | Page consumer |
|---|---|---|
| `projects` | slug,title,summary,role,year,status,kind,tags,stack,featured,order,cover(Image),gallery,links,metrics,color?,body,toc,seo | `/projects`, `/projects/[slug]` |
| `blog` | slug,title,description,date,updated?,tags,draft,readingTime,cover?,toc,body,seo | `/blog`, `/blog/[slug]` |
| `research` | slug,title,abstract,date,authors,venue?,status,tags,links,body,seo | `/research`, `/research/[slug]` |
| `philosophy` | MDX singleton or structured principle sections | `/philosophy` |

**MDX rendering:** compiled to a function body at build and rendered in **RSC** with a curated component registry in `src/mdx` (headings with anchors, `Image` wrapper, callouts, `<Figure>`, code blocks). **Code highlighting = Shiki dual-theme** at build time (semantic colors per LOCKED; see [design-tokens](./design-tokens.md)), so **zero** client highlighter JS ships. `remark-gfm` + a TOC/reading-time pipeline run in Velite. `draft: true` and (for research) non-published items are excluded from production builds and from `sitemap.ts`/`rss.xml`. Image fields resolve to optimized assets with `blurDataURL` baked in for zero-CLS loading.

---

## 6. State management (Zustand scope)

Zustand holds **only ephemeral, cross-component UI state that has no URL home and no server source.** Server data → RSC/React Query; form state → RHF; theme → next-themes; route/filter state → URL. Everything else is local `useState`.

| Store slice | Holds | Consumers |
|---|---|---|
| `motion` | resolved reduced-motion state + explicit pause toggle → mirrored to `<html data-motion>` | Framer/GSAP/Lenis/R3F gates (single source per LOCKED) |
| `ui` | command-palette open, mega-menu open, mobile-nav open, header collapsed/monogram | Header islands, palette |
| `scroll` | shared scroll progress + normalized pointer (written by Lenis/rAF) | R3F scenes read this; never animates DOM |
| `canvas` | active scene id, capability tier (scene vs poster), canvas-ready flag | tunnel-rat portals, scene mounting |

Stores live in `src/store` (or `src/lib/store`), are created with `create<T>()`, use selector subscriptions to avoid over-render, and are **never** persisted except the motion preference (localStorage, hydration-safe). No store is imported by an RSC.

---

## 7. Forms — RHF + Zod + Server Action

The contact form is the only form. It uses **one shared Zod schema** (`lib/validations/contact.ts`) on both client and server.

| Layer | Responsibility |
|---|---|
| Schema (`contactSchema`) | Single Zod object: name, email, message, optional company, honeypot, consent. Exported type `ContactInput`. |
| Client island | React Hook Form + `zodResolver(contactSchema)`; inline `aria-invalid`/`aria-describedby`, error summary focused on submit, polite live region, 24px+ targets (see [responsive-strategy](./responsive-strategy.md) + a11y in LOCKED). |
| Server Action (`actions.ts`, `"use server"`) | Re-validates with the **same** `contactSchema` (never trust the client), checks honeypot, rate-limits, sends via `lib/email` (Resend), returns a typed `{ ok, fieldErrors? }` result. |
| Feedback | `sonner` toast + persistent inline success; progressive enhancement means the form posts even with JS disabled. |

Validation runs **twice with one schema** — client for UX, server for trust. `/contact` is an SSG shell; only the action is dynamic.

---

## 8. Theme strategy (next-themes)

- `next-themes` with `attribute="class"` (or `data-theme`), `defaultTheme="dark"`, `enableSystem`, `disableTransitionOnChange`. **Dark is default** per LOCKED.
- A `<ThemeProvider>` wraps the app in `providers`; the toggle is a small client leaf. A blocking inline script (next-themes' own) sets the class **before paint** to prevent FOUC.
- Tokens are CSS custom properties: dark on `:root`, light overrides under `.light`/`[data-theme="light"]` (see [design-tokens](./design-tokens.md)). The theme switch flips a class only — **no JS recolor**.
- `color-scheme` and `<meta name="theme-color">` track the active theme; the persistent `<Canvas>` and Shiki dual-theme code blocks read the same theme signal.

---

## 9. Animation architecture (library boundaries)

Division of labor is fixed (per LOCKED motion section); see [animation-strategy](./animation-strategy.md) for full specs.

| Library | Owns | Must NOT |
|---|---|---|
| **Framer Motion** (`LazyMotion` + `m.*`, `domAnimation` feature pack) | State/lifecycle: enter/exit, `layout`/`layoutId`, gestures, page-transition curtain | Drive scroll progress |
| **GSAP + ScrollTrigger** | Scroll progress, pin, scrub, multi-step timelines, horizontal scroll — inside `gsap.matchMedia` | Run its own scroll listener |
| **Lenis** | Smooth scroll + the single scroll value | Animate anything |
| **R3F** | WebGL only; reads scroll/pointer from the `scroll` store | Touch the DOM |

**The single rAF:** `gsap.ticker` drives `lenis.raf`; `lenis.on("scroll", ScrollTrigger.update)`; `gsap.ticker.lagSmoothing(0)`. Implemented once in a `SmoothScroll` provider. Variants live in `src/animations` as Framer variant objects + GSAP timeline factory functions (pure, reusable, lint-able). All three libs are dynamically imported in islands — **zero in first-load chunks**. The reduced-motion master gate (`data-motion`) sets Framer `reducedMotion="user"`, forces GSAP into static `matchMedia` branches, and **does not instantiate Lenis** (native scroll).

---

## 10. Three.js architecture (single canvas + portal)

Per [three-strategy](./three-strategy.md) and LOCKED:

- **One persistent `<Canvas>`**, mounted once in the root layout via a client island that is `dynamic(() => ..., { ssr: false })`. `frameloop="demand"`, DPR clamp `[1, 1.75]`, `<PerformanceMonitor>` downgrade, `IntersectionObserver` pause, dispose-on-unmount.
- **tunnel-rat portal:** routes that need a scene render a `<Tunnel.In>` with their scene; the persistent canvas renders `<Tunnel.Out>`. No route mounts its own canvas; scenes mount/unmount as their trigger element enters/leaves the viewport.
- **Capability tier resolves before mount:** device-tier + no-WebGL + reduced-motion → **static poster** (the poster IS the LCP element). The canvas fades in only after paint and only on the scene tier.
- Scenes (`Signal Field` hero, project-cover hover shader, About aurora mesh, optional GitHub constellation) live in `src/three`. Glow via emissive materials + sprites — `@react-three/postprocessing` is **deferred for v1**. `three` never appears in any first-load chunk and never ships on routes without a scene.

---

## 11. Error boundaries & loading states

| Level | File | Behavior |
|---|---|---|
| Root layout | `app/global-error.tsx` | Last-resort full-page boundary if the root layout itself throws. |
| Per-segment | `app/.../error.tsx` (client) | Catches render errors in that segment; offers reset; `(live)/error.tsx` shows the ISR/degraded fallback, not a crash. |
| Not found | `app/not-found.tsx` | Branded 404, `noindex`, links back into the IA. |
| Data fallback | In `lib/github` accessors | try/catch → cached snapshot → typed empty state; never throws to the user. |
| Global loading | `app/loading.tsx` | Route-level skeleton matching final layout dimensions (no CLS). |
| Per-segment loading | `app/.../loading.tsx` | Skeletons for blog list, project grid, GitHub dashboard — reserve exact space, respect CLS ≤ 0.02 budget. |

Suspense is used for streaming below-the-fold/live sections; skeletons reserve final dimensions so the LCP and CLS budgets in [performance-strategy](./performance-strategy.md) hold.

---

## 12. Environment variables (typed via `@t3-oss/env-nextjs`)

All env access goes through `src/env.ts` (`createEnv`), which validates with Zod at build/start — a missing or malformed key **fails the build**, never production. Server keys are unreadable from client code; client keys must be `NEXT_PUBLIC_*`. `import "server-only"` guards the server object.

| Key | Scope | Required | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | client | yes | `metadataBase`, canonicals, OG URLs, sitemap/RSS absolute links. |
| `GITHUB_TOKEN` | server | yes (live routes) | Authenticated GitHub REST/GraphQL for `/github` + `/open-source`. |
| `GITHUB_USERNAME` | server | yes | GitHub login to query. **Assumption:** stored as env to avoid hard-coding. |
| `RESEND_API_KEY` | server | yes | Contact email send via Resend. |
| `CONTACT_TO_EMAIL` | server | yes | Inbox that receives contact submissions. **Assumption:** `thunityai@gmail.com` placeholder until a domain inbox exists. |
| `RESEND_FROM_EMAIL` | server | yes | Verified `from` sender for Resend. |
| `VERCEL_ENV` | server | provided by Vercel | `production`/`preview`/`development` → drives the non-prod `noindex` guard. |
| `NEXT_PUBLIC_VERCEL_ENV` | client | provided by Vercel | Client-side env awareness (analytics/debug). |
| `ALLOW_AI_CRAWLERS` | server | optional | Feature flag for the AI-crawler `robots` policy (LOCKED: allowed via config flag). |
| `NODE_ENV` | shared | auto | Standard build/runtime mode. |

Vercel **cookieless Analytics** and **web-vitals** RUM are injected via their packages and need no secret. `.env.example` documents every key; `.env.local` is git-ignored.

---

## 13. Testing strategy

A pyramid that maps to the LOCKED quality gates; CI blocks merge on any failure.

| Layer | Tooling | Covers |
|---|---|---|
| **Unit / component** | **Vitest** + React Testing Library | Pure utils (`lib`, `utils`), content accessors, Zod schema, component rendering. |
| **Accessibility (unit)** | **jest-axe** (via Vitest) | Per-component a11y assertions on key UI (forms, nav, cards). |
| **Accessibility (e2e)** | **axe-playwright** | Full pages across **light / dark / reduced-motion / forced-colors** (LOCKED a11y matrix). |
| **E2E / flows** | **Playwright** | Nav + mega-menu + palette, contact submit (mocked Resend), theme toggle, route transitions, keyboard/skip-link. |
| **Contrast** | token-contrast script | Asserts every token pair meets WCAG 2.2 AA vs painted background (glow excluded). |
| **Performance** | **Lighthouse CI** (throttled mobile) | Perf ≥90, A11y ≥95 (100 target on content), BP ≥95, SEO ≥95; CWV budgets. |
| **Bundle** | **size-limit** + `@next/bundle-analyzer` + chunk-content assertion | Per-route first-load ceilings; **assert zero `three`/`gsap`/`framer-motion` in any first-load chunk**. |
| **Static** | `tsc --noEmit`, ESLint flat (next/core-web-vitals + jsx-a11y), `raw-HTML` SSR assertion | Type/lint/RSC-content guarantees. |

CI runs static → unit/axe → build → bundle gates → LHCI → Playwright/axe-playwright. Lint/format are also enforced pre-commit via Husky + lint-staged + Commitlint (conventional commits).

---

## 14. Deployment strategy (Vercel)

| Aspect | Decision |
|---|---|
| Host / package mgr | **Vercel**; **pnpm via Corepack** on **Node 26** (Node 22 LTS fallback) per LOCKED. |
| Rendering mix | SSG for all content/showcase routes; **SSR + ISR (`revalidate ≈ 3600`)** for `/github` + `/open-source`; SSG shell + Server Action for `/contact`. |
| Preview safety | Every non-production deploy (`VERCEL_ENV !== "production"`) is **globally `noindex`** via the SEO guard + `robots.ts` (see [seo-strategy](./seo-strategy.md)). |
| ISR & revalidation | Time-based `revalidate` on live routes; **Assumption:** an optional on-demand `revalidateTag`/`revalidatePath` webhook can refresh GitHub data on demand. |
| Secrets | Server env in Vercel Project Settings (prod + preview); `GITHUB_TOKEN`/`RESEND_*` never exposed to client. Typed `env.ts` validates them at build. |
| Observability | Vercel cookieless Analytics + `web-vitals` field RUM (attribution) report against CWV budgets. |
| Branch model | PR previews per branch (noindexed); merge to `main` → production. CI gates (§13) block promotion on regression. |
| Caching headers | Static assets immutable-hashed; images via `next/image` + sharp (AVIF, ≤120KB LCP). Fonts self-hosted via `next/font`, ≤2 preloaded. |

---

## 15. Cross-reference map

| Need the detail on… | Go to |
|---|---|
| Exact routes, rendering table, content model | [information-architecture](./information-architecture.md) |
| `src/` tree, folder purposes, import aliases | [folder-structure](./folder-structure.md) |
| Budgets, code-splitting, CI gates (numbers) | [performance-strategy](./performance-strategy.md) |
| Canvas tiers, scenes, poster fallback | [three-strategy](./three-strategy.md) |
| Motion specs, rAF wiring, reduced-motion gate | [animation-strategy](./animation-strategy.md) |
| Metadata, JSON-LD, OG, robots/sitemap/RSS | [seo-strategy](./seo-strategy.md) |
| Components per route | [component-inventory](./component-inventory.md) · [page-specifications](./page-specifications.md) |
| Token values | [design-tokens](./design-tokens.md) |

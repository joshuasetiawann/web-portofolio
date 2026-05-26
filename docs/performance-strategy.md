# Performance Strategy

> Purpose: the authoritative, enforceable performance contract for Joshua Setiawan's portfolio — Core Web Vitals goals, per-route bundle budgets, code-splitting and dynamic-import rules, image/font/Three.js/animation optimization, hydration and server-vs-client component strategy, MDX and TanStack Query/GitHub-API caching, re-render avoidance, and the exact CI gates that block a regression from merging.

Related: [Design Tokens](./design-tokens.md) · [Design System](./design-system.md) · [Animation Strategy](./animation-strategy.md) · [Responsive Strategy](./responsive-strategy.md) · [Component Inventory](./component-inventory.md) · [Page Specifications](./page-specifications.md) · [Information Architecture](./information-architecture.md) · [Typography System](./typography-system.md) · [Creative Direction](./creative-direction.md)

---

## 0. How to read this document

Performance here is a **budget that is spent, not a hope that is held**. Every number below is a hard line a build can cross only by failing CI. The document is organized so each subsystem (JS, images, fonts, WebGL, motion, data) owns a measurable budget and a named gate that enforces it.

Three terms are used precisely:

- **Budget** — a numeric ceiling (KB gzip, ms, score). Crossing it fails a gate.
- **Gate** — an automated check, named explicitly (e.g. `size-limit`, `lhci`), that runs in CI and blocks merge on violation.
- **Assumption:** — a professional default chosen here because LOCKED did not specify it; safe to revisit, but treated as binding until then.

All values trace back to the LOCKED **Performance Budget**, **Accessibility**, and **SEO** sections, and to the motion/Three.js rules in [animation-strategy](./animation-strategy.md) and the device tiers in [responsive-strategy](./responsive-strategy.md). Nothing here invents a budget LOCKED did not state; it only operationalizes them.

---

## 1. Performance philosophy & principles

| # | Principle | Consequence |
|---|---|---|
| 1 | **Content is never gated behind JS.** | Every primary content route is RSC/SSG and renders meaningful HTML with zero client JS executed. Motion and 3D are progressive enhancements layered on top. |
| 2 | **The LCP element is always cheap.** | The hero LCP is text (display type) or a static poster image — **never** the Three.js canvas, never a lazy chunk. |
| 3 | **Heavy libraries are opt-in per route.** | `three`, `gsap`, and `framer-motion` are **forbidden in every first-load chunk** and load only on routes/interactions that use them. |
| 4 | **Budgets are spent, not discovered.** | Each route has a first-load JS ceiling; adding a feature means staying under it or removing weight elsewhere. CI enforces, not code review. |
| 5 | **Measure on the painted device, not the dev machine.** | Lighthouse CI runs throttled mobile (Moto-G-class); field RUM (web-vitals) measures real p75. The lab is a gate; the field is the truth. |
| 6 | **One scroll authority, one rAF.** | Lenis drives GSAP via a single `gsap.ticker` loop; no component runs its own scroll listener or competing rAF. (See [animation-strategy](./animation-strategy.md#motion-division-of-labor).) |
| 7 | **Reduced motion is a performance mode.** | `prefers-reduced-motion` / saveData / in-app toggle drop Lenis, scrub, pin, and the WebGL frameloop — improving CWV for the users who opt in. |
| 8 | **Regression is a build failure, not a follow-up ticket.** | Every budget below maps to a CI gate in §17. A red gate blocks merge. |

---

## 2. Core Web Vitals goals (LOCKED)

Field targets measured at **p75, mobile**, via `web-vitals` attribution RUM and confirmed in lab by Lighthouse CI throttled mobile.

| Metric | Target (p75 mobile) | What it measures | Primary levers in this codebase |
|---|---|---|---|
| **LCP** | **≤ 2.5 s** | Largest contentful paint | SSG HTML + preloaded display font + static hero poster (`≤120KB` AVIF) as LCP; no blocking JS for first paint |
| **INP** | **≤ 200 ms** | Interaction to next paint | RSC-first (less hydration), `LazyMotion` for Framer, debounced/`startTransition` handlers, no long tasks on input |
| **CLS** | **≤ 0.02** | Cumulative layout shift | Explicit `width`/`height` + `aspect-ratio` on all media, `next/font` (no FOIT/FOUT swap shift), reserved skeleton dimensions, no late-injected banners |

Secondary lab/diagnostic metrics tracked (not user-facing budgets, but watched in CI trends):

| Metric | Target | Notes |
|---|---|---|
| **FCP** | ≤ 1.8 s | First contentful paint, throttled mobile |
| **TBT** | ≤ 200 ms | Lab proxy for INP; total blocking time |
| **TTFB** | ≤ 0.8 s | Vercel edge/SSG; ISR served from cache |
| **Speed Index** | ≤ 3.4 s | Lighthouse |

**Assumption:** desktop CWV are held to the same or tighter numbers; mobile is the binding constraint, so desktop is not separately gated.

---

## 3. Bundle-size budgets (LOCKED)

The shared baseline and per-route ceilings are quoted verbatim from LOCKED and enforced by `size-limit` + `@next/bundle-analyzer` route assertions (§17).

### 3.1 Shared & global budgets

| Budget | Ceiling (gzip) | Gate |
|---|---|---|
| Shared baseline JS (framework + shared chunks on every route) | **≤ 95 KB** | `size-limit` |
| CSS (total, all routes) | **≤ 25 KB** | `size-limit` (CSS preset) |
| Preloaded fonts (count / weight) | **≤ 2 files / ≤ 45 KB** | font-preload assertion script |
| LCP image | **≤ 120 KB** AVIF | `scripts/check-lcp-image.mjs` |

### 3.2 Per-route first-load JS budgets

First-load JS = shared baseline + that route's own client chunks, gzipped, as reported by the Next.js build manifest.

| Tier | Routes | First-load JS ceiling (gzip) |
|---|---|---|
| **Light** | Landing `/`, About `/about`, Contact `/contact`, Philosophy `/philosophy`, Uses *(if added)* | **≤ 160 KB** |
| **Content** | Projects `/projects`, Blog `/blog`, Research `/research`, all detail routes (`/projects/[slug]`, `/blog/[slug]`, `/research/[slug]`) | **≤ 175 KB** |
| **Heavy** | GitHub Dashboard `/github`, any 3D-heavy route | **≤ 200 KB** |

> Routes not listed explicitly (Open Source, Experience, Timeline, Gallery, Certificates, Achievements) default to the **Content (≤175 KB)** tier unless they ship no client islands, in which case they are held to **Light (≤160 KB)**. **Assumption:** Gallery, because of lightbox + masonry interactivity, is budgeted as Content.

### 3.3 The hard exclusion rule

> **ZERO `three`, `gsap`, or `framer-motion` (full) bytes may appear in any first-load chunk of any route.**

This is enforced by a dedicated **chunk-content assertion** (§17, `scripts/assert-no-heavy-in-firstload.mjs`) that greps the per-route first-load chunk list for `three`, `gsap`, `scrolltrigger`, and `framer-motion` module ids and fails the build if found. These libraries are reachable only through `next/dynamic` boundaries or `LazyMotion` feature bundles (§9, §10).

---

## 4. Code-splitting strategy

Splitting is layered so the shared baseline stays under 95 KB and heavy work is isolated behind boundaries.

| Layer | Mechanism | Rule |
|---|---|---|
| **Route split** | App Router automatic per-segment chunks | Each route segment is its own entry; never import a sibling route's island. |
| **Component split** | `next/dynamic` | Anything pulling `three`/`gsap`/`framer` (full), the command palette, charts, MDX-heavy embeds, and below-the-fold islands. |
| **Vendor split** | Next.js `optimizePackageImports` + manual `modularizeImports` where needed | `lucide-react`, `@radix-ui/*`, `date-fns`-style utilities tree-shake to per-icon/per-primitive imports. |
| **Interaction split** | Dynamic import inside an event handler | Palette (`cmdk`), share sheets, and any rarely-used modal load their chunk on first open, not on mount. |

### 4.1 What stays in the shared baseline (the 95 KB)

- React + React DOM + Next runtime (framework chunk).
- `next-themes` (tiny, needs to run pre-paint to avoid theme flash).
- The theme/no-flash inline script.
- Shared UI primitives that appear on ≥3 routes and are cheap: button, link, container, visually-hidden, skip-link.
- `clsx` + `tailwind-merge` + `class-variance-authority` (small, shared by every component).

### 4.2 What must NOT be in the shared baseline

`three`, `@react-three/*`, `drei`, `gsap`, `ScrollTrigger`, `lenis`, `framer-motion` (full bundle), `@tanstack/react-query` devtools, `cmdk`, chart libs, MDX runtime for bodies, `sonner`. Each is dynamically imported at its point of use.

### 4.3 `optimizePackageImports` allowlist

```
lucide-react, @radix-ui/react-*, sonner, cmdk, date-fns
```

These are configured for barrel-file optimization so only used exports ship. `lucide-react` in particular is import-per-icon to avoid pulling the full icon set into any route.

---

## 5. Dynamic imports — the canonical registry

Every heavy or conditional module loads through `next/dynamic`. The table is the source of truth; a new heavy feature adds a row.

| Module / island | Loader config | Why |
|---|---|---|
| Persistent `<Canvas>` (Three.js scene) | `dynamic(() => import('@/three/Scene'), { ssr: false, loading: () => <HeroPoster/> })` | WebGL cannot SSR; poster is the LCP and the loading state. |
| Hero "Signal Field" particle system | imported **inside** the Canvas module, behind device-tier + reduced-motion guard | Never loads on low-tier / reduced-motion / no-WebGL. |
| Project-cover hover shader | `dynamic(..., { ssr: false })`, mounted on first hover/intersection | Accent moment, not first paint. |
| GSAP timeline factories | `dynamic` import inside a `useEffect` after mount, gated by `gsap.matchMedia` | GSAP+ScrollTrigger never in first-load (§3.3). |
| Lenis smooth scroll | imported in `SmoothScroll` provider effect; **not instantiated** under reduced motion | Native scroll fallback costs zero JS. |
| Command palette (`cmdk`) | `dynamic(..., { ssr: false })`, imported on first `Cmd+K` / trigger click | Rarely the first interaction. |
| GitHub Dashboard charts | `dynamic(..., { ssr: false, loading: <ChartSkeleton/> })` | Charts are client-only and heavy; route is Heavy tier. |
| MDX body renderer | server-rendered (RSC) by default; interactive MDX components individually `dynamic` | Keeps blog/project bodies in HTML, hydrates only the islands. |
| Toasts (`sonner`) | `dynamic(..., { ssr: false })` mounted once in root provider | Not needed for first paint. |
| Contact form client island | `dynamic` with `loading` skeleton matching field dimensions | Form is below the fold on `/contact`; avoids CLS. |

**Rules for `next/dynamic`:**

1. Anything with `ssr: false` **must** supply a `loading` component whose dimensions match the final element (CLS guard).
2. Prefer `IntersectionObserver`-gated mount for below-the-fold islands over eager `dynamic` so the chunk is fetched only when approaching the viewport.
3. Never `dynamic`-import something that is the LCP.

---

## 6. Lazy loading strategy

| Asset class | Technique | Detail |
|---|---|---|
| **Below-fold images** | `next/image` `loading="lazy"` (default) | Only the LCP/above-fold hero is `priority`. |
| **Above-fold LCP image** | `priority` + `fetchPriority="high"` | Exactly one per route; it is the static hero poster where 3D is used. |
| **Galleries / project covers** | `IntersectionObserver` + `next/image` lazy, blur-up via `blurDataURL` | Gallery data carries `blurDataURL` (LOCKED gallery model). |
| **Heavy islands (3D, charts, palette)** | `dynamic` + intersection/interaction trigger (§5) | Chunk fetch deferred until needed. |
| **Route data (GitHub, OSS)** | server fetch + ISR for first paint; React Query for client refresh | First paint never waits on a client fetch (§14–15). |
| **Embeds / iframes** | `loading="lazy"`, reserved aspect-ratio box | Prevents CLS and main-thread cost. |

**`rootMargin` convention:** **Assumption:** below-fold islands prefetch their chunk at `rootMargin: '200px'` (roughly one viewport ahead) so they are interactive by the time they scroll in, without paying for them up front.

---

## 7. Image optimization

| Rule | Implementation |
|---|---|
| **Format** | AVIF first, WebP fallback, via `next/image` `formats: ['image/avif','image/webp']`. |
| **LCP image weight** | **≤ 120 KB** AVIF (LOCKED). Enforced by `scripts/check-lcp-image.mjs` over `public` + generated OG/poster assets. |
| **Dimensions always declared** | Every `next/image` has explicit `width`/`height` or `fill` + sized parent → CLS ≤ 0.02. |
| **Responsive `sizes`** | Each image declares a `sizes` string matched to the grid in [responsive-strategy](./responsive-strategy.md) so the browser fetches the right candidate. |
| **Blur-up** | `placeholder="blur"` with `blurDataURL`; for content collections, `sharp` generates the blur at build (Velite/`sharp`). |
| **No layout-shifting art direction** | Use `<picture>`-equivalent `sizes`, not JS-swapped sources. |
| **Static processing** | `sharp` (LOCKED) does build-time resize/encode; OG images are build-time generated, never on-request. |
| **Decorative canvas/poster** | The static 3D poster IS the LCP element; it must be a real optimized image, not a CSS gradient that the browser can't time as LCP. |

**Per-route LCP asset:** see [page-specifications](./page-specifications.md) for which element is the LCP on each route. Where it is text (display type), no image budget is spent and the font preload (§8) is the critical resource.

---

## 8. Font optimization

LOCKED typography: Display = **Space Grotesk** (`next/font/google`, variable), Body/UI = **Geist Sans**, Mono = **Geist Mono**.

| Rule | Implementation |
|---|---|
| **Self-hosted via `next/font`** | All three faces loaded with `next/font` → no external request, no FOUT swap shift, automatic `size-adjust` fallback metrics. |
| **Preload ≤ 2 files / ≤ 45 KB** (LOCKED) | Preload **Display + Sans only**. Mono is `preload: false` (lazy) since it is for code/eyebrows below the fold. |
| **`display: 'swap'` with adjusted fallback** | `next/font` injects `size-adjust`/`ascent-override` so the swap is metrically identical → zero CLS. |
| **Subset to `latin`** | English-only site (LOCKED SEO); no extended subsets shipped. |
| **Variable axes only as used** | Space Grotesk variable weight range loaded once; no per-weight static files. |
| **CSS variables** | Exposed as `--font-display`, `--font-sans`, `--font-mono` for the Tailwind v4 `@theme` (see [design-tokens](./design-tokens.md)). |

**Gate:** `scripts/check-font-preload.mjs` asserts exactly ≤2 `<link rel="preload" as="font">` tags in the rendered `<head>` and that their combined byte size ≤ 45 KB.

---

## 9. Three.js / WebGL optimization

The 3D layer is the single largest performance risk and is fenced accordingly. All rules trace to the LOCKED **THREE.JS** section and [animation-strategy](./animation-strategy.md#threejs).

| Rule | Implementation |
|---|---|
| **Single persistent `<Canvas>`** | One `<Canvas>` mounted via `dynamic(ssr:false)`; content portaled in with **tunnel-rat**. No per-route canvases. |
| **`frameloop="demand"`** | The scene renders only on change/interaction, not every rAF — idle = 0 GPU frames. |
| **DPR clamp `[1, 1.75]`** | Caps retina overdraw on high-DPI mobile. |
| **`PerformanceMonitor` downgrade** | Drei `PerformanceMonitor` steps down particle count / DPR when FPS drops. |
| **`IntersectionObserver` pause** | Canvas stops rendering when scrolled out of view. |
| **Dispose on unmount** | Geometries, materials, textures explicitly disposed; no GPU-memory leak on route change. |
| **Tiered fallback → static poster** | `device-tier` low **OR** no-WebGL **OR** reduced-motion **OR** saveData → render the **static poster** (which is the LCP), never load `three`. |
| **Never the LCP** | The canvas is `aria-hidden`, `tabindex=-1`, and never the largest paint; the poster behind/around it is. |
| **Never on routes that don't use it** | The Canvas module is imported only by routes whose [page-spec](./page-specifications.md) lists a 3D moment. The chunk-content gate (§3.3) guarantees no `three` leaks into other routes' first load. |
| **Instanced GPU particles** | Hero "Signal Field" uses instanced geometry + curl-noise vertex shader (work on GPU, not CPU). |
| **Postprocessing deferred** | `@react-three/postprocessing` is DEFERRED for v1 (LOCKED); glow via emissive materials + sprites — no extra render passes. |

**Budget tie-in:** the only route allowed the full 3D weight is a **Heavy (≤200 KB)** route, and even there `three` lives behind the `dynamic` boundary, so first-load stays under budget while the scene streams in after paint.

---

## 10. Animation optimization

Motion is split across Framer / GSAP / Lenis per the LOCKED **MOTION DIVISION OF LABOR**; performance rules per library:

| Library | Optimization rules |
|---|---|
| **Framer Motion** | Use **`LazyMotion` + `m.*`** so only the `domAnimation` feature bundle ships (not the full `motion` package). `reducedMotion="user"`. Animate only `transform` + `opacity` (compositor-only). No layout-animating properties on scroll. |
| **GSAP + ScrollTrigger** | Loaded via `dynamic` after mount; all timelines inside `gsap.matchMedia` so reduced-motion gets static (no pin/scrub). Use `will-change` sparingly and clear it after. ScrollTrigger updates only via the single Lenis→`ScrollTrigger.update` hook. |
| **Lenis** | The **sole** scroll authority; animates nothing itself. **One rAF:** `gsap.ticker` drives `lenis.raf`; `lenis.on('scroll')` → `ScrollTrigger.update()`. Not instantiated at all under reduced motion (native scroll, zero JS cost). |
| **R3F** | Reads scroll/pointer from a shared Zustand store; never adds its own scroll listener. `frameloop="demand"` (§9). |

**Hard rules:**

1. **One rAF for the whole app.** No component may start an independent `requestAnimationFrame` scroll/parallax loop.
2. **Compositor-only properties.** Animate `transform`/`opacity`; never `top/left/width/height/box-shadow` in a continuous animation.
3. **No scroll-jacking** (LOCKED). Lenis smooths native scroll; it does not hijack it.
4. **Reduced motion is the fast path** — see §12.
5. Animation **never gates content**: elements are visible by default and JS-off safe (LOCKED).

Full per-animation specs live in [animation-strategy](./animation-strategy.md); this section governs only their performance envelope.

---

## 11. Server vs Client component strategy

The default is **server**; client is a deliberate, justified exception. This is the single biggest INP/first-load lever.

| Render as **Server Component (RSC)** | Render as **Client Component** (`'use client'`) |
|---|---|
| All page shells, layouts, and content sections | Anything using `useState`/`useEffect`/refs/`useContext` |
| MDX bodies (blog/project/research) | Interactive islands: command palette, theme toggle, forms |
| Static data renders: experience, timeline, certificates, achievements, gallery grid markup | Motion wrappers (Framer `m.*`), GSAP triggers, R3F canvas |
| Initial GitHub/OSS data (server fetch + ISR) | React Query client refresh, charts, live-data interactions |
| SEO/JSON-LD, metadata, OG references | Toaster, tooltips, dropdowns/overlays (Radix) — small leaf islands |

**Rules:**

1. **Push `'use client'` to the leaves.** A client island wraps the smallest interactive subtree; its server parent passes data as props. Never mark a whole page `'use client'`.
2. **Server Components fetch data; client components receive it.** No client-side waterfall for first paint.
3. **Providers are thin client wrappers** (`Theme`, `Query`, `Motion`, `Tooltip`, `SmoothScroll`) mounted once in the root and kept minimal so they don't drag children into the client tree.
4. **Pass serializable props only** across the server→client boundary; keep non-serializable logic server-side.
5. **No `'use client'` on a file solely to use a hook that could be a server util.** Verify the boundary is interaction-driven.

**Hydration strategy:** because content is RSC HTML, hydration cost is proportional to the *number and size of islands*, not page size. The INP budget (§2) is met by minimizing island count, using `LazyMotion`, and deferring non-critical islands behind `dynamic`/intersection (§5–6). No full-page hydration; no `getServerSideProps`-style blocking on the client.

---

## 12. Reduced-motion as a performance mode

A single gate (LOCKED) — OS `prefers-reduced-motion` **OR** in-app toggle **OR** saveData → Zustand slice → `<html data-motion>` — switches the app into a cheaper rendering mode:

| Subsystem | Normal | Reduced |
|---|---|---|
| Framer | full `domAnimation` | `reducedMotion="user"` → opacity-only/instant |
| GSAP/ScrollTrigger | pin + scrub timelines | static (inside `matchMedia` reduced branch); no pin/scrub |
| Lenis | instantiated | **not instantiated** → native scroll, zero smooth-scroll JS |
| R3F / Canvas | `frameloop="demand"` scene | **static poster**, `three` never loaded |
| Decorative shaders | active | skipped |

Net effect: reduced-motion users get **less JS executed, no WebGL, no continuous rAF** — strictly better CWV. An explicit **Pause-motion** control is required for WCAG 2.2.2 (LOCKED); pausing routes through the same slice.

---

## 13. MDX performance

Content is **Velite** MDX (LOCKED — not Contentlayer), compiled at build time.

| Rule | Implementation |
|---|---|
| **Build-time compilation** | Velite compiles MDX → serializable data + precomputed `toc`, `readingTime`, `seo` at build; no runtime MDX parsing. |
| **RSC-rendered bodies** | The compiled MDX renders as a Server Component; static prose ships as HTML, hydrating nothing. |
| **Island-only interactivity** | Interactive MDX components (live demos, charts) are individually `dynamic`-imported client islands via the MDX component registry (`src/mdx`); the surrounding prose stays server HTML. |
| **Syntax highlighting at build** | Shiki dual-theme (LOCKED code colors) highlights at build time → zero client highlighter JS, pre-colored `<pre>` HTML. |
| **Images in MDX** | Resolved to `next/image` with `sharp`-generated `blurDataURL`/dimensions at build (CLS-safe). |
| **No client MDX runtime** | The `@mdx-js/react` runtime never ships to the browser for body rendering. |

This keeps Blog/Research/Project-detail routes in the **Content (≤175 KB)** tier despite rich bodies, because the body is HTML, not JS.

---

## 14. TanStack Query caching strategy

TanStack Query is **scoped to LIVE DATA only** (LOCKED) — its real job is the GitHub Dashboard and Open Source repo data. It is **not** a general state manager (that is Zustand) and never appears in first-load chunks of non-live routes.

| Setting | Value | Rationale |
|---|---|---|
| `staleTime` (GitHub/OSS) | **3,600,000 ms (1 h)** | Matches the ISR `revalidate ~3600s`; client treats server-hydrated data as fresh for an hour, avoiding immediate refetch on mount. |
| `gcTime` (cacheTime) | **24 h** | Keep across navigations within a session. |
| `refetchOnWindowFocus` | **false** | Avoid surprise refetches that spend rate limit / cause INP spikes. |
| `refetchOnReconnect` | **true** | Recover after offline. |
| `retry` | **2**, exponential backoff | Tolerate transient GitHub 5xx without hammering. |
| Hydration | **server prefetch → `dehydrate` → `HydrationBoundary`** | First paint uses server data; React Query adopts it without a client fetch. |

**First-paint contract:** the GitHub Dashboard and Open Source routes **server-fetch + ISR for first paint**, then React Query is used only for *client refresh/interaction* (e.g. a manual "refresh" button, tab switches). The user never waits on a client request to see content. Query Devtools are dev-only and tree-shaken from production.

---

## 15. GitHub API caching (rate limits, ISR, token)

The GitHub Dashboard (`/github`) and Open Source (`/open-source`) routes are the primary justification for TanStack Query + GitHub API caching (LOCKED).

### 15.1 Rate limits & token

| Concern | Strategy |
|---|---|
| **Rate limit** | Unauthenticated GitHub REST is 60 req/h; authenticated is 5,000 req/h. We authenticate server-side with **`GITHUB_TOKEN`** (env, typed via `@t3-oss/env-nextjs`). |
| **Token security** | `GITHUB_TOKEN` is **server-only** — never `NEXT_PUBLIC_`, never sent to the client. All GitHub calls happen in Server Components / route handlers. |
| **Token scope** | Read-only, public data (profile, repos, contributions). **Assumption:** a fine-grained PAT with public-read scope; no write scopes. |
| **Request minimization** | Prefer GraphQL for the contribution calendar + profile stats in **one** query instead of many REST calls; batch language/repo data. |

### 15.2 ISR & layered caching

| Layer | TTL | Mechanism |
|---|---|---|
| **Next ISR / `fetch` cache** | `revalidate: 3600` (~1 h, LOCKED) | Server `fetch(..., { next: { revalidate: 3600 } })` → page regenerates at most hourly; served from edge cache otherwise. |
| **Stale-while-revalidate** | implicit via ISR | Users get the cached page instantly; revalidation happens in the background. |
| **React Query (client)** | `staleTime 1h` (§14) | Adopts hydrated data; refreshes only on explicit interaction. |
| **HTTP conditional requests** | ETag / `If-None-Match` where the GitHub endpoint supports it | A `304` does **not** count against the rate limit. |

**Result:** at hourly revalidation, even with heavy traffic the route makes ~1 GitHub round-trip per hour per region — far under 5,000/h — and first paint is always served from ISR cache, never blocked on GitHub. Rate-limit headers (`x-ratelimit-remaining`) are logged so a near-limit condition surfaces before it degrades the page; on exhaustion the route serves the last good ISR snapshot.

---

## 16. Avoiding unnecessary re-renders

INP and main-thread health depend on keeping client islands quiet.

| Technique | Rule |
|---|---|
| **State colocation** | Keep state in the smallest island that needs it; don't lift to a provider unless ≥2 islands share it. |
| **Zustand selectors** | Subscribe with narrow selectors (`useStore(s => s.x)`) + `shallow` equality so a store change re-renders only consumers of that slice (motion slice, scroll store). |
| **Stable references** | `useCallback`/`useMemo` for props passed to memoized children and for context values; never create new objects/arrays inline in a hot context provider. |
| **Context discipline** | Split contexts by update frequency (theme rarely changes; scroll changes every frame → scroll lives in a Zustand store read imperatively by R3F, **not** React context). |
| **`React.memo` on leaf islands** | Apply to pure presentational client leaves that receive stable props. |
| **`startTransition` / deferred** | Wrap non-urgent state updates (filtering, search) so input stays responsive. |
| **No per-frame React state** | Scroll/pointer values drive animation through refs/store reads, never `setState` per frame (that is what would blow INP). |
| **Keys** | Stable keys on lists; never index keys on reorderable/animated lists (breaks Framer `layoutId`). |
| **Derived data memoized at build** | TOC, reading time, sorted/filtered content computed at build (Velite) or in server components, not re-derived on every client render. |

---

## 17. CI gates (enforcement)

Every budget above maps to a named, blocking CI check. A red gate **blocks merge**. Gates run in GitHub Actions on every PR; the perf-sensitive ones also run on `main`.

| Gate (name) | Tool | What it enforces | Fails when |
|---|---|---|---|
| **`size-limit`** | `size-limit` + `@size-limit/preset-app` | Shared baseline ≤95 KB, CSS ≤25 KB, per-route first-load tiers (§3) | Any tracked bundle exceeds its byte ceiling |
| **`bundle-budget`** | `@next/bundle-analyzer` + custom route-budget assertion | Per-route first-load JS ≤ tier ceiling (160/175/200 KB) | A route's first-load chunk total exceeds its tier |
| **`no-heavy-in-firstload`** | `scripts/assert-no-heavy-in-firstload.mjs` | §3.3 — no `three`/`gsap`/`scrolltrigger`/`framer-motion` in any first-load chunk | Any of those module ids appears in a first-load chunk |
| **`lhci`** | Lighthouse CI (throttled mobile, Moto-G class) | CWV + category scores (§2, §18) | Perf <90, A11y <95, BP <95, SEO <95, or CWV over budget |
| **`font-preload`** | `scripts/check-font-preload.mjs` | ≤2 preloaded fonts, ≤45 KB total | >2 preload links or >45 KB |
| **`lcp-image`** | `scripts/check-lcp-image.mjs` | LCP image ≤120 KB AVIF | LCP asset over budget or not AVIF |
| **`a11y-jest`** | `jest-axe` | No axe violations in unit-tested components | Any violation |
| **`a11y-e2e`** | `axe-playwright` (light/dark/reduced-motion/forced-colors) | No violations across all four modes | Any violation in any mode |
| **`contrast-tokens`** | `scripts/check-contrast.mjs` | Token pairs meet WCAG 2.2 AA vs painted background (glow excluded) | Any pair below AA ratio |
| **`eslint`** | ESLint flat (`next/core-web-vitals` + `jsx-a11y`) | Perf/a11y lint rules (e.g. no `<img>`, no sync scripts) | Any error |
| **`raw-html-assert`** | `scripts/assert-raw-html.mjs` | Primary content present in SSR/SSG HTML (LOCKED SEO) | Content missing from raw HTML (would mean it's JS-gated) |
| **`field-rum`** | `web-vitals` attribution → analytics | Tracks real p75 CWV (monitor, not a blocking PR gate) | Alerts on p75 regression trend |

**Assumption:** `size-limit` and `lhci` run on PR and block; `field-rum` is a dashboard/alert, not a PR blocker (it measures production reality, which a PR cannot pre-compute).

### 17.1 Lighthouse CI config intent

- **Throttled mobile** preset (LOCKED), simulated Moto-G-class CPU + slow 4G.
- Runs against a production build of the key routes: `/`, `/about`, `/projects`, `/projects/[slug]` (a representative slug), `/blog`, `/github`, `/contact`.
- Asserts category minimums (§18) and CWV numerics (§2) via `assertions` with `error` severity.

---

## 18. Lighthouse targets (LOCKED)

Minimum category scores, throttled mobile, enforced by `lhci`:

| Category | Minimum | Target |
|---|---|---|
| **Performance** | **≥ 90** | 95+ on light routes |
| **Accessibility** | **≥ 95** | **100 on content routes** (LOCKED) |
| **Best Practices** | **≥ 95** | 100 |
| **SEO** | **≥ 95** | 100 |

A score under the minimum on any audited route fails the `lhci` gate and blocks merge.

---

## 19. Per-route performance profiles

Quick reference tying each route to its tier, LCP element, and 3D usage. Section composition is in [page-specifications](./page-specifications.md); device behavior in [responsive-strategy](./responsive-strategy.md).

| Route | Tier (first-load) | LCP element | 3D? | Live data? |
|---|---|---|---|---|
| `/` Landing | Light ≤160 KB | Hero display text / static poster | Yes (Signal Field, deferred) | No |
| `/about` | Light ≤160 KB | Hero heading / portrait image | Accent (aurora mesh, deferred) | No |
| `/philosophy` | Light ≤160 KB | Heading | No | No |
| `/projects` | Content ≤175 KB | Grid heading / first cover image | Cover hover shader (on hover) | No |
| `/projects/[slug]` | Content ≤175 KB | Cover image | Cover shader (optional) | No |
| `/research`, `/research/[slug]` | Content ≤175 KB | Heading / abstract | No | No |
| `/open-source` | Content ≤175 KB | Heading | No | **Yes** (GitHub, ISR + RQ) |
| `/blog`, `/blog/[slug]` | Content ≤175 KB | Heading / cover | No | No |
| `/experience`, `/timeline` | Content ≤175 KB *(or Light if no island)* | Heading | No | No |
| `/gallery` | Content ≤175 KB | First image | No | No |
| `/certificates`, `/achievements` | Content ≤175 KB *(or Light)* | Heading | No | No |
| `/github` GitHub Dashboard | **Heavy ≤200 KB** | Heading / stat block | Optional contribution depth (deferred) | **Yes** (GitHub, ISR + RQ + charts) |
| `/contact` | Light ≤160 KB | Heading | No | No |
| `not-found`, `loading` | Light ≤160 KB | Heading / skeleton | No | No |

---

## 20. Performance review checklist (per PR)

Author self-checks before requesting review; the gates in §17 enforce the rest.

- [ ] No new `three`/`gsap`/`framer` (full) import reachable from a first-load chunk (`no-heavy-in-firstload` green).
- [ ] Any new heavy/conditional module added to the **dynamic-import registry** (§5) with a sized `loading` state.
- [ ] New images: AVIF, explicit dimensions, correct `sizes`, `priority` only if LCP, `blurDataURL` present.
- [ ] New client island is a **leaf**, smallest possible, `'use client'` not bubbled to a page.
- [ ] No per-frame `setState`; scroll/pointer read via store/refs (§16).
- [ ] Live data: server-fetch + ISR for first paint; React Query only for refresh (§14–15); token stays server-only.
- [ ] Reduced-motion path verified (no Lenis, static poster, no scrub) (§12).
- [ ] Route still under its tier budget (`size-limit` / `bundle-budget` green).
- [ ] `lhci` Perf ≥90, A11y ≥95 (100 on content routes), BP ≥95, SEO ≥95.
- [ ] CWV p75 not regressed in field RUM trend after deploy.

---

*This document operationalizes the LOCKED Performance Budget, Accessibility, SEO, Motion, and Three.js sections. When a number here and LOCKED ever disagree, LOCKED wins and this file is corrected.*

# Bottleneck Analysis

> Purpose: the authoritative catalogue of every performance and stability bottleneck this portfolio can realistically hit — each one traced symptom → root cause → concrete solution → verification gate — so the premium, 3D-heavy, motion-rich experience still meets the LOCKED Core Web Vitals and bundle budgets on a throttled mid-range mobile.

Related: [Performance Strategy](./performance-strategy.md) · [Dependency Plan](./dependency-plan.md) · [Three.js Strategy](./three-strategy.md) · [Animation Strategy](./animation-strategy.md) · [Design Tokens](./design-tokens.md) · [Design System](./design-system.md) · [Component Inventory](./component-inventory.md) · [Responsive Strategy](./responsive-strategy.md) · [Accessibility Strategy](./accessibility-strategy.md) · [SEO Strategy](./seo-strategy.md)

---

## 0. How to read this document

Every bottleneck below is treated as **inevitable until proven prevented**. The premium aesthetic — persistent WebGL, GSAP scroll choreography, glass surfaces, heavy imagery — is exactly the set of things that breaks CWV if left unmanaged. So each risk gets a **named verification gate** (the same gates defined in [performance-strategy](./performance-strategy.md#ci-gates)) rather than a hope.

- **Symptom** — what a user or a tool observes.
- **Root cause** — the underlying mechanism, not the symptom.
- **Solution** — the concrete, opinionated fix, tied to a LOCKED decision where one exists.
- **Verify** — the automated gate or manual measurement that proves the fix holds and catches regression.
- **Assumption:** — a professional default LOCKED did not pin; binding until revisited.

The budgets referenced throughout are LOCKED: **p75 mobile LCP ≤2.5s, INP ≤200ms, CLS ≤0.02**; shared baseline JS **≤95KB gz**; per-route first-load **≤160/175/200KB gz** by tier; CSS **≤25KB gz**; LCP image **≤120KB AVIF**; **zero `three`/`gsap`/`framer` in any first-load chunk**.

---

## 1. Master bottleneck table

| # | Bottleneck | Symptom | Root cause | Solution | How we verify |
|---|---|---|---|---|---|
| 1 | **Heavy Three.js scenes** | Jank/low FPS on scroll; battery drain; high INP near the canvas; LCP regression | One always-running WebGL context, uncapped DPR, GLTF/texture weight, full feature import | Single persistent `<Canvas>` (`ssr:false`) + tunnel-rat; `frameloop="demand"`; DPR clamp `[1,1.75]`; drei `PerformanceMonitor` auto-downgrade; IntersectionObserver pause off-screen; procedural geometry over assets; dispose on unmount; capability-tier → static AVIF poster (the poster IS the LCP) | R3F profiler + Chrome FPS meter on throttled mobile; `size-limit` proves zero `three` in first-load; Lighthouse LCP gate; manual low-end device pass ([three-strategy](./three-strategy.md)) |
| 2 | **Too many client components** | Large first-load JS; slow TTI/INP; hydration cost everywhere | `"use client"` placed too high in the tree; whole pages opted into the client | RSC-by-default; push `"use client"` to leaf interactive islands only (`features/*`, motion, palette, theme toggle, forms); pass server data as props, not via client fetch | `@next/bundle-analyzer` per-route; raw-HTML CI assertion (content present without JS); component-inventory Server/Client column audit ([component-inventory](./component-inventory.md)) |
| 3 | **Large animation libraries** | `framer`/`gsap` bytes inflate first-load; budget breach | Static top-level imports of `framer-motion`/`gsap` land in shared/first-load chunks | `LazyMotion` + `m.*` with lazy `domAnimation`; dynamic-import GSAP per scroll route after paint; never `import { motion }`; trivial UI motion via CSS (`tailwindcss-animate`) | `size-limit` byte ceilings; bundle-analyzer **chunk-content assertion** that flags `three`/`gsap`/`framer` in any first-load chunk ([dependency-plan](./dependency-plan.md#animation)) |
| 4 | **ScrollTrigger misuse** | Stutter on scroll; competing scroll listeners; pins that fight Lenis; CLS from late pin setup | Multiple rAF loops; ScrollTrigger reading native scroll while Lenis smooths; `refresh()` thrash; pins added after layout | **One rAF:** `gsap.ticker` drives `lenis.raf`; `lenis.on('scroll', ScrollTrigger.update)`; all GSAP inside `gsap.matchMedia` (reduced-motion = static, no pin/scrub); set pin containers' size up front; `ScrollTrigger.refresh()` only on debounced resize | Manual scroll-perf trace (no long tasks during scroll); CLS gate; reduced-motion E2E shows static layout ([animation-strategy](./animation-strategy.md#motion-division-of-labor)) |
| 5 | **Layout thrashing** | Dropped frames; forced sync layout warnings in the profiler | Interleaved DOM reads/writes (offsetTop/getBoundingClientRect then style writes) in scroll/pointer handlers | Read-then-write batching; use transforms/opacity only (compositor-friendly); cache measurements; let GSAP/Framer own writes; read scroll from the Zustand store, not the DOM | Performance panel "forced reflow" check; INP gate; code review for `getBoundingClientRect` in hot paths |
| 6 | **Image weight** | Slow LCP; large transfer on galleries/covers; CLS from unsized images | Unoptimized formats, no width/height, eager loading below the fold | `next/image` + `sharp` → AVIF/WebP; LCP cover ≤120KB AVIF; explicit width/height + `blurDataURL` (no CLS); `priority` only on the LCP image; lazy everything below fold; responsive `sizes` | Lighthouse LCP + "properly sized images"; CLS gate; gallery payload check; `blurDataURL` present in gallery data ([responsive-strategy](./responsive-strategy.md)) |
| 7 | **Font loading** | FOIT/FOUT; CLS on heading swap; render delay on LCP text | Too many faces; render-blocking font CSS; missing `size-adjust`/fallback metrics | `next/font/google` self-host Space Grotesk + Geist Sans (preload ≤2, ≤45KB); Geist Mono lazy; `font-display: swap` with matched fallback metrics to neutralize swap shift; subset Latin | Lighthouse "font display"; CLS gate; ≤2 preloaded fonts asserted; network panel shows self-hosted, preloaded faces ([typography-system](./typography-system.md)) |
| 8 | **MDX bundle size** | Detail routes exceed 175KB; slow content hydration | Runtime MDX compile; client syntax highlighter; shipping unused MDX components | Velite compiles MDX at **build** to RSC HTML; Shiki highlights at **build** (zero client highlighter); MDX component registry maps only used components; bodies are server-rendered | Build output is static HTML (raw-HTML assertion); bundle-analyzer on `[slug]` routes; no `shiki`/MDX runtime in client chunk ([dependency-plan](./dependency-plan.md#content--mdx)) |
| 9 | **GitHub API rate limits** | Dashboard fails/empties under traffic; 403 rate-limit; slow first paint | Unauthenticated/over-frequent calls; client-side fan-out; no caching | Server fetch with `GITHUB_TOKEN` (5k/hr) + ISR `revalidate ~3600s`; one batched GraphQL call where possible; React Query hydrated from the server fetch (no redundant initial request); graceful cached-fallback + stale UI on error | Synthetic rate-limit test; verify ISR cache headers; React Query devtools shows hydration not refetch; error-state E2E ([dependency-plan](./dependency-plan.md#data-fetching)) |
| 10 | **Hydration cost** | High INP at load; main-thread blocked after paint; hydration mismatch warnings | Over-hydration (whole pages client); large props serialized; mismatches from theme/time | Minimize client islands (#2); `next-themes` pre-paint script avoids theme mismatch; serialize lean props; defer non-critical islands with `dynamic` + `loading`; `Suspense` boundaries around live/3D islands | INP field RUM (`web-vitals`); React hydration-warning check in CI logs; Lighthouse TBT |
| 11 | **Excessive re-renders** | Sluggish interactions; INP spikes during scroll/pointer; needless commits | High-frequency values (scroll/pointer/theme) flowing through React Context; unmemoized handlers/derived class strings | Zustand **selector** subscriptions for scroll/pointer (subscribe outside React); `memo`/`useCallback` on island leaves; memoize `cn()`/CVA variant strings; never put 60fps values in Context | React Profiler commit count during scroll; INP gate; lint for Context holding hot values ([dependency-plan](./dependency-plan.md#state-management)) |
| 12 | **Mobile GPU limitations** | Overheating, frame drops, crashes on low-end Android; WebGL context loss | Same scene shipped to all tiers; high particle counts; expensive fragment shaders; high DPR | Device-tier resolution (drei `PerformanceMonitor` + UA/heuristic tier) → reduce particle count / disable accent scenes / fall to poster; DPR clamp; `powerPreference` low; handle `webglcontextlost`; reduced-motion/saveData → poster | Real low-end device test matrix; tier-downgrade verified; no-WebGL fallback E2E; thermal/FPS spot check ([three-strategy](./three-strategy.md)) |
| 13 | **Large dependency graph** | Slow installs/builds; transitive bloat; accidental client inclusion of server libs | Barrel imports (drei index, lodash, lucide namespace); duplicate utilities; server-only libs leaking client | Cherry-pick deep imports (drei, lucide per-icon); ban full lodash/moment/axios; `server-only` marker on `lib/email`, `lib/github`, env; dedupe via single `cn()`/date helpers; the AVOID list is lint-enforced | `size-limit`; bundle-analyzer module treemap; `depcheck`/import-lint; `server-only` import boundary ([dependency-plan](./dependency-plan.md#dependencies-to-avoid)) |
| 14 | **Overuse of blur / backdrop-filter** | Scroll jank, GPU spikes (esp. mobile/Safari); blurred sticky nav stutters | `backdrop-filter: blur()` on large/animated/stacked surfaces is a costly per-frame composite | Limit glass to small static surfaces (nav/cards/palette) at 12px blur; **never** blur a large scrolling area; solid fallback under `prefers-reduced-transparency`; avoid animating blur radius (animate opacity instead); promote sparingly | Scroll-perf trace with paint flashing; reduced-transparency E2E shows solid fallback; INP gate; manual Safari/iOS pass ([design-tokens](./design-tokens.md) BLUR/GLASS) |

---

## 2. Detailed remediation notes

### 2.1 Heavy Three.js scenes (#1, #12)
The single biggest risk to the LCP and INP budgets. The mitigation is layered, and **every layer must hold independently**:

1. **Poster-first:** a static AVIF poster is rendered server-side and is the LCP element. WebGL only fades in after paint via `ssr:false` dynamic import. The user on a low tier, with no WebGL, or with reduced motion **never** downloads or runs the scene.
2. **Single context:** one `<Canvas>` for the whole app; route scenes portal in via `tunnel-rat`. This caps GPU memory and avoids context-creation cost on navigation.
3. **Demand frameloop:** `frameloop="demand"` means zero GPU work when nothing changes; `invalidate()` is called on pointer/scroll/store change only.
4. **Auto-downgrade:** drei `PerformanceMonitor` lowers DPR/particle count when frame budget slips; a hard floor falls back to the poster.
5. **Disposal:** geometries/materials/textures/render-targets and listeners are released on unmount; the reused context is never leaked.

> **Assumption:** Hero "Signal Field" particle count is tiered (e.g. desktop high / mobile reduced / low-end poster); exact counts are tuned against the FPS gate, not guessed in code.

### 2.2 Client-component creep (#2, #10, #11)
The default is **Server**. A component earns `"use client"` only if it uses state/effects/event handlers/browser APIs. The [component-inventory](./component-inventory.md) Server/Client column is the contract; bundle-analyzer is the auditor. Live data and 3D islands sit behind `Suspense` so their hydration never blocks the static content's interactivity.

### 2.3 The single-rAF discipline (#4, #5, #11)
There is exactly one animation clock: `gsap.ticker` → `lenis.raf` → `ScrollTrigger.update`. No component may register its own `requestAnimationFrame`, scroll listener, or `ResizeObserver`-driven write loop for animation. Scroll position is **read from the Zustand store**, never from the DOM in a hot path. This single rule prevents the majority of scroll-jank, layout-thrash, and competing-loop bugs at once.

### 2.4 Reduced motion as a performance mode (#1, #3, #4, #12, #14)
The LOCKED reduced-motion gate (`prefers-reduced-motion` / in-app toggle / saveData → `<html data-motion>`) is also the cheapest rendering path: **Lenis not instantiated** (native scroll), GSAP `matchMedia` yields static layouts, Framer `reducedMotion="user"`, R3F → poster, glass → solid. Users who opt in get *better* CWV, and the same switches are our emergency low-end fallback.

### 2.5 Live-data resilience (#9)
The GitHub Dashboard must degrade gracefully, never blank. Order of defense: server fetch + token → ISR cache (serves stale instantly) → React Query hydrated from that → on upstream 403/error, render the last good cached payload with a quiet "updated X ago" stale indicator. The page's static shell (headings, layout) is RSC and renders regardless of API state, protecting LCP/CLS.

---

## 3. Per-route bottleneck hotspots

| Route(s) | Dominant risk | Primary mitigation |
|---|---|---|
| Landing `/` | Three.js hero (#1), font/LCP (#6,#7) | Poster-LCP, demand frameloop, ≤2 preloaded fonts |
| Projects `/projects`, `/projects/[slug]` | Image weight (#6), cover hover shader (#1), MDX (#8) | AVIF + `blurDataURL`, on-demand shader, build-time MDX |
| Blog/Research `[slug]` | MDX + Shiki (#8), hydration (#10) | Velite + Shiki at build; RSC bodies |
| GitHub Dashboard `/github` | API limits (#9), charts/deps (#13), client query (#10,#11) | Token + ISR + hydrated React Query; SVG charts from chart tokens |
| Gallery `/gallery` | Image weight (#6), horizontal scroll (#4), blur (#14) | Lazy AVIF grid, GSAP horizontal with accessible Prev/Next, restrained glass |
| About `/about` | Aurora mesh (#1,#12) | Tiered scene → poster on low end |
| Contact `/contact` | Form re-renders (#11), validation bundle | RHF uncontrolled + one Zod schema, light route |

---

## 4. Verification gates summary

| Gate | What it catches | Blocks merge? |
|---|---|---|
| `size-limit` | First-load JS / CSS budget breaches; `three`/`gsap`/`framer` in baseline | Yes |
| `@next/bundle-analyzer` chunk-content assertion | Forbidden libs in first-load chunks; barrel-import bloat | Yes |
| Lighthouse CI (throttled mobile) | LCP/INP/CLS, Perf ≥90, A11y ≥95, BP ≥95, SEO ≥95 | Yes |
| `web-vitals` field RUM | Real p75 CWV regressions in production | Alerts |
| Raw-HTML SSG assertion | Content gated behind JS; over-hydration | Yes |
| `jest-axe` + `@axe-core/playwright` (dark/light/reduced-motion/forced-colors) | A11y regressions incl. reduced-motion static fallbacks | Yes |
| React Profiler / FPS trace (manual on low-end) | Re-render storms, scroll jank, GPU thermals | Review gate |
| Synthetic GitHub rate-limit test | Dashboard resilience under 403 | Review gate |

> Every row in §1 maps to at least one gate here. A bottleneck without a gate is an unmanaged risk and is not allowed to ship — see the enforcement contract in [performance-strategy](./performance-strategy.md#ci-gates).

---

## 5. Cross-references

- The numeric budgets and CI gate definitions: [performance-strategy](./performance-strategy.md).
- Why each dependency is shaped to avoid these bottlenecks (and the AVOID list): [dependency-plan](./dependency-plan.md).
- Single-canvas, demand-frameloop, poster-LCP, disposal rules: [three-strategy](./three-strategy.md).
- One-rAF model and the reduced-motion gate: [animation-strategy](./animation-strategy.md).
- Server vs Client component contract: [component-inventory](./component-inventory.md).
- Device tiers, image `sizes`, and mobile breakpoints: [responsive-strategy](./responsive-strategy.md).
- Glass/blur tokens and the reduced-transparency fallback: [design-tokens](./design-tokens.md).

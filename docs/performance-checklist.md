# Performance Checklist

Production/as-built performance reference for the Joshua Setiawan portfolio (Next.js 16 App
Router, deployed to Vercel). Each item lists what is implemented and how to measure it.
Status legend:

- **Done** — implemented and shipping.
- **Verify** — implemented; confirm with a measurement.
- **Action** — optional tooling/step not yet wired.

---

## 1. Core Web Vitals targets

Target the "good" thresholds (Google CWV) on mobile (the stricter case):

| Metric | Target ("good") | Primary lever in this codebase |
| --- | --- | --- |
| LCP (Largest Contentful Paint) | ≤ 2.5 s | Hero copy is real DOM (not motion-gated); 3D scene is `ssr:false` lazy and decorative, so it never blocks LCP. `next/font` with `display: swap`. |
| INP (Interaction to Next Paint) | ≤ 200 ms | Lazy 3D/GSAP keep main-thread JS small; `LazyMotion` ships only the `domAnimation` feature set. |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | `next/image` with intrinsic sizing; transform-only `PageTransition` (no layout/opacity); font `swap`. |
| TTFB | low | RSC + static generation + ISR for GitHub data. |

**Measure:** Field data via `@vercel/speed-insights` (wired in `src/app/layout.tsx`) and the
Vercel Speed Insights dashboard. Lab data via Lighthouse (mobile preset) and
[PageSpeed Insights](https://pagespeed.web.dev/).

## 2. Code-splitting: Three.js & React Three Fiber

| Item | Status | Detail |
| --- | --- | --- |
| 3D off the critical path | Done | `SceneCanvas` loads `@/three/components/r3f-canvas` via `next/dynamic` with `ssr:false` (`src/components/three/scene-canvas.tsx`). |
| Signal Field scene lazy | Done | `HeroScene` dynamically imports `@/three/scenes/signal-field` (`ssr:false`) — `three` + `@react-three/fiber` download only when the canvas mounts (`src/components/sections/hero-scene.tsx`). |
| Poster fallback | Done | Gradient poster renders immediately while/if the scene is absent; scene is `aria-hidden` (decorative). |
| Adaptive particle count | Done | `count={isSmall ? 1600 : 3800}` scales work down on small screens. |
| Unused 3D deps removed | Done | `@react-three/drei` removed in Phase 5. |

**Measure:** In DevTools Network/Coverage, confirm `three`/r3f chunks load only on the
landing route and after first paint. Bundle analyzer (see §10) to confirm they're isolated.

## 3. Code-splitting: GSAP & ScrollTrigger

| Item | Status | Detail |
| --- | --- | --- |
| GSAP isolated to `/timeline` | Done | `getGsap()` lazy accessor (`src/lib/motion/gsap.ts`) is imported only by route-level scroll components, so GSAP never enters the shared/first-load bundle. |
| ScrollTrigger registered once | Done | Guarded `registerPlugin` (client-only) in `getGsap()`. |
| Unused GSAP wrapper removed | Done | `@gsap/react` removed in Phase 5. |

**Measure:** Confirm no GSAP chunk on routes other than `/timeline` (Network tab / analyzer).

## 4. Images (next/image)

| Item | Status | Detail |
| --- | --- | --- |
| AVIF/WebP enabled | Done | `images.formats: ["image/avif", "image/webp"]` (`next.config.ts`). |
| `next/image` everywhere | Done | Used in project/blog/featured/gallery cards, MDX images, GitHub avatar (6 modules). No raw `<img>` in the app. |
| Remote sources allowlisted | Done | `remotePatterns` for `avatars/raw.githubusercontent.com` + `opengraph.githubassets.com`. |
| `sharp` for optimization | Done | `sharp` dependency present (used by Next image optimizer at build/runtime). |
| Sizing / no CLS | Verify | Confirm each image has correct `sizes`/intrinsic dims so it reserves space (no layout shift). |
| Priority on LCP image | Verify | If any above-the-fold raster image is the LCP element, mark it `priority`. |

**Measure:** Lighthouse "Properly size images" / "Serve images in next-gen formats" / "Image
elements have explicit width and height"; inspect that responses are AVIF/WebP.

## 5. Fonts (next/font)

| Item | Status | Detail |
| --- | --- | --- |
| Self-hosted Google fonts | Done | `Space_Grotesk` (display), `Geist` (sans), `Geist_Mono` (mono) via `next/font/google` (`src/app/layout.tsx`) — no render-blocking external request. |
| `display: swap` | Done | Set on all three families (avoids invisible text / FOIT). |
| CSS variable wiring | Done | `--font-display/-sans/-mono` applied on `<html>`. |
| Subsetting | Done | `subsets: ["latin"]`. |

**Measure:** Confirm fonts are same-origin and `font-display: swap`; check for layout shift
from font swap in Lighthouse.

## 6. ISR / data caching (GitHub)

| Item | Status | Detail |
| --- | --- | --- |
| GitHub data via ISR | Done | `fetch(..., { next: { revalidate: 3600 } })` — 1-hour revalidate (`src/lib/github.ts`), so the GitHub page is statically served and refreshed hourly. |
| Server-side (no client query lib) | Done | `@tanstack/react-query` removed in Phase 5; data is fetched in RSC (faster + SEO-friendly). |
| Token raises rate limit | Verify | Optional `GITHUB_TOKEN` lifts the GitHub API rate limit in production. |
| Route-level loading UI | Done | `src/app/(site)/github/loading.tsx` (+ root `loading.tsx`) provides instant skeletons. |

**Measure:** Confirm the GitHub page HTML is prerendered (View Source shows data); verify
revalidation behavior after 1h. Watch for rate-limit fallbacks without a token.

## 7. Animation runtime (LazyMotion / Framer Motion)

| Item | Status | Detail |
| --- | --- | --- |
| LazyMotion + domAnimation | Done | `MotionProvider` loads only the `domAnimation` feature set; `strict` blocks the heavier full `motion.*` API — app uses `m.*` only (`src/providers/motion-provider.tsx`). |
| Transform/opacity-only motion | Done | `PageTransition` is transform-only; reveals/forms use transform+opacity — no layout-animating props (CLS-safe). |
| Motion gated by reduced-motion | Done | `Reveal`/`PageTransition`/contact form bypass or simplify under reduced motion (also a perf win). |
| `optimizePackageImports` | Done | `experimental.optimizePackageImports: ["lucide-react", "framer-motion"]` (`next.config.ts`) trims icon/motion import cost. |

**Measure:** Bundle analyzer — confirm only `domAnimation` features and tree-shaken
`lucide-react` icons ship.

## 8. Hydration & client/server boundaries

| Item | Status | Detail |
| --- | --- | --- |
| RSC-first | Done | Pages/layout are Server Components; `"use client"` is scoped to interactive leaves (forms, motion, providers, 3D). |
| Provider stack minimal | Done | Theme > Motion > Tooltip > Lenis; no data-fetching provider (`app-providers.tsx`). |
| Hydration-safe theme | Done | `suppressHydrationWarning` on `<html>`; `next-themes` (dark default). |
| Reduced-motion without hydration churn | Done | OS pref read via `useSyncExternalStore` (no setState-in-effect) (`use-reduced-motion.ts`). |

**Measure:** No hydration mismatch warnings in console; React Profiler shows small client
trees. Check Total Blocking Time in Lighthouse.

## 9. Network / build optimizations

| Item | Status | Detail |
| --- | --- | --- |
| Static generation + SSG params | Done | `generateStaticParams` pre-renders all project + blog slugs (incl. per-slug OG images). |
| `reactStrictMode` | Done | Enabled in `next.config.ts`. |
| Typed env fails fast | Done | `@t3-oss/env-nextjs` validates env at build (`src/lib/env.ts`) — bad config fails the build, not production. |
| Analytics deferred | Done | `@vercel/analytics` + `@vercel/speed-insights` injected after content. |
| Dead deps pruned | Done | Phase 5 removed `@react-three/drei`, `@tanstack/react-query`, `@gsap/react`, `@mdx-js/react`, `tunnel-rat`, `web-vitals`. |

**Measure:** Review `next build` output (route sizes, First Load JS, static vs dynamic
markers). Keep shared First Load JS lean.

## 10. Measurement tooling

| Tool | Status | How |
| --- | --- | --- |
| Lighthouse (lab) | Verify | Chrome DevTools → Lighthouse (mobile preset), or `npx lighthouse <url> --preset=desktop/mobile`. Run per route. |
| PageSpeed Insights (lab + field) | Verify | <https://pagespeed.web.dev/>. |
| Vercel Speed Insights (field/RUM) | Done | Wired via `@vercel/speed-insights`; view in the Vercel dashboard. |
| Vercel Analytics | Done | `@vercel/analytics` wired in `layout.tsx`. |
| `next build` output | Verify | Inspect route-level First Load JS and prerender markers. |
| Bundle analyzer | Action | **Not currently installed.** To inspect chunk composition, add `@next/bundle-analyzer` and run `ANALYZE=true pnpm build`, or use Next's build stats / source-map-explorer. |

---

### Suggested measurement workflow

1. `pnpm build` and review the route table (First Load JS, static vs ISR/dynamic).
2. Run Lighthouse (mobile) on landing (`/`, has the 3D hero), a content page, `/timeline`
   (GSAP), and `/github` (ISR). Confirm LCP/CLS/TBT budgets.
3. In DevTools Network/Coverage, confirm `three`/r3f load only on `/` and only after first
   paint, and GSAP loads only on `/timeline`.
4. Add `@next/bundle-analyzer` (Action item) to visually confirm code-splitting boundaries.
5. After deploy, monitor **field** CWV (LCP/INP/CLS) in Vercel Speed Insights and treat lab
   numbers as guidance only.

> Highest-leverage regressions to watch: a 3D/GSAP import accidentally pulled into a shared
> client component (breaks code-splitting), an above-the-fold raster image without
> sizing/`priority` (LCP/CLS), and any new motion using layout-animating properties (CLS).

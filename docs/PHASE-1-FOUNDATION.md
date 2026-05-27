# Phase 1 — Foundation, Architecture & Creative Direction

> ⚠️ **SUPERSEDED ROUTE PLAN — companion document.** This is an early condensed synthesis written before the 18‑page scope was finalized. The authoritative Phase 1 spec is the 29‑doc set in this folder (start at [phase-1-overview](./phase-1-overview.md)). Where this file references `/work`, `/writing`, `/playground`, `/uses`, `/now`, or a different primary nav, the **18‑page scope** in [page-specifications](./page-specifications.md) and [information-architecture](./information-architecture.md) is authoritative. The design tokens, motion system, performance/a11y/SEO contracts, and dependency decisions here remain valid and were carried forward verbatim.

> **Project:** Personal portfolio for **Joshua Setiawan** — _Creative Developer + Software Engineer_.
> **Aesthetic:** _Immersive Dark + 3D_ — cinematic, dark‑first, WebGL hero, depth, motion‑forward, with a full light/dark toggle.
> **Status:** Phase 1 complete (planning only — no application code written yet).
> **How this was produced:** eight senior specialists (Architect, Creative Director, UX, Motion/3D, Performance, Accessibility, SEO, Tech Lead) each authored a brief in parallel, then an adversarial principal reviewer stress‑tested the whole for gaps, contradictions, YAGNI, and risk. This document is the reconciled, signed synthesis.

This file is the single source of truth for **what we are building and why**. Phase 2 implements from it. Sibling file [`CONTENT-CHECKLIST.md`](./CONTENT-CHECKLIST.md) is the actionable list of real content **you** provide.

---

## 0. Locked product decisions

| Decision | Choice |
|---|---|
| Positioning | Hybrid **Creative Developer + Software Engineer** — engineering depth shown through interactive craft |
| Aesthetic | **Immersive Dark + 3D**, dark default, full light theme as a first‑class counterpart |
| Route scope | **Full** — Home, About, Work (+ detail), Writing/Blog (MDX), Playground/Lab, Contact, `/uses`, `/now` |
| Content | **You provide real content.** Phase 1 designs a typed content model + intake checklist; Phase 3 fills pages with your real data |
| Package manager | **pnpm** (no lockfile existed) via **Corepack** on the installed **Node 26** |

---

## 1. Signed decision record (the 14 open forks, resolved)

The adversarial review flagged 14 decisions. Here is how each is resolved. Items marked **⚠ Confirm** are personal/business choices where I set a sensible, _easily reversible_ default and invite your override before Phase 2 (see §13).

| # | Decision | Resolution | Why | Reversible? |
|---|---|---|---|---|
| 1 | Tailwind v3 vs **v4** | **Tailwind v4** (CSS‑first `@theme`, no `tailwind.config.js`) | Modern, matches our token plumbing, shadcn supports it | Hard to change later — locked now |
| 2 | Brand palette conflict (azure/teal vs cyan/violet) | **One signed palette: azure `#5E8BFF` + plasma‑teal `#38E8C8` on brand‑black `#05070D`**; `--ring` = accent azure | Creative owns hue; A11y owns ratio. Verified ≥ AA, enforced by a CI contrast script | Accent swappable via tokens ⚠ |
| 3 | Node 26 vs 22 LTS | **Node 26** (matches your machine), pinned via `engines` + `.nvmrc`; **Node 22 LTS documented as fallback** if a native dep blocks | Consistency with your env | Yes |
| 4 | Next 15 vs 16 | **Latest stable Next.js** (15.x/16.x at install), App Router | Newest features (PPR, View Transitions) | Pinned at Phase 2 install |
| 5 | Hosting | **Vercel** assumed | Best Next.js DX, edge OG, Speed Insights, image optimization | Yes ⚠ |
| 6 | Hero 3D target form | **Abstract procedural "Signal Field"** that converges toward a glyph‑agnostic form — **decoupled from the logo decision** | Avoids coupling the most expensive artifact to an unmade branding call | Yes |
| 7 | Analytics + privacy | **Vercel Analytics + Speed Insights (cookieless)** → no consent banner needed; **add `/privacy` page + a consent line** on the contact form (it collects email/PII) | Cookieless analytics avoids a banner; PII still warrants a policy | Yes ⚠ |
| 8 | Contact transport + spam | **Server Action + Resend**; spam = **honeypot + time‑trap + in‑memory/edge rate‑limit**. **Turnstile deferred** | Portfolio contact volume is low; defense‑in‑depth without a third‑party widget | Provider is config‑driven ⚠ |
| 9 | View counters / Upstash / TanStack Query | **Cut view counters + Upstash for v1.** **Keep TanStack Query** — give it a _real_ job: live **GitHub stats** island (About) + optional **now‑playing** (`/now`) | Honors the mandated stack with a genuine live‑read use instead of a contrived query | Yes |
| 10 | `@react-three/postprocessing` (Bloom) | **Defer.** v1 glow via emissive materials + glow sprites | Bloom is disabled on mobile (where p75 is measured) anyway — pay the cost only if desktop bloom is signed off | Easy to add |
| 11 | Fonts (Clash Display license risk) | **v1: Space Grotesk (display) + Geist Sans (body) + Geist Mono (mono)** — all free, with automatic fallback metrics (zero CLS). **Clash Display is a one‑line opt‑in upgrade** if you confirm the Fontshare license | De‑risks licensing + the hero‑`<h1>` CLS problem | Yes ⚠ |
| 12 | Speculative generality | **Cut for v1:** i18n tuple‑keying, multi‑format feeds (keep `rss.xml` only), sound system, `prefers-contrast`/`reduced-data` token branches (keep the architecture that _allows_ them), `/api/revalidate` | YAGNI for a one‑person portfolio | Yes |
| 13 | `exactOptionalPropertyTypes` | **Off globally** (content‑model strictness comes from Zod/branded types) | It fights R3F/Drei/Motion prop types constantly | Yes |
| 14 | Testing scope (v1) | a11y (lint + jest‑axe + Playwright axe), Lighthouse CI, bundle budgets, JSON‑LD schema unit tests, contact‑action unit test, raw‑HTML content assertion. **Visual‑regression/Storybook deferred** | Right rigor for v1 without gold‑plating | Yes |

**Additional resolved cross‑brief conflicts:** dynamic OG uses **build‑time co‑located `opengraph-image.tsx`** (the `/api/og` route is cut); one brand‑black `#05070D` everywhere (manifest `theme_color`, OG background, shader clear color); `--ring` unified to accent azure; per‑segment `work/[slug]/error.tsx` dropped (keep `global-error` + one group `error`); command palette ships nav + flat content search (Recent deferred); `playground/[slug]` renders **only when `hasDetail`**.

---

## 2. Dependency policy — every package justified

We honor the mandated stack. Two deviations, both flagged above and reversible:

- **`@react-three/postprocessing` deferred** (decision 10) — not installed in v1; glow achieved with emissive + sprites.
- **TanStack Query kept, re‑scoped** (decision 9) — wired to a genuine live‑data island (GitHub stats / now‑playing) rather than installed idle.

**Core dependencies (Phase 2 install target):**

| Package | Role | Justification |
|---|---|---|
| `next`, `react`, `react-dom` | Framework | App Router, RSC, SSG, image/font/OG primitives |
| `tailwindcss` v4, `@tailwindcss/postcss`, `@tailwindcss/typography`, `tw-animate-css` | Styling | Token‑driven utilities; typography for MDX prose |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Variants + class merging | shadcn component variants; conflict‑free `cn()` |
| `next-themes` | Theming | Dark‑default light/dark toggle, FOUC‑free |
| `lucide-react` | Icons | Tree‑shaken named imports only |
| `framer-motion` | Component/state motion + page transitions | Enter/exit, `layout`/`layoutId`, gestures (via `LazyMotion`) |
| `gsap`, `@gsap/react` | Scroll choreography | ScrollTrigger pin/scrub/timelines; `useGSAP` cleanup |
| `lenis` | Smooth‑scroll baseline + single scroll source | Drives GSAP + R3F from one rAF |
| `three`, `@react-three/fiber`, `@react-three/drei` | WebGL | Hero + accent scenes |
| `tunnel-rat` | Canvas portal | Feature scenes inject into the single persistent `<Canvas>` |
| `@tanstack/react-query` | Live‑data islands | GitHub stats / now‑playing (decision 9) |
| `zustand` | Global UI state (tiny) | Menu/palette/motion‑pref flags only |
| `react-hook-form`, `@hookform/resolvers`, `zod` | Forms + validation | One Zod schema, client + server |
| `@t3-oss/env-nextjs` | Typed env | Build fails on missing/invalid env |
| `@mdx-js/react` | MDX runtime registry | Embed `<Callout>`, `<Demo>` etc. in posts |
| `resend`, `@react-email/components` | Contact email | Server‑only transactional send |
| `cmdk` | Command palette | ⌘K accelerator |
| `sonner` | Toasts | Form/copy feedback (shadcn‑native) |
| `feed` | RSS | Correct XML/date/CDATA escaping |
| `@vercel/analytics`, `@vercel/speed-insights`, `web-vitals` | Field RUM | Cookieless analytics + CWV attribution |
| `sharp` | Image optimization | Production `next/image` |

**Dev dependencies:** `typescript` + `@types/*`; `eslint` + `eslint-config-next` + `typescript-eslint` + `eslint-plugin-jsx-a11y`; `prettier` + `prettier-plugin-tailwindcss`; `husky` + `lint-staged`; `@commitlint/cli` + `@commitlint/config-conventional`; `velite` + pipeline plugins (`rehype-pretty-code`/`shiki`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `reading-time`); `schema-dts`; `@next/bundle-analyzer` + `size-limit`; `@lhci/cli`; `vitest` + `@testing-library/react` + `jest-axe`; `@axe-core/playwright` + `@playwright/test`.

---

## 3. Information architecture & routing

Default posture: **everything is statically generated (SSG)**, RSC by default, client components are surgical islands. `dynamicParams = false` on all `[slug]` routes; `export const dynamic = 'error'` as a guardrail so an accidental dynamic API fails the build instead of silently opting into SSR.

| Route | Strategy | Client islands | `generateStaticParams` |
|---|---|---|---|
| `/` | SSG | Hero canvas, scroll timelines, featured‑work | — |
| `/about` | SSG | reveal islands, GitHub‑stats (React Query) | — |
| `/work` | SSG | `WorkGrid` (hover, filter, horizontal scroll) | — |
| `/work/[slug]` | SSG | gallery, media, pinned sequences | **Yes** |
| `/writing` | SSG | filter/list reveals | — |
| `/writing/[slug]` | SSG | `MDXContent`, reading progress, ToC | **Yes** |
| `/writing/rss.xml` | Route handler | — | — |
| `/playground` | SSG | intersection‑gated mini‑canvas previews | — |
| `/playground/[slug]` | SSG shell + lazy experiment | experiment module (`ssr:false`) | **Yes** (only when `hasDetail`) |
| `/contact` | SSG shell | `ContactForm` (RHF + Server Action) | — |
| `/uses` | SSG | minimal reveals | — |
| `/now` | SSG (opt. ISR) | optional now‑playing (React Query) | — |
| `/privacy` | SSG | — | — |
| `not-found`, `error`, `loading` | — | `error.tsx` is client | — |
| `sitemap.ts`, `robots.ts`, `manifest.ts` | build‑time | — | — |
| `opengraph-image.tsx` (work, writing, playground) | **build‑time** static | — | per slug |

**Nav order:** `Work · About · Writing · Playground · Contact` (Work first — it's the credibility lead). `/uses` and `/now` live in the footer + command palette. Logo = wordmark "Joshua Setiawan" collapsing to "JS" monogram on scroll. Persistent surfaces on every route: Header/Nav, Footer, theme toggle, **skip‑link**, command palette, scroll‑progress affordance.

### Folder structure (`src/`)

```
src/
  app/
    layout.tsx              # <html>, fonts, Providers, persistent-canvas target, skip-link
    global-error.tsx        # root-layout failures (renders its own <html>/<body>)
    not-found.tsx · sitemap.ts · robots.ts · manifest.ts
    (main)/                 # route group: Nav, Footer, SmoothScroll, SceneCanvas
      layout.tsx · loading.tsx · error.tsx
      page.tsx              # Home
      about/ work/ writing/ playground/ contact/ uses/ now/ privacy/
      work/[slug]/          # + loading.tsx, opengraph-image.tsx
      writing/[slug]/       # + opengraph-image.tsx
      writing/rss.xml/route.ts
  actions/contact.ts        # "use server" submit
  features/                 # composition layer (client islands): hero, work, writing,
                            #   playground, contact, navigation, about
  components/
    ui/                     # shadcn primitives (token-restyled)
    motion/                 # reusable Framer wrappers (FadeIn, Reveal, Magnetic, Marquee)
    mdx/ seo/ common/       # MDX registry · JsonLd/metadata · Logo, ThemeToggle, Container, Section
  three/
    canvas/                 # scene-canvas.tsx (single persistent <Canvas>), portal, webgl-guard
    primitives/ materials/ shaders/ hooks/
  lib/
    motion/ smooth-scroll/ content/ validations/ query/ email/ seo/ fonts.ts utils.ts
  hooks/                    # use-reduced-motion (single source), use-media-query, ...
  stores/ui-store.ts        # Zustand — UI flags only
  providers/                # Theme → Query → Motion → Tooltip → SmoothScroll
  content/                  # SOURCE MDX: projects/ posts/ experiments/ pages/{uses,now}
  styles/ types/ config/ env.ts
velite.config.ts · components.json · tsconfig.json · eslint.config.mjs
.prettierrc · commitlint.config.ts · .husky/ · .env.example · package.json
```

**3D lives in `src/three/*`**; feature scenes never instantiate their own `<Canvas>` — they inject into the single persistent canvas via the tunnel‑rat portal. **Motion lives in `src/lib/motion/*`** (GSAP singleton, Framer variants, `useGSAP`) + `src/components/motion/*`.

### Content pipeline — **Velite**

`src/content/*.mdx → velite.config.ts (Zod schema + MDX pipeline) → .velite/ (typed JSON + compiled MDX) → src/lib/content/*.ts (typed accessors) → RSC page.tsx → features → <MDXContent>`. Frontmatter is Zod‑validated; **the build fails on invalid content**. Chosen over Contentlayer (unmaintained, breaks on Next 15+) and a hand‑rolled loader (reinvents caching/validation). Typed shapes: `Project`, `Post`, `Experiment`, and `uses`/`now` singletons (full field list in [`CONTENT-CHECKLIST.md`](./CONTENT-CHECKLIST.md)).

### State, data, forms, providers

- **Zustand (5 keys, persist 2):** `isMobileMenuOpen`, `isCommandPaletteOpen`, `motionPreference` (persist), `hasPlayedIntro`, `deviceTier`. Theme stays with `next-themes`; scroll/3D state stays in refs/R3F — never React‑global.
- **TanStack Query:** scoped to live‑data islands only (GitHub stats, now‑playing). All first‑paint content is RSC/SSG, never client‑fetched.
- **Contact:** Server Action + `useActionState` + one shared Zod schema. Client RHF for instant UX; server re‑validates (authoritative). Honeypot → time‑trap → rate‑limit → Resend. Typed `ActionState` result.
- **Provider tree (outer→inner):** `ThemeProvider` → `QueryProvider` → `MotionProvider` (`MotionConfig reducedMotion="user"`) → `TooltipProvider` → `SmoothScrollProvider` (Lenis) → `{children}` + `<Toaster/>`. The persistent `<SceneCanvas>` mounts in `(main)/layout.tsx` as a fixed layer, `dynamic(ssr:false)`.

---

## 4. Design system & tokens

**North star:** _Depth over decoration._ Every visual device must justify itself as depth (z‑legibility), light (focus), or signal (state). Depth in dark is engineered from four layered cues: **luminance step** (each surface +4–5% L) + **hairline lit‑edge border** + **soft layered shadow** + **glow** (interactive/focus only — never ambient on static cards).

### 4.1 Color tokens

**Dark (primary / default):**

| Token | Role | HEX |
|---|---|---|
| `--background` | base canvas | `#05070D` |
| `--surface-1` / `-2` / `-3` | nav / card / popover | `#0A0D16` / `#10131F` / `#171B2A` |
| `--foreground` / `-muted` / `-subtle` | text tiers | `#EAEDF5` / `#A4ABBD` / `#687085` |
| `--border` / `-strong` | hairline / input edge | `#222838` / `#2E3548` |
| `--accent` / `--accent-foreground` | primary action/link/focus | `#5E8BFF` / `#05070D` |
| `--accent-2` / `--accent-2-foreground` | code/data secondary | `#38E8C8` / `#04130F` |
| `--success` / `--warning` / `--error` | states | `#3DD68C` / `#F5B544` / `#FF6B6B` |
| `--ring` / `--glow` | focus ring / bloom | `#5E8BFF` / `#6E9BFF` |

Contrast (dark): `--foreground` on `--background` ≈ 16:1 (AAA); `--foreground-muted` ≈ 8.4:1 (AAA); accent link ≈ 7:1. **Accent buttons use dark text on the bright fill, never white‑on‑accent.** A CI contrast script re‑verifies every ratio against the actual painted background.

**Light (counterpart):** `--background #F7F8FB`, `--surface-1 #FFFFFF`, `--foreground #11141C`, `--accent #3D5BE0` (indigo, white text), `--accent-2 #0FA98C` (pine). Depth in light = soft cool‑tinted shadow + border (glow drops to near‑zero).

**Derived / signature:** `--accent-soft`/`--accent-2-soft` (12% α), `--overlay` (modal scrim), `--gradient-accent: linear-gradient(135deg, #5E8BFF, #38E8C8)` (the brand's signature sweep — hero accent line, CTA underglow, link underline). shadcn aliases map automatically: `--primary→--accent`, `--card→--surface-2`, `--popover→--surface-3`, `--muted→--foreground-muted`, `--destructive→--error`.

### 4.2 Typography (v1)

| Slot | Family | Loading | Use |
|---|---|---|---|
| Display | **Space Grotesk** (variable) | `next/font/google` | hero + section titles ≥ h2 |
| Body / UI | **Geist Sans** | `geist/font` | everything UI/body |
| Mono | **Geist Mono** | `geist/font` | code, eyebrows, technical metadata |

Preload Space Grotesk + Geist Sans (2 files); Geist Mono lazy. `display:swap` + automatic fallback metrics → CLS ≈ 0. Exposed as `--font-display` / `--font-sans` / `--font-mono`. _(Clash Display is a one‑line swap for Space Grotesk if its Fontshare license is confirmed.)_

**Fluid scale** (base 16px): `display-2xl clamp(3.5rem,8vw,7.5rem)` (hero, lh 0.95, -0.03em) · `display-xl clamp(2.75rem,5.5vw,5rem)` · `display-lg` · `h1 2.5rem` · `h2 2rem` · `h3 1.5rem` (Geist 600) · `body 1rem/1.65` · `body-lg 1.125rem` · `eyebrow 0.75rem` (Geist Mono, uppercase, 0.14em, the recurring "technical label" motif) · `code 0.875rem`. Prose measure 65–72ch; `tabular-nums` for all stats/dates. Max two type families visible per viewport.

### 4.3 Spacing, radius, elevation, grid

- **Spacing:** 4px base (`space-1`=4 … `space-48`=192). **Section rhythm `--section-y: clamp(6rem,12vw,12rem)`** — generous, cinematic.
- **Radius:** `xs 4 · sm 8 · md 12 (shadcn base) · lg 16 · xl 24 · 2xl 32 · full`.
- **Elevation (dark):** `--elev-1..4` (soft, large, low‑opacity shadow + inset top highlight); `--glow-accent` for hovered tiles / active CTAs; `--glow-focus` = 2px ring + 2px offset on `:focus-visible` only.
- **Grid:** container `1280` (content) / `1440` (wide) / `720` (prose); gutter `clamp(1.25rem,5vw,4rem)`; 12/8/4 columns (desktop/tablet/mobile); breakpoints `sm640 md768 lg1024 xl1280 2xl1536`; canonical frames mobile **390**, tablet **834**, desktop **1440**. **12‑col asymmetry** (7/5, 8/4) over perpetual 6/6; Work index is an art‑directed offset/bento grid; full‑bleed media escapes to `100vw` while text stays in `--container-max`.
- **Texture:** single tiled SVG fractal‑noise grain at 3–4% (`overlay`); blurred aurora gradient‑mesh blobs (8–14% α) as ambient glow; project thumbnails graded to one cool‑duotone world (16:10 tiles, 16:9 detail hero).
- **Icons (Lucide):** 1.5 stroke; sizes 16/20/24/32; `currentColor`; decorative `aria-hidden`, icon buttons `aria-label`; one icon = one meaning site‑wide.

---

## 5. Motion & 3D system

**Principles:** motion is hierarchy not garnish (one focal motion per viewport); believable weight (ease‑out/spring, exits ~0.7× enter); transform/opacity only (GPU‑compositable; blur capped 6px); **reduced‑motion is a designed branch, not a patch.**

**Division of labor (zero overlap):** _state/lifecycle → Framer · scroll progress / pin / scrub → GSAP+ScrollTrigger · smooth scroll + the single scroll value → Lenis (animates nothing) · WebGL pixels → R3F (reads scroll/pointer from a shared store, never its own listener)._ One rAF for the whole site: `gsap.ticker` drives `lenis.raf`; `lenis.on('scroll', ScrollTrigger.update)`. Both GSAP and Framer are kept — their domains are disjoint.

**Tokens:** durations `instant 80 · fast 160 · base 280 · moderate 420 · slow 640 · cinematic 900 · ambient 1200+`; eases `out (.22,1,.36,1)`, `out-expo (.16,1,.3,1)`, `inout (.83,0,.17,1)`, `back (.34,1.56,.64,1)` (registered identically in GSAP via `CustomEase` for cross‑engine parity); springs `snappy/soft/layout/magnetic`; staggers `tight 30 · base 60 · loose 90`.

**3D moments:**
- **Hero "Signal Field":** ~40k additive GPU‑instanced points (clamped on weak GPUs), positions from a curl‑noise vertex shader (zero per‑frame CPU, one draw call). Intro converges from chaos toward an abstract form (`uMorph` driven by a GSAP timeline), then ambient drift; pointer repulsion + subtle camera parallax; a hero ScrollTrigger writes `uScrollProgress` to dissolve the field as the next section enters. DPR `[1,1.75]`, `PerformanceMonitor` steps quality down, `frameloop="demand"`, IntersectionObserver pause, dispose on unmount.
- **Accent A** — Work cover hover/transition shader (one shared plane, pointer‑fine only), pairs with the View‑Transitions shared‑element morph into the detail hero.
- **Accent B** — ambient aurora gradient‑mesh behind the About portrait + footer (very low DPR, paused offscreen).
- **Static fallback** (one mechanism, three triggers — SSR/no‑WebGL/reduced‑motion): a high‑quality poster `next/image` (the scene's rest frame) that **is** the LCP element; the canvas fades in over it with zero layout shift.

**Scroll choreography (restraint spectrum):** showcase pages (Home, Work, Playground) get cinematic treatment; reading/utility pages (Writing, Uses, Now, Contact) are deliberately low‑motion (opacity reveals only). Work index's signature moment = **pinned horizontal scroll** with snap + progress indicator → **vertical list** under touch/reduced‑motion. Writing post = reading‑progress bar + sticky ToC.

**Page transitions:** an owned `RouteTransitionManager` module resolves the focus/scroll/ScrollTrigger sequence in one ordered spec — `nav intent → prefetch → curtain in → router commits → focus #main-content + announce (not delayed by animation) → lenis.scrollTo(0,immediate) → ScrollTrigger.refresh() after fonts → curtain out`; outgoing tree gets `inert` immediately. Shared‑element morphs via the View Transitions API where supported (falls back to crossfade). Playwright asserts focus lands on `#main-content`, scroll resets, and no orphaned ScrollTriggers — in **both** motion modes.

**Reduced‑motion contract (single global gate):** `shouldReduceMotion = OS pref ∨ in‑app toggle ∨ saveData`, held in a Zustand slice, mirrored to `<html data-motion>` via a pre‑paint inline script. Per engine: Framer `reducedMotion="user"`; GSAP scenes inside `gsap.matchMedia()` (reduced branch = static layout, no pin/scrub); **Lenis not instantiated** (native scroll); R3F renders the poster (canvas never mounts). A CSS safety‑net zeroes stray transitions. **Kept always:** focus rings, short orientation fades, reading‑progress, functional state feedback. An explicit **Pause‑motion** control is mandatory (WCAG 2.2.2) regardless of OS setting.

---

## 6. Performance budget (the contract)

Governing rule: **Three.js, R3F, Drei, GSAP, ScrollTrigger and heavy Framer features are never in any route's first‑load JS** — they load after paint / on viewport (Tier 2/3). `/contact`, `/uses`, `/now` ship essentially the shell only.

| Metric | Target (p75 mobile, field) | CI hard‑fail |
|---|---|---|
| LCP | ≤ 2.5 s _(stretch 1.8 s)_ | > 2.5 s |
| INP | ≤ 200 ms | > 200 ms |
| CLS | ≤ 0.02 | > 0.1 |
| Lighthouse Perf (content routes) | ≥ 90 | < 90 |
| Lighthouse Perf (WebGL Home) | ≥ 90 lab / field LCP ≤ 2.5 s | field LCP > 2.5 s |
| Shared baseline JS (every route) | ≤ 95 KB gz | > 95 KB |
| First‑load JS — Home/About/Contact/uses/now | ≤ 160 KB gz | > 160 KB |
| First‑load JS — Work / detail / Writing | ≤ 175 KB gz | > 175 KB |
| First‑load JS — Playground | ≤ 200 KB gz | > 200 KB |
| three / gsap / framer in any first‑load chunk | **0 bytes** | any |
| Total CSS (all routes) | ≤ 25 KB gz | > 25 KB |
| Preloaded font bytes | ≤ 45 KB, ≤ 2 files | > 2 files |
| LCP image (AVIF, over wire) | ≤ 120 KB | > 200 KB |

_(Note: the WebGL‑Home Lighthouse gate is set at the realistic **≥90 lab / field‑LCP‑green**, resolving the two briefs' conflicting numbers.)_

**Discipline:** `frameloop="demand"` (idle hero = ~0 GPU frames), DPR clamp, `useDeviceTier()` downgrade, dispose‑on‑unmount + cap concurrent WebGL contexts (a 20× nav‑loop QA asserts the canvas survives), `next/font` with metric fallbacks, AVIF/WebP + one `priority` LCP image per route + reserved aspect‑ratio boxes, `optimizePackageImports` for `lucide-react`/`drei`/`framer-motion`, no barrel files that drag heavy libs into the shared chunk (ESLint‑banned). **Enforcement:** `@next/bundle-analyzer` per‑route budget gate + chunk‑content assertion, `size-limit`, Lighthouse CI (throttled mobile), `web-vitals` attribution field RUM.

---

## 7. Accessibility contract (WCAG 2.2 AA)

**Governing principle:** all information and operability must be 100% reachable with the GPU dead, JS motion off, and a screen reader on. The immersive layer is additive only.

- **Semantics:** one labeled landmark of each type; exactly one `<h1>` per route (the hero display type _is_ the `<h1>` — huge scale is CSS only); no skipped levels; MDX gated to start at `<h2>`. **Skip‑to‑content** is the first focusable element (solid high‑contrast pill on focus, above the canvas).
- **Focus:** route change moves focus to `#main-content` + polite live‑region announce (not delayed by animation); overlays use Radix (trap + `inert` background + focus return); `:focus-visible` uses **`outline`** (survives forced‑colors) ≥2px + offset, ≥3:1 on every surface; **focus‑not‑obscured** by the sticky header (`scroll-margin-top` + `focusin` correction).
- **Keyboard:** DOM = visual order, no positive tabindex, no traps; Lenis must not swallow scroll keys; the **Work horizontal view has visible Prev/Next buttons** (2.5.7), focus‑scrolls‑into‑view, exits on Tab, and is a plain list under reduced‑motion; whole‑card link pattern (never `<a>` in `<a>`); ⌘K palette + visible trigger, full arrow/Enter/Esc + announced result count.
- **Motion/contrast/forms:** the §5 reduced‑motion gate; never color alone (links underlined, states get icon+text); body text ≥4.5:1 measured against the painted background (glow excluded); forms get associated labels, `autocomplete`/`inputmode`, `aria-invalid` + `aria-describedby`, an error summary focused on submit, and a polite live region with **persistent inline success** (no SR‑missable toast); honeypot is `aria-hidden` + `tabindex="-1"`.
- **WebGL:** decorative canvas is `aria-hidden`, `tabIndex=-1`, out of the SR tree; nothing reachable only via the canvas; ≥24px targets (2.5.8); no flashing >3/s (2.3.1); `prefers-reduced-transparency` swaps glass → solid.
- **Enforcement:** `eslint-plugin-jsx-a11y`, `jest-axe` per component, `@axe-core/playwright` per route (light/dark/reduced‑motion/forced‑colors) + scripted keyboard walkthroughs, Lighthouse a11y gate, contrast‑token script. Manual matrix at launch: VoiceOver+Safari, NVDA+Firefox, TalkBack+Chrome, 400% zoom, forced‑colors, no‑JS.

---

## 8. SEO architecture

One config module (`src/lib/seo/config.ts`) holds immutable site constants; `SITE_URL` reads from `NEXT_PUBLIC_SITE_URL` so preview deploys never pollute canonicals. **Non‑production (`VERCEL_ENV !== 'production'`) emits global `noindex, nofollow`** — the single most important indexing guard.

- **Metadata:** static root defaults with a `%s — Joshua Setiawan` template; per‑route `generateMetadata` for dynamic slugs (404 → `title: 'Not found'` + `index:false` + `notFound()`); per‑page canonicals; `max-image-preview: large`.
- **OG:** static committed cards for invariant routes; **build‑time co‑located `opengraph-image.tsx`** for projects/posts (brand‑black `#05070D` + radial glow + grid texture, eyebrow, clamped title, subtitle, avatar + domain footer, gradient accent bar). The `/api/og` route is cut.
- **Structured data (JSON‑LD, typed via `schema-dts`, factory functions, CI‑validated):** `Person` + `WebSite` in root; `ProfilePage` on About; `CreativeWork`/`SoftwareSourceCode` (by `project.kind`) on work detail; `BlogPosting` + `Blog` index on writing; `BreadcrumbList` on nested routes (parity with the visible breadcrumb).
- **Feeds/crawl:** `sitemap.ts` (real `lastModified`, indexable‑iff‑in‑sitemap, `images`), `robots.ts` (does **not** block `/_next/static`), single **`rss.xml`** (atom/json deferred), AI crawlers allowed via config flag.
- **Crawlability:** all primary content is RSC/SSR HTML (verified by a raw‑HTML CI assertion per route type); real `<a href>`; no content gated behind animation; metadata server‑generated.
- **i18n:** English only; `alternates.languages` centralized for later hreflang without restructuring (tuple‑keying deferred).

---

## 9. Tooling & quality gates

- **TS:** strict; `exactOptionalPropertyTypes` off; paths `@/*` → `src/*`, `#site/content` → `.velite`.
- **ESLint flat config:** `next/core-web-vitals` + `typescript-eslint` + `jsx-a11y` (strict) + `no-restricted-imports` (ban heavy barrels). **Prettier** + `prettier-plugin-tailwindcss`.
- **Husky:** `pre-commit` → `lint-staged` (eslint+prettier on staged) + `jest-axe`; `commit-msg` → **Commitlint** (Conventional Commits). `pre-push` → `typecheck` + a11y unit tests.
- **CI quality gate (must pass before any implementation phase is "done"):** `pnpm typecheck` · `pnpm lint` · `pnpm format:check` · `pnpm build` (`velite && next build`) · `vitest` · bundle‑budget + Lighthouse + axe e2e.

---

## 10. Phase roadmap (definition of done)

**Phase 2 — Foundation & Design System.** Repo bootstrapped (Next + TS strict + pnpm/Corepack/Node pinned); ESLint/Prettier/Husky/Commitlint green; Tailwind v4 + the **signed token set** as single source (light+dark pass the contrast script in CI); fonts loaded with tuned fallback metrics (hero `<h1>` CLS ≤0.02); Velite configured with all schemas compiling + one sample MDX per collection; provider tree + typed env; shadcn primitives restyled to tokens; reduced‑motion gate + theme toggle working before any animation. **DoD:** an empty themed shell renders on all routes, FOUC‑free, a11y lint + jest‑axe pass, shared baseline ≤95 KB gz.

**Phase 3 — Content routes & static spine (no advanced motion).** Every route renders real RSC HTML (raw‑HTML CI check); Work/Writing/Playground index+detail wired to Velite with graceful 0/1/2‑item empty states; contact form end‑to‑end + full a11y; complete SEO layer (metadata, canonicals, sitemap/robots/manifest, JSON‑LD, build‑time OG, rss.xml); Nav, Footer, mobile menu, command palette, 404/error/loading — all keyboard‑complete. **DoD:** keyboard + axe Playwright green on every route (light/dark/reduced/forced‑colors); **all motion still off**; LHCI ≥90; no Three/GSAP in first‑load.

**Phase 4 — Motion, 3D & immersive layer.** Motion tokens/variants/ease + Lenis↔GSAP single‑rAF bridge; the Hero Signal Field (poster‑first LCP, demand loop, tier downgrade, dispose); the owned route‑transition sequence (Playwright‑asserted); scroll choreography per the restraint spectrum; micro‑interactions (magnetic CTA, custom cursor pointer‑fine‑only, link underline, theme reveal). **DoD:** every animation has a verified reduced state; WebGL‑leak 20× nav QA passes; Home meets the agreed CWV gate; INP ≤200 ms with canvas active.

**Phase 5 — Hardening, real content & launch.** Real content ingested (≥3–4 full projects, bio, About, /uses, /now, ≥1 post); full CI gate suite merge‑blocking; field RUM live; OG cards validated; Rich Results zero‑error; cross‑browser/SR manual matrix + no‑JS baseline signed off; `/privacy` + consent final. **DoD:** production deploy; p75 mobile LCP ≤2.5 s / INP ≤200 ms / CLS ≤0.02 on first real traffic; Lighthouse a11y 100 on content routes.

---

## 11. Top risks & mitigations (carried into later phases)

1. **Home blows the JS/LCP budget when the hero hydrates** → poster is the asserted LCP; 3D hard‑gated behind `dynamic(ssr:false)` + IntersectionObserver + device tier; build poster‑only Home first, add canvas second.
2. **Lenis ↔ ScrollTrigger ↔ View‑Transitions ↔ focus on route change** → one owned `RouteTransitionManager` with an ordered spec + Playwright test.
3. **WebGL context leaks across navigations** → single persistent canvas + dispose hooks + 20× nav QA.
4. **Display‑font CLS** → Space Grotesk (Google fallback metrics) de‑risks it; hero CLS ≤0.02 gated in LHCI.
5. **Palette/contrast drift** → one signed token set + CI contrast script.
6. **Reduced‑motion half‑shipped across 4 engines** → the A11y QA matrix is a required pre‑merge gate.
7. **Content arrives late / launches near‑empty** → graceful 0/1/2‑item states; RSS/Blog‑schema conditional on count; the content checklist is the critical path (ship it to Joshua now).

---

## 12. Assumptions log (override any before Phase 2)

- Hosting = **Vercel**; production domain via `NEXT_PUBLIC_SITE_URL` (placeholder until confirmed).
- Email = **Resend** with a verified sending domain (swap = `lib/email/*` only).
- Brand accent = **azure `#5E8BFF` + teal `#38E8C8`** (swap via tokens if you have an existing brand color).
- Display font = **Space Grotesk** (Clash Display is a confirmed‑license upgrade).
- Dark is the hard default; light is fully supported.
- The command‑palette/search index is client‑side over content metadata (no search backend).
- AI answer‑engine crawlers (GPTBot/ClaudeBot/…) **allowed** (config flag to disable).
- Node 26 target (Node 22 LTS fallback documented).

---

## 13. Decisions worth your explicit confirmation

None of these block me from starting Phase 2 with the documented defaults, but they are the few cheap‑to‑change‑now / expensive‑to‑change‑later calls where your input is most valuable:

1. **Hosting Vercel + cookieless analytics** (decision 5/7) — OK, or different host?
2. **Email provider = Resend** (decision 8) — OK, or Formspree/SES/Postmark?
3. **Brand accent azure+teal** (decision 2) — keep, or do you have a personal brand color?
4. **Display font Space Grotesk** vs confirming the **Clash Display** license (decision 11).
5. **TanStack Query wired to a live GitHub‑stats island** (decision 9) — keep that real use, or drop it (and the dep) for v1?
6. **Production domain** for canonicals (or keep the env placeholder for now).

Everything else is locked. **Reply with any overrides, then say "proceed to Phase 2" and I'll scaffold the foundation.**

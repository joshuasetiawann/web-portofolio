# Implementation Roadmap

> Purpose: the build plan that turns the locked Phase 1 documentation into shipped product — sixteen sequenced milestones (Project setup → Deployment), each with Objective, Tasks, Deliverables, and Acceptance criteria, mapped onto the project's Phase 2–5 structure with an explicit dependency order.

This roadmap is the **delivery contract** for the build. It assumes Phase 1 is complete and frozen: all planning docs exist, tokens are canonical, budgets are gates, and no further product decisions are required to start. Implementation builds strictly from the signed foundation — see [PHASE-1-FOUNDATION](./PHASE-1-FOUNDATION.md) and the doc index in [phase-1-overview](./phase-1-overview.md).

**Scope reminder.** 18 routes plus utility routes (`/privacy`, `sitemap.ts`, `robots.ts`, `manifest.ts`, blog `rss.xml`, build-time OG images). Full per-page detail in [page-specifications](./page-specifications.md); rendering strategy in [information-architecture](./information-architecture.md); navigation in [navigation-structure](./navigation-structure.md).

---

## 1. How to read this roadmap

- **Milestone** = a vertical slice of capability with a hard exit gate. There are **16**, numbered M1–M16.
- **Phase** = the program-level grouping the locked context defines. The 16 milestones map onto **Phase 2 (foundation), Phase 3 (pages/content/responsive), Phase 4 (motion/3D), Phase 5 (a11y/SEO/perf/QA/launch)**.
- Each milestone lists **Objective · Tasks · Deliverables · Acceptance criteria**. Acceptance criteria are binary and verifiable; a milestone is "done" only when every box can be checked.
- **Canonical owners win.** Where a number appears here and in an owner doc, the owner doc is authoritative: tokens → [design-tokens](./design-tokens.md); budgets → [performance-strategy](./performance-strategy.md); routes → [page-specifications](./page-specifications.md); a11y → [accessibility-strategy](./accessibility-strategy.md); SEO → [seo-strategy](./seo-strategy.md).
- **Assumption:** labels mark professional defaults chosen here that Phase 1 did not pin down.

---

## 2. Phase → Milestone map

| Phase | Theme | Milestones | Exit definition of done |
|---|---|---|---|
| **Phase 2** | Foundation, design system, base components | **M1** Project setup · **M2** Design system foundation · **M3** Layout system · **M4** Base components | App boots; tokens live in CSS; layout shell + nav render; primitives pass Storybook + axe; zero `three/gsap/framer` in first-load. |
| **Phase 3** | Pages, content, responsive | **M5** Content model · **M6** Page UI implementation · **M7** Responsive refinement | All 18 routes render real content at all breakpoints; static + ISR data flows wired; no layout shift across `mobile390/tablet834/desktop1440`. |
| **Phase 4** | Motion & 3D | **M8** Motion system · **M9** Three.js layer · **M10** API/data layer | Lenis+GSAP+Framer integrated under one rAF; single persistent Canvas with poster fallbacks; GitHub dashboard live via server-fetch+ISR+React Query. |
| **Phase 5** | Quality & launch | **M11** Accessibility pass · **M12** SEO pass · **M13** Performance optimization · **M14** QA · **M15** Documentation · **M16** Deployment | All quality gates green (Lighthouse, axe, CWV, budgets); docs complete; production deploy verified. |

> The phase boundaries are gates, not walls: a11y/SEO/perf are *designed in* from M2 and only *certified* in Phase 5. Content is never gated behind animation (see [accessibility-strategy](./accessibility-strategy.md)); motion and 3D (Phase 4) layer onto pages that are already complete and functional after Phase 3.

---

## Phase 2 — Foundation, Design System, Base Components

### M1 — Project setup

**Objective.** Stand up a reproducible, strictly-typed Next.js App Router workspace with every tooling gate wired before a single feature line is written, so quality is enforced from commit one.

**Tasks.**
- Initialize Next.js (latest stable) App Router + TypeScript **strict** (`exactOptionalPropertyTypes` OFF) per [technical-architecture](./technical-architecture.md).
- Enable **pnpm via Corepack** on **Node 26** (Node 22 LTS fallback); pin with `.nvmrc`/`packageManager`.
- Scaffold the `src/` tree exactly as in [folder-structure](./folder-structure.md): `app, components, features, content, config, constants, hooks, lib, styles, types, utils, data, providers, animations, three, mdx` + `public` + `scripts`.
- Configure **TailwindCSS v4** (CSS-first `@theme`, **no `tailwind.config.js`**); add `clsx` + `tailwind-merge` + `class-variance-authority`.
- Wire tooling: **ESLint flat** (`next/core-web-vitals` + `jsx-a11y`), **Prettier** (+ `prettier-plugin-tailwindcss`), **Husky**, **lint-staged**, **Commitlint** (conventional commits).
- Add **@t3-oss/env-nextjs** typed env with Zod schema for `GITHUB_TOKEN`, `RESEND_API_KEY`, `VERCEL_ENV`, etc.
- Stand up CI skeleton (lint, typecheck, build) and the budget tooling stubs: `@next/bundle-analyzer`, `size-limit`, Lighthouse CI config.
- Create root providers shell (`providers/`): Theme/Query/Motion/Tooltip/SmoothScroll placeholders wired but inert.

**Deliverables.** Booting app with empty shell; passing `lint`+`typecheck`+`build`; pre-commit hooks active; typed env module; CI green on an empty PR.

**Acceptance criteria.**
- [ ] `pnpm install && pnpm build` succeeds on a clean checkout under Node 26 (and 22 LTS).
- [ ] `pnpm lint` and `pnpm typecheck` pass with zero warnings under strict TS.
- [ ] A commit that violates Commitlint or lint-staged is **rejected** locally.
- [ ] `src/` matches [folder-structure](./folder-structure.md) exactly; no `tailwind.config.js` exists.
- [ ] Missing/invalid env vars fail the build with a typed error (no silent `undefined`).

---

### M2 — Design system foundation

**Objective.** Encode the canonical design tokens as the single source of visual truth in CSS, so every component consumes variables — never hard-coded hexes or magic numbers.

**Tasks.**
- Author `styles/` global CSS with **`@theme`** exposing all canonical tokens from [design-tokens](./design-tokens.md): color (dark default + light), gradients, glow, elevation, blur, radius, z-index, spacing scale (`space-1`…`space-48`), motion durations/eases/springs/staggers.
- Implement **dark-default theming** via `next-themes` (`class`/`data` strategy) with a `data-motion` hook for the reduced-motion gate; light is a first-class counterpart.
- Define fluid **typography** per [typography-system](./typography-system.md): Display = Space Grotesk, Body/UI = Geist Sans, Mono = Geist Mono via `next/font/google`; preload ≤2 faces (display + sans), mono lazy; the full clamp scale (`display-2xl`…`code`).
- Add token-driven utilities: container widths (content 1280 / wide 1440 / prose 720 / gutter clamp), breakpoints (sm640…2xl1536), `tabular-nums`, measure (65–72ch).
- Implement **Shiki dual-theme** code colors and **chart**/**contribution heat** palettes as CSS vars for later use.
- Write `scripts/contrast-check` (token contrast vs painted background, glow excluded) and wire it into CI.

**Deliverables.** Global stylesheet with all tokens; theme provider live; font loading optimized; contrast-check script passing; a `/styleguide` internal demo route (dev-only) rendering swatches + type scale.

**Acceptance criteria.**
- [ ] Every token in [design-tokens](./design-tokens.md) exists as a CSS variable with the **verbatim** canonical value; CI greps for stray hex literals in components and fails on any.
- [ ] Toggling theme switches dark↔light with **no flash** (FOUC) and persists across reloads.
- [ ] `data-motion` flips on OS `prefers-reduced-motion`, the in-app toggle, or `saveData`.
- [ ] Exactly ≤2 fonts preload; total preloaded font weight ≤45KB; mono is lazy.
- [ ] `scripts/contrast-check` passes for all foreground/background token pairs at WCAG AA.

---

### M3 — Layout system

**Objective.** Build the persistent app shell — root layout, landmarks, navigation, footer, and the single-Canvas/tunnel-rat scaffolding — so every route inherits a consistent, accessible frame.

**Tasks.**
- Build root `app/layout.tsx`: `<html data-theme data-motion>`, one labeled landmark of each type, **skip-to-content** as first focusable, `#main-content` target, polite route-change live region.
- Implement the **sticky header**: PRIMARY nav (Projects · About · Blog · Contact) + theme toggle + ⌘K trigger; the **"Explore" mega-menu** (Philosophy, Research, Open Source, Experience, Timeline, Gallery, Certificates, Achievements, GitHub); wordmark→**JS monogram** collapse on scroll. Spec in [navigation-structure](./navigation-structure.md).
- Build the **footer** carrying the full sitemap.
- Scaffold the **command palette** (cmdk) shell wired to nav destinations (interactions land in M8).
- Establish the **single persistent `<Canvas>` + tunnel-rat portal** mount point (dynamic, `ssr:false`, inert until M9) and the global `loading.tsx` + per-segment skeleton convention.
- Add `sonner` toaster mount and Radix overlay primitives (focus trap + inert + return-to-trigger) as shared layout concerns.

**Deliverables.** Rendering shell on every route; working primary nav + mega-menu + footer; ⌘K opens an empty palette; Canvas mount present but inert; global + segment loading scaffolds.

**Acceptance criteria.**
- [ ] Keyboard-only user can reach skip link → `#main-content`; focus is **not obscured** by the sticky header (WCAG 2.4.11).
- [ ] Exactly **one** landmark of each type; nav, main, footer correctly labeled.
- [ ] Wordmark collapses to monogram on scroll with no layout shift; CLS contribution = 0.
- [ ] Mega-menu and footer expose **all 16 destinations**; nothing is unreachable.
- [ ] No `three`/`gsap`/`framer` code ships in the layout's first-load chunk.

---

### M4 — Base components

**Objective.** Deliver the reusable primitive + motion-wrapper layer (shadcn/ui-based) that all pages compose from, fully typed, variant-driven, and accessibility-verified in isolation.

**Tasks.**
- Install/adapt **shadcn/ui** primitives into `components/ui`; theme them to tokens (Button, Card, Input, Dialog, Tabs, Badge, Tooltip, Sheet, etc.) per [component-inventory](./component-inventory.md).
- Build `components/common` composites: section wrapper, eyebrow label, stat/metric, tag chip, link arrow, glass surface, prose container.
- Build `components/motion` wrappers using **Framer via `LazyMotion` + `m.*`** (reveal, stagger, magnetic) — **structurally inert/SSR-safe** so they no-op cleanly until M8 wires real variants.
- Define every variant with **CVA**; standardize props, `asChild`, and `cn()` merge usage.
- Stand up **Storybook** (or equivalent isolation harness) + **jest-axe** per primitive; cover states (hover/focus/disabled/error) and light/dark.
- Implement form atoms wired for **React Hook Form + Zod** (labels, `aria-invalid`, `aria-describedby`) — the contact form composition is M6.

**Deliverables.** Tokenized primitive + composite + motion-wrapper library; Storybook with stories per component; jest-axe green; CVA variant tables documented in [component-inventory](./component-inventory.md).

**Acceptance criteria.**
- [ ] Every primitive renders correctly in **light + dark** and meets **≥24px** target size (2.5.8) where interactive.
- [ ] `:focus-visible` uses a ≥2px **outline + offset** that survives forced-colors.
- [ ] jest-axe reports **zero** violations for every component story.
- [ ] All variants are CVA-driven; no inline style hexes; props are strictly typed.
- [ ] Motion wrappers render content **visible by default** (JS-off safe) and no-op under `data-motion` reduced.

---

## Phase 3 — Pages, Content, Responsive

### M5 — Content model

**Objective.** Implement the content + data layer — Velite MDX collections, typed static data, and accessors — so pages consume validated, typed content instead of inline strings.

**Tasks.**
- Configure **Velite** (NOT Contentlayer) with collections per the locked content model: `projects`, `blog`, `research`, plus the `philosophy` singleton.
- Define Zod-validated schemas for each MDX collection (e.g. `projects`: slug, title, summary, role, year, status, kind, tags[], stack[], featured, order, cover, gallery[], links{}, metrics[], color?, body, toc, seo).
- Author **typed static data** in `data/`: `experience`, `timeline`, `certificates`, `achievements`, `gallery`, `open-source` curated highlights — with domain types in `types/`.
- Build the **MDX component registry** (`mdx/`) and the Shiki dual-theme code renderer using M2's syntax tokens.
- Implement content accessors in `lib/` (list/get/filter, reading-time, ToC) and image pipeline (`sharp` + `blurDataURL`).
- Add seed/sample content for every collection so all routes can render end-to-end; flag real-content gaps against [CONTENT-CHECKLIST](./CONTENT-CHECKLIST.md).

**Deliverables.** Velite build emitting typed content; `data/` typed datasets; MDX registry + code renderer; content accessor library; sample content covering all collections.

**Acceptance criteria.**
- [ ] `pnpm build` runs Velite and **fails** on any schema-invalid MDX (bad frontmatter rejected).
- [ ] Every collection and static dataset is consumable via a typed accessor with no `any`.
- [ ] MDX renders with correct Shiki dual-theme syntax colors in light + dark.
- [ ] Reading-time and ToC derive automatically for blog/research/long-form.
- [ ] Each of the 18 routes has enough sample content to render fully.

---

### M6 — Page UI implementation

**Objective.** Build all 18 routes plus utility routes as **static, server-rendered, motion-free** pages — complete information, real content, correct states — establishing the content baseline that motion/3D later enhances.

**Tasks.**
- Implement every route from [page-specifications](./page-specifications.md) and [wireframes](./wireframes.md), composing M4 primitives over M5 content:
  - Landing `/` (static poster as hero placeholder), About `/about`, Philosophy `/philosophy`, Projects `/projects` + `/projects/[slug]`, Research `/research` + `/research/[slug]`, Open Source `/open-source`, Blog `/blog` + `/blog/[slug]`, Experience `/experience`, Timeline `/timeline`, Gallery `/gallery`, Certificates `/certificates`, Achievements `/achievements`, GitHub `/github` (static shell, data in M10), Contact `/contact`.
- Build `not-found.tsx` (branded 404) and `loading.tsx` global + per-route segment skeletons.
- Implement the **contact Server Action** with the **one shared Zod schema** (RHF + Zod + Resend), inline success, error summary, polite live region; add `/privacy`.
- Wire **empty/loading/error** states and pagination/filter UI (Projects/Blog) as accessible static controls.
- Set rendering strategy per [information-architecture](./information-architecture.md): SSG/RSC for content routes, `generateStaticParams` for dynamic slugs.

**Deliverables.** All 18 routes + utility routes rendering real content statically; working contact form with email delivery; 404 + loading skeletons; filter/pagination controls.

**Acceptance criteria.**
- [ ] Every route renders complete, correct content **server-side** with JS disabled.
- [ ] Each route has exactly **one `<h1>`** (the hero display type), correct heading order.
- [ ] Contact form validates with the shared Zod schema, sends via Resend, and shows inline success + accessible errors.
- [ ] Dynamic routes pre-render via `generateStaticParams`; unknown slugs hit `not-found`.
- [ ] No `three`/`gsap`/`framer` runtime is required for any page to be usable.

---

### M7 — Responsive refinement

**Objective.** Guarantee every route is correct, comfortable, and shift-free across the canonical frames and full breakpoint range.

**Tasks.**
- Audit and tune all routes against [responsive-strategy](./responsive-strategy.md) at **mobile390 / tablet834 / desktop1440** and across sm640→2xl1536.
- Apply the 12/8/4 grid, container widths, fluid gutters, and section rhythm (`--section-y`) consistently; enforce measure 65–72ch on prose.
- Convert nav to mobile pattern (sheet/drawer) with the mega-menu collapsed; verify ⌘K + footer parity on touch.
- Reserve space for all media (intrinsic `width/height` + `blurDataURL`) to hold **CLS ≤0.02**; verify horizontal/carousel views expose visible Prev/Next (2.5.7).
- Validate touch targets ≥24px and tap ergonomics; verify safe-area/notch handling.

**Deliverables.** All routes verified across breakpoints; mobile nav pattern; CLS-safe media; documented before/after of any layout fixes.

**Acceptance criteria.**
- [ ] No horizontal overflow or clipped content at any width 320px→1536px+.
- [ ] **CLS ≤0.02** on every route at all three canonical frames.
- [ ] Mobile nav exposes all 16 destinations; ⌘K and footer reachable on touch.
- [ ] Prose holds 65–72ch; section rhythm and gutters match tokens.
- [ ] Carousels/horizontal views have visible Prev/Next and a static reduced-motion layout.

---

## Phase 4 — Motion & 3D

### M8 — Motion system

**Objective.** Integrate the motion stack under the locked division of labor and a **single rAF**, enhancing the already-complete pages without ever gating content behind animation.

**Tasks.**
- Implement the **one rAF** wiring per [animation-strategy](./animation-strategy.md): `gsap.ticker` drives `lenis.raf`; `lenis.on('scroll')` → `ScrollTrigger.update`. **Lenis is the sole scroll authority** (animates nothing).
- **Framer** (LazyMotion + `m.*`): enter/exit, layout/`layoutId`, gestures, the **page-transition curtain**, `reducedMotion="user"`.
- **GSAP + ScrollTrigger**: scroll progress, pin, scrub, multi-step timelines, horizontal scroll — all inside **`gsap.matchMedia`** (reduced = static, no pin/scrub).
- Real motion variants for M4 wrappers (reveal travel xs8…hero80, blur 6→0, card lift −6px, magnetic max 18px) and stagger tokens.
- Wire **microinteractions**: magnetic CTAs, custom cursor, hover/link states, ⌘K palette open/close.
- Implement the **single reduced-motion gate**: Zustand slice → `data-motion`; under reduced, **Lenis is NOT instantiated** (native scroll) and an explicit **Pause-motion control** exists (WCAG 2.2.2).

**Deliverables.** Lenis+GSAP+Framer integrated under one rAF; page-transition curtain; scroll-driven sequences; live microinteractions; functioning reduced-motion + pause control.

**Acceptance criteria.**
- [ ] Exactly **one** rAF loop drives scroll + GSAP; no competing tickers, no scroll-jacking.
- [ ] With `prefers-reduced-motion` or the toggle: no pin/scrub, Lenis not instantiated, animations static — and **all content remains fully present**.
- [ ] A visible **Pause-motion** control stops non-essential motion (2.2.2).
- [ ] Page transitions never delay or hide primary content; back/forward restores scroll.
- [ ] `three`/`gsap`/`framer` remain **out of every first-load chunk** (loaded on demand).

---

### M9 — Three.js layer

**Objective.** Build the WebGL layer through the single persistent Canvas, with the "Signal Field" hero and accent scenes — performant, disposable, and never the LCP.

**Tasks.**
- Activate the **single persistent `<Canvas>`** (dynamic, `ssr:false`, `frameloop="demand"`, DPR clamp `[1,1.75]`) reading scroll/pointer from a shared store; render scenes via the tunnel-rat portal. Spec in [three-strategy](./three-strategy.md).
- Build the **"Signal Field"** hero: GPU instanced particles via curl-noise vertex shader; glow via **emissive materials + sprites** (`@react-three/postprocessing` **deferred** for v1).
- Implement accent moments: project-cover hover shader, About aurora gradient-mesh, optional GitHub contribution depth/constellation, tech-graph.
- Add **PerformanceMonitor** downgrade, **IntersectionObserver** pause, and full **dispose on unmount**.
- Implement fallbacks: device-tier / no-WebGL / reduced-motion → **static poster** that **IS the LCP element**; never ship `three` on routes that don't use it.

**Deliverables.** Live Signal Field hero; accent scenes wired to triggers; static posters per scene; performance governors active; clean dispose.

**Acceptance criteria.**
- [ ] One Canvas instance across the app; scenes mount/unmount via portal with no leaks (verified dispose).
- [ ] No-WebGL / low-tier / reduced-motion render the **static poster**, and the poster is the **LCP** (never a WebGL frame).
- [ ] Canvas pauses off-screen (IntersectionObserver) and downgrades under PerformanceMonitor.
- [ ] Decorative Canvas is `aria-hidden` + `tabindex=-1`; no keyboard trap.
- [ ] Routes without 3D ship **zero** `three` bytes.

---

### M10 — API / data layer

**Objective.** Deliver live data — primarily the GitHub Dashboard and Open Source repo data — using server-fetch + ISR for first paint and TanStack Query for client refresh.

**Tasks.**
- Implement GitHub API access in `lib/`: profile stats, contribution calendar, top repos, language breakdown — **server fetch + ISR (`revalidate ≈3600s`)** with `GITHUB_TOKEN`; typed responses + Zod parsing.
- Wire **TanStack Query** scoped to **live data only** (its real job): SSR/ISR hydration for first paint, client React Query for refresh/interaction on `/github` and `/open-source`.
- Render charts with the **chart palette** and the **contribution heat ramp** from [design-tokens](./design-tokens.md); optional contribution depth scene from M9.
- Handle rate-limit, error, and empty states gracefully (cached fallback, skeletons, retry/backoff); never block the route on a failed fetch.
- Add field RUM via **web-vitals** attribution and **Vercel cookieless** analytics hooks.

**Deliverables.** Live GitHub Dashboard + Open Source data; ISR + React Query hydration; resilient error/empty/rate-limit handling; charts on the canonical palette; web-vitals reporting.

**Acceptance criteria.**
- [ ] `/github` first paint is server-rendered from ISR cache (no client-fetch waterfall for LCP).
- [ ] Client refresh updates stats without a full reload; stale data revalidates per the window.
- [ ] GitHub rate-limit / fetch failure degrades to cached or skeleton state — route never errors out.
- [ ] All live responses are **Zod-validated**; no `any` crosses the boundary.
- [ ] TanStack Query appears **only** in live-data islands, not in static content first-load.

---

## Phase 5 — Quality & Launch

### M11 — Accessibility pass

**Objective.** Certify the full **WCAG 2.2 AA** contract across themes and motion/contrast modes, with automated + manual evidence.

**Tasks.**
- Run the enforcement suite from [accessibility-strategy](./accessibility-strategy.md): `jsx-a11y`, `jest-axe`, **axe-playwright** across **light / dark / reduced-motion / forced-colors**.
- Manual audits: keyboard-only traversal of every route, screen-reader pass (landmarks, headings, live regions, route-change announcements), focus management on Radix overlays (trap + inert + return).
- Verify forms: associated labels, `autocomplete`, `aria-invalid`, `aria-describedby`, focused error summary on submit, polite live region, persistent inline success.
- Verify non-color signaling, ≥24px targets, focus-not-obscured (2.4.11), carousel Prev/Next (2.5.7), and decorative-canvas hiding.
- Run the **contrast-token script** against painted backgrounds (glow excluded) and Lighthouse a11y.

**Deliverables.** Passing automated a11y suite across all four modes; manual audit report with fixes applied; Lighthouse a11y scores per route.

**Acceptance criteria.**
- [ ] axe/jest-axe/axe-playwright report **zero** violations in light, dark, reduced-motion, and forced-colors.
- [ ] Lighthouse Accessibility **≥95** every route (target **100** on content routes).
- [ ] Full keyboard operability with no traps; overlays return focus to trigger.
- [ ] Every form error is announced, summarized, focusable, and individually associated.
- [ ] All token contrast pairs pass AA vs the painted background.

---

### M12 — SEO pass

**Objective.** Implement and verify the complete SEO + structured-data architecture so every route is discoverable, share-ready, and correctly typed.

**Tasks.**
- Implement the SEO config module + `metadataBase`; title template **"%s — Joshua Setiawan"**; per-route canonicals; the **non-prod `noindex` guard** (`VERCEL_ENV !== production`).
- Add build-time co-located `opengraph-image` for projects/blog/research; verify ≤120KB AVIF where applicable.
- Implement **JSON-LD** (typed via `schema-dts`): Person + WebSite (root), ProfilePage (About), CreativeWork/SoftwareSourceCode (projects), BlogPosting (blog), ScholarlyArticle (research), BreadcrumbList (nested).
- Ship `sitemap.ts`, `robots.ts`, `manifest.ts`, single blog `rss.xml` (via `feed`); AI-crawler allow flag.
- Assert all primary content is **RSC/SSG** (raw-HTML CI assertion); English-only, hreflang-ready. Owner: [seo-strategy](./seo-strategy.md).

**Deliverables.** SEO config + metadata on every route; OG images; valid JSON-LD per type; sitemap/robots/manifest/RSS; CI raw-HTML + noindex assertions.

**Acceptance criteria.**
- [ ] Every route emits correct canonical, title, description, and OG/Twitter tags.
- [ ] JSON-LD validates (Rich Results) for each schema type on its routes.
- [ ] Non-production deploys are **globally `noindex`**; production is indexable.
- [ ] `sitemap.ts`/`robots.ts`/`manifest.ts`/`rss.xml` are present, valid, and complete.
- [ ] CI confirms primary content is present in **raw server HTML** (no client-only content).

---

### M13 — Performance optimization

**Objective.** Bring every route within the locked CWV and bundle budgets and prove it with automated enforcement.

**Tasks.**
- Enforce budgets from [performance-strategy](./performance-strategy.md): shared baseline JS **≤95KB gz**; per-route first-load **≤160KB** (light), **≤175KB** (Projects/Blog/Research/detail), **≤200KB** (GitHub/3D); CSS **≤25KB gz**; LCP image **≤120KB AVIF**; ≤2 fonts (≤45KB).
- Run `@next/bundle-analyzer` per-route budget + **chunk-content assertion** (ZERO `three`/`gsap`/`framer` in any first-load chunk); wire **size-limit** and **Lighthouse CI** (throttled mobile) into the gate.
- Optimize images (`sharp`, AVIF, sizing, priority/LCP, lazy below fold); audit code-splitting and dynamic imports for motion/3D/charts.
- Tune CWV: **LCP ≤2.5s, INP ≤200ms, CLS ≤0.02** (p75 mobile); validate with web-vitals field RUM.

**Deliverables.** All routes within budget; passing size-limit + bundle-analyzer assertions; Lighthouse CI green; CWV field data within targets.

**Acceptance criteria.**
- [ ] Lighthouse (throttled mobile): Performance **≥90**, Best Practices **≥95**, SEO **≥95**, A11y **≥95**.
- [ ] p75 mobile **LCP ≤2.5s · INP ≤200ms · CLS ≤0.02**.
- [ ] Every route meets its first-load budget; **chunk-content assertion** proves no `three`/`gsap`/`framer` in first-load.
- [ ] Shared baseline ≤95KB gz; CSS ≤25KB gz; ≤2 preloaded fonts ≤45KB.
- [ ] LCP image ≤120KB AVIF on every route.

---

### M14 — QA

**Objective.** Final cross-functional verification — functional, visual, cross-browser/device, and regression — before launch.

**Tasks.**
- Execute end-to-end functional QA across all 18 routes + utility routes: navigation, ⌘K palette, mega-menu, forms (contact happy/sad paths + email receipt), filters/pagination, dynamic slugs, 404.
- Cross-browser/device matrix (**Assumption:** latest Chrome, Firefox, Safari incl. iOS Safari, Edge; mobile390/tablet834/desktop1440 + real device spot-checks).
- Visual regression / theme QA (light+dark+forced-colors), motion-on vs reduced-motion parity, 3D fallback paths.
- Verify analytics + web-vitals events fire; verify ISR revalidation and GitHub data refresh; test error/empty/rate-limit states.
- Triage and fix all P0/P1 defects; log P2/P3 with owners.

**Deliverables.** Executed test matrix with results; visual-regression baseline; defect log with P0/P1 cleared; sign-off checklist.

**Acceptance criteria.**
- [ ] All P0/P1 defects resolved; P2/P3 documented and triaged.
- [ ] Functional flows pass on the full browser/device matrix.
- [ ] Theme, reduced-motion, and 3D-fallback variants all render correctly.
- [ ] Contact email delivery confirmed end-to-end via Resend.
- [ ] ISR + live data verified refreshing within configured windows.

---

### M15 — Documentation

**Objective.** Produce the engineering documentation needed to run, extend, and add content to the site after launch.

**Tasks.**
- Write `README` (local setup, scripts, Node/pnpm, env vars), an **`.env.example`**, and a content-authoring guide (adding projects/blog/research MDX + static data) keyed to [CONTENT-CHECKLIST](./CONTENT-CHECKLIST.md).
- Document the architecture map (link [technical-architecture](./technical-architecture.md), [folder-structure](./folder-structure.md), [component-inventory](./component-inventory.md)) and the motion/3D integration notes.
- Document deployment, env management, ISR/revalidation, and the quality-gate/CI workflow; capture runbooks for token-rotation and GitHub-API issues.
- Reconcile any build-time deviations back into the relevant Phase 1 docs so the planning set stays the source of truth.

**Deliverables.** README + `.env.example` + content-authoring guide; architecture & ops notes; updated/reconciled Phase 1 docs.

**Acceptance criteria.**
- [ ] A new contributor can clone, configure env, and run the app **using only the README**.
- [ ] Adding a new project/blog/research entry is documented step-by-step and reproducible.
- [ ] Env vars are fully enumerated in `.env.example` with descriptions.
- [ ] CI/deploy/revalidation workflow and key runbooks are documented.
- [ ] Any divergence from Phase 1 docs is reconciled or explicitly noted.

---

### M16 — Deployment

**Objective.** Ship to production on Vercel with monitoring live and the launch gate fully verified.

**Tasks.**
- Configure the **Vercel** project: production + preview envs, secrets (`GITHUB_TOKEN`, `RESEND_API_KEY`, etc.), build settings, ISR, and Vercel cookieless analytics.
- Validate the `VERCEL_ENV` noindex guard (preview noindex, production indexable) and custom domain + HTTPS/redirects.
- Run the pre-launch gate: full CI (lint/typecheck/build), Lighthouse CI, size-limit/bundle assertions, axe-playwright — all green on the production build.
- Promote to production; submit sitemap; verify OG/JSON-LD via live validators; confirm web-vitals field data flowing.
- Establish post-launch monitoring (field CWV, error tracking) and a rollback plan.

**Deliverables.** Live production site on the custom domain; preview deploys on PRs; monitoring + analytics active; verified launch checklist; rollback procedure.

**Acceptance criteria.**
- [ ] Production deploy succeeds with all CI + quality gates **green**.
- [ ] Preview deploys are `noindex`; production is indexed and sitemap-submitted.
- [ ] Live OG images + JSON-LD validate against external validators.
- [ ] Field **web-vitals** and analytics report from production within targets.
- [ ] A documented, tested **rollback** path exists.

---

## 3. Dependency order & sequencing

**Critical path (must be strictly ordered):**

```
M1 setup → M2 tokens → M3 layout → M4 primitives
        → M5 content model → M6 page UI → M7 responsive
        → (M8 motion ∥ M9 three.js ∥ M10 data)
        → M11 a11y → M12 SEO → M13 perf → M14 QA → M15 docs → M16 deploy
```

**Hard dependencies.**

| Milestone | Requires | Why |
|---|---|---|
| M2 | M1 | Tokens need the Tailwind v4 `@theme` + build pipeline. |
| M3 | M2 | Layout/nav consume tokens + theme/motion providers. |
| M4 | M2, M3 | Primitives are tokenized and live inside the shell. |
| M5 | M1 | Velite + typed data need the toolchain and `src/` tree. |
| M6 | M4, M5 | Pages compose primitives over typed content. |
| M7 | M6 | You can only refine layouts that exist. |
| M8 | M6 (M7 ideally) | Motion **enhances** complete, content-finished pages. |
| M9 | M3, M8 | 3D mounts in the persistent Canvas; shares the scroll/pointer store + rAF. |
| M10 | M5, M6 | Live data hydrates the GitHub/OSS routes built in M6. |
| M11–M13 | M6 (M8–M10 for full coverage) | Certify the real, complete app — not a partial one. |
| M14 | M11–M13 | QA verifies the quality-gated build. |
| M15 | M14 | Docs reflect the as-built, QA'd system. |
| M16 | M11–M15 | Launch only after all gates pass. |

**Parallelization opportunities.**

- **M8 / M9 / M10** can run in parallel after M6/M7: motion, 3D, and live-data are independent surfaces sharing only the M3 Canvas mount and M8 scroll store (so M9 nominally waits on M8's store/rAF, but scene/shader work can start immediately against a stub store).
- Within **Phase 5**, M11 (a11y) and M12 (SEO) are largely independent and can run concurrently; **M13 (perf)** should follow once feature code is frozen, since bundle/CWV numbers only stabilize after motion/3D/data land.
- **M15 (docs)** can be drafted continuously from M1 and finalized after M14.

**Quality is continuous, not deferred.** a11y, SEO, and performance are *designed in* from M2–M4 (tokens, focus, semantics, zero heavy libs in first-load) and *certified* in M11–M13. Treat the Phase 5 milestones as audits that should find little, not as the first time these concerns appear.

**Cross-cutting invariants enforced every milestone.**

- Content is **visible by default** and **JS-off safe**; never gated behind animation or WebGL.
- **Zero** `three`/`gsap`/`framer` in any first-load chunk (chunk-content assertion in CI).
- Tokens are consumed as CSS variables — **no invented hexes** anywhere.
- The reduced-motion gate and the single rAF / single Canvas authority hold from the moment each is introduced.

---

## 4. Related documents

- Foundation & index: [PHASE-1-FOUNDATION](./PHASE-1-FOUNDATION.md) · [phase-1-overview](./phase-1-overview.md)
- Product & audience: [product-strategy](./product-strategy.md) · [target-audience](./target-audience.md) · [user-journey](./user-journey.md) · [ux-flow](./ux-flow.md)
- IA & pages: [information-architecture](./information-architecture.md) · [navigation-structure](./navigation-structure.md) · [page-specifications](./page-specifications.md) · [wireframes](./wireframes.md)
- Design system: [design-tokens](./design-tokens.md) · [design-system](./design-system.md) · [typography-system](./typography-system.md) · [brand-identity](./brand-identity.md) · [creative-direction](./creative-direction.md)
- Components: [component-inventory](./component-inventory.md)
- Motion & 3D: [animation-strategy](./animation-strategy.md) · [three-strategy](./three-strategy.md)
- Engineering: [technical-architecture](./technical-architecture.md) · [folder-structure](./folder-structure.md)
- Quality: [performance-strategy](./performance-strategy.md) · [accessibility-strategy](./accessibility-strategy.md) · [seo-strategy](./seo-strategy.md) · [responsive-strategy](./responsive-strategy.md)
- Content intake: [CONTENT-CHECKLIST](./CONTENT-CHECKLIST.md)

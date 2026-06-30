# Phase 1 — Overview & Documentation Index

> The master index for Phase 1 (Product Discovery, UX Strategy, Creative Direction & Technical Architecture). Phase 1 is **planning only — no application code was written.** Everything here designs and specifies the build so Phase 2 (foundation) and beyond can implement from a single, consistent source of truth.

---

## Scope

A premium, production-ready, **Awwwards-quality personal portfolio** for **Joshua Setiawan** — a hybrid _Creative Developer + Software Engineer_. Aesthetic: **"Immersive Dark + 3D"** (dark-first, cinematic depth, restrained gradients, glass surfaces, sharp typography, lightweight-but-immersive motion, carefully placed WebGL), with a full light/dark toggle.

**18 pages / states:** Landing · About · Engineering Philosophy · Projects · Project Details · Research · Open Source · Blog · Blog Details · Experience · Timeline · Gallery · Certificates · Achievements · GitHub Dashboard · Contact · 404 · Loading.

**Stack:** Next.js App Router · TypeScript (strict) · Tailwind v4 · shadcn/ui · Framer Motion · GSAP + ScrollTrigger · Lenis · Three.js + R3F + Drei · TanStack Query · Zustand · React Hook Form · Zod · MDX (Velite) · Lucide · next-themes. Tooling: ESLint · Prettier · Husky · Commitlint. pnpm via Corepack (Node 26). Host: Vercel.

---

## How to read these docs

Start here, then read in this order depending on your goal:

- **Understand the product** → product-strategy → target-audience → user-journey
- **Understand the structure** → information-architecture → navigation-structure → page-specifications → wireframes
- **Build the visual system** → creative-direction → brand-identity → design-system → typography-system → design-tokens
- **Build components & motion** → component-inventory → animation-strategy → interaction-plan → scroll-strategy → three-strategy
- **Engineer it** → technical-architecture → folder-structure → dependency-plan → performance-strategy → accessibility-strategy → seo-strategy
- **Sequence the work** → implementation-roadmap → bottleneck-analysis

---

## Document index (29 docs)

### 1 · Strategy & Discovery
| Doc | What it covers |
|---|---|
| [phase-1-overview](./phase-1-overview.md) | This file — scope, index, acceptance criteria |
| [product-strategy](./product-strategy.md) | Goals, conversion goals, success metrics, positioning, visitor takeaway |
| [target-audience](./target-audience.md) | The 9 audiences: needs, objections, key pages, conversion action |

### 2 · UX & Information Architecture
| Doc | What it covers |
|---|---|
| [user-journey](./user-journey.md) | First 5s, first scroll, recruiter/developer/client/returning journeys, trust + conversion points |
| [information-architecture](./information-architecture.md) | Sitemap, routes/URLs, content model, taxonomies, GitHub data model |
| [ux-flow](./ux-flow.md) | Cross-page flows, error states, empty states |
| [navigation-structure](./navigation-structure.md) | Desktop/tablet/mobile nav, Explore mega-menu, command palette, footer, breadcrumbs |

### 3 · Creative Direction & Brand
| Doc | What it covers |
|---|---|
| [creative-direction](./creative-direction.md) | Visual storytelling, depth/gradient strategy, design philosophy & principles |
| [brand-identity](./brand-identity.md) | Personality, voice & tone, wordmark, iconography, imagery, microcopy |

### 4 · Design System
| Doc | What it covers |
|---|---|
| [design-system](./design-system.md) | Color system + usage rules, spacing, elevation/glass/glow, grid, shadcn aliasing |
| [typography-system](./typography-system.md) | Font pairing, scales, line-height/tracking/weight, responsive + MDX typography |
| [design-tokens](./design-tokens.md) | Full token catalog (color, type, spacing, radius, shadow, blur, z-index, motion, breakpoints) |

### 5 · Components, Pages & Responsive
| Doc | What it covers |
|---|---|
| [component-inventory](./component-inventory.md) | Every component: purpose, props, variants, states, a11y, responsive, animation |
| [page-specifications](./page-specifications.md) | All 18 pages: sections, layout, CTA, SEO goal, components, responsive, animation, states |
| [wireframes](./wireframes.md) | Text wireframes (desktop/tablet/mobile) for every major page |
| [responsive-strategy](./responsive-strategy.md) | Breakpoints, containers, grid/nav/type behavior per tier, 3D + motion fallbacks |

### 6 · Motion, Interaction & 3D
| Doc | What it covers |
|---|---|
| [animation-strategy](./animation-strategy.md) | Every major animation fully specified (trigger/timing/states/reduced-motion/perf) |
| [section-transitions](./section-transitions.md) | Seams between narrative sections (pins, scrubs, gradient bleeds, fallbacks) |
| [interaction-plan](./interaction-plan.md) | All interactions (hover, filters, lightbox, forms, palette, keyboard, focus) |
| [scroll-strategy](./scroll-strategy.md) | Lenis + ScrollTrigger single-rAF, pins, parallax, progress, no scroll-jacking |
| [three-strategy](./three-strategy.md) | WebGL where/where-not, R3F architecture, perf budget, fallbacks, cleanup |

### 7 · Quality (Performance / Accessibility / SEO)
| Doc | What it covers |
|---|---|
| [performance-strategy](./performance-strategy.md) | CWV goals, bundle budgets, splitting, image/font/3D/React-Query/GitHub caching |
| [accessibility-strategy](./accessibility-strategy.md) | WCAG 2.2 AA contract, keyboard, focus, contrast, forms, canvas, acceptance checklist |
| [seo-strategy](./seo-strategy.md) | Metadata, OG, structured data, sitemap/robots/RSS, per-route metadata table |

### 8 · Technical Architecture & Delivery
| Doc | What it covers |
|---|---|
| [technical-architecture](./technical-architecture.md) | App Router, RSC/client, data fetching, state, forms, env, testing, deployment |
| [folder-structure](./folder-structure.md) | Target `src/` tree + purpose of each folder + path aliases |
| [dependency-plan](./dependency-plan.md) | Every dependency justified by category + dependencies to avoid |
| [bottleneck-analysis](./bottleneck-analysis.md) | Risks (3D, hydration, GitHub limits, blur) → symptom → cause → solution → verification |
| [implementation-roadmap](./implementation-roadmap.md) | 16 milestones mapped to Phases 2–5 with objectives, tasks, deliverables, acceptance |

### Companion documents (supporting, supplementary)
| Doc | Note |
|---|---|
| [PHASE-1-FOUNDATION](./PHASE-1-FOUNDATION.md) | Early condensed synthesis. **Where its route plan differs, the 18-page scope here is authoritative** (banner inside). |
| [CONTENT-CHECKLIST](./CONTENT-CHECKLIST.md) | Actionable list of the real content **you** provide, aligned to the 18-page scope. |

---

## Phase 1 acceptance criteria

- [x] All 29 planning docs exist in `docs/` and are non-trivial.
- [x] Design tokens are a single canonical set — **no hex drift** across docs (audited: 0 invented hexes).
- [x] The **18-page route set** is consistent across IA, navigation, page specs, and wireframes.
- [x] The navigation model (primary bar + Explore mega-menu + command palette + footer sitemap) is consistent.
- [x] The dependency story is consistent (Velite not Contentlayer; postprocessing deferred; React Query scoped to `/github` + `/open-source`; Framer via `LazyMotion`).
- [x] Performance budgets (LCP ≤2.5s, INP ≤200ms, CLS ≤0.02; per-route JS tiers) are consistent.
- [x] WCAG 2.2 AA contract defined with an enforceable acceptance checklist.
- [x] SEO architecture defined with a per-route metadata table.
- [x] Technical architecture, folder structure, and a 16-milestone roadmap are defined.
- [x] Internal cross-links resolve to real files.
- [x] **No application code, no app initialization, no React components, no config files** were created — `docs/*.md` only.

---

## Confirmation

**No application code was written in Phase 1.** The repository outside `docs/` remains only `README.md` and `.claude/`. Implementation begins in Phase 2 (production foundation), driven by [implementation-roadmap](./implementation-roadmap.md) and [folder-structure](./folder-structure.md).

# Responsive Strategy

> Purpose: Define how Joshua Setiawan's portfolio adapts across six device tiers — from large desktop to mobile portrait — covering breakpoints, containers, grids, navigation, typography, card stacking, media, Three.js fallbacks, and animation simplification, so every layout decision is deterministic and locked.

This document is the authoritative source for **responsive behavior**. It consumes the locked breakpoints, container widths, and spacing from [design-tokens](./design-tokens.md), the surface/theming rules from [design-system](./design-system.md), the fluid type scale from [typography-system](./typography-system.md), the per-tier navigation models from [navigation-structure](./navigation-structure.md), and the per-route composition from [page-specifications](./page-specifications.md). Component-level responsive props are catalogued in [component-inventory](./component-inventory.md); the motion philosophy it simplifies is in [creative-direction](./creative-direction.md).

---

## 1. Philosophy & Principles

| Principle | Statement |
|---|---|
| **Mobile-first authoring, desktop-aspirational** | CSS is authored from the smallest tier up (`min-width` queries). The flagship Awwwards moment is desktop; mobile is a first-class, deliberately reduced experience — never a broken desktop. |
| **Content is never gated behind a breakpoint** | Every destination, section, and word is reachable at every tier. Responsiveness changes *presentation and motion*, never *availability*. JS-off and no-WebGL are always safe. |
| **Fluid between, snap at** | Typography and gutters scale fluidly with `clamp()` *between* breakpoints; structural changes (grid columns, nav model, card stacking) *snap* at the locked breakpoints. |
| **One scroll authority, scaled effort** | Lenis + GSAP drive scroll at every tier; the *amount* of scroll-bound work scales down as the tier shrinks. The rAF contract never changes — only the timeline density does. |
| **The poster is the floor** | Every 3D moment degrades to a static poster that *is* the LCP element. As tiers shrink (or signal constraint), the poster — not the canvas — becomes the default. |
| **Touch is a capability, not a width** | Pointer type (`coarse`/`fine`) and `hover` capability gate magnetic/hover affordances independently of width; a small window on a desktop still gets hover. |
| **Measured at canonical frames** | Design and QA are verified at the locked frames **mobile 390**, **tablet 834**, **desktop 1440**, plus the tier edges. |

**Assumption:** The six named tiers are *design/QA tiers*; the *implemented* CSS uses the five locked Tailwind breakpoints (`sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`) plus the no-prefix base. Tier-to-breakpoint mapping is fixed in §2 and must not drift.

---

## 2. Tier ↔ Breakpoint Map (LOCKED)

The five breakpoints come from the locked scale: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`. The six design tiers map onto them as follows:

| # | Design tier | Range (viewport px) | Tailwind band | Primary container | Grid cols | Canonical QA frame |
|---|---|---|---|---|---|---|
| 1 | **Large desktop** | ≥ 1536 | `2xl` and up | `wide` → 1440 | 12 | 1920, 2560 |
| 2 | **Standard desktop** | 1280 – 1535 | `xl` | `content` → 1280 | 12 | **1440** |
| 3 | **Laptop** | 1024 – 1279 | `lg` | `content` (fluid ≤1280) | 12 | 1280, 1366 |
| 4 | **Tablet** | 768 – 1023 | `md` | fluid, gutter-bound | 8 | **834** |
| 5 | **Mobile landscape** | 640 – 767 | `sm` | fluid, gutter-bound | 4 (→ occasional 2-up) | 667, 740 |
| 6 | **Mobile portrait** | < 640 | base (no prefix) | full-bleed minus gutter | 4 | **390** |

**Container tokens (locked):** `content 1280` · `wide 1440` · `prose 720` · `gutter clamp(1.25rem, 5vw, 4rem)`.
**Grid system (locked):** 12 cols (desktop/laptop) → 8 cols (tablet) → 4 cols (mobile). The prose measure stays **65–72ch** regardless of tier (caps at the `prose 720` container).

---

## 3. Master Breakpoint → Behavior Matrix

The single source of truth. Every row is binding; per-tier sections (§4–§9) only elaborate.

| Dimension | Large desktop (≥1536) | Standard desktop (1280–1535) | Laptop (1024–1279) | Tablet (768–1023) | Mobile landscape (640–767) | Mobile portrait (<640) |
|---|---|---|---|---|---|---|
| **Container** | `wide` 1440, centered | `content` 1280, centered | `content` fluid to edges−gutter | fluid, gutter-bound | fluid, gutter-bound | full width − gutter |
| **Gutter** | ~4rem (clamp ceiling) | ~3.5–4rem | ~2.5–3rem | ~2rem | ~1.5rem | 1.25rem (clamp floor) |
| **Grid columns** | 12 | 12 | 12 | 8 | 4 | 4 |
| **Section rhythm `--section-y`** | ~12rem (ceiling) | ~9–11rem | ~7–9rem | ~6–7rem | ~6rem | 6rem (floor) |
| **Navigation** | Full bar + Explore mega-menu | Full bar + Explore mega-menu | Full bar + Explore mega-menu | Logo + Contact + ⌘K + theme; links collapse → right-side **sheet** | Hamburger → **full-height sheet** | Hamburger → **full-height sheet** |
| **Logo state** | Wordmark → JS monogram on scroll | Same | Same | Wordmark→monogram (monogram-first earlier) | Monogram-first | Monogram-first |
| **Display type** | Full `display-2xl` ceiling (hero ≤7.5rem) | Near-ceiling | Mid-clamp | Lower-mid clamp | Near-floor | `clamp()` floor |
| **Hero layout** | Asymmetric, generous negative space | Asymmetric | Asymmetric, tighter | Stacked-asymmetric | Stacked, single column | Stacked, single column |
| **Card grid** | 3–4 up | 3 up | 2–3 up | 2 up | 1–2 up | 1 up (stack) |
| **Media / images** | Full art-direction, AVIF, up to `wide` | Full, AVIF | Full, AVIF | `tablet` sizes | `mobile` sizes | `mobile 390` sizes, ≤120KB LCP |
| **Three.js** | Full Signal Field, DPR ≤1.75 | Full, DPR ≤1.75 | Full, DPR ≤1.5 (tier-gated) | **Reduced** sim / lower DPR or poster | **Poster-first** (canvas opt-in) | **Poster only** |
| **Accent 3D moments** | All (cover-hover, aurora, constellation, tech-graph) | All | Most (hover shaders on; ambient reduced) | Hover→tap, ambient off | Posters / static | Posters / static |
| **Scroll motion (GSAP)** | Full pin/scrub/horizontal | Full | Full (lighter density) | Pins simplified, horizontal → swipe | Reveal-only, no pin | Reveal-only (short travel) |
| **Magnetic / hover FX** | On (fine pointer) | On | On | Off (coarse) → tap states | Off | Off |
| **Cursor companion** | On (fine pointer) | On | On | Hidden (coarse) | Hidden | Hidden |
| **Reveal travel** | hero 80 / lg 48 | 48 | 48→24 | 24 | 16 | 8–16 |
| **Touch targets** | ≥24px (mouse) | ≥24px | ≥24px | ≥44px recommended | ≥44px | ≥44px |
| **Command palette ⌘K** | Header chip + shortcut | Header chip | Header chip | Inside sheet ("Search") | Inside sheet | Inside sheet |

> Three.js, animation, and reduced-motion behaviors above are *width* defaults; they are further gated by **device tier**, **WebGL availability**, **pointer type**, and the global **reduced-motion** gate (`prefers-reduced-motion` OR in-app toggle OR `saveData`). See §11–§12.

---

## 4. Tier 1 — Large Desktop (≥ 1536px)

The flagship, cinematic canvas. This is where the Awwwards-quality composition is fully expressed.

- **Container:** `wide` 1440, centered, with the `gutter` clamp at its ~4rem ceiling. Extra viewport beyond 1440 becomes symmetric margin (the void is intentional negative space, lit by ambient gradient — never stretched content). **Assumption:** ultra-wide (≥1920) caps content at `wide` 1440 and lets the persistent `<Canvas>` ambient field bleed into the margins behind content.
- **Grid:** full 12-column. Hero and feature sections use asymmetric spans (e.g. 7/5, 8/4) for editorial tension.
- **Navigation:** full primary bar — `Projects · About · Blog · Explore ▾` + `⌘K` chip + theme toggle + filled **Contact** CTA. Explore opens the full four-column mega-menu (Work / Writing / Profile / Proof). Logo wordmark collapses to **JS** monogram on scroll.
- **Typography:** `display-2xl` reaches its `clamp()` ceiling (hero ≤ **7.5rem**, lh 0.95, −0.03em). Two type families max per viewport. Measure held at 65–72ch via `prose` even as the page is wide.
- **Cards:** 3–4 up grids (Projects, Gallery, Certificates). Hover lifts (−6px), cover-hover shader plays, magnetic CTAs active (fine pointer).
- **Media:** full art-direction, AVIF, `sizes` allowing up to `wide`. LCP poster/image still budgeted ≤120KB AVIF.
- **Three.js:** full **Signal Field** hero (GPU-instanced curl-noise particles), DPR clamped [1, 1.75], `frameloop="demand"`, all accent moments enabled (project-cover hover shader, About aurora mesh, GitHub constellation, tech-graph).
- **Animation:** full GSAP pin/scrub/horizontal-scroll, hero reveal travel 80, loose staggers (90). Lenis smooth scroll authoritative.

---

## 5. Tier 2 — Standard Desktop (1280–1535px)

The reference tier — designs are drawn at **1440**. Visually identical intent to Tier 1 with the content container snapping to `content` 1280.

- **Container:** `content` 1280, centered, gutter ~3.5–4rem.
- **Grid:** 12-column, same asymmetric spans as Tier 1.
- **Navigation:** identical full bar + Explore mega-menu.
- **Typography:** `display-2xl` near ceiling; all scale steps at full editorial size.
- **Cards:** 3-up default for project/blog grids; 4-up only where density suits (gallery, logos).
- **Media:** full AVIF art-direction, `sizes` up to `content` 1280.
- **Three.js:** full hero + all accent moments, DPR [1, 1.75].
- **Animation:** full scroll choreography; reveal travel 48–80, base/loose staggers.

This tier and Tier 1 share one CSS path; the only delta is `max-width` (1280 vs 1440) and the ambient-margin treatment.

---

## 6. Tier 3 — Laptop (1024–1279px)

The most common professional viewport (13–14" laptops). Full desktop *structure*, dialed-back *effort*.

- **Container:** `content`, fluid up to 1280, gutter ~2.5–3rem.
- **Grid:** 12-column retained; some 3-up grids relax to 2–3 up where card min-width would crush below ~320px.
- **Navigation:** **still the full bar + Explore mega-menu** (the `lg` ≥1024 desktop nav threshold). Mega-menu panel width-constrained to the content container.
- **Typography:** display steps sit mid-`clamp()`; h-scale unchanged. Measure unaffected.
- **Cards:** project grid 2–3 up; experience/timeline keep their desktop two-rail layout but with tighter gutters.
- **Media:** full AVIF; `sizes` capped to viewport.
- **Three.js:** full hero, but **DPR clamped [1, 1.5]** and `PerformanceMonitor` more eager to downgrade. Ambient secondary canvases (aurora, constellation) stay but at reduced particle counts. **Assumption:** device-tier detection (CPU cores / deviceMemory / GPU heuristic) can demote a weak laptop to the Tablet 3D profile (poster-first) even at ≥1024 width.
- **Animation:** full GSAP timelines at lighter density (fewer simultaneous scrubbed layers); reveal travel 48→24, base staggers.

---

## 7. Tier 4 — Tablet (768–1023px)

The pivot tier: desktop motion language gives way to touch ergonomics. Grid drops to **8 columns**; pointer is assumed `coarse`.

- **Container:** fluid, gutter-bound (~2rem). No fixed max — content fills viewport minus gutter. Canonical frame **834** (iPad-class).
- **Grid:** **8-column**. Two-rail desktop layouts (experience, project meta + body) collapse to stacked-asymmetric: primary content full-width-of-8, secondary meta as a sticky-then-inline sidebar.
- **Navigation:** primary bar keeps **logo + Contact CTA + ⌘K + theme toggle**; `Projects/About/Blog/Explore` collapse into a single **Menu** that opens a **right-side sheet** (Radix dialog, focus-trapped, `inert`, `z-index 80`) listing primary 4 then Explore groups then theme + ⌘K. **Assumption (locked in nav doc):** at 768 the four text links collapse into the menu; Contact stays visible.
- **Typography:** display at lower-mid `clamp()`; hero stacks above supporting copy. Two families max still enforced.
- **Cards:** **2-up** for projects/blog/gallery; certificates/achievements 2-up. Cards gain larger tap padding; hover-only affordances become tap/active states.
- **Media:** `tablet`-tier `sizes`; AVIF; aspect ratios may shift to art-directed `<picture>` sources for portrait tablet.
- **Three.js:** **reduced** — either a lower-DPR ([1, 1.25]) reduced-particle Signal Field **or** the static poster, decided by device tier + WebGL + battery/`saveData`. Hover-driven cover shaders become **tap-to-reveal** or are replaced by their static cover. Ambient meshes (aurora, constellation) default **off**.
- **Animation:** GSAP **pins simplified** (single-step pins only, no nested scrubs); **horizontal-scroll sections convert to native swipe/snap carousels** with visible **Prev/Next** controls (WCAG 2.5.7). Reveal travel 24, magnetic/cursor companion **off** (coarse pointer).

---

## 8. Tier 5 — Mobile Landscape (640–767px)

Transitional band — large phones rotated, small phablets. Treated as an enriched mobile, not a shrunk tablet. Grid stays **4 columns**.

- **Container:** fluid, gutter ~1.5rem.
- **Grid:** **4-column**. Occasional **2-up** for compact, image-light cards (logos, certificates, gallery thumbs); everything content-heavy is **1-up**.
- **Navigation:** **mobile model** — logo (monogram-first) left; **Contact** CTA + **hamburger** right; ⌘K/search and theme live inside the **full-height sheet**.
- **Typography:** display near `clamp()` floor but still expressive; eyebrows/labels in Geist Mono unchanged.
- **Cards:** single-column stack by default; 2-up only for the image-light exceptions above. Full-width tap targets ≥44px.
- **Media:** `mobile`-tier `sizes`; AVIF; LCP image ≤120KB.
- **Three.js:** **poster-first.** Canvas only mounts on opt-in / capable devices; the static poster is the LCP element by default. No ambient 3D.
- **Animation:** **reveal-only** — entrance fades/short translates (travel 16); **no pin, no scrub.** Lenis still smooths; GSAP timelines reduced to in-view reveals. Landscape orientation respected (no forced portrait), with reduced vertical rhythm awareness for short-height viewports.

**Short-viewport guard:** when `height < 480` (landscape phones), sticky header may auto-hide on scroll-down / reveal on scroll-up to reclaim vertical space; modals/sheets become scrollable rather than centered.

---

## 9. Tier 6 — Mobile Portrait (< 640px)

The baseline tier — authored first, QA'd at the canonical **390** frame. Maximum clarity, minimum motion cost.

- **Container:** full width minus the `gutter` floor (**1.25rem**).
- **Grid:** **4-column**, used almost entirely as a single stacked rail. Section rhythm at its `--section-y` floor (6rem).
- **Navigation:** logo monogram left; **Contact** + **hamburger** right. Hamburger opens the **full-height sheet** (focus trap, `inert`, return-to-trigger, scroll-lock) with: Primary 4 → Explore groups (Work / Writing / Profile / Proof) → Utilities (theme, Search→palette, Privacy). Targets ≥44px.
- **Typography:** `display` at `clamp()` floor; hero display type **is** the single `<h1>`. Measure naturally ≤ prose. tabular-nums preserved for stats/dates.
- **Cards:** **1-up stack**, edge-to-edge within gutter, generous vertical spacing. Metrics rows wrap; tag rows scroll-x within the card if overflowing (with masked edges, not hidden).
- **Media:** `mobile 390` `sizes`; AVIF; **LCP image ≤120KB**; blur-up placeholders from `blurDataURL`.
- **Three.js:** **static poster only.** `<Canvas>` is not mounted on portrait mobile by default; the poster is the LCP element (meets the "poster IS LCP" mandate). This protects the mobile LCP ≤2.5s budget and the "zero three in first-load" rule.
- **Animation:** **reveal-only**, travel 8–16, fast/base durations, tight staggers. No pin/scrub/horizontal. Page-transition curtain simplified to a fast fade. Lenis still authoritative unless reduced-motion (then native scroll).

---

## 10. Cross-Cutting: Layout Mechanics

### 10.1 Container & gutter resolution

| Token | Value | Behavior across tiers |
|---|---|---|
| `content` | 1280 | Caps Tiers 2–3; fluid below. |
| `wide` | 1440 | Caps Tier 1; ambient margins beyond. |
| `prose` | 720 | Article/MDX measure cap at *all* tiers (65–72ch). |
| `gutter` | `clamp(1.25rem, 5vw, 4rem)` | 4rem (large) → 1.25rem (portrait), continuous. |
| `--section-y` | `clamp(6rem, 12vw, 12rem)` | 12rem (large) → 6rem (mobile), continuous. |

### 10.2 Grid behavior (12 → 8 → 4)

- **12-col** (≥1024): asymmetric editorial spans; two-rail content/meta layouts.
- **8-col** (768–1023): two-rail collapses to stacked-asymmetric; cards 2-up.
- **4-col** (<768): single stacked rail; cards 1-up (2-up only for image-light exceptions in 640–767).
- Use **CSS `grid-template-columns: repeat(N, ...)` with `minmax()`** so card grids never crush below their min card width; columns *snap* at breakpoints, gaps scale with gutter.
- **Container queries** are the preferred tool for component-internal responsiveness (e.g. a project card that lives in both a 3-up grid and a full-width feature slot) so a component adapts to *its slot*, not the viewport. **Assumption:** `@container` is used for reusable cards/media in [component-inventory](./component-inventory.md); viewport media queries remain for page-level structure and nav.

### 10.3 Card stacking summary

| Surface | ≥1280 | 1024–1279 | 768–1023 | 640–767 | <640 |
|---|---|---|---|---|---|
| Projects grid | 3 | 2–3 | 2 | 1–2 | 1 |
| Blog list | 2–3 | 2 | 2 | 1 | 1 |
| Gallery | 4 (masonry) | 3 | 2 | 2 | 1 |
| Certificates | 3 | 3 | 2 | 2 | 1 |
| Achievements | 2 | 2 | 2 | 1 | 1 |
| Experience/Timeline | 2-rail | 2-rail | stacked | stacked | stacked |
| GitHub dashboard cards | 12-col mosaic | 12-col | 8-col stack | 4-col stack | 1-up |

### 10.4 Media resizing

- All raster media ship **AVIF** with `next/image` `sizes` matched to the tier's container; LCP candidate ≤ **120KB**.
- Art-directed `<picture>`/`<source>` swaps allowed where crop must change between landscape (desktop) and portrait (mobile) — e.g. project covers, About portrait.
- Aspect ratios are reserved (`aspect-ratio` / width+height) at every tier to hold **CLS ≤ 0.02**; `blurDataURL` placeholders prevent layout shift on stream-in.
- Gallery uses intrinsic `width/height` + `blurDataURL` from typed data; masonry → columns → single per §10.3.

---

## 11. Three.js Fallback Ladder (per tier)

The persistent single `<Canvas>` (`dynamic`, `ssr:false`, `frameloop="demand"`) is gated by a **four-input decision**: width tier × device tier × WebGL support × motion gate. The poster is always the floor.

| Tier | Default render | DPR clamp | Particle / mesh budget | Accent moments | Notes |
|---|---|---|---|---|---|
| Large desktop | Full Signal Field | [1, 1.75] | Full | All | Ambient bleed into margins |
| Standard desktop | Full Signal Field | [1, 1.75] | Full | All | Reference profile |
| Laptop | Full Signal Field | [1, 1.5] | Reduced | Most (ambient reduced) | Weak GPU → demote to poster-first |
| Tablet | Reduced sim **or** poster | [1, 1.25] | Low | Hover→tap only | Ambient off; device-tier decides |
| Mobile landscape | **Poster-first** (canvas opt-in) | [1, 1.0] | Minimal if mounted | Static | LCP = poster |
| Mobile portrait | **Poster only** (no canvas) | n/a | none | Static | Protects LCP + first-load budget |

**Universal Three.js gates (all tiers):**
- `IntersectionObserver` pauses the loop when off-screen; `PerformanceMonitor` downgrades DPR/quality on frame drops; dispose on unmount.
- **No-WebGL → poster.** **Reduced-motion → static poster.** **`saveData` / low `deviceMemory` → poster.**
- Three is **never the LCP** (the poster is) and is **never shipped in a first-load chunk** or on routes that don't use it.

---

## 12. Animation Simplification Ladder (mobile-down)

One reduced-motion gate (`prefers-reduced-motion` OR in-app toggle OR `saveData` → Zustand → `<html data-motion>`) hard-stops scroll-bound motion at every tier. *Independently*, width/pointer simplify motion as tiers shrink:

| Capability | Desktop/Laptop (fine pointer) | Tablet (coarse) | Mobile (coarse) | Reduced-motion (any tier) |
|---|---|---|---|---|
| Lenis smooth scroll | On | On | On | **Off (native scroll)** |
| GSAP pin | On | Simplified | **Off** | Off |
| GSAP scrub | On | Reduced | **Off** | Off |
| Horizontal scroll section | On (scrubbed) | Swipe/snap carousel + Prev/Next | Swipe/snap + Prev/Next | Static stack + Prev/Next |
| Entrance reveals | Full (travel 48–80, blur 6→0) | Reduced (travel 24) | Minimal (travel 8–16) | **Instant/visible (no travel)** |
| Magnetic buttons / cursor companion | On | Off | Off | Off |
| Parallax / cover-hover shaders | On | Tap-reveal / static | Static | Static |
| Page-transition curtain | Full | Full | Fast fade | Cross-fade / none |
| Staggers | tight 30 / base 60 / loose 90 | base 60 | tight 30 | none |

**Hard rules at every tier:** content is visible without JS/animation; an explicit **Pause-motion** control exists (WCAG 2.2.2); carousels expose visible **Prev/Next** (2.5.7); focus is never obscured by the sticky header (2.4.11); targets ≥24px (≥44px on touch tiers, 2.5.8).

---

## 13. Orientation, Pointer & Capability Queries

Width alone is insufficient. These orthogonal signals refine behavior:

| Signal | Query | Effect |
|---|---|---|
| **Pointer** | `(pointer: coarse)` / `(pointer: fine)` | Coarse → disable magnetic/cursor companion, enlarge targets to 44px, hover→tap. Decouples touch from width (a small desktop window keeps hover). |
| **Hover** | `(hover: hover)` | Gate purely-hover affordances; provide tap/focus equivalents when absent. |
| **Orientation** | `(orientation: landscape)` + short-height guard (`height < 480`) | Auto-hiding header, scrollable sheets/modals, reduced vertical rhythm. |
| **Reduced data** | `saveData` / `(prefers-reduced-data)` | Poster instead of canvas; defer non-critical media; skip ambient motion. |
| **Reduced transparency** | `(prefers-reduced-transparency)` | Glass surfaces (nav, cards, palette) fall back to solid `--surface-*`. |
| **Reduced motion** | `(prefers-reduced-motion: reduce)` | See §12 — single global gate. |
| **Forced colors** | `(forced-colors: active)` | Focus via `outline` survives; borders/affordances rely on system colors, not glow. |
| **Color scheme** | `next-themes` (`data-theme`), dark default | Theme is orthogonal to tier; both light/dark QA'd at every frame. |

---

## 14. Per-Route Responsive Notes (highlights)

Full per-route specs live in [page-specifications](./page-specifications.md); responsive deltas worth flagging:

| Route | Responsive note |
|---|---|
| `/` Landing | Hero Signal Field is full on desktop, poster on mobile portrait. Horizontal "selected work" strip → swipe carousel on touch. |
| `/projects` | 3-up → 2-up → 1-up; filter chips become a horizontal scroll row on mobile with masked edges. |
| `/projects/[slug]` | Two-rail (body + sticky meta/TOC) → stacked; TOC becomes a collapsible top accordion on <1024. Gallery degrades per §10.3. |
| `/github` | LIVE-data mosaic: 12-col → 8-col stack → 1-up; contribution calendar scrolls-x on mobile with Prev/Next week paging; optional 3D depth is desktop-only, poster elsewhere. |
| `/gallery` | Masonry (4) → columns (3/2) → single; lightbox is full-screen sheet on mobile. |
| `/blog/[slug]`, `/research/[slug]` | `prose` 720 measure at all tiers; sticky reading progress; footnotes/sidenotes inline below 1024. |
| `/contact` | Single-column form at all tiers; on mobile the sticky submit summary docks to the bottom; success state inline + live region. |
| `/experience`, `/timeline` | Two-rail timeline → single rail with the spine on the left edge below 768. |

---

## 15. QA & Enforcement Matrix

Verify at the canonical frames plus the tier edges, in **light + dark + reduced-motion + forced-colors**.

| Frame (px) | Tier | What to assert |
|---|---|---|
| 360, **390**, 414 | Mobile portrait | 1-up stacks, hamburger sheet, poster LCP ≤120KB, no canvas mounted, targets ≥44px |
| 667, 740 | Mobile landscape | reveal-only motion, short-height header guard, 1–2-up |
| 768, **834**, 1023 | Tablet | 8-col, right-side sheet nav, carousels + Prev/Next, hover→tap, ambient 3D off |
| 1024, 1280 | Laptop | full bar + mega-menu, DPR ≤1.5, 12-col |
| **1440** | Standard desktop | reference comp parity, full motion |
| 1536, 1920, 2560 | Large desktop | `wide` 1440 cap, ambient margins, no content stretch |

**Automated gates:** Lighthouse CI (throttled mobile) for CWV (LCP ≤2.5s, INP ≤200ms, CLS ≤0.02) and per-route first-load budgets (160/175/200KB); `@next/bundle-analyzer` chunk-content assertion (zero three/gsap/framer in first-load); `axe-playwright` across light/dark/reduced-motion/forced-colors at the frames above; visual-regression snapshots at **390 / 834 / 1440**.

---

## 16. Related Documents

- [design-tokens](./design-tokens.md) — locked breakpoints, container, spacing, motion tokens consumed here.
- [design-system](./design-system.md) — surfaces, glass/transparency fallbacks, theming.
- [typography-system](./typography-system.md) — the fluid `clamp()` scale that drives §10/§4–§9 type behavior.
- [navigation-structure](./navigation-structure.md) — the authoritative desktop/tablet/mobile nav models referenced in §3–§9.
- [page-specifications](./page-specifications.md) — per-route composition and the source for §14.
- [component-inventory](./component-inventory.md) — component-level responsive props and container-query usage.
- [creative-direction](./creative-direction.md) — the motion philosophy that §11–§12 simplify.
- [information-architecture](./information-architecture.md) — route map and the 16-destination grouping the nav tiers serve.

# Page Specifications

> Purpose: The per-page design contract for all 18 routes/states — purpose, audience, ordered sections, layout, CTA strategy, SEO goal, components, responsive behavior, animation plan, and empty/error states — so engineering composes screens that are internally consistent with the IA, navigation model, content model, and design system.

Related: [Information Architecture](./information-architecture.md) · [Navigation Structure](./navigation-structure.md) · [UX Flow](./ux-flow.md) · [User Journey](./user-journey.md) · [Design System](./design-system.md) · [Design Tokens](./design-tokens.md) · [Typography System](./typography-system.md) · [Component Inventory](./component-inventory.md) · [Animation Strategy](./animation-strategy.md) · [Target Audience](./target-audience.md) · [Content Checklist](./CONTENT-CHECKLIST.md)

---

## 0. How to read this document

Each page spec follows the same ten-part contract so screens stay comparable and nothing is omitted:

| Field | Meaning |
|---|---|
| **Purpose** | The single job this page does in the funnel. |
| **Primary audience** | The dominant persona from [Target Audience](./target-audience.md) the page is optimized for. |
| **Sections (top → bottom)** | The ordered vertical composition of the page body (excludes the shared shell). |
| **Layout structure** | Container width, grid columns, and the structural skeleton. |
| **CTA strategy** | Which actions appear, their hierarchy, and where they route. |
| **SEO goal** | Render strategy, target intent, title/meta posture, and JSON-LD (per [IA §2 / §11](./information-architecture.md)). |
| **Components** | The building blocks, named per [Component Inventory](./component-inventory.md). |
| **Responsive** | Behavior at desktop (`≥lg` 1024px) / tablet (`md` 768–1023px) / mobile (`<md` <768px). |
| **Animation plan** | The motion choreography, named per [Animation Strategy](./animation-strategy.md), always with a reduced-motion (`↺`) equivalent. |
| **Empty / error states** | What renders when data is missing or a fetch/route fails (per [UX Flow §11–12](./ux-flow.md)). |

**Legend (shared with [UX Flow](./ux-flow.md)):** `→` route transition · `◆` decision/branch · `⚠` error branch · `∅` empty state · `↺` reduced-motion / no-JS equivalent.

**Global invariants that apply to every page below** (stated once, never repeated):

- Exactly **one `<h1>` per route**; the hero display type *is* the h1 (per [Typography System](./typography-system.md) + WCAG 2.4.6 / 1.3.1).
- One labeled landmark of each type: `<header>` (banner), `<nav>`, `<main id="main-content">`, `<footer>` (contentinfo). The skip link is the first focusable element.
- All primary content is **RSC/SSG** and visible **without JS and without animation**; motion only enhances. Dark is the default theme.
- Section rhythm uses `--section-y: clamp(6rem, 12vw, 12rem)`; horizontal gutter `clamp(1.25rem, 5vw, 4rem)`; grid `12 / 8 / 4` cols (desktop / tablet / mobile).
- Every `:focus-visible` is a `≥2px` outline + offset, never obscured by the sticky header (WCAG 2.4.11 / 2.4.7); interactive targets `≥24px` (2.5.8).
- Status, kind, and category are **never encoded by color alone** — always icon + label too (WCAG 1.4.1).

---

## 1. Global page shell (shared by all 18 routes)

Defined once here; every page below "inherits the shell" and specs only its body.

| Shell element | Spec | Component | Notes |
|---|---|---|---|
| **Skip link** | First focusable; jumps to `#main-content` | `<SkipLink>` | Visible on focus; `z-index: 110`. |
| **Sticky header** | Glass bar, height ~64px, `z-50`; `backdrop-blur 12px` w/ solid `--surface-2` fallback under `prefers-reduced-transparency` | `<SiteHeader>` → `<Logo>`, `<PrimaryNav>`, `<ExploreMegaMenu>`, `<ThemeToggle>`, `<CommandTrigger>`, `<ContactCTA>`, `<MobileNavSheet>` | Per [Navigation Structure §2–5](./navigation-structure.md). Logo wordmark→`JS` monogram on scroll. |
| **Command palette** | `⌘K` / `Ctrl+K` overlay (cmdk) | `<CommandPalette>` | Radix dialog, focus-trapped, `z-70/80`; nav + content search + actions. |
| **Persistent canvas** | Single `<Canvas>` (`ssr:false`, `frameloop="demand"`, DPR `[1,1.75]`), portaled via tunnel-rat; `aria-hidden`, `tabindex="-1"` | `<PersistentCanvas>` + `<CanvasTunnel>` | Only renders WebGL on routes that opt in (Landing, About, optional GitHub). Static poster otherwise. |
| **Page transition** | Framer curtain on route change; focus → `#main-content` + polite live-region announce of new page title | `<PageTransition>`, `<RouteAnnouncer>` | `↺` static cross-fade / instant swap. |
| **Footer** | Full sitemap, 6 columns, wordmark + positioning line, back-to-top | `<SiteFooter>` | Per [Navigation Structure §8](./navigation-structure.md); all real anchors, crawlable. |
| **Toaster** | Bottom, `z-90`, polite | `<Toaster>` (sonner) | Secondary confirmations only; never the sole success signal. |
| **Motion control** | Explicit "Pause motion" toggle (WCAG 2.2.2) writing `data-motion` on `<html>` | `<MotionToggle>` (in footer + ⌘K actions) | Composes with OS `prefers-reduced-motion` + `saveData`. |
| **JSON-LD (root)** | `Person` + `WebSite` graph injected in root layout | `<JsonLd>` | Per-page schema is additive (listed in each spec's SEO goal). |
| **Loading fallback** | Streamed skeleton from nearest `loading.tsx` | `<RouteSkeleton>` variants | See [Page 18](#page-18--loading-state-loadingtsx). |

**Shared content primitives** referenced throughout: `<Container>` (content 1280 / wide 1440 / prose 720), `<Section>` + `<SectionHeader>` (`<Eyebrow>` + `h2`), `<Reveal>` / `<StaggerGroup>` (scroll-in), `<EmptyState>`, `<CTABand>`, `<TagChip>` / `<StackChip>`, `<StatusBadge>` / `<KindBadge>`, `<MetricStat>` (`tabular-nums`), `<GradientText>`, `<GlassPanel>`, `<PrevNextNav>`, `<FilterBar>`.

---

## Page 1 — Landing (`/`)

**Purpose:** Establish the hybrid Creative Developer + Software Engineer positioning in one cinematic breath and route skimmers into the three proof funnels (Projects, Writing, Contact). The single most important page; it must communicate craft, calm, and capability above the fold.

**Primary audience:** First-time visitors across all personas — recruiter, hiring manager, prospective client, peer engineer (the "decide in 8 seconds" crowd).

**Sections (top → bottom):**
1. **Hero "Signal Field"** — display-2xl name/positioning as the `h1`, one-line value proposition, primary + secondary CTAs, the GPU instanced-particle field as ambient backdrop (poster is the LCP).
2. **Positioning strip** — a single editorial sentence framing the hybrid identity ("I engineer interfaces and the systems beneath them"), with a Geist Mono eyebrow.
3. **Featured Projects band** — 3 featured case studies (`featured: true`, sorted `featured → year → order`) as large cards + a "see all →" link.
4. **Capability triad** — three columns (Engineering / Craft / Systems) each linking to a deeper route (Philosophy, Projects, Open Source).
5. **Selected writing** — 2–3 latest non-draft posts (Blog) as compact cards + "Read the blog →".
6. **Proof ribbon** — condensed marquee/row of logos, stats (years, shipped projects, stars) as `<MetricStat>` with `tabular-nums`, linking to GitHub/Experience.
7. **Closing CTA band** — "Let's build something" → `/contact`, secondary "View the work" → `/projects`.

**Layout structure:** Full-bleed hero in the **wide (1440)** container with the canvas behind; subsequent sections in **content (1280)**. Featured band = 12-col → asymmetric (1 large + 2 stacked, or 3 equal). Capability triad = 3×4 cols desktop. Generous `--section-y` between bands.

**CTA strategy:** Hero primary **"View Projects"** (filled `--primary`) + secondary **"Get in touch"** (outline→accent hover, magnetic ≤18px). Persistent header **Contact** CTA. Closing band reiterates Contact. Exactly one filled accent in chrome (Contact) per [Navigation Structure §7](./navigation-structure.md).

**SEO goal:** SSG. The home intent target ("Joshua Setiawan — Creative Developer / Software Engineer"). Title is the base (no template suffix on root). Rich, descriptive meta + OG (root `opengraph-image`). JSON-LD `Person` + `WebSite` (with `SearchAction` pointing at the command palette / site search intent). This is the canonical entry; strongest internal-link hub.

**Components:** `<HeroSignalField>` (3D island), `<GradientText>`, `<MagneticButton>`, `<FeaturedProjectCard>` ×3, `<CapabilityCard>` ×3, `<BlogCard>` ×2–3, `<Marquee>` / `<ProofRibbon>`, `<MetricStat>`, `<CTABand>`. See [Component Inventory](./component-inventory.md).

**Responsive:**
- **Desktop:** full hero with canvas; featured band asymmetric; triad 3-up; ribbon horizontal marquee.
- **Tablet:** hero canvas retained at lower DPR; featured 2-up then 1; triad 3-up→2-up; ribbon wraps.
- **Mobile:** hero collapses to poster-first single column (canvas optional/paused via IntersectionObserver); CTAs stack full-width (≥44px); featured/triad/writing all 1-up; ribbon becomes a 2-col stat grid.

**Animation plan** (per [Animation Strategy](./animation-strategy.md)): `signal-field-intro` (canvas particles settle from curl-noise, ~`cinematic900`), `hero-text-reveal` (line-by-line `TextReveal`, blur 6→0, travel `hero80`, stagger `base60`), `featured-stagger` on scroll (`reveal-up`, card lift -6px on hover), `count-up-metrics` (GSAP scrub when ribbon enters), `magnetic-cta`. `↺` Reduced-motion: static poster (poster is already LCP), no particle sim, instant text, no count-up (final values shown), no magnetic.

**Empty / error states:** ⚠ No-WebGL / low-tier / reduced-motion → static gradient poster (the poster *is* the LCP, so this path is fully designed, not a fallback afterthought). ∅ Fewer than 3 featured projects → render available; if zero featured, fall back to latest 3 by year. ∅ No published posts → hide "Selected writing" section entirely (no empty header).

---

## Page 2 — About (`/about`)

**Purpose:** Convert curiosity into trust by telling the human + practitioner story — who Joshua is, how he thinks, and the proof arc — and route to deeper profile/contact.

**Primary audience:** Hiring managers and prospective clients evaluating fit, values, and communication.

**Sections (top → bottom):**
1. **Intro hero** — `h1` (name + role framing), a 2–3 sentence narrative lede, portrait, and an ambient **aurora gradient-mesh** accent.
2. **Narrative bio** — long-form prose (prose 720 container): origin → focus → what drives the work.
3. **Operating principles teaser** — 3–4 condensed principles with a "Read the philosophy →" link to `/philosophy`.
4. **Snapshot facts** — quick-scan grid: location, focus areas, current status (open to work / collaboration), tools of choice.
5. **Selected proof** — compact links to Experience, Certificates, Achievements (Profile + Proof clusters).
6. **Beyond the screen** — a short personal/taste paragraph linking `/gallery`.
7. **CTA band** — "Work with me" → `/contact`, "See the work" → `/projects`.

**Layout structure:** Hero = 2-col (text left, portrait + aurora right) in content 1280; bio in **prose 720**; snapshot = 2×2 or 4-col fact grid; proof links as a 3-up card row.

**CTA strategy:** Primary **"Work with me"** → `/contact`; secondary **Résumé/CV download** in the hero header (per [Navigation Structure §7](./navigation-structure.md)); inline contextual links to Philosophy/Experience.

**SEO goal:** SSG. Intent: "about Joshua Setiawan." `ProfilePage` JSON-LD (referencing the root `Person`). Title `"About — Joshua Setiawan"`. Strong E-E-A-T signal page; canonical self.

**Components:** `<AuroraMesh>` (3D/shader island, optional), `<Prose>`, `<Portrait>` (`next/image`, `blurDataURL`), `<PrincipleTeaser>`, `<FactGrid>`, `<ProofLinkCard>` ×3, `<ResumeButton>`, `<CTABand>`.

**Responsive:**
- **Desktop:** 2-col hero, aurora visible; fact grid 4-up.
- **Tablet:** hero stacks (portrait above text or beside at 2-col); fact grid 2×2.
- **Mobile:** single column; aurora reduced to a static gradient wash; portrait full-width capped; facts 2-up; proof cards 1-up.

**Animation plan:** `aurora-ambient` (slow drifting gradient-mesh, `ambient1200+`, paused off-screen), `reveal-up` for bio paragraphs and principle teasers (stagger `base60`), portrait subtle parallax (GSAP, ≤8px). `↺` aurora → static gradient; reveals → instant; no parallax.

**Empty / error states:** No live data — none. ⚠ WebGL unavailable → static aurora poster. (Content is always present.)

---

## Page 3 — Engineering Philosophy (`/philosophy`)

**Purpose:** Demonstrate engineering depth and taste through articulated principles — the page that converts "looks nice" into "thinks rigorously." Differentiator for senior engineering audiences.

**Primary audience:** Peer engineers, engineering managers, technical co-founders assessing judgment.

**Sections (top → bottom):**
1. **Manifesto hero** — `h1` + a single bold thesis statement (large display) on craft + engineering.
2. **Principles sequence** — ordered principle sections (`principle / statement / rationale`), each a pinned/scrubbed editorial panel with a number, statement, and supporting reasoning + optional code/diagram.
3. **Applied evidence** — "principles in practice" linking each principle to a real project decision (`/projects/[slug]`).
4. **Closing reflection** — short forward-looking paragraph.
5. **CTA band** — "See it in the work" → `/projects`; "Let's talk engineering" → `/contact`.

**Layout structure:** Hero full-width thesis; principles as a vertical sequence of pinned panels (sticky statement left / scrolling rationale right at desktop; stacked at mobile) within content 1280, prose blocks at 720 measure. MDX singleton OR structured `principle` sections per [IA §6.1](./information-architecture.md).

**CTA strategy:** Low-pressure, credibility-first; primary path is *into the work* (`/projects`), secondary to Contact. No hard sell — the content is the conversion.

**SEO goal:** SSG (MDX). Intent: "engineering philosophy / principles / how I build." Title `"Engineering Philosophy — Joshua Setiawan"`. No special schema (per [IA §2](./information-architecture.md)); rich semantic headings for each principle.

**Components:** `<PhilosophyPrinciple>` (numbered panel), `<PinSection>`, `<Prose>`, `<CodeBlock>` (Shiki dual-theme), `<Callout>`, `<AppliedEvidenceLink>`, `<CTABand>`.

**Responsive:**
- **Desktop:** sticky statement + scrubbed rationale (GSAP pin); 2-col within each principle.
- **Tablet:** lighter pin (sticky number only) or stacked; 1-col rationale.
- **Mobile:** fully stacked, no pin; each principle a self-contained card; numbers as eyebrows.

**Animation plan:** `pinned-philosophy` (GSAP ScrollTrigger pin + scrub through principles inside `gsap.matchMedia`), `statement-reveal` (TextReveal per principle), number `count` accent. `↺` Reduced-motion (matchMedia branch): no pin/scrub — principles render as a plain stacked list, fully readable; content never gated.

**Empty / error states:** Content-driven, always present. ∅ If authored as a singleton with no structured principles, render the MDX body straight (no empty principle scaffolding).

---

## Page 4 — Projects (`/projects`)

**Purpose:** The work index — let evaluators filter and scan the breadth (software ↔ creative ↔ research ↔ oss) and dive into any case study. The primary "Work" anchor.

**Primary audience:** Recruiters and clients scanning for relevant work; engineers probing range and stack.

**Sections (top → bottom):**
1. **Index header** — `h1` "Projects" + one-line framing + result count (live region).
2. **Filter bar** — facets: **kind** (software/creative/research/oss), **status** (live/archived/wip), **tag**, **stack**; URL query-state (`?kind=`, `?tag=`), client-side, with a "Clear filters".
3. **Project grid** — responsive card grid sorted `featured → year → order`; each card: cover, title, kind badge, status badge, year, top stack chips, one headline metric.
4. **(Optional) "More to come"** footer note + Contact cross-link.

**Layout structure:** Content 1280 (or wide 1440 for the grid). Grid 3-col desktop / 2-col tablet / 1-col mobile, `12/8/4` aligned. Filter bar sticky-below-header on desktop (respecting focus-not-obscured), inline on mobile. Cards have explicit aspect ratios (no CLS).

**CTA strategy:** Cards are the CTA (whole-card click → `/projects/[slug]`). Secondary tag chips link to filtered views. Persistent header Contact. No competing filled CTA in the grid.

**SEO goal:** SSG. Intent: "Joshua Setiawan projects / portfolio / case studies." Title `"Projects — Joshua Setiawan"`. Canonical = clean `/projects` (filter query params are `noindex`-neutral, never indexable per [IA §3](./information-architecture.md)). Strong internal-link hub to all `/projects/[slug]`.

**Components:** `<FilterBar>` + `<FilterChip>` / `<Select>`, `<ProjectCard>`, `<KindBadge>`, `<StatusBadge>`, `<StackChip>`, `<MetricStat>`, `<EmptyState>`, `<ResultCount>` (live region).

**Responsive:**
- **Desktop:** 3-col grid; filter bar horizontal; card cover hover shader on capable devices.
- **Tablet:** 2-col grid; filter bar wraps; static covers.
- **Mobile:** 1-col; filters collapse into a "Filter" sheet/disclosure; covers static; chips horizontally scrollable.

**Animation plan:** `stagger-grid` (cards `reveal-up` on scroll, stagger `base60`), `card-cover-hover` (R3F shader sheen on capable devices; lift -6px + glow), `filter-relayout` (Framer `layout` reflow on facet change). `↺` instant reveal, static covers, no layout animation (immediate reflow).

**Empty / error states:** ∅ **Filtered, no matches** → `<EmptyState>` "No projects match these filters" + **Clear filters** (never a blank grid). ∅ No projects at all (unlikely) → "Case studies coming soon" + Contact. Filters preserve via URL on back/forward.

---

## Page 5 — Project Details (`/projects/[slug]`)

**Purpose:** Deliver a credible, skimmable case study (problem → approach → architecture → results) and route onward (live / repo / next / contact). The conversion engine of the Work cluster.

**Primary audience:** Hiring managers and clients doing due diligence; engineers reading the technical decisions.

**Sections (top → bottom):**
1. **Breadcrumb** — Home › Projects › *Title* (`nav[aria-label="Breadcrumb"]`, leaf `aria-current`).
2. **Case-study hero** — `h1` title, summary, role · year · `<StatusBadge>` · `<KindBadge>`; primary actions **Live ↗ / Repo ↗ / Case study ↗** (only those present in `links`).
3. **Cover** — LCP image (AVIF ≤120KB) with optional R3F cover-hover accent.
4. **Sticky TOC + body** — MDX case study (problem → approach → architecture → decisions → results) with a sticky in-article TOC (from `toc`).
5. **Metrics band** — `metrics[{label,value}]` as `<MetricStat>` (`tabular-nums`).
6. **Gallery** — `gallery[]` lightbox-capable grid.
7. **Stack + tags** — chips; tags link to `/projects?tag=`.
8. **Footer nav** — visible **Prev / Next project** (WCAG 2.5.7), "Back to all projects", Contact CTA.

**Layout structure:** Breadcrumb + hero in content 1280; body in **prose 720** with a `lg`-only sticky TOC rail (2-col: TOC 1 / prose 3). Metrics band full-width strip; gallery in wide 1440 grid; footer nav full-width.

**CTA strategy:** Primary external actions are the project `links` (Live/Repo/Case study, new tab `rel=noopener`). Onward navigation: Prev/Next + Back. Persistent Contact. Tag chips = lateral discovery.

**SEO goal:** SSG via `generateStaticParams`. Intent: the specific project name + problem domain. Title `"{Project} — Joshua Setiawan"`. Co-located build-time `opengraph-image`. JSON-LD `CreativeWork` (creative/research kinds) or `SoftwareSourceCode` (software/oss kinds) + `BreadcrumbList` per [IA §11](./information-architecture.md). Canonical self.

**Components:** `<Breadcrumbs>`, `<ProjectHero>`, `<LinkButton>` (Live/Repo/Case study), `<CoverImage>` + optional `<CoverShader>`, `<ArticleTOC>` (sticky), `<Prose>` + MDX registry (`<CodeBlock>`, `<Callout>`, `<MdxImage>`), `<MetricStat>`, `<ProjectGallery>` + `<Lightbox>`, `<StackChip>` / `<TagChip>`, `<PrevNextNav>`, `<CTABand>`.

**Responsive:**
- **Desktop:** 2-col (sticky TOC + prose); gallery 3-col; cover hover shader.
- **Tablet:** TOC becomes a collapsible top "On this page"; prose full-width; gallery 2-col.
- **Mobile:** single column; TOC as a collapsed disclosure; gallery 1–2 col; actions stack full-width; Prev/Next stacked.

**Animation plan:** `project-hero-reveal` (title TextReveal + actions fade-up), `cover-shader-hover` (R3F), `toc-active-sync` (scroll-spy highlight), `metrics-count-up` (GSAP scrub), `gallery-lightbox` (Framer scale/`layoutId` from thumbnail). `↺` instant reveals, static cover, no count-up, instant lightbox (no zoom), TOC highlight via plain scroll position.

**Empty / error states:** ⚠ **Unknown slug → `notFound()`** (Page 17). ∅ **No `gallery`** → omit the gallery section entirely. ∅ **No `metrics`** → omit metrics band. Missing optional `links` → that action button simply isn't rendered (never a dead/disabled link). ⚠ Cover asset 404 → `blurDataURL` placeholder persists + `alt` shows (no CLS).

---

## Page 6 — Research (`/research` + `/research/[slug]`)

**Purpose:** Present rigorous, verifiable work (papers, preprints, write-ups) with credibility signals (venue, status, DOI/PDF/code). Reinforces the "engineering depth" half of the brand.

**Primary audience:** Technical peers, academic/research-adjacent evaluators, engineering leaders.

### 6a. Research index (`/research`)

**Sections (top → bottom):**
1. **Index header** — `h1` "Research" + framing line + result count.
2. **Filter bar** — **status** (published/preprint/wip), **tag**.
3. **Research list** — items sorted `date desc` (`published` surfaced above `preprint`/`wip`); each: title, abstract excerpt, authors, venue, date, `<StatusBadge>`.

**Layout:** Content 1280; list as full-width rows (not a dense grid — research reads better as a list). Filter bar sticky-below-header.

### 6b. Research detail (`/research/[slug]`)

**Sections (top → bottom):**
1. **Breadcrumb** — Home › Research › *Title*.
2. **Header** — `h1` title, authors, venue, date, `<StatusBadge>`.
3. **Abstract** — callout-styled block.
4. **Artifact actions** — **PDF ↗ / DOI ↗ / Code ↗** (only those in `links`).
5. **Body** — MDX write-up with figures, citations, sticky TOC.
6. **Footer nav** — Prev/Next, back to `/research`, Contact.

**Layout (detail):** Breadcrumb + header content 1280; abstract + body in prose 720 with `lg` sticky TOC rail.

**CTA strategy:** Verifiability *is* the CTA — PDF/DOI/Code artifacts (new tab). Onward: Code ↗ → repo → `/open-source` / `/github`. Persistent Contact.

**SEO goal:** Index SSG; detail SSG via `generateStaticParams`. Intent: paper titles + research areas. Detail title `"{Paper} — Joshua Setiawan"`, co-located OG. JSON-LD `ScholarlyArticle` + `BreadcrumbList` (detail). Index = no special schema. Canonicals self.

**Components:** `<FilterBar>`, `<ResearchCard>` / `<ResearchListItem>`, `<StatusBadge>`, `<Breadcrumbs>`, `<AbstractCallout>`, `<LinkButton>` (PDF/DOI/Code), `<ArticleTOC>`, `<Prose>` + MDX registry, `<PrevNextNav>`, `<CTABand>`, `<EmptyState>`.

**Responsive:**
- **Desktop:** index list full rows; detail 2-col (TOC + prose).
- **Tablet:** index rows stack metadata; detail TOC collapses to top.
- **Mobile:** index single column; detail single column, artifact actions stack full-width.

**Animation plan:** `list-reveal` (rows `reveal-up`, stagger `base60`), `abstract-emphasis` (subtle fade-in), `toc-active-sync`. `↺` instant; list renders statically.

**Empty / error states:** ∅ **No published research** → `<EmptyState>` "Research in progress — see the blog for current writing" → `/blog`. ⚠ Unknown detail slug → `notFound()`. Missing artifact links → omit that button.

---

## Page 7 — Open Source (`/open-source`)

**Purpose:** Bridge curated narrative ("here's the OSS I care about and my role in it") with **live** repo signals, then funnel engineers to the full GitHub dashboard. One of two live-data routes.

**Primary audience:** Peer engineers, OSS maintainers, technical recruiters validating real contribution.

**Sections (top → bottom):**
1. **Header** — `h1` "Open Source" + a sentence on contribution philosophy.
2. **Curated highlights** — cards merging curated `{ repo, title, why, role, tags }` with **live** repo data (stars, primary language, last commit).
3. **Live activity strip** — recent contributions / top repos pulled live (ISR + optional React Query refresh).
4. **Bridge CTA** — prominent **"Full GitHub dashboard →"** → `/github`.

**Layout structure:** Content 1280; highlights as a 2-col card grid (3-up at xl); each card pairs the curated "why/role" narrative (foreground) with a live stat row (muted). Wide 1440 acceptable for the activity strip.

**CTA strategy:** Per repo: **"View repo ↗"** (new tab). Page-level: secondary text-link **"Full GitHub dashboard →"** (per [Navigation Structure §7](./navigation-structure.md)). Persistent Contact.

**SEO goal:** SSR + ISR (`revalidate`). Intent: "Joshua Setiawan open source / GitHub contributions." Title `"Open Source — Joshua Setiawan"`. No special schema. The curated `why/role` text is the indexable substance (live stats are enhancement). Canonical self.

**Components:** `<RepoCard>` (curated+live), `<StatRow>` (stars/lang/lastCommit), `<LanguageDot>`, `<LinkButton>` ("View repo ↗"), `<LiveBadge>` / `<StaleNote>`, `<DashboardBridgeCTA>`, `<EmptyState>`, `<RouteSkeleton variant="oss">`.

**Responsive:**
- **Desktop:** 2–3-col highlight grid; activity strip horizontal.
- **Tablet:** 2-col; activity wraps.
- **Mobile:** 1-col; live stat rows stack under the narrative; bridge CTA full-width.

**Animation plan:** `card-reveal` (stagger `base60`), `stat-fade` for live numbers on hydration, subtle `live-pulse` dot for "fresh" data (motion-adjacent — dropped under reduced-motion). `↺` instant; no pulse.

**Empty / error states:** ⚠ **Live fetch fails** → render ISR-cached snapshot; if none, show curated metadata only with a quiet "live stats unavailable" note (no error wall). ∅ **No curated entries** → fall back to top live repos. Per-card live miss → show curated text, hide the stat row (per [UX Flow §6](./ux-flow.md)).

---

## Page 8 — Blog (`/blog`)

**Purpose:** The writing index — surface thinking on performance, WebGL, React, craft, and career; capture soft conversions (subscribe/read). The "Writing" anchor.

**Primary audience:** Engineers and peers (depth/credibility); recruiters skimming for communication skill.

**Sections (top → bottom):**
1. **Index header** — `h1` "Blog" + framing + **Subscribe (RSS)** action.
2. **Filter bar** — **tag** filter; result count (live region).
3. **Featured/latest post** — optional larger lead card (most recent or pinned).
4. **Post grid** — cards sorted `date desc` (drafts excluded); each: title, description, date, reading time, tag, optional cover.

**Layout structure:** Content 1280; optional lead card full-width, then a 3-col (desktop) / 2-col (tablet) / 1-col (mobile) card grid. Filter chips horizontally scrollable on mobile.

**CTA strategy:** **Subscribe (RSS)** (icon + text, header + repeated in footer of detail) per [Navigation Structure §7](./navigation-structure.md). Cards = primary click → `/blog/[slug]`. Persistent Contact.

**SEO goal:** SSG. Intent: topical queries + "Joshua Setiawan blog." Title `"Blog — Joshua Setiawan"`. Single `rss.xml` feed (published only). Canonical = clean `/blog` (tag filters are UI-state, non-indexable). Internal-link hub to posts.

**Components:** `<RssButton>`, `<FilterBar>` / `<TagChip>`, `<BlogCard>` (+ `<FeaturedBlogCard>`), `<ReadingTime>`, `<EmptyState>`, `<ResultCount>`.

**Responsive:**
- **Desktop:** 3-col grid (+ lead card); covers static, hover lift.
- **Tablet:** 2-col.
- **Mobile:** 1-col; lead card collapses to standard card; tags scroll.

**Animation plan:** `stagger-grid` (`reveal-up`, stagger `base60`), card hover lift -6px. `↺` instant, no lift.

**Empty / error states:** ∅ **No posts / empty tag filter** → `<EmptyState>` "No posts yet — subscribe to be first" + RSS link (per [UX Flow §12](./ux-flow.md)).

---

## Page 9 — Blog Details (`/blog/[slug]`)

**Purpose:** Deliver a focused, highly readable article with first-class code, then capture a soft conversion (subscribe / share / read-next).

**Primary audience:** Engineers reading for substance; search visitors landing on a specific topic.

**Sections (top → bottom):**
1. **Breadcrumb** — Home › Blog › *Title*.
2. **Article header** — `h1` title, date, `updated?` ("Updated …"), reading time, tags.
3. **Reading-progress indicator** — thin top bar (desktop).
4. **Sticky TOC + body** — MDX body with Shiki code blocks (copy button), callouts, `blurDataURL` images; TOC from `toc`.
5. **Article footer** — **Share**, **Subscribe (RSS)**, **Prev/Next post**, related-by-tag list, Contact.

**Layout structure:** Breadcrumb + header content 1280; body in **prose 720** (65–72ch measure) with `lg` sticky TOC rail (TOC 1 / prose 3). Reading-progress fixed at the top edge under the header.

**CTA strategy:** Soft conversions: **Subscribe (RSS)** + **Share** + read-next (related tag). Persistent Contact. No hard CTA mid-article.

**SEO goal:** SSG via `generateStaticParams` (drafts excluded). Intent: the post's topic/keywords. Title `"{Post} — Joshua Setiawan"`, co-located OG. JSON-LD `BlogPosting` (+ `dateModified` from `updated`) + `BreadcrumbList`. Canonical self; included in `rss.xml`.

**Components:** `<Breadcrumbs>`, `<ArticleHeader>`, `<ReadingProgress>`, `<ArticleTOC>` (sticky, scroll-spy), `<Prose>` + MDX registry (`<CodeBlock>` + `<CopyButton>`, `<Callout>`, `<MdxImage>`), `<ShareRow>`, `<RssButton>`, `<RelatedPosts>`, `<PrevNextNav>`, `<CTABand>`.

**Responsive:**
- **Desktop:** 2-col (sticky TOC + prose); reading-progress bar visible.
- **Tablet:** TOC → collapsible "On this page" at top; progress bar retained.
- **Mobile:** single column; TOC collapsed disclosure; reading-progress hidden (clutter); footer actions stack.

**Animation plan:** `reading-progress-scrub` (GSAP scrub width 0→100%), `toc-active-sync`, `header-reveal` (TextReveal), `code-copy-feedback` (Framer check-swap). `↺` Reduced-motion: progress bar hidden, instant reveals, TOC via scroll position.

**Empty / error states:** ⚠ **Unknown or `draft` slug → `notFound()`** (drafts invisible in prod). ∅ No related-by-tag posts → omit the related block (keep Share/Subscribe/Prev-Next). ⚠ Image 404 → blur placeholder + alt persist.

---

## Page 10 — Experience (`/experience`)

**Purpose:** Give recruiters and managers a clean, scannable professional record (roles, scope, impact, stack) and route to the fuller career arc (`/timeline`) and CV.

**Primary audience:** Recruiters and hiring managers (résumé-parity, fast scan).

**Sections (top → bottom):**
1. **Header** — `h1` "Experience" + one-line summary + **Résumé/CV download**.
2. **Roles (reverse-chronological)** — each entry: role, company, location, start–end, summary, dated highlights, stack chips, optional **"See in timeline →"** (deep-anchors `/timeline` if `ref` matches).
3. **Skills/stack summary** — aggregated stack overview (optional).
4. **Bridge** — **"Full timeline →"** → `/timeline`; Contact CTA.

**Layout structure:** Content 1280; roles as a vertical list of full-width entries with a left rail showing dates/company and a right body of summary + highlights (2-col at `lg`; stacked below). Stable, document-like rhythm.

**CTA strategy:** **Résumé/CV download** (secondary) in header (per [Navigation Structure §7](./navigation-structure.md)); per-entry **"See in timeline →"**; page **"Full timeline →"**; persistent Contact.

**SEO goal:** SSG. Intent: "Joshua Setiawan experience / resume / work history." Title `"Experience — Joshua Setiawan"`. No special schema (the `Person` graph in root carries `worksFor`/`alumniOf` signals). Canonical self.

**Components:** `<ResumeButton>`, `<ExperienceEntry>` (role/company/dates/highlights), `<StackChip>`, `<TimelineDeepLink>` ("See in timeline →"), `<SkillSummary>`, `<CTABand>`.

**Responsive:**
- **Desktop:** 2-col entries (date/company rail + body).
- **Tablet:** entries stack into single column with a date eyebrow.
- **Mobile:** single column; highlights as a tight list; stack chips scroll.

**Animation plan:** `entry-reveal` (sequential `reveal-up`, stagger `base60`), highlight bullets `stagger-tight` (30). `↺` instant; static list.

**Empty / error states:** ∅ Sparse data → render available roles only (no skeleton padding). Missing `ref` on an entry → the "See in timeline" link is omitted.

---

## Page 11 — Timeline (`/timeline`)

**Purpose:** Tell the unified career/work arc as one scrollable narrative — aggregating roles, launches, awards, talks, education, milestones — and cross-link each event to its source page.

**Primary audience:** Recruiters/managers wanting the "story arc"; curious peers.

**Sections (top → bottom):**
1. **Header** — `h1` "Timeline" + **type legend** (role / launch / award / talk / education / milestone, each icon + color, never color-alone).
2. **Vertical timeline** — `type`-coded events in chronological (or reverse-chron) order; each: date, title, type icon/badge, description, optional **source link** (`ref` → `/projects/[slug]`, `/achievements`, `/experience`, etc.).
3. **Closing** — back-links to Experience + Contact.

**Layout structure:** Wide-ish content 1280; a central (desktop) or left-aligned (mobile) spine with alternating event cards (desktop) / single-column stacked cards (mobile). GSAP scrub reveals events on scroll.

**CTA strategy:** Events are lateral navigation (source links). Page-level: "Back to experience" + persistent Contact. No filled CTA (exploratory page).

**SEO goal:** SSG. Intent: "career timeline / journey." Title `"Timeline — Joshua Setiawan"`. No special schema. Aggregated content increases internal links to projects/achievements/experience. Canonical self.

**Components:** `<TimelineSpine>`, `<TimelineEvent>` (date/type/desc), `<TypeLegend>`, `<TypeBadge>` (icon+label), `<EventSourceLink>`, `<CTABand>`.

**Responsive:**
- **Desktop:** centered spine, alternating left/right event cards.
- **Tablet:** left spine, single-column cards.
- **Mobile:** left spine flush to gutter, compact stacked cards; legend wraps to a scrollable row.

**Animation plan:** `timeline-scrub` (GSAP ScrollTrigger reveals events sequentially as the spine "draws"; inside `gsap.matchMedia`), per-event `reveal-up`. `↺` Reduced-motion (matchMedia branch): spine + all events render as a **static list**, no draw/scrub (content never gated).

**Empty / error states:** ∅ **Sparse events** → render available events only; no padded skeletons (per [UX Flow §7](./ux-flow.md)). Event without `ref` → renders as non-link text.

---

## Page 12 — Gallery (`/gallery`)

**Purpose:** Add the human/taste dimension — visual craft, experiments, behind-the-scenes — that humanizes the engineer and reassures design-sensitive clients.

**Primary audience:** Prospective clients and design-minded evaluators; a personality layer for everyone.

**Sections (top → bottom):**
1. **Header** — `h1` "Gallery" + one-line framing.
2. **Category filter** — chips by `category`.
3. **Image grid** — justified/masonry grid from typed `gallery` data (`src, alt, caption, category, w/h, blurDataURL`); click → lightbox.
4. **Footer** — cross-links **About** + **Contact**.

**Layout structure:** **Wide 1440** container; justified rows (known `width/height` → no CLS) or masonry. Lightbox is a Radix dialog (Framer) with caption + category, `← →` keyboard nav, Esc to close, focus returns to trigger.

**CTA strategy:** Exploration-first. Footer cross-links About/Contact. Lightbox has no commercial CTA. Persistent Contact.

**SEO goal:** SSG. Intent: visual/portfolio browse + image search (rich `alt`). Title `"Gallery — Joshua Setiawan"`. No special schema. Each image carries meaningful `alt`; captions add context. Canonical self.

**Components:** `<CategoryFilter>` / `<FilterChip>`, `<GalleryGrid>` (justified/masonry), `<GalleryItem>` (`next/image` + `blurDataURL`), `<Lightbox>` (Radix dialog + `<CarouselControls>` Prev/Next per WCAG 2.5.7), `<EmptyState>`.

**Responsive:**
- **Desktop:** 3–4 justified columns; hover caption reveal.
- **Tablet:** 2–3 columns.
- **Mobile:** 1–2 columns; tap → lightbox; visible Prev/Next controls.

**Animation plan:** `grid-reveal` (`reveal-up`, stagger `tight30`), `lightbox-open` (Framer scale + `layoutId` from thumbnail), hover `caption-fade`. `↺` Reduced-motion: instant lightbox (no zoom), instant grid, captions shown statically (per [UX Flow §9](./ux-flow.md)).

**Empty / error states:** ∅ **Empty category** → inline "Nothing here yet" within the filtered view; the grid persists for other categories. ⚠ Image 404 → `blurDataURL` + `alt` persist (no CLS).

---

## Page 13 — Certificates (`/certificates`)

**Purpose:** Convert credentials into trust with verifiable, honest proof (issuer, date, verify link where real), then route toward Contact.

**Primary audience:** Recruiters and clients validating qualifications.

**Sections (top → bottom):**
1. **Header** — `h1` "Certificates" + one-line framing; optional **skill filter**.
2. **Certificate grid** — cards: name, issuer, date, skills chips, image/badge; **"Verify ↗"** when `credentialId` + `url` exist.
3. **Cross-link** — "See the work behind these" → `/projects`; persistent Contact.

**Layout structure:** Content 1280; 3-col (desktop) / 2-col (tablet) / 1-col (mobile) card grid; each card pairs the badge image with metadata + skills chips.

**CTA strategy:** Honesty signal: **"Verify ↗"** (new tab) only when a real verification URL exists — never fabricated. Cross-link to `/projects`; persistent Contact.

**SEO goal:** SSG. Intent: "Joshua Setiawan certifications / credentials." Title `"Certificates — Joshua Setiawan"`. No special schema (optionally `EducationalOccupationalCredential` is a future enhancement — **Assumption:** not in v1 scope). Canonical self.

**Components:** `<SkillFilter>` / `<FilterChip>`, `<CertificateCard>` (image + issuer + date + skills), `<VerifyLink>` ("Verify ↗"), `<TagChip>` (skills), `<EmptyState>`.

**Responsive:**
- **Desktop:** 3-col grid; badge + metadata side-by-side in card.
- **Tablet:** 2-col.
- **Mobile:** 1-col; badge above metadata; skills chips scroll.

**Animation plan:** `stagger-grid` (`reveal-up`, stagger `base60`), card hover lift -6px + subtle glow on the badge. `↺` instant, no lift/glow.

**Empty / error states:** ∅ **No certificates for a skill filter** → "No certificates in this area yet" (grid persists for other skills). ∅ **No verify link** on a card → show issuer + date only, never a fabricated link (per [UX Flow §8](./ux-flow.md)).

---

## Page 14 — Achievements (`/achievements`)

**Purpose:** Surface awards, recognition, and milestones (with proof where available) as concentrated credibility, then route to work/contact.

**Primary audience:** Recruiters, clients, and peers gauging external validation.

**Sections (top → bottom):**
1. **Header** — `h1` "Achievements" + one-line framing; optional **category filter**.
2. **Achievements list/grid** — grouped or filtered by `category`; each: title, date, category badge, description, optional **proof/link ↗**.
3. **Cross-link** — "See the work" → `/projects`; persistent Contact.

**Layout structure:** Content 1280; either a category-grouped list (section per category) or a filterable card grid (2–3 col). Cards lead with title + date; category as an icon+label badge.

**CTA strategy:** **"View proof ↗"** / external `link` when present (new tab). Cross-link to `/projects`; persistent Contact. No filled CTA competing in-grid.

**SEO goal:** SSG. Intent: "Joshua Setiawan awards / achievements / recognition." Title `"Achievements — Joshua Setiawan"`. No special schema (root `Person.award` signals where applicable). Canonical self.

**Components:** `<CategoryFilter>`, `<AchievementCard>` (title/date/category/desc), `<CategoryBadge>` (icon+label), `<ProofLink>` ("View proof ↗"), `<EmptyState>`.

**Responsive:**
- **Desktop:** 2–3-col grid or grouped sections.
- **Tablet:** 2-col.
- **Mobile:** 1-col; category badges as eyebrows.

**Animation plan:** `stagger-grid` (`reveal-up`, stagger `base60`), optional count-up on any numeric stat. `↺` instant, final values shown.

**Empty / error states:** ∅ **Empty category filter** → "Nothing in this category yet"; other categories persist. Missing `proof?`/`link?` → omit the proof action.

---

## Page 15 — GitHub Dashboard (`/github`)

**Purpose:** The flagship live-data page — prove sustained, real engineering activity (contributions, languages, top repos) and serve as the primary justification for TanStack Query + GitHub API caching. The strongest "I actually build" signal for engineers.

**Primary audience:** Peer engineers and technical recruiters who trust data over copy.

**Sections (top → bottom):**
1. **Header** — `h1` "GitHub" + a sentence framing + **last-updated timestamp** + **Refresh** control.
2. **Profile stat grid** — followers, public repos, total stars, total contributions (`<MetricStat>`, `tabular-nums`).
3. **Contribution calendar** — heat-ramp grid (tokens `#10131F → #1F3A5F → #2F6FB0 → #4F9BFF → #8FC2FF`); hover/focus day → count tooltip; focusable cells with `aria-label`.
4. **Language breakdown** — chart (chart-1…6 tokens) with a labeled legend.
5. **Top repos** — list/cards: name, description, stars, forks, primary language, updatedAt, "View repo ↗".
6. **Bridge** — cross-link to `/open-source`; persistent Contact.

**Layout structure:** **Wide 1440** container (data-dense). Stat grid 4-up; calendar full-width scrollable strip; language chart + top repos as a 2-col split (chart left / repos right at `lg`), stacked below. Optional R3F contribution depth/constellation accent (deferred-safe).

**CTA strategy:** **Refresh** (React Query refetch) + per-repo **"View repo ↗"** + bridge to `/open-source`. Persistent Contact. The data is the message; CTAs are utilitarian.

**SEO goal:** SSR + ISR (`revalidate ≈ 3600s`) + optional client React Query. Intent: "Joshua Setiawan GitHub / activity / stats." Title `"GitHub — Joshua Setiawan"`. No special schema (live metrics aren't durable structured data). First paint is the ISR snapshot (indexable HTML); refresh is client-only. Canonical self.

**Components:** `<RefreshControl>` + `<LastUpdated>`, `<ProfileStatGrid>` / `<MetricStat>`, `<ContributionCalendar>` (focusable cells + `<DayTooltip>`), `<LanguageBreakdownChart>` + `<ChartLegend>`, `<RepoCard>` / `<RepoList>`, optional `<ContributionDepthScene>` (3D), `<RouteSkeleton variant="dashboard">`, `<EmptyState>`, `<Toaster>` (refresh feedback).

**Responsive:**
- **Desktop:** 4-up stats; full calendar; 2-col chart/repos; optional 3D accent.
- **Tablet:** 2×2 stats; calendar horizontally scrollable; chart over repos (stacked).
- **Mobile:** 2-up or 1-up stats; calendar scrollable with sticky month labels; chart as a stacked bar/list; repos 1-col; 3D accent disabled.

**Animation plan:** `stats-count-up` (GSAP scrub on enter), `calendar-fill` (cells fade in level-by-level, stagger `tight30`), `chart-draw` (Framer/segment grow), optional `contribution-depth` (R3F, demand-frameloop). Refresh → skeleton shimmer → cross-fade to new values. `↺` Reduced-motion: final stats shown immediately, static calendar (no fill animation), static chart, 3D → static poster, refresh swaps without shimmer.

**Empty / error states:** ⚠ **Live fetch fails** → render ISR-cached snapshot; manual refresh failure → non-blocking sonner toast "Couldn't refresh — showing cached data." ∅ **Cold cache / no data** → skeleton → `<EmptyState>` "GitHub data is warming up, check back shortly." The page **never hard-fails** (per [IA §10](./information-architecture.md) / [UX Flow §6](./ux-flow.md)).

---

## Page 16 — Contact (`/contact`)

**Purpose:** Frictionless, accessible, trustworthy conversion — the funnel's terminus. One shared Zod schema validates client + Server Action; the form works progressively (JS-off safe).

**Primary audience:** Everyone converting — recruiters, clients, collaborators (intent select segments them).

**Sections (top → bottom):**
1. **Header** — `h1` "Contact" / "Let's build something" + a one-line invitation + expected response-time note.
2. **Contact form** — fields: name, email, message, **intent** (Hiring / Project inquiry / Collaboration / Other), hidden honeypot + time-trap; inline validation; error summary on submit; persistent inline success.
3. **Direct channels** — email (copy), LinkedIn, GitHub, optional calendar link.
4. **Privacy note** — one line → `/privacy` (PII transparency).

**Layout structure:** Content 1280 → 2-col at `lg` (form left / direct channels + reassurance right); single column below. Form is a vertical stack of labeled fields with `≥24px` (44px recommended) targets.

**CTA strategy:** Single primary **"Send message"** (filled `--primary`, loading/`aria-busy` state). Direct channels are equal-weight alternatives (esp. for the failure fallback). Header Contact CTA leads here from everywhere.

**SEO goal:** SSG shell + dynamic Server Action. Intent: "contact Joshua Setiawan / hire." Title `"Contact — Joshua Setiawan"`. No special schema (`Person.email`/`sameAs` live in root). Canonical self. `/privacy` linked for PII compliance.

**Components:** `<ContactForm>` (React Hook Form + Zod resolver), `<FormField>` / `<Input>` / `<Textarea>` / `<Select>`, `<Honeypot>` + `<TimeTrap>`, `<ErrorSummary>` (focus target), `<SubmitButton>` (loading), `<SuccessPanel>` (persistent inline), `<DirectChannels>` + `<CopyEmailButton>`, `<PrivacyNote>`, `<Toaster>` (secondary).

**Responsive:**
- **Desktop:** 2-col (form + channels); inline error summary above form.
- **Tablet:** 2-col or stacked depending on width; full-width inputs.
- **Mobile:** single column; channels below form; sticky submit comfortable; native input affordances + `autocomplete`.

**Animation plan:** `field-focus` (border `--border` → `--border-strong` + ring), `error-shake` **disabled by default** (use a static error reveal — no jarring shake), `submit-loading` (spinner + `aria-busy`), `success-reveal` (gentle fade of the persistent success panel). `↺` Reduced-motion: instant field/error/success transitions; no shake ever.

**Empty / error states (this page is mostly states):**
- ⚠ **Client-invalid** → focus `<ErrorSummary>` (lists + links each error), polite live-region announces count; no network call.
- ⚠ **Send failure (Resend/network)** → inline banner "Something went wrong — email me directly at {address}"; typed message **retained**, not cleared.
- ⚠ **Rate-limited** → polite "You've sent a few already — reach me directly at {address}."
- ✅ **Success** → **persistent inline success** ("Thanks — I'll reply within X business days"), form resets, announced politely; optional toast as secondary.
- 🤖 **Spam (honeypot/time-trap)** → silently accept-and-drop (no signal to bots).
- `↺` **JS-off** → Server Action posts and returns a server-rendered success/error state (per [UX Flow §10](./ux-flow.md)).

---

## Page 17 — 404 Not Found (`not-found.tsx`)

**Purpose:** Recover lost or mistyped navigation gracefully — keep the visitor in the experience, never a dead end. Triggered by unknown routes and bad/`draft` slugs (`notFound()`).

**Primary audience:** Anyone who hit a broken/old link or a typo (often from search or stale external links).

**Sections (top → bottom):**
1. **Branded headline** — large display "404 / Page not found" (this is the route's `h1`) + a calm, on-brand one-liner.
2. **Recovery actions** — **Search via ⌘K** (opens command palette), plus links to **Projects**, **Blog**, **Home**.
3. **Optional ambient accent** — a subtle, lightweight visual (no heavy 3D) consistent with the dark aesthetic.

**Layout structure:** Inherits the full shell (header + footer retained — orientation matters). Centered content in content 1280; vertically balanced; recovery links as a compact row/grid of `<LinkButton>`s.

**CTA strategy:** Lead with **search** (⌘K) as the universal recovery, then the three highest-value destinations. Persistent header Contact remains.

**SEO goal:** Returns **HTTP 404** (correct status, not soft-404). `noindex`. Title `"Page not found — Joshua Setiawan"`. Keeps nav + footer so crawlers still see the link graph. No schema.

**Components:** `<NotFoundHero>`, `<CommandTrigger>` ("Search via ⌘K"), `<LinkButton>` ×3 (Projects/Blog/Home), shell `<SiteHeader>` + `<SiteFooter>`.

**Responsive:**
- **Desktop:** centered, recovery links in a row.
- **Tablet:** centered, links wrap to 2-up.
- **Mobile:** stacked, full-width recovery buttons.

**Animation plan:** Minimal — a gentle `reveal-up` of the headline + actions; no scroll choreography, no pinning. `↺` instant. (Error/404 pages are intentionally static-safe and fully keyboard-navigable per [UX Flow §11](./ux-flow.md).)

**Empty / error states:** This *is* an error state. No data dependencies. Always renders (static), works JS-off; ⌘K degrades to a visible "Search" link/Home if JS is unavailable.

---

## Page 18 — Loading State (`loading.tsx`)

**Purpose:** Hold layout and communicate progress during navigation/streaming so perceived performance stays high and **CLS stays ≤0.02** — the skeleton must match the final layout's structure and dimensions exactly.

**Primary audience:** Every visitor, on every route transition and first streamed paint (most felt by mobile/slow-network users).

**Scope:** A **global** `app/loading.tsx` plus **per-segment** skeletons tuned to each route family's layout (per [IA §2](./information-architecture.md)).

**Sections / skeleton variants (per route family):**
1. **Global default** — header is real (shell renders immediately); main shows a generic content skeleton (title bar + paragraph lines + card placeholders).
2. **Index variants** — `projects` / `blog` / `research`: header + filter-bar placeholder + a card-grid of `<Skeleton>` cards at the **same grid + aspect ratios** as the real cards.
3. **Detail variants** — `projects/[slug]` / `blog/[slug]` / `research/[slug]`: breadcrumb + title block + cover placeholder + TOC rail + prose-line skeletons.
4. **Dashboard variant** — `github`: stat-grid + calendar + chart + repo-list skeletons (`<RouteSkeleton variant="dashboard">`).
5. **Gallery variant** — justified grid of aspect-locked image placeholders (uses known `width/height` so no reflow).

**Layout structure:** Each skeleton mirrors its target page's container width, grid columns, and element aspect ratios precisely so the swap to real content causes **zero layout shift**. The shell (header/footer) is never skeletonized — only `#main-content` streams.

**CTA strategy:** None (transient). The persistent header (with Contact + ⌘K) remains fully interactive during load.

**SEO goal:** Not indexed (transient streaming boundary). Its job is purely CWV/perceived-performance: protect LCP and CLS budgets. No metadata/schema.

**Components:** `<RouteSkeleton>` (variants: `default` / `index` / `detail` / `dashboard` / `gallery`), `<Skeleton>` primitive, `<SkeletonCard>`, `<SkeletonText>`, `<SkeletonChart>`. Dimensions/aspect ratios sourced from the same tokens as the real components.

**Responsive:** Each skeleton variant follows the **same** responsive grid as its target route (3/2/1-col indexes, 2-col→stacked details, 4/2/1 dashboard stats), so the placeholder reflows identically to the real content at every breakpoint.

**Animation plan:** `skeleton-shimmer` — a single low-cost shimmer/pulse (CSS, GPU-friendly), no JS animation libraries (skeletons must be cheap and ship in the first chunk). `↺` Reduced-motion / `prefers-reduced-motion`: shimmer becomes a **static** muted placeholder (no pulse), still clearly "loading" via shape.

**Empty / error states:** N/A — the skeleton *is* the in-between state. If streaming exceeds expectations, the skeleton simply persists (it never "errors"); a genuine render failure escalates to the route/global `error.tsx` (per [UX Flow §11](./ux-flow.md)), not to the skeleton.

---

## Appendix A — Page → cluster → schema map (consistency check)

| # | Route | Cluster ([IA §5](./information-architecture.md)) | Render | JSON-LD | Live data |
|---|---|---|---|---|---|
| 1 | `/` | (hub) | SSG | Person + WebSite | — |
| 2 | `/about` | Profile | SSG | ProfilePage | — |
| 3 | `/philosophy` | Profile | SSG (MDX) | — | — |
| 4 | `/projects` | Work | SSG | — | — |
| 5 | `/projects/[slug]` | Work | SSG | CreativeWork / SoftwareSourceCode + BreadcrumbList | — |
| 6 | `/research` (+`[slug]`) | Writing | SSG | ScholarlyArticle + BreadcrumbList (detail) | — |
| 7 | `/open-source` | Work | SSR + ISR | — | ✓ GitHub |
| 8 | `/blog` | Writing | SSG | — | — |
| 9 | `/blog/[slug]` | Writing | SSG | BlogPosting + BreadcrumbList | — |
| 10 | `/experience` | Profile | SSG | — | — |
| 11 | `/timeline` | Profile | SSG | — | — |
| 12 | `/gallery` | Proof | SSG | — | — |
| 13 | `/certificates` | Proof | SSG | — | — |
| 14 | `/achievements` | Proof | SSG | — | — |
| 15 | `/github` | Work | SSR + ISR + RQ | — | ✓ GitHub |
| 16 | `/contact` | Connect | SSG + Server Action | — | — |
| 17 | `not-found` | Utility | static (404) | — | — |
| 18 | `loading` | Utility | streamed | — | — |

## Appendix B — CTA hierarchy invariant

Per [Navigation Structure §7](./navigation-structure.md): exactly **one** filled accent CTA in the chrome at a time — **Contact** (persistent header). Every page-level primary CTA uses `--primary`/secondary hierarchy so the header CTA stays unmistakable. Pages with a closing **`<CTABand>`** (Landing, About, Philosophy, Project Detail, Research Detail, Experience, Timeline, Gallery, Certificates, Achievements, GitHub) always route to `/contact` (primary) + the nearest work cluster (secondary).

## Appendix C — Reduced-motion guarantee

Every page above ships a `↺` branch (single gate: OS `prefers-reduced-motion` OR in-app Pause-motion OR `saveData` → `data-motion` on `<html>`). Under reduced motion: Framer `reducedMotion="user"`, GSAP timelines resolve to their static end-state inside `gsap.matchMedia` (no pin/scrub), Lenis is **not** instantiated (native scroll), and the persistent canvas renders its **static poster** (the poster is the LCP on Landing). **Content is never gated behind animation** and is fully operable JS-off where server-rendered.

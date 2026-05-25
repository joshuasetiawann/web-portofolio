# Creative Direction

> Purpose: define the visual storytelling and design philosophy for Joshua Setiawan's portfolio — how the "Immersive Dark + 3D" aesthetic is composed across hero, sections, depth, gradient, code-inspired and abstract visuals, project imagery, and editorial type, and the principles (visual, layout, spacing, interaction, motion, accessibility, performance-first) that govern every screen.

This is the art-direction spine. It translates the brand into pixels and motion. Strategy lives in [product-strategy](./product-strategy.md); the brand voice and personality live in [brand-identity](./brand-identity.md); the literal values referenced here are owned by [design-tokens](./design-tokens.md), [color-system](./design-tokens.md), [typography](./typography-system.md), [motion-system](./animation-strategy.md), [layout-grid-spacing](./design-system.md), [webgl-3d-system](./three-strategy.md), [accessibility](./accessibility-strategy.md), and [performance-budget](./performance-strategy.md). When a number appears here it is a quotation of those docs, never a new invention.

---

## 1. The one-sentence creative thesis

**The site should feel like a calm, dark control room for a creative engineer — deep and cinematic, but legible, fast, and never loud.** Immersion is a frame around the work, not a substitute for it. Every visual flourish must survive the question: *does this make the work clearer, more credible, or more memorable?* If not, it is cut.

This duality — **immersive on the surface, rigorous underneath** — is the entire art direction in one line. See the positioning pillars in [product-strategy](./product-strategy.md#1-positioning-strategy).

---

## 2. Directional reference touchstones (vibe only)

These are *feel* references, not things to copy. We borrow a quality from each, never a layout.

| Touchstone | What we borrow (the quality) | What we explicitly do NOT borrow |
|---|---|---|
| **Linear** (linear.app) | Calm dark precision; restrained gradients as light, not decoration; surgical spacing; the sense that an engineering team made every pixel. | Their product-marketing density and feature-grid sameness. |
| **Vercel / Next.js brand surfaces** | Editorial-engineering confidence; high-contrast type on near-black; geometry and grid as identity. | Pure black flatness and the monochrome-only restraint — we carry an azure→teal signature. |
| **Awwwards "Immersive Dark + 3D" SOTD tier** (e.g. Active Theory / Lusion-class craft) | Cinematic depth, one hero WebGL moment, motion that feels physical and authored. | Scroll-jacking, long pre-loaders, decoration-for-decoration, mystery navigation. |
| **Kontinui / editorial portfolio dark tier** | Generous whitespace, magazine-grade typographic rhythm, the "quiet luxury" of a confident single voice. | Sparse-to-the-point-of-empty content; we have 18 routes of substance to show. |

The synthesis these four imply: **Linear's calm + Vercel's editorial-engineering + Awwwards depth + magazine whitespace.** None of them alone; the intersection is ours.

---

## 3. Visual storytelling

### 3.1 Hero narrative — the "Signal Field"

The Landing hero is the thesis stated in three seconds. It is a single, persistent dark stage carrying one authored 3D moment: the **"Signal Field"** — GPU-instanced particles driven by a curl-noise vertex shader, drifting like a field of coherent signal resolving out of noise (the metaphor: *order emerging from complexity* — exactly what an engineer does).

| Layer | Role | Notes |
|---|---|---|
| **Backdrop** | `--background #05070D` near-black stage with the `--gradient-surface` falloff. | The dark is the canvas; the eye finds the light. |
| **3D Signal Field** | Curl-noise particle field, azure→teal coloration drawn from `--gradient-accent` (#5E8BFF→#38E8C8). | `frameloop="demand"`, DPR clamped [1, 1.75]. Reacts subtly to pointer; never demands interaction. |
| **Type plate** | `display-2xl` headline (clamp 3.5→7.5rem, lh 0.95, -0.03em) in Space Grotesk — **this is the `<h1>`**. | The headline IS the LCP candidate on capable devices; the poster IS the LCP on others. |
| **Eyebrow + sub** | Geist Mono eyebrow (0.75rem, uppercase, 0.14em) naming the hybrid role; one calm body-lg line of value. | Two type families maximum in view. |
| **One primary CTA** | A single magnetic affordance toward the work / contact. | No competing buttons; restraint signals confidence. |

**Reduced-motion / no-WebGL / low-tier path:** the Signal Field is replaced by a **static poster** that *is* the LCP element — same composition, same azure→teal light, no JS dependency. The hero reads identically with motion off. Content is never gated behind animation. See [webgl-3d-system](./three-strategy.md) and the reduced-motion gate in [motion-system](./animation-strategy.md).

**Do / Don't (hero):**

- Do let the dark breathe; the headline should sit in space, not in a box.
- Do treat the 3D as ambient light behind type, not a foreground spectacle competing with it.
- Don't add a loading spinner, an intro curtain longer than a page transition, or a "scroll down" gimmick that hijacks the wheel.
- Don't stack two CTAs of equal weight.

### 3.2 Section rhythm — the cinematic cut

Below the hero, the page is edited like a film, not stacked like a feed. Each section is a **scene** with a single job, separated by deliberate breathing room (`--section-y` clamp 6→12rem). Rhythm comes from **alternating density**: an immersive/visual scene is always followed by a quieter editorial scene, so attention recovers before it is spent again.

| Scene type | Density | Typical content | Motion budget |
|---|---|---|---|
| **Statement** | Low (mostly whitespace) | A single editorial line, an eyebrow, a pull-quote-scale claim. | Reveal-on-enter only. |
| **Proof** | Medium | Featured projects, metrics, GitHub snapshot, certificates strip. | Staggered reveals (base 60ms), magnetic cards. |
| **Immersion** | High | A pinned/scrubbed GSAP moment, a shader accent, the gallery. | Scroll-scrub (one per long page max). |
| **Human** | Low–medium | About teaser, philosophy line, a real photograph. | Soft fades; warmth over flash. |

**Rule of one big moment per page.** A page earns exactly one "immersion" scene (a pin, a scrub, a shader). More than one cheapens all of them and blows the [performance-budget](./performance-strategy.md). GSAP/ScrollTrigger owns these; see the division of labor in [motion-system](./animation-strategy.md#division-of-labor).

### 3.3 Whitespace strategy — space as a luxury good

Whitespace is the cheapest signal of premium and the most abused. Our discipline:

- **Vertical rhythm is non-negotiable.** Sections use `--section-y`; nothing crowds the fold-to-fold transition.
- **Horizontal gutters are generous and fluid:** `gutter clamp(1.25rem, 5vw, 4rem)`. Content max 1280, prose max 720 (measure 65–72ch). Long text never runs full-bleed.
- **Whitespace is asymmetric, not centered-everything.** A 12/8/4 grid lets a headline sit in 7 columns with 5 columns of deliberate emptiness — tension, not symmetry.
- **One focal point per viewport.** If two things fight for the eye, add space, don't add size.
- **Empty states and "thin" routes are a feature, not a bug.** The Statement scenes are *meant* to be mostly air.

See [layout-grid-spacing](./design-system.md) for the grid and spacing scale.

### 3.4 Depth strategy — layered dark, not drop-shadows

Depth is built from **stacked dark surfaces, hairline borders, soft glow, and parallax** — never from heavy, generic shadows.

| Technique | How we use it | Token source |
|---|---|---|
| **Surface elevation** | Step through `--surface-1 #0A0D16` → `--surface-2 #10131F` → `--surface-3 #171B2A` to imply layers. | [color-system](./design-tokens.md) |
| **Hairline borders** | `--border #222838` / `--border-strong #2E3548` define edges where shadow would be crude. | [design-tokens](./design-tokens.md) |
| **Elevation shadows** | `elev-1…elev-4` (dark, e.g. `elev-3 0 12px 40px rgba(0,0,0,.55)`) used sparingly on modals/menus, each with an inset top hairline for a "lit edge". | [design-tokens](./design-tokens.md) |
| **Glass** | `backdrop-blur 12px` on nav, cards, command palette — **with a solid fallback under `prefers-reduced-transparency`**. | [design-tokens](./design-tokens.md) |
| **Glow** | `--glow-accent` (accent@12% ring + glow@45% bloom) as a *spotlight*, never an outline-everywhere. Glow is excluded from contrast math. | [color-system](./design-tokens.md) |
| **Parallax / 3D** | The single persistent `<Canvas>` and gentle scroll parallax give the deepest layer; foreground type stays crisp and flat. | [webgl-3d-system](./three-strategy.md) |

**Do / Don't (depth):**

- Do build the z-axis with value steps and one well-placed glow.
- Don't drop a soft gray blur shadow under every card — that reads cheap and flattens the dark.
- Don't blur text or place body copy over busy 3D; immersion lives *behind* a calm reading plane.

### 3.5 Gradient usage — light, not paint

The signature gradient `--gradient-accent linear-gradient(135deg, #5E8BFF, #38E8C8)` (azure→teal) is the brand's one indulgence. It behaves like **a beam of light**, used at three scales:

1. **Trace** — 1px borders, underlines, focus accents, the active-nav indicator, chart key lines.
2. **Wash** — large, low-opacity background sweeps and the `--gradient-surface` falloff that grounds sections.
3. **Glow** — emissive material color in the 3D, the bloom in `--glow-accent`, hover light on project covers.

Rules: **one gradient identity, used rarely.** Never fill a button face with it as the default state; never run rainbow multi-stop gradients; never gradient body text. The accent earns its impact by scarcity. Charts use the categorical `chart-1…chart-6` set and the contribution heat ramp (`#10131F → #1F3A5F → #2F6FB0 → #4F9BFF → #8FC2FF`) — those are *data* colors, governed by [color-system](./design-tokens.md), not decoration.

### 3.6 Code-inspired visual usage — craft, not cosplay

Engineering is shown through *real, beautiful artifacts*, not "hacker" clichés (no Matrix rain, no neon terminal glow).

- **Shiki dual-theme code blocks** are first-class typographic objects: semantic dark syntax (keyword #5E8BFF, function #38E8C8, string #3DD68C, number #F5B544, comment #687085, type #A78BFA), Geist Mono at `code 0.875rem`, generous line height, optional line-highlight. Code is set like editorial pull-quotes — it is content, framed with respect.
- **Mono as a system voice.** Geist Mono carries eyebrows, technical labels, metric units, timestamps, and breadcrumbs — a quiet "this was built by an engineer" signal in the UI chrome itself.
- **Tabular numerals** for every stat, date, and metric, so figures align and read like instrument readouts.
- **Honest UI seams.** Subtle, intentional details — a hairline grid, a monospaced commit hash on the GitHub dashboard, a tasteful `// comment`-style annotation — reference code culture without costume.

See [typography](./typography-system.md) for the type roles and the Shiki setup.

### 3.7 Abstract system visuals — diagrams of thought

Where a topic is conceptual (Philosophy, About's "how I think", a project's architecture), we use **restrained abstract systems** rather than stock imagery:

- **Node-and-edge constellations** (a tech graph, a contribution constellation) rendered as thin lines + small nodes in accent/foreground-muted — a visual language of *connected, structured thinking*.
- **Gradient-mesh aurora** on About (a soft, slow azure→teal field) as a human-warm backdrop to the personal story.
- **Particle/field systems** (the hero, optional GitHub contribution depth) sharing one visual DNA so the site feels authored, not assembled.

These are always: low-contrast, behind content, reduced-motion-safe (static poster), and `aria-hidden` + `tabindex="-1"`. They imply a system mind without ever becoming the message.

### 3.8 Project image strategy — the work, presented like a gallery

Projects are the credibility lead ([product-strategy](./product-strategy.md#primary-goal)). Their imagery is treated like a curated exhibition.

| Aspect | Direction |
|---|---|
| **Covers** | One strong, consistent cover per project (`cover` Image in the [content-model](./information-architecture.md)). AVIF, LCP-class image ≤120KB, with `blurDataURL` for zero CLS. |
| **Framing** | Consistent aspect ratios and a quiet dark mat around each shot, so a diverse portfolio reads as one cohesive body of work. |
| **Hover** | A subtle project-cover **hover shader** (emissive accent light sweep) — an accent moment, not a carousel of effects. Static under reduced-motion. |
| **Case studies** | `gallery` images + `metrics[{label,value}]` tell the *outcome*, not just the screenshot. Numbers in tabular Mono. |
| **Color tie-in** | Optional per-project `color?` tints accents within that project's detail page — variety inside one system. |
| **Real over mockup** | Prefer real product UI and authentic context over glossy device mockups; if a mockup is used, keep it dark, minimal, and on-brand. |

Don't: letterbox everything to 16:9 by force, use watermarked stock, or hide weak shots behind heavy effects. A missing-but-honest placeholder beats a dishonest dazzle.

### 3.9 Editorial typography usage — type as the lead actor

On a dark stage, **type carries the show.** Space Grotesk (display, ≥h2) provides character and edge; Geist Sans (body/UI) provides calm legibility; Geist Mono (technical voice) provides credibility.

- **Display type is composition.** `display-2xl`/`display-xl` headlines are placed off-grid, set tight (−0.03em to −0.025em), and given room — they are images made of letters.
- **Hierarchy through scale + space, not weight soup.** The fluid scale (display-2xl → caption) does the work; we resist piling on bold weights and colors.
- **Measure discipline.** Body holds 65–72ch; line height 1.65 for comfortable reading on dark.
- **Max two families per viewport.** Mono + one of (Space Grotesk / Geist Sans) at a time. Eyebrows in Mono set up display headlines — a recurring editorial cadence.
- **Color-as-emphasis is rationed.** Foreground `#EAEDF5` for primary, `--foreground-muted #A4ABBD` for secondary, `--foreground-subtle #687085` for tertiary; accent color on type only for a single deliberate word, never paragraphs.

See [typography](./typography-system.md) for the full scale and pairing rules.

### 3.10 Balance between technical and human storytelling

The site must prove *competence* and earn *trust* — head and heart. We alternate registers deliberately:

| Technical voice (credibility) | Human voice (trust) |
|---|---|
| Live GitHub dashboard, metrics, architecture diagrams, code blocks, performance/a11y scores. | A real photograph and a first-person About; the *why* behind Philosophy; a calm, plainspoken Contact. |
| Mono labels, instrument-readout stats, system constellations. | Aurora warmth, generous whitespace, a single confident sentence that sounds like a person. |
| "Here is what I built and how it performs." | "Here is how I think and why it matters to you." |

**The bridge is craft.** The most human thing on the site is also the most technical: a portfolio this fast, accessible, and beautiful is itself an act of care. Engineering depth *is* the human story. Neither voice is allowed to fully eclipse the other for more than one scene at a time.

---

## 4. Design philosophy

### 4.1 Visual style

- **Dark-first, cinematic, editorial-meets-engineering.** Dark is the default and the canvas (`next-themes`, dark default); light is a fully-considered equal, not an afterthought.
- **Restraint as the dominant note.** Near-black surfaces, one azure→teal signature, sharp type, glass and glow used like seasoning.
- **Coherence over novelty.** One particle/field DNA, one gradient, one type system, one motion vocabulary — repeated until it feels inevitable.
- **Premium = precise.** Crisp edges, hairline borders, perfect alignment, zero layout shift. Polish is the brand.

### 4.2 Layout principles

- **12 / 8 / 4 column grid** (desktop / tablet / mobile); content 1280, wide 1440, prose 720; fluid gutters.
- **Asymmetry with intent** — off-grid headlines, deliberate emptiness, single focal point per viewport.
- **Sticky header that never obscures focus** (WCAG 2.4.11 focus-not-obscured); logo wordmark collapses to a "JS" monogram on scroll.
- **Containers are honest** — prose constrained to a readable measure even on ultrawide.
- See [layout-grid-spacing](./design-system.md).

### 4.3 Spacing principles

- **4px base scale** (`space-1`=4 … `space-48`=192); section rhythm `--section-y clamp(6rem, 12vw, 12rem)`.
- **Space is the primary tool for hierarchy** — increase distance before increasing size or weight.
- **Consistent rhythm beats clever rhythm** — the same vertical cadence everywhere makes the rare break land.
- **Touch targets ≥24px** (WCAG 2.5.8) with comfortable padding; never cramped.

### 4.4 Interaction principles

- **Calm, physical, and rewarding** — magnetic affordances (max 18px pull, `magnetic` spring), soft hover lifts (card −6px), focus light that feels like a spotlight.
- **Feedback is instant and honest** — `sonner` toasts, inline form validation, optimistic states; nothing fakes success.
- **Cmd+K command palette** (`cmdk`) as a power-user signal and the fast path to the 16 destinations; the Explore mega-menu mirrors it for mouse users.
- **No scroll-jacking, ever.** Lenis smooths the *native* scroll; it animates nothing and never traps the user. Horizontal/carousel views get visible Prev/Next controls (WCAG 2.5.7).
- See [interaction-microinteractions](./interaction-plan.md).

### 4.5 Motion principles

- **Motion has a job or it is cut.** It directs attention, expresses state, or reveals structure — never decorates idly.
- **Strict division of labor:** Framer = state/lifecycle (enter/exit, layout, gestures, page-transition curtain); GSAP+ScrollTrigger = scroll progress, pin, scrub, multi-step timelines; Lenis = smooth scroll + the single scroll value; R3F = WebGL reading a shared store. **One rAF** drives all of it (`gsap.ticker` → `lenis.raf`; `lenis.on(scroll)` → `ScrollTrigger.update`).
- **Authored easing, not default linear.** Out `(.22,1,.36,1)`, out-expo `(.16,1,.3,1)`, springs `snappy/soft/layout/magnetic`. Exits ≈0.7× enter.
- **One big scroll moment per page;** reveals are quick (durations fast 160 / base 280), staggers tight 30–base 60, travel small (xs8–md24, hero80), blur 6→0.
- **Reduced motion is a first-class path, not a degradation.** A single gate (OS `prefers-reduced-motion` OR in-app toggle OR `saveData` → Zustand → `<html data-motion>`) makes everything static, drops Lenis to native scroll, and swaps 3D for posters. An explicit **Pause-motion control** is provided (WCAG 2.2.2).
- See [motion-system](./animation-strategy.md).

### 4.6 Accessibility principles

- **WCAG 2.2 AA is the floor; content routes target AA→AAA legibility.** Accessibility is part of the premium, not a compliance tax.
- **Content is never gated behind animation** — visible by default, JS-off safe, SSR/SSG first.
- **Contrast is measured against the painted background** (glow excluded). The dark palette's foreground steps are chosen to clear AA on `--background`/surface tiers.
- **Never color alone** — state is reinforced with icon, text, or shape (critical given the dark + accent palette).
- **Structure for assistive tech:** one labeled landmark of each type, exactly one `<h1>` per route (the hero display type IS the h1), skip-to-content first, focus moved to `#main-content` with a polite live-region announce on route change, Radix overlays with focus trap + return-to-trigger, `:focus-visible` via a ≥2px **outline** that survives forced-colors.
- **Decorative canvas/visuals** are `aria-hidden` + `tabindex="-1"`.
- See [accessibility](./accessibility-strategy.md).

### 4.7 Performance-first design decisions

Design choices are made *with* the budget, not against it. The aesthetic is *engineered* to be fast.

| Decision | Why it is also a performance win |
|---|---|
| **Single persistent `<Canvas>`** (dynamic, `ssr:false`, `frameloop="demand"`, DPR [1,1.75], tunnel-rat portal) | One WebGL context for the whole site; renders on demand; pauses off-screen via IntersectionObserver; disposes on unmount. |
| **Poster IS the LCP** on 3D routes | The hero's static image is the paint target — heavy JS never blocks LCP (≤2.5s p75 mobile). |
| **Zero three/gsap/framer in any first-load chunk** | Shared baseline JS ≤95KB gz; per-route ≤160/175/200KB gz tiers. Motion libs are lazy-loaded after paint. |
| **LazyMotion + `m.*`** | Framer ships a fraction of its weight to the client. |
| **Dark-first, low-luminance surfaces** | Less aggressive backlighting; pairs with AVIF covers ≤120KB and ≤2 preloaded fonts (≤45KB). |
| **Velite MDX → static** + RSC/SSG content | Primary content is server-rendered HTML; CWV (LCP ≤2.5s, INP ≤200ms, CLS ≤0.02) protected by design. |
| **Glass with solid fallback** | `backdrop-blur` is GPU-cheap at 12px and degrades gracefully under reduced-transparency. |
| **No three on routes that don't use it** | The cost of immersion is paid only where it earns its keep. |

The budget is the brief. A beautiful frame that misses LCP ≤2.5s or CLS ≤0.02 is not on-brand — it is broken. See [performance-budget](./performance-strategy.md).

---

## 5. Quick reference — the creative rulebook

1. One thesis: **immersive surface, rigorous core.**
2. One hero 3D moment ("Signal Field"); poster IS the LCP.
3. One big scroll moment per page; alternate dense and quiet scenes.
4. One gradient identity (azure→teal), used as *light*, rationed.
5. Depth from layered dark + hairlines + one glow, not gray drop-shadows.
6. Type leads; max two families per viewport; mono is the engineer's voice.
7. Whitespace is asymmetric and generous; one focal point per viewport.
8. Code and data are content, framed with respect — no hacker cosplay.
9. Motion has a job or it's cut; reduced-motion is a first-class path.
10. The performance and accessibility budgets are the brief, not constraints on it.

---

### Related documents

[brand-identity](./brand-identity.md) · [design-tokens](./design-tokens.md) · [color-system](./design-tokens.md) · [typography](./typography-system.md) · [motion-system](./animation-strategy.md) · [layout-grid-spacing](./design-system.md) · [interaction-microinteractions](./interaction-plan.md) · [iconography-imagery](./brand-identity.md) · [webgl-3d-system](./three-strategy.md) · [accessibility](./accessibility-strategy.md) · [performance-budget](./performance-strategy.md) · [product-strategy](./product-strategy.md) · [content-model](./information-architecture.md)

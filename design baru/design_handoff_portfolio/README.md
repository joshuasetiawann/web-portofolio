# Handoff: Joshua Setiawan — Portfolio landing (remake)

## Overview
A single-page, immersive-dark portfolio landing for **Joshua Setiawan** (creative developer & software engineer). It leads with an animated **"Signal Field"** hero (a constellation/particle canvas), huge editorial typography, and a scroll-through of: stats → tech marquee → featured/selected work → point-of-view statement → philosophy → capabilities → experience → writing & research → gallery → contact → footer.

The visual language is the one already documented in the repo's own `docs/` (brand-identity, creative-direction, design-tokens, typography-system): near-black stage, one azure→teal gradient used as *light*, hairline borders, Space Grotesk + Geist + Geist Mono, calm authored motion.

## About the design files
The files in this bundle are **design references created in HTML** — a working prototype that shows the intended look, motion, and behavior. They are **not** production code to paste in.

> Your task is to **recreate this design inside the existing Next.js codebase** (`web-portofolio`, App Router + TypeScript + Tailwind v4 + shadcn/ui + Framer Motion + R3F), using its established tokens, components, data layer, and patterns — not to ship the HTML directly.

Good news: the repo is already set up for almost all of this. Most of the work is **composition + a hero canvas**, not new infrastructure. See "Mapping to your existing repo" at the end.

The prototype was authored as a "Design Component" (`.dc.html`) — a streaming-HTML format with a tiny runtime (`support.js`) and `{{ }}` template holes. Ignore the runtime; read it as annotated HTML + a plain JS class. `image-slot.js` is just a drag-drop image placeholder used so empty image areas look intentional — in Next.js these become `next/image`.

## Fidelity
**High-fidelity (hifi).** Colors, typography, spacing, radii, easing, and interactions are final and exact (values below). Recreate pixel-faithfully with the repo's libraries. The only placeholders are the **images** (project covers + gallery) and the **sample copy/data** (already flagged as placeholder in `src/data/*`).

---

## Screens / Views
One continuous page. Sections in DOM order (each `<section>` has the `id` used by nav + smooth-scroll):

### 0. Header — fixed, `z-index:50`
- **Layout:** full-width, inner container `max-width:1240px`, padding `15px clamp(20px,5vw,56px)`, flex space-between.
- **Left:** wordmark `Joshua Setiawan.` (Space Grotesk 600, 18px, `-0.02em`; the period is teal `--accent-2`). On scroll it **cross-fades to a `JS.` monogram**.
- **Right:** a `Menu ⌘K` button (Geist Mono 12px, hairline border, radius 11px) that opens the Jump Menu, and a gradient **Get in touch** pill (magnetic).
- **Scroll behavior:** at `scrollY > 32`, a `--hdr` variable goes `0→1`, driving: background `rgba(5,7,13, hdr*0.72)`, `backdrop-filter: blur(hdr*14px)`, bottom border `rgba(34,40,56, hdr*0.9)`, wordmark `opacity:1-hdr` / monogram `opacity:hdr`. Transitions `.4–.45s ease`.

### 1. Jump Menu overlay — fixed, `z-index:60`
- Full-screen `rgba(4,6,11,.86)` + `blur(16px)`. Opens via the Menu button, **⌘K / Ctrl+K**, closes via **Esc**, the ✕ button, or picking a link. Locks body scroll while open.
- Big nav links (Space Grotesk 600, `clamp(2rem,6vw,3.6rem)`) each prefixed with a mono index `01–05`; hover shifts text to `--accent` and indents `padding-left:14px`. Socials row (Geist Mono 13px) at the bottom.

### 2. Hero — `min-height:100vh`, padding `130px 0 90px`
- **Background layers (z-order):** (z0) radial azure glow top-center `radial-gradient(72% 60% at 50% -6%, rgba(--glow,.18), transparent 62%)`; (z0) 66px grid of `rgba(34,40,56,.45)` hairlines masked by a radial fade, `opacity:.55`; (z1) the **Signal Field `<canvas>`**; (z1) a pointer **spotlight** `radial-gradient(340px circle at var(--mx) var(--my), rgba(--glow,.12), transparent)`.
- **Content (z2), left-aligned, container 1240:**
  - Eyebrow row: mono `CREATIVE DEVELOPER · SOFTWARE ENGINEER` (12px, `.22em`, uppercase, `#A4ABBD`, with a small rotated-square gradient dot) + an **"Open to new work"** pill with a pulsing teal dot (`@keyframes pulseDot`).
  - **H1 name:** two blocks — `Joshua` (`#EAEDF5`) then `Setiawan` (azure→teal gradient text) + a teal `.` — Space Grotesk 600, `font-size:clamp(3.4rem,13vw,10rem)`, `line-height:0.9`, `letter-spacing:-0.03em`.
  - Sub (Geist, `clamp(1.05rem,1.4vw,1.25rem)`, `1.65`, `#A4ABBD`, max-width 600): *"I build interfaces where rigorous engineering meets expressive design — fast, accessible, quietly ambitious software, and the occasional thing that moves."*
  - CTAs: **See the work** (gradient pill, magnetic) + **Get in touch** (outline pill, magnetic).
  - Bottom-center **scroll cue**: mono `SCROLL` + a 1px gradient line bobbing (`@keyframes cueMove`).

### 3. Stats strip
- Bordered top+bottom row, `grid-template-columns:repeat(auto-fit,minmax(210px,1fr))`, each cell padded, with a `border-left` divider.
- 4 cells — label (mono 11px `.16em`), value (Space Grotesk 600, `clamp(2.4rem,4vw,3.3rem)`, `tabular-nums`), note (13px `#A4ABBD`):
  - Building since — **5+ yrs**; Projects shipped — **6**; Open source — **4+**; Writing & research — **7+**.

### 4. Tech marquee
- Full-bleed band (`#07090F`, hairline top/bottom), infinite horizontal scroll (`@keyframes marqueeX` translateX 0→-50%, 36s linear; duplicate the list twice for a seamless loop).
- Words in **outlined** Space Grotesk (`color:transparent; -webkit-text-stroke:1px #333c52`, `clamp(1.5rem,3.4vw,2.7rem)`), separated by rotated-square accent diamonds. Items: Design Systems, WebGL, Motion, Performance, Accessibility, TypeScript, React, Three.js, Realtime, Shaders, Next.js, Systems Thinking.

### 5. Featured / Selected work — `id="work"`
- Section header: eyebrow `Selected work — 01`, H2 *"Real problems, measured outcomes."*, plus a `Start a project →` outline pill.
- **Featured lead card** (`border:1px solid #222838; radius:26px; background:#0A0D16`), `grid auto-fit minmax(340px,1fr)`:
  - Left: image (min-height 400) + a `★ Featured project` glass chip.
  - Right (padding `clamp(28px,3vw,46px)`): meta row `Design System / 2025 / Live` (Live in teal); H3 **Aurora Design System**; summary; a 3-up metrics row (`4` Surfaces, `0` A11y issues, `−60%` Setup time — the last in gradient text, all `tabular-nums`); stack chips; links **Live · Repo · Case study**.
- **Selected grid:** `grid auto-fit minmax(300px,1fr)`, gap 20. Cards = 16:10 cover + `/NN` index chip, category·year (mono), title (Space Grotesk 20), summary, tag chips. Hover: `border-color:#2E3548` + `translateY(-6px)`.
  - Cards: **Helios — WebGL Launch** (Creative/WebGL, 2024), **Tempo — Realtime Collab** (Web App, 2024), **Atlas Analytics** (Web App, 2023), **Prism — Shader Playground** (Creative/WebGL, 2023), **Ledger — Open Source CLI** (Open Source, 2022).

### 6. Statement band (`#07090F`)
- Eyebrow `Point of view`; large pull-quote (Space Grotesk 500, `clamp(1.7rem,4.4vw,3.4rem)`, `1.16`): *"Immersion is a **frame around the work** — never a substitute for it. Every flourish earns its place, or it gets cut."* ("frame around the work" in gradient). Mono attribution `— how I approach every build`.

### 7. Philosophy — `id="philosophy"`
- Eyebrow `How I work — 02`, H2 *"Principles I don't compromise on."*
- 3-up grid (`auto-fit minmax(280px,1fr)`), each: big gradient number `01/02/03` (Space Grotesk 600, `clamp(2.6rem,4.6vw,3.6rem)`) over a `border-top:#2E3548`, title, body.
  - 01 Performance is a feature · 02 Accessible by default · 03 Systems over screens.

### 8. Capabilities band (`#07090F`)
- Eyebrow `Capabilities`, H2 *"A pragmatic, modern toolkit."* + intro line.
- 4 cards (`auto-fit minmax(260px,1fr)`): category label in **teal** mono, chip list. Groups: Languages · Frameworks & Libraries · Styling & Motion · Tooling & Platforms (see data).

### 9. Experience — `id="experience"`
- Eyebrow `Experience — 03`, H2 *"Where I've been building."*
- Rows separated by `border-top:#222838`, `flex-wrap` (label column `flex:0 0 200px`, content `flex:1 1 380px`):
  - Left: period (teal mono + dot, `tabular-nums`), company (Space Grotesk 19), location (mono).
  - Right: role (Space Grotesk 21), summary, dash-bulleted highlights, stack chips.
  - Lumen Labs — Senior Frontend Engineer (2023–Now); Studio Northwind — Creative Developer (2021–2023); Vertex Systems — Software Engineer Intern (2020).

### 10. Writing & research band (`#07090F`) — `id="writing"`
- Eyebrow `Writing & research — 04`, H2 *"Notes on the craft."*
- Rows (`border-top:#222838`, `flex-wrap`): date (mono, `tabular-nums`), a **kind** pill (Research/Essay in teal), title (Space Grotesk 19) + blurb, trailing `→`. Hover: `padding-left:16px` + faint bg. 5 items (see data).

### 11. Gallery — `id="gallery"`
- Eyebrow `Gallery`, H2 *"Selected visuals."*
- Editorial masonry: `grid auto-fit minmax(min(100%,260px),1fr)`, `grid-auto-rows:210px`, gap 16. Featured cell spans `col 2 / row 2`; one tall (`row span 2`); one wide (`col span 2`). Each cell = image + bottom gradient scrim with category (teal mono) + title (Space Grotesk). Items: Helios (WebGL), Aurora (Design System), Prism (Shaders), Atlas (Data Viz), Tempo (Product).

### 12. Contact — `id="contact"`
- Eyebrow `Contact — 05`; giant H2 **Let's talk.** ("talk." in gradient, `clamp(3rem,9vw,7rem)`, `line-height:0.98`); helper copy; a gradient **email** pill (`mailto:thunityai@gmail.com`, magnetic); socials row. Bottom radial glow behind.

### 13. Footer (`#07090F`)
- Wordmark + sign-off *"Built by Joshua Setiawan. Designed and engineered end to end."*; two link columns (**Navigate**, **Elsewhere**); bottom bar: `© 2025 Joshua Setiawan` · `Fast · accessible · built in the open` · `Press ⌘K to jump anywhere`.

---

## Interactions & behavior
- **Signal Field (hero canvas):** N points (count derived from the `density` prop scaled by canvas area, clamped 24–150) drift with small velocities; nearby points (`dist < ~min(160, w*0.11)`) are joined by hairlines whose alpha falls off with distance; node + line color is lerped **azure→teal by x-position**. Pointer within ~150px gently **repels** points and brightens nearby links. Driven by one `requestAnimationFrame` loop; **paused when the hero scrolls out of view**; DPR-capped at 2; on reduced-motion (or `motion` off) it draws a single **static frame** instead of animating.
- **Reveal-on-scroll:** elements marked `data-reveal` fade+rise in (`opacity 0→1`, `translateY 26→0`, ease-out-cubic, 680ms, 70ms stagger). *Implemented as a JS rAF tween driven by a scroll + `getBoundingClientRect` viewport check — intentionally NOT IntersectionObserver* (IO didn't fire reliably in the prototype's render sandbox). In Next.js use **Framer Motion `whileInView` / the repo's `<Reveal>`** — it's the same intent. Reduced-motion → everything visible immediately.
- **Magnetic buttons** (`data-magnetic="px"`): translate toward the pointer, capped at the given px (≤18). Use the repo's `useMagnetic` / `<Magnetic>`.
- **Header collapse:** see Header above (scroll-driven `--hdr`).
- **Command/jump menu:** ⌘K / Ctrl+K toggles, Esc closes. In the repo, wire this to the existing **cmdk** command palette (`src/components/ui/command.tsx`) rather than this bespoke overlay.
- **In-page nav:** smooth `window.scrollTo` to each section top minus a **60px** header offset. Reduced-motion → `behavior:'auto'`.
- **Responsive:** no media queries — everything uses `clamp()` + `flex-wrap` + `grid auto-fit/minmax`. Header stays minimal at all sizes; the Jump Menu is the nav on mobile.

## State management
Three tweakable inputs (in the prototype these are DC props; in Next.js make them a small theme/prefs context or props):
- `accent`: `'azure' | 'violet' | 'amber' | 'emerald'` — **default `azure`** (the brand). Sets `--accent`, `--accent-2`, `--glow` and the canvas colors. (Palettes in Design Tokens below.)
- `motion`: `boolean` (default `true`) — master switch for the signal field + reveals + marquee (pairs with `prefers-reduced-motion`). Expose a visible **"Pause motion"** control per the brand's a11y stance.
- `density`: number (default `64`, range 20–130) — signal-field point density.

Runtime state: header `scrolled` flag, jump-menu `open` flag, pointer position (hero), canvas point array. No data fetching on this page (the live GitHub dashboard is a separate route in the repo).

## Design tokens
Colors (identical to `src/styles/tokens.css` dark theme — reuse those variables):
- Background `#05070D`; surfaces `#0A0D16` / `#10131F` / `#171B2A`; **alt band** `#07090F` (used to separate scenes).
- Foreground `#EAEDF5`; muted `#A4ABBD`; subtle `#7E8699`.
- Borders `#222838`; strong `#2E3548`.
- **Accent (azure)** `#5E8BFF`; **teal** `#38E8C8`; glow rgb `94,139,255`. Signature gradient `linear-gradient(120deg,#5E8BFF,#38E8C8)` (110deg for text).
- Alt palettes (accent / accent-2 / glow): violet `#8B7BFF` / `#E872C6` / `139,123,255`; amber `#F5B544` / `#FF7A6B` / `245,181,68`; emerald `#3DD68C` / `#38BDF8` / `61,214,140`.
- Chip surface `#10131F`; muted chip text `#8b93a5` / `#c3ccdb`.

Typography (already wired via `next/font` in the repo):
- **Display** Space Grotesk (600, 700 for hero); **Body/UI** Geist (400/500/600); **Mono** Geist Mono (400/500) for eyebrows, labels, metrics, dates.
- Hero `clamp(3.4rem,13vw,10rem)`/`0.9`/`-0.03em`; section H2 `clamp(2rem,4.6vw,3.5rem)`/`-0.025em`; contact H2 `clamp(3rem,9vw,7rem)`; body `clamp(1rem,1.4vw,1.25rem)`/`1.65`; eyebrow 12px mono, `letter-spacing:.2em`, uppercase; chips 11px mono; `tabular-nums` on all stats/metrics/dates.

Spacing / radii / motion:
- Container `max-width:1240px`; gutter `clamp(20px,5vw,56px)`. Section padding `clamp(84px,11vw,164px)` (primary) / `clamp(60px,8–9vw,120px)` (alt bands).
- Radius: cards 20px, featured card 26px, chips 10px, pills 999px.
- Easing: **`cubic-bezier(.16,1,.3,1)`** (out-expo) for reveals/magnetic/menu; `.4–.45s ease` for header. Reveal 680ms; magnetic `.35s`; menu `.4–.5s`.
- Keyframes: `marqueeX` (marquee), `pulseDot` (availability dot), `cueMove` (scroll cue).

## Assets
- **Fonts:** Space Grotesk, Geist, Geist Mono (Google Fonts) — already configured in the repo via `next/font`.
- **Images:** none shipped — the prototype uses `<image-slot>` drag-drop placeholders for the featured cover, 5 project covers, and 5 gallery cells. In Next.js replace with **`next/image`** (AVIF, `blurDataURL`, quiet dark mat) fed from `src/data/projects.ts` (`cover`) and `src/data/gallery.ts` (`src`). Empty-state look in the prototype = a subtle azure→teal gradient panel.
- **Icons:** the prototype uses Unicode arrows (`→ ↗`) and text social labels. Per the brand, use **lucide-react** in the repo: `ArrowRight`, `ArrowUpRight`, and `Github` / `Linkedin` / `Twitter` / `Mail` for socials.

## Mapping to your existing repo (`web-portofolio`)
This design is mostly a **re-composition of the home route** — the infra already exists:
- **Home composition** → `src/app/(site)/page.tsx` (reorder/adjust sections to match this flow).
- **Hero** → `src/components/sections/hero.tsx`. The Signal Field can be (a) the lightweight **2D canvas** in this prototype (see `Portfolio.dc.html`, the `setupSignalField/drawField` methods — port to a `'use client'` component with a `useRef` canvas + rAF, gated by `useReducedMotion`), or (b) your planned **R3F** version in `src/three/scenes/signal-field.tsx` / `src/components/sections/hero-scene.tsx`. The 2D version is cheap and matches the look; keep the static-poster fallback.
- **Tokens/colors** → already in `src/styles/tokens.css` — reuse, don't redefine.
- **Reveals** → `src/components/motion/reveal.tsx`; **Magnetic** → `src/components/motion/magnetic.tsx` + `src/hooks/use-magnetic.ts`.
- **Header + monogram collapse** → `src/components/layout/header.tsx` (+ `mobile-menu.tsx`); **⌘K** → `src/components/ui/command.tsx` (cmdk).
- **Data** (already placeholder in repo, matches this design) → `projects.ts`, `skills.ts`, `experience.ts`, `research.ts`, `gallery.ts`, `social-links.ts`, `config/site.ts`. The prototype's stats numbers derive from these (project count, oss count, posts+research count).
- **Cards** → `featured-project-card.tsx`, `project-card.tsx`, `project-grid.tsx`, `experience-card.tsx`, `stat-card.tsx`, `blog-card.tsx`, `research-card.tsx`, `gallery-item.tsx`, `tech-stack-list.tsx`.
- **Smooth scroll** → you already use **Lenis** (`src/hooks/use-lenis.ts`); route section links through it.

## Files in this bundle
- `Portfolio.dc.html` — the full hi-fi design reference (all sections, exact styles, and the Signal Field / reveal / magnetic / header logic in the `<script>` class at the bottom). Read the inline styles for exact values; read the class for exact interaction math.
- `image-slot.js` — the drag-drop placeholder web component used for images (reference only; replace with `next/image`).
- `support.js` — the DC runtime (reference only; **not** needed in Next.js).

Open `Portfolio.dc.html` in a browser to see and feel the target (hover the hero for the pointer spotlight + magnetic buttons, press ⌘K, scroll for reveals + header collapse).

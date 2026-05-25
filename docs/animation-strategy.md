# Animation Strategy

> Purpose: the authoritative motion specification for Joshua Setiawan's portfolio — every major animation defined as a full spec (trigger, duration, easing, delay, stagger, initial/active/exit states, desktop, mobile, reduced-motion, performance) so engineering builds one consistent, accessible, performant motion language.

Related: [Creative Direction](./creative-direction.md) · [Design System](./design-system.md) · [Design Tokens](./design-tokens.md) · [Typography System](./typography-system.md) · [Component Inventory](./component-inventory.md) · [Page Specifications](./page-specifications.md) · [Wireframes](./wireframes.md) · [Section Transitions](./section-transitions.md)

---

## 0. How to read this document

Motion here is **a frame around the work, not a substitute for it**. Every animation is described as a fixed spec block so specs stay comparable and lint-able. Numbers are **quotations** of the motion tokens in [design-tokens](./design-tokens.md#motion-tokens) — never new inventions.

### Spec field legend

| Field | Meaning |
|---|---|
| **Name** | The animation's stable identifier (used in code as a variant/timeline factory name). |
| **Trigger** | What starts it: mount, viewport entry (IntersectionObserver / ScrollTrigger), scroll progress (scrub), pointer (hover/focus/press), or route change. |
| **Duration** | Tween length, quoting a duration token (ms). Scrubbed animations use scroll distance, not time. |
| **Easing** | A named ease token, or a spring config `stiffness/damping/mass`. |
| **Delay** | Time before the tween begins (ms). |
| **Stagger** | Inter-child offset (ms) for grouped children, quoting a stagger token. |
| **Initial state** | The pre-animation style (also the static reduced-motion / JS-off state where content must be legible). |
| **Active state** | The settled, animated-to style. |
| **Exit state** | How it leaves (unmount / route change / viewport exit). Exit ≈ **0.7×** enter duration. |
| **Desktop / Mobile** | Behavior per device class (pointer vs touch, distance scaling, what is dropped). |
| **Reduced-motion** | The mandated behavior under the single motion gate (see [§10](#10-reduced-motion-master-gate)). |
| **Performance notes** | Compositor discipline, what is animated, budget impact. |

### Golden rules

1. **Content is never gated behind animation.** Everything is visible by default and JS-off safe; motion only *enhances* the reveal. Initial states must be authored so a no-JS render shows finished content.
2. **Compositor-only properties.** Animate `transform` and `opacity` (and `filter: blur` sparingly, on small areas). Never animate layout properties (`width`, `top`, `height`) on the critical path.
3. **One scroll authority.** Lenis owns scroll; GSAP/ScrollTrigger read it; nothing else listens to raw `scroll`. See [§1](#1-engine-division-of-labor).
4. **Exit is faster than enter** (~0.7×) so the UI feels responsive, not draggy.
5. **Reduced-motion is a first-class state**, not a fallback bolted on — every spec defines it explicitly.

---

## 1. Engine division of labor

| Engine | Owns | Never does |
|---|---|---|
| **Framer Motion** (`LazyMotion` + `m.*`) | State/lifecycle: enter/exit, `layout`/`layoutId`, gestures (`whileHover`/`whileTap`/`whileFocus`), the page-transition curtain, `AnimatePresence`. | Scroll-scrubbed timelines, pinning. |
| **GSAP + ScrollTrigger** | Scroll progress, pin, scrub, multi-step timelines, horizontal scroll, section seams. | App state / mount transitions Framer already owns. |
| **Lenis** | Smooth scroll + the single scroll value. | Animates nothing itself. |
| **R3F (Three.js)** | All WebGL; reads scroll/pointer from a shared Zustand store. | DOM animation. |

**The single rAF (mandatory):**

```
gsap.ticker.add((t) => lenis.raf(t * 1000));   // gsap drives lenis
lenis.on('scroll', ScrollTrigger.update);       // lenis feeds ScrollTrigger
gsap.ticker.lagSmoothing(0);                     // no lag compensation jumps
```

No component instantiates its own `requestAnimationFrame` loop for scroll. R3F runs `frameloop="demand"` and is invalidated by store changes, not by a competing rAF. **No scroll-jacking** — Lenis smooths native scroll; it never hijacks distance or direction.

---

## 2. Motion token quick-reference

All values below are **locked**; see [design-tokens](./design-tokens.md#motion-tokens).

| Group | Tokens |
|---|---|
| **Durations (ms)** | `instant 80` · `fast 160` · `base 280` · `moderate 420` · `slow 640` · `cinematic 900` · `ambient 1200+` · exit ≈ `0.7×` enter |
| **Eases** | `out (.22,1,.36,1)` · `out-expo (.16,1,.3,1)` · `inout (.83,0,.17,1)` · `back (.34,1.56,.64,1)` |
| **Springs** (`stiffness/damping/mass`) | `snappy 420/32/0.8` · `soft 260/30/1` · `layout 300/34/1` · `magnetic 150/15/0.4` |
| **Staggers (ms)** | `tight 30` · `base 60` · `loose 90` |
| **Reveal travel (px)** | `xs 8` · `sm 16` · `md 24` · `lg 48` · `hero 80` · blur `6 → 0` · card lift `-6` · magnetic max `18` |

**Defaults:** section/element reveals use `out-expo` + `slow (640ms)`; UI micro-states use `out` + `base (280ms)`; gestures use the `snappy`/`magnetic` springs; playful accents (badges, toggles) may use `back`. Use `inout` only for symmetrical, full-screen moves (page curtain).

---

## 3. Hero entrance

The landing hero is the brand's first impression: the **"Signal Field"** particle canvas behind a stacked display-2xl headline, eyebrow, sub, and dual CTA. The canvas poster **is the LCP element** and must paint immediately; motion layers in *after* paint without shifting it.

| Field | Spec |
|---|---|
| **Name** | `heroEntrance` (orchestrated timeline; Framer for DOM, R3F store for canvas) |
| **Trigger** | Mount, after fonts ready (`document.fonts.ready`) and first paint; gated by a `mounted` flag to avoid hydration flash. |
| **Duration** | `cinematic 900` total envelope; per-line `slow 640`; canvas fade-in `ambient 1200`. |
| **Easing** | DOM: `out-expo`. Canvas opacity: `out`. |
| **Delay** | `120` initial hold (lets LCP poster settle), then lines begin. |
| **Stagger** | `loose 90` between hero lines (eyebrow → headline lines → sub → CTA row). |
| **Initial state** | Eyebrow/sub/CTA `opacity 0, y +24 (md)`; headline lines `opacity 0, y +80 (hero), blur 6px`; canvas `opacity 0` (poster already visible underneath at `opacity 1`). |
| **Active state** | All `opacity 1, y 0, blur 0`; canvas particles `opacity 1` and begin ambient drift. |
| **Exit state** | On route change, hero leaves via the page curtain (see [§9](#9-page-transition)); no independent exit. |
| **Desktop** | Full sequence + magnetic CTAs (see [§14](#14-navigation--ui-state-changes)); headline travels the full `hero 80px`. |
| **Mobile** | Travel scaled to `lg 48px`; blur dropped on headline (cheaper); canvas may render the **static poster only** on low-tier devices (device-tier gate). |
| **Reduced-motion** | No travel, no blur, no canvas animation. Lines cross-fade `opacity 0→1` over `base 280` with `tight 30` stagger; canvas shows the **static poster** (its LCP role is unchanged). |
| **Performance notes** | DOM animates `transform`/`opacity`/`filter` only; headline split is pre-split at build (no layout thrash). Canvas is `frameloop="demand"`, `DPR [1,1.75]`, `IntersectionObserver`-paused when scrolled away. Zero CLS: animations never change box size; reserve space for all lines. Three/GSAP/Framer are **out of the first-load chunk** — hero DOM reveal can run on Framer alone while the canvas hydrates lazily. |

---

## 4. Text / word / char reveals

Editorial type reveals for headings, eyebrows, and lead paragraphs. Split granularity is chosen per use: **char** (hero/display only), **word** (section headings, pull quotes), **line** (paragraphs). Splitting is done with a build-stable approach (pre-split spans or GSAP `SplitText` guarded so a11y text stays in the accessible tree).

| Field | Spec |
|---|---|
| **Name** | `textReveal` (variants: `byChar`, `byWord`, `byLine`) |
| **Trigger** | ScrollTrigger viewport entry at `start: 'top 85%'` (once). Hero variant triggers on mount via [§3](#3-hero-entrance). |
| **Duration** | Per unit `moderate 420` (word/line); `base 280` (char). |
| **Easing** | `out-expo`. |
| **Delay** | `0` (the stagger provides cadence). |
| **Stagger** | char `tight 30` · word `base 60` · line `loose 90`. |
| **Initial state** | Each unit `opacity 0, y +24 (md)`; char/word may add `blur 6 → 0`; units clipped by an `overflow: hidden` mask wrapper for a "rise from baseline" feel. |
| **Active state** | `opacity 1, y 0, blur 0`. |
| **Exit state** | None on scroll-up (plays once; `toggleActions: 'play none none none'`). Leaves only via page curtain. |
| **Desktop** | Full split granularity; mask-rise enabled. |
| **Mobile** | Force **word or line** granularity (never char) to cap node count; drop blur; travel `sm 16`. |
| **Reduced-motion** | **No split.** The whole element cross-fades `opacity 0→1` over `base 280`, or appears statically if also `saveData`. Accessible text is always the un-split string. |
| **Performance notes** | Cap split units (≤ ~120 nodes/heading); reuse one wrapper per heading. The visible text node must remain the real text (split spans are `aria-hidden` decorative copies, or `aria-label` mirrors the full string) so screen readers never read character-by-character. Animate `transform`/`opacity` only. |

---

## 5. Section reveals

The default "content arrives" motion for every major band (about blocks, stat clusters, philosophy principles, list rows). Quiet, editorial, consistent — this is the workhorse used dozens of times, so it must be cheap and predictable.

| Field | Spec |
|---|---|
| **Name** | `sectionReveal` (variants: `single`, `stagger`) |
| **Trigger** | IntersectionObserver / ScrollTrigger entry `start: 'top 80%'`, plays once. |
| **Duration** | `slow 640`. |
| **Easing** | `out-expo`. |
| **Delay** | `0`; eyebrow leads heading by `60`. |
| **Stagger** | `base 60` between sibling children (`stagger` variant). |
| **Initial state** | `opacity 0, y +48 (lg)` for the section; child items `opacity 0, y +24 (md)`. |
| **Active state** | `opacity 1, y 0`. |
| **Exit state** | None (one-shot). |
| **Desktop** | Full travel + stagger; eyebrow/heading/body cascade. |
| **Mobile** | Travel `md 24`; stagger held at `base 60` but capped to first ~8 children, rest snap in. |
| **Reduced-motion** | Static; or a single `opacity 0→1` over `base 280` with **no** travel and **no** stagger. |
| **Performance notes** | Prefer a single ScrollTrigger per section with `gsap` timeline staggering children over many individual observers. `will-change: transform` applied on enter, **removed on complete**. No pin (this is a reveal, not a scene — pinning lives in [Section Transitions](./section-transitions.md)). |

---

## 6. Project card hover

Project cards (grid on `/projects`, featured rail on landing) are the conversion surface. Hover should feel *alive and premium* — a slight lift, border-glow ignition, cover parallax, and (desktop, capable devices) a one-shot WebGL cover-shader shimmer.

| Field | Spec |
|---|---|
| **Name** | `projectCardHover` |
| **Trigger** | Pointer `hover` / `focus-visible` (keyboard parity); press = `whileTap`. |
| **Duration** | Lift/border `base 280`; cover scale `moderate 420`; press `instant 80`. |
| **Easing** | Springs: lift `soft 260/30/1`; magnetic cursor-follow `magnetic 150/15/0.4`. Border-glow opacity `out`. |
| **Delay** | `0`. |
| **Stagger** | n/a (single card); grid entrance uses [§5](#5-section-reveals) with `base 60`. |
| **Initial state** | `y 0, scale 1`; cover `scale 1`; border at `--border`; glow `opacity 0`; shadow `elev-1`. |
| **Active state** | `y -6 (card lift)`, shadow `elev-3`; cover `scale 1.04` with ≤ `18px` magnetic parallax toward cursor; border → `--border-strong`; `--glow-accent` ring `opacity 1`; title underline wipe L→R `fast 160`. |
| **Exit state** | Reverse over `~0.7×` (≈ `200`), spring settle; glow fades `fast 160`. |
| **Desktop** | Full set incl. magnetic parallax + optional WebGL cover shimmer (one-shot, `demand` render, disposed on leave). |
| **Mobile / touch** | No hover. Entrance reveal only; `:active` gives a `scale 0.98` press feedback. No parallax, no shader. |
| **Reduced-motion** | No lift, no parallax, no scale, no shader. State change shown via **border-strong + glow ring opacity** and the underline appearing instantly — color/structure, never motion. |
| **Performance notes** | Animate `transform`/`opacity`/`box-shadow` (pre-tokenized shadows). Magnetic math throttled to pointer move via `requestAnimationFrame`, not per-event. Cover image uses `next/image` with priority off; shader instance is created on `pointerenter`, `dispose()`d on `pointerleave`. Never animate `width`/`height`. |

---

## 7. Blog card hover

Blog/research cards are quieter and text-led — restraint vs. the project cards. The accent is a **reading-affordance**: title color shift, arrow nudge, and a hairline accent bar, with no WebGL.

| Field | Spec |
|---|---|
| **Name** | `blogCardHover` |
| **Trigger** | Pointer `hover` / `focus-visible`; press `whileTap`. |
| **Duration** | `base 280`; arrow `fast 160`. |
| **Easing** | `out`; arrow nudge spring `snappy 420/32/0.8`. |
| **Delay** | `0`. |
| **Stagger** | n/a per card; list entrance via [§5](#5-section-reveals) `base 60`. |
| **Initial state** | Title `--foreground`; left accent bar `scaleY 0` (origin bottom); arrow `x 0, opacity 0.6`; surface `--surface-1`. |
| **Active state** | Title → `--primary`; accent bar `scaleY 1`; arrow `x +4, opacity 1`; surface → `--surface-2`; meta row (date/reading-time) stays static. |
| **Exit state** | Reverse over `~0.7×` (≈ `200`). |
| **Desktop** | Full set; cover thumbnail (if present) `scale 1.03`. |
| **Mobile / touch** | Static card; `:active` surface tint only; arrow always at rest `opacity 1`. |
| **Reduced-motion** | Title color + accent bar + arrow nudge applied **instantly** (no transition); no scale. |
| **Performance notes** | Pure CSS/transform; no JS measurement, no WebGL. Accent bar uses `transform: scaleY` (compositor), not `height`. Entire interaction is GPU-cheap and can be CSS-only with `:hover`/`:focus-within`. |

---

## 8. Timeline reveal

The `/timeline` route (and the landing experience seam) animates a vertical spine: a drawing connector line, dot "pings," and alternating event cards that slide in from their side. Scroll-scrubbed so the line draws *with* the user.

| Field | Spec |
|---|---|
| **Name** | `timelineReveal` |
| **Trigger** | ScrollTrigger **scrub** for the spine draw (`scrub: 0.5`); per-card IntersectionObserver entry for content. |
| **Duration** | Spine = scroll-bound (no time). Card entry `slow 640`; dot ping `moderate 420`. |
| **Easing** | Card `out-expo`; dot ping `back .34,1.56,.64,1`; spine linear (scrub). |
| **Delay** | Card body trails its dot by `90`. |
| **Stagger** | Within a card: dot → title → meta → body at `base 60`. |
| **Initial state** | Spine `scaleY 0` (origin top); dots `scale 0, opacity 0`; cards `opacity 0, x ±48 (lg)` (alternating sides); single-column mobile cards `x 0, y +24`. |
| **Active state** | Spine `scaleY 1` tracking progress; dots `scale 1` with a glow ping; cards `opacity 1, x/y 0`. |
| **Exit state** | One-shot for cards; spine reflects current scroll both directions (scrub is reversible by nature). |
| **Desktop** | Alternating L/R entry, scrubbed spine, dot glow pings. |
| **Mobile** | Single left-aligned rail; all cards enter from one side (`y +24`, no horizontal); spine still scrubs but thinner. |
| **Reduced-motion** | Spine rendered **fully drawn** statically; dots static (glow ring only); cards cross-fade `opacity 0→1` `base 280`, no slide, **no scrub**. (No `pin`/`scrub` under reduced-motion per the gate.) |
| **Performance notes** | One ScrollTrigger drives the spine; cards use cheap observers. Spine draw via `transform: scaleY` or SVG `pathLength` (compositor/GPU), never animating SVG geometry per frame. Cap simultaneously-animating cards; recycle observers. |

---

## 9. Gallery reveal

`/gallery` is a masonry/justified grid of stills. Reveal must avoid layout shift (heights known from `width/height` + `blurDataURL`) and feel like a developing photograph — blur-up + soft rise, lightbox on open.

| Field | Spec |
|---|---|
| **Name** | `galleryReveal` (+ `galleryLightbox` for open/close) |
| **Trigger** | IntersectionObserver per tile `start: 'top 90%'`; lightbox via `AnimatePresence` + `layoutId` shared element. |
| **Duration** | Tile `moderate 420`; blur-up `slow 640`; lightbox open `base 280`. |
| **Easing** | Tile `out-expo`; lightbox `out`; shared-element morph spring `layout 300/34/1`. |
| **Delay** | `0`. |
| **Stagger** | `base 60` across a row; columns offset by `30` for an organic cascade. |
| **Initial state** | Tile `opacity 0, y +24, scale 0.98`, image showing `blurDataURL` (CSS blur `12px`). |
| **Active state** | `opacity 1, y 0, scale 1`; full image cross-fades over the blur (`blur 12 → 0`). |
| **Exit state** | Tiles don't exit on scroll. Lightbox close: shared element morphs back to its tile via `layoutId` over `base 280`, scrim fades `fast 160`. |
| **Desktop** | Full cascade; lightbox shared-element morph; arrow-key + Prev/Next controls (visible, per a11y). |
| **Mobile** | Travel `sm 16`; reduced cascade (cap to viewport rows); lightbox is full-screen sheet with swipe + visible Prev/Next. |
| **Reduced-motion** | No rise/scale/stagger; tiles fade `opacity 0→1` `base 280` (blur-up still allowed as it's a load affordance, but instantaneous swap if `saveData`). Lightbox open/close = **cross-fade**, no shared-element morph. |
| **Performance notes** | Heights reserved from intrinsic `width/height` → **zero CLS**. `next/image` with `placeholder="blur"`. Cap concurrent decode; lazy-load below fold. `layoutId` morph animates `transform` only. Lightbox traps focus (Radix Dialog), returns focus to trigger. |

---

## 10. Contact form focus

`/contact` uses a Server Action + shared Zod schema. Motion here is **functional feedback**, not decoration: focus rings, label float, inline validation, submit pending, and a persistent success state. Accessibility (live regions, `aria-invalid`) leads; motion follows.

| Field | Spec |
|---|---|
| **Name** | `contactFieldFocus` (+ `fieldError`, `submitPending`, `submitSuccess`) |
| **Trigger** | Field `focus`/`blur`; validation result (Zod) on blur + submit; Server Action pending/resolved. |
| **Duration** | Focus ring `fast 160`; label float `base 280`; error shake `moderate 420`; success `slow 640`. |
| **Easing** | Focus/label `out`; error shake `inout` (damped, 1 oscillation, ≤ 4px); success `out-expo`. |
| **Delay** | `0`. |
| **Stagger** | Error summary list items `tight 30`. |
| **Initial state** | Field border `--border`; label resting in-field; ring `opacity 0`; helper text reserved (no shift). |
| **Active state** | Focus: ring `--ring` `opacity 1` (≥2px outline, offset); label floats up + shrinks to caption. Error: border `--destructive`, `aria-invalid`, inline message fades in, **one** subtle shake. Pending: submit button shows spinner + label "Sending…", disabled. Success: button → check, persistent inline success panel + sonner toast. |
| **Exit state** | Error clears on valid re-entry (`fast 160` fade). Success panel persists (not auto-dismissed). |
| **Desktop / Mobile** | Identical; mobile keeps label-float but ensures inputs ≥ 44px tall and ring never obscured by sticky header (focus-not-obscured). |
| **Reduced-motion** | **No shake**, no label-float travel (label swaps position instantly or stays static with permanent visible label). Ring, color, and messages appear instantly. Pending uses a static "Sending…" text, not a spinning glyph (or a `prefers-reduced-motion`-respecting spinner). |
| **Performance notes** | Trivial cost. Critical: validation feedback is driven by ARIA (`aria-invalid`, `aria-describedby`, polite live region, error-summary focus on submit), **never color/motion alone**. Reserve helper/error space to avoid CLS. Form works without JS (Server Action progressive enhancement). |

---

## 11. Page transition

Route changes use a **curtain wipe** that masks the swap and gives the SPA a cinematic seam, while keeping LCP fast (the curtain must not delay first paint of the incoming route's content).

| Field | Spec |
|---|---|
| **Name** | `pageTransition` (Framer `AnimatePresence`, `mode="wait"` or overlap with curtain) |
| **Trigger** | Route change (App Router navigation); template/layout-level transition. |
| **Duration** | Curtain in `moderate 420`, out `base 280` (exit faster); content cross-fade `base 280`. |
| **Easing** | Curtain `inout (.83,0,.17,1)` (symmetrical full-screen move); content `out`. |
| **Delay** | Incoming content starts `~120` after curtain peak to avoid flash. |
| **Stagger** | n/a. |
| **Initial state** | Curtain panel `scaleY 0` / `y 100%` off-screen (origin bottom); outgoing page `opacity 1`. |
| **Active state** | Curtain sweeps to cover (`--surface-1` with a faint `--gradient-accent` edge), outgoing page fades, route swaps under cover, curtain retracts revealing incoming page already painted. |
| **Exit state** | Curtain retracts upward `y -100%`; incoming hero begins its own [§3](#3-hero-entrance). |
| **Desktop** | Full curtain + accent edge; logo monogram pulse at curtain peak (optional). |
| **Mobile** | Shorter curtain (`fast 160`/`base 280`), no accent edge animation (static), to protect INP on lower-end devices. |
| **Reduced-motion** | **No curtain.** Plain cross-fade `opacity` `base 280`, or instant swap if `saveData`. Focus still moves to `#main-content` + polite route-announce regardless. |
| **Performance notes** | Curtain is a single fixed `transform`-only element at `z-overlay 70`. Must **not** block streaming of the incoming RSC payload — render the new route under the curtain. Route-change a11y (focus to `#main-content`, live-region announce) is independent of and not gated by the animation. Avoid long `mode="wait"` stalls that hurt perceived nav speed. |

---

## 12. Loading sequence

Global `loading.tsx` + per-route segment skeletons. The loader is **calm and brief** — a monogram + shimmer skeletons that match final layout (no spinner-of-doom). Skeletons exist to reserve space and kill CLS, not to entertain.

| Field | Spec |
|---|---|
| **Name** | `loadingSequence` (`skeletonShimmer` + `brandLoaderPulse`) |
| **Trigger** | Suspense boundary / route segment pending; first-load app shell. |
| **Duration** | Shimmer loop `ambient 1200` (linear, infinite); monogram pulse `cinematic 900` ease-in-out loop; exit fade `base 280`. |
| **Easing** | Shimmer linear; pulse `inout`; exit `out`. |
| **Delay** | Skeletons show after a `~120` delay to avoid flashing on instant loads. |
| **Stagger** | Skeleton rows `tight 30` on first appearance. |
| **Initial state** | Skeleton blocks at `--surface-2` with a moving `--surface-3` highlight band; monogram `opacity 0.6`. |
| **Active state** | Highlight band sweeps L→R across blocks; monogram pulses `opacity 0.6 ↔ 1`. |
| **Exit state** | On content ready, skeletons cross-fade to real content `base 280`; **layout identical** so nothing shifts. |
| **Desktop / Mobile** | Same; mobile shows fewer skeleton rows (viewport-sized). |
| **Reduced-motion** | **No shimmer sweep, no pulse.** Static skeleton blocks at a single resting tint; replaced by content on ready. A static "Loading…" label is available to AT via live region. |
| **Performance notes** | Skeleton geometry mirrors final DOM → zero CLS on hydrate. Shimmer is a single `transform: translateX` gradient layer (compositor), not a `background-position` animation on many nodes. The loader ships in the shared baseline (no heavy deps). |

---

## 13. Scroll progress

A top-edge progress bar (and an optional radial reading indicator on long articles) reflecting document scroll. Driven off the single Lenis value, not a separate listener.

| Field | Spec |
|---|---|
| **Name** | `scrollProgress` (linear bar + `readingRadial` on blog/research details) |
| **Trigger** | Scroll position (Lenis → ScrollTrigger or Framer `useScroll` reading the same source). |
| **Duration** | None — **bound to scroll** (scrub). Smoothed by Lenis. |
| **Easing** | Linear mapping; visual smoothing comes from Lenis lerp, not an ease. |
| **Delay** | `0`. |
| **Stagger** | n/a. |
| **Initial state** | Bar `scaleX 0` (origin left), `--gradient-accent` fill; radial `0%`. |
| **Active state** | `scaleX` = `scrollProgress` (0→1); radial stroke `pathLength` tracks article progress. |
| **Exit state** | Resets per route. |
| **Desktop / Mobile** | Bar on both; radial reading indicator desktop-only on detail pages (space). |
| **Reduced-motion** | Bar **still shown** (it's an indicator, not decoration) but updates without Lenis smoothing (native scroll, direct mapping). No glow pulse. May be hidden if it adds noise — content is unaffected. |
| **Performance notes** | `transform: scaleX` only; **never** animate `width`. Reads the existing scroll value — **no new scroll listener**. Runs at `z-sticky-header 50`/just above. Negligible cost; throttled to rAF via Lenis. |

---

## 14. Navigation & UI state changes

The sticky header collapses (wordmark "Joshua Setiawan" → "JS" monogram) on scroll, the mega-menu/command-palette open/close, theme toggles, and magnetic primary buttons. This is the highest-frequency interaction surface — it must feel instant (INP ≤ 200ms).

| Field | Spec |
|---|---|
| **Name** | `navStateChange` (`headerCollapse`, `megaMenu`, `commandPalette`, `themeToggle`, `magneticButton`) |
| **Trigger** | Scroll threshold (collapse); pointer/keyboard (`Cmd/Ctrl+K` palette, hover/click menu); theme toggle; pointer-move (magnetic). |
| **Duration** | Collapse `base 280`; menu/palette open `base 280` / close `fast 160`; theme cross-fade `moderate 420`; magnetic continuous spring. |
| **Easing** | Collapse/menu `out`; palette `out-expo`; theme `inout`; magnetic spring `magnetic 150/15/0.4`; press `whileTap scale 0.97` `instant 80`. |
| **Delay** | `0`. |
| **Stagger** | Mega-menu groups/items `tight 30`; palette results no stagger (instant list). |
| **Initial state** | Header full height, wordmark `opacity 1`; menus `opacity 0, y -8, scale 0.98`; palette scrim `opacity 0`; button at rest. |
| **Active state** | Header condensed + glass (`backdrop-blur 12px`), monogram `opacity 1`; menu/palette `opacity 1, y 0, scale 1`; magnetic button translates ≤ `18px` toward cursor; theme tokens cross-fade across the whole tree. |
| **Exit state** | Reverse at `~0.7×` (`fast 160`); palette/menu return focus to trigger. |
| **Desktop** | Full set incl. magnetic buttons + hover mega-menu. |
| **Mobile** | No magnetic, no hover menu — nav is a full-screen sheet (`AnimatePresence`, slide `y`/`x`), palette opens as a sheet; collapse still applies. |
| **Reduced-motion** | Header collapse is an **instant** swap (no height tween); menus/palette **fade only** (no scale/slide); magnetic disabled (buttons static); theme swap instant or quick fade. Press feedback via color, not scale. |
| **Performance notes** | Header uses `transform`/`opacity` + `backdrop-filter` (with solid `--surface-1/90` fallback under `prefers-reduced-transparency`). Glass blur is expensive — single layer only, not nested. Magnetic throttled to rAF on pointer move. All overlays are Radix (focus trap, `inert`, return-to-trigger). Theme cross-fade must not block input (INP guard). |

---

## 15. Three.js interaction

WebGL interaction layer: hero Signal Field pointer reactivity, project-cover hover shader, About aurora gradient-mesh, optional GitHub contribution depth/constellation, and the tech-graph (covered separately in [§17](#17-interactive-technology-graph)). All read scroll/pointer from a shared Zustand store; one persistent `<Canvas>` via tunnel-rat.

| Field | Spec |
|---|---|
| **Name** | `webglInteraction` (per-scene; pointer + scroll reactive) |
| **Trigger** | Pointer move/raycast, scroll progress (from store), viewport visibility (IntersectionObserver). |
| **Duration** | Continuous; pointer response damped via `lerp` (~`0.08`–`0.12` per frame). |
| **Easing** | Frame-rate-independent `damp`/`lerp` (e.g. `@react-three/drei` `easing.damp3`), not duration tweens. |
| **Delay** | `0`; damping creates natural lag. |
| **Stagger** | n/a (per-instance offsets baked into shaders). |
| **Initial state** | Scene at rest pose; uniforms at base (no pointer influence). |
| **Active state** | Pointer warps the field (curl-noise influence radius), parallax tilts the mesh ≤ a few degrees, scroll drives camera dolly/uniform `uProgress`. |
| **Exit state** | On scene leave (IO), `frameloop` pauses and uniforms ease back to rest; on unmount, geometries/materials/textures `dispose()`d. |
| **Desktop** | Full pointer raycast + parallax. |
| **Mobile** | Pointer reactivity reduced or replaced by gentle auto-drift (no raycast cost); lower DPR; low-tier → **static poster**. |
| **Reduced-motion** | **Static poster** for every WebGL scene (the poster is the LCP element on the hero). No animation, no pointer reactivity. R3F not driven. |
| **Performance notes** | Single persistent `<Canvas>` (`dynamic`, `ssr:false`), `frameloop="demand"`, `DPR clamp [1,1.75]`, `PerformanceMonitor` downgrade, IO-paused offscreen, `dispose` on unmount. Device-tier + no-WebGL + reduced-motion → poster. **Never** the LCP; **never** ship three on routes that don't use it. `@react-three/postprocessing` deferred — glow via emissive materials + sprites. |

---

## 16. Particle motion (Hero "Signal Field")

The ambient particle field behind the hero — GPU-instanced points displaced by a curl-noise vertex shader, evoking signal/data flow. This is the signature 3D moment and must be lightweight enough to never threaten LCP/INP.

| Field | Spec |
|---|---|
| **Name** | `particleSignalField` |
| **Trigger** | Hero in viewport (IO); ambient by default, pointer-reactive on capable desktops. |
| **Duration** | Continuous ambient loop; intro fade `ambient 1200` (see [§3](#3-hero-entrance)). |
| **Easing** | Shader-time driven (`uTime`); pointer influence damped (`lerp ~0.1`). |
| **Delay** | Intro `120` after LCP poster. |
| **Stagger** | Per-particle phase offset encoded in instance attributes (organic, no JS stagger). |
| **Initial state** | Particles at curl-noise field positions, `opacity 0` (poster visible beneath at `opacity 1`). |
| **Active state** | Particles drift along curl-noise flow; emissive accent points (`--accent`/`--glow`) twinkle; pointer pushes a local influence radius. |
| **Exit state** | On scroll away, IO pauses `frameloop`; on route change, canvas fades with content. |
| **Desktop** | Full instanced count (tier-scaled), pointer reactivity, emissive glow sprites. |
| **Mobile** | Reduced instance count (or auto-drift only); lower DPR; low-tier device → **static poster only**. |
| **Reduced-motion** | **Static poster** (a pre-rendered frame of the field). No simulation, no twinkle, no pointer. Poster remains the LCP element. |
| **Performance notes** | All motion in the **vertex shader** (GPU) — no per-particle JS. Single `InstancedMesh`/`Points` + one draw call; positions from curl-noise, not CPU updates. `frameloop="demand"`; invalidate only while visible. Emissive + sprite glow instead of postprocessing (deferred for v1). Instance count clamped by device tier; `dispose()` on unmount. Strict budget: hero route ≤ 200KB first-load and three is **lazy**, never first-load. |

---

## 17. Interactive technology graph

A force-directed / constellation graph of skills & stack (About / Engineering Philosophy / a dedicated tech-graph moment). Nodes are technologies, edges are relationships; hover highlights a node's neighborhood. Can render in WebGL (instanced) or as an SVG/Canvas 2D fallback.

| Field | Spec |
|---|---|
| **Name** | `techGraph` |
| **Trigger** | Viewport entry (IO) → settle simulation; pointer hover/focus → highlight subgraph; optional drag to perturb. |
| **Duration** | Layout settle `cinematic 900` (one-shot ease to a precomputed layout); hover highlight `base 280`; node focus pulse `moderate 420`. |
| **Easing** | Settle `out-expo`; hover `out`; focus pulse `back`. |
| **Delay** | Edges draw after nodes by `90`. |
| **Stagger** | Node pop-in `tight 30`; edge draw `base 60`. |
| **Initial state** | Nodes `scale 0, opacity 0` at center/seed positions; edges `pathLength 0`, `opacity 0`. |
| **Active state** | Nodes `scale 1, opacity 1` at settled layout; edges draw to full; gentle ambient float. Hover: focused node + neighbors brighten (`--primary`/`--accent`), others dim to `--foreground-subtle`; edges to neighbors emphasized. |
| **Exit state** | Hover release returns all to base over `fast 160`. One-shot reveal otherwise. |
| **Desktop** | Full interactive graph, hover subgraph highlight, optional drag; WebGL instanced if tier allows. |
| **Mobile** | **Precomputed static layout** (no live force sim — CPU cost); tap to highlight a node's neighborhood; reduced node count; SVG/Canvas2D fallback preferred over WebGL. |
| **Reduced-motion** | Graph appears **fully laid out and static** (precomputed positions, no settle animation, no ambient float). Hover/focus highlight uses **color/opacity only**, applied instantly. Always keyboard-navigable with a text/list equivalent of the relationships for AT. |
| **Performance notes** | Run force simulation **at build/precompute** or once on idle, then freeze — never a perpetual physics rAF on the main thread. Hover diffing is O(neighbors), memoized. Provide an accessible non-graph representation (list of skills + relations) so the graph is decorative-enhanced, not the only source of truth. If WebGL: shares the single `<Canvas>`, `frameloop="demand"`, disposed on unmount. |

---

## 18. Reduced-motion master gate

A **single gate** governs every spec above. There is one source of truth; components never independently sniff `prefers-reduced-motion`.

```
reduceMotion = OS prefers-reduced-motion  ||  in-app motion toggle  ||  navigator.connection.saveData
            → Zustand motion slice → <html data-motion="reduced|full">
```

| Engine | Reduced-motion behavior |
|---|---|
| **Framer** | `MotionConfig reducedMotion="user"`; transform/opacity reveals collapse to opacity or static. |
| **GSAP** | All scroll work inside `gsap.matchMedia()`; the `(prefers-reduced-motion: reduce)` branch ships **static** timelines — **no `pin`, no `scrub`**. |
| **Lenis** | **Not instantiated** — native scroll only. |
| **R3F** | Every scene → **static poster**; no `frameloop`. |

**Mandates (WCAG 2.2):**

- An explicit, persistent **Pause-motion control** (WCAG 2.2.2) is always available, independent of OS setting.
- Content is **never gated behind animation** — visible by default, JS-off safe; initial states render finished content.
- Horizontal/carousel/scrubbed views get visible **Prev/Next** and a **static layout** under reduced-motion (no auto-advance, no pin).
- `saveData` is treated as reduced-motion **and** drops/poster-izes WebGL.

See [Design Tokens → Motion](./design-tokens.md#motion-tokens) and [Creative Direction → Motion](./creative-direction.md) for the governing principles.

---

## 19. Performance & enforcement

| Concern | Rule |
|---|---|
| **Animatable properties** | Only `transform`, `opacity`, and small-area `filter`. Layout properties (`width`/`height`/`top`/`margin`) are **banned** from animation on the critical path. |
| **`will-change`** | Applied on enter, **removed on complete** — never left permanently on many nodes. |
| **First-load chunks** | **Zero** three / GSAP / Framer in any first-load chunk. Framer via `LazyMotion` + `m.*`; GSAP/three dynamically imported. Per-route first-load: light routes ≤160KB, Projects/Blog/Research ≤175KB, GitHub/3D ≤200KB gz. |
| **CLS** | Reveal animations never change box size; skeletons mirror final layout; images carry intrinsic dimensions + blur. Target CLS ≤ 0.02. |
| **INP** | Gestures/overlays ≤ 200ms; magnetic + scroll work throttled to rAF; no synchronous layout reads in pointer handlers. |
| **LCP** | The hero poster **is** the LCP; motion layers in after paint and never displaces it. Target LCP ≤ 2.5s p75 mobile. |
| **Scroll** | One Lenis instance, one rAF (`gsap.ticker` → `lenis.raf`; `lenis.on('scroll')` → `ScrollTrigger.update`). No component adds a raw scroll listener. |
| **WebGL** | `frameloop="demand"`, DPR `[1,1.75]`, IO pause, `PerformanceMonitor` downgrade, `dispose()` on unmount, poster fallback. |
| **Enforcement** | jsx-a11y + jest-axe + axe-playwright run in **reduced-motion** and forced-colors modes; Lighthouse CI (throttled mobile) guards CWV; bundle-analyzer + size-limit assert no animation lib in first-load. |

---

## 20. Implementation patterns (factories)

Co-locate motion in `src/animations` (Framer variants) and GSAP timeline factories; scenes in `src/three`. Components import named factories — they never hand-roll durations/eases.

| Pattern | Location | Shape |
|---|---|---|
| **Framer variants** | `src/animations/variants.ts` | Exported `Variants` objects (`heroEntrance`, `sectionReveal`, `cardHover`, `pageTransition`) consuming token constants. |
| **Token constants** | `src/animations/tokens.ts` | `DURATION`, `EASE`, `SPRING`, `STAGGER`, `TRAVEL` mirroring [design-tokens](./design-tokens.md#motion-tokens). |
| **GSAP factories** | `src/animations/timelines.ts` | Functions returning configured `gsap.timeline()` / ScrollTrigger configs, always wrapped in `gsap.matchMedia()`. |
| **Scroll setup** | `src/providers/SmoothScroll.tsx` | The single Lenis + rAF + ScrollTrigger wiring. |
| **Motion gate** | `src/providers/MotionProvider.tsx` + Zustand slice | Computes `reduceMotion`, sets `<html data-motion>`, exposes the Pause control. |
| **Scenes** | `src/three/*` | One persistent `<Canvas>`; tunnel-rat portal; per-scene reads the shared store. |

All names in this document map 1:1 to these factories so design specs and code stay in lockstep. For how these animations **connect between sections** (seams, pins, scroll choreography), see [Section Transitions](./section-transitions.md).

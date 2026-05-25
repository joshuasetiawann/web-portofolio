# Section Transitions

> Phase 1 motion plan for the *seams* between adjacent narrative sections of Joshua Setiawan's portfolio — how the eye and the story hand off from one block to the next without a single hard cut, scroll-jack, or content-behind-animation regression.

Siblings: [animation-strategy](./animation-strategy.md) · [scroll-strategy](./scroll-strategy.md) · [three-strategy](./three-strategy.md) · [page-specifications](./page-specifications.md)

---

## 0. Reading this document

A *seam* is the ~1 viewport of scroll where one narrative section ends and the next begins. The portfolio reads as one continuous descent ("Immersive Dark + 3D"), so seams are designed, not accidental. Each seam below is specified as five things:

| Field | What it answers |
| --- | --- |
| **Concept** | What the eye does and what the story says at the join. |
| **Mechanism** | Exact engine + element + property (transform/opacity only). |
| **Choreography** | Parallax depth layers, pinned hand-offs, gradient bleed, WebGL dissolve. |
| **Timing** | Which motion tokens drive each beat. |
| **Reduced-motion** | The static, opacity-only fallback served via the global gate. |

Engine division of labor is fixed (see [animation-strategy](./animation-strategy.md)): **Framer Motion** owns state/lifecycle (enter/exit, `layoutId`, gestures, the page-transition curtain); **GSAP + ScrollTrigger** owns scroll progress, pin, scrub, and multi-step timelines; **Lenis** owns smooth scroll and is the *single* scroll value (it animates nothing); **R3F** reads scroll/pointer from a shared Zustand store and renders WebGL. One rAF only: `gsap.ticker` drives `lenis.raf`; `lenis.on('scroll')` → `ScrollTrigger.update()`. Details in [scroll-strategy](./scroll-strategy.md).

**Hard rule:** seams animate `transform` and `opacity` only (plus `filter: blur` on reveal text per the token set). No layout-thrashing properties at scroll time. Content is visible by default; every seam degrades to a readable static page with JS off.

---

## 1. The Landing narrative spine

The home route `/` is the only page that strings all eight seams together. The standalone routes (`/philosophy`, `/experience`, `/open-source`, `/blog`, `/research`, `/contact`) reuse the *same* seam vocabulary at their own entrances so the site feels authored by one hand. Restraint spectrum applies: the home spine and showcase pages run cinematic seams; reading/utility pages (Blog index, Research, Contact form) use the opacity-only subset only.

```
 ┌─ Hero (WebGL field) ─────────────────────────────┐  cinematic
 │  seam 1 ↓ field dissolve + counters rise          │
 ├─ Proof / statistics ─────────────────────────────┤
 │  seam 2 ↓ pinned card hand-off                    │
 ├─ Featured projects ──────────────────────────────┤
 │  seam 3 ↓ gradient bleed → dark, scrub crossfade  │
 ├─ Engineering philosophy ─────────────────────────┤
 │  seam 4 ↓ parallax depth shear                    │
 ├─ Experience ─────────────────────────────────────┤
 │  seam 5 ↓ timeline rail continuation              │
 ├─ Open source ────────────────────────────────────┤
 │  seam 6 ↓ contribution field → text dissolve      │
 ├─ Writing / research (Blog + Research) ────────────┤
 │  seam 7 ↓ low-motion calm-down, rule draw          │
 ├─ Contact ────────────────────────────────────────┤
 │  seam 8 ↓ gradient sink into footer               │
 └─ Footer ─────────────────────────────────────────┘  low-motion
```

---

## 2. Section rhythm (the cadence every block shares)

Every section opens on the same three-beat pattern so the *entrances* feel related even when the *seams* between them differ. This is what makes the seams legible — the eye learns the downbeat.

**Eyebrow → display heading → measured intro.**

| Beat | Element | Reveal | Token |
| --- | --- | --- | --- |
| 1. Eyebrow | `--accent` micro-label, kerned caps | opacity 0→1, y `sm16`→0 | `fast160`, ease `out` |
| 2. Display heading | clamp display type | y `md24`→0, blur `6→0` | `base280`, ease `out-expo`, stagger `base60` by line |
| 3. Measured intro | 60–72ch body paragraph | opacity 0→1, y `sm16`→0 | `moderate420`, ease `out` |

Vertical spacing is one token so every seam has the same "breath" before and after it:

```
--section-y: clamp(6rem, 12vw, 12rem);   /* top & bottom padding of every section */
```

Entrances fire once on first scroll-in (`ScrollTrigger` `once: true` for content reveals; `toggleActions: 'play none none reverse'` only for ambient/decorative layers). Exit motion runs at ~`0.7×` its entrance duration (the global exit ratio), so leaving a section is always quicker than arriving — the descent feels forward-weighted.

---

## 3. Seam catalog

### Seam 1 — Hero → Proof / statistics

**Concept.** The hero's living WebGL field (azure→teal particle/gradient volume) thins and sinks as the eye drops; out of that dissolving field the proof counters *rise* into focus. Story: "the atmosphere resolves into evidence."

**Mechanism.**
- *WebGL field dissolve* — R3F reads `scrollProgress` for the hero pin range from the shared store (it does not own a timeline). A uniform `uDissolve` (0→1) drives particle opacity + a downward `translateY` on the point cloud. GSAP writes the store value; R3F renders. Transform/opacity-equivalent in shader space only.
- *Counters rise* — GSAP `ScrollTrigger` on the proof block: each stat card `transform: translateY(hero80→0)` + `opacity 0→1`, `filter: blur(6→0)`. Numeric count-up is a GSAP tween gated to start at the seam's midpoint (not scrubbed — count-up plays once so the number is never "scrubbed backward").

**Choreography.** Three depth layers cross the seam: (z-back) WebGL field fading + sinking, (z-mid) a soft radial `--glow #6E9BFF` that contracts as the field dies, (z-front) the proof cards arriving on the standard rhythm. The hero is **pinned** for ~0.8 vh while `uDissolve` scrubs, then unpins exactly as the first counter crosses 60% opacity — the hand-off point.

**Timing.** Field dissolve `cinematic900` mapped across the pin scrub; counter rise `slow640`, stagger `base60`; count-up `moderate420` ease `out-expo`. Glow contraction `ambient1200`.

**Reduced-motion.** No pin, no scrub, no particles. R3F serves the static hero poster (last frame of the field). Counters render at final value immediately; cards fade opacity 0→1 only on scroll-in (`fast160`). No `translateY`, no blur.

---

### Seam 2 — Proof → Featured projects

**Concept.** A single proof card detaches from the stat grid and *becomes* the first project card — the evidence literally hands you the work. Story: "the numbers were these projects all along."

**Mechanism.**
- *Shared-element hand-off* — Framer Motion `layoutId` links the lead proof tile to the first featured-project card. As the proof block exits and projects enter, Framer animates position/scale via `layout` (it owns this lifecycle transition; GSAP does not touch a `layoutId` element).
- *Pinned reveal of the rest* — the remaining project cards use GSAP `ScrollTrigger` with a short **pin** on the projects header while cards stream up underneath: `translateY(lg48→0)`, `opacity 0→1`, stagger `loose90`.

**Choreography.** Two-plane hand-off: the `layoutId` card travels on the front plane (Framer, spring-free — we use a tween with token easing for consistency), while the proof grid behind it fades and de-scales by ~2% (`scale` is a transform, allowed) to recede. Pinned header holds for ~0.5 vh so the streaming cards have a stable frame to arrive into.

**Timing.** `layoutId` transit `base280` ease `inout` (symmetric move reads best with the in-out curve); project card stream `moderate420`, stagger `loose90`; proof recede `base280` ease `out`.

**Reduced-motion.** No `layoutId` morph — the proof card cross-fades out, the project card cross-fades in, same position logic but opacity-only. No pin; cards are present and simply fade on scroll-in. Grid de-scale dropped.

---

### Seam 3 — Featured projects → Engineering philosophy

**Concept.** The colorful project showcase *bleeds* its signature gradient down and the saturation drains into near-black; philosophy emerges as quiet, high-contrast text. Story: "step back from the artifacts to the principles behind them."

**Mechanism.**
- *Gradient bleed → dark* — GSAP `ScrollTrigger` `scrub` on a full-bleed background layer: a fixed-position gradient element (azure→teal) animates `opacity 1→0` and `translateY` (parallax) while the underlying `--bg #05070D` shows through. We animate the *gradient layer's* opacity, never `background-color`, to stay on compositor-friendly properties.
- *Philosophy entrance* — standard section rhythm (eyebrow→display→intro), reveal `blur(6→0)`.

**Choreography.** A scrubbed crossfade over ~1 vh: project cards parallax up and out at depth (`translateY` faster than scroll), the gradient sheet sinks and fades behind them, and the philosophy heading fades up through the clearing. A thin `--accent` hairline draws left→right (`scaleX 0→1`, transform-origin left) at the exact seam line to mark the chapter break.

**Timing.** Gradient bleed scrubbed across the pin range (no fixed duration — tied to scroll); hairline draw `slow640` ease `out-expo`; philosophy reveal `base280`/`moderate420` per rhythm.

**Reduced-motion.** Gradient sheet is static at low opacity (no scrub, no parallax). The hairline appears at full width instantly. Philosophy text fades opacity-only on scroll-in. Background is the flat near-black at all times.

---

### Seam 4 — Engineering philosophy → Experience

**Concept.** Philosophy's centered, calm column *shears* into the asymmetric experience layout via a parallax depth split — principles tilt aside to reveal the lived timeline. Story: "principles, then the proof of practice."

**Mechanism.**
- *Parallax depth shear* — GSAP `ScrollTrigger` `scrub` driving two transform layers at different rates: the philosophy column `translateY` (slow, recedes) and the experience rail `translateY` (fast, advances). No rotation on text (legibility); the "shear" is read from differential vertical parallax + a subtle `translateX` offset (`md24`) on the incoming rail.
- *Experience entrance* — first experience row uses the standard rhythm; the vertical timeline rail draws in with `scaleY 0→1` (transform-origin top).

**Choreography.** Three parallax depths: (back) a faint glow gradient drifting up, (mid) philosophy column easing out and up, (front) experience rail sliding in from the right with its connector line drawing down. The differential rates create the depth-shear without any non-transform property.

**Timing.** Parallax differential scrubbed; rail draw `slow640` ease `out`; row reveals `moderate420`, stagger `base60`; incoming `translateX` settle `base280` ease `out`.

**Reduced-motion.** No parallax differential, no shear — philosophy and experience are stacked, each fading opacity-only on scroll-in. Timeline rail is drawn (full height) statically; rows fade in place. No `translateX`.

---

### Seam 5 — Experience → Open source

**Concept.** The experience timeline rail does not stop — it *continues* straight into the open-source contribution stream, reframing employment history as one unbroken line of building. Story: "the work didn't end at the job; it spills into the commons."

**Mechanism.**
- *Timeline rail continuation* — a single shared vertical rail element spans both sections. GSAP `ScrollTrigger` keeps the rail's `scaleY` progress tied to scroll across the boundary so the line visually never breaks; nodes (jobs → repos) reveal as the rail passes them (`opacity 0→1`, `translateY sm16→0`).
- *Section relabel* — the section eyebrow swaps via Framer `AnimatePresence` (exit "EXPERIENCE" / enter "OPEN SOURCE") with opacity + small `y` — lifecycle, so Framer owns it.

**Choreography.** The rail is the through-line on the mid plane; behind it (back plane) the color temperature warms slightly toward teal as open source begins (gradient layer opacity, not hue animation — we cross-fade a pre-baked teal-weighted sheet). Repo nodes arrive on the front plane with `loose90` stagger so the stream feels denser than the measured job list above it — a textural acceleration that signals the section change.

**Timing.** Rail continuation scrubbed (continuous); eyebrow swap `fast160` ease `out`; node reveals `moderate420`, stagger `loose90`; teal sheet cross-fade `ambient1200`.

**Reduced-motion.** Rail is fully drawn and static across both sections (still visually continuous — good). Eyebrow swaps with a plain opacity cross-fade, no `y`. Nodes fade opacity-only on scroll-in. Teal sheet held at a fixed low opacity.

---

### Seam 6 — Open source → Writing / research (Blog + Research)

**Concept.** The dense open-source contribution field (commit-graph / repo grid, a light WebGL or canvas texture) *dissolves into language* — the visual noise resolves into the first article title. Story: "the building quiets into reflection and writing."

**Mechanism.**
- *Field dissolve → text* — if the open-source section carries a WebGL/instanced contribution field, R3F reads the seam's `scrollProgress` and ramps a `uDissolve` uniform (particles fade + sink), exactly as in Seam 1 but in reverse emphasis (noise → calm). GSAP writes the store value.
- *Writing entrance* — Blog/Research lead cards reveal with the reading-page subset: `opacity 0→1`, `translateY sm16→0`, `blur 6→0` on the lead headline only.

**Choreography.** Back plane: contribution field dissolving and sinking. Front plane: the first article card rising through where the field was, on the standard rhythm. Because the destination is a *reading* zone, the seam intentionally *decelerates* — stagger loosens to `base60`, travel shrinks to `sm16`. This is the spine's "calm-down" gear change before contact.

**Timing.** Field dissolve scrubbed across pin (or `cinematic900` if not pinned); card reveal `moderate420` ease `out`, stagger `base60`; lead headline blur `base280`.

**Reduced-motion.** R3F field → static poster (or the canvas renders one static frame), no dissolve. Article cards fade opacity-only on scroll-in. No blur, no `translateY`. This seam is already near-low-motion, so the gated version is nearly identical minus the WebGL ramp.

---

### Seam 7 — Writing / research → Contact

**Concept.** The reading column narrows and centers; everything extraneous fades until only an invitation remains. Story: "you've read the work — now reach out." This is the spine's quietest seam by design (utility destination).

**Mechanism.**
- *Calm-down + rule draw* — GSAP `ScrollTrigger` (no pin, no scrub) fires a one-shot reveal: the writing grid columns fade and the layout converges to a single centered contact column. A full-width `--accent`/gradient hairline draws (`scaleX 0→1`, origin center) as the chapter rule.
- *Contact entrance* — eyebrow→display→intro rhythm; the contact CTA/field group fades up `opacity 0→1`, `translateY sm16→0`.

**Choreography.** Minimal depth — one back-plane glow that gently expands (`scale`, transform) to "open up" the space, and the front-plane contact column arriving. No parallax differential, no WebGL. The restraint *is* the transition: motion energy drops to its floor right before the CTA so the call to action reads as the calmest, most deliberate moment on the page.

**Timing.** Hairline draw `slow640` ease `out-expo`; contact reveal `base280`/`moderate420` per rhythm; glow expand `ambient1200`. Outgoing writing grid fade `base280 × 0.7` (exit ratio) ease `out`.

**Reduced-motion.** Hairline full-width instantly; contact column and CTA fade opacity-only on scroll-in. Glow static. No `translateY`, no `scale`.

---

### Seam 8 — Contact → Footer

**Concept.** The signature gradient, absent through the reading/contact stretch, *returns* and sinks — the azure→teal wash pours down into the footer like the page settling to rest. Story: a visual bookend that rhymes with the hero's atmosphere. Story closes where it opened.

**Mechanism.**
- *Gradient sink into footer* — GSAP `ScrollTrigger` `scrub` (short range, end at document bottom) animates a footer-anchored gradient sheet `translateY` (rises into view from below) + `opacity 0→1`. Contact content above parallaxes up slightly (`translateY`, faster than scroll) to "make room."
- *Footer content* — footer links/credit reveal once with `opacity 0→1`, `translateY sm16→0`, tight stagger.

**Choreography.** Two planes: back-plane gradient sheet welling up and brightening toward `--glow`, front-plane contact block lifting away. The bleed is the inverse of Seam 3 — there color drained *out*; here it floods *back in*, closing the chromatic loop of the whole descent. A faint particle echo (if WebGL budget allows) can reignite at very low density to mirror the hero — strictly optional and opacity-gated.

**Timing.** Gradient sink scrubbed across the final ~0.6 vh; footer reveal `moderate420`, stagger `tight30`; brightness toward glow `ambient1200`.

**Reduced-motion.** Footer gradient is a static low-opacity wash (no scrub, no `translateY`). Footer content fades opacity-only. No particle echo. The chromatic bookend still reads via the static gradient presence.

---

## 4. Seam-mechanism summary

| # | Seam | Primary engine | Pin? | Scrub? | Signature move | Lead tokens |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Hero → Proof | R3F + GSAP | Yes | Yes | WebGL field dissolve, counters rise | `cinematic900`, `slow640`, `base60` |
| 2 | Proof → Projects | Framer + GSAP | Short | No | `layoutId` card hand-off | `base280` inout, `loose90` |
| 3 | Projects → Philosophy | GSAP | No | Yes | Gradient bleed → dark crossfade | scrub, `slow640`, `out-expo` |
| 4 | Philosophy → Experience | GSAP | No | Yes | Parallax depth shear | scrub, `slow640`, `base60` |
| 5 | Experience → Open source | GSAP + Framer | No | Yes | Timeline rail continuation | scrub, `fast160`, `loose90` |
| 6 | Open source → Writing | R3F + GSAP | Opt. | Yes/Opt. | Field dissolve → text | scrub/`cinematic900`, `base60` |
| 7 | Writing → Contact | GSAP | No | No | Calm-down + rule draw | `slow640`, `base280`, `out-expo` |
| 8 | Contact → Footer | GSAP | No | Yes | Gradient sink (bookend) | scrub, `moderate420`, `tight30` |

Only properties touched at scroll time: `transform` (`translateX/Y`, `scale`, `scaleX/Y`), `opacity`, and `filter: blur` on text reveals. WebGL dissolves are shader-uniform driven (no DOM cost).

---

## 5. No scroll-jacking, keyboard scroll preserved

Seams must never feel like the page is "grabbing" the wheel. The rules:

- **Lenis owns scroll; pins are visual, not positional.** Pins are implemented with GSAP `ScrollTrigger`'s `pin: true` (pin-spacer reserves real document height). The scrollbar keeps moving 1:1 with input — the *content* is held while the *scroll position* advances normally. Nothing intercepts wheel/touch velocity, nothing snaps, nothing teleports the scroll position.
- **One rAF, one scroll value.** `gsap.ticker` → `lenis.raf`; `lenis.on('scroll')` → `ScrollTrigger.update()`. There is no second loop competing for scroll authority, so seams stay in sync and never stutter-fight Lenis. See [scroll-strategy](./scroll-strategy.md).
- **No `preventDefault` on input.** We never cancel wheel/touch/keydown to drive animation. All seam progress derives from the *observed* scroll position, so the user is always in control of pace and direction.
- **Keyboard + AT scrolling works everywhere.** Space / PageDown / PageUp / Arrow / Home / End move Lenis (it normalizes keyboard scroll) and therefore advance every pinned/scrubbed seam exactly like a wheel does. Focusable elements inside pinned sections remain reachable; pin-spacers don't trap focus. `scroll-margin-top` accounts for any sticky header so anchored jumps land cleanly.
- **No anchor hijack surprises.** In-page anchors and the page-transition curtain (Framer) coordinate so a deep link past a seam restores the destination's *resolved* (post-reveal) state rather than replaying a half-finished pin. Content reveals use `once: true`; arriving via anchor shows finished content immediately.
- **Reduced motion removes pins/scrubs entirely.** Under the global gate (OS pref OR in-app toggle OR `saveData` → Zustand → `<html data-motion="reduced">`), all seam GSAP lives inside `gsap.matchMedia` and the reduced branch builds **no** pin and **no** scrub — sections are plain stacked blocks with opacity-only scroll-in. Lenis is **not instantiated** (native scroll). R3F serves static posters. This is also the JS-off baseline: content is in the DOM, readable, and ordered correctly with zero animation. See [animation-strategy](./animation-strategy.md) and [three-strategy](./three-strategy.md).

**Authoring guardrails (Phase 1 acceptance):** every seam must (a) leave the scrollbar position monotonic with input, (b) pass a keyboard-only top-to-bottom traversal, (c) render identically-ordered, fully-legible content with motion gated off, and (d) touch only transform/opacity/blur on the main thread. Any seam that can't meet all four is downgraded to the opacity-only subset. Per-page application of these seams is enumerated in [page-specifications](./page-specifications.md).

# Animation System

The motion architecture for the portfolio. Every animated surface is built on a
small set of shared tokens, runs through a single Framer Motion configuration, and
is gated by one reduced-motion contract. Heavy engines (GSAP, WebGL) are code-split
off the critical path and only load on the routes that need them.

**Engines in play**

| Engine | Role | Where it loads |
| --- | --- | --- |
| Framer Motion 12 (`framer-motion`) | Component-level entrances, route transitions, scroll progress, magnetic hover | Everywhere, via `LazyMotion` + `domAnimation` (`m.*` only) |
| GSAP 3 + ScrollTrigger | Scrubbed scroll timeline | `/timeline` only, lazily through `@/lib/motion/gsap` |
| Lenis | Smooth wheel scroll + ScrollTrigger sync | App-wide, via `LenisProvider` |
| Three.js / R3F | Hero "Signal Field" | Landing hero only — see `docs/three-system.md` |

---

## 1. Tokens — the single source of truth

All durations, easings, and stagger values live in
[`src/constants/animation.ts`](../src/constants/animation.ts). Nothing in the motion
layer hardcodes a number; it imports from here so timing stays consistent.

### Durations (seconds)

```ts
DURATIONS = {
  instant:   0.08,
  fast:      0.16,
  base:      0.28,
  moderate:  0.42,
  slow:      0.64,
  cinematic: 0.9,
}
```

### Easings (cubic-bezier control points)

```ts
EASINGS = {
  out:     [0.22, 1,    0.36, 1],   // default ease-out
  outExpo: [0.16, 1,    0.3,  1],   // sharper exponential settle
  inOut:   [0.83, 0,    0.17, 1],   // symmetric in/out
  back:    [0.34, 1.56, 0.64, 1],   // slight overshoot
}
```

### Staggers (seconds between children)

```ts
STAGGER = { tight: 0.03, base: 0.06, loose: 0.09 }
```

### The bridge layer — `src/animations/`

[`src/animations/easings.ts`](../src/animations/easings.ts) re-exports the constants
as `DURATION` / `EASE` and adds CSS helpers so the same tuples can drive both Framer
Motion and raw CSS:

- `toCssBezier(tuple)` → `"cubic-bezier(...)"` string.
- `CSS_EASINGS` — every easing pre-rendered as a CSS string, keyed by name.

The rest of `src/animations/` builds reusable presets from these tokens:

- **[`variants.ts`](../src/animations/variants.ts)** — core Framer `Variants`
  (transform/opacity only): `fadeIn`, `fadeInUp`, `fadeInDown`, `scaleIn`, and the
  `staggerContainer(stagger = STAGGER.base)` factory.
- **[`reveal.ts`](../src/animations/reveal.ts)** — `createReveal({ direction,
  distance = 28, blur = true, duration, delay })` builds a `hidden → visible`
  variant with directional travel and an optional `blur(6px) → blur(0)`. Ships
  ready-made `reveal`, `revealUp/Down/Left/Right`.
- **[`transitions.ts`](../src/animations/transitions.ts)** — `Transition` presets:
  `pageTransition` (slow / outExpo), `sectionReveal` (moderate / out), `snappy`
  (fast / out), `smoothSpring` and `bounceSpring` (springs for interactive elements).
- **[`scroll.ts`](../src/animations/scroll.ts)** — framework-agnostic, pure scroll
  math (no React/Framer import): `parallaxOffset`, `lerp`, `normalize`, `mapRange`.
  Safe to use in Lenis bridges, parallax layers, and the progress bar.

---

## 2. Framer Motion setup — `LazyMotion`

Framer is configured once in
[`src/providers/motion-provider.tsx`](../src/providers/motion-provider.tsx):

```tsx
<LazyMotion features={domAnimation} strict>
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
</LazyMotion>
```

- **`LazyMotion` + `domAnimation`** loads only the DOM animation feature set
  (animation, exit, in-view, hover/focus/tap) instead of the full bundle. This is
  why the entire app uses **`m.*`** (e.g. `m.div`) rather than `motion.*` — the
  lighter `m` component picks up its features from the provider.
- **`strict`** throws at dev time if anyone imports the heavy `motion.*` API,
  enforcing the `m.*`-only rule and keeping the bundle small.
- **`MotionConfig reducedMotion="user"`** makes Framer honor the OS
  `prefers-reduced-motion` setting natively as a baseline. The app layers an
  additional in-app override on top (see §6).

**Provider order** ([`app-providers.tsx`](../src/providers/app-providers.tsx)):
`Theme > Motion > Tooltip > Lenis`, with a global `Toaster`. Mounted once in the
root layout. There is no data-fetching provider — the only live data (GitHub) is
fetched server-side with ISR.

---

## 3. The motion components — `src/components/motion/`

### `Reveal` — in-view entrance

[`reveal.tsx`](../src/components/motion/reveal.tsx). Wraps children and plays the
`fadeInUp` variant when the element scrolls into view.

```tsx
<Reveal delay={0.1} once amount={0.3}>…</Reveal>
```

- Uses `whileInView` with `viewport={{ once, amount }}` (`amount` = fraction visible
  to trigger, default `0.3`; `once` defaults `true`).
- **Reduced motion:** returns a plain `<div>` — children render immediately at full
  opacity, no transform. Used across nearly every page (`app/(site)/*`, section
  components, `project-grid`).

### `Magnetic` — pointer-follow hover

[`magnetic.tsx`](../src/components/motion/magnetic.tsx) +
[`use-magnetic.ts`](../src/hooks/use-magnetic.ts). Wraps a single interactive child
so it translates toward the cursor while within an activation radius.

- Hook applies `translate3d(...)` directly to the element via a single throttled
  `requestAnimationFrame` per `pointermove`; `strength` (default `0.35`) scales the
  offset, `radius` (default `120px`) gates activation. Resets on `pointerleave` and
  on cleanup.
- **Disabled** on touch / coarse pointers (`(pointer: coarse)` in the component;
  `(pointer: fine)` guard in the hook) **and** under reduced motion — in either case
  the component renders an inert `<span>`.

### `ScrollProgress` — page progress bar

[`scroll-progress.tsx`](../src/components/motion/scroll-progress.tsx) +
[`use-scroll-progress.ts`](../src/hooks/use-scroll-progress.ts). A fixed full-width
bar (`top-0`, `h-0.5`) whose `scaleX` reflects 0→1 page scroll.

- The hook tracks `scrollY / (scrollHeight − innerHeight)`, clamped to `0..1`, via a
  passive `scroll`/`resize` listener throttled to one rAF per tick.
- Exposes proper `role="progressbar"` + `aria-valuenow`.
- **Reduced motion:** returns `null` — no constantly-moving element at all.
- Mounted in the site layout above the `PageShell`.

---

## 4. Route transitions — `PageTransition`

[`src/components/transitions/page-transition.tsx`](../src/components/transitions/page-transition.tsx),
mounted inside `PageShell` in [`app/(site)/layout.tsx`](../src/app/(site)/layout.tsx)
and keyed on `usePathname()` so each navigation re-mounts and re-plays.

```tsx
<m.div key={pathname} initial={{ y: 8 }} animate={{ y: 0 }}
       transition={{ duration: DURATION.base, ease: [...EASE.out] }}>
```

This is deliberately **transform-only — there is no opacity gate**:

- Content is always painted at full opacity → never invisible on first load, never
  delays LCP, and stays visible with JS disabled.
- Transform-based motion does not contribute to CLS.
- **Reduced motion:** renders `<>{children}</>` with no wrapper or animation.

---

## 5. Smooth scroll — Lenis

[`src/providers/lenis-provider.tsx`](../src/providers/lenis-provider.tsx) creates a
single Lenis instance (`{ duration: 1.1, smoothWheel: true }`) and exposes it through
`LenisContext`. Its internal loop is driven manually on `requestAnimationFrame`; the
instance is destroyed and the frame cancelled on cleanup.

- Consumed via [`use-lenis.ts`](../src/hooks/use-lenis.ts) (`useLenis()`), which
  returns the instance or `null`.
- **Reduced motion:** the provider returns early and **never instantiates Lenis** —
  context value stays `null` and native browser scrolling is used. Any consumer must
  null-check (e.g. the timeline does `lenis?.on(...)`).

---

## 6. The GSAP timeline (lazy, `/timeline` only)

GSAP is never in the shared bundle. The only accessor is
[`src/lib/motion/gsap.ts`](../src/lib/motion/gsap.ts):

```ts
export function getGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}
```

It registers `ScrollTrigger` exactly once and is imported by **one** component —
[`src/components/portfolio/timeline-rail.tsx`](../src/components/portfolio/timeline-rail.tsx),
the client island for `/timeline`. Behavior:

- **Progress line:** `ScrollTrigger` with `scrub: true` tweens the rail's progress
  span `scaleY` from `0 → 1` across `start: "top 80%"` → `end: "bottom 20%"`.
- **Milestones:** each `<li>` fades + slides (`opacity/y`, `DURATION.base`,
  `power3.out`) as it crosses `top 85%`, with `toggleActions: "play none none none"`
  so it reveals **once and stays** (stable reading + keyboard nav).
- **Lenis sync:** `lenis?.on("scroll", () => ScrollTrigger.update())` keeps
  ScrollTrigger aligned with Lenis' virtualized scroll position.
- **A11y safeguard:** a `focusin` handler immediately reveals (`gsap.set`) any
  not-yet-animated milestone whose control receives focus, so focus is never trapped
  on an invisible element.
- All work runs inside a `gsap.context(...)` scoped to the rail; cleanup calls
  `ctx.revert()`, which kills the tweens + ScrollTriggers and restores the static DOM.

The default server-rendered DOM is the *static* state: a full-height progress line
and every milestone fully visible. GSAP only *subtracts* that into an animated reveal
— so content is never gated behind motion or JS.

---

## 7. The reduced-motion contract

There is one resolver,
[`src/hooks/use-reduced-motion.ts`](../src/hooks/use-reduced-motion.ts), and every
engine obeys it. It combines two inputs:

1. **OS preference** — `(prefers-reduced-motion: reduce)`, read via
   `useSyncExternalStore` (SSR-safe, server snapshot `false`).
2. **In-app override** — `motionPreference` from the Zustand UI store
   ([`src/stores/ui-store.ts`](../src/stores/ui-store.ts)), persisted to
   `localStorage`. Values: `"system"` (follow OS), `"reduced"` (force on),
   `"full"` (force off).

```
reduced === true  when  motionPreference === "reduced"
              ||  (motionPreference === "system" && OS prefers reduce)
```

### What each surface does when reduced

| Surface | Reduced-motion behavior |
| --- | --- |
| Framer baseline | `MotionConfig reducedMotion="user"` honors the OS pref natively |
| `Reveal` | Renders a plain `<div>`; children appear instantly, no transform |
| `Magnetic` | Renders an inert `<span>`; no pointer-follow |
| `ScrollProgress` | Returns `null`; no progress bar |
| `PageTransition` | Returns children unwrapped; no route transition |
| Lenis | Provider never instantiates; native scroll, context `null` |
| GSAP timeline | No tweens registered; static full-height line + all items visible (the default DOM) |
| WebGL hero | Canvas not mounted; static gradient poster (see `docs/three-system.md`) |

Because every reduced path is also the **default render** (or a no-op), the
reduced-motion experience is always the fully-functional content — motion is purely
additive.

> **Hero copy is intentionally not gated.** The landing hero text renders visible in
> the DOM regardless of motion settings; only the decorative WebGL field and the
> entrance flourishes are conditional.

---

## 8. Adding a new animation — checklist

1. Pull timing from `DURATION` / `EASE` / `STAGGER` — don't hardcode numbers.
2. Animate **transform + opacity** (and `filter` for blur) only; avoid layout props.
3. Use `m.*`, never `motion.*` (the `strict` flag will reject it).
4. Read `useReducedMotion()` and provide a static fallback that matches the default
   DOM — never hide content behind the animation.
5. Keep it out of the critical path if it pulls a heavy dependency (lazy-load like
   GSAP/Three).

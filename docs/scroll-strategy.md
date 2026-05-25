# Scroll Strategy

> Purpose: Defines how scrolling works across the portfolio — Lenis as the sole scroll authority feeding one rAF, how GSAP ScrollTrigger consumes that value for pin/scrub/horizontal sections, and the accessibility rules that guarantee no scroll-jacking and a native-scroll fallback under reduced motion.

## Operating principles

1. **One scroll value.** Lenis owns the scroll position. Nothing else reads `window.scrollY` for animation; everything reads Lenis (directly or via ScrollTrigger).
2. **One rAF.** `gsap.ticker` is the only animation loop. It drives `lenis.raf`; Lenis emits scroll; ScrollTrigger updates. No component spins its own `requestAnimationFrame` for scroll.
3. **Lenis animates nothing.** Lenis only smooths and reports the scroll value. All visible scroll-linked motion is authored in GSAP/ScrollTrigger or read from the shared store by R3F.
4. **Transform/opacity only.** Scroll-linked visuals never animate layout-affecting properties; parallax and pins move via `transform`.
5. **No scroll-jacking.** The page never refuses or hijacks the user's scroll intent. See the explicit rules section at the end.

See [animation-strategy](./animation-strategy.md) for tokens and the runtime, [section-transitions](./section-transitions.md) for the page-transition curtain, [three-strategy](./three-strategy.md) for the R3F shared store, and [accessibility-strategy](./accessibility-strategy.md) for the reduced-motion gate.

---

## 1. Smooth scrolling behaviour (Lenis config)

Lenis is instantiated once at the app root **only when `<html data-motion="full">`**. Indicative configuration:

| Option | Value | Rationale |
| --- | --- | --- |
| `duration` | ~1.0–1.2s | Smooth but responsive; not floaty. |
| `easing` | exponential ease-out | Natural deceleration; matches `out-expo` feel. |
| `lerp` | ~0.1 (alt. to duration) | If using lerp mode instead of duration. |
| `smoothWheel` | `true` | Smooths mouse-wheel/trackpad. |
| `smoothTouch` | `false` | **Never** smooth touch — native momentum is expected on mobile; smoothing touch feels broken and risks hijack. |
| `wheelMultiplier` | ~1.0 | No exaggerated wheel speed. |
| `syncTouch` | `false` | Defer to native touch scrolling. |
| `orientation` | `vertical` | Page is vertical; horizontal sections handled by GSAP, not Lenis. |

Lenis is the **single scroll authority**. The instance is held in a ref/store and exposed so ScrollTrigger and the reading-progress bar can read it.

## 2. Native fallback

Lenis is **not instantiated** when:

- OS `prefers-reduced-motion: reduce`, **or**
- the in-app Pause-motion toggle is on, **or**
- `Save-Data` is set, **or**
- the device is touch-primary (smooth wheel is irrelevant; native momentum is used).

In all these cases the browser's **native scroll** is used as-is. Because nothing depends on Lenis existing (ScrollTrigger falls back to reading the scroller directly), the site is fully functional with zero smoothing. CSS `scroll-behavior` is left at the platform default so in-page anchors still work natively.

## 3. Lenis usage — sole authority + the single-rAF bridge

The bridge is the heart of the runtime. Wiring (conceptual):

| Step | Wiring | Effect |
| --- | --- | --- |
| 1 | `gsap.ticker.add((time) => lenis.raf(time * 1000))` | GSAP's ticker is the ONE loop; it advances Lenis each frame. |
| 2 | `gsap.ticker.lagSmoothing(0)` | Disable GSAP lag smoothing so Lenis and ScrollTrigger stay in lockstep. |
| 3 | `lenis.on('scroll', ScrollTrigger.update)` | Every Lenis scroll emission updates all ScrollTriggers in the same frame. |
| 4 | `ScrollTrigger.scrollerProxy` / Lenis-aware setup | ScrollTrigger reads the Lenis-managed scroll value, not raw `scrollY`. |

R3F reads scroll/pointer from the **shared store** (fed by the same Lenis value), never starting its own scroll listener. There is exactly one rAF in the system.

## 4. GSAP ScrollTrigger usage

All ScrollTrigger work lives **inside `gsap.matchMedia()`** so it can be cleanly created/reverted per breakpoint and per motion preference. Responsibilities:

- **Scrub** progress-linked timelines to the Lenis scroll value.
- **Pin** sections that hold while inner content advances.
- Build **timelines** for sequenced, scroll-driven reveals.
- Drive **horizontal scroll** translation.
- Trigger one-shot reveals (`once: true`) for content entrances.

`ScrollTrigger.refresh()` is called after fonts/layout settle and on route changes (see §9). The reduced branch of `matchMedia` creates **no pins and no scrubs** — only static end-states.

## 5. Pinned sections (per page)

| Page / section | Pin behaviour | Notes |
| --- | --- | --- |
| Landing — **Featured Work** | Pin the section while featured projects advance/scrub through. | Cinematic hero handoff; transform/opacity only. |
| Landing — hero -> intro | Optional short pin for the wordmark->monogram handoff and R3F scene beat. | Coordinates with logo scroll-collapse. |
| **Projects** `/projects` — horizontal scroll | Pin the viewport; translate the track horizontally on vertical scroll. | Page never hijacked on touch (see rules); Prev/Next provided. |
| **Engineering Philosophy** `/philosophy` | Pin tenets/statement panels while text and supporting visuals scrub through. | Long-form pacing; each tenet a scrubbed beat. |
| **Timeline** `/timeline` | Optional pin of the axis while entries reveal along it. | Falls back to a plain stacked list when reduced. |
| **Project detail** `/projects/[slug]` | Optional pin for a media/case-study moment. | Reading-progress bar runs concurrently (§7). |

Every pinned/horizontal section has a **static, non-pinned equivalent** under reduced motion and on constrained mobile (see §8, §10).

## 6. Parallax depth layers (transform-only)

- Background, mid, and foreground layers translate at different rates against the Lenis value to imply depth.
- Implemented purely with `transform: translate3d()` (and occasionally `scale`) — **never** `top`/`margin`/`background-position` that would trigger layout.
- Maximum displacement is bounded so text never drifts out of its readable region; parallax is decorative and never moves content out of reading order.
- R3F depth (camera/scene) reads the same shared scroll value, keeping WebGL and DOM parallax in sync from one source.
- Disabled entirely under reduced motion (layers render at their neutral position).

## 7. Scroll progress (reading-progress bar)

- Present on **Blog post `/blog/[slug]`** and **Project detail `/projects/[slug]`** — a thin top bar showing read progress through the article body.
- Driven by the **Lenis scroll value** mapped to the article's scroll range (start at content top, complete at content end), not the whole document.
- Visual update is `transform: scaleX()` from `transform-origin:left` — transform-only, GPU-friendly.
- **A11y:** the bar is decorative (`aria-hidden="true"`); progress is also conveyed by normal document structure and headings, so nothing is gated behind it. It is never the sole indicator of anything actionable.
- **Reduced motion / native fallback:** the bar still works (it reflects native `scrollY` when Lenis is absent), but updates without smoothing; it may also be omitted entirely under reduced motion since it is purely decorative — content is unaffected either way.

## 8. Scroll restoration (route changes)

| Scenario | Behaviour |
| --- | --- |
| Forward navigation (new route) | Scroll resets to top; history scroll restoration set to `manual` so the framework doesn't fight Lenis. |
| Back / forward (bfcache-like) | Restore the previous scroll position for that entry where the router provides it; otherwise top. |
| In-page anchor / deep link with hash | Scroll to the target element and **move focus** to it (see rules §12). |

Because scroll is owned by Lenis (when present), restoration is performed via `lenis.scrollTo(target, { immediate: true })`; with native fallback it uses standard `window.scrollTo`.

## 9. Route-transition scroll behaviour

The page-transition curtain (Framer Motion, see [section-transitions](./section-transitions.md)) coordinates with scroll as follows:

1. On route commit, jump to top immediately: `lenis.scrollTo(0, { immediate: true })` (or `window.scrollTo(0,0)` in native fallback) — under the curtain so no visible jump.
2. Move focus to `#main-content` and announce the new page title (polite live region).
3. After **fonts load and layout settles**, call `ScrollTrigger.refresh()` so all pins/scrubs recompute against final measurements.
4. Re-create `matchMedia`-scoped ScrollTriggers for the new route; revert the old route's triggers on unmount to avoid leaks.

Ordering matters: scroll-to-top and `refresh()` happen while the curtain covers the viewport, preventing layout-shift flashes.

## 10. Mobile simplification

- `smoothTouch: false` — native momentum scrolling; Lenis does not smooth touch.
- Heavy pins and scrubs are **reduced or removed** on small/touch breakpoints via `gsap.matchMedia` (`(min-width: …)` queries). Horizontal sections become vertical stacks or a swipeable carousel with visible Prev/Next.
- Parallax depth is dampened or disabled to protect performance and battery.
- R3F scene reduces draw cost (lower DPR/poster) on mobile; reads the same shared value.
- All scroll-linked content remains fully reachable by ordinary vertical scrolling.

## 11. Reduced-motion behaviour

When `<html data-motion="reduced">` (OS pref OR in-app Pause-motion OR `Save-Data`):

| Subsystem | Reduced behaviour |
| --- | --- |
| Lenis | **Not instantiated** — native scroll only. |
| ScrollTrigger | `matchMedia` reduced branch: **no pin, no scrub**; reveals become static end-states (or instant `once` fades at most). |
| Parallax | Disabled; layers at neutral position. |
| Horizontal sections | Render as static vertical stacks / paginated lists with Prev/Next. |
| Reading-progress bar | Decorative only; static or native-driven, never required. |
| R3F | Static poster (no scroll-driven camera). |

No information is lost: every scroll-driven reveal has a fully-visible static equivalent. Content is never gated behind scroll position.

---

## 12. No scroll-jacking — hard rules

These are non-negotiable acceptance criteria. Smooth scroll and pinned/horizontal sections must respect them.

| Rule | Requirement |
| --- | --- |
| **Keyboard scroll keys work** | Space / Shift+Space, Page Up/Down, Home/End, and Arrow keys scroll the page normally. Lenis must not swallow them; pinned sections must not block them. Verified on every page including horizontal/pinned ones. |
| **Anchors move focus, not just scroll** | Activating an in-page link/skip-link scrolls **and** moves keyboard focus to the target (`tabindex="-1"` on non-interactive targets), so screen-reader and keyboard users land there — not merely a visual scroll. |
| **Horizontal sections never hijack the page on touch** | On touch devices, horizontal sections respond to horizontal gestures (or visible Prev/Next) and **never** trap, redirect, or block normal vertical page scrolling. No "you must scroll sideways to continue." |
| **Visible Prev/Next on carousels & horizontal views** | Every horizontal/carousel view exposes visible, >= 24px Prev/Next controls (WCAG 2.5.7 — not gesture-only) and a static fallback under reduced motion. |
| **Focus not obscured by sticky header** | `scroll-margin-top` (>= sticky-header height) on all focusable/anchor targets so the sticky nav never covers the focused element (WCAG 2.4.11/2.4.12). The header collapses (wordmark -> "JS") but reserves enough offset. |
| **No forced/locked scroll except intentional modals** | Body scroll lock applies only inside open Radix/cmdk overlays, which always offer Esc and return focus. The page itself is never locked mid-read. |
| **No infinite-pin dead-ends** | Pinned sections always release; the user can always continue scrolling past them at a natural pace, and can scroll back. |
| **Reduced motion = native** | When motion is reduced, Lenis is gone and the browser's own scroll governs everything — the most predictable, jank-free baseline. |

---

## Cross-references

- [animation-strategy](./animation-strategy.md) — tokens, the single-rAF runtime, orchestration.
- [section-transitions](./section-transitions.md) — page-transition curtain timing vs scroll reset/refresh.
- [accessibility-strategy](./accessibility-strategy.md) — reduced-motion gate, focus-on-route-change, forced-colors, 2.4.11/2.5.7.
- [three-strategy](./three-strategy.md) — R3F shared scroll store and static poster.
- [component-inventory](./component-inventory.md) — components owning each pinned/horizontal/parallax section.

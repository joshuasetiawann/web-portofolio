# Interaction Plan

> Purpose: The canonical specification for every discrete micro-interaction in Joshua Setiawan's portfolio — what fires, which library owns it, how it behaves under keyboard and assistive tech, and how it degrades to a static, content-equivalent state under reduced motion.

## How to read this document

Each interaction below is a self-contained block describing six facets:

- **What it is** — the visible/audible behaviour.
- **Trigger -> Feedback** — the input event(s) and the perceptual response.
- **Library** — which motion authority owns it (see the division of labor below).
- **Keyboard + a11y** — focus, roles, ARIA, announcements, target size.
- **Reduced motion** — the degraded behaviour when `<html data-motion="reduced">`.

### Motion division of labor (binding constraint)

| Concern | Authority |
| --- | --- |
| State / lifecycle: enter/exit, `layout`/`layoutId`, gestures, page-transition curtain | **Framer Motion** (`reducedMotion="user"`) |
| Scroll progress, pin, scrub, timelines, horizontal scroll | **GSAP + ScrollTrigger** (inside `gsap.matchMedia`) |
| Smooth scroll + the single scroll value (animates nothing itself) | **Lenis** |
| WebGL reading scroll/pointer from a shared store | **R3F** |

There is **ONE rAF**: `gsap.ticker` drives `lenis.raf`; `lenis.on('scroll')` calls `ScrollTrigger.update()`. No second loop. No scroll-jacking. See [scroll-strategy](./scroll-strategy.md) for the full bridge, [animation-strategy](./animation-strategy.md) for tokens/orchestration, and [accessibility-strategy](./accessibility-strategy.md) for the reduced-motion gate and focus model.

### Motion tokens used throughout

- **Durations (ms):** `instant80` · `fast160` · `base280` · `moderate420` · `slow640` · `cinematic900` · `ambient1200+`. Exit ~= 0.7x its enter duration.
- **Eases:** `out (.22,1,.36,1)` · `out-expo (.16,1,.3,1)` · `inout (.83,0,.17,1)` · `back (.34,1.56,.64,1)`.
- **Springs:** `snappy (420/32/0.8)` · `soft (260/30/1)` · `layout (300/34/1)` · `magnetic (150/15/0.4)`.
- **Staggers:** `tight30` · `base60` · `loose90`.
- **Physical limits:** magnetic displacement max **18px**; card lift **-6px**.
- **Color tokens:** accent azure `#5E8BFF`, teal `#38E8C8`, near-black `#05070D`, glow `#6E9BFF`.

### The reduced-motion gate (applies to every block)

A single Zustand-backed boolean derives from **OS `prefers-reduced-motion` OR in-app Pause-motion toggle OR `Save-Data`**, and is reflected to `<html data-motion="full|reduced">`. When reduced: Framer honours `reducedMotion="user"`, GSAP's `matchMedia` reduced branch renders static end-states (no pin, no scrub), Lenis is **not instantiated** (native scroll), and R3F renders a static poster. A visible, explicit **Pause-motion** control satisfies WCAG 2.2.2. Content is **never** gated behind animation; only `transform`/`opacity` animate.

---

## 1. Navigation hover (primary bar links)

- **What it is:** Subtle affordance on the four primary links (Projects, About, Blog, Contact) — label nudges up ~1px while an accent underline (`#5E8BFF`) wipes in from the left.
- **Trigger -> Feedback:** `pointerenter` / focus -> underline scaleX 0->1 from `transform-origin:left`, label `translateY(-1px)`. `pointerleave` -> underline scaleX -> 0 from origin right; exit duration ~= 0.7x enter.
- **Library:** Framer Motion (`whileHover`/`animate` on `<Link>`), `out` ease, `fast160`.
- **Keyboard + a11y:** Hover styles are mirrored on `:focus-visible` so keyboard users get the same affordance. Underline is decorative (`aria-hidden`); the link text alone conveys meaning. Target >= 24px (2.5.8); never color alone (motion + position + the active marker carry state).
- **Reduced motion:** No translate, no wipe. `:focus-visible`/`:hover` swap to an instant static underline + brightened label color (>= 3:1 against the bar). `instant80` opacity only.

## 2. Navigation active state (current route)

- **What it is:** The link matching the current route is marked persistently — full-width accent underline plus a small leading dot/notch glyph, independent of hover.
- **Trigger -> Feedback:** Route match -> `aria-current="page"` set on the link; a `layoutId="nav-active"` underline slides from the previous active link to the new one on navigation.
- **Library:** Framer Motion `layoutId` shared-element slide (`layout` spring 300/34/1). State derived from the router pathname.
- **Keyboard + a11y:** `aria-current="page"` is the programmatic source of truth. The **non-color marker** (the leading dot/notch + bold weight) ensures the active state is perceivable without color (never color alone). Within Explore mega-menu and footer sitemap the same `aria-current` rule applies.
- **Reduced motion:** No sliding underline; the marker and `aria-current` snap to the new link instantly (`instant80` crossfade of the underline position, or no transition at all).

## 3. Mobile menu open / close

- **What it is:** Full-height overlay panel (Radix Dialog) housing primary links, the Explore destinations, theme toggle, and palette trigger; backdrop scrim over near-black.
- **Trigger -> Feedback:** Hamburger tap -> panel slides/fades in (`base280`, `out-expo`), backdrop fades to scrim, page content marked `inert`. Close via the X, backdrop, or **Esc** -> exit at ~0.7x (`fast160`).
- **Library:** Framer Motion `AnimatePresence` for enter/exit; Radix Dialog for semantics/focus management.
- **Keyboard + a11y:** Radix provides focus **trap**, `inert` on the rest of the page, **Esc to close**, and **return focus to the hamburger trigger** on close. `role="dialog"` + `aria-modal` + labelled by the menu title. Links in DOM reading order; targets >= 24px. Body scroll locked while open.
- **Reduced motion:** No slide; panel and scrim cross-fade with `opacity` only (`instant80`/`fast160`). All trap/Esc/return-focus semantics unchanged (these are not motion).

## 4. Theme toggle (light <-> dark)

- **What it is:** Dark-default toggle; switching themes plays a circular-reveal wipe of the new palette emanating from the toggle button (fallback: crossfade).
- **Trigger -> Feedback:** Click/Enter/Space -> `next-themes` sets theme; a `clip-path: circle()` (or `View Transitions` where supported) expands from the button origin over `moderate420`, `inout`. Icon morphs sun<->moon.
- **Library:** `next-themes` for state + persistence; Framer Motion / View Transitions API for the reveal; GSAP not involved.
- **Keyboard + a11y:** Real `<button>` with `aria-pressed` (or `aria-label="Switch to light/dark theme"` reflecting next state). Focusable, operable by Enter/Space, `:focus-visible` outline. No `prefers-color-scheme` flash (theme resolved before paint). Target >= 24px.
- **Reduced motion:** **Instant** swap — no circular reveal, no crossfade longer than `instant80`. The icon swaps without morph. Theme change itself is content-neutral, so nothing is lost.

## 5. Button hover (standard buttons / CTAs)

- **What it is:** Background lightens toward glow `#6E9BFF`, faint surrounding glow, label tracking opens slightly; active/press scales to 0.98.
- **Trigger -> Feedback:** `pointerenter`/focus -> bg + glow transition `fast160`, `out`. `pointerdown` -> `scale(0.98)` snappy; release returns.
- **Library:** Framer Motion `whileHover`/`whileTap`; CSS for the base transition.
- **Keyboard + a11y:** Hover state mirrored on `:focus-visible`. Press state mirrored on `:active` and keyboard activation. Contrast of label vs background maintained >= 4.5:1 in both rest and hover. Target >= 24px; >= 44px for primary CTAs.
- **Reduced motion:** No scale, no glow pulse. Instant background/border color change on hover/focus (`instant80`), preserving the same contrast deltas.

## 6. Magnetic buttons (`useMagnetic`)

- **What it is:** Primary CTAs and the logo subtly pull toward the cursor within a proximity radius; label may counter-translate for depth.
- **Trigger -> Feedback:** `pointermove` within radius -> button translates toward pointer, **clamped to max 18px**, `magnetic` spring (150/15/0.4); `pointerleave` -> springs back to origin.
- **Library:** Framer Motion motion values + the `useMagnetic` hook; gated behind `(hover:hover) and (pointer:fine)`.
- **Keyboard + a11y:** Magnetism is **additive polish only** — never the activation path. Keyboard focus and Enter/Space work identically without any pointer. Custom cursor / magnetism never removes the native cursor or focus ring. Touch and coarse pointers get the static button (no jitter).
- **Reduced motion:** Hook is a no-op; button stays fixed. The standard button hover (section 5, instant) applies.

## 7. Card hover (project / blog / gallery cards)

- **What it is:** Card lifts, gains an accent glow, and its cover image scales slightly within an `overflow:hidden` frame.
- **Trigger -> Feedback:** `pointerenter`/focus-within -> `translateY(-6px)` (card lift token), box-shadow glow (`#6E9BFF` low-alpha), cover `scale(1.03)`; `base280` enter, ~0.7x exit, `out`.
- **Library:** Framer Motion `whileHover`/`animate` on the card; `layoutId` reserved for card->detail shared-element transition (see [section-transitions](./section-transitions.md)).
- **Keyboard + a11y:** Entire card is one focusable link (or has a clear primary link); hover state mirrors on **`:focus-within`** so keyboard focus lifts the card. Title/metadata are real text, not baked into the image. Glow is decorative. Target >= 24px; whole-card hit area.
- **Reduced motion:** No lift, no cover scale. Hover/focus shows a static border-color/elevation change and a faint glow set instantly (`instant80`). Cover image holds at `scale(1)`.

## 8. Project filtering (`/projects`)

- **What it is:** Tag/category filters re-flow the project grid; counts update; URL reflects the active filter set.
- **Trigger -> Feedback:** Chip click -> grid items animate to new positions; entering items fade/scale in (`base280`), exiting items fade out (~0.7x), surviving items reflow via shared layout. URL query param updates (shareable, back/forward safe).
- **Library:** Framer Motion `layout` + `AnimatePresence` (`popLayout`) for the reflow; URL state synced via the router (no full reload).
- **Keyboard + a11y:** Filters are a labelled group of toggle buttons/chips with `aria-pressed`; operable by keyboard. Result region is a polite live region announcing the new count ("12 projects"). Focus is preserved on the activated chip. Filtering is **never the only path** to a project (full list reachable; URL is canonical).
- **Reduced motion:** Layout reflow is **instant** — items appear/disappear with `opacity` only, no positional tween. The same URL sync and live-region count announcement apply.

## 9. Blog filtering (`/blog`)

- **What it is:** Topic/tag filtering of the post list, mirroring project filtering semantics.
- **Trigger -> Feedback:** Tag toggle -> list reflow + fade; URL `?tag=` synced; empty state messaged if no matches.
- **Library:** Framer Motion `layout` + `AnimatePresence`; URL-synced router state.
- **Keyboard + a11y:** Toggle group with `aria-pressed`; polite count announcement; empty state is real text with a "clear filters" action. Focus stays on the toggled control. Sort order announced if it changes.
- **Reduced motion:** Instant reflow (opacity-only); URL sync + announcement unchanged.

## 10. Research filtering (`/research`)

- **What it is:** Faceted filtering of research entries (area/year/status), URL-synced, with a Framer layout reflow.
- **Trigger -> Feedback:** Facet change -> grid/list reflows; entering/leaving items fade; `?area=&year=` synced for shareable state.
- **Library:** Framer Motion `layout` reflow + `AnimatePresence`; router URL sync.
- **Keyboard + a11y:** Facets are labelled grouped controls; `aria-pressed`/`aria-checked` as appropriate; results count in a polite live region; keyboard-operable; focus retained on the changed facet.
- **Reduced motion:** Reflow is **instant** (opacity-only), no positional animation; identical URL sync and announcement.

## 11. Gallery lightbox (`/gallery`)

- **What it is:** Click a gallery item to open a full-screen image viewer with prev/next navigation and caption.
- **Trigger -> Feedback:** Thumbnail activate -> image expands via `layoutId` shared element into the lightbox over `moderate420`; backdrop scrim fades. Prev/Next cross-fade/slide images.
- **Library:** Framer Motion (`layoutId` shared element + `AnimatePresence`); Radix Dialog shell for focus management.
- **Keyboard + a11y:** Focus **trapped** in the dialog; **Esc** closes and **returns focus** to the originating thumbnail. **Arrow Left/Right** move prev/next; **Home/End** to first/last. Visible **Prev/Next** controls (2.5.7 — never gesture-only) and a close button, all >= 24px. Current position announced ("Image 3 of 18"). `alt` text per image; caption is real text. Background `inert`.
- **Reduced motion:** No `layoutId` zoom; open/close and image changes are `opacity` cross-fades (`fast160`). All keyboard/trap/return-focus semantics unchanged.

## 12. Certificate detail / modal (`/certificates`)

- **What it is:** Selecting a certificate opens a modal with the full-resolution credential, issuer, date, and verify link.
- **Trigger -> Feedback:** Activate card -> modal enters (`base280`, `out`), backdrop scrim; close via X / backdrop / **Esc** -> exit ~0.7x.
- **Library:** Framer Motion `AnimatePresence` enter/exit; Radix Dialog for semantics.
- **Keyboard + a11y:** Focus trap + `inert` background + **return focus** to the trigger; `role="dialog"`, `aria-modal`, `aria-labelledby` (certificate title). Verify link opens with a clear `aria-label`; external-link indicated non-visually too. Targets >= 24px.
- **Reduced motion:** Opacity-only cross-fade for open/close (`instant80`/`fast160`); no scale/slide. Semantics unchanged.

## 13. Copy-to-clipboard (email, code snippets, share links)

- **What it is:** A copy control duplicates a value to the clipboard and confirms with a toast + a transient inline check icon.
- **Trigger -> Feedback:** Click/Enter -> `navigator.clipboard.writeText` -> **sonner toast** ("Copied to clipboard"), icon swaps to check for ~`slow640` then reverts.
- **Library:** sonner for the toast; Framer Motion for the icon swap.
- **Keyboard + a11y:** Real `<button>` with `aria-label` ("Copy email address"). Sonner toasts render in an `aria-live="polite"` region so the confirmation is announced; toast is dismissible and not the sole feedback (inline icon persists briefly). Failure path announces an error and leaves the value selectable as fallback. Target >= 24px.
- **Reduced motion:** No icon morph animation; icon swaps instantly. Toast appears without slide (fade/instant). Announcement unchanged.

## 14. Contact form validation (`/contact`)

- **What it is:** Inline field validation for the contact form (name, email, message) with helpful messages.
- **Trigger -> Feedback:** Validate **`onTouched`** (first blur, then live on change) -> invalid fields get a message + `aria-invalid`; valid fields clear. Submit blocked until valid.
- **Library:** React Hook Form + Zod (resolver); Framer Motion only for the gentle entry of error text (opacity/height, `fast160`).
- **Keyboard + a11y:** Each error is wired via `aria-describedby` to its input and marked `aria-invalid="true"`; messages are real text, never color-only (icon + text). On submit-with-errors, focus moves to the first invalid field and the error summary is announced. Labels are persistent (not placeholder-only). Targets >= 24px; inputs >= 44px tall.
- **Reduced motion:** Error text appears instantly (no height/opacity tween). All ARIA wiring and focus-management unchanged.

## 15. Contact form success / error (submission result)

- **What it is:** After submit, a persistent inline success panel (or error panel) replaces/augments the form.
- **Trigger -> Feedback:** Successful submit -> inline **persistent** success message ("Thanks — I'll reply soon") + polite announcement; the panel stays (not a transient toast). Failure -> inline error with retry, also announced.
- **Library:** RHF submit lifecycle; Framer Motion for the panel transition (opacity, `base280`); a polite `aria-live` region carries the announcement.
- **Keyboard + a11y:** Result lives in an `aria-live="polite"` region (or `role="status"`); focus moves to the success/error heading so screen-reader and keyboard users land on the outcome. Success is **persistent inline** (WCAG-friendly — not reliant on a toast that may vanish). Error preserves entered values and exposes a focusable Retry. Never color-alone (icon + heading text).
- **Reduced motion:** Panel swaps with opacity/instant only; no slide or scale. Announcement + focus move unchanged.

## 16. GitHub dashboard refresh state (`/github`)

- **What it is:** The live GitHub stats dashboard (TanStack Query) shows fetching/refetching state without blocking interaction.
- **Trigger -> Feedback:** Mount or manual Refresh -> `isFetching` -> container gets `aria-busy="true"`, skeleton/shimmer on cards, Refresh button shows spinner; on settle -> `aria-busy="false"`, content updates, "Updated just now" timestamp.
- **Library:** TanStack Query for fetch/refetch/cache; Framer Motion for skeleton shimmer + number count-up; no GSAP.
- **Keyboard + a11y:** Refresh is a real `<button>` (Enter/Space), disabled+`aria-disabled` while fetching to prevent double-fire. `aria-busy` on the live region communicates loading to AT; a polite status announces "Dashboard updated". Error state is real text with retry, not just a red tint. Count-up numbers also render their final value in the DOM immediately for AT.
- **Reduced motion:** No shimmer sweep, no number count-up — skeletons are static blocks, numbers render final value directly. `aria-busy` and announcements unchanged.

## 17. Command menu (Cmd+K / `cmdk`)

- **What it is:** A command palette exposing all 18 destinations (incl. the 9 secondary), theme actions, and quick actions; the primary fast-travel surface alongside the Explore mega-menu.
- **Trigger -> Feedback:** **Cmd/Ctrl+K** or the **visible trigger button** -> palette opens (scale/opacity `fast160`, `out`); type to filter; results list updates with an announced count.
- **Library:** `cmdk` for the combobox/list semantics + filtering; Framer Motion `AnimatePresence` for open/close; Radix-style dialog behaviours via cmdk's Dialog.
- **Keyboard + a11y:** A **visible trigger** exists (not keyboard-shortcut-only). Input is a `combobox`; the list uses `aria-activedescendant` so **Arrow Up/Down** move the virtual selection without losing input focus; **Enter** activates; **Esc** closes and **returns focus** to the trigger. Result **count is announced** politely ("8 results"). Focus trapped while open; background `inert`. Targets >= 24px.
- **Reduced motion:** Open/close is opacity-only (`instant80`), no scale. All combobox/activedescendant/Esc/return-focus semantics unchanged.

## 18. Keyboard navigation (global)

- **What it is:** The whole site is operable by keyboard alone with logical order and escape hatches.
- **Trigger -> Feedback:** Tab/Shift+Tab traverse interactive elements in **DOM reading order**; a **skip link** ("Skip to content") is the first focusable element and jumps to `#main-content`.
- **Library:** None (platform semantics); Radix/cmdk supply traps only inside overlays. Lenis must not break native keyboard scrolling (see [scroll-strategy](./scroll-strategy.md)).
- **Keyboard + a11y:** **No keyboard traps** outside intentional modals (and those always offer Esc). Visible focus order matches visual order. Page/arrow/space scroll keys keep working (no scroll-jacking). Anchor activation moves **focus**, not just scroll, to the target. Sticky header never obscures the focused element (`scroll-margin-top`). Custom cursor never replaces focus indication.
- **Reduced motion:** Identical — keyboard navigation is unaffected by the motion gate (it is structure, not animation).

## 19. Focus states (the outline token)

- **What it is:** The single, consistent visible focus indicator used site-wide.
- **Trigger -> Feedback:** `:focus-visible` -> a `>= 2px` solid **outline** (azure `#5E8BFF`) with offset, on every interactive element; route changes move focus to `#main-content` with a polite announce.
- **Library:** CSS only (`:focus-visible`, `outline`, `outline-offset`); a small router hook handles post-navigation focus + announcement.
- **Keyboard + a11y:** Implemented as **`outline`** (not box-shadow/border) so it **survives `forced-colors`/Windows High Contrast**. Offset keeps it clear of the element. Focus is **never removed** (`outline:none` only paired with an equal-or-better replacement). On SPA route change, focus -> `#main-content` and a polite live region announces the new page title. Not color-alone (the outline is a shape, plus contrast).
- **Reduced motion:** Focus outline is static by definition; no change. (No focus "pulse" animation is used, so nothing degrades.)

---

## Cross-references

- [animation-strategy](./animation-strategy.md) — token definitions, orchestration, the single-rAF runtime.
- [section-transitions](./section-transitions.md) — page-transition curtain, shared-element (`layoutId`) journeys.
- [scroll-strategy](./scroll-strategy.md) — Lenis, ScrollTrigger, pinning, reduced-motion scroll, no-scroll-jacking rules.
- [accessibility-strategy](./accessibility-strategy.md) — the reduced-motion gate, focus model, live regions, forced-colors.
- [three-strategy](./three-strategy.md) — R3F shared store, static poster fallback.
- [component-inventory](./component-inventory.md) — the components implementing each interaction above.

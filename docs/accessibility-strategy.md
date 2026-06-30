# Accessibility Strategy

> Purpose: the authoritative WCAG 2.2 AA accessibility specification for Joshua Setiawan's portfolio — semantic structure, keyboard and focus behavior, screen-reader support, the single reduced-motion gate, measured color contrast against painted backgrounds, accessible forms/dialogs/navigation, the WCAG 2.2 success-criteria deltas, and the per-feature acceptance checklist plus CI enforcement that proves it.

Related: [Design Tokens](./design-tokens.md) · [Design System](./design-system.md) · [Typography System](./typography-system.md) · [Animation Strategy](./animation-strategy.md) · [Component Inventory](./component-inventory.md) · [Navigation Structure](./navigation-structure.md) · [Information Architecture](./information-architecture.md) · [Page Specifications](./page-specifications.md) · [Responsive Strategy](./responsive-strategy.md) · [Three.js Strategy](./three-strategy.md) · [Wireframes](./wireframes.md) · [Creative Direction](./creative-direction.md)

---

## 0. How to read this document

This is the **source of truth for accessibility behavior**. Where a value is quoted (a contrast ratio, a token, a motion duration) it is a **quotation** of a locked decision in [design-tokens](./design-tokens.md) or the project context — never a new invention. Where engineering judgement is required and not yet fixed by the locked context, the line is prefixed **Assumption:** and is safe to override during build, provided the override is re-verified against the relevant success criterion.

**Conformance target:** WCAG 2.2 **Level AA** across the whole site, with content routes (Landing, About, Philosophy, Blog, Projects, Research, Contact) targeting **Lighthouse Accessibility 100**. The locked budget is **Accessibility ≥ 95** everywhere. Accessibility is **not gated behind animation**: all content is present and operable with JavaScript disabled, with WebGL unavailable, and with motion fully suppressed.

**Three non-negotiable invariants** (repeated across this doc because each one fails silently):

1. **Content is never gated behind motion or WebGL.** The reveal animation's job is to *reveal* already-rendered DOM. The 3D canvas is decorative; its poster is the LCP. See [Animation Strategy](./animation-strategy.md) and [Three.js Strategy](./three-strategy.md).
2. **Exactly one `<h1>` per route**, and it is the hero display type. The visual size of a heading never dictates its level.
3. **Contrast is measured against the *painted* background**, with `--glow` excluded from the measurement (glow is a blur halo, not a fill).

---

## 1. Conformance target & WCAG 2.2 deltas

WCAG 2.2 (W3C Recommendation, Oct 2023) adds **nine** success criteria and **removes** one (4.1.1 Parsing — obsolete; we still validate markup, but it is no longer a conformance line). The five AA/A criteria in scope for this build are specified in full below; the AAA additions are tracked as stretch goals.

| SC | Name | Level | In scope | Where it bites in this project |
|---|---|---|---|---|
| **2.4.11** | Focus Not Obscured (Minimum) | AA | **Yes** | Sticky glass header could cover a focused link/anchor target; in-page jump links. §7 |
| 2.4.12 | Focus Not Obscured (Enhanced) | AAA | Stretch | We aim for *fully* unobscured focus, which satisfies the enhanced bar incidentally. §7 |
| 2.4.13 | Focus Appearance | AAA | Stretch | Our 2px outline + 2px offset already approaches the enhanced area/contrast math. §7 |
| **2.5.7** | Dragging Movements | AA | **Yes** | Any drag UI (gallery/carousel drag, slider, before/after) needs a single-pointer non-drag path. §15 |
| **2.5.8** | Target Size (Minimum) | AA | **Yes** | Icon buttons, theme toggle, command-palette trigger, pagination, tag chips, social icons. §15 |
| **3.2.6** | Consistent Help | A | **Yes** | Contact/help affordance must appear in a consistent relative order across pages. §13 |
| **3.3.7** | Redundant Entry | A | **Yes** | Contact form must not re-ask information already provided in the same flow. §13 |
| 3.3.8 | Accessible Authentication (Min) | AA | N/A | **No auth surface ships in v1.** No login, no CAPTCHA. Recorded as "not applicable, by design." |
| 3.3.9 | Accessible Authentication (Enhanced) | AAA | N/A | Same as above. |

> **4.1.1 Parsing (removed):** we do not claim it, but the CI still asserts well-formed, non-duplicate-`id` markup (§20) because duplicate IDs break label association and ARIA references in practice.

---

## 2. Semantic HTML & document structure

Semantics first; ARIA only to fill gaps native HTML cannot express (§10, "First Rule of ARIA").

| Need | Use | Never |
|---|---|---|
| Action that does something on the current page | `<button type="button">` | `<div onClick>` |
| Navigation to a URL / in-page anchor | `<a href>` (Next.js `<Link>`) | `<button>` styled as a link, or `<div role="link">` |
| Grouped sets of links | `<nav><ul><li><a>` | bare `<a>` soup |
| Page regions | `<header> <nav> <main> <section> <aside> <footer>` | generic `<div>` stacks |
| A self-contained unit (project card, blog post) | `<article>` | `<div class="card">` |
| Captioned media | `<figure><figcaption>` | sibling `<div>` caption |
| Tabular data (GitHub stats, certificate table) | `<table><thead><th scope>…` | CSS-grid faux-table without roles |
| Ordered timeline / steps | `<ol>` | `<ul>` with manual numbers |
| Emphasis vs. boldness | `<em>`/`<strong>` (meaning) | `<i>`/`<b>` for meaning |
| Code | `<pre><code>` (Shiki output) | styled `<div>` |
| Disclosure (FAQ, "read more", TOC collapse) | `<details><summary>` or Radix Accordion with correct ARIA | click-toggled `<div>` |

**Section labeling rule:** every `<section>` that is a landmark-relevant region gets an accessible name via `aria-labelledby` pointing at its heading (e.g. `<section aria-labelledby="featured-projects-h"> <h2 id="featured-projects-h">…`). A bare `<section>` with no name is *not* exposed as a region — that is acceptable for purely visual grouping, intentional for landmark hygiene.

**MDX content** (`projects`, `blog`, `research`, `philosophy` via Velite) renders through the MDX component registry (`src/mdx`), which maps every element to a semantic, styled primitive: headings auto-receive stable `id`s (for TOC + deep links), images route through the alt-text contract (§16), and code blocks render as accessible Shiki output with a copy `<button>` that has a visible/`aria-label` name and a polite "Copied" announcement.

---

## 3. Landmark structure

**One labeled landmark of each type per route.** Duplicate landmarks of the same type must each carry a distinguishing accessible name.

| Landmark | Element | Accessible name | Notes |
|---|---|---|---|
| Banner | `<header>` (site header) | implicit | Exactly one, top-level (not nested in `<main>`). Holds logo + primary nav. |
| Primary navigation | `<nav aria-label="Primary">` | "Primary" | Projects · About · Blog · Contact + theme toggle + Cmd+K trigger. |
| Mega-menu navigation | `<nav aria-label="Explore">` | "Explore" | Philosophy, Research, Open Source, Experience, Timeline, Gallery, Certificates, Achievements, GitHub. See [Navigation Structure](./navigation-structure.md). |
| Main | `<main id="main-content" tabindex="-1">` | implicit | Exactly one. Skip-link + route-change focus target (§4, §7). |
| Complementary | `<aside aria-label="…">` | descriptive | TOC rail, "related posts", project meta sidebar. Optional per route. |
| Search | `<div role="search">` or `<search>` | "Site search" | Hosts the command-palette trigger / inline search where present. |
| Content info | `<footer>` (site footer) | implicit | Full sitemap (§9). One top-level only. |

**Footer-in-article caveat:** a `<footer>` *inside* `<article>` (post metadata) is **not** a `contentinfo` landmark — only the top-level page footer is. This is correct HTML and avoids the "two contentinfo" audit failure.

**Verification:** the landmark map is asserted per route by axe-playwright (`region`, `landmark-one-main`, `landmark-unique`, `landmark-no-duplicate-banner`, `landmark-no-duplicate-contentinfo`) — see §20.

---

## 4. Skip links

**Skip-to-content is the first focusable element on every page** (rendered first in the header, before the logo). It is visually hidden until focused, then it paints as a solid, high-contrast pill above the sticky header (z-index `skip-link` = 110, above everything per [design-tokens](./design-tokens.md) z-index scale).

```
First Tab on any page  →  "Skip to content" pill appears (focus-visible outline)
Enter / Space          →  focus + scroll to #main-content
```

Requirements:

- Target is `<main id="main-content" tabindex="-1">`; activating the skip link moves DOM focus there (not just the scroll position), so the next Tab continues *inside* main.
- The pill uses a **solid** background (`--surface-3`) and `--foreground` text — never a glass/translucent fill — so it remains legible over any underlying content and under `prefers-reduced-transparency`.
- **Assumption:** a second skip link ("Skip to navigation") is added only on routes with a long in-page sub-nav (e.g. Blog index filters); a single "Skip to content" is sufficient elsewhere.
- The skip link must clear the sticky header so the landed target is not obscured (ties to **2.4.11**, §7).

---

## 5. Heading hierarchy

| Rule | Detail |
|---|---|
| One `<h1>` per route | The **hero display type IS the `<h1>`** (e.g. `display-2xl` on Landing). Never a hidden h1 plus a visible div. |
| No skipped levels | h1 → h2 → h3 in DOM order; never h1 → h3 for visual reasons. Visual size is a token (`display-lg`, `h2`, …), decoupled from level. |
| Section headings | Each landmark/section `<h2>` is the `aria-labelledby` target for its region (§2). |
| MDX headings | Velite-rendered article bodies start at `<h2>` (the post title is the page `<h1>`), preventing a second h1. |
| TOC | Built from `<h2>`/`<h3>` ids; the TOC is a labeled `<nav aria-label="On this page">`. |

CI asserts a valid outline via `eslint-plugin-jsx-a11y/heading-has-content` plus an axe `heading-order` check and a build-time outline assertion in the raw-HTML test (§20).

---

## 6. Keyboard navigation

**Everything operable by pointer is operable by keyboard, in a logical order, with no traps.**

### 6.1 Global key model

| Key | Behavior |
|---|---|
| `Tab` / `Shift+Tab` | Move through interactive elements in DOM order (DOM order == visual order; we never reorder with CSS `order`/flex-reverse in a way that desyncs focus). |
| `Enter` | Activate links and buttons; submit the focused form. |
| `Space` | Activate buttons, checkboxes, `summary`; page-scroll only when no widget is focused. |
| `Esc` | Close the topmost overlay (command palette, dialog, sheet, mega-menu), returning focus to the trigger. |
| `⌘K` / `Ctrl+K` | Open the command palette from anywhere (documented in the trigger's `aria-keyshortcuts`). |
| Arrow keys | Move *within* a composite widget (menu, listbox, tabs, command-palette list, carousel) per the relevant ARIA APG pattern — **not** between unrelated controls. |
| `Home` / `End` | First/last item within menus, listboxes, command palette. |

### 6.2 Tab-order discipline

- **DOM order is the focus order.** No positive `tabindex`. The only `tabindex` values used are `0` (make a non-interactive custom widget focusable — rare) and `-1` (programmatic focus target like `#main-content`, or removing a decorative canvas from the tab order).
- Off-screen/closed UI (collapsed mega-menu, closed dialog, mobile drawer when shut) is **`inert` / not in the accessibility tree**, so focus can never land in hidden content.
- Reduced-motion does not change focus order; only visual transition is suppressed.

### 6.3 Composite widgets (APG patterns)

| Widget | Pattern | Keys |
|---|---|---|
| Command palette (`cmdk`) | Combobox + listbox | Type to filter, `↑/↓` to move active option, `Enter` to run, `Esc` to close. `aria-activedescendant` tracks the highlighted row; the input keeps DOM focus. |
| Explore mega-menu | Disclosure → menu (Radix) | `Enter/Space/↓` opens; `↑/↓` move; `Esc` closes to trigger; `Tab` moves out and closes. |
| Tabs (e.g. project case-study, GitHub dashboard views) | Tabs (Radix) | `←/→` move tab, `Home/End`, automatic-vs-manual activation chosen per widget. |
| Carousels / horizontal scrollers (Gallery, project shots, logos) | Listbox-ish + explicit controls | Visible **Prev/Next buttons** (ties to **2.5.7**/2.4.7); `←/→` when the region is focused; no keyboard trap. §15. |
| Accordion / FAQ | Accordion (Radix) or `<details>` | `Enter/Space` toggles; arrow movement between headers (Radix). |
| Theme toggle | Button (or switch) | `Enter/Space`; state in accessible name (§9). |

### 6.4 No keyboard traps

The smooth-scroll layer (Lenis) and GSAP ScrollTrigger **must not** capture or block keyboard scrolling. `Tab`-into-viewport scrolls the focused element into view (the `focus-not-obscured` offset, §7, accounts for the sticky header). Any pinned/horizontal GSAP section remains exitable by keyboard: focusing the next control after the pinned block releases the pin in natural reading order. See [Animation Strategy](./animation-strategy.md).

---

## 7. Focus management

### 7.1 Visible focus — `:focus-visible` via OUTLINE

- Indicator is an **`outline`** (not `box-shadow`), so it survives **forced-colors / Windows High Contrast** mode, where `box-shadow` is dropped.
- Spec: `outline: 2px solid var(--ring); outline-offset: 2px;` minimum. `--ring` (`#5E8BFF` dark / `#3D5BE0` light) measures **≥ 5.3:1** against every dark surface (§12 table), far exceeding the 3:1 non-text minimum and approaching the 2.4.13 enhanced bar.
- `:focus-visible` (not `:focus`) so mouse clicks don't paint rings, but every keyboard and programmatic focus does. Custom widgets that take focus get the same treatment.
- The ring is **never** removed without a visible replacement. `outline: none` is banned by lint.

### 7.2 Focus not obscured by the sticky header (SC 2.4.11)

The glass header is `position: sticky` and can cover a focused element or a jump-link target. Mitigations:

1. **`scroll-margin-top`** on every focusable/anchor target equal to header height + 8px, so programmatic and `:target` scrolling lands the element below the header.
2. **`scroll-padding-top`** on the scroll container (driven through Lenis) matches the header height.
3. On route/anchor navigation, after focusing the target we verify it is at least partially within the viewport *below* the header band; **Assumption:** if a target would be ≥ 50% obscured, nudge scroll by the header height. This satisfies **2.4.11 (Minimum)** and, because we aim for *zero* obscuring, incidentally 2.4.12 (Enhanced).

### 7.3 Route-change focus & announcement (App Router)

Client navigations don't reload the page, so focus and SR context must be managed:

| Step | Behavior |
|---|---|
| On navigation commit | Move focus to `#main-content` (`tabindex="-1"`), so the next `Tab` starts at the top of new content and SR users are repositioned. |
| Announce | A persistent **polite** `aria-live="polite"` route-announcer region (rendered once in the root layout) is updated with the new page's title (e.g. "Projects — Joshua Setiawan, loaded"). |
| Scroll | Reset scroll to top (or to the `#hash` target with the 2.4.11 offset). Lenis is told to jump, not animate, when reduced-motion is active. |
| Title | `document.title` updates via Next metadata; the announcer mirrors it for AT that doesn't read title changes. |

This pairs with the page-transition "curtain" in [Animation Strategy](./animation-strategy.md): the curtain is decorative and `aria-hidden`; content focus/announce happen on commit regardless of the curtain.

### 7.4 Overlay focus (trap + restore)

All overlays (dialog, command palette, mobile nav sheet, mega-menu) follow Radix/`cmdk` semantics:

- Focus **moves into** the overlay on open (to the first focusable, or a sensible initial element — e.g. the palette input).
- Focus is **trapped** while open (Tab cycles within); the rest of the page is `inert`/`aria-hidden`.
- `Esc` and overlay-dismiss **return focus to the triggering element**.
- Scroll lock is applied to the background without layout shift (scrollbar-gutter compensation) to protect CLS (≤ 0.02 budget).

---

## 8. Accessible dialogs & overlays

Built on Radix primitives (focus trap, `inert`, return-to-trigger handled for us) — we own naming, semantics, and the reduced-motion/transparency fallbacks.

| Overlay | Role / API | Naming & description | Dismiss |
|---|---|---|---|
| Command palette (`cmdk`) | `role="dialog"` wrapping a combobox+listbox | `aria-label="Command palette"`; input `aria-label="Search pages and actions"`; results count in a polite live region ("12 results"). | `Esc`, click-outside, route selection → focus returns to ⌘K trigger. |
| Modal dialog (e.g. lightbox, confirm) | Radix `Dialog`, `aria-modal="true"` | `DialogTitle` (required, visible or `sr-only`) + `DialogDescription`. | `Esc`, close button (`aria-label="Close"`, ≥24px target), overlay click. |
| Mobile nav sheet | Radix `Dialog`/`Sheet` | `aria-label="Site navigation"`. | `Esc`, close button, link selection. |
| Mega-menu | Radix disclosure/menu (non-modal) | `aria-label` on trigger + `aria-expanded`. | `Esc`, blur, selection. |
| Toasts (`sonner`) | `role="status"` region, polite | Toast text is the announcement; never the sole channel for critical info. | Auto-dismiss is pausable on hover/focus; manual close button has a name. Errors that block a task are *also* surfaced inline (§14), not toast-only. |

**Glass overlays** use `backdrop-blur(12px)` with a **solid fallback** under `prefers-reduced-transparency` (and a contrast-safe scrim) so text-on-glass always meets §12 contrast against the *painted* result.

---

## 9. Accessible navigation

See [Navigation Structure](./navigation-structure.md) and [Information Architecture](./information-architecture.md) for the model; accessibility specifics:

- **Current page**: the active destination carries `aria-current="page"` (primary nav, footer sitemap, mega-menu, pagination). Current state is **never** signaled by color alone — it also carries a non-color cue (weight/underline/indicator) per §12.
- **Wordmark/monogram logo**: the "Joshua Setiawan" → "JS" collapse is a **visual** change only; the link's accessible name stays stable ("Joshua Setiawan — home"). The monogram does not become an unlabeled "JS".
- **Mega-menu trigger**: `aria-expanded`, `aria-controls`, `aria-haspopup="menu"`; grouped items use `<ul>` with group headings exposed via `aria-label`/`role="group"`.
- **Command palette trigger**: a real `<button>` with accessible name "Open command palette" and `aria-keyshortcuts="Meta+K Control+K"`; visible "⌘K" hint is decorative (`aria-hidden`).
- **Theme toggle**: accessible name reflects action+state, e.g. "Switch to light theme" / `aria-pressed` if implemented as a toggle; the icon is decorative.
- **Footer sitemap**: full link list in `<nav aria-label="Footer">` with grouped `<h2>`/`<ul>` sections — the keyboard/SR route to the 9 secondary destinations even if JS (mega-menu/palette) fails.
- **Consistent Help (SC 3.2.6)**: the contact path (Contact nav item + footer contact block) appears in the **same relative order** on every page, so help is found in a predictable place.

---

## 10. Screen-reader support & ARIA usage

### 10.1 The rules we hold

1. **No ARIA is better than bad ARIA.** Prefer native elements (§2).
2. **Don't change native semantics.** No `role="button"` on an `<a>`, etc.
3. **All interactive ARIA widgets are keyboard-operable** (§6.3).
4. **Don't hide focusable content** with `aria-hidden="true"` (and never put `aria-hidden` on the `<main>` while it's active).
5. **Every interactive element has an accessible name** (visible label, `aria-label`, or `aria-labelledby`).

### 10.2 Naming & description patterns

| Case | Technique |
|---|---|
| Icon-only button | `aria-label` (e.g. "Copy code", "Open menu"); icon `aria-hidden`. |
| Visible label | Native `<label for>` (forms) or text content (buttons/links). |
| Compound name | `aria-labelledby` referencing visible text nodes. |
| Helper/error text | `aria-describedby` referencing the description and/or error node. |
| Decorative icon/SVG | `aria-hidden="true"` + `focusable="false"`. |
| Standalone meaningful SVG | `role="img"` + `aria-label`, or `<title>` inside the SVG. |
| Stats/metrics | Pair value + label in the DOM (e.g. `<dt>`/`<dd>`); avoid value-only nodes that read as bare numbers. |

### 10.3 Live regions

| Region | Politeness | Used for |
|---|---|---|
| Route announcer | `polite` | Page-loaded announcement on client nav (§7.3). One instance, root layout. |
| Form status | `polite` | "3 errors found", inline success ("Message sent"). §13–14. |
| Toaster (`sonner`) | `status`/polite | Non-critical confirmations. §8. |
| Palette results | `polite` | "N results" as the user types. |
| Async/data refresh (GitHub dashboard React Query refetch) | `polite` | "Updating…/Updated" so SR users know live data changed; never `assertive`. |

`assertive`/`alert` is reserved for genuine, immediate, user-blocking errors (e.g. submit failed) — used sparingly to avoid clobbering.

---

## 11. Reduced motion — the single gate + Pause control

Motion accessibility is governed by **one gate** feeding **one source of truth**. See [Animation Strategy](./animation-strategy.md) §reduced-motion and [Three.js Strategy](./three-strategy.md).

### 11.1 The single gate

```
prefers-reduced-motion: reduce   ┐
in-app "Reduce motion" toggle     ├─→  Zustand motion slice  →  <html data-motion="reduced|full">
navigator.connection.saveData     ┘
```

- **Any** of the three inputs being truthy resolves to `data-motion="reduced"`.
- Everything downstream reads `data-motion` (or the Zustand selector) — there is **no** second, divergent motion check anywhere in the code.
- The OS preference is honored on first paint (no flash of motion): the resolver runs before hydration via an inline `<head>` script setting `data-motion`, mirroring the theme no-flash pattern.

### 11.2 What "reduced" does per engine

| Engine | Full | Reduced |
|---|---|---|
| **Framer Motion** | `m.*` with variants/springs | `MotionConfig reducedMotion="user"`: transforms/opacity collapse to instant; **content still mounts**. |
| **GSAP + ScrollTrigger** | timelines, pin, scrub | Inside `gsap.matchMedia()`: reduced branch = **static**, no pin, no scrub, no parallax. Final/end-state styles applied immediately. |
| **Lenis** | smooth scroll | **Not instantiated** — native scroll. ScrollTrigger updates off native scroll. |
| **R3F / Three** | animated "Signal Field" + accent shaders | **Static poster** image (the poster is the LCP); canvas not mounted (or `frameloop="never"` on a single frame). |
| **Auto-playing media/loops** | allowed | Paused; no looping > 5s without a control. |

### 11.3 The explicit Pause control (SC 2.2.2)

WCAG 2.2.2 requires that **any motion that starts automatically, lasts > 5s, and runs in parallel with other content** can be paused/stopped/hidden by the user. The ambient hero field and any looping animation qualify.

- A persistent, keyboard-reachable **"Pause motion"** control lives in the UI (in the footer utility cluster and surfaced in the command palette and settings). Activating it flips the in-app toggle → `data-motion="reduced"` site-wide.
- The control is a real `<button>` with state in its accessible name ("Pause motion" / "Resume motion") and `aria-pressed`.
- Reduced-motion is **remembered** (persisted Zustand slice) across navigations and visits.
- Reduced motion **changes only motion**, never available content, copy, or operability.

---

## 12. Color contrast

**Measured against the painted background, with `--glow` excluded.** Glow is a soft blur halo and is not counted as a fill; ratios are computed against the actual surface a pixel of text sits on. All values below are computed from the **locked dark tokens** ([design-tokens](./design-tokens.md)) using the WCAG relative-luminance / contrast formula. Thresholds: **4.5:1** normal text, **3:1** large text (≥ 24px, or ≥ 18.66px bold) and non-text UI/state indicators (SC 1.4.3 / 1.4.11).

### 12.1 Text on surfaces (dark theme, computed)

| Foreground | `#05070D` bg | `#0A0D16` surface-1 | `#10131F` surface-2 | `#171B2A` surface-3 | Verdict |
|---|---|---|---|---|---|
| `--foreground` `#EAEDF5` | **17.2:1** | 16.6:1 | 15.8:1 | 14.6:1 | Pass AAA — body/headings |
| `--foreground-muted` `#A4ABBD` | **8.8:1** | 8.4:1 | 8.0:1 | 7.4:1 | Pass AA normal everywhere — secondary text |
| `--foreground-subtle` `#687085` | **4.1:1** | 3.9:1 | 3.7:1 | 3.4:1 | **Large-text / non-essential only** — fails 4.5:1 for normal body |
| `--primary` `#5E8BFF` (as text/link) | **6.3:1** | 6.1:1 | 5.8:1 | 5.4:1 | Pass AA normal — links/accents |
| `--accent` `#38E8C8` (as text) | **13.0:1** | — | — | 11.5:1 | Pass — sparing accent text/labels |
| `--destructive` `#FF6B6B` (error text) | **7.3:1** | — | 6.7:1 | — | Pass AA — error messages |
| `--success` `#3DD68C` | **10.7:1** | — | — | — | Pass |
| `--warning` `#F5B544` | **11.1:1** | — | — | — | Pass |
| `--info` `#38BDF8` | **9.4:1** | — | — | — | Pass |

> **Load-bearing rule — `--foreground-subtle` (`#687085`):** at ~**4.1:1** on `#05070D` and **below 4.5:1** on every elevated surface, it is **forbidden for normal-size body copy.** It is permitted only for: large text (≥ 24px / ≥ 18.66px bold), disabled-state text (exempt from 1.4.3), and genuinely decorative/non-essential glyphs. Eyebrows (`0.75rem` mono) and captions (`0.8125rem`) must use `--foreground-muted` or `--foreground`, **not** `--foreground-subtle`.

### 12.2 Component-state & non-text contrast

| Element | Colors | Ratio | SC 1.4.11 (≥3:1) |
|---|---|---|---|
| Focus ring | `--ring #5E8BFF` vs `#10131F` | **5.8:1** | Pass (vs all surfaces ≥ 5.3:1) |
| Primary button | bg `#5E8BFF` / text `#05070D` | **6.3:1** | Text passes; fill vs page ≥ 3:1 |
| Accent button | bg `#38E8C8` / text `#04130F` | **12.3:1** | Pass |
| Decorative border | `--border #222838` vs surface-2 | **~1.3:1** | **Fails 3:1 — decorative only** |
| Strong border | `--border-strong #2E3548` vs bg | **~1.7:1** | Below 3:1 — see rule below |

> **Load-bearing rule — borders are not the sole boundary signal.** `--border` (~1.3:1) and even `--border-strong` (~1.7:1) do **not** reach the 3:1 non-text threshold, by design (they are quiet hairlines). Therefore, where a control's **boundary or state must be perceivable** (form inputs, the active/selected state of a control), we do **not** rely on the border token alone. Inputs get boundary perception from a **fill delta** (field `--surface-2`/`--surface-3` differing from the page) **plus** a persistent visible `<label>`; **focus and active states are carried by the `--ring` (≥5.3:1)**, and selected/current states add a non-color cue (weight, underline, indicator dot). Under forced-colors, the OS supplies real borders (§12.4).

### 12.3 Never color alone (SC 1.4.1)

Every state that color conveys also has a second channel:

| State | Color | Plus non-color cue |
|---|---|---|
| Link in prose | `--primary` | underline (or underline-on-hover with a persistent affordance) |
| Current nav item | `--primary`/weight | `aria-current="page"` + underline/indicator |
| Form error | `--destructive` | `aria-invalid`, error icon, error text, summary |
| Form success | `--success` | check icon + "Message sent" text |
| Project status (live/archived/wip) | chip color | text label inside the chip |
| GitHub chart series | `chart-1…6` | direct labels / legend with text, patterns where overlapping |
| Contribution heat ramp | `#10131F→#8FC2FF` | numeric value in cell `title`/`aria-label` (e.g. "7 contributions on Jun 3") |

### 12.4 Forced-colors / Windows High Contrast

- Use `forced-colors: active` adjustments and **system color keywords** (`CanvasText`, `Canvas`, `LinkText`, `ButtonText`, `Highlight`) for any custom-painted control.
- The **outline-based** focus ring (§7.1) survives forced-colors automatically (box-shadow would not).
- Decorative gradients/glows are allowed to flatten; **information is never lost** because every state has a non-color cue (§12.3).
- Glass surfaces fall back to solid system fills; the 3D canvas is `aria-hidden` and its loss is immaterial.

### 12.5 Enforcement

A **contrast-token script** (§20) reads the locked token pairs and recomputes every ratio in this section at build time, failing CI if any *approved* pairing drops below its threshold — so a future token tweak can't silently regress contrast. axe-playwright additionally checks rendered pixels in **light, dark, reduced-motion, and forced-colors**.

---

## 13. Form accessibility (Contact)

The Contact form is the primary interactive surface (Server Action + one shared Zod schema; `react-hook-form`; PII → `/privacy`). Full field semantics:

| Requirement | Implementation |
|---|---|
| Labels | Every control has a **visible** `<label for>` (no placeholder-as-label). Required fields marked in the label text + `aria-required`/`required`. |
| Autocomplete | `autocomplete="name" \| "email" \| "organization" \| "off"` on the relevant fields (SC 1.3.5). |
| Grouping | Related controls in `<fieldset><legend>` where applicable (e.g. inquiry type radios). |
| Programmatic state | `aria-invalid="true"` on errored fields; `aria-describedby` links each field to its error and/or helper text. |
| Error summary | On failed submit, a focus-managed **error summary** (`role="alert"` or focused heading) lists each error as an in-page link to the offending field. Focus moves to the summary. |
| Live region | A `polite` status region announces "N errors found" and, on success, "Message sent — I'll reply to {email}". |
| Persistent inline success | Success is shown **inline and persistent** (not toast-only), so it isn't missed if the toast is gone. |
| Submit feedback | Submit button shows a busy state with an accessible name change / `aria-disabled`; never a spinner-only with no text. |
| Validation timing | Validate on submit (and on blur after first submit) — not aggressively on every keystroke, which is noisy for SR/AT. |
| Server + client parity | The **same Zod schema** validates client and server; the Server Action returns field-keyed errors mapped back into the same `aria-describedby` nodes, so JS-off submission still yields accessible, server-rendered errors. |

### 13.1 SC 3.3.7 Redundant Entry

Within the contact flow, **do not re-ask** information already entered. If the form has any multi-step or confirm step, previously entered values are **pre-filled or selectable**, not retyped. **Assumption:** v1 contact is a single step, so this is satisfied trivially; the rule is recorded so any future "confirm details" step stays compliant.

### 13.2 SC 3.2.6 Consistent Help

The route to contact/help (Contact nav item + footer contact block, and the "email" affordance) sits in a **consistent relative location** across all pages (§9). The Contact page itself also states the direct email as a non-form fallback.

### 13.3 SC 3.3.8 — not applicable

No authentication, login, or CAPTCHA ships in v1. Spam mitigation uses non-cognitive means (honeypot + server-side rate limiting / Resend), **not** a puzzle the user must solve — keeping us clear of 3.3.8 even though no auth exists.

---

## 14. Error messages

| Principle | Detail |
|---|---|
| Identify the field | Error text is adjacent to the control and linked via `aria-describedby`; `aria-invalid` set. |
| Describe the fix | Human, specific copy: "Enter a valid email address (e.g. name@example.com)", not "Invalid input". |
| Don't rely on color | Error text + icon + `aria-invalid` (§12.3), not red border alone. |
| Summarize & route | Submit-time error summary with jump links; focus moves to it (§13). |
| Announce | `polite` (form-level count) escalating to `assertive`/`alert` only for a hard submit failure ("Couldn't send — try again"). |
| Preserve input | Errored submit never clears valid fields (ties to 3.3.7). |
| Timing | Errors persist until resolved; success persists inline until navigation. |

---

## 15. Touch-target sizes & dragging

### 15.1 Target Size Minimum (SC 2.5.8 — ≥ 24×24 CSS px)

Every pointer target is **≥ 24×24 CSS px**, or has a ≥ 24px-diameter clear spacing circle. We adopt **≥ 44×44 px** as the *house* minimum on touch (exceeds the AA bar; matches the responsive comfort target in [Responsive Strategy](./responsive-strategy.md)), reserving the bare 24px floor only for inline/dense desktop cases.

| Control | Min size approach |
|---|---|
| Icon buttons (theme toggle, ⌘K trigger, menu, close, copy-code, social) | 44×44 hit area (icon may be smaller, padding makes the target). |
| Pagination / next-prev | ≥ 44×44; never 16px chevrons. |
| Tag/category chips | ≥ 24px height with adequate spacing; tappable area padded. |
| Inline prose links | Exempt as inline text, but block link lists get ≥ 24px row height. |
| Carousel Prev/Next | ≥ 44×44, always visible (also 2.5.7/2.4.7). |

Enforced by an axe `target-size` check (§20) plus design-token spacing rules.

### 15.2 Dragging Movements (SC 2.5.7)

Any feature that uses a **drag** gesture must offer a **single-pointer, non-drag alternative**:

| Drag feature | Non-drag path |
|---|---|
| Gallery / project carousel drag-to-scroll | Visible **Prev/Next buttons** + keyboard arrows + scroll snap; dragging is an enhancement only. |
| Any slider (e.g. a before/after or value slider) | Click-on-track to set + arrow-key increments; not drag-only. |
| Pinned/horizontal GSAP sections | Driven by normal vertical scroll/keyboard; no required horizontal *drag*. Under reduced-motion they become static and fully readable (§11). |

> **Assumption:** v1 ships no essential drag-only interaction; all "draggable" UI is a progressive enhancement over a button/scroll baseline, so 2.5.7 holds by construction.

---

## 16. Alt-text strategy

Alt text is **content-typed**, enforced at the data layer so nothing ships unlabeled. `eslint-plugin-jsx-a11y/alt-text` blocks raw `<img>`/`next/image` without `alt`.

| Source | Rule |
|---|---|
| **Project covers / gallery** (Velite `Image`, typed gallery `alt` field) | `alt` is a **required** field in the content schema — build fails if missing. Describe subject + purpose ("Dashboard home of Acme analytics, dark theme"), not "image of…". |
| **Decorative** images/dividers/glyphs | `alt=""` (empty, not absent) + `aria-hidden` where it's pure decoration, so SR skips them. |
| **Certificates** | `alt` = "{name} certificate issued by {issuer}, {date}"; the credential link/text carries the actionable info, image is supportive. |
| **Blog/research covers** | `alt` describes the cover meaningfully; if purely aesthetic and the title is adjacent, may be decorative (`alt=""`). |
| **Logos** (tech, clients) | `alt` = brand name; in a "tech used" list, the list semantics + name suffice. |
| **Charts / GitHub viz** | The `<svg>`/canvas is `aria-hidden`; the **data** is exposed as an adjacent accessible table or labeled values (§12.3), which is the real alternative. |
| **MDX inline images** | Markdown `![alt](src)` — authors **must** write alt; the MDX image component warns in dev and CI flags empty alt on non-decorative images. |
| **Avatars / portrait** | `alt` = "Joshua Setiawan" (person), not "avatar". |
| **OG / social images** (build-time) | Carry embedded text alternatives in metadata where the platform supports it; not part of the page a11y tree. |
| **3D canvas & its poster** | Canvas `aria-hidden`, `tabindex="-1"`. The static poster that replaces it (reduced-motion/no-WebGL) is **decorative** (`alt=""`) because it conveys mood, not information — and it is the LCP element (§17). |

**Captions** (`<figcaption>`) complement, never duplicate, alt text. Functional images inside links/buttons take their alt from the action ("View Acme case study").

---

## 17. Canvas, 3D & ambient-motion accessibility

From [Three.js Strategy](./three-strategy.md), restated as a11y obligations:

- The single persistent `<Canvas>` is **decorative**: `aria-hidden="true"`, `tabindex="-1"`, never focusable, never an `<h1>` neighbor that hides content.
- **Device-tier / no-WebGL / reduced-motion → static poster**, and that **poster is the LCP element** — so the largest paint is a normal `<img>` that is fast, contrast-safe behind any overlaid text, and `alt=""`.
- The canvas **pauses** off-screen (IntersectionObserver) and on `data-motion="reduced"`; it never blocks scroll, focus, or input.
- Text rendered **over** the canvas/poster is measured for contrast against the **darkest painted region** it can overlap (a scrim guarantees the §12 ratio); glow is excluded from that measurement.
- No essential information lives only inside WebGL.

---

## 18. Language & internationalization

- `<html lang="en">` set in the root layout (English only for v1; hreflang-ready per SEO doc).
- Any inline foreign-language term gets `lang` on its wrapper.
- Direction is LTR; logical CSS properties (`margin-inline`, `padding-block`) are used so RTL is a future flip, not a rewrite.
- Page `lang`/title are kept in sync with the route announcer (§7.3).

---

## 19. Per-feature acceptance checklist

Each feature is "done" only when **all** its boxes pass in **light + dark + reduced-motion + forced-colors**.

### 19.1 Global (every route)

- [ ] Exactly one `<h1>` (the hero display type); valid heading outline, no skipped levels.
- [ ] One labeled landmark of each type; `landmark-*` axe rules pass.
- [ ] Skip-to-content is the first focusable; lands focus in `#main-content`.
- [ ] Visible `:focus-visible` outline (2px + 2px offset, `--ring`) on every focusable; survives forced-colors.
- [ ] Tab order == visual order; no positive `tabindex`; no keyboard trap (incl. Lenis/GSAP).
- [ ] Route change moves focus to `#main-content` and announces the new page (polite).
- [ ] All text meets §12 ratios vs the painted background; `--foreground-subtle` not used for normal body.
- [ ] No information by color alone.
- [ ] `prefers-reduced-motion` honored on first paint; Pause-motion control reachable.
- [ ] jest-axe + axe-playwright: zero violations.

### 19.2 Header / primary nav / mega-menu

- [ ] `nav` landmarks labeled "Primary" / "Explore"; `aria-current="page"` on active item (+ non-color cue).
- [ ] Mega-menu: `aria-expanded`/`aria-controls`/`aria-haspopup`; arrow-key APG behavior; `Esc` returns to trigger.
- [ ] Logo accessible name stable across wordmark→monogram collapse.
- [ ] Sticky header never obscures focused targets (2.4.11): `scroll-margin/padding-top` applied.

### 19.3 Command palette (⌘K)

- [ ] Trigger is a `<button>` named "Open command palette" with `aria-keyshortcuts`.
- [ ] Combobox+listbox semantics; `aria-activedescendant`; result count announced (polite).
- [ ] Full keyboard operation; `Esc`/selection returns focus to trigger.

### 19.4 Footer

- [ ] `contentinfo` is the only top-level footer; full sitemap in `nav aria-label="Footer"`.
- [ ] Pause-motion + contact affordances present (3.2.6 consistent order).

### 19.5 Contact form

- [ ] Visible labels; autocomplete tokens; `required`/`aria-required`.
- [ ] `aria-invalid` + `aria-describedby` on errored fields; error summary focused on submit.
- [ ] Polite "N errors" / persistent inline success; valid fields preserved on error (3.3.7).
- [ ] Works JS-off via Server Action with server-rendered, accessible errors (same Zod schema).
- [ ] No CAPTCHA / cognitive test (3.3.8 N/A by design).

### 19.6 Carousels / gallery / horizontal sections

- [ ] Visible Prev/Next (2.4.7) + keyboard arrows; non-drag path (2.5.7).
- [ ] Reduced-motion → static, fully readable; no pin/scrub trap.
- [ ] Each item's image has compliant alt (§16).

### 19.7 Projects / Blog / Research detail

- [ ] Article `<article>` + `<h1>` title; MDX body starts at `<h2>`; TOC is labeled `nav`.
- [ ] Code blocks: accessible copy button + polite "Copied"; Shiki output meets contrast.
- [ ] Cover/gallery alt present; JSON-LD present but not a11y-relied-upon.

### 19.8 GitHub dashboard

- [ ] Charts `aria-hidden`; data also in an accessible table / labeled values.
- [ ] Contribution heatmap cells expose count text (not color alone).
- [ ] React Query refetch announces "Updating/Updated" (polite); first paint is SSR/ISR (no empty-canvas trap).

### 19.9 3D / canvas (any route using it)

- [ ] Canvas `aria-hidden` + `tabindex="-1"`; never focusable.
- [ ] Static poster path verified (no-WebGL, reduced-motion, low-tier) and poster is LCP, `alt=""`.
- [ ] Overlaid text contrast verified against darkest overlap (glow excluded).

---

## 20. Tooling & CI enforcement

Accessibility is **gated in CI** — a PR cannot merge with a regression.

| Layer | Tool | Enforces |
|---|---|---|
| Lint (authoring) | **ESLint flat + `eslint-plugin-jsx-a11y`** (with `next/core-web-vitals`) | alt-text, label association, no `tabindex` > 0, valid ARIA, no `outline:none`, anchor-is-valid, role/interaction rules. Blocks commit via Husky + lint-staged. |
| Unit / component | **jest-axe** | Per-component axe assertions (rendered states: default, hover, error, open). Zero violations. |
| E2E / integration | **axe-playwright** | Full-page scans on every route in the **light / dark / reduced-motion / forced-colors** matrix; landmark/heading/contrast/target-size rules. |
| Lighthouse | **Lighthouse CI** (throttled mobile) | Accessibility **≥ 95** (target **100** on content routes); fails the build below budget. Runs alongside the CWV/perf budget. |
| Contrast tokens | **Custom `contrast-token` script** | Recomputes every approved token pairing in §12 from [design-tokens](./design-tokens.md); fails CI if any drops below its threshold. Prevents silent token regressions. |
| Markup integrity | **Raw-HTML assertion** (SSR output) | One `<h1>`, one `<main>`, unique `id`s, landmark uniqueness, valid outline — catches what runtime axe might miss on RSC/SSG output. |
| Manual SR matrix | **Documented checklist** | NVDA + Firefox, VoiceOver + Safari (macOS/iOS), TalkBack + Chrome (Android), Windows High Contrast — run before release on the key flows below. |

### 20.1 Manual screen-reader / AT support matrix

| Combo | Must verify |
|---|---|
| **NVDA + Firefox** (Windows) | Landmarks, headings, forms mode on contact, live announcements, command palette. |
| **VoiceOver + Safari** (macOS) | Rotor landmarks/headings/links, route-change announcement, dialog focus return. |
| **VoiceOver + Safari** (iOS) | Touch exploration, target sizes, carousel Prev/Next, swipe nav, no canvas trap. |
| **TalkBack + Chrome** (Android) | Reading order, form errors, toggle states. |
| **Windows High Contrast / forced-colors** | Focus ring visible, borders/states present, no lost info, glass→solid. |
| **Keyboard-only (all platforms)** | Skip link, full nav, palette, form, overlays, no trap, visible focus throughout. |

### 20.2 Definition of Done (accessibility)

A route/feature ships only when: jsx-a11y clean · jest-axe clean · axe-playwright clean across the 4-mode matrix · Lighthouse a11y ≥ budget · contrast-token script green · its §19 checklist fully ticked · and at least one manual pass from §20.1 on the primary flow. Accessibility regressions are treated as **build-breaking**, equal in weight to the performance budget in the project context.

---

### Cross-references

[Design Tokens](./design-tokens.md) (contrast/ring/border values) · [Design System](./design-system.md) (state/variant rules) · [Typography System](./typography-system.md) (scale & measure) · [Animation Strategy](./animation-strategy.md) (reduced-motion gate, page-transition curtain) · [Three.js Strategy](./three-strategy.md) (decorative canvas, poster-as-LCP) · [Component Inventory](./component-inventory.md) (per-component a11y props) · [Navigation Structure](./navigation-structure.md) · [Information Architecture](./information-architecture.md) · [Page Specifications](./page-specifications.md) · [Responsive Strategy](./responsive-strategy.md) (target sizes) · [Wireframes](./wireframes.md).

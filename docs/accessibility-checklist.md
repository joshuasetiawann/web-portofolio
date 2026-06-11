# Accessibility Checklist (WCAG 2.2 AA)

Production/as-built accessibility reference for the Joshua Setiawan portfolio. Target
conformance: **WCAG 2.2 Level AA**. Each item lists what is implemented and how to verify.
Status legend:

- **Done** — implemented and shipping.
- **Verify** — implemented; confirm with manual/AT testing.
- **Action** — content- or test-dependent step still owed.

---

## 1. Keyboard operability (2.1.1, 2.1.2)

| Item | Status | Detail |
| --- | --- | --- |
| All interactive elements reachable | Verify | Native `<a>`/`<button>` + Radix primitives are keyboard-operable by default. Walk the full tab order on each page. |
| No keyboard traps | Verify | Radix Dialog/Sheet/DropdownMenu manage focus and `Esc` to close; confirm no custom trap. |
| Honeypot excluded from tab order | Done | Hidden contact "company" field is `tabIndex={-1}` + `aria-hidden` (`src/components/forms/contact-form.tsx`). |
| Logical focus order | Verify | DOM order matches visual order (skip link → header → main → footer). |

**Verify:** Tab/Shift+Tab through each page; operate menus, theme toggle, mobile sheet, and
the contact form using keyboard only.

## 2. Focus visibility (2.4.7, 2.4.11/2.4.13)

| Item | Status | Detail |
| --- | --- | --- |
| Global focus-visible ring | Done | `:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px }` (`src/styles/globals.css`). Outline-based so it survives forced-colors. |
| Component focus states | Done | Buttons use `focus-visible:ring-[3px] focus-visible:ring-ring/50` (`ui/button.tsx`); links/TOC use `focus-visible:ring-2`. |
| Focus not obscured | Verify | The header is sticky/scroll-aware; confirm focused elements near the top aren't hidden behind it (WCAG 2.2 SC 2.4.11). |

**Verify:** Keyboard-focus every control in both themes; confirm a visible, sufficiently
contrasting indicator that isn't clipped by the sticky header.

## 3. Skip link & bypass blocks (2.4.1)

| Item | Status | Detail |
| --- | --- | --- |
| Skip-to-content link | Done | First focusable element; `sr-only` until focused, then `focus:not-sr-only fixed top-4 left-4 z-[100]` (`src/components/layout/page-shell.tsx`). |
| Target exists & is focusable | Done | `<main id="main-content" tabIndex={-1}>` receives focus on activation. |

**Verify:** Load any page, press Tab once — the "Skip to main content" link must appear and
move focus into `<main>` on Enter.

## 4. Landmarks & regions (1.3.1)

| Item | Status | Detail |
| --- | --- | --- |
| Header / main / footer | Done | `<header>`, `<main>`, `<footer>` in `page-shell.tsx`. |
| Labeled navigation | Done | `<nav aria-label="Primary">` (header), `aria-label="Mobile"` (mobile menu), per-section `aria-label` in footer. |
| One main per page | Done | Single `<main>` from the shared shell. |

**Verify:** Screen-reader landmark rotor (VoiceOver `VO+U`, NVDA `D`) lists header/main/footer
and uniquely named navs.

## 5. Headings (1.3.1, 2.4.6)

| Item | Status | Detail |
| --- | --- | --- |
| Descriptive page H1 | Verify | Hero components render the H1; section headers use H2. |
| No skipped levels | Verify | Confirm content pages don't jump H2→H4. |

**Verify:** [HeadingsMap] extension or the a11y tree; Lighthouse heading-order check.

## 6. Forms (1.3.1, 3.3.1, 3.3.2, 3.3.3, 4.1.3)

| Item | Status | Detail |
| --- | --- | --- |
| Programmatic label↔control | Done | `FormField` wires `htmlFor`/`id` via `useId` (`src/components/forms/form-field.tsx`). |
| `aria-required` on required fields | Done | Set by `FormField`; visual `*` is `aria-hidden`. |
| `aria-invalid` + `aria-describedby` | Done | Error/description IDs joined and passed to the control; `aria-invalid` toggles on error. |
| Inline error identification | Done | `FormMessage` renders field errors referenced by `aria-describedby`. |
| Live submission status | Done | `aria-live="polite" role="status"` region announces success/error (`contact-form.tsx`). |
| `aria-busy` during submit | Done | `<form aria-busy={isPending}>`; submit button disabled + spinner labeled. |
| Autocomplete / input types | Done | `autoComplete="name"/"email"`, `type="email"`, `inputMode="email"`. |
| Error prevention / recovery | Done | Client (zod via `react-hook-form`, `onTouched`) + server (`submitContact`) validation; server `fieldErrors` mapped back onto fields. |

**Verify:** Submit empty/invalid → errors announced and associated; submit valid → success
announced via live region. Test with a screen reader.

## 7. Dialogs, menus, disclosures (4.1.2, 2.1.2)

| Item | Status | Detail |
| --- | --- | --- |
| Accessible primitives | Done | shadcn/ui on unified `radix-ui` (Dialog, Sheet, DropdownMenu, Tooltip, etc.) — focus management, roles, `Esc`, `aria-expanded` built in. |
| Mobile sheet labeling | Done | `SheetDescription` `sr-only`, labeled `nav`, trigger has `aria-label="Open menu"` (`mobile-menu.tsx`). |
| Current page indication | Done | `aria-current="page"` on active nav links (header + mobile). |
| Decorative icons hidden | Done | Icons consistently `aria-hidden="true"`; icon-only controls carry `aria-label` (e.g. theme toggle). |
| Tooltip provider | Done | `TooltipProvider` in `app-providers.tsx`. |

**Verify:** Open the mobile menu and any dropdown/tooltip with the keyboard; confirm focus
moves in, `Esc` closes and restores focus, and SR announces role + state.

## 8. Color contrast (1.4.3, 1.4.11)

| Item | Status | Detail |
| --- | --- | --- |
| Light-theme text contrast (Phase 5 fix) | Done | Tokens hardened in `src/styles/tokens.css`: `--accent-2` darkened to `#0a7c66` ("brand teal/pine") explicitly for AA text contrast; muted/subtle foregrounds `#4a5160`/`#5c6473`; `--success #15803d`, `--warning #b7791f`. |
| Dark theme (default) | Done | High-contrast foreground `#eaedf5` on `#05070d` backgrounds; muted `#a4abbd`. |
| Non-text / UI contrast | Verify | Borders/inputs (`--input #b9c0cf` light / `#3a4358` dark), focus ring, icons — confirm ≥3:1 against adjacent colors. |
| Don't rely on color alone (1.4.1) | Verify | Status messages pair color with icon + text; confirm links are distinguishable. |

**Verify:** axe DevTools / Lighthouse contrast audit in **both** themes; spot-check teal
text and muted/subtle text with a contrast checker (target 4.5:1 body, 3:1 large/UI).

## 9. Target size (2.5.8 — WCAG 2.2 AA)

| Item | Status | Detail |
| --- | --- | --- |
| Primary controls ≥24×24 CSS px | Verify | Button sizes: default `h-9`, `lg` `h-10`, `icon` `size-9`, `icon-sm` `size-8` (≥32px) — comfortably ≥24px. Note `xs`/`icon-xs` are `h-6`/`size-6` (24px, at the SC minimum). |
| Spacing exception | Verify | Inline/dense controls (tags, small icon buttons) rely on the SC 2.5.8 spacing exception; confirm adequate gaps. |

**Verify:** Inspect computed sizes of interactive targets, especially `xs`/`icon-xs` usages,
and ensure none fall below 24×24 without sufficient spacing.

## 10. Reduced motion (2.3.3) & motion safety

| Item | Status | Detail |
| --- | --- | --- |
| OS preference honored | Done | `MotionConfig reducedMotion="user"` + `LazyMotion`/`domAnimation` (`motion-provider.tsx`). |
| In-app motion toggle | Done | `useReducedMotion` = OS pref (via `useSyncExternalStore`) overridable by the Zustand UI store (`reduced`/`full`/`system`). |
| Animations gated | Done | `Reveal` renders a static `<div>` when reduced; `PageTransition` returns children unwrapped; contact-form motion switches to opacity-only/none. |
| CSS safety net | Done | `@media (prefers-reduced-motion: reduce)` near-zeroes animation/transition durations and disables smooth scroll (`globals.css`). |
| Reduced transparency | Done | `@media (prefers-reduced-transparency: reduce)` makes `.glass` solid. |
| No motion-dependent info | Done | Hero 3D/GSAP are decorative (`aria-hidden`); all copy is static DOM. |
| No auto-playing flashing | Verify | Confirm no content flashes >3×/s (1.4.3 / 2.3.1). |

**Verify:** Enable OS "reduce motion" (and toggle the in-app control) and confirm reveals,
page transitions, and the hero settle without animation.

## 11. Images & non-text content (1.1.1)

| Item | Status | Detail |
| --- | --- | --- |
| Informative images have alt | Done | Cards/gallery/MDX/avatar provide descriptive alt (see SEO checklist §12). |
| Decorative images hidden | Done | Hero WebGL `aria-hidden`; decorative icons `aria-hidden`. |
| External-link cue | Done | Footer external links append `sr-only " (opens in new tab)"`. |

**Verify:** SR pass over images; confirm authored `gallery` `alt` text is meaningful, not
filename-like.

## 12. ARIA hygiene (4.1.2)

| Item | Status | Detail |
| --- | --- | --- |
| Prefer native semantics | Done | Native elements + Radix; ARIA used to supplement, not replace. |
| No invalid/redundant ARIA | Verify | Run axe to catch any conflicting roles/attributes. |
| Names for icon-only controls | Done | `aria-label` on menu trigger, theme toggle, etc. |

**Verify:** axe DevTools "ARIA" rules return zero violations.

## 13. Language, zoom, reflow (3.1.1, 1.4.4, 1.4.10)

| Item | Status | Detail |
| --- | --- | --- |
| Document language | Done | `<html lang="en">` (`layout.tsx`). |
| `colorScheme` declared | Done | `viewport.colorScheme = "dark light"`. |
| Text resize / reflow | Verify | Responsive Tailwind layout; confirm usability at 200% zoom and 320px width with no loss of content/function. |

**Verify:** Zoom to 200% and narrow to 320px; confirm no horizontal scrolling of body
content or clipped controls.

---

### Recommended audit workflow

1. **Automated:** axe DevTools (or `@axe-core/cli`) and Lighthouse Accessibility — run on
   every route, in **both** light and dark themes. Treat as a floor, not proof.
2. **Keyboard:** full tab-through per page (skip link, nav, menus, theme toggle, mobile
   sheet, contact form, dialogs).
3. **Screen reader:** VoiceOver (Safari/macOS) and/or NVDA (Firefox/Windows) — verify
   landmarks, heading order, form labels/errors, live-region announcements, current-page state.
4. **Motion:** test with OS reduce-motion on and via the in-app toggle.
5. **Zoom/reflow:** 200% zoom and 320px viewport.
6. **Forced colors:** Windows High Contrast — confirm focus outline and content remain visible.

> WCAG 2.2 focus items to re-verify after layout changes: 2.4.11 (focus not obscured),
> 2.5.8 (target size, especially `xs` controls), and 3.3.x (form error handling).

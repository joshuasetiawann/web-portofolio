# Component Inventory

> The authoritative catalog of every UI component in the Joshua Setiawan portfolio — purpose, typed prop signatures, variants, states, accessibility, responsive behavior, and animation behavior — grouped by domain and annotated with origin (shadcn vs custom) and render mode (RSC vs Client).

Related docs: [design-system](./design-system.md) · [creative-direction](./creative-direction.md) · [brand-identity](./brand-identity.md) · [information-architecture](./information-architecture.md) · [navigation-structure](./navigation-structure.md) · [ux-flow](./ux-flow.md) · [user-journey](./user-journey.md)

---

## How to read this document

Each component entry uses a fixed shape so the catalog is scannable and lint-able:

- **Meta line** — `Origin` (shadcn-generated · shadcn-extended · custom), `Render` (RSC · Client · Hybrid), `Path` (target location under `src/`).
- **Purpose** — one sentence on the job it does.
- **Props** — a TypeScript signature sketch (illustrative, not final; Phase 1 is docs-only).
- **Variants / States** — visual + interaction permutations.
- **Accessibility** — WCAG 2.2 AA obligations specific to the component.
- **Responsive** — behavior across mobile 390 / tablet 834 / desktop 1440.
- **Animation** — motion behavior, with the reduced-motion fallback.

### Conventions used across all components

| Concern | Rule |
| --- | --- |
| **Render mode default** | RSC by default. A component is `'use client'` ONLY if it uses hooks, browser APIs, Framer/GSAP/R3F, or event handlers. |
| **Styling** | Tailwind v4 CSS-first tokens; variants via `class-variance-authority`; class merge via `cn()` (`clsx` + `tailwind-merge`). See [design-system](./design-system.md). |
| **Motion authority** | Framer = state/lifecycle/gestures; GSAP+ScrollTrigger = scroll/pin/scrub; Lenis = smooth scroll value; R3F = WebGL. One rAF. No scroll-jacking. |
| **Reduced motion** | Single gate (`<html data-motion="reduce">`) → static, content visible by default, JS-off safe. Every "Animation" row names its reduced fallback. |
| **Color** | Never color-alone; pair with icon/text/shape. Contrast measured vs painted background, glow excluded. |
| **Focus** | `:focus-visible` via `outline` ≥2px + offset (survives forced-colors); not obscured by sticky header (WCAG 2.4.11). |
| **Targets** | Interactive hit area ≥24×24px (2.5.8); primary controls ≥44px on touch. |
| **Polymorphism** | Interactive primitives support Radix `asChild` (Slot) where a child element should receive the behavior. |

Legend: **RSC** = React Server Component · **Client** = `'use client'` · **Hybrid** = RSC shell with a Client island.

---

# 1. Core UI

shadcn/ui primitives (Radix-backed where relevant), themed to the canonical tokens. Most are Client by Radix necessity; presentational primitives stay RSC.

## Button
- **Meta** — Origin: shadcn-extended · Render: RSC (Client only via `asChild` to an interactive child or when wrapped by MagneticButton) · Path: `components/ui/button.tsx`
- **Purpose** — Primary interactive trigger for actions and navigation.
- **Props**
  ```ts
  type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
      loading?: boolean;
      iconLeft?: React.ReactNode;
      iconRight?: React.ReactNode;
    };
  // variant: 'primary' | 'secondary' | 'ghost' | 'outline' | 'link' | 'destructive' | 'gradient'
  // size:    'sm' | 'md' | 'lg' | 'icon'
  ```
- **Variants** — `primary` (solid `--primary`), `gradient` (signature `--gradient-accent`), `secondary`, `outline`, `ghost`, `link`, `destructive`. Sizes `sm/md/lg/icon`.
- **States** — default, hover, active/pressed, focus-visible, disabled, `loading` (spinner + `aria-busy`, label retained for width stability).
- **Accessibility** — Native `<button>` or `asChild` Slot; `loading` sets `aria-busy="true"` and `disabled`; icon-only (`size:'icon'`) requires `aria-label`; focus outline ≥2px; min 44px touch target at `lg`.
- **Responsive** — Full-width option via utility on mobile CTAs; label may truncate with title fallback at narrow widths.
- **Animation** — Background/border color tween `fast 160ms ease-out`; pressed scale `0.98` (spring `snappy`). Reduced: instant color swap, no scale.

## Badge
- **Meta** — Origin: shadcn-extended · Render: RSC · Path: `components/ui/badge.tsx`
- **Purpose** — Compact label for status, tags, categories, counts.
- **Props**
  ```ts
  type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
    VariantProps<typeof badgeVariants> & { dot?: boolean; asChild?: boolean };
  // variant: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' | 'info' | 'accent'
  ```
- **Variants** — semantic color set mapped to status tokens; `outline` for low-emphasis tags; optional leading `dot`.
- **States** — static; interactive only when used as a filter chip (then renders as Button/anchor with hover + aria-pressed).
- **Accessibility** — Decorative dot is `aria-hidden`; status conveyed by text not color alone; if used as a live status, wrap value in a labeled context.
- **Responsive** — Wraps within tag rows; `gap` collapses on mobile.
- **Animation** — None by default; filter chips get `fast` background tween. Reduced: none.

## Card
- **Meta** — Origin: shadcn-extended · Render: RSC · Path: `components/ui/card.tsx`
- **Purpose** — Glass-like elevated surface container with header/content/footer slots.
- **Props**
  ```ts
  type CardProps = React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof cardVariants> & { asChild?: boolean };
  // variant: 'surface' | 'glass' | 'outline' | 'ghost'
  // elevation: 'none' | '1' | '2' | '3'
  // + Card.Header, Card.Title, Card.Description, Card.Content, Card.Footer
  ```
- **Variants** — `surface` (`--surface-2`), `glass` (backdrop-blur 12px with solid fallback under `prefers-reduced-transparency`), `outline`, `ghost`. Elevation `1–3` per token shadows.
- **States** — static; interactive cards (links) expose hover lift + focus ring on the wrapping anchor, not the Card div.
- **Accessibility** — Pure container (no role); when made clickable, a single anchor wraps content (one tab stop, full-card target ≥24px); title uses correct heading level for context.
- **Responsive** — Padding scales `space-4 → space-6 → space-8`; radius `lg(16)`.
- **Animation** — Hover `lift -6px` + elevation step (spring `soft`) on interactive variant. Reduced: border/elevation change only, no translate.

## Input
- **Meta** — Origin: shadcn-extended · Render: Client (controlled/RHF) · Path: `components/ui/input.tsx`
- **Purpose** — Single-line text/email/number field, RHF-compatible.
- **Props**
  ```ts
  type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
    VariantProps<typeof inputVariants> & { invalid?: boolean; iconLeft?: React.ReactNode };
  // size: 'sm' | 'md' | 'lg'
  ```
- **Variants** — sizes; optional leading icon slot.
- **States** — default, focus, filled, `invalid` (red ring + `aria-invalid`), disabled, readonly.
- **Accessibility** — Always paired with `<label htmlFor>`; `autocomplete` + `inputmode` set; `aria-invalid` + `aria-describedby` link to error/help; error text is text not color alone.
- **Responsive** — Full width within form column; 16px font on mobile to prevent iOS zoom.
- **Animation** — Focus ring fade `fast`; invalid shake disabled by default (respect reduced/cognitive load) — error appears via opacity. Reduced: instant.

## Textarea
- **Meta** — Origin: shadcn-extended · Render: Client · Path: `components/ui/textarea.tsx`
- **Purpose** — Multi-line text entry (contact message).
- **Props**
  ```ts
  type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
    { invalid?: boolean; autoGrow?: boolean; maxLength?: number };
  ```
- **Variants** — fixed vs `autoGrow`; with/without character counter.
- **States** — default, focus, invalid, disabled; optional live counter near `maxLength`.
- **Accessibility** — Label association; counter announced politely (`aria-live="polite"`) only near the limit; `aria-describedby` for help/error.
- **Responsive** — Min-height scales; resize vertical only.
- **Animation** — Height transition on `autoGrow` (`fast`, height-only). Reduced: instant resize.

## Select
- **Meta** — Origin: shadcn (Radix Select) · Render: Client · Path: `components/ui/select.tsx`
- **Purpose** — Single-choice dropdown (e.g., contact subject, gallery category, project filter).
- **Props**
  ```ts
  // Composed: Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel
  type SelectProps = React.ComponentProps<typeof RadixSelect.Root>;
  ```
- **Variants** — trigger sizes `sm/md`; grouped vs flat options.
- **States** — closed, open, item hover/active/selected, disabled item, focus.
- **Accessibility** — Radix manages roving focus, typeahead, `aria-expanded`, return-focus to trigger; portaled content with focus management; keyboard full support.
- **Responsive** — On mobile, content uses a popper that flips to fit viewport; ≥44px items on touch.
- **Animation** — Content fade+scale-in from trigger origin (`fast`, Framer `AnimatePresence`). Reduced: instant show/hide.

## Dialog (Modal)
- **Meta** — Origin: shadcn (Radix Dialog) · Render: Client · Path: `components/ui/dialog.tsx`
- **Purpose** — Focus-trapping overlay for confirmations, lightbox shells, secondary flows.
- **Props**
  ```ts
  // Composed: Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
  //           DialogDescription, DialogFooter, DialogClose
  type DialogContentProps = React.ComponentProps<typeof RadixDialog.Content> &
    { size?: 'sm' | 'md' | 'lg' | 'full' };
  ```
- **Variants** — size set incl. `full` (gallery lightbox).
- **States** — closed, opening, open, closing; backdrop scrim; scroll-locked body.
- **Accessibility** — `role="dialog"` `aria-modal`; required `DialogTitle` (+ `aria-describedby`); focus trapped + `inert` background; ESC + scrim close; focus returns to trigger; z-index `modal 80`.
- **Responsive** — Centered ≤`md`; on mobile may dock to bottom or go `full`.
- **Animation** — Scrim fade + content scale/translate-in (`base 280ms`, exit `~0.7x`). Reduced: opacity-only, no scale/translate.

## Sheet (Drawer)
- **Meta** — Origin: shadcn (Radix Dialog variant) · Render: Client · Path: `components/ui/sheet.tsx`
- **Purpose** — Edge-anchored panel; primary use = mobile navigation and filter panels.
- **Props**
  ```ts
  type SheetContentProps = React.ComponentProps<typeof RadixDialog.Content> &
    { side?: 'top' | 'right' | 'bottom' | 'left'; size?: 'sm' | 'md' | 'lg' };
  ```
- **Variants** — four `side`s; size set.
- **States** — closed/open/closing; scrim; scroll-locked.
- **Accessibility** — Same modal contract as Dialog; first focus moves into the panel; `inert` background; return focus to the hamburger trigger.
- **Responsive** — Primary at <`lg` for nav; `right` panel for desktop filters.
- **Animation** — Slide from `side` (`base`, ease `out`) + scrim fade. Reduced: instant slide replaced by fade.

## Tooltip
- **Meta** — Origin: shadcn (Radix Tooltip) · Render: Client · Path: `components/ui/tooltip.tsx`
- **Purpose** — Supplemental label on hover/focus (icon buttons, tech badges, social links).
- **Props**
  ```ts
  // Composed: TooltipProvider (global in providers), Tooltip, TooltipTrigger, TooltipContent
  type TooltipContentProps = React.ComponentProps<typeof RadixTooltip.Content> &
    { side?: Side; align?: Align };
  ```
- **Variants** — placement sides; arrow on/off.
- **States** — hidden, delayed-open, open, closing.
- **Accessibility** — Supplemental only (never sole source of essential info); opens on hover AND keyboard focus; dismissible with ESC; content is `aria-describedby`. Single shared `TooltipProvider` in providers tree.
- **Responsive** — Suppressed on touch (no hover); essential labels duplicated as visible text or `aria-label`.
- **Animation** — Fade+2px rise (`fast`). Reduced: instant fade.

## Tabs
- **Meta** — Origin: shadcn (Radix Tabs) · Render: Client · Path: `components/ui/tabs.tsx`
- **Purpose** — Switch panels in place (project detail sections, GitHub dashboard views).
- **Props**
  ```ts
  // Composed: Tabs, TabsList, TabsTrigger, TabsContent
  type TabsProps = React.ComponentProps<typeof RadixTabs.Root> &
    { variant?: 'underline' | 'pill' };
  ```
- **Variants** — `underline` (animated indicator) and `pill`.
- **States** — active/inactive trigger, hover, focus, disabled tab.
- **Accessibility** — Radix roving tabindex + `aria-selected` + arrow-key navigation; panels `role="tabpanel"` with `aria-labelledby`; automatic vs manual activation set to manual for heavy panels.
- **Responsive** — `TabsList` becomes horizontally scrollable with edge fade on overflow; ≥44px touch targets.
- **Animation** — `layoutId` shared active indicator slides (Framer `layout`, spring `layout`). Reduced: indicator jumps, no slide.

## Accordion
- **Meta** — Origin: shadcn (Radix Accordion) · Render: Client · Path: `components/ui/accordion.tsx`
- **Purpose** — Expand/collapse stacked sections (FAQ, project metrics detail, philosophy principles).
- **Props**
  ```ts
  // Composed: Accordion, AccordionItem, AccordionTrigger, AccordionContent
  type AccordionProps = React.ComponentProps<typeof RadixAccordion.Root>; // type: 'single' | 'multiple'
  ```
- **Variants** — `single` (default) / `multiple`; bordered vs flush.
- **States** — collapsed, expanded, hover, focus, disabled.
- **Accessibility** — Trigger is a `<button>` with `aria-expanded` + `aria-controls`; content region labelled by trigger; chevron decorative.
- **Responsive** — Full-width rows; comfortable 44px triggers on touch.
- **Animation** — Height auto via Radix CSS vars + `base` ease-out; chevron rotate 180°. Reduced: instant open/close, no rotate transition.

## Command menu (Command Palette)
- **Meta** — Origin: shadcn (cmdk) wrapped in Dialog · Render: Client · Path: `components/ui/command.tsx` + `features/command/command-palette.tsx`
- **Purpose** — `Cmd/Ctrl+K` global launcher for navigation across all 16 destinations, theme toggle, quick actions.
- **Props**
  ```ts
  type CommandPaletteProps = { groups: CommandGroup[]; recent?: CommandId[] };
  type CommandGroup = { heading: string; items: CommandItem[] };
  type CommandItem = { id: string; label: string; href?: string; action?: () => void; icon?: LucideIcon; keywords?: string[]; shortcut?: string };
  ```
- **Variants** — grouped sections (Primary, Explore, Actions, Theme); empty-results state.
- **States** — closed, open, typing/filtering, no-results, item active.
- **Accessibility** — cmdk provides `role="combobox"`/`listbox`/`option`, `aria-activedescendant`; opens on `Cmd/Ctrl+K` and a visible trigger; full keyboard loop; ESC closes; returns focus to invoker; respects Dialog focus trap; z-index `modal 80`.
- **Responsive** — Full-width near-top on mobile; centered max-w-lg on desktop; touch-friendly rows.
- **Animation** — Dialog scale/fade-in; result rows stagger `tight 30ms` on first open only. Reduced: instant, no stagger.

## Dropdown (Dropdown Menu)
- **Meta** — Origin: shadcn (Radix DropdownMenu) · Render: Client · Path: `components/ui/dropdown-menu.tsx`
- **Purpose** — Contextual action/menu lists (share, theme submenu, overflow actions).
- **Props**
  ```ts
  // Composed: DropdownMenu, Trigger, Content, Item, CheckboxItem, RadioGroup, RadioItem,
  //           Label, Separator, Sub, SubTrigger, SubContent
  type DropdownContentProps = React.ComponentProps<typeof RadixMenu.Content>;
  ```
- **Variants** — items, checkbox items, radio groups, submenus.
- **States** — closed/open, item hover/focus/disabled, checked.
- **Accessibility** — Radix menu semantics, typeahead, arrow nav, `aria-checked`; portaled; focus returns to trigger; ESC closes.
- **Responsive** — Popper flips within viewport; ≥44px items on touch.
- **Animation** — Fade+scale from trigger corner (`fast`). Reduced: instant.

## Avatar
- **Meta** — Origin: shadcn (Radix Avatar) · Render: RSC (image) / Client (Radix fallback) · Path: `components/ui/avatar.tsx`
- **Purpose** — User/profile or org image with graceful fallback (About, GitHub dashboard, OSS contributors).
- **Props**
  ```ts
  // Composed: Avatar, AvatarImage, AvatarFallback
  type AvatarProps = { size?: 'sm' | 'md' | 'lg' | 'xl'; src?: string; alt: string; fallback?: string };
  ```
- **Variants** — size set; circular (default) / rounded-square.
- **States** — loading, loaded, error→fallback (initials/icon).
- **Accessibility** — Meaningful `alt`; fallback initials wrapped with `aria-hidden` if decorative, else labelled.
- **Responsive** — Size token scales; uses `next/image` for real photos with blur placeholder.
- **Animation** — Fade-in on image load (`fast`). Reduced: instant.

## Skeleton
- **Meta** — Origin: shadcn-extended · Render: RSC · Path: `components/ui/skeleton.tsx`
- **Purpose** — Layout-stable placeholder during loading (route segments, GitHub data, gallery).
- **Props**
  ```ts
  type SkeletonProps = React.HTMLAttributes<HTMLDivElement> &
    { shape?: 'text' | 'rect' | 'circle'; lines?: number };
  ```
- **Variants** — text (multi-line), rect, circle.
- **States** — single state (loading); removed on data arrival.
- **Accessibility** — `aria-hidden="true"`; parent region announces loading via `aria-busy`/live region (see [LoadingState](#loading-state)); reserves exact dimensions to protect CLS ≤0.02.
- **Responsive** — Mirrors the real component's responsive box.
- **Animation** — Subtle shimmer sweep (CSS, `ambient`). Reduced/saveData: static muted fill, no shimmer.

## Toast
- **Meta** — Origin: sonner (per locked stack) · Render: Client (Toaster mounted in providers) · Path: `components/ui/sonner.tsx`
- **Purpose** — Transient feedback (contact submit success/error, copy confirmations).
- **Props**
  ```ts
  // Imperative API: toast.success(msg, opts) | toast.error | toast.message | toast.promise
  type ToastOptions = { description?: string; duration?: number; action?: { label: string; onClick: () => void } };
  ```
- **Variants** — success, error, info, loading/promise; with optional action.
- **States** — enter, visible, auto-dismiss, swipe/close, stacked.
- **Accessibility** — Polite live region (assertive for errors); not the sole channel for form success (persistent inline success also shown); dismissible; pause-on-hover; z-index `toast 90`.
- **Responsive** — Bottom-center on mobile, bottom-right on desktop; safe-area insets.
- **Animation** — Slide+fade in/out, height collapse on stack (sonner). Reduced: opacity-only.

## Progress
- **Meta** — Origin: shadcn (Radix Progress) · Render: Client (for determinate values) · Path: `components/ui/progress.tsx`
- **Purpose** — Determinate progress / proportion bars (GitHub language breakdown, skill levels, upload state).
- **Props**
  ```ts
  type ProgressProps = { value: number; max?: number; label?: string; variant?: 'bar' | 'segmented'; color?: string };
  ```
- **Variants** — continuous `bar`, `segmented`; accent or chart-color fills.
- **States** — indeterminate (rare), determinate; complete.
- **Accessibility** — `role="progressbar"` + `aria-valuenow/min/max` + `aria-label`; value also shown as text; color paired with label (never color alone).
- **Responsive** — Full-width; segment count adapts.
- **Animation** — Fill width tween on mount/scroll-in (`moderate`, ease-out). Reduced: render at final width instantly.

## Separator
- **Meta** — Origin: shadcn (Radix Separator) · Render: RSC · Path: `components/ui/separator.tsx`
- **Purpose** — Visual/semantic divider between groups.
- **Props**
  ```ts
  type SeparatorProps = { orientation?: 'horizontal' | 'vertical'; decorative?: boolean };
  ```
- **Variants** — horizontal/vertical; hairline vs `--border-strong`.
- **States** — static.
- **Accessibility** — `decorative` → `role="none"`; semantic separators expose `role="separator"` + orientation.
- **Responsive** — Switches orientation in flex/grid contexts at breakpoints.
- **Animation** — None. Reduced: n/a.

---

# 2. Layout

Structural primitives and app shell. Mostly RSC; the shell pieces with scroll/menu state are Client islands.

## Container
- **Meta** — Origin: custom · Render: RSC · Path: `components/layout/container.tsx`
- **Purpose** — Centered max-width wrapper with responsive gutter.
- **Props**
  ```ts
  type ContainerProps = React.HTMLAttributes<HTMLDivElement> &
    { size?: 'content' | 'wide' | 'prose'; as?: ElementType };
  ```
- **Variants** — `content 1280` · `wide 1440` · `prose 720`.
- **States** — static.
- **Accessibility** — No role; `as` enables semantic element; gutter `clamp(1.25rem,5vw,4rem)`.
- **Responsive** — Max-width + gutter clamp; full-bleed children opt out.
- **Animation** — None.

## Section
- **Meta** — Origin: custom · Render: RSC · Path: `components/layout/section.tsx`
- **Purpose** — Vertical rhythm band wrapping a page section, optional landmark.
- **Props**
  ```ts
  type SectionProps = React.HTMLAttributes<HTMLElement> &
    { as?: 'section' | 'div'; spacing?: 'none' | 'sm' | 'md' | 'lg'; container?: ContainerProps['size'] | false; labelledBy?: string };
  ```
- **Variants** — spacing maps to `--section-y clamp(6rem,12vw,12rem)` scale; optional inner Container.
- **States** — static; can host a ScrollTrigger context.
- **Accessibility** — When `as="section"` requires `aria-labelledby` (or `aria-label`); one labeled landmark of each type per page.
- **Responsive** — Section rhythm clamps with viewport.
- **Animation** — Acts as reveal scope (children use [Reveal](#reveal)); no motion itself. Reduced: passthrough.

## Grid
- **Meta** — Origin: custom · Render: RSC · Path: `components/layout/grid.tsx`
- **Purpose** — Responsive 12/8/4 column grid helper.
- **Props**
  ```ts
  type GridProps = React.HTMLAttributes<HTMLDivElement> &
    { cols?: 1|2|3|4|6|12; gap?: SpaceToken; responsive?: Partial<Record<Breakpoint, number>> };
  ```
- **Variants** — fixed cols or per-breakpoint map.
- **States** — static.
- **Accessibility** — Visual only; reading order matches DOM order.
- **Responsive** — 12 (desktop) / 8 (tablet) / 4 (mobile) baseline; gap tokenized.
- **Animation** — None (see [AnimatedGrid](#animated-grid) for motion).

## Stack
- **Meta** — Origin: custom · Render: RSC · Path: `components/layout/stack.tsx`
- **Purpose** — One-dimensional flex layout with tokenized gap (vertical/horizontal).
- **Props**
  ```ts
  type StackProps = React.HTMLAttributes<HTMLDivElement> &
    { direction?: 'row' | 'col'; gap?: SpaceToken; align?: Align; justify?: Justify; wrap?: boolean };
  ```
- **Variants** — row/col; wrap.
- **States** — static.
- **Accessibility** — Visual only; DOM = reading order.
- **Responsive** — `direction` can switch at breakpoints via responsive prop.
- **Animation** — None.

## Page shell (Root layout chrome)
- **Meta** — Origin: custom · Render: Hybrid (RSC layout + Client providers) · Path: `app/layout.tsx` + `components/layout/app-shell.tsx`
- **Purpose** — Global frame: skip link, Header, `<main id="main-content">`, Footer, persistent `<Canvas>` portal target, providers, Toaster.
- **Props**
  ```ts
  type AppShellProps = { children: React.ReactNode };
  ```
- **Variants** — standard vs immersive (landing) where Header overlays a full-bleed hero.
- **States** — route transitions; scroll position (drives Header collapse).
- **Accessibility** — Skip-to-content is first focusable; exactly one `<main>`; on route change focus moves to `#main-content` + polite live-region announce; single persistent landmarks.
- **Responsive** — Header height + gutter adapt; Footer reflows columns.
- **Animation** — Hosts [PageTransition](#page-transition) curtain and [ScrollProgress](#scroll-progress). Reduced: instant route swaps.

## Header (Site navigation bar)
- **Meta** — Origin: custom · Render: Client · Path: `components/layout/header.tsx`
- **Purpose** — Sticky top nav: wordmark→monogram logo, primary links (Projects, About, Blog, Contact), Explore mega-menu trigger, theme toggle, `Cmd+K` trigger, mobile hamburger.
- **Props**
  ```ts
  type HeaderProps = { transparentOnTop?: boolean };
  ```
- **Variants** — transparent-over-hero vs solid/glass scrolled; expanded vs collapsed (monogram) logo.
- **States** — top, scrolled (glass + condensed), menu-open, hidden-on-scroll-down (optional).
- **Accessibility** — `role` via `<header>`; nav is a labeled `<nav aria-label="Primary">`; mega-menu is a disclosure with `aria-expanded`/`aria-controls`; sticky header must not obscure focus (2.4.11) — scroll-margin on targets; keyboard operable; current page `aria-current="page"`.
- **Responsive** — Full nav ≥`lg`; hamburger→[MobileMenu](#mobile-menu) below; logo collapses to `JS` on scroll.
- **Animation** — Background/blur fade-in on scroll, logo crossfade/scale (GSAP ScrollTrigger reading Lenis), mega-menu reveal (Framer). Reduced: instant state changes, no logo morph animation (still switches).

## Footer
- **Meta** — Origin: custom · Render: RSC · Path: `components/layout/footer.tsx`
- **Purpose** — Full sitemap, social links, availability badge, legal (privacy), back-to-top, build/year.
- **Props**
  ```ts
  type FooterProps = { showSitemap?: boolean };
  ```
- **Variants** — full sitemap vs compact (utility pages like privacy/404).
- **States** — static; back-to-top button active after scroll.
- **Accessibility** — `<footer>` contentinfo landmark; sitemap is labeled nav groups; links have discernible text; back-to-top is a real button with label.
- **Responsive** — 4-col (desktop) → 2-col (tablet) → stacked (mobile) link groups.
- **Animation** — Column reveal on scroll-in (stagger `base`). Reduced: visible, no stagger.

## Mobile menu
- **Meta** — Origin: custom (composed on [Sheet](#sheet-drawer)) · Render: Client · Path: `components/layout/mobile-menu.tsx`
- **Purpose** — Full-screen/edge nav panel for <`lg`, exposing primary + Explore + utilities + theme toggle.
- **Props**
  ```ts
  type MobileMenuProps = { open: boolean; onOpenChange: (o: boolean) => void };
  ```
- **Variants** — flat list vs grouped (with Explore section expanded inline).
- **States** — closed/open; sub-section expanded; current route highlighted.
- **Accessibility** — Inherits Sheet modal contract (focus trap, `inert`, ESC, return focus to hamburger); `aria-current` on active link; ≥44px rows.
- **Responsive** — Only mounts <`lg`.
- **Animation** — Slide-in panel + staggered link reveal (`tight`). Reduced: fade, no stagger.

## Section header
- **Meta** — Origin: custom · Render: RSC · Path: `components/layout/section-header.tsx`
- **Purpose** — Eyebrow + heading + optional description/action for a content section.
- **Props**
  ```ts
  type SectionHeaderProps = { eyebrow?: string; title: string; description?: string; as?: 'h2'|'h3'; align?: 'left'|'center'; action?: React.ReactNode };
  ```
- **Variants** — left/center align; with/without trailing action (e.g., "View all").
- **States** — static.
- **Accessibility** — Renders correct heading level (never skips); eyebrow is decorative mono label, not a heading; action is a real link/button.
- **Responsive** — Center on mobile optionally; action wraps below on narrow.
- **Animation** — Eyebrow + title use [TextReveal](#text-reveal) on scroll-in. Reduced: static.

## Page header (Route hero/heading)
- **Meta** — Origin: custom · Render: RSC (Client only if it hosts motion island) · Path: `components/layout/page-header.tsx`
- **Purpose** — Top-of-route title block for non-landing pages (the route `<h1>`), optional breadcrumb + meta.
- **Props**
  ```ts
  type PageHeaderProps = { title: string; eyebrow?: string; description?: string; breadcrumb?: Crumb[]; meta?: React.ReactNode };
  ```
- **Variants** — with/without breadcrumb; with/without meta row (date, read time).
- **States** — static.
- **Accessibility** — Contains the single `<h1>` for the route; breadcrumb is `<nav aria-label="Breadcrumb">` + ordered list + `aria-current="page"`; emits BreadcrumbList JSON-LD on nested routes.
- **Responsive** — Type scales via fluid clamps; breadcrumb truncates middle crumbs on mobile.
- **Animation** — Word/line reveal on mount (`WordReveal`/`TextReveal`). Reduced: static visible.

---

# 3. Portfolio

Domain composition components. Cards/headers are RSC; anything with hover shaders, live data, or forms is Client/Hybrid.

## Hero (Landing "Signal Field")
- **Meta** — Origin: custom · Render: Hybrid (RSC content + Client R3F/GSAP island) · Path: `features/home/hero.tsx`
- **Purpose** — Immersive landing hero: display-2xl name/positioning, CTA, and the GPU particle "Signal Field" backdrop.
- **Props**
  ```ts
  type HeroProps = { title: string; tagline: string; ctas: { label: string; href: string; variant?: ButtonProps['variant'] }[] };
  ```
- **Variants** — WebGL-enabled vs static-poster (device-tier / no-WebGL / reduced-motion).
- **States** — initial poster (LCP), hydrated/interactive, paused (offscreen via IntersectionObserver).
- **Accessibility** — Heading is the route `<h1>`; canvas `aria-hidden` + `tabindex=-1`; the static poster IS the LCP element; content never gated behind animation; CTA buttons keyboard-first.
- **Responsive** — Type clamps `display-2xl`; particle density/DPR clamp `[1,1.75]` scales down on mobile; layout reflows CTA stack.
- **Animation** — Curl-noise vertex shader field (R3F, `frameloop="demand"`); headline word reveal + CTA rise (GSAP/Framer) on load. Reduced: static poster image, headline visible immediately, no shader.

## Project card
- **Meta** — Origin: custom · Render: RSC (Client only for hover-shader variant) · Path: `features/projects/project-card.tsx`
- **Purpose** — Grid tile linking to a project, showing cover, title, role/year, tags.
- **Props**
  ```ts
  type ProjectCardProps = { project: Pick<Project,'slug'|'title'|'summary'|'role'|'year'|'status'|'kind'|'tags'|'cover'|'color'>; priority?: boolean; interactiveCover?: boolean };
  ```
- **Variants** — default / `interactiveCover` (project-cover hover shader) / compact.
- **States** — default, hover (lift + cover zoom), focus-visible, archived/wip status badge.
- **Accessibility** — Whole card is one anchor (single tab stop) labeled by title; status via [Badge](#badge) text; cover `alt` from data; cover hover shader is decorative.
- **Responsive** — `next/image` with sizes; grid 3→2→1 cols; first row `priority`.
- **Animation** — Hover cover scale `1.04` + `lift -6px` (spring `soft`); optional WebGL cover shader on hover. Reduced: static, border emphasis only.

## Featured project
- **Meta** — Origin: custom · Render: Hybrid · Path: `features/projects/featured-project.tsx`
- **Purpose** — Large editorial showcase for `featured` projects on landing/projects index (oversized cover, metrics, CTA).
- **Props**
  ```ts
  type FeaturedProjectProps = { project: Project; layout?: 'left' | 'right'; index?: number };
  ```
- **Variants** — media-left / media-right alternating; with inline [ProjectMetrics](#project-metrics).
- **States** — default, hover, in-view (scroll reveal/parallax).
- **Accessibility** — Single primary link; metrics use text+label; decorative parallax `aria-hidden`; heading level consistent with section.
- **Responsive** — Two-column ≥`lg`, stacked below; media aspect locked to prevent CLS.
- **Animation** — Parallax on cover (GSAP scrub) + content reveal stagger. Reduced: static, no parallax.

## Project grid
- **Meta** — Origin: custom · Render: Hybrid (RSC list + Client filter island) · Path: `features/projects/project-grid.tsx`
- **Purpose** — Filterable/sortable collection of [ProjectCard](#project-card)s.
- **Props**
  ```ts
  type ProjectGridProps = { projects: Project[]; initialFilter?: ProjectKind | 'all'; enableFilter?: boolean };
  ```
- **Variants** — with/without filter bar; kind filters (software/creative/research/oss).
- **States** — all, filtered, empty (→ [EmptyState](#empty-state)), reordering.
- **Accessibility** — Filter chips are a labeled group (`aria-pressed`); result count announced via live region; layout changes preserve focus.
- **Responsive** — Columns adapt 3/2/1; filter bar scrolls horizontally on mobile.
- **Animation** — `AnimatePresence` + `layout` reflow on filter (spring `layout`). Reduced: instant filter, no layout animation.

## Project detail header
- **Meta** — Origin: custom · Render: RSC · Path: `features/projects/project-detail-header.tsx`
- **Purpose** — Hero block for `/projects/[slug]`: title, role/year/status, links (live/repo/case study), cover.
- **Props**
  ```ts
  type ProjectDetailHeaderProps = { project: Pick<Project,'title'|'summary'|'role'|'year'|'status'|'stack'|'links'|'cover'|'metrics'> };
  ```
- **Variants** — with/without live links; with/without metrics strip.
- **States** — static; link buttons hover/focus.
- **Accessibility** — Route `<h1>`; external links flagged (see [ExternalLink](#external-link)); breadcrumb above; emits CreativeWork/SoftwareSourceCode JSON-LD.
- **Responsive** — Cover full-bleed on mobile; meta wraps; links stack.
- **Animation** — Title word reveal + cover image reveal. Reduced: static.

## Project metrics
- **Meta** — Origin: custom · Render: Client (count-up) / RSC fallback · Path: `features/projects/project-metrics.tsx`
- **Purpose** — Key result stats strip (`metrics[{label,value}]`).
- **Props**
  ```ts
  type ProjectMetricsProps = { metrics: { label: string; value: string | number; unit?: string }[]; countUp?: boolean };
  ```
- **Variants** — inline strip / grid; with/without count-up.
- **States** — pre-animation (final value rendered for SSR), animating, settled.
- **Accessibility** — Each metric is label+value text (`tabular-nums`); count-up never hides final value from AT (final value in DOM, animation visual only).
- **Responsive** — 4→2→2 columns; numbers use tabular figures to avoid reflow.
- **Animation** — Count-up on scroll-in (GSAP, `moderate`). Reduced/saveData: render final values immediately.

## Tech stack list
- **Meta** — Origin: custom · Render: RSC · Path: `features/projects/tech-stack-list.tsx`
- **Purpose** — Display technologies/tools as labeled chips with optional icons.
- **Props**
  ```ts
  type TechStackListProps = { items: { name: string; icon?: React.ReactNode; href?: string }[]; size?: 'sm' | 'md' };
  ```
- **Variants** — chips vs inline list; with/without icons; linkable.
- **States** — static; hover on linkable items.
- **Accessibility** — Icons decorative (`aria-hidden`) with adjacent text; linkable chips are anchors with discernible names; not color alone.
- **Responsive** — Wraps; gap collapses on mobile.
- **Animation** — Optional stagger reveal in section context. Reduced: static.

## Blog card
- **Meta** — Origin: custom · Render: RSC · Path: `features/blog/blog-card.tsx`
- **Purpose** — Index tile for a blog post: title, description, date, reading time, tags, optional cover.
- **Props**
  ```ts
  type BlogCardProps = { post: Pick<BlogPost,'slug'|'title'|'description'|'date'|'readingTime'|'tags'|'cover'>; featured?: boolean };
  ```
- **Variants** — default / `featured` (larger, cover-led) / compact (list row).
- **States** — default, hover, focus, `draft` hidden in prod.
- **Accessibility** — Single anchor labeled by title; `<time datetime>` for date; reading time as text; cover `alt` or decorative.
- **Responsive** — Cover aspect locked; grid 3→2→1; compact list on mobile.
- **Animation** — Hover lift + cover zoom. Reduced: border emphasis only.

## Blog content layout (MDX article)
- **Meta** — Origin: custom · Render: RSC (MDX) with Client islands (TOC, copy) · Path: `features/blog/blog-content-layout.tsx`
- **Purpose** — Reading layout for `/blog/[slug]`: prose column, sticky TOC, meta, share, related.
- **Props**
  ```ts
  type BlogContentLayoutProps = { post: BlogPost; children: React.ReactNode /* compiled MDX */ };
  ```
- **Variants** — with/without TOC (short posts); with/without cover.
- **States** — static; TOC active-section tracking; reading [ScrollProgress](#scroll-progress).
- **Accessibility** — One `<h1>`; `<article>`; prose measure 65–72ch; TOC is `<nav aria-label="On this page">` with `aria-current`; emits BlogPosting JSON-LD; code blocks accessible (see [CodeBlock](#code-block)).
- **Responsive** — TOC sticky sidebar ≥`xl`, collapses to top disclosure below; prose container 720.
- **Animation** — Reading progress bar; TOC active highlight (GSAP ScrollTrigger). Reduced: progress updates without smoothing, no reveal.

## Research card
- **Meta** — Origin: custom · Render: RSC · Path: `features/research/research-card.tsx`
- **Purpose** — Index tile for a research entry: title, abstract snippet, venue, status, authors, links (pdf/doi/code).
- **Props**
  ```ts
  type ResearchCardProps = { item: Pick<ResearchEntry,'slug'|'title'|'abstract'|'date'|'authors'|'venue'|'status'|'links'> };
  ```
- **Variants** — published / preprint / wip (status badge); with/without external links.
- **States** — default, hover, focus.
- **Accessibility** — Primary anchor to detail; external links labeled (DOI/PDF/code) with new-tab cue; status via text badge; authors list readable.
- **Responsive** — Stacks meta below title on mobile; links wrap.
- **Animation** — Hover lift. Reduced: static.

## Timeline item
- **Meta** — Origin: custom · Render: RSC · Path: `features/timeline/timeline-item.tsx`
- **Purpose** — One node on the `/timeline`: date, title, type, description, optional ref link.
- **Props**
  ```ts
  type TimelineItemProps = { event: { date: string; title: string; type: 'role'|'launch'|'award'|'talk'|'education'|'milestone'; description?: string; ref?: { label: string; href: string } }; side?: 'left' | 'right' };
  ```
- **Variants** — type-colored marker (with icon, not color alone); alternating left/right on desktop.
- **States** — default, in-view (reveal), hover on ref link.
- **Accessibility** — Rendered as an ordered list item; type conveyed by icon+label; `<time datetime>`; connector line decorative `aria-hidden`.
- **Responsive** — Single-rail left-aligned on mobile; alternating two-rail ≥`lg`.
- **Animation** — Marker draw + content slide-in on scroll (GSAP scrub/reveal). Reduced: static, visible.

## Experience card
- **Meta** — Origin: custom · Render: RSC · Path: `features/experience/experience-card.tsx`
- **Purpose** — Role entry on `/experience`: role, company, dates, location, summary, highlights, stack.
- **Props**
  ```ts
  type ExperienceCardProps = { item: { role: string; company: string; start: string; end?: string; location?: string; summary: string; highlights: string[]; stack: string[] } };
  ```
- **Variants** — current (open-ended `end`) vs past; expanded vs condensed highlights.
- **States** — default, hover, optional expand (highlights via [Accordion](#accordion)).
- **Accessibility** — Company/role as heading-appropriate text; `<time>` range with "Present" for current; highlights as list; stack via [TechStackList](#tech-stack-list).
- **Responsive** — Two-column (meta | detail) ≥`lg`; stacked on mobile.
- **Animation** — Reveal on scroll; highlight stagger. Reduced: static.

## Certificate card
- **Meta** — Origin: custom · Render: RSC (Client only if it opens a lightbox) · Path: `features/certificates/certificate-card.tsx`
- **Purpose** — Credential tile: name, issuer, date, credential id/url, image, skills.
- **Props**
  ```ts
  type CertificateCardProps = { item: { name: string; issuer: string; date: string; credentialId?: string; url?: string; image: ImageData; skills: string[] } };
  ```
- **Variants** — with/without verify link; image-led vs text-led.
- **States** — default, hover, focus; image opens lightbox ([Dialog](#dialog-modal)) optionally.
- **Accessibility** — Image `alt` includes cert name+issuer; verify link external-flagged; skills as labeled chips; credential id copyable (see [CopyButton](#copy-button)).
- **Responsive** — Grid 3→2→1; image aspect locked.
- **Animation** — Hover lift + subtle image zoom. Reduced: static.

## Achievement card
- **Meta** — Origin: custom · Render: RSC · Path: `features/achievements/achievement-card.tsx`
- **Purpose** — Award/recognition tile: title, date, category, description, link/proof.
- **Props**
  ```ts
  type AchievementCardProps = { item: { title: string; date: string; category: string; description?: string; link?: string; proof?: string } };
  ```
- **Variants** — category-tagged; with/without proof link.
- **States** — default, hover, focus.
- **Accessibility** — Category via [Badge](#badge) text; `<time>`; proof/link external-flagged; meaningful order.
- **Responsive** — Grid/list adapts; description clamps on mobile.
- **Animation** — Reveal on scroll. Reduced: static.

## Gallery item
- **Meta** — Origin: custom · Render: Hybrid (RSC image + Client lightbox trigger) · Path: `features/gallery/gallery-item.tsx`
- **Purpose** — Masonry/grid image tile opening a lightbox; from typed gallery data.
- **Props**
  ```ts
  type GalleryItemProps = { item: { src: string; alt: string; caption?: string; category: string; width: number; height: number; blurDataURL: string; date?: string }; onOpen?: (id: string) => void };
  ```
- **Variants** — masonry vs uniform grid; with/without caption overlay.
- **States** — loading (blur placeholder), loaded, hover (caption/zoom), focus, open-in-lightbox.
- **Accessibility** — Trigger is a real `<button>` labeled by alt/caption; lightbox is a [Dialog](#dialog-modal) with prev/next controls (2.5.7); `next/image` with explicit width/height (CLS-safe).
- **Responsive** — Column count 4→3→2→1; intrinsic aspect from width/height.
- **Animation** — Hover zoom + caption rise; lightbox shared-element transition (`layoutId`). Reduced: instant open, no zoom.

## GitHub stats card
- **Meta** — Origin: custom · Render: Hybrid (RSC server-fetch + ISR, Client React Query refresh) · Path: `features/github/github-stats-card.tsx`
- **Purpose** — Live GitHub metric card (followers, stars, top repo, language, contribution streak) for `/github`.
- **Props**
  ```ts
  type GithubStatsCardProps = { metric: { label: string; value: number | string; delta?: number; icon?: LucideIcon }; loading?: boolean };
  ```
- **Variants** — number stat / chart mini (uses [Progress](#progress) or chart colors) / repo highlight.
- **States** — loading (→ [Skeleton](#skeleton)), loaded, error (→ [EmptyState](#empty-state) inline), stale-while-revalidate.
- **Accessibility** — Values as text with `tabular-nums`; delta sign as text + icon not color alone; chart colors from chart-1..6 with labels; loading announced via `aria-busy`.
- **Responsive** — Dashboard grid 4→2→1; charts responsive width.
- **Animation** — Count-up on first paint; refresh fades updated value (`fast`). Reduced/saveData: final values, no count-up.

## Contact form
- **Meta** — Origin: custom (RHF + Zod + Server Action) · Render: Client (form) over RSC page · Path: `features/contact/contact-form.tsx`
- **Purpose** — Validated message form posting via Server Action (Resend email), one shared Zod schema.
- **Props**
  ```ts
  type ContactFormProps = { action: (data: ContactInput) => Promise<ContactResult>; defaultValues?: Partial<ContactInput> };
  // ContactInput = z.infer<typeof contactSchema>  (name, email, subject?, message, honeypot)
  ```
- **Variants** — full (subject select) / minimal; with/without consent checkbox (PII → privacy link).
- **States** — idle, validating, submitting (`aria-busy`, disabled), success (persistent inline + toast), error (error summary focused), field-level invalid.
- **Accessibility** — Labels + `autocomplete` + `inputmode`; `aria-invalid` + `aria-describedby`; error summary focused on submit + polite live region; persistent inline success (not toast-only); honeypot hidden from AT; consent links to `/privacy`; ≥44px controls.
- **Responsive** — Single column; sticky submit on mobile optional; 16px inputs (no iOS zoom).
- **Animation** — Field error fade-in; submit button loading; success check draw. Reduced: instant, opacity-only.

## Social links
- **Meta** — Origin: custom · Render: RSC · Path: `components/common/social-links.tsx`
- **Purpose** — Row of external profile links (GitHub, LinkedIn, X, email) with icons.
- **Props**
  ```ts
  type SocialLinksProps = { links: { label: string; href: string; icon: LucideIcon }[]; size?: 'sm' | 'md'; tone?: 'muted' | 'foreground' };
  ```
- **Variants** — icon-only (with tooltip/label) vs icon+label; footer vs inline tone.
- **States** — default, hover, focus.
- **Accessibility** — Each link has accessible name (`aria-label` for icon-only); external new-tab cue; ≥24px (≥44px footer touch); icons `aria-hidden`.
- **Responsive** — Wraps; spacing scales.
- **Animation** — Magnetic hover optional (see [MagneticButton](#magnetic-button)); icon color tween. Reduced: color only, no magnetic.

## Availability badge
- **Meta** — Origin: custom (composed on [Badge](#badge)) · Render: RSC · Path: `components/common/availability-badge.tsx`
- **Purpose** — Signals current availability (e.g., "Open to opportunities") in Header/About/Contact/Footer.
- **Props**
  ```ts
  type AvailabilityBadgeProps = { status: 'available' | 'limited' | 'unavailable'; label?: string };
  ```
- **Variants** — three statuses (success/warning/muted tokens) each with icon+text.
- **States** — static; optional pulsing dot.
- **Accessibility** — Status communicated by text label, not the dot color; pulsing dot `aria-hidden`.
- **Responsive** — Compact (dot only + tooltip) on mobile Header; full text elsewhere.
- **Animation** — Soft pulse on the dot (`ambient`). Reduced/saveData: static dot, no pulse.

---

# 4. Motion

Reusable motion wrappers and WebGL plumbing. All Client. Each names its reduced-motion fallback; content is always visible without JS. See motion division-of-labor in [creative-direction](./creative-direction.md).

## Reveal
- **Meta** — Origin: custom (Framer `m.*` via LazyMotion) · Render: Client · Path: `components/motion/reveal.tsx`
- **Purpose** — Generic on-scroll enter (fade + travel + optional blur) for any block.
- **Props**
  ```ts
  type RevealProps = React.PropsWithChildren<{ as?: ElementType; travel?: 'xs'|'sm'|'md'|'lg'|'hero'; blur?: boolean; delay?: number; once?: boolean; amount?: number }>;
  ```
- **Variants** — travel tokens (8/16/24/48/80); blur 6→0 optional.
- **States** — hidden (pre-view), entering, settled.
- **Accessibility** — Content present in DOM and visible if JS/animation disabled; purely visual; respects `data-motion`.
- **Responsive** — Reduced travel on small screens optional.
- **Animation** — `whileInView` opacity 0→1 + Y travel + optional blur (`base`, ease `out`). Reduced: renders settled immediately (no transform/opacity animation).

## Text reveal (line reveal)
- **Meta** — Origin: custom (Framer/GSAP SplitText-lite) · Render: Client · Path: `components/motion/text-reveal.tsx`
- **Purpose** — Reveal headings by clipped lines on scroll/load.
- **Props**
  ```ts
  type TextRevealProps = { as?: 'h1'|'h2'|'h3'|'p'; children: string; stagger?: 'tight'|'base'|'loose'; trigger?: 'mount'|'inView' };
  ```
- **Variants** — line clip-up; stagger speeds.
- **States** — masked (pre), revealing, done.
- **Accessibility** — Real text node remains selectable and exposed to AT (split is visual via spans with proper text); single semantic element; visible by default under reduced.
- **Responsive** — Re-splits on resize (debounced); line count adapts.
- **Animation** — Lines translateY 100%→0 within clip, staggered (`out-expo`). Reduced: plain visible text, no clip.

## Word reveal
- **Meta** — Origin: custom · Render: Client · Path: `components/motion/word-reveal.tsx`
- **Purpose** — Per-word staggered entrance for hero/taglines.
- **Props**
  ```ts
  type WordRevealProps = { children: string; as?: ElementType; stagger?: number; y?: number; trigger?: 'mount'|'inView' };
  ```
- **Variants** — fade-up words; configurable stagger/travel.
- **States** — hidden→entering→settled.
- **Accessibility** — Full string remains a coherent accessible label (spans don't break reading); visible default.
- **Responsive** — Wrapping handled; stagger caps on long strings.
- **Animation** — Words y+opacity staggered (`tight`/`base`). Reduced: static text.

## Character reveal
- **Meta** — Origin: custom · Render: Client · Path: `components/motion/character-reveal.tsx`
- **Purpose** — Per-character flourish for short display words/monogram moments (used sparingly).
- **Props**
  ```ts
  type CharacterRevealProps = { children: string; stagger?: number; effect?: 'rise' | 'flip' | 'fade' };
  ```
- **Variants** — rise / flip / fade.
- **States** — hidden→entering→settled.
- **Accessibility** — Provide `aria-label` of full word; per-char spans `aria-hidden` to avoid character-by-character SR readout; visible default.
- **Responsive** — Limited to short strings; disabled for long content.
- **Animation** — Char stagger (`tight 30ms`). Reduced: whole word visible instantly.

## Image reveal
- **Meta** — Origin: custom · Render: Client · Path: `components/motion/image-reveal.tsx`
- **Purpose** — Clip/scale reveal for media on scroll-in (covers, gallery, featured).
- **Props**
  ```ts
  type ImageRevealProps = { children: React.ReactNode /* next/image */; direction?: 'up'|'left'; scaleFrom?: number; once?: boolean };
  ```
- **Variants** — clip-up / clip-left; with subtle scale settle.
- **States** — masked, revealing, settled.
- **Accessibility** — Wraps an `<Image>` that keeps its `alt`; reserves dimensions (CLS-safe); decorative wrapper only.
- **Responsive** — Honors intrinsic aspect; reduces scale on mobile.
- **Animation** — Clip-path inset reveal + image scale `1.08→1` (`moderate`, ease out). Reduced: image shown immediately, no clip/scale.

## Parallax wrapper
- **Meta** — Origin: custom (GSAP ScrollTrigger scrub) · Render: Client · Path: `components/motion/parallax.tsx`
- **Purpose** — Depth via differential scroll translate for decorative layers/media.
- **Props**
  ```ts
  type ParallaxProps = React.PropsWithChildren<{ speed?: number; axis?: 'y' | 'x'; clamp?: boolean }>;
  ```
- **Variants** — vertical/horizontal; speed factor.
- **States** — bound to scroll progress (Lenis→ScrollTrigger).
- **Accessibility** — Decorative only; never moves essential/interactive content out of reach; `aria-hidden` on purely decorative layers.
- **Responsive** — Reduced speed on mobile; can disable below `md`.
- **Animation** — Scrubbed transform via single rAF (no jacking). Reduced: no transform (static).

## Magnetic button
- **Meta** — Origin: custom (Framer spring) · Render: Client · Path: `components/motion/magnetic-button.tsx`
- **Purpose** — Pointer-attracting wrapper for primary CTAs/logo/social icons (max 18px pull).
- **Props**
  ```ts
  type MagneticButtonProps = React.PropsWithChildren<{ strength?: number; max?: number; asChild?: boolean }>;
  ```
- **Variants** — strength/max distance.
- **States** — idle, attracting (pointer near), releasing (spring back).
- **Accessibility** — Pointer-only enhancement; keyboard focus/activation unaffected; underlying control fully operable; disabled on touch.
- **Responsive** — Disabled below pointer:fine; no effect on touch.
- **Animation** — Spring `magnetic (150/15/0.4)`, clamp `max 18px`, release to origin. Reduced/touch: no movement.

## Cursor follower
- **Meta** — Origin: custom · Render: Client (mounted once in shell) · Path: `components/motion/cursor-follower.tsx`
- **Purpose** — Custom cursor/blob that reacts to interactive targets (desktop fine-pointer only).
- **Props**
  ```ts
  type CursorFollowerProps = { enabled?: boolean; blendMode?: 'difference' | 'normal' };
  ```
- **Variants** — dot+ring / blob; hover-expand on links.
- **States** — default, hover-link (expand/label), pressed, hidden (touch/idle).
- **Accessibility** — Purely decorative, `aria-hidden`, `pointer-events:none`; native cursor preserved (never hidden in a way that harms usability); z-index `cursor 100`.
- **Responsive** — Mounted only for pointer:fine; absent on touch.
- **Animation** — Lerp follow (own rAF or Framer spring); scale on hover. Reduced/touch: not rendered.

## Scroll progress
- **Meta** — Origin: custom (Framer `useScroll`) · Render: Client · Path: `components/motion/scroll-progress.tsx`
- **Purpose** — Top reading-progress bar (global page + article).
- **Props**
  ```ts
  type ScrollProgressProps = { target?: 'page' | 'article'; height?: number; color?: string };
  ```
- **Variants** — page-level (in shell) / article-scoped (blog/research).
- **States** — 0→100% bound to scroll.
- **Accessibility** — Decorative `aria-hidden` (progress is supplemental); does not trap focus; thin and non-obscuring under sticky header.
- **Responsive** — Full width; height scales.
- **Animation** — `scaleX` bound to scroll, smoothed via Lenis. Reduced: still tracks scroll but without spring smoothing (instant).

## Page transition
- **Meta** — Origin: custom (Framer `AnimatePresence` + template) · Render: Client · Path: `components/motion/page-transition.tsx` (+ `app/template.tsx`)
- **Purpose** — Curtain/fade between route changes without blocking content/SEO.
- **Props**
  ```ts
  type PageTransitionProps = React.PropsWithChildren<{ variant?: 'fade' | 'curtain' }>;
  ```
- **Variants** — fade / signature curtain (azure→teal sweep).
- **States** — exiting, entering, settled.
- **Accessibility** — Content is RSC/SSG and present regardless; on route change focus → `#main-content` + polite announce; transition never delays interactivity meaningfully; respects reduced.
- **Responsive** — Same behavior; curtain timing constant.
- **Animation** — Overlay sweep / cross-fade (`base`–`moderate`, exit `0.7x`). Reduced: instant swap, no curtain.

## Animated grid
- **Meta** — Origin: custom (Framer `layout` + stagger) · Render: Client · Path: `components/motion/animated-grid.tsx`
- **Purpose** — Stagger-reveal and layout-animate grid children (projects, gallery, cards).
- **Props**
  ```ts
  type AnimatedGridProps = React.PropsWithChildren<{ stagger?: 'tight'|'base'|'loose'; columns?: GridProps['cols']; layout?: boolean }>;
  ```
- **Variants** — reveal-only / layout-animated (filtering/sorting).
- **States** — initial reveal, reflow (add/remove/reorder).
- **Accessibility** — Visual layer over a semantic [Grid](#grid); reading order from DOM; focus preserved across reflow.
- **Responsive** — Inherits Grid responsiveness; stagger caps on large sets.
- **Animation** — Child stagger-in; `layout` spring on reflow. Reduced: instant, no stagger/layout animation.

## Animated background
- **Meta** — Origin: custom (CSS/Canvas/R3F-lite) · Render: Client · Path: `components/motion/animated-background.tsx`
- **Purpose** — Ambient decorative backdrop (gradient mesh / aurora / noise) behind sections (About aurora, etc.).
- **Props**
  ```ts
  type AnimatedBackgroundProps = { variant?: 'aurora' | 'gradient-mesh' | 'grid-lines' | 'noise'; intensity?: number };
  ```
- **Variants** — aurora / gradient-mesh / grid-lines / noise.
- **States** — animating, paused (offscreen).
- **Accessibility** — Decorative `aria-hidden`; sits behind content; maintains text contrast over it (contrast measured vs painted bg).
- **Responsive** — Simplifies on mobile; lower intensity.
- **Animation** — Slow ambient drift (`ambient 1200+`). Reduced/saveData: static gradient still, no drift.

## Floating orb
- **Meta** — Origin: custom · Render: Client · Path: `components/motion/floating-orb.tsx`
- **Purpose** — Soft glowing decorative orb(s) for depth accents (glow via emissive/sprite, no postprocessing in v1).
- **Props**
  ```ts
  type FloatingOrbProps = { size?: number; color?: string; blur?: number; range?: number; duration?: number };
  ```
- **Variants** — single / cluster; color from glow/accent tokens.
- **States** — drifting, paused offscreen.
- **Accessibility** — Decorative `aria-hidden`; never overlaps interactive targets; excluded from contrast (glow).
- **Responsive** — Fewer/smaller on mobile.
- **Animation** — Gentle float loop (`ambient`, ease inout). Reduced/saveData: static.

## Particle field
- **Meta** — Origin: custom (R3F instanced + curl-noise shader) · Render: Client (via Canvas wrapper) · Path: `three/particle-field.tsx`
- **Purpose** — The hero "Signal Field" GPU particle system (and constellation accents).
- **Props**
  ```ts
  type ParticleFieldProps = { count?: number; speed?: number; pointer?: boolean; tier?: 'low' | 'mid' | 'high' };
  ```
- **Variants** — density/tier presets; pointer-reactive on/off; constellation mode (GitHub).
- **States** — running (`frameloop="demand"`), paused (IntersectionObserver), disposed (unmount).
- **Accessibility** — Inside an `aria-hidden`, `tabindex=-1` canvas; never the LCP (poster is); not present under reduced/no-WebGL/low-tier.
- **Responsive** — `count`/DPR clamp `[1,1.75]` scale by tier; reduced on mobile.
- **Animation** — Curl-noise vertex displacement, pointer parallax. Reduced/no-WebGL: replaced by static poster image.

## Three.js canvas wrapper
- **Meta** — Origin: custom · Render: Client (dynamic `ssr:false`, mounted once) · Path: `three/canvas-root.tsx` (+ `tunnel-rat` portal)
- **Purpose** — Single persistent `<Canvas>` host with performance governance; scenes portal in via tunnel-rat.
- **Props**
  ```ts
  type CanvasRootProps = { children?: React.ReactNode };
  // internally: frameloop="demand", dpr=[1,1.75], <PerformanceMonitor/>, IntersectionObserver pause
  ```
- **Variants** — active (WebGL) vs not-mounted (poster path).
- **States** — idle/demand-render, downgraded (PerformanceMonitor), paused (offscreen), disposed (unmount).
- **Accessibility** — Canvas `aria-hidden` + `tabindex=-1`; guarantees a static-poster fallback for device-tier/no-WebGL/reduced-motion; never ships three to routes that don't use it; never the LCP.
- **Responsive** — DPR clamp + tier-based scene selection; pauses when offscreen.
- **Animation** — Drives all R3F scenes via the single shared rAF (gsap.ticker→lenis.raf). Reduced/no-WebGL: not mounted; poster shown.

---

# 5. Utility

Cross-cutting helpers, content rendering, and stateful UX utilities.

## SEO helper
- **Meta** — Origin: custom · Render: RSC (build/runtime metadata) · Path: `lib/seo.ts` + `components/utility/json-ld.tsx`
- **Purpose** — Centralized metadata + typed JSON-LD generation (Person, WebSite, ProfilePage, CreativeWork, BlogPosting, ScholarlyArticle, BreadcrumbList).
- **Props**
  ```ts
  function buildMetadata(input: SeoInput): Metadata; // title template, canonical, OG, noindex guard
  type JsonLdProps<T> = { schema: T /* schema-dts typed */ };
  ```
- **Variants** — per content type schema; OG image co-located per route.
- **States** — n/a (data transform/render).
- **Accessibility** — Indirect: ensures correct titles/landmark metadata; non-prod global `noindex` guard.
- **Responsive** — n/a.
- **Animation** — None.

## MDX components (registry)
- **Meta** — Origin: custom · Render: RSC (with Client islands for interactive MDX) · Path: `mdx/mdx-components.tsx`
- **Purpose** — Map MDX elements to themed components (headings with anchors, links→[ExternalLink](#external-link), `pre`→[CodeBlock](#code-block), callouts, images, tables).
- **Props**
  ```ts
  function useMDXComponents(components: MDXComponents): MDXComponents;
  // overrides: h1..h6, a, pre, code, img, table, blockquote, Callout, Figure, Video
  ```
- **Variants** — prose elements + custom blocks (Callout, Figure).
- **States** — static content; interactive blocks manage own state.
- **Accessibility** — Heading anchors keyboard-reachable with labels; images require `alt` (enforced); tables get scope/caption; prose measure 65–72ch; links external-flagged.
- **Responsive** — Prose container 720; tables scroll on overflow with shadow affordance.
- **Animation** — Optional reveal on long-form blocks; none by default. Reduced: static.

## Error boundary
- **Meta** — Origin: custom (Next `error.tsx`) · Render: Client (error boundaries are Client) · Path: `app/error.tsx` + `app/global-error.tsx` + `components/utility/error-boundary.tsx`
- **Purpose** — Catch render errors, show recovery UI with reset, log to telemetry.
- **Props**
  ```ts
  type ErrorProps = { error: Error & { digest?: string }; reset: () => void };
  ```
- **Variants** — segment-level / global; with/without details (dev only).
- **States** — error shown, resetting.
- **Accessibility** — Focus moves to error heading; clear text + actionable reset/Home buttons; not color-alone; polite live announce.
- **Responsive** — Centered, comfortable on all sizes.
- **Animation** — Gentle fade-in only. Reduced: instant.

## Loading state
- **Meta** — Origin: custom (Next `loading.tsx`) · Render: RSC · Path: `app/loading.tsx` + per-segment `loading.tsx` + `components/utility/loading-state.tsx`
- **Purpose** — Route-level suspense skeletons (global + per-route) protecting CLS.
- **Props**
  ```ts
  type LoadingStateProps = { variant?: 'page' | 'grid' | 'article' | 'dashboard'; rows?: number };
  ```
- **Variants** — page / grid / article / dashboard skeleton layouts.
- **States** — single (loading) → replaced by content.
- **Accessibility** — Region `aria-busy="true"` + polite "Loading…" announce; [Skeleton](#skeleton) parts `aria-hidden`; reserves layout (CLS ≤0.02).
- **Responsive** — Mirrors target route layout per breakpoint.
- **Animation** — Skeleton shimmer (CSS). Reduced/saveData: static skeletons.

## Empty state
- **Meta** — Origin: custom · Render: RSC · Path: `components/utility/empty-state.tsx`
- **Purpose** — Friendly placeholder when a collection/filter/search yields nothing (or data fetch is empty).
- **Props**
  ```ts
  type EmptyStateProps = { icon?: LucideIcon; title: string; description?: string; action?: { label: string; href?: string; onClick?: () => void } };
  ```
- **Variants** — generic / filtered-no-results / error-empty (GitHub/OSS); with/without action.
- **States** — static.
- **Accessibility** — Heading + descriptive text; action is real button/link; icon decorative; announced when it replaces results (live region in parent).
- **Responsive** — Centered, padding scales.
- **Animation** — Fade/scale-in. Reduced: static.

## Not found state
- **Meta** — Origin: custom (Next `not-found.tsx`) · Render: RSC · Path: `app/not-found.tsx` + `components/utility/not-found-state.tsx`
- **Purpose** — Branded 404 with navigation back to key routes + search/command hint.
- **Props**
  ```ts
  type NotFoundStateProps = { title?: string; description?: string; suggestions?: { label: string; href: string }[] };
  ```
- **Variants** — global 404 / nested resource missing (project/blog/research).
- **States** — static.
- **Accessibility** — Single `<h1>`; clear links; `Cmd+K` hint operable; correct 404 status; compact Footer.
- **Responsive** — Centered hero layout; suggestions stack on mobile.
- **Animation** — Subtle hero reveal, optional small WebGL accent (poster fallback). Reduced: static.

## Theme toggle
- **Meta** — Origin: custom (next-themes) · Render: Client · Path: `components/common/theme-toggle.tsx`
- **Purpose** — Switch light/dark (dark default), in Header / command palette / footer.
- **Props**
  ```ts
  type ThemeToggleProps = { variant?: 'icon' | 'switch' | 'segmented'; align?: 'start' | 'end' };
  ```
- **Variants** — icon button / switch / segmented (Light·Dark·System).
- **States** — light, dark, system; hover, focus; hydration-safe (no flash via `suppressHydrationWarning` + script).
- **Accessibility** — Real button/switch with `aria-label`/`aria-pressed` or radiogroup for segmented; reflects resolved theme; keyboard operable; not color-alone (icon changes).
- **Responsive** — Icon-only in compact Header; segmented in settings/footer.
- **Animation** — Icon crossfade/rotate (sun/moon) `fast`. Reduced: instant icon swap.

## Copy button
- **Meta** — Origin: custom · Render: Client · Path: `components/common/copy-button.tsx`
- **Purpose** — Copy text/code/credential to clipboard with confirmation.
- **Props**
  ```ts
  type CopyButtonProps = { value: string; label?: string; size?: 'sm' | 'icon'; onCopied?: () => void };
  ```
- **Variants** — icon-only / labeled; inline (code header) / standalone.
- **States** — idle, copied (✓ + timeout reset), error.
- **Accessibility** — Button with `aria-label`; success announced via polite live region (not icon-only); keyboard operable; ≥24px.
- **Responsive** — Sits in code/cred headers; spacing scales.
- **Animation** — Icon swap copy→check (`fast`); brief scale. Reduced: instant icon swap.

## Code block
- **Meta** — Origin: custom (Shiki dual-theme, build-time) · Render: RSC (highlight) + Client header (copy) · Path: `components/common/code-block.tsx`
- **Purpose** — Syntax-highlighted code with language label, line numbers, copy, optional line highlights.
- **Props**
  ```ts
  type CodeBlockProps = { code: string; lang: string; filename?: string; highlightLines?: number[]; showLineNumbers?: boolean };
  ```
- **Variants** — with/without filename header; with/without line numbers; diff highlighting.
- **States** — static; copy state via [CopyButton](#copy-button).
- **Accessibility** — `<pre><code>` with language label as text; horizontal scroll keyboard-reachable; semantic syntax colors meet contrast vs surface; copy success announced.
- **Responsive** — Horizontal scroll with edge-fade affordance; font scales (`code 0.875rem`).
- **Animation** — None (content stable). Reduced: n/a.

## External link
- **Meta** — Origin: custom · Render: RSC · Path: `components/common/external-link.tsx`
- **Purpose** — Anchor for offsite URLs with new-tab semantics, security rel, and visible+SR cue.
- **Props**
  ```ts
  type ExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
    { href: string; showIcon?: boolean; newTab?: boolean };
  ```
- **Variants** — inline (with arrow/up-right icon) / button-styled; with/without new-tab.
- **States** — default, hover (icon nudge), focus, visited.
- **Accessibility** — `rel="noopener noreferrer"` when `target="_blank"`; "(opens in new tab)" SR text; icon decorative; discernible link text (no bare "click here").
- **Responsive** — Inline wraps with text; icon stays attached.
- **Animation** — Hover icon translate (2px up-right), underline grow. Reduced: color/underline only, no translate.

---

## Appendix A — Origin & render-mode matrix

| Component | Origin | Render |
| --- | --- | --- |
| Button, Badge, Card, Skeleton, Separator | shadcn-extended / shadcn | RSC |
| Input, Textarea | shadcn-extended | Client |
| Select, Dialog, Sheet, Tooltip, Tabs, Accordion, Dropdown, Command | shadcn (Radix/cmdk) | Client |
| Avatar | shadcn (Radix) | RSC + Client fallback |
| Toast (sonner), Progress | sonner / shadcn | Client |
| Container, Section, Grid, Stack, Section header | custom | RSC |
| Page shell, Page header | custom | Hybrid |
| Header, Mobile menu | custom | Client |
| Footer | custom | RSC |
| Project/Blog/Research/Experience/Certificate/Achievement cards, Tech stack | custom | RSC |
| Featured project, Project grid, Gallery item, GitHub stats card | custom | Hybrid |
| Project metrics, Contact form | custom | Client (SSR-safe values) |
| Hero, Blog content layout | custom | Hybrid |
| Social links, Availability badge, External link, Code block | custom | RSC (Client islands where noted) |
| All Motion (Reveal…Canvas wrapper) | custom | Client |
| Theme toggle, Copy button, Error boundary | custom | Client |
| SEO helper, MDX components, Loading/Empty/Not-found state | custom | RSC |

## Appendix B — Reduced-motion fallback summary

Every motion-bearing component degrades to a **content-visible, static** state under the single motion gate (`prefers-reduced-motion` OR in-app toggle OR `saveData`):

- Reveal/TextReveal/WordReveal/CharacterReveal/ImageReveal → render settled immediately, no transform/clip.
- Parallax/Floating orb/Animated background/Particle field/Canvas → static (no transform; WebGL not mounted, poster shown).
- Magnetic button/Cursor follower → no movement / not rendered (also disabled on touch).
- Page transition → instant route swap.
- Count-ups (Project metrics, GitHub stats) → final values rendered.
- Skeleton/Loading shimmer → static fill.

See [creative-direction](./creative-direction.md) and [design-system](./design-system.md) for the canonical motion tokens, reduced-motion architecture, and token values referenced throughout.

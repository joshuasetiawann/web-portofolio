# Design Tokens

> The complete, implementation-ready token catalog — every color, type, space, radius, shadow, border, blur, z-index, motion, breakpoint, container, grid, and component-state value as CSS-custom-property + Tailwind v4 `@theme`-ready tables.

This is the **source of truth for values**. For the reasoning and usage rules behind them, see [design-system](./design-system.md) and [typography-system](./typography-system.md). The stack mandates **TailwindCSS v4 (CSS-first `@theme`, no `tailwind.config.js`)**, so tokens are authored as CSS custom properties and exposed to Tailwind via `@theme`.

**Conventions:** Hex values are locked — never invent new ones. Tokens marked *(themed)* have distinct dark/light values; all others are theme-invariant. Dark is the default and lives on `:root`; light overrides under a `.light` (or `[data-theme="light"]`) scope.

---

## Color Tokens — Dark (default) & Light

### Foundation, surfaces & foreground *(themed)*

| Token | Tailwind utility root | Dark | Light |
|---|---|---|---|
| `--background` | `bg-background` | `#05070D` | `#F7F8FB` |
| `--surface-1` | `bg-surface-1` | `#0A0D16` | `#FFFFFF` |
| `--surface-2` | `bg-surface-2` | `#10131F` | `#F1F3F8` |
| `--surface-3` | `bg-surface-3` | `#171B2A` | `#E8EBF2` |
| `--foreground` | `text-foreground` | `#EAEDF5` | `#11141C` |
| `--foreground-muted` | `text-foreground-muted` | `#A4ABBD` | `#4A5160` |
| `--foreground-subtle` | `text-foreground-subtle` | `#687085` | `#767D8D` |

### Brand, action & state *(themed)*

| Token | Tailwind utility root | Dark | Light |
|---|---|---|---|
| `--primary` | `bg-primary` / `text-primary` | `#5E8BFF` | `#3D5BE0` |
| `--primary-foreground` | `text-primary-foreground` | `#05070D` | `#FFFFFF` |
| `--secondary` | `bg-secondary` | `#10131F` | `#F1F3F8` |
| `--secondary-foreground` | `text-secondary-foreground` | `#EAEDF5` | `#11141C` |
| `--accent` *(brand teal)* | `bg-brand-accent` | `#38E8C8` | `#0FA98C` |
| `--accent-foreground` | `text-brand-accent-foreground` | `#04130F` | `#FFFFFF` |
| `--muted` | `text-muted` | `#687085` | `#767D8D` |
| `--border` | `border-border` | `#222838` | `#DFE3EC` |
| `--border-strong` | `border-border-strong` | `#2E3548` | `#C7CDDA` |
| `--ring` | `ring-ring` / `outline` | `#5E8BFF` | `#3D5BE0` |
| `--success` | `text-success` | `#3DD68C` | `#1F9D5C` |
| `--warning` | `text-warning` | `#F5B544` | `#B7791F` |
| `--destructive` | `text-destructive` | `#FF6B6B` | `#DC4B4B` |
| `--info` | `text-info` | `#38BDF8` | `#0EA5E9` |
| `--glow` | — (shadow source) | `#6E9BFF` | `#9AB2FF` |

### Code syntax (Shiki, semantic dark) *(theme-invariant base; light variant via Shiki dual-theme)*

| Token | Scope | Value |
|---|---|---|
| `--code-keyword` | keyword | `#5E8BFF` |
| `--code-function` | function | `#38E8C8` |
| `--code-string` | string | `#3DD68C` |
| `--code-number` | number | `#F5B544` |
| `--code-comment` | comment | `#687085` |
| `--code-variable` | variable | `#EAEDF5` |
| `--code-operator` | operator | `#A4ABBD` |
| `--code-type` | class / type | `#A78BFA` |
| `--code-tag` | tag | `#FF6B6B` |

### Chart & contribution heat

| Token | Value | Token | Value |
|---|---|---|---|
| `--chart-1` | `#5E8BFF` | `--chart-4` | `#F5B544` |
| `--chart-2` | `#38E8C8` | `--chart-5` | `#FF6B6B` |
| `--chart-3` | `#A78BFA` | `--chart-6` | `#3DD68C` |

| Contribution heat (dark), low → high | Value |
|---|---|
| `--heat-0` (empty) | `#10131F` |
| `--heat-1` | `#1F3A5F` |
| `--heat-2` | `#2F6FB0` |
| `--heat-3` | `#4F9BFF` |
| `--heat-4` | `#8FC2FF` |

### Gradients & glow

| Token | Value |
|---|---|
| `--gradient-accent` | `linear-gradient(135deg, #5E8BFF, #38E8C8)` |
| `--gradient-surface` | `linear-gradient(180deg, var(--surface-1), var(--background))` |
| `--glow-accent` (dark) | `0 0 0 1px rgb(56 232 200 / 0.12), 0 0 24px -4px rgb(110 155 255 / 0.45)` |

---

## Typography Tokens

### Font families

| Token | Value | Loading |
|---|---|---|
| `--font-display` | `"Space Grotesk", var(--font-sans)` | preloaded (variable) |
| `--font-sans` | `"Geist Sans", ui-sans-serif, system-ui, sans-serif` | preloaded (variable) |
| `--font-mono` | `"Geist Mono", ui-monospace, "SFMono-Regular", monospace` | lazy (variable) |

### Type scale (fluid, base 16px)

| Token | `font-size` | `line-height` | `letter-spacing` | Family / weight |
|---|---|---|---|---|
| `--text-display-2xl` | `clamp(3.5rem, 8vw, 7.5rem)` | `0.95` | `-0.03em` | display / 700 |
| `--text-display-xl` | `clamp(2.75rem, 5.5vw, 5rem)` | `1.0` | `-0.025em` | display / 600 |
| `--text-display-lg` | `clamp(2.25rem, 4vw, 3.5rem)` | `1.05` | `-0.02em` | display / 600 |
| `--text-h1` | `2.5rem` | `1.1` | `-0.02em` | display / 600 |
| `--text-h2` | `2rem` | `1.15` | `-0.01em` | display / 600 |
| `--text-h3` | `1.5rem` | `1.25` | `-0.005em` | sans / 600 |
| `--text-h4` | `1.25rem` | `1.3` | `0` | sans / 600 |
| `--text-body-lg` | `1.125rem` | `1.65` | `0` | sans / 400 |
| `--text-body` | `1rem` | `1.65` | `0` | sans / 400 |
| `--text-body-sm` | `0.875rem` | `1.6` | `0` | sans / 400 |
| `--text-caption` | `0.8125rem` | `1.5` | `0.01em` | sans / 400–500 |
| `--text-eyebrow` | `0.75rem` | `1.4` | `0.14em` | mono / 500 · uppercase |
| `--text-code` | `0.875rem` | `1.6` | `0` | mono / 400 |

### Font weights & numeric

| Token | Value |
|---|---|
| `--fw-regular` | `400` |
| `--fw-medium` | `500` |
| `--fw-semibold` | `600` |
| `--fw-bold` | `700` |
| `--measure` | `68ch` (range 65–72ch) |
| numeric | `font-variant-numeric: tabular-nums` (stats/dates/tables) |

---

## Spacing Scale

4px base. Tailwind v4 spacing maps 1 unit = 4px, so `space-N` ≈ `N × 4px`.

| Token | px | rem | Token | px | rem |
|---|---|---|---|---|---|
| `--space-1` | 4 | 0.25 | `--space-10` | 40 | 2.5 |
| `--space-2` | 8 | 0.5 | `--space-12` | 48 | 3 |
| `--space-3` | 12 | 0.75 | `--space-16` | 64 | 4 |
| `--space-4` | 16 | 1 | `--space-20` | 80 | 5 |
| `--space-5` | 20 | 1.25 | `--space-24` | 96 | 6 |
| `--space-6` | 24 | 1.5 | `--space-32` | 128 | 8 |
| `--space-8` | 32 | 2 | `--space-48` | 192 | 12 |

| Composite token | Value |
|---|---|
| `--section-y` | `clamp(6rem, 12vw, 12rem)` |
| `--gutter` | `clamp(1.25rem, 5vw, 4rem)` |

---

## Radius Tokens

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | `4px` | Chips, tags, kbd, inline code. |
| `--radius-sm` | `8px` | Inputs, small buttons, badges. |
| `--radius-md` | `12px` | **shadcn base** (`--radius`). Default cards, buttons, popovers. |
| `--radius-lg` | `16px` | Large cards, media, modals. |
| `--radius-xl` | `24px` | Feature panels, hero cards. |
| `--radius-2xl` | `32px` | Showcase containers, immersive blocks. |
| `--radius-full` | `9999px` | Pills, avatars, circular controls. |

---

## Shadow / Elevation Tokens *(dark; light re-tuned to lower alpha)*

| Token | Value | Pairs with |
|---|---|---|
| `--elev-1` | `0 1px 2px rgba(0,0,0,.4)` + inset top hairline `inset 0 1px 0 rgb(255 255 255 / 0.04)` | `--surface-1` |
| `--elev-2` | `0 4px 16px rgba(0,0,0,.45)` | `--surface-2` |
| `--elev-3` | `0 12px 40px rgba(0,0,0,.55)` | `--surface-3` |
| `--elev-4` | `0 24px 64px rgba(0,0,0,.6)` | `--surface-3` |

---

## Border Tokens

| Token | Value |
|---|---|
| `--border-width` | `1px` (default hairline) |
| `--border-width-strong` | `1px` using `--border-strong` color, or `2px` for emphasis |
| `--border-color` | `var(--border)` — `#222838` dark / `#DFE3EC` light |
| `--border-color-strong` | `var(--border-strong)` — `#2E3548` dark / `#C7CDDA` light |
| `--focus-outline-width` | `2px` (min, `:focus-visible`) |
| `--focus-outline-offset` | `2px` |

---

## Blur / Glass Tokens

| Token | Value | Use |
|---|---|---|
| `--blur-glass` | `12px` (`backdrop-filter: blur(12px)`) | Nav, cards, command palette, floating toolbars. |
| `--glass-bg-dark` | `rgb(16 19 31 / 0.72)` (surface-2 @72%) | Translucent glass fill (dark). |
| `--glass-bg-light` | `rgb(255 255 255 / 0.72)` | Translucent glass fill (light). |
| Glass fallback | solid `--surface-2` / `--surface-3`, no blur | Under `prefers-reduced-transparency` (mandatory). |

---

## Z-Index Tokens

| Token | Value | Layer |
|---|---|---|
| `--z-base` | `0` | Default flow. |
| `--z-raised` | `10` | Raised cards, hover lifts. |
| `--z-sticky-header` | `50` | Sticky nav. |
| `--z-dropdown` | `60` | Menus, mega-menu, select. |
| `--z-overlay` | `70` | Scrims / backdrops. |
| `--z-modal` | `80` | Dialogs, command palette. |
| `--z-toast` | `90` | Sonner toasts. |
| `--z-cursor` | `100` | Custom cursor / magnetic layer. |
| `--z-skip-link` | `110` | Skip-to-content (always topmost when focused). |

---

## Motion — Duration Tokens

Exit durations ≈ `0.7 ×` enter.

| Token | ms | Use |
|---|---|---|
| `--dur-instant` | `80` | Tap feedback, micro-toggles. |
| `--dur-fast` | `160` | Hover, focus, small state changes. |
| `--dur-base` | `280` | Default enter/exit, most transitions. |
| `--dur-moderate` | `420` | Cards, panels, layout shifts. |
| `--dur-slow` | `640` | Section reveals, larger choreography. |
| `--dur-cinematic` | `900` | Hero entrances, page curtains. |
| `--dur-ambient` | `1200+` | Looping ambient/3D motion. |

---

## Motion — Easing & Spring Tokens

| Token | `cubic-bezier` | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(.22, 1, .36, 1)` | Default enter; decelerate-in. |
| `--ease-out-expo` | `cubic-bezier(.16, 1, .3, 1)` | Pronounced reveals, hero. |
| `--ease-inout` | `cubic-bezier(.83, 0, .17, 1)` | Symmetric transitions, scrubs. |
| `--ease-back` | `cubic-bezier(.34, 1.56, .64, 1)` | Playful overshoot (chips, toggles). |

| Spring token | stiffness / damping / mass | Use |
|---|---|---|
| `--spring-snappy` | `420 / 32 / 0.8` | Quick, tight UI responses. |
| `--spring-soft` | `260 / 30 / 1` | Gentle panels, modals. |
| `--spring-layout` | `300 / 34 / 1` | Framer `layout`/`layoutId` shared transitions. |
| `--spring-magnetic` | `150 / 15 / 0.4` | Magnetic cursor/button pull. |

| Stagger token | Value | Reveal travel | Value |
|---|---|---|---|
| `--stagger-tight` | `30ms` | `--reveal-xs` | `8px` |
| `--stagger-base` | `60ms` | `--reveal-sm` | `16px` |
| `--stagger-loose` | `90ms` | `--reveal-md` | `24px` |
| `--reveal-blur` | `6px → 0` | `--reveal-lg` | `48px` |
| `--card-lift` | `-6px` | `--reveal-hero` | `80px` |
| `--magnetic-max` | `18px` | | |

> **Reduced motion:** When `data-motion="reduced"` (OS `prefers-reduced-motion` OR in-app toggle OR `saveData`), all of the above collapse to instant/static: Framer `reducedMotion="user"`, GSAP inside `gsap.matchMedia` (no pin/scrub), Lenis not instantiated, 3D → static poster.

---

## Breakpoint Tokens

| Token | Value | Note |
|---|---|---|
| `--bp-sm` | `640px` | Mobile-first base above this. |
| `--bp-md` | `768px` | Primary layout shift. |
| `--bp-lg` | `1024px` | 12-col grid engages. |
| `--bp-xl` | `1280px` | Content container max. |
| `--bp-2xl` | `1536px` | Widescreen ceiling. |

| Canonical QA frame | Width |
|---|---|
| mobile | `390px` |
| tablet | `834px` |
| desktop | `1440px` |

---

## Container Size Tokens

| Token | Max width | Use |
|---|---|---|
| `--container-content` | `1280px` | Default content. |
| `--container-wide` | `1440px` | Galleries, dashboards, immersive. |
| `--container-prose` | `720px` | Long-form reading (65–72ch). |
| `--container-gutter` | `clamp(1.25rem, 5vw, 4rem)` | Horizontal padding (all containers). |

---

## Grid Systems

| Context | Columns | Gutter |
|---|---|---|
| Desktop (`>= lg`) | `12` | `--space-6` (24px) |
| Tablet (`md`–`lg`) | `8` | `--space-5` (20px) |
| Mobile (`< md`) | `4` | `--space-4` (16px) |

| Token | Value |
|---|---|
| `--grid-cols-desktop` | `repeat(12, minmax(0, 1fr))` |
| `--grid-cols-tablet` | `repeat(8, minmax(0, 1fr))` |
| `--grid-cols-mobile` | `repeat(4, minmax(0, 1fr))` |

---

## Component States

State-layer conventions every interactive component inherits. Color tokens are themed (see top tables).

| State | Tokens / rules |
|---|---|
| **Default** | Surface per elevation (`--surface-1`…`-3`), `--border` hairline, `--foreground` text. |
| **Hover** | Surface steps up one level (e.g. `--surface-1` → `--surface-2`) or `+4–6%` lightness overlay; border → `--border-strong`; optional `--card-lift` (`-6px`) + `--elev-2`; `--dur-fast` `--ease-out`. |
| **Active / Pressed** | Brightness `-4%` / scale `0.98`; `--dur-instant`. |
| **Focus-visible** | `outline: 2px solid var(--ring)` + `2px` offset (never `box-shadow`-only); survives forced-colors; not obscured by sticky header (WCAG 2.4.11). |
| **Selected / Current** | `--primary` indicator (underline, left-bar, or fill); `aria-current`/`aria-selected` set. |
| **Disabled** | `opacity: 0.5`, `cursor: not-allowed`, `--foreground-subtle` text, no hover; `aria-disabled`. |
| **Loading** | Skeleton on `--surface-2` shimmer (reduced-motion → static), `aria-busy`; matches per-route `loading.tsx`. |
| **Error / Invalid** | `--destructive` border + icon + message; `aria-invalid` + `aria-describedby`; never color-only. |
| **Success** | `--success` indicator + icon; persistent inline confirmation + polite live region. |
| **Brand glow (interactive)** | `--glow-accent` box-shadow on hover/active for brand surfaces; dropped under reduced-motion/reduced-transparency; excluded from contrast checks. |
| **Min target size** | `>= 24 × 24px` (WCAG 2.5.8); primary touch targets `>= 44px`. |

---

## Tailwind v4 `@theme` Wiring (reference)

Tokens are exposed to Tailwind v4 via the CSS-first `@theme` block (no `tailwind.config.js`). Illustrative shape only — values come from the tables above:

```css
@theme {
  --color-background: #05070D;
  --color-surface-1: #0A0D16;
  --color-primary: #5E8BFF;
  --color-brand-accent: #38E8C8;
  /* …all color tokens… */

  --font-display: "Space Grotesk", var(--font-sans);
  --font-sans: "Geist Sans", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;

  --radius-md: 12px;
  --spacing: 0.25rem;            /* 4px base unit */

  --ease-out: cubic-bezier(.22, 1, .36, 1);
  --breakpoint-lg: 1024px;
  /* …etc… */
}

/* Dark is default on :root; light overrides under a scope */
:root { /* dark token values */ }
.light, [data-theme="light"] { /* light token overrides */ }
```

> shadcn semantic aliases (`--card`, `--popover`, `--muted`, `--accent` as hover-surface, `--destructive`, `--ring`, `--input`, `--radius`) are mapped in [design-system §7](./design-system.md#7-shadcnui-semantic-alias-mapping).

---

## Cross-References

- [Design System](./design-system.md) — usage rules, theming, shadcn mapping, depth language.
- [Typography System](./typography-system.md) — pairing rationale, prose/MDX rules, responsive type.
- [Information Architecture](./information-architecture.md) · [Navigation Structure](./navigation-structure.md) — where tokens apply.

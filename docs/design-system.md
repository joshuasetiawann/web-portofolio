# Design System

> The visual operating system for Joshua Setiawan's portfolio — an "Immersive Dark + 3D" language of color, surface, depth, and theming that every component inherits from.

This document is the authoritative narrative for **how the system behaves**: what each color means, when to reach for it, how surfaces stack into depth, and how the two themes resolve. For the raw, copy-paste token catalog see [design-tokens](./design-tokens.md); for the type scale and prose rules see [typography-system](./typography-system.md). It also implements the design layer described in the broader [information architecture](./information-architecture.md).

---

## 1. System Overview

| Principle | Statement |
|---|---|
| **Dark is the default** | The product ships dark-first. Light is a faithful inversion, never an afterthought. `next-themes` resolves the theme; `dark` is the default and the SSR baseline. |
| **Semantic, not literal** | Components never reference a hex. They consume a semantic token (`--primary`, `--surface-2`, `--border`). Swapping themes re-points the same tokens. |
| **Depth is earned, not painted** | Hierarchy comes from layered surfaces, hairline borders, and restrained shadow — not from heavy drop shadows or decorative gradients. |
| **One accent, used sparingly** | The azure `--primary` and teal `--accent` are the only chromatic voices. Everything else is a neutral on the slate ramp. Color is a signal, not a texture. |
| **Glow is identity, not emphasis** | The signature glow communicates "interactive / alive," not "important." It is excluded from all contrast measurements. |
| **Measured against the painted surface** | Every contrast decision is verified against the actual background a token sits on, with glow and translucency excluded. |

**Aesthetic anchors:** cinematic dark, editorial-meets-engineering, glass-like surfaces, sharp typography, restrained gradients, carefully placed 3D. The brand should read **intelligent, calm, precise, technical, creative, trustworthy, premium, future-facing**.

**Canonical rule:** Do not invent new hexes. Every value below is locked. New needs are met by composing existing tokens (opacity, layering, gradient stops), never by adding raw colors.

---

## 2. The Color System

The palette is a cool slate neutral ramp lit by a single **azure → teal** chromatic axis. Dark is authored first; light is the engineered inversion. Each token below carries a **usage rule** that is binding.

### 2.1 Foundation & Surfaces

The surface ramp is the spine of the depth system. Higher number = closer to the viewer = lighter in dark, and (subtly) more recessed/elevated in light.

| Token | Dark | Light | Usage rule |
|---|---|---|---|
| `--background` | `#05070D` | `#F7F8FB` | The page floor. The deepest plane; nothing sits behind it. Body background and the base of `--gradient-surface`. Never used for a raised element. |
| `--surface-1` | `#0A0D16` | `#FFFFFF` | First lift off the floor — section bands, the default card body, sidebars. The most common "container" surface. |
| `--surface-2` | `#10131F` | `#F1F3F8` | Second lift — nested cards, inputs, table headers, code-block chrome, popover bodies. Also the `--secondary` surface. |
| `--surface-3` | `#171B2A` | `#E8EBF2` | **Elevated** surface — modals, dropdown menus, command palette, hover-raised cards, tooltips. The top of the opaque stack; pair with `elev-3`/`elev-4`. |

> **Layering rule:** Never skip more than one surface step when nesting (a `surface-2` card may hold `surface-3` chips, not `background` insets). Never place a darker surface on top of a lighter one in dark mode — it reads as a hole, not a layer.

### 2.2 Text & Foreground

| Token | Dark | Light | Usage rule |
|---|---|---|---|
| `--foreground` | `#EAEDF5` | `#11141C` | Primary text, headings, high-emphasis icons. Default `color` of `<body>`. |
| `--foreground-muted` | `#A4ABBD` | `#4A5160` | Secondary text — descriptions, metadata, inactive nav, supporting copy. Must still clear AA on its surface. |
| `--foreground-subtle` | `#687085` | `#767D8D` | Tertiary text — captions, placeholders, disabled labels, timestamps. Use only where AA-large or non-essential. Note: identical value to `--muted`. |

> **Emphasis rule:** Three levels only. If you need a fourth, you need a different layout, not a fourth gray.

### 2.3 Brand — Primary (Azure)

| Token | Dark | Light | Usage rule |
|---|---|---|---|
| `--primary` | `#5E8BFF` | `#3D5BE0` | The brand action color. Primary buttons, active nav indicator, links, focus accents, selected states, chart series 1. The single most important chromatic decision on screen. |
| `--primary-foreground` | `#05070D` | `#FFFFFF` | Text/icons **on** a `--primary` fill. In dark this is near-black (azure is light); in light it is white (azure is saturated). Always pair as a unit. |

> **Scarcity rule:** At most one `--primary`-filled element competing for attention per viewport region. Everything else uses outline/ghost variants.

### 2.4 Secondary

| Token | Dark | Light | Usage rule |
|---|---|---|---|
| `--secondary` | `#10131F` | `#F1F3F8` | Low-emphasis button fills, tag/chip backgrounds, segmented controls. A tonal (not chromatic) action surface — mirrors `--surface-2`. |
| `--secondary-foreground` | `#EAEDF5` | `#11141C` | Text/icons on `--secondary`. Mirrors `--foreground`. |

### 2.5 Accent (Teal)

| Token | Dark | Light | Usage rule |
|---|---|---|---|
| `--accent` | `#38E8C8` | `#0FA98C` | The second chromatic voice — used for moments of delight and "live/creative" signaling: gradient terminus, success-adjacent highlights, hovered data points, the creative-work category, 3D emissive glow source. **Never** the primary CTA color. |
| `--accent-foreground` | `#04130F` | `#FFFFFF` | Text/icons on an `--accent` fill (near-black teal in dark; white in light). |

> **Two-voice rule:** `--primary` leads, `--accent` accompanies. Never use both as solid fills in the same component — one fills, the other becomes an outline, gradient, or glow.

### 2.6 Muted & Borders

| Token | Dark | Light | Usage rule |
|---|---|---|---|
| `--muted` | `#687085` | `#767D8D` | Muted **foreground** for shadcn `text-muted-foreground` — de-emphasized icons, disabled text, separators-as-text. Shares the value of `--foreground-subtle`. |
| `--border` | `#222838` | `#DFE3EC` | The default hairline — card edges, dividers, input outlines, table rules. The quiet workhorse of the depth system. |
| `--border-strong` | `#2E3548` | `#C7CDDA` | Emphasized separation — hovered/focused input borders, active card outlines, section dividers that must read clearly. |

> **Hairline rule:** Borders carry most of the depth in this system. Prefer a `1px` `--border` over a shadow whenever a single plane separation is all that's needed.

### 2.7 Ring (Focus)

| Token | Dark | Light | Usage rule |
|---|---|---|---|
| `--ring` | `#5E8BFF` | `#3D5BE0` | The keyboard-focus indicator color. Rendered as an **outline** (`>=2px` + offset) so it survives forced-colors. Tracks `--primary` so focus reads as "brand-active." |

> **Focus rule:** `:focus-visible` only, via `outline` (not `box-shadow`), `>=2px` with offset, never obscured by the sticky header (WCAG 2.4.11). See [accessibility budget in tokens](./design-tokens.md#component-states).

### 2.8 Status / Feedback

| Token | Dark | Light | Usage rule |
|---|---|---|---|
| `--success` | `#3DD68C` | `#1F9D5C` | Positive outcomes — form success, "live" project status, passing checks, contribution-positive deltas. |
| `--warning` | `#F5B544` | `#B7791F` | Caution — "wip" status, non-blocking validation hints, rate-limit notices. |
| `--destructive` | `#FF6B6B` | `#DC4B4B` | Errors and destructive actions — failed submits, `aria-invalid` fields, delete actions, "archived" emphasis. Maps to shadcn `--destructive`. |
| `--info` | `#38BDF8` | `#0EA5E9` | Neutral information — tips, toasts, "preprint" badges, in-progress notices. |

> **Never color alone:** Every status pairing must carry a non-color cue — icon, label, or shape (WCAG 1.4.1). A red border is never the only signal of an error.

### 2.9 Glow

| Token | Dark | Light | Usage rule |
|---|---|---|---|
| `--glow` | `#6E9BFF` | `#9AB2FF` | The light-source color for the glow effect — a brighter azure than `--primary`. Drives `--glow-accent` and 3D emissive bloom. |

```css
/* Dark glow composite — applied as box-shadow on interactive/elevated brand surfaces */
--glow-accent: 0 0 0 1px rgb(56 232 200 / 0.12), 0 0 24px -4px rgb(110 155 255 / 0.45);
```

> **Glow rules:** (1) Glow signals "interactive / alive," not "important." (2) Glow is **excluded from every contrast calculation** — measure text against the solid surface beneath it. (3) Glow is motion-adjacent: reduce its intensity (or drop it) under `prefers-reduced-motion` / `prefers-reduced-transparency`.

### 2.10 Code Syntax (Shiki, semantic dark)

Dual-theme Shiki tokens, authored from the same palette so code blocks feel native to the system rather than imported.

| Scope | Color | Usage rule |
|---|---|---|
| keyword | `#5E8BFF` | `import`, `const`, control flow — the azure brand thread runs through code. |
| function | `#38E8C8` | Function/method names and calls — teal accent for "the verbs." |
| string | `#3DD68C` | String literals — shares the success green. |
| number | `#F5B544` | Numeric & boolean literals — shares the warning amber. |
| comment | `#687085` | Comments — the subtle gray; intentionally quiet. |
| variable | `#EAEDF5` | Identifiers/variables — the foreground default. |
| operator | `#A4ABBD` | Operators & punctuation — the muted foreground. |
| class / type | `#A78BFA` | Class names, types, constructors — violet, the lone palette extension reserved for type-space. |
| tag | `#FF6B6B` | JSX/HTML tags — shares the destructive coral. |

> **Code rule:** The code-block chrome sits on `--surface-2`; verify each token clears AA against `#10131F` (dark) / `#F1F3F8` (light).

### 2.11 Chart (Categorical) & Contribution Heat

For the GitHub Dashboard and any categorical data viz. Ordered for maximum adjacent-hue separation.

| Token | Color | Default mapping |
|---|---|---|
| `--chart-1` | `#5E8BFF` | Primary series / first language |
| `--chart-2` | `#38E8C8` | Second series |
| `--chart-3` | `#A78BFA` | Third series |
| `--chart-4` | `#F5B544` | Fourth series |
| `--chart-5` | `#FF6B6B` | Fifth series |
| `--chart-6` | `#3DD68C` | Sixth series |

**Contribution heat ramp (dark), low → high density:**

`#10131F` → `#1F3A5F` → `#2F6FB0` → `#4F9BFF` → `#8FC2FF`

> **Chart rules:** (1) Always pair categorical color with a label/legend — never color-only encoding. (2) The empty/zero cell of the heat ramp is `--surface-2` (`#10131F`), so empty days read as "surface," not "data." (3) Cap categorical use at 6 series; beyond that, group into "Other."

### 2.12 Gradients

| Token | Definition | Usage rule |
|---|---|---|
| `--gradient-accent` | `linear-gradient(135deg, #5E8BFF, #38E8C8)` | The **signature azure → teal sweep**. Reserved for identity moments: hero accents, key headings (as text clip), the active logo state, primary-CTA hover sheen, focus glow seeds. Use intentionally and rarely — overuse cheapens it. |
| `--gradient-surface` | `linear-gradient(180deg, var(--surface-1), var(--background))` | The ambient section wash — fades a surface band down into the page floor. Used for section transitions and the canvas backdrop. Purely atmospheric; never carries text contrast. |

> **Gradient restraint:** Two gradients exist on purpose. `--gradient-accent` is for brand; `--gradient-surface` is for atmosphere. No component should introduce a third.

---

## 3. Spacing Principles

A single **4px base** rhythm governs all spacing (`space-1` = 4px … `space-48` = 192px). See the full ladder in [design-tokens](./design-tokens.md#spacing-scale).

| Principle | Rule |
|---|---|
| **One scale, no magic numbers** | Every margin, padding, and gap is a token multiple of 4px. No `13px`, no `arbitrary` values except for optical 1px hairline alignment. |
| **Section rhythm is fluid** | Vertical section spacing uses `--section-y: clamp(6rem, 12vw, 12rem)` so breathing room scales with viewport without media queries. |
| **Gutter is fluid** | Page gutter is `clamp(1.25rem, 5vw, 4rem)` — 20px on a 390px phone, ~64px on a 1440px desktop. |
| **Density tiers** | Compact (controls/chips): 4–8px. Comfortable (cards/forms): 12–24px. Spacious (sections): 48–192px. Pick a tier per context and stay in it. |
| **Optical over mathematical** | Icon-to-label and inline rhythm may use the tighter end (`space-1`/`space-2`); structural rhythm uses the larger steps. |

---

## 4. Elevation, Glass, Glow & Depth Language

Depth is built in four stacked layers, applied in this order of preference: **surface → border → shadow → glow**. Reach for the lightest mechanism that achieves the separation.

### 4.1 Surface stacking (primary depth)
The 4-step surface ramp (§2.1) is the main depth cue. Each step is one "plane closer." Most UI never needs a shadow — a surface step plus a hairline border reads as elevation in the dark system.

### 4.2 Elevation / shadow (dark)
Shadows are deep and soft, tuned for a near-black floor. Each elevation pairs with a recommended surface.

| Token | Shadow | Pairs with | Used for |
|---|---|---|---|
| `elev-1` | `0 1px 2px rgba(0,0,0,.4)` + inset top hairline | `--surface-1` | Resting cards, inputs |
| `elev-2` | `0 4px 16px rgba(0,0,0,.45)` | `--surface-2` | Hovered cards, popovers, sticky nav |
| `elev-3` | `0 12px 40px rgba(0,0,0,.55)` | `--surface-3` | Dropdowns, command palette |
| `elev-4` | `0 24px 64px rgba(0,0,0,.6)` | `--surface-3` | Modals, dialogs, the highest overlays |

> The **inset top hairline** on `elev-1` simulates a light edge catching the top of a raised surface — a key part of the "crafted" feel. Light theme re-tunes these to softer, cooler shadows (lower alpha).

### 4.3 Glass (translucency)
Glass surfaces use `backdrop-blur: 12px` over a semi-opaque surface fill — applied to the nav bar, certain cards, and the command palette.

| Rule | Detail |
|---|---|
| **Where** | Sticky nav, command palette, floating toolbars, occasionally hovered media cards. |
| **Fallback** | Under `prefers-reduced-transparency`, glass resolves to a **solid** `--surface-2`/`--surface-3` fill (no blur). This is mandatory, not optional. |
| **Contrast** | Always measure text against the **solid fallback color**, never the translucent state. |

### 4.4 Glow (identity depth)
The `--glow-accent` composite (§2.9) adds a faint brand halo to interactive brand surfaces and 3D emissive elements. It is the top, most-restrained depth layer: it never replaces a border or shadow for separation, it only signals "alive." It dims or disappears under reduced-motion/reduced-transparency.

### 4.5 3D / WebGL depth
A single persistent `<Canvas>` (frameloop `demand`, DPR clamp `[1, 1.75]`) provides true parallax depth on select routes. It is **never the LCP element** and always degrades to a static poster under no-WebGL / low-tier / reduced-motion. The canvas backdrop uses `--gradient-surface`; emissive material color is seeded from `--accent` / `--glow`.

---

## 5. Grid & Layout

| Concept | Value | Rule |
|---|---|---|
| **Column grid** | 12 / 8 / 4 (desktop / tablet / mobile) | Content aligns to a 12-col grid ≥`lg`, 8-col on tablet, 4-col on mobile. |
| **Content container** | `1280px` max | Default page width for standard content. |
| **Wide container** | `1440px` max | Galleries, dashboards, immersive sections. |
| **Prose container** | `720px` max | Long-form reading (blog, research, MDX) — keeps measure at 65–72ch (see [typography](./typography-system.md)). |
| **Gutter** | `clamp(1.25rem, 5vw, 4rem)` | Fluid horizontal padding inside every container. |
| **Canonical frames** | mobile `390` · tablet `834` · desktop `1440` | Design/QA reference viewports. |
| **Breakpoints** | sm `640` · md `768` · lg `1024` · xl `1280` · 2xl `1536` | Mobile-first; layout shifts happen at `md` and `lg` primarily. |

> **CLS guard:** The grid and fluid clamps are designed so the layout never reflows on font load or theme switch — supporting the `CLS <= 0.02` budget. Media has explicit aspect ratios; fonts use `size-adjust`/fallback metrics.

---

## 6. Theming (next-themes, dark default)

| Decision | Detail |
|---|---|
| **Provider** | `next-themes` with `attribute="class"` (`.dark` on `<html>`), `defaultTheme="dark"`, `enableSystem`, and `disableTransitionOnChange` to avoid a flash of color-transition on toggle. |
| **Default** | **Dark.** The SSR-rendered HTML is dark; the no-JS experience is dark. A blocking inline script reads storage/system before paint to prevent FOUC. |
| **Mechanism** | All tokens are CSS custom properties declared on `:root` (dark) and overridden under a `.light`/`[data-theme="light"]` scope (or vice-versa per implementation). Components reference only the semantic variables, so theme switching never touches component code. |
| **Toggle** | Accessible theme toggle in the primary nav (system / light / dark), labeled, keyboard-operable, with `aria-pressed`/`aria-label`. |
| **Reduced-motion coupling** | The motion gate (`data-motion` on `<html>`) is independent of theme but composes with it — a reduced-motion + dark session simply drops glow/blur intensity while keeping the dark palette. |
| **Forced colors** | Under `forced-colors: active`, decorative tokens defer to system colors; structure relies on borders + outline focus (already the system default), so the UI stays legible. |

---

## 7. shadcn/ui Semantic Alias Mapping

shadcn/ui consumes a fixed set of semantic CSS variables. Below is the **authoritative mapping** from our token system to shadcn's expected aliases. Define these in the global stylesheet; install shadcn components unchanged.

| shadcn variable | Dark source | Light source | Notes |
|---|---|---|---|
| `--background` | `#05070D` | `#F7F8FB` | Page floor (1:1 with our `--background`). |
| `--foreground` | `#EAEDF5` | `#11141C` | Default text. |
| `--card` | `#0A0D16` (`--surface-1`) | `#FFFFFF` | Card body surface. |
| `--card-foreground` | `#EAEDF5` | `#11141C` | Text on cards. |
| `--popover` | `#171B2A` (`--surface-3`) | `#E8EBF2` | Popover/dropdown/command-palette body — uses the **elevated** surface, not the card surface. |
| `--popover-foreground` | `#EAEDF5` | `#11141C` | Text on popovers. |
| `--primary` | `#5E8BFF` | `#3D5BE0` | Brand action. |
| `--primary-foreground` | `#05070D` | `#FFFFFF` | On-primary text. |
| `--secondary` | `#10131F` (`--surface-2`) | `#F1F3F8` | Tonal action surface. |
| `--secondary-foreground` | `#EAEDF5` | `#11141C` | On-secondary text. |
| `--muted` | `#10131F` (`--surface-2`) | `#F1F3F8` | Muted **surface** (e.g. `bg-muted`). |
| `--muted-foreground` | `#687085` (`--muted`) | `#767D8D` | Muted **text** (`text-muted-foreground`). |
| `--accent` | `#171B2A` (`--surface-3`) | `#E8EBF2` | shadcn `--accent` is the **hover/selected surface** (e.g. menu-item hover), **not** our chromatic teal. The teal lives in a separate `--brand-accent` token to avoid collision. |
| `--accent-foreground` | `#EAEDF5` | `#11141C` | Text on the hover surface. |
| `--destructive` | `#FF6B6B` | `#DC4B4B` | Destructive action/error. |
| `--destructive-foreground` | `#05070D` | `#FFFFFF` | On-destructive text. |
| `--border` | `#222838` | `#DFE3EC` | Component borders. |
| `--input` | `#222838` (`--border`) | `#DFE3EC` | Input border (shadcn separates `--input` from `--border`). |
| `--ring` | `#5E8BFF` | `#3D5BE0` | Focus ring. |
| `--radius` | `0.75rem` (`12px`, `radius-md`) | same | shadcn base radius; component radii derive from it. |
| `--chart-1`…`--chart-6` | see §2.11 | light variants | Recharts/chart series. |

> **Critical collision note:** shadcn's `--accent` means "interactive hover surface," which conflicts with our **chromatic teal accent**. Resolve by mapping shadcn `--accent` to `--surface-3` (the hover surface) and exposing the teal separately as `--brand-accent: #38E8C8`. Document this in code comments so future contributors don't repaint hover states teal.

---

## 8. Cross-References

- [Design Tokens](./design-tokens.md) — the complete, implementation-ready token catalog (CSS custom properties + Tailwind v4 `@theme`).
- [Typography System](./typography-system.md) — fonts, scale, line-height, prose/MDX rules.
- [Information Architecture](./information-architecture.md) — page/route structure this system styles.
- [Navigation Structure](./navigation-structure.md) — the nav model these surfaces and glass tokens render.

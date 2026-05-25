# Typography System

> The type voice of the portfolio — a three-family system (Space Grotesk · Geist Sans · Geist Mono) tuned for editorial display, comfortable reading, and technical precision.

This document defines the typefaces, the fluid scale, line-height and tracking rules, weight discipline, responsive behavior, and MDX/prose styling. For the color and surface language see [design-system](./design-system.md); for the raw token tables see [design-tokens](./design-tokens.md).

---

## 1. Typeface Roster & Pairing Rationale

| Role | Family | Loading | Used for |
|---|---|---|---|
| **Display** | **Space Grotesk** (variable) | `next/font/google`, **preloaded** | All headings `h2` and larger, hero display, eyebrow-adjacent display moments. |
| **Body / UI** | **Geist Sans** (variable) | `next/font/google`, **preloaded** | Body copy, UI labels, buttons, nav, `h3`/`h4` (Geist 600), forms. |
| **Mono** | **Geist Mono** (variable) | `next/font/google`, **lazy** | Code, eyebrows, technical labels, stats, metadata, kbd. |

### Pairing rationale
- **Space Grotesk** is a geometric grotesk with engineered, slightly mechanical detailing (the distinctive `a`, `g`, and tightened apertures). It reads as *technical + editorial* — exactly the "creative developer / software engineer" hybrid the brand targets. It carries character at display sizes where a neutral grotesk would feel generic.
- **Geist Sans** (Vercel's UI typeface) is a clean, highly legible neutral sans engineered for screens and small sizes. It recedes so the content leads, and it shares a structural DNA with Space Grotesk (humanist-tinged geometric), so the families *harmonize* rather than clash.
- **Geist Mono** is the natural technical companion — its mono rhythm signals "engineering" in eyebrows, labels, and code, and it sits in the same type family as the body for visual cohesion.
- **Why three, not two:** display vs. body gives editorial contrast; mono adds the "engineering" register the positioning requires. The hard rule below keeps it disciplined.

> **License-pending upgrade — Assumption:** *Clash Display* is an opt-in replacement for the **display** face only (a sharper, more fashion-editorial alternative), pending license clearance. The body/mono pairing and the entire scale stay identical, so the swap is a single `--font-display` re-point with no layout change.

> **Hard rule:** **Max two type families visible per viewport.** In practice: Space Grotesk (display) + Geist Sans (body) on most screens; mono enters only as small eyebrows/labels/code and does not count as a third "voice" when used at caption scale, but never run all three at heading scale simultaneously.

### Font loading & performance
| Rule | Detail |
|---|---|
| **Preload budget** | `<= 2` font files preloaded (`<= 45KB` total): Space Grotesk + Geist Sans variable subsets (Latin). Mono is lazy. |
| **`font-display`** | `swap` with a metric-matched fallback (`size-adjust`, `ascent/descent-override`) to keep **CLS `<= 0.02`** on font swap. |
| **Subsetting** | Latin subset only (English-only product, hreflang-ready). |
| **Variable axes** | Use the variable weight axis; avoid shipping multiple static weights. |

CSS variable handles (set by `next/font`): `--font-display` (Space Grotesk), `--font-sans` (Geist Sans), `--font-mono` (Geist Mono). Tailwind v4 maps these in `@theme` — see [design-tokens](./design-tokens.md#typography-tokens).

---

## 2. The Type Scale

Fluid, `clamp()`-based, **base 16px**. Display steps scale with viewport; structural headings are mostly fixed for predictable rhythm. All values are locked — do not introduce intermediate steps.

| Step | Size | Line-height | Tracking | Family / weight | Usage |
|---|---|---|---|---|---|
| `display-2xl` | `clamp(3.5rem, 8vw, 7.5rem)` | `0.95` | `-0.03em` | Space Grotesk / 600–700 | **Hero only.** The landing display headline (doubles as the page `h1`). One per site section at most. |
| `display-xl` | `clamp(2.75rem, 5.5vw, 5rem)` | `~1.0` | `-0.025em` | Space Grotesk / 600 | Major page hero headlines (About, Projects index hero). |
| `display-lg` | `clamp(2.25rem, 4vw, 3.5rem)` | `~1.05` | `-0.02em` | Space Grotesk / 600 | Section-opening statements, feature callouts. |
| `h1` | `2.5rem` | `1.1` | `-0.02em` | Space Grotesk / 600 | The route `<h1>` when the hero isn't display-scale (one `<h1>` per route, always). |
| `h2` | `2rem` | `1.15` | `-0.01em` | Space Grotesk / 600 | Section headings (the first family-switch threshold: `>= h2` is display). |
| `h3` | `1.5rem` | `1.25` | `-0.005em` | **Geist Sans / 600** | Sub-section headings. Intentionally Geist (not Space Grotesk) to soften mid-document rhythm. |
| `h4` | `1.25rem` | `1.3` | `0` | Geist Sans / 600 | Card titles, minor headings. |
| `body-lg` | `1.125rem` | `1.65` | `0` | Geist Sans / 400 | Lead paragraphs, intros, prose lead. |
| `body` | `1rem` | `1.65` | `0` | Geist Sans / 400 | Default body copy. |
| `body-sm` | `0.875rem` | `1.6` | `0` | Geist Sans / 400 | Secondary copy, dense UI, table cells. |
| `caption` | `0.8125rem` | `1.5` | `0.01em` | Geist Sans / 400–500 | Captions, helper text, metadata. |
| `eyebrow` | `0.75rem` | `1.4` | `0.14em` | **Geist Mono / 500, UPPERCASE** | Section eyebrows, kickers, technical labels above headings. |
| `code` | `0.875rem` | `1.6` | `0` | Geist Mono / 400 | Inline code, code blocks, kbd, stats. |

> **Family-switch threshold:** `>= h2` renders in the **display** family (Space Grotesk); `h3`/`h4` drop to **Geist Sans 600**. This is deliberate — it prevents long documents from feeling shouty and keeps the display face for true section breaks.

---

## 3. Line Height

| Context | Line-height | Rationale |
|---|---|---|
| Hero display (`display-2xl`) | `0.95` | Tight, poster-like; large type needs negative leading to feel composed. |
| Display `xl`/`lg` | `1.0`–`1.05` | Still tight, slightly looser as size drops. |
| Headings `h1`–`h2` | `1.1`–`1.15` | Compact but multi-line-safe. |
| Headings `h3`–`h4` | `1.25`–`1.3` | Looser as they approach body scale. |
| Body copy | `1.65` | Generous leading for long-form readability (the prose default). |
| Small / caption | `1.5`–`1.6` | Slightly tighter at small sizes. |
| Code | `1.6` | Comfortable for scanning multi-line code. |

> **Rule:** Line-height is **inverse to size** — the bigger the type, the tighter the leading. Never let a display headline use body leading, or body copy use display leading.

---

## 4. Letter Spacing (Tracking)

| Scale band | Tracking | Why |
|---|---|---|
| Display (`2xl`→`lg`) | `-0.03em` → `-0.02em` | Large geometric type looks loose by default; negative tracking tightens it into a confident block. |
| Headings (`h1`/`h2`) | `-0.02em` / `-0.01em` | Subtle optical tightening. |
| `h3`/`h4` | `-0.005em` / `0` | Near-neutral as size approaches body. |
| Body / small | `0` | Default metrics are correct for reading. |
| Caption | `+0.01em` | A hair of openness aids legibility at small sizes. |
| **Eyebrow** | `+0.14em` | Wide tracking + uppercase + mono = the technical "label" signature of the brand. |

> **Rule:** Negative tracking is for **large display**; positive tracking is for **small uppercase labels**. Body text is never tracked.

---

## 5. Font-Weight Rules

Both display and body are variable; restrict to a disciplined weight set.

| Weight | Token | Where |
|---|---|---|
| 400 Regular | `--fw-regular` | Body, captions, code, inline content. |
| 500 Medium | `--fw-medium` | Eyebrows, UI labels, emphasized inline text, nav. |
| 600 SemiBold | `--fw-semibold` | All headings (`h1`–`h4`), buttons, display default. |
| 700 Bold | `--fw-bold` | Reserved for the hero `display-2xl` and rare maximal emphasis. |

| Rule | Detail |
|---|---|
| **No 300/light** | The dark theme + thin weights = poor legibility and a fragile feel. Minimum is 400. |
| **Headings are 600** | Not 700. SemiBold reads premium and calm; bold-everywhere reads loud. 700 is a deliberate hero-only accent. |
| **Emphasis = 500 or color, not 700** | Inline emphasis uses medium weight or `--primary` color, never jumping to bold mid-paragraph. |
| **Mono stays 400–500** | Code is 400; mono labels/eyebrows are 500. |

---

## 6. Responsive Typography Behavior

| Behavior | Rule |
|---|---|
| **Fluid display via `clamp()`** | Display steps interpolate between a mobile floor and a desktop ceiling against the viewport (`vw`), so there are **no per-breakpoint font media queries** for display type. |
| **Fixed structural headings** | `h1`–`h4` are fixed sizes for predictable vertical rhythm; only display steps scale fluidly. |
| **Measure cap** | Body line length is capped at **65–72ch** (the `prose` 720px container). Reading never spans the full wide container. |
| **Hero on mobile** | `display-2xl` floors at `3.5rem` on a 390px frame — large but never clipping; verify no horizontal overflow at the mobile canonical frame. |
| **Tabular numerals** | `font-variant-numeric: tabular-nums` on all **stats, metrics, dates, and tables** so numbers align in columns and don't jitter on live update (GitHub dashboard). |
| **Orientation/zoom** | Layout supports 200% zoom and reflows to a single column without loss of content (WCAG 1.4.10); `clamp()` ceilings prevent runaway sizing. |
| **No text in raster** | All display text is real text (selectable, translatable, indexable) — never baked into images, including hero and OG-adjacent UI. |

---

## 7. MDX / Prose Typography Rules

Long-form content (blog, research, philosophy, project case studies) renders through an MDX component registry inside the **`prose` (720px / 65–72ch)** container. Prose inherits the scale above with these specific rules:

| Element | Treatment |
|---|---|
| `h1` | Not used in prose body — the page template owns the single `<h1>`. MDX starts at `h2`. |
| `h2` | `display-lg`/`h2` scale, Space Grotesk 600, generous top margin (`space-12`), short bottom margin — clear section breaks with scroll-margin for anchored links + the sticky header offset. |
| `h3` | `h3` scale, **Geist Sans 600**, `space-8` top margin. |
| `h4` | `h4` scale, Geist Sans 600. |
| `p` | `body`/`body-lg` (lead paragraph = `body-lg`), `1.65` line-height, `space-5`–`space-6` bottom margin. Measure 65–72ch. |
| `a` (link) | `--primary` color, underline with offset; `:hover` brightens; `:focus-visible` uses the outline ring. Never color-only — underline persists. |
| `strong` | Weight 600, inherits color. `em` is italic, weight unchanged. |
| `ul` / `ol` | `space-2` item gap, marker in `--foreground-subtle`; nested lists indent by one gutter step. |
| `blockquote` | Left border `2px --border-strong`, `--foreground-muted` text, italic optional, `--surface-1` inset optional. |
| `code` (inline) | Geist Mono `0.875rem`, `--surface-2` background, `radius-sm`, `0.15em` horizontal padding, `--accent`/`--foreground` text. |
| `pre` (block) | Shiki dual-theme (see [code-syntax tokens](./design-system.md#210-code-syntax-shiki-semantic-dark)), `--surface-2` chrome, `radius-md`, horizontal scroll on overflow, filename/lang label in mono eyebrow, copy button, `tabindex=0` for keyboard scroll. |
| `hr` | `1px --border`, `space-12` vertical margin — a quiet section divider. |
| `table` | `body-sm`, `--border` rules, `--surface-1` header row, tabular-nums for numeric columns, wrapped in a horizontally scrollable container. |
| `img` / `figure` | Rounded (`radius-lg`), explicit aspect-ratio (CLS guard), `figcaption` in `caption` scale + `--foreground-subtle`. |
| `kbd` | Geist Mono, `--surface-3`, hairline border, `radius-sm`. |
| **Eyebrows in prose** | Section kickers use the `eyebrow` token (mono, uppercase, `+0.14em`) above `h2`s where editorial emphasis is wanted. |

> **Reading-first rule:** Prose is content-first and JS-off safe — all of the above is pure CSS/SSR. Animations (reveal-on-scroll) only *enhance* and are fully gated by reduced-motion; the text is visible by default.

> **Vertical rhythm:** Prose spacing keys off the 4px base ([spacing scale](./design-tokens.md#spacing-scale)); top margins on headings are larger than bottom margins so headings bind to the content that follows them.

---

## 8. Cross-References

- [Design System](./design-system.md) — color, surface, elevation, glass, theming.
- [Design Tokens](./design-tokens.md) — implementation-ready typography, spacing, and motion tables.
- [Information Architecture](./information-architecture.md) — where each type style is deployed across routes.

# DATUM — Final Design & Build Specification
### Joshua Setiawan Portfolio · Instrument Redesign · REV 2026.07

This is the single source of truth for the DATUM rebuild. It supersedes the 8 specialist drafts and resolves every naming/path/value conflict between them. Where drafts disagreed, the resolution is stated inline under **⊕ Resolved**. All paths are repo-relative to `/mnt/storage/VSCode/Repo/web-portofolio/`.

---

## 1. Overview & Design Thesis

**Thesis.** Rebuild the portfolio as a *precision measuring instrument* — a declassified engineering datasheet in warm graphite and bone, where every credential is a plotted, indexed, timestamped coordinate and a single hazard-orange signal is the only thing that moves.

**The five governing laws (apply everywhere):**
1. **Five neutrals + one acid.** Everything structural is graphite/bone. Signal Orange is the only chroma, rationed at the token layer to focus rings, indices/ticks, one live hero trace, one hover scan-line per row, and one filled CTA per view.
2. **Hairlines over fills.** Elevation is expressed only by `1px` hairline rules + z-order. No fills, glass, backdrop-blur, shadow, or gradient. `--radius: 0` — square everything.
3. **Mono is the connective voice, Archivo is the reading voice.** IBM Plex Mono carries all labels/indices/coordinates/timestamps/numerals; Archivo carries prose; Archivo Expanded carries oversized display marks only.
4. **Data-as-decoration.** Definition-lists and ledger rows are the primary layout primitives. The metrics, timestamps, and indices *are* the ornament.
5. **Mechanical motion.** Geared, snap-precise, 120–180ms on `cubic-bezier(0.2,0,0,1)`. Counters step. One continuous animation exists site-wide (the hero trace). Reduced-motion is a first-class static state, never a degradation.

**What changes:** color/token system, all three type families, layout chassis (visible Swiss grid + persistent left index gutter + fixed bottom telemetry bar), every card → ledger row, the hero shader (recolored to a monochrome oscilloscope), all motion easings/durations, cmdk → terminal console, contact form → TRANSMISSION console.

**What stays (KEEPS):** all content + all 18 routes, RSC/App-Router structure, Velite MDX blog, next-themes (dark-default), zustand/zod/sonner, cmdk (restyled not removed), the single persistent `<Canvas>` (recolored/re-geometried, not re-architected), Geist Mono inside `<pre>`/`<code>` only. Budgets held: poster stays LCP on 3D routes, grid overlay is pure CSS (no CLS), baseline route JS unchanged (font/token/shader swap only), WCAG 2.2 AA on painted backgrounds.

**⊕ Resolved — canonical file locations.** The three drafts proposed `src/components/layout/`, `src/components/instrument/`, and `src/components/portfolio/` for the same new primitives. **Canonical: all new chassis primitives live under `src/components/layout/`; all new motion primitives under `src/components/motion/`.** The `src/components/instrument/` folder is folded into `src/components/layout/`. Portfolio card files become thin adapters that map typed data → `LedgerRow` props.

---

## 2. Design Tokens & Typography

### 2.1 Contrast ledger (measured WCAG 2.1 relative-luminance, both themes)

**Dark — INSTRUMENT (default, bg `#0D0D0F`)**

| Foreground | On | Ratio | Verdict |
|---|---|---|---|
| Bone `#F1EFE9` | bg | 16.9:1 | AAA any text |
| Muted `#9C9A92` | bg | 6.9:1 | AA normal |
| Subtle `#6C6A64` | bg | 3.6:1 | ⚠ large ≥24px / ≥18.66px bold / non-text only |
| Signal `#FF4A1C` | bg | 5.8:1 | AA normal (carries small mono) |
| Signal-hover `#FF6A3D` | bg | 6.8:1 | AA normal |
| Signal `#FF4A1C` | surface-1/2/3 | 5.5 / 5.3 / 4.9:1 | AA normal at every elevation |
| Graphite `#0D0D0F` on Signal fill | — | 5.8:1 | AA — **filled-orange controls use graphite ink** |
| White on Signal fill | — | 3.4:1 | ✗ never white on orange (dark) |
| Destructive `#E5484D` | bg | 5.0:1 | AA normal |
| Grid line `#2A2A2F` | bg | 1.36:1 | decorative, non-text |

**Light — DATASHEET (bg `#EDEBE3`)**

| Foreground | On | Ratio | Verdict |
|---|---|---|---|
| Ink `#16151A` | bg | 15.2:1 | AAA |
| Muted `#55534C` | bg | ~6.5:1 | AA normal |
| Subtle `#75736B` | bg | 4.0:1 | ⚠ large / non-text only |
| **Signal text `#A62A06`** | bg | ~6.0:1 (≥5.95) | AA normal — the only orange allowed on light text |
| **Display `#E23A10`** | bg | 3.6:1 | large only (≥24px) — never body/small |
| White on Signal fill `#A62A06` | — | 7.1:1 | AA — **filled-orange controls use white ink (light)** |
| Destructive `#B4231C` | bg | 5.5:1 | AA normal |

**Focus ring** = Signal → 5.8:1 dark / 6.0:1 light, both ≥3:1 (WCAG 2.2 SC 1.4.11). The ring is the primary field-boundary signal.

**⊕ Resolved — signal token model.** The a11y draft's three-purpose split (`--signal-text` / `--signal-graphic` / `--signal-focus`) is satisfied by the color draft's simpler tokens, which are **canonical**:
- `--signal` = text-safe acid (`#FF4A1C` dark / `#A62A06` light) — this is `--signal-text`.
- `--signal-display` = large-mark acid (`#FF4A1C` dark / `#E23A10` light) — this is `--signal-graphic`; **forbidden below 24px.**
- `--ring` = focus acid (= `--signal`) — this is `--signal-focus`.
Author code references only these. A raw `#FF4A1C`/`#A62A06`/`#E23A10` anywhere outside `tokens.css` is a lint failure (§8).

**⊕ Resolved — hairline token names.** The chassis draft's `--rule`/`--rule-strong` and the color draft's `--border`/`--border-strong`/`--grid-line` are the same two values. **Canonical: `--border` (`#2A2A2F`/`#CDCABF`) and `--border-strong` (`#3A3A40`/`#B3AFA2`).** `--grid-line` and `--rule` are aliases of `--border`; `--rule-strong` aliases `--border-strong`. Both Tailwind utilities `border-border` and `border-rule` resolve identically.

### 2.2 `src/styles/tokens.css` — full rewrite

```css
/**
 * DATUM design tokens — INSTRUMENT (dark, default) / DATASHEET (light).
 * ONE acid: Signal Orange, rationed at the token layer.
 * Elevation = hairline --border + z-order. No fills/glass/shadow/gradient.
 * Deprecated tokens kept & neutralized to prevent build breaks.
 */

/* =============== LIGHT — DATASHEET =============== */
:root {
  --background: #edebe3;
  --foreground: #16151a;
  --card: #f4f2ec;
  --card-foreground: #16151a;
  --popover: #ffffff;
  --popover-foreground: #16151a;
  --primary: #a62a06;              /* = --signal */
  --primary-foreground: #ffffff;   /* 7.1:1 on primary */
  --secondary: #e4e1d7;
  --secondary-foreground: #16151a;
  --muted: #e4e1d7;
  --muted-foreground: #55534c;
  --accent: #e4e1d7;               /* hover surface, NOT the acid */
  --accent-foreground: #16151a;
  --destructive: #b4231c;
  --destructive-foreground: #ffffff;
  --border: #cdcabf;
  --input: #b3afa2;
  --ring: #a62a06;

  --surface-1: #f4f2ec;
  --surface-2: #ffffff;
  --surface-3: #e4e1d7;
  --foreground-muted: #55534c;
  --foreground-subtle: #75736b;    /* 4.0:1 — large/UI only */
  --border-strong: #b3afa2;

  --signal: #a62a06;               /* text-safe acid: 6.0:1 */
  --signal-hover: #8a2405;
  --signal-foreground: #ffffff;
  --signal-display: #e23a10;       /* large display marks only: 3.6:1 */

  /* aliases (chassis) */
  --rule: var(--border);
  --rule-strong: var(--border-strong);
  --grid-line: var(--border);

  /* instrument chrome */
  --scan: #a62a06;
  --trace: #a62a06;
  --rule-accent: #a62a06;
  --status-bar-bg: #f4f2ec;
  --status-bar-foreground: #55534c;

  /* chassis metrics */
  --gutter-w: 96px;
  --grid-gutter: 24px;
  --statusbar-h: 28px;

  /* deprecated — neutralized (do NOT introduce a 2nd accent) */
  --accent-2: #55534c;
  --accent-2-foreground: #ffffff;
  --glow: #e23a10;                 /* feeds ONLY hero trace emissive */
  --success: #1b6e45;              /* toasts/console log-levels only */
  --warning: #8a5d0f;
  --info: #1f5f82;
  --gradient-accent: linear-gradient(0deg, var(--signal), var(--signal));
  --gradient-surface: linear-gradient(0deg, var(--surface-1), var(--surface-1));

  --radius: 0;
}

/* =============== DARK — INSTRUMENT (default) =============== */
.dark {
  --background: #0d0d0f;
  --foreground: #f1efe9;
  --card: #131316;
  --card-foreground: #f1efe9;
  --popover: #17171b;
  --popover-foreground: #f1efe9;
  --primary: #ff4a1c;
  --primary-foreground: #0d0d0f;   /* 5.8:1 on primary */
  --secondary: #17171b;
  --secondary-foreground: #f1efe9;
  --muted: #17171b;
  --muted-foreground: #9c9a92;
  --accent: #1e1e22;
  --accent-foreground: #f1efe9;
  --destructive: #e5484d;
  --destructive-foreground: #0d0d0f;
  --border: #2a2a2f;
  --input: #3a3a40;
  --ring: #ff4a1c;

  --surface-1: #131316;
  --surface-2: #17171b;
  --surface-3: #1e1e22;
  --foreground-muted: #9c9a92;
  --foreground-subtle: #6c6a64;
  --border-strong: #3a3a40;

  --signal: #ff4a1c;
  --signal-hover: #ff6a3d;
  --signal-foreground: #0d0d0f;
  --signal-display: #ff4a1c;       /* large marks reuse signal (5.8:1 ok large) */

  --rule: var(--border);
  --rule-strong: var(--border-strong);
  --grid-line: var(--border);

  --scan: #ff4a1c;
  --trace: #ff4a1c;
  --rule-accent: #ff4a1c;
  --status-bar-bg: #131316;
  --status-bar-foreground: #9c9a92;

  --accent-2: #9c9a92;
  --accent-2-foreground: #0d0d0f;
  --glow: #ff4a1c;
  --success: #63c48a;
  --warning: #d8a23c;
  --info: #5aa9d6;
  --gradient-accent: linear-gradient(0deg, var(--signal), var(--signal));
  --gradient-surface: linear-gradient(0deg, var(--surface-1), var(--surface-1));
}
```

**Radius consequence.** `--radius: 0` makes the old derived scale `calc(var(--radius) - Npx)` resolve to negative, invalid lengths. **Do not rely on calc** — hard-set every step to `0` in the `@theme` block (§2.4c). Scrollbar thumb: set to `0` (square).

### 2.3 Annotated token roles (both themes, condensed)

| Token | Dark / Light | Role |
|---|---|---|
| `--background` | `#0D0D0F` / `#EDEBE3` | canvas |
| `--foreground` | `#F1EFE9` / `#16151A` | all primary text |
| `--foreground-muted`·`--muted-foreground` | `#9C9A92` / `#55534C` | mono labels, telemetry, spec strips |
| `--foreground-subtle` | `#6C6A64` / `#75736B` | gutter indices at rest, de-emphasis (large/UI only) |
| `--surface-1`·`--card` | `#131316` / `#F4F2EC` | ledger rows, status bar |
| `--surface-2`·`--popover` | `#17171B` / `#FFFFFF` | console/dialog, inline code |
| `--surface-3`·`--accent` | `#1E1E22` / `#E4E1D7` | highest elevation / shadcn hover surface (never the acid) |
| `--border`·`--rule`·`--grid-line` | `#2A2A2F` / `#CDCABF` | every hairline + 12-col overlay |
| `--border-strong`·`--input`·`--rule-strong` | `#3A3A40` / `#B3AFA2` | module separators, field edge |
| `--signal`·`--primary`·`--ring`·`--scan`·`--trace` | `#FF4A1C` / `#A62A06` | the acid: focus, ticks, live trace, 1 CTA |
| `--signal-display` | `#FF4A1C` / `#E23A10` | oversized display marks only |
| `--destructive` | `#E5484D` / `#B4231C` | errors/toasts (distinct from acid) |
| `--accent-2`, `--success/warning/info`, `--gradient-*`, `--glow` | — | deprecated/rationed: neutral, toast/console-only, or hero-trace-only |

### 2.4 `src/styles/globals.css` — `@theme inline` changes

**(a) Brand color mappings** (append, so `bg-signal`, `text-signal`, `border-grid-line`, `bg-status-bar`, `border-rule` exist):
```css
--color-signal: var(--signal);
--color-signal-hover: var(--signal-hover);
--color-signal-foreground: var(--signal-foreground);
--color-signal-display: var(--signal-display);
--color-grid-line: var(--grid-line);
--color-rule: var(--rule);
--color-rule-strong: var(--rule-strong);
--color-scan: var(--scan);
--color-trace: var(--trace);
--color-rule-accent: var(--rule-accent);
--color-status-bar: var(--status-bar-bg);
--color-status-bar-foreground: var(--status-bar-foreground);
```
(Existing `--color-*` mappings for surfaces, foreground ramp, `--border-strong`, `--accent-2*`, `--success/warning/info`, `--glow` stay — tokens resolve, just neutralized.)

**(b) Font families** (replace the three Space-Grotesk/Geist lines with four):
```css
--font-display: var(--font-display), "Archivo Expanded", "Arial Narrow", system-ui, sans-serif;
--font-sans:    var(--font-sans), "Archivo", system-ui, -apple-system, "Segoe UI", sans-serif;
--font-mono:    var(--font-mono), "IBM Plex Mono", ui-monospace, "SFMono-Regular", monospace;
--font-code:    var(--font-code), "Geist Mono", ui-monospace, monospace;
```

**(c) Radius scale → 0** (hard-set, do not calc):
```css
--radius-xs: 0; --radius-sm: 0; --radius-md: 0;
--radius-lg: 0; --radius-xl: 0; --radius-2xl: 0;
```

**(d) Mechanical easings** (add alongside legacy, which stay for legacy callers only):
```css
--ease-snap:   cubic-bezier(0.2, 0, 0, 1);    /* DATUM canonical, 120–180ms */
--ease-gantry: cubic-bezier(0.83, 0, 0.17, 1); /* scan-sweeps, pinned scrubs */
/* keep --ease-out-quint / --ease-out-expo for legacy; --ease-back retired from chrome */
```
`--spacing-section: clamp(6rem, 12vw, 12rem)` is unchanged.

**(e) Utility neutralization.**
- `.glass` (in `@layer utilities`): drop `backdrop-filter`, set `background-color: var(--surface-1)` (opaque) + `border-b border-[var(--rule)]`. The `prefers-reduced-transparency` fallback already points at `--surface-1`, so default now matches fallback. Then migrate `header.tsx` off `glass` and remove.
- `--gradient-accent` resolves to flat solid Signal (so `.text-gradient` renders solid orange, zero code changes) — but prefer `text-signal` going forward; there is no gradient in DATUM.
- `--gradient-surface` flattened to solid `--surface-1`; retire `bg-[--gradient-surface]`.
- `--glow` = Signal Orange, feeds **only** the single hero trace emissive; disable bloom everywhere else.

**(f) `.tabular` custom utility** + mono-floor base:
```css
@utility tabular {                 /* opt-in; NEVER on <body> */
  font-variant-numeric: tabular-nums slashed-zero;
  font-feature-settings: "tnum" 1, "zero" 1;
}
@utility mono-floor {              /* all mono chrome */
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
}
```

**(g) Layout metrics** — reserve statusbar height globally: `body { padding-bottom: var(--statusbar-h); }` (no CLS).

### 2.5 Typography — font loading (`src/app/layout.tsx`)

Replace the current `next/font/google` block with four families (all self-hosted, metric-matched, `adjustFontFallback` default):

```tsx
import { Archivo, Archivo_Expanded, IBM_Plex_Mono, Geist_Mono } from "next/font/google";

const fontDisplay = Archivo_Expanded({
  variable: "--font-display", subsets: ["latin"], weight: ["700", "800"],
  display: "swap", preload: true,
  fallback: ["Arial Narrow", "system-ui", "sans-serif"],
});
const fontSans = Archivo({
  variable: "--font-sans", subsets: ["latin"], weight: ["400", "500"],
  display: "swap", preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});
const fontMono = IBM_Plex_Mono({
  variable: "--font-mono", subsets: ["latin"], weight: ["400", "500", "600"],
  display: "swap", preload: true,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});
const fontCode = Geist_Mono({          // <pre>/<code> only; below the fold
  variable: "--font-code", subsets: ["latin"], display: "swap", preload: false,
});
```
- `<html>` className exposes all four: `${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable} ${fontCode.variable}`.
- `viewport.themeColor` → `#0D0D0F` (dark) / `#EDEBE3` (light).
- **Loading policy:** `swap` on all four; `preload:true` for display/sans/mono (chrome + LCP hero poster), `false` for Geist Mono (route-specific). `subsets:["latin"]` only. Weight count (2·2·3·1) is the same order of magnitude as the outgoing stack — a swap, not an addition.

### 2.6 Family roles — strict enforcement

| Family | Utility | Allowed | Forbidden |
|---|---|---|---|
| Archivo Expanded | `font-display` | Display marks only: hero name, page-hero H1, major section H2, featured/ledger titles. Oversized, flush-left, ≥22px. | Body, prose h3–h6, runs >~6 words, anything <22px |
| Archivo | `font-sans` | All prose (720 measure), UI copy, buttons, in-article h3–h6, form values, ledger row titles | Eyebrows, indices, coordinates, timestamps, numerals |
| IBM Plex Mono | `font-mono` | Eyebrows, kickers, field labels, indices (`PRJ-014`), coordinates, timestamps, git refs, status bar, spec-header dl values, all metric numerals, tables | Long-form prose |
| Geist Mono | `font-code` | `<pre>` + inline `<code>` only | Everything else |

### 2.7 Fluid type scale (`@theme inline`, interpolate 360px→1440px)

```css
/* DISPLAY (Archivo Expanded) */
--text-display-2xl: clamp(3.25rem, 6vw + 1rem, 8rem);   --text-display-2xl--line-height: 0.95; --text-display-2xl--letter-spacing: -0.02em; --text-display-2xl--font-weight: 800;
--text-display-xl:  clamp(2.5rem, 5vw + 0.5rem, 5rem);  --text-display-xl--line-height: 1.0;  --text-display-xl--letter-spacing: -0.02em;  --text-display-xl--font-weight: 800;
--text-display-lg:  clamp(2rem, 3.5vw + 0.5rem, 3.5rem);--text-display-lg--line-height: 1.03; --text-display-lg--letter-spacing: -0.015em; --text-display-lg--font-weight: 700;
--text-display-md:  clamp(1.625rem, 2vw + 0.5rem, 2.5rem);--text-display-md--line-height: 1.08;--text-display-md--letter-spacing: -0.01em;  --text-display-md--font-weight: 700;
--text-display-sm:  clamp(1.375rem, 1vw + 0.9rem, 1.75rem);--text-display-sm--line-height: 1.12;--text-display-sm--letter-spacing: -0.01em;--text-display-sm--font-weight: 700;
/* IN-PROSE HEADINGS (Archivo) */
--text-heading-md:  clamp(1.25rem, 1vw + 0.9rem, 1.5rem);--text-heading-md--line-height: 1.25;--text-heading-md--letter-spacing: -0.005em;--text-heading-md--font-weight: 600;
--text-heading-sm:  1.125rem; --text-heading-sm--line-height: 1.3; --text-heading-sm--font-weight: 600;
/* BODY (Archivo) */
--text-body-lg: clamp(1.0625rem, 0.4vw + 1rem, 1.1875rem); --text-body-lg--line-height: 1.7;
--text-body:    clamp(1rem, 0.25vw + 0.95rem, 1.0625rem);  --text-body--line-height: 1.65;
--text-body-sm: 0.875rem;  --text-body-sm--line-height: 1.5;
--text-caption: 0.8125rem; --text-caption--line-height: 1.45;
/* MONO (IBM Plex Mono) */
--text-mono-eyebrow: 0.8125rem; --text-mono-eyebrow--line-height: 1.4; --text-mono-eyebrow--letter-spacing: 0.16em; --text-mono-eyebrow--font-weight: 500;
--text-mono-label:   0.75rem;   --text-mono-label--line-height: 1.35;  --text-mono-label--letter-spacing: 0.14em; --text-mono-label--font-weight: 500;  /* 12px HARD FLOOR uppercase */
--text-mono-meta:    0.75rem;   --text-mono-meta--line-height: 1.4;    --text-mono-meta--letter-spacing: 0.02em;  --text-mono-meta--font-weight: 400;
--text-mono-status:  0.75rem;   --text-mono-status--line-height: 1.3;  --text-mono-status--letter-spacing: 0.04em; --text-mono-status--font-weight: 500;
--text-mono-body:    0.875rem;  --text-mono-body--line-height: 1.6;
--text-mono-metric:    clamp(1.25rem, 2vw + 0.5rem, 2rem);   --text-mono-metric--line-height: 1.0;  --text-mono-metric--font-weight: 600;
--text-mono-metric-lg: clamp(2rem, 4vw, 3.25rem);            --text-mono-metric-lg--line-height: 0.95; --text-mono-metric-lg--letter-spacing: -0.01em; --text-mono-metric-lg--font-weight: 600;
```

**Scale reference (primary roles):** `display-2xl` = hero name (one per site); `display-xl` = page-hero H1; `display-lg` = major section H2; `display-md` = featured/sub-section; `display-sm` = ledger-row title fallback; `heading-md/sm` = MDX h3/h4; `body-lg` = prose lead; `body` = default prose+UI; `mono-eyebrow` = section eyebrows (UPPERCASE); `mono-label` = indices/field labels (UPPERCASE, 12px floor); `mono-meta` = coordinates/timestamps/captions (mixed-case); `mono-status` = telemetry bar; `mono-body` = spec-header dl values; `mono-metric(-lg)` = KPI/count-up numerals.

### 2.8 Numeral, small-mono, and wrap rules
- **Tabular figures mandatory** on every mono numeric context: apply `tabular` (`tabular-nums slashed-zero`). Never global on `<body>`.
- **Small uppercase mono ≥12px + ≥0.12em tracking** (AA safeguard). Never `text-[11px]`. Mixed-case mono may relax to 0.02–0.04em but holds the 12px floor. Mono chrome line-height ≥1.3.
- **Wrapping:** display tokens `text-balance`; prose `text-pretty`; mono indices/labels `white-space: nowrap` (so `PRJ-014` never breaks).
- **Reduced motion:** `steps()` count-ups render the final tabular value immediately; identical width to animated end-state → no reflow.

### 2.9 Typography component migration
- `section-header.tsx`: eyebrow → `font-mono text-mono-eyebrow uppercase text-signal`; H2 → `font-display text-display-lg`.
- `code-block.tsx`: figcaption stays `font-mono`; `<code>` → `font-code`.
- `mdx-components.tsx`: article title h1/h2 keep `font-display text-display-*`; in-prose h3/h4 → `font-sans text-heading-md`/`text-heading-sm`; inline `<code>` → `font-code`.
- New ledger/status/telemetry: indices `font-mono text-mono-label tabular`; coordinates/timestamps `text-mono-meta tabular`; count-ups `text-mono-metric tabular`; bottom bar `text-mono-status tabular`.

---

## 3. Layout Chassis & New Primitives

### 3.1 The instrument grid

A CSS grid with a **fixed left gutter track + fluid content track**, applied at the `(site)/layout.tsx` shell so the gutter rail spans full document height. The 720px prose measure is untouched (the rail lives outside it).

| Breakpoint | `grid-template-columns` | Gutter |
|---|---|---|
| `<768px` | `1fr` | rail collapses to an **inline index tick** prefixing each Section header |
| `≥768px` (md) | `[gutter] 56px [content] minmax(0,1fr)` | 56px |
| `≥1024px` (lg) | `[gutter] 72px [content] minmax(0,1fr)` | 72px |
| `≥1280px` (xl) | `[gutter] 96px [content] minmax(0,1fr)` | 96px; shell `mx-auto max-w-[calc(1440px+96px)]` |

The **12-col field** lives inside the content track: `grid grid-cols-12 gap-x-[var(--grid-gutter)]`. Asymmetric rule: headlines `col-span-8 lg:col-span-9`; metadata `col-start-11 col-span-2` (pinned right). Content max: `content`=1280, `wide`=1440, `prose`=720 (unchanged).

### 3.2 Chassis mount map

**⊕ Resolved — StatusBar mounts in the root `src/app/layout.tsx`** (not `(site)/layout.tsx`), so it reports on `error.tsx`/`not-found.tsx`/`global-error.tsx` too. cmdk console also stays global in root layout.

```tsx
// src/app/(site)/layout.tsx (RSC, wraps client islands)
<DatumShell>                      {/* establishes [gutter] [content] grid */}
  <GutterProvider>
    <IndexGutter />               {/* sticky rail, client island */}
    <div className="datum-content">
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </div>
  </GutterProvider>
</DatumShell>
// StatusBar + cmdk console mount in src/app/layout.tsx, after the (site) children slot.
```

### 3.3 Primitive → file → mount summary (canonical)

| Primitive | File | Renders in | Client? |
|---|---|---|---|
| `DatumShell` | `src/components/layout/datum-shell.tsx` | `(site)/layout.tsx` | no |
| `GutterContext`/`GutterProvider` | `src/components/layout/gutter-context.tsx` | provider in shell | yes |
| `IndexGutter` | `src/components/layout/index-gutter.tsx` | inside shell | yes |
| `GutterIndex` (helper) | `src/components/layout/gutter-index.tsx` | ledger/section headers | no |
| `GridOverlay` | `src/components/layout/grid-overlay.tsx` | per-page (hero/index) | no |
| `Rule` | `src/components/layout/rule.tsx` | everywhere | no |
| `StatusBar` | `src/components/layout/status-bar.tsx` | **root** `layout.tsx` | yes |
| `DefinitionList` | `src/components/layout/definition-list.tsx` | case-study headers, GitHub, contact | no |
| `LedgerRow`/`LedgerList` | `src/components/layout/ledger-row.tsx` | all index routes | yes (sweep/count-up) |
| `Container` (rework) | `src/components/layout/container.tsx` | everywhere | no |
| `Section` (rework) | `src/components/layout/section.tsx` | everywhere | wrapped when `index` set |
| `SectionHeader` (rework) | `src/components/layout/section-header.tsx` | section tops | no |
| `Header`/`Footer`/`MobileMenu` (restyle) | existing paths | `(site)/layout.tsx` | as existing |
| `TickCounter` | `src/components/motion/tick-counter.tsx` | numerals | yes |
| `Calibration` | `src/components/motion/calibration.tsx` | one per route | yes |
| `ScanLine` | `src/components/motion/scan-line.tsx` | ledger/gallery/filter | yes |

### 3.4 `Container` (rework)
Keep API + maxes. Add `grid?: "none" | "12"`. Base classes: `w-full px-4 sm:px-6 lg:px-8` (drop `mx-auto` — the shell centers; pass `className="mx-auto"` when used outside the shell, e.g. error/not-found). `grid="12"` appends `grid grid-cols-12 gap-x-[var(--grid-gutter)]`. Prose stays flush-left (`ml-0`).

### 3.5 `Section` (rework)
Props: `id`, `index?` ("01"), `label?`, `rule?` (default true), `showGrid?`, `bleed?`, `className`, `children`.
- Wrapper `relative py-[var(--spacing-section)]`.
- `rule` renders top `<Rule/>` across the content track + registers `index`/`label` with `GutterContext` (measured `offsetTop`, `ResizeObserver` to recompute).
- `showGrid` mounts `<GridOverlay className="absolute inset-0 -z-10" />`.
- `bleed` swaps inner Container for full-width; hairlines still align to the content track via `padding-inline`.
- Mobile (`<md`): renders `index`/`label` as inline mono tick above children: `<span className="font-mono text-mono-label text-signal md:hidden">{index} · {label}</span>`.

### 3.6 `IndexGutter` (client island)
Three stacked zones: **route index** (top, sticky — prefix from `usePathname()` via `ROUTE_INDEX` map, `text-signal`), **section ticks** (scroll-aligned orange registration ticks + mono `01/02`; active full-opacity `--signal`, others `--foreground-subtle`), **scroll telemetry** (bottom, sticky — `Y: 0.42` scroll fraction + deterministic scroll-linked timestamp `T+00:14:22`, both `tabular`). Subscribes to `GutterContext`; `IntersectionObserver` (rootMargin `-45% 0 -55% 0`) sets `active`. Rail is `sticky top-0 h-svh`, `pointer-events-none` except interactive jump-anchors (`pointer-events-auto`). Width = fixed grid track → zero CLS. SSR renders route index + ordinals; live zone hydrates client-side. Reduced-motion: no sweeps, but coordinate/timestamp still update (throttled rAF ≤15fps, data not decoration).

`GutterContext`: `{ register(s), unregister(id), active }` where `GutterSection = { id, index, label?, top }`.

### 3.7 `GridOverlay` (RSC, pure CSS)
Props: `cols?` (12), `className`, `edges?` (true), plus `as?: "css" | "svg"`.
CSS variant — single element, no per-column DOM:
```tsx
<div aria-hidden="true" role="presentation"
  className={cn("pointer-events-none select-none", className)}
  style={{
    backgroundImage:
      "repeating-linear-gradient(to right, var(--rule) 0, var(--rule) 1px, transparent 1px, transparent calc(100% / var(--grid-cols)))",
    "--grid-cols": cols, opacity: 0.5, backgroundSize: "100% 100%",
  }} />
```
Constrained to the content track (mount inside a Container-width parent, `-z-10`). **SVG variant** (`as="svg"`, hero only) renders `<line>` elements GSAP can draw via `strokeDashoffset`. Reduced-motion / index pages: rendered fully drawn/static.

### 3.8 `Rule` (RSC) — the only elevation device besides z-order
Props: `orientation?` (h/v), `weight?` ("hair"=`--rule` / "strong"=`--rule-strong`), `signal?` (orange registration tick, `w-6`), `tick?` (6px orthogonal `::before` cap), `as?`, `className`. Always `role="separator"` + `aria-orientation`. Never shadow/gradient. Replaces every ad-hoc `border-b border-border`, `h-px bg-border` scattered through `footer.tsx`, `section-header.tsx`, `mobile-menu.tsx`.

### 3.9 `StatusBar` (client island, root layout)
`fixed inset-x-0 bottom-0 z-40 h-[var(--statusbar-h)]` (**28px canonical**), `border-t border-[var(--rule)]`, `bg-[var(--background)]` (opaque, no glass), `font-mono text-mono-status tabular`, `contain: layout style paint`.
Fields: `Y: 0.42` (scroll fraction off the Lenis scroll event, rAF-throttled) · `SECT 03/09` (active section + total from GutterContext) · `INSTRUMENT`/`DATASHEET` (next-themes `resolvedTheme`, orange square glyph) · `git 9c36114` (`NEXT_PUBLIC_COMMIT_SHA`) · `NN FPS` (sampled 1/s, **suppressed → `— FPS` under reduced-motion**) · right status slot (`TX READY` / `TX SENDING…` / `TX OK`, wired to contact form + sonner). Fields separated by `<Rule orientation="vertical" />`. `text-subtle` labels, `text-foreground` values, `text-signal` only on active-section number + theme glyph. `<sm` collapses to `Y:` + `SECT`. Non-actionable telemetry is `aria-hidden`; the bar is `role="status"` only for the live submit-state slot. Reserved via `body { padding-bottom: var(--statusbar-h) }`.

### 3.10 `DefinitionList` (RSC)
Props: `items: {field, value, index?}[]`, `layout?: "rows"|"grid"`, `dense?`, `rule?` (true), `className`. Semantic `<dl>`; `<dt>` mono `text-mono-label uppercase text-foreground-subtle`, `<dd>` Archivo `text-foreground` (or mono `tabular` for numerals). `rows`: `grid-cols-[minmax(9rem,12rem)_1fr]`, `<Rule/>` between rows. `grid`: `grid-cols-2 md:grid-cols-4` metric tiles, hairline on block-start/inline-start only (no boxes). `dense`: row min-height ~2rem for GitHub metric strips. Case-study spec headers compose `layout="rows"` above the 720 measure.

### 3.11 `LedgerRow` / `LedgerList` (client island)
The single shared component behind **every index route**. Card components (`project-card`, `experience-card`, `certificate-card`, `achievement-card`, `research-card`, `blog-card`, `content-card`, `timeline-item`) become thin adapters mapping typed `src/data/*` → `LedgerRow` props.

Props: `prefix`, `index` (→ `PRJ-014`, zero-pad 3), `coordinate?`, `timestamp?`, `title` (Archivo), `href?`, `specs?: {label}[]`, `metric?: {value, suffix?}`, `active?`, `className`.
Grid: `grid grid-cols-[6rem_7rem_1fr_auto] items-baseline gap-x-[var(--grid-gutter)] py-5` → `[index] [coord/timestamp] [title] [spec strip + enter caret]`. Rows separated only by `<Rule/>` on block-start; `rounded-none`, no fill. `title` → `font-sans text-lg md:text-xl` (Archivo, not Expanded). `specs` → mono `text-mono-meta text-muted`, joined by ` · `.
Motion (§6.6). `LedgerList` wrapper provides outer bounding rules, the mono column header (`INDEX · COORD · TITLE · SPEC`), and `role="list"`/`listitem`.

### 3.12 `Header` / `Footer` / `MobileMenu` restyle
- **Header:** keep scroll hide/reveal logic + nav wiring. `scrolled` → `bg-[var(--background)] border-[var(--rule)]` (no glass, single bottom `Rule`). `h-14` (56px). Brand → Archivo Expanded wordmark + mono sub-label `PORTFOLIO · REV 2026.07`. Active link marker → orange registration tick (`<Rule signal/>`, not a pill). `Explore` dropdown → hairline mono list, radius 0. Contact → mono `TRANSMIT →` link (or one bordered button, radius 0). ThemeToggle → `INSTRUMENT ⇄ DATASHEET`. Strip all `rounded-*`; focus `ring-[var(--signal)]`.
- **MobileMenu:** keep Framer stagger; active = left orange registration tick; remove fills/icon-box radius; divider → `<Rule/>`; Contact → bordered `TRANSMIT →`.
- **Footer:** datasheet colophon. Surfaces via z-order + `Rule`. Teal `text-accent-2` → `text-signal`; email `hover:text-signal`. Bottom colophon line (mono, tabular): `REV 2026.07 · BUILD 9c36114 · WCAG 2.2 AA · ${year}`. Remove all radii.

### 3.13 `SectionHeader` (rework)
Props: `index?`, `eyebrow?`, `title`, `description?`, `meta?`, `align?` (deprecated → coerced to "left"), `className`. Eyebrow → `font-mono text-mono-eyebrow uppercase text-signal` + `<Rule signal className="w-6"/>` lead. Title → `font-display text-display-lg` flush-left, `col-span-8 lg:col-span-9`. Description → 720 measure, `text-foreground-muted`. `meta` pins right (`col-start-11 col-span-2 text-right font-mono text-mono-label`). `center` variant removed (mapped to `left`).

### 3.14 CLS guarantees
Gutter track width, statusbar height, and grid overlay are all fixed via CSS (grid tracks / `padding-bottom` / gradient). Rail + overlay are `pointer-events-none` and never resize with content.

---

## 4. Component Restyle Map

Semantic tokens already remap the meaning of existing utilities (§2), so classes need not be renamed — but **literal radius classes in JSX must still be swapped to `rounded-none`**.

### 4.0 Global restyle laws
1. **Radius → 0.** Scale collapses via `@theme` (§2.4c). Swap literal `rounded-full`/`rounded-xs`/`rounded-lg`/`rounded-2xl` in JSX to `rounded-none`. Enumerated sites: `ui/badge.tsx:8`, `project-card.tsx:92/135` + `:64` dot, `experience-card.tsx:64` bullet, `timeline-item.tsx:49` + `timeline-rail.tsx` markers, `project-filter.tsx:51` chips, scrollbar thumb (`globals.css:119`).
2. **Hairlines over fills.** Delete `bg-card`/`bg-surface-1` panel fills, `bg-secondary/muted/accent` fills, all `shadow-*`. Structure = `border border-border` / `border-b border-border` + z-order.
3. **Kill glass/glow.** Remove `.glass`, `.text-gradient`, `ring-primary/30 ring-inset`, `backdrop-blur`, gradient placeholders. Recolor graph-paper placeholders (`project-card:87`, `featured-project-card:87`, `blog-card:37`, `gallery-item:60`) from `rgba(255,255,255,0.06)` / `from-primary/25…` to monochrome `#2A2A2F` grid on `#131316`, no radial glow.
4. **Kill lift springs.** Remove `hover:-translate-y-0.5` and `y:-4`; hover emphasis = GSAP orange `ScanLine` sweep + gutter tick.
5. **Mono labels/indices/tabular.** Every eyebrow/badge/meta/date/metric/id/count: `font-mono uppercase tracking-wider tabular-nums`, min 12px (never `text-[11px]`). Titles stay `font-display`; prose stays `font-sans`.
6. **Focus = orange, crisp.** Keep the global `:focus-visible` outline; strip soft `focus-visible:ring-[3px] ring-ring/50` blur rings; let crisp outline + `focus-visible:border-primary` carry it.

### 4.1 Shared primitives (new)
| Primitive | File | Consumers |
|---|---|---|
| `LedgerRow` | `src/components/layout/ledger-row.tsx` | all index-route cards |
| `DefinitionList`/`SpecList` | `src/components/layout/definition-list.tsx` | featured-project narrative, research meta, cert dialog, case-study headers, github/stat modules |
| `GutterIndex` | `src/components/layout/gutter-index.tsx` | LedgerRow, ledger routes, section headers |
| `ScanLine` | `src/components/motion/scan-line.tsx` | LedgerRow, gallery-item, project-filter |

### 4.2 Index-prefix registry (canonical — resolves the two conflicting draft registries)

| Route | Prefix | Example |
|---|---|---|
| projects, projects/[slug] | `PRJ` | `PRJ-014` |
| experience | `EXP` | `EXP-003` |
| timeline | `TL` (+ year band header) | `TL-007` |
| achievements | `ACH` | `ACH-002` |
| certificates | `CERT` | `CERT-005` |
| research | `RES` | `RES-011` |
| blog, blog/[slug] | `NOTE` | `NOTE-023` |
| gallery | `FIG` | `FIG-006` |
| open-source | `OSS` (repos) · `PKG` (packages) · `PR` (upstream) | `OSS-004` |
| github | `REPO` (repo rows), module indices `01–05` | `REPO-021` |
| contact fields | `TX` | `TX-01 NAME` |

Zero-pad to 3. `text-accent-2` (teal) is retired everywhere → `text-signal`.

### 4.3 cva variant changes
**Button (`ui/button.tsx`):** base `rounded-none` + `font-mono uppercase tracking-wider tabular-nums`, keep `transition-colors`. `default` = the single rationed orange, `hover:bg-signal-hover`, reserve for one CTA/view. `outline` → `border border-border bg-transparent hover:border-primary hover:text-primary` (drop shadow/dark:bg-input). `secondary` → `border border-border bg-transparent hover:border-border-strong`. `ghost` → `hover:text-primary` (no fill). `link`/`destructive` keep.
**Badge (`ui/badge.tsx`):** `rounded-none`, `font-mono text-xs uppercase tracking-wide tabular-nums`, keep hairline border, drop soft ring. `outline` is the canonical chip; `secondary` → `border-border text-foreground-muted`; "live" status → orange **text**, not fill.
**Card (`ui/card.tsx`):** base → `rounded-none border-b border-border bg-transparent py-8 text-foreground shadow-none`. Most usage migrates to `LedgerRow`; Card retained only for dialog-content and case-study figure blocks as `border border-border rounded-none bg-surface-1`. `CardTitle` → `font-display`.
**Tabs (`ui/tabs.tsx`):** list → `rounded-none bg-transparent border-b border-border`; trigger drops active bg/shadow, underline `after:bg-primary` always-on active tick, label `font-mono uppercase tracking-wide`.

### 4.4 `ui/` primitives
- **input / textarea:** `rounded-none border border-border bg-transparent shadow-none font-mono`; focus `focus-visible:border-primary`, drop soft ring; keep `selection:bg-primary`. Optional bottom-rule-only underline for the TRANSMISSION form.
- **label:** `font-mono text-xs uppercase tracking-wider text-foreground-muted`.
- **dialog:** overlay `bg-[#0D0D0F]/80`; content `rounded-none border border-border bg-surface-1 shadow-none` + top hairline + mono eyebrow; close `rounded-none`, orange focus; `DialogTitle` → `font-display`.
- **sheet:** drop shadow → rely on `border-*`; close `rounded-none`; enter/exit 120–180ms; labels mono.
- **tooltip:** `rounded-none border border-border bg-surface-3 text-foreground font-mono text-xs tabular-nums`; arrow → `bg-surface-3`.
- **dropdown-menu:** content `rounded-none border border-border bg-surface-2 shadow-none`; items `rounded-none focus:bg-surface-3 focus:text-primary`; label mono uppercase; shortcut `font-mono`.
- **command (cmdk → CONSOLE):** `rounded-none bg-background border border-border font-mono`; input wrapper keeps `border-b`, prefix mono `>` prompt, orange caret; items `rounded-none data-[selected=true]:bg-surface-3 data-[selected=true]:text-primary` + left orange registration tick; group heading mono uppercase.
- **separator:** keep `bg-border`; add optional `label`/`tick` prop for the ledger section divider.
- **accordion:** keep `border-b`; trigger `rounded-none`, optional `font-mono uppercase`; chevron → orange on open or `+ / −` mono glyph.
- **skeleton / sonner:** `rounded-none`; toasts `border border-border bg-surface-2 font-mono text-xs`, orange only for the one "signal" state, no shadow.

### 4.5 `portfolio/` + `common/` (all → LedgerRow / SpecList / instrument panel)
Every card loses `rounded-2xl border bg-surface-1`, `hover:-translate-y-0.5`, glow/lift variants, and `bg-surface-2` icon tiles (§4.6). Key notes:
- **project-card / featured-project-card:** → LedgerRow (+ SpecList for Role/Year); keep `coverVariants` zoom only; arrow chip → `rounded-none border border-border`, `group-hover:bg-primary group-hover:text-primary-foreground`; `Featured /` teal → `text-signal`.
- **content/experience/research/achievement/certificate/blog/timeline cards:** → LedgerRow with correct prefix; bullets/dots → 1px orange ticks or mono sub-index; dates keep mono; research `STATUS_META` → orange text (published) / outline (preprint,wip); certificate dialog inherits `ui/dialog`, credential-id mono `break-all`.
- **timeline-rail:** progress line `:114 bg-primary` is a **sanctioned live orange trace — keep**; track hairline; stiffen GSAP per §6.
- **gallery-item:** rigid contact-sheet frame `rounded-none border border-border`, no translate; caption mono index + timestamp; lightbox `rounded-none`.
- **github-stats-card / common/stat-card:** instrument panel modules — `rounded-none border border-border`, mono labels, `tabular-nums` values; add orange sparkline/contribution ticks (github).
- **tech-stack-list / skill-badge / tag-list:** inherit badge `outline` restyle; `skill-badge` `font-normal → font-mono`; tag active `border-primary text-primary` + orange ring, `rounded-none`.
- **project-filter:** chips `rounded-none font-mono uppercase`; active `border-primary text-primary bg-transparent` + left orange tick; visible mono `tabular-nums` count readout.

### 4.6 Recurring icon-chip pattern
`flex size-8/9/10 … rounded-lg/full border bg-surface-2 text-primary` (in experience/achievement/certificate/github-stats/stat/timeline) reads as a soft "app card." **Replace globally** with either (a) the mono `GutterIndex` prefix (`EXP-003`) or (b) a `rounded-none` square registration tick; keep the lucide glyph only where semantically load-bearing (timeline type icons).

---

## 5. Hero & WebGL Calibration Field

Repaint the single persistent `<Canvas>` from the azure→teal Signal Field point cloud into a **monochrome Calibration Field**: graphite graph-paper plane behind an oversized Archivo Expanded name, with one continuous Signal-Orange Lissajous/curl trace, ringed by live mono telemetry. Keeps `frameloop="demand"` + DPR clamp `[1,1.75]`; the static plotted-grid poster is the LCP and the reduced-motion / no-WebGL freeze frame.

**Files:** replace `src/three/scenes/signal-field.tsx` contents with `CalibrationField`; keep `src/three/constants.ts` (add calibration constants), `src/three/components/r3f-canvas.tsx` (stop overriding frameloop); modify `src/components/three/scene-canvas.tsx`; rewrite `src/components/sections/hero-scene.tsx` + `hero.tsx`; new `src/three/scenes/calibration-grid-material.ts`, `src/three/scenes/lissajous.ts`, `src/components/sections/hero-poster.tsx`, `hero-telemetry.tsx`, `src/hooks/use-viewport-size.ts`, `src/hooks/use-fps-meter.ts`.

### 5.1 Scene composition (`CalibrationField`)
Camera unchanged (`{position:[0,0,6], fov:45, near:0.1, far:100}`); visible extent ≈ 4.97² units — size geometry to overfill.
```
<CalibrationField>
  ├─ <mesh z=-0.6> planeGeometry(7,7,1,1) + CalibrationGridMaterial  // graph paper
  ├─ <SignalTrace z=0> Line2 (Lissajous+curl, 1024–2048 pts)        // the ONE orange trace
  └─ <mesh z=0.02> planeGeometry(4,2) + additive head-glow quad (optional)
```
Props: `{ active, reduced?, quality, theme }`. `quality` maps segment count: `low 1024 / medium 1536 / high 2048` (small viewport → `low`, replaces old `count`). The **name is DOM**, not WebGL — the SSR `<h1>` in `hero.tsx` (Archivo Expanded, `clamp(2.75rem,9vw,8rem)`, weight 800, `#F1EFE9`), layered above the `aria-hidden` canvas via z-index.

### 5.2 `CalibrationGridMaterial` (GLSL ShaderMaterial)
Procedural grid, `fwidth` AA (crisp at any DPR, no textures), `depthWrite:false`. Uniforms: `uColorBg` (`#0D0D0F`/`#EDEBE3`), `uColorMinor` (`#1E1E22`/`#E4E1D7`), `uColorMajor` (`#2A2A2F`/`#CDCABF`), `uColorAxis` (`#3A3A40`/`#B3AFA2`), `uMinor 12.0`, `uMajor 3.0`, `uReveal 0→1`, `uOpacity 0.85/0.9`.
```glsl
float gridLine(vec2 uv, float cells, float w){
  vec2 g = abs(fract(uv*cells-0.5)-0.5)/fwidth(uv*cells);
  return smoothstep(0.0, w, 1.0 - min(min(g.x,g.y),1.0));
}
void main(){
  float minor = gridLine(vUv, uMinor, 1.0);
  float major = gridLine(vUv, uMajor, 1.4);
  float axis  = 1.0 - min(min(abs(vUv.x-0.5),abs(vUv.y-0.5))/fwidth(vUv.x),1.0);
  vec3 col = uColorBg;
  col = mix(col, uColorMinor, minor*0.6);
  col = mix(col, uColorMajor, major);
  col = mix(col, uColorAxis, axis);
  float wipe = smoothstep(uReveal-0.06, uReveal, vUv.x);
  gl_FragColor = vec4(col, uOpacity*(1.0-wipe));
}
```
`uReveal` animates 0→1 once on entrance (GSAP ~1.2s, snap ease); reduced-motion sets `1.0` immediately. Theme colors set via `useTheme()` → `material.uniforms.uColor*.value.set(...)`.

### 5.3 `SignalTrace` — the only continuous motion on the site
Shared pure fn `src/three/scenes/lissajous.ts` (used by scene **and** poster):
```ts
export function lissajous(t: number, time: number): [number, number] {
  const TAU = Math.PI*2, ax = 2.2, ay = 1.45, fx = 3, fy = 2;
  const phase = 0.35*time;
  const curl = 0.10*Math.sin(TAU*(t*2.0 + time*0.08));
  return [ ax*Math.sin(fx*TAU*t + phase), ay*Math.sin(fy*TAU*t) + curl ];
}
```
Build with `Line2` + `LineGeometry` + `LineMaterial` (`linewidth: 2.5`, `worldUnits:false`, `transparent:true`, `vertexColors:true`; set `resolution` on mount+resize). Per-frame: recompute positions from `lissajous(i/(N-1), clock.elapsedTime)`. Entrance sweep: GSAP `uHead 0→1` (1.2s) fills positions only where `i/(N-1) ≤ uHead`, then `uHead=1` and time keeps it live. Hot head: body `#FF4A1C`, leading ~4% → `#FF6A3D`. Light theme: body `#E23A10`, head `#FF6A3D`. (Documented fallback: custom `ShaderMaterial` line strip with `aT` attribute for GPU-side head animation at 1px×DPR.)

### 5.4 `HeroTelemetry` (DOM overlay, client)
Absolutely positioned over the hero, outside the canvas, `pointer-events-none`, `aria-hidden`, IBM Plex Mono `tabular`, fixed-width `ch` slots (zero CLS). Fields: `VP 1440×900` (real, `use-viewport-size.ts` via `useSyncExternalStore`; SSR `----×----`, 9ch slot) · `Y 0.42` (real, `useScrollProgress()`, `.toFixed(2)`) · `REF a04a08f` (`NEXT_PUBLIC_COMMIT_SHA`, build-time) · `BUILT 2026-07-01T…Z` (`NEXT_PUBLIC_BUILD_TIME`, build-time) · `FPS 58` (real client, `use-fps-meter.ts` EMA; `FPS --` until first sample; **reduced-motion → `FPS ——`**). Labels ≥12px, `letter-spacing:0.08em`; muted `#9C9A92`, numerals Signal (`#FF4A1C` dark / `#A62A06` light). Left index tick `00 / HERO` aligns to the persistent rail.

Add to `next.config.ts`:
```ts
env: {
  NEXT_PUBLIC_COMMIT_SHA:
    process.env.VERCEL_GIT_COMMIT_SHA?.slice(0,7) ??
    require("node:child_process").execSync("git rev-parse --short HEAD").toString().trim(),
  NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
},
```

### 5.5 Frameloop & demand loop
- `SceneCanvas`: pass `frameloop="demand"` (drop the `"always"/"never"` override) + forward `active={visible}` from the existing IntersectionObserver (`rootMargin:"120px"`).
- `SignalTrace` self-perpetuates: inside `useFrame`, call `invalidate()` at end **iff `active`**; bootstrap with one `invalidate()` on mount; when `active` flips false, stop → loop idles at zero cost.
- DPR clamp `[1,1.75]` untouched; grid AA (`fwidth`) and `LineMaterial.resolution` read the clamped buffer.
- `uReveal` draw-on + one-shot orange scan are GSAP-driven on entrance (call `invalidate()` per tick ~1.2s), then hand off to the trace loop.

### 5.6 Poster (LCP) + reduced-motion / no-WebGL
`src/components/sections/hero-poster.tsx` — **RSC inline SVG** (paints from initial HTML, no fetch/decode/CLS, zero JS): bg rect, minor/major `<pattern>` graph paper, center cross-hairs, `<polyline>` from `samplePoster()` = same `lissajous(t,0)` at `time=0, uHead=1, N≈1200` (pixel-identical to WebGL first frame → no handoff jump), corner mono labels. Theme flips via CSS custom props on the SVG (no re-render).
Wire `<HeroPoster/>` to `SceneCanvas` `poster` prop. Gate: `shouldRenderWebGL = !reducedMotion && webglSupported`. Reduced-motion / no-WebGL → poster only; `three`/R3F never download (`dynamic({ssr:false})`); telemetry static (FPS `——`, others real); grid static. When `shouldRenderWebGL` true, canvas fades in over the identical poster (fixed `aspect-square` box → no shift).
Container change in `hero-scene.tsx`: drop `rounded-2xl border bg-surface-1`; full-bleed box separated by hairline (`border-t border-[#2A2A2F]`), keep `aspect-square` reserved height, replace "signal field" tag with mono index `FIG. 00 · CALIBRATION FIELD`.

---

## 6. Motion & Interaction

### 6.0 Division of labor & the one-rAF rule
| Layer | Owns | Must not |
|---|---|---|
| Framer (LazyMotion `m.*`) | reveals, stagger, presence/exit, hover/focus/tap, menu/dialog/sheet | drive scroll; run springs |
| GSAP + ScrollTrigger | ONE pinned calibration moment/route; ledger-row hover scan-line; timeline scrub | spawn its own scroll rAF |
| Lenis | the single master rAF tick; virtualized scroll position | run under reduced-motion |
| R3F | hero canvas only; the single orange trace | render off-screen; `frameloop="always"` |

**Exactly two rAF owners:** Lenis master tick (GSAP slaved via `lenis.on("scroll", () => ScrollTrigger.update())`) and the R3F `demand` loop. Re-point status-bar/scroll-coordinate readouts to the Lenis `"scroll"` event (via `useLenis()`), not new listeners. Consolidate `use-scroll-progress.ts` telemetry onto Lenis. Magnetic's bounded per-move rAF may stay (disabled on coarse pointers + reduced-motion).

### 6.1 Eases & durations (`src/constants/animation.ts`)
Keep export shape (`DURATIONS`, `EASINGS`, `STAGGER`, `EasingName`). Add:
- `snap` (canonical) `[0.2,0,0,1]` — every reveal/entrance/UI state/hover.
- `gantry` `[0.83,0,0.17,1]` — scan sweeps, pinned scrubs.
- `linear` `[0,0,1,1]` — anything paired with `steps()`; scrub tweens (`ease:"none"`).
- `out` `[0.22,1,0.36,1]` legacy fallback only; `back` overshoot **removed from chrome**.

Durations (s): `instant 0.08` · `fast 0.12` · `base 0.15` · `moderate 0.18` · `slow 0.24` (page transitions) · `cinematic 0.40` (pinned calibration sweep only). `STAGGER`: `tight 0.03 / base 0.06 / loose 0.09` (ledger rows use `tight`).

### 6.2 Framer layer
- `variants.ts`: `fadeInUp/Down` keep `y:±24`, transition `{duration: moderate, ease: snap}`. `scaleIn`: **drop the scale** → `clipPath` wipe or plain `fadeIn`. `staggerContainer` unchanged API.
- `reveal.ts` (`createReveal`): default **`blur:false`**, `distance:28`, `ease: snap`, `duration: moderate`; reserve for prose/media on case-study routes (the instrument "arrive" idiom is a rule draw-on + tick, not blur).
- `transitions.ts`: `pageTransition {slow, snap}`, `sectionReveal {moderate, snap}`, `snappy {fast, snap}` (badges/tabs/tooltip/dropdown/theme-toggle default). **`smoothSpring`/`bounceSpring` removed or hard-aliased to `snappy`** — springs banned.
- `motion/reveal.tsx`: logic unchanged (reduced-motion → plain `<div>`). `motion/scroll-progress.tsx`: keep mechanism, `bg-primary → bg-signal`, `h-0.5 → h-px`, re-source from Lenis. `motion-provider.tsx`: unchanged (`LazyMotion domAnimation strict` + `MotionConfig reducedMotion="user"`).

### 6.3 Stepped counters & registration ticks
`src/components/motion/tick-counter.tsx` (client): props `{value, from?, steps?, format?, trigger?}`, renders `font-mono tabular-nums`. Framer path animates a motionValue with `ease:linear` quantized via `Math.round`; GSAP path `gsap.fromTo(node, {innerText: from}, {innerText: value, duration:0.4, ease:"steps(24)", snap:{innerText:1}, onUpdate})`. Reduced-motion → final value immediately.
**Registration tick:** `1px×10px bg-signal`, `scaleY 0→1` origin-bottom on `snap` @120ms (or `steps(4)`), `aria-hidden`.

### 6.4 Lenis (`src/providers/lenis-provider.tsx`)
Stiffer/geared: `new Lenis({ lerp: 0.14, wheelMultiplier: 1, smoothWheel: true, syncTouch: false })` (higher lerp = less float). Alt duration mode: `{ duration: 0.8, easing: t => 1 - Math.pow(1-t,3), smoothWheel: true }`. Keep master rAF loop, reduced-motion early return (Lenis not instantiated), `destroy()` cleanup. `useLenis()` returns `null` under reduced-motion; all GSAP consumers null-guard.

### 6.5 GSAP calibration moment (one per route)
`src/components/motion/calibration.tsx` (client), reusing the `timeline-rail.tsx` scaffolding (`getGsap()` lazy, `gsap.context`, `matchMedia`, `lenis.on("scroll", ScrollTrigger.update)`, `focusin` a11y reveal, `ctx.revert()` cleanup). Single timeline:
1. **Rules draw-on** — SVG hairline `<line>`/`<path>`, `strokeDashoffset 1→0`, `ease:"none"`, `stagger:0.04`, **scrubbed**.
2. **Gutter indices tick up** — `TickCounter` `steps(24)`, on enter.
3. **Orange scan-line sweep** — one `bg-signal` bar, `yPercent -2→102 + opacity`, `ease:gantry`, 400ms (`cinematic`), **one-shot** (`toggleActions:"play none none none"` — never re-sweeps on scroll-up).
```ts
scrollTrigger: { trigger: scope, start: "top 70%", end: "+=60%", scrub: true, pin: false, toggleActions: "play none none none" }
```
Pin only on hero/index big moments; ledger rows never pin. A11y `focusin` guard sets final state instantly. Cleanup restores the fully-drawn (SSR/reduced-motion) DOM. Per-route mapping in §7.

### 6.6 Ledger-row hover scan-line
GSAP, delegated `pointerenter`/`pointerleave` on the ledger `<ul>` (one listener, `closest("[data-ledger-row]")`). Skip on coarse pointers + reduced-motion. Per-row cached paused timeline: (1) horizontal orange `h-px bg-signal` (hover `#FF6A3D`) sweeps `scaleX 0→1` origin-left, `ease:gantry`, 180–260ms; (2) gutter registration tick `scaleY 0→1`, `snap`, 120ms; (3) metric numerals count up (`TickCounter steps()`). Leave: reverse @120ms, numerals hold. Focus-visible triggers the same + orange `outline:1px solid var(--signal); outline-offset:2px`. Transform/opacity/color only — no reflow. Reduced-motion: static orange left-edge rule + final numerals + index weight 400→600.

### 6.7 Reduced-motion contract (first-class)
Sourced from `useReducedMotion()` (OS query via `useSyncExternalStore` OR in-app `motionPreference` in `ui-store.ts`). `MotionConfig reducedMotion="user"` covers Framer automatically. Global CSS guard:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.001ms !important; animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important; scroll-behavior: auto !important;
  }
}
```
Per moment: hairline rules → fully drawn (SSR default); counters → final tabular value; scan-lines → static orange edge; section reveals → plain `<div>`; scroll progress → `null`; magnetic → inert; Lenis → native scroll; timeline rail → full line + all items visible; hero → frozen poster (LCP). **No reduced-motion path may hide content** — the undrawn state is never the server render.

### 6.8 Telemetry & cmdk motion
Status bar values update off the Lenis scroll event + IntersectionObserver section-spy (no standalone rAF); text swaps `snappy` crossfade or `steps()` numerals, never a slide. cmdk open/close `snappy` hard cut (no scale/blur); row highlight = instant orange left-tick, not a fill.

---

## 7. Per-Page Treatment (18 Routes)

Every route mounts `IndexGutter` + global `StatusBar`; `cmdk console` + `CalibrationField <Canvas>` are singletons reused site-wide. Signal Orange is rationed to one live element per view (hero trace, hover scan-line, focus ring, or top-language bar), token-enforced, darkening to `#A62A06` in DATASHEET. Each route keeps its existing `page.tsx` data flow, RSC boundaries, and `buildMetadata()`; only presentational primitives swap. Each route gets **exactly one** GSAP calibration moment.

**1. Home (`(site)/page.tsx`).** Full-bleed datasheet, `Container size="wide"`, `IndexGutter` (`sectionCount=8`, `01–08`), `GridOverlay` behind hero + stats. Hero → **CALIBRATION FIELD** (oversized Archivo Expanded `siteConfig.name`, `HeroScene` repaint, poster=LCP, mono telemetry orbit); eyebrow → mono `00 · REFERENCE INSTRUMENT`. `PRINCIPLES` → numbered gutter footnotes. Stats strip → `DefinitionList` ledger, tabular count-up. Featured work + OSS previews → `LedgerRow`. GSAP: pinned hero calibration (rules draw, trace sweeps once, counters tick, handoff to demand).

**2. Projects index (`projects/page.tsx`).** THE LEDGER. `ProjectFilter` → mono segmented toggle above one continuous hairline ledger. `IndexGutter` (`sectionCount=2`). `LedgerRow` `PRJ-###` from `project.order`. PageHero eyebrow `INDEX · PRJ`, Archivo Expanded title. `specStrip` = `stack · year · role · metric`; `category`+`status` as mono tags; `project.accent` ignored. GSAP: rows tick + count-up on enter; hover scan-line.

**3. Project detail (`projects/[slug]/page.tsx`).** CASE STUDY. `DefinitionList` spec header (ROLE/YEAR/STATUS/CLIENT/TEAM/TIMELINE + synthetic COORD) above Archivo prose on 720 measure. `Breadcrumbs` → mono path `HOME / WORK / {slug}`. Section rules + gutter ticks between gated blocks. GSAP: `project.media` figure is the scrubbed calibration figure — grid draws in, one orange scan-line, `metrics` count up once (`steps()`). `constraints`/`lessons` dots → orange ticks; `features` grid → hairline definition rows.

**4. About (`about/page.tsx`).** Long-form paper prose, oversized flush-left pull-quotes, gutter footnote indices. `IndexGutter` (`sectionCount=6`); no LedgerRow. `AvailabilityBadge`+`SocialLinks` → mono status line. Technical-identity `StatCard`s → `DefinitionList`. `values` → flush-left numbered entries `†01…`. GSAP: one pull-quote calibration — StatCard values tick, one orange rule draws under the header.

**5. Experience (`experience/page.tsx`).** THE LEDGER; `<ol>` → stacked hairline rows, newest first. `LedgerRow` `EXP-0N`. `specStrip` = `stack · location`; `start`–`end` mono coordinate pinned right; `highlights[]` → indented mono line items with orange ticks. GSAP: each role snaps a tick + draws a date-span bar as the scan-line.

**6. Timeline (`timeline/page.tsx`).** Declassified chronological ledger; `TimelineRail` → year-banded `LedgerRow`s (year = full-width hairline band header). Prefix `TL-##` + year band. `event.date` → mono timestamp; `event.type` → orange-keyed index glyph; `ref` → mono cross-ref link. GSAP: the vertical rail draws on via `strokeDashoffset` (the big moment); event ticks snap into the gutter as each year band enters. (Rail progress line stays a sanctioned orange trace.)

**7. Achievements (`achievements/page.tsx`).** THE LEDGER. Stats strip → `DefinitionList`; `AchievementCard` grid → `LedgerRow` `ACH-0N`. `specStrip` = `category · date`. GSAP: three counters tick up (`steps()`) as the DefinitionList enters; rows scan-line on hover.

**8. Certificates (`certificates/page.tsx`).** THE LEDGER `CERT-00N`. `specStrip` = `issuer · date · skills`; `credentialId` mono coordinate pinned right; `url` → mono `VERIFY →`. GSAP: each `credentialId` "prints" char-by-char via `steps()` with a registration tick. No CTASection — terminates on ledger + StatusBar.

**9. Research (`research/page.tsx`).** THE LEDGER, two bands (Featured/Archive). `researchCategories` → mono `AREA:` filter index. `LedgerRow` `RES-0N`; `status`+`readingStatus` as mono tags. `specStrip` = `category · venue · date · authors`; `links` → mono `PDF / SRC / DOI`. GSAP: row scan-line on scroll-in; status tag steps `WIP → PREPRINT → PUBLISHED`.

**10. Blog index (`blog/page.tsx`).** Dated ledger; featured band + `TagList` + archive → hairline `LedgerRow` `NOTE-0NN`, newest first. `specStrip` = `formatDate(date) · readingTime · tags`; date = mono coordinate; `TagList` → mono `TOPIC:` strip. GSAP: date column tick-aligns into the gutter; hover scan-line.

**11. Blog detail (`blog/[slug]/page.tsx`).** CASE STUDY / paper prose. `DefinitionList` header (DATE/UPDATED/READ/TAGS) above Archivo MDX on 720 measure. TOC → gutter-pinned mono index (`INDEX`), active-section tick tracks scroll. Code blocks keep **Geist Mono**. GSAP: pinned figure scrub on first MDX image/`<pre>`; blockquote → oversized flush-left pull-quote drawing its left rule + one orange tick.

**12. Gallery (`gallery/page.tsx`).** Rigid mono-captioned **contact-sheet** grid; frames separated only by hairlines, each `FIG-00N` + timestamp in a mono caption bar. `galleryCategories` → mono filter index. Caption = `FIG-00N · {category} · {date} · {w}×{h}`. Placeholder = recolored graphite graph-paper. GSAP: frames register in with `steps()`; hover sweeps one scan-line per frame.

**13. Open Source (`open-source/page.tsx`).** Datasheet: prose philosophy (720) interleaved with ledger bands. `IndexGutter` (`sectionCount=5`). `LedgerRow`: `OSS-00N` repos, `PKG-00N` packages, `PR-0N` upstream. Actions → hairline mono buttons. GSAP: the "collaborate" callout is the moment — rule draws in, one orange scan-line sweeps.

**14. GitHub (`github/page.tsx`) — THE INSTRUMENT PANEL (showcase).** Panel grid of hairline modules, no cards/fills, `Container size="wide"`. Modules: **Identity → Vitals → Repository ledger → Language spectrum → Activity log** (`IndexGutter sectionCount=5`, indices `01–05`). Async data flow unchanged; ErrorState/EmptyState → instrument fault readouts. Identity: hairline-square avatar, mono `@login`/`htmlUrl`. Vitals: `DefinitionList` (FOLLOWERS/FOLLOWING/PUBLIC REPOS/TOTAL STARS/TOTAL FORKS), `tabular-nums` count-up. Repo ledger: `getTopRepos(repos,6)` → `LedgerRow` `REPO-0NN`, spec `★ stars · ⑂ forks · language`. **Language spectrum: all bars graphite `#2A2A2F`; only the top language's bar Signal Orange** (the one live trace), percentages tabular mono. Activity log: `recentRepos` → `LedgerRow` with `updatedAt` coordinate. GSAP: one orange scan-line sweeps top→bottom (power-on), vitals tick, top-language bar fills L→R.

**15. Philosophy (`philosophy/page.tsx`).** Long-form paper datasheet, oversized flush-left pull-quotes; two-col `SectionHeader/prose` keep asymmetry, lose card borders. `IndexGutter sectionCount=8`. `principles` self-number `01–04` → promoted to gutter with orange keying. `CodeSnippet` restyled (Geist Mono body). GSAP: the "In practice" code section — two snippets draw a top hairline + one scan-line on enter; no per-char animation.

**16. Contact (`contact/page.tsx`) — THE TRANSMISSION FORM.** Two-col grid kept (`[1.5fr_1fr]`): left transmission form, right mono aside. Fields `TX-01 NAME` / `TX-02 EMAIL` / `TX-03 MESSAGE`. Form (`contact-form.tsx`): retire the bordered card; mono field labels, hairline inputs (bottom-rule only, radius 0), orange focus ring. Submit → status-bar-style bar reporting state: idle `> TRANSMIT`, pending `> SENDING…`, success/error → `aria-live` `TX OK / TX FAIL`. Keep `useActionState`/zod/honeypot intact. Aside → `DefinitionList` (EMAIL/LATENCY/CHANNELS); `AvailabilityBadge` → mono `STATUS: OPEN`. GSAP: on success one orange scan-line sweeps top→bottom + status ticks `TX 000 → TX 001`; on error the orange rule flashes once (reduced-motion → static text).

**17–18. System routes.** Loading (`(site)/loading.tsx`, `github/loading.tsx`): StatusBar `STATE: ACQUIRING…`; skeletons render as hairline placeholder ledger rows with a slow orange scan-line. Not-found / Error / Global-error (`app/not-found.tsx`, `(site)/error.tsx`, `app/global-error.tsx`): fault readouts `ERR 404 · SIGNAL LOST` / `ERR 500 · CALIBRATION FAULT`, one orange registration tick, hairline "return to index" mono link. Reduced-motion: static.

---

## 8. Accessibility & Performance Guardrails

### 8.1 Contrast enforcement
All ratios measured against **painted** backgrounds (never `transparent`, never over the R3F canvas). Thresholds: 4.5:1 normal, 3:1 large (≥24px / ≥18.66px bold) and non-text (SC 1.4.11). See §2.1 for the full ledger. Hard rules:
- `#FF4A1C` never used as **text** in light mode — light remaps the text channel to `--signal` `#A62A06` (≥5.95:1).
- `--signal-display` (`#E23A10` light) and `--foreground-subtle` never below 24px, never body text.
- shadcn `--ring`/`--destructive`/`--primary` re-pointed at DATUM tokens; light `--destructive` (`#B4231C`) verified ≥4.5:1 on `#EDEBE3`.
- No raw signal hex outside `tokens.css` (stylelint/eslint rule).

### 8.2 Never color alone (SC 1.4.1)
Every orange element carries a second signal: ledger hover → tick glyph + index weight 400→600; active nav/section → mono prefix `▸` / `SECT 03/09` text change; telemetry live → `LIVE`/`IDLE` text + icon; form focus/validation → ring + `aria-invalid` + visible mono message via `aria-describedby`/`role="alert"`; charts → direct value labels, never hue-only series. Icon-only orange controls need `aria-label`. Inline prose links keep `underline` (or 1px bottom hairline) — never color alone.

### 8.3 Decorative chrome is inert
Grid overlay, gutter decoration, scan-lines, R3F canvas, and non-actionable telemetry: `aria-hidden="true"`, non-focusable (no tab stops), `pointer-events-none`, `user-select-none`. Grid overlay is pure CSS (no per-column DOM), `opacity ≤ 0.5`. R3F `<canvas>` `aria-hidden` + `tabIndex={-1}`; hero name + all credentials exist as real DOM text (SEO/AT), never WebGL-only. Telemetry bar `role="status"` **only** for the live submit-state slot; scroll/FPS spam `aria-hidden`; `contain: layout style paint`. If a gutter index doubles as a real anchor, expose it as a real `<a>` and mark only the tick `aria-hidden`.

### 8.4 Mono legibility floors
Never below **12px** (`0.75rem`) at any breakpoint/clamp floor; no `text-[11px]`. Eyebrows/indices/coordinates `clamp(0.75rem,0.72rem+0.15vw,0.8125rem)`, tracking 0.06–0.08em, weight 500. Telemetry 12px floor, 0.04em. Uppercase mono ≥0.12em tracking (`mono-label` 0.14em, `mono-eyebrow` 0.16em). Line-height ≥1.3. `tabular-nums` on all numerals. Body prose stays Archivo 16–18px on the 720 measure; mono banned from paragraph copy.

### 8.5 Focus-visible & forced-colors
```css
:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; border-radius: 0; }
@media (forced-colors: active) {
  :focus-visible { outline: 2px solid Highlight; outline-offset: 2px; }
  .instrument-grid, .datum-rule { forced-color-adjust: none; }
}
```
`outline` (not `box-shadow`, which forced-colors drops). Never `outline:none` without an equal replacement. Skip-to-content link (first focusable in root `layout.tsx`), visually hidden until `:focus-visible`. Tab order follows visual index order (gutter injects no tab stops). Interactive hit targets ≥24×24px (SC 2.5.8) — hairline ledger rows keep ≥24px effective height even at 1px visual rule.

### 8.6 Media-query preferences
- `prefers-reduced-motion` — the §6.7 contract (hero holds poster, no sweeps, Lenis disabled, counters final, ScrollTrigger final state). Static path ships no rAF/Lenis/ScrollTrigger → strictly cheaper.
- `prefers-reduced-transparency` — DATUM has zero glass; add a guard: `@media (prefers-reduced-transparency: reduce){ *{ backdrop-filter:none !important } .instrument-grid{ opacity:0.35 } }`.
- `prefers-contrast: more` — bump rule opacity toward `--border-strong`, promote `--foreground-subtle` → `--foreground-muted`, keep signal at the AA text token so no pairing dips below 4.5:1.

### 8.7 Performance budget
Targets (mobile Moto-G-class, field+lab): **LCP ≤ 2.5s, CLS ≤ 0.02, INP ≤ 200ms.** Baseline route JS unchanged (font/token/shader swap).
- Poster = LCP on 3D routes (inline SVG in DOM); R3F hydrates behind it, repaints in place, zero CLS.
- One continuous trace only; everything else state/scroll-driven.
- `frameloop="demand"`; pause on IntersectionObserver off-screen + `visibilitychange` hidden. DPR `[1,1.75]`.
- Grid overlay pure CSS (no per-column DOM, no async layout).
- Font swap: `display:"swap"` + `adjustFontFallback`/metrics so oversized Archivo Expanded does not reflow; `preload:true` only display/sans/mono.
- Telemetry: rAF-batched, transform/text only, `contain: layout style paint` — must not regress INP.
- Ledger scan-line: transform/opacity only (GPU), one delegated handler (no per-row ScrollTrigger).
- Bundle: GSAP+ScrollTrigger, Lenis, R3F code-split; ledger/list routes ship no R3F; exactly one `<Canvas>` in the tree.
- Mobile reflow guard: test hero + ledger headlines at `clamp()` floors on 360px — no overflow/horizontal scroll; 12-col overlay collapses to a 4-col floor without CLS.

### 8.8 Build-gate checklist (all must pass before merge)
**Contrast & color**
- [ ] Every §2.1 pairing verified from token values; axe/Lighthouse contrast = 0 serious violations on all 18 routes, both themes.
- [ ] `#FF4A1C` as text only in dark; light orange text resolves to `#A62A06` (≥5.95:1); no raw signal hex outside `tokens.css`.
- [ ] `--foreground-subtle` and `--signal-display` never below 24px / never body text.
- [ ] No orange conveys meaning without paired icon/text/index; inline prose links stay underlined.

**Structure & AT**
- [ ] Grid overlay, gutter decoration, scan-lines, R3F canvas, non-actionable telemetry are `aria-hidden` + non-focusable + `pointer-events-none`; SR pass emits no coordinate/FPS spam.
- [ ] Hero name + all credentials are real DOM text; tab order matches visual order; skip-link present and visible on focus.
- [ ] Keyboard walkthrough shows a visible 2px signal outline on every interactive element; passes forced-colors with a visible ring + intact rules.
- [ ] Interactive hit targets ≥24×24px including hairline ledger rows.

**Motion & media queries**
- [ ] `prefers-reduced-motion`: hero holds poster, no sweeps, Lenis disabled, counters final, ScrollTrigger final state.
- [ ] `prefers-reduced-transparency` + `prefers-contrast: more` blocks present and verified.
- [ ] Mono chrome ≥12px with tracking everywhere; no `text-[11px]`; tabular-nums on all numerals.

**Performance**
- [ ] Lighthouse mobile LCP ≤ 2.5s, CLS ≤ 0.02, INP ≤ 200ms on Home, `projects`, one `[slug]`.
- [ ] Poster is the measured LCP on 3D routes; WebGL repaint = 0 CLS.
- [ ] `frameloop="demand"`, `dpr={[1,1.75]}`, canvas pauses off-screen/hidden; exactly one continuous animation site-wide.
- [ ] Grid overlay pure CSS; font swap produces no measurable reflow.
- [ ] Baseline route JS ≤ current; ledger/list routes ship no Three.js; only one `<Canvas>` in the tree.

---

## 9. Phased Implementation Roadmap

Six independently shippable phases. Each phase leaves `main` green (build + typecheck + existing tests pass) and is visually coherent on its own.

### Phase 0 — Tokens & Fonts *(the cheap propagation win)*
**Goal:** every existing shadcn/brand utility resolves to DATUM values; radius→0; four font families wired. No component logic changes.
**Files:** `src/styles/tokens.css` (full rewrite §2.2), `src/styles/globals.css` (`@theme inline` color mappings §2.4a, font families §2.4b, radius scale §2.4c, easings §2.4d, `.glass` neutralization + gradient/glow flatten §2.4e, `.tabular`/`.mono-floor` utilities §2.4f, `body` padding-bottom §2.4g, reduced-motion/reduced-transparency/forced-colors/contrast blocks §8.5–8.6), `src/app/layout.tsx` (four `next/font` families + html className + `themeColor` §2.5), `next.config.ts` (`env.NEXT_PUBLIC_COMMIT_SHA` + `NEXT_PUBLIC_BUILD_TIME` §5.4).
**DoD:** all 18 routes build and render with graphite/bone palette, square corners, Archivo/Plex Mono/Geist Mono active; no glass/gradient/shadow visible; `text-accent-2` renders neutral; Lighthouse contrast clean on Home both themes; no CLS regression from font swap. *(Ships as a legitimate reskin even before primitives exist.)*

### Phase 1 — Layout Chassis & Primitives
**Goal:** the instrument grid, gutter rail, status bar, and structural primitives exist and mount, wrapping unchanged page content.
**Files (new):** `src/components/layout/{datum-shell,gutter-context,index-gutter,gutter-index,grid-overlay,rule,status-bar,definition-list}.tsx`. **(rework):** `container.tsx`, `section.tsx`, `section-header.tsx`. **(mount):** `src/app/(site)/layout.tsx` (DatumShell + GutterProvider + IndexGutter + Header/main/Footer), `src/app/layout.tsx` (StatusBar after children). **(restyle):** `header.tsx`, `footer.tsx`, `mobile-menu.tsx` (§3.12).
**DoD:** persistent left gutter renders on every `(site)` route (inline tick on mobile); fixed bottom StatusBar reports Y/SECT/theme/git/FPS and reserves 28px with no overlap; `Rule`/`GridOverlay`/`DefinitionList` usable; header/footer restyled hairline; zero CLS from rail/overlay/bar; keyboard tab order intact; StatusBar present on error/not-found.

### Phase 2 — Ledger, Motion Constants & Shared Primitives
**Goal:** `LedgerRow`/`LedgerList` + motion foundation exist; card components become adapters.
**Files (new):** `src/components/layout/ledger-row.tsx` (+ LedgerList), `src/components/motion/{tick-counter,scan-line,calibration}.tsx`. **(rewrite):** `src/constants/animation.ts` (§6.1); `src/animations/{variants,reveal,transitions,scroll}.ts`, `src/animations/easings.ts` consumers; `src/providers/lenis-provider.tsx` (§6.4); `src/components/motion/{reveal,scroll-progress}.tsx`. **(shared consumers, no page swap yet):** verify `timeline-rail.tsx` pattern reuse.
**DoD:** `LedgerRow` renders full-bleed hairline rows with GSAP hover scan-line + `steps()` count-up + gutter registration tick; reduced-motion shows static rule + final numerals; springs removed (grep: no `smoothSpring`/`bounceSpring`/`back` in chrome); Lenis geared; one-rAF rule holds (only Lenis + R3F own rAF); `TickCounter` tabular, no jitter.

### Phase 3 — Component Restyle Sweep
**Goal:** every `ui/`, `portfolio/`, `common/` component matches DATUM; cards migrated to LedgerRow/SpecList/panels.
**Files:** `ui/{button,badge,card,tabs,input,textarea,label,dialog,sheet,tooltip,dropdown-menu,command,separator,accordion,skeleton,sonner}.tsx`; all `portfolio/*` cards + `project-filter.tsx`, `tech-stack-list.tsx`; `common/{stat-card,skill-badge,tag-list}.tsx`; `shared/code-block.tsx`, `mdx/mdx-components.tsx` (§2.9). Apply §4.0 laws + §4.6 icon-chip removal.
**DoD:** no literal `rounded-*` (except intentional squares) remain (grep); no `hover:-translate-y`, no glow/glass/gradient; cmdk renders as terminal console; badges/chips mono outline; focus rings crisp orange; all icon-chips replaced by GutterIndex/square tick; visual diff of every component in Storybook/route matches spec.

### Phase 4 — Per-Page Treatment (18 routes)
**Goal:** each route composes the kit into its documented layout with one calibration moment.
**Files:** all `src/app/(site)/**/page.tsx` + adapters; `contact-form.tsx` (TRANSMISSION §7.16); loading/error/not-found system states (§7.17–18). Recommended order: ledger routes first (projects, experience, timeline, achievements, certificates, research, blog index, gallery, open-source) → case-study routes (project/[slug], blog/[slug]) → prose routes (about, philosophy) → GitHub panel → contact → home shell (excluding hero canvas) → system states.
**DoD:** every route uses correct index prefix (§4.2), exactly one GSAP calibration moment, `IndexGutter` section registration, `StatusBar` `SECT n/total` correct; contact form preserves `useActionState`/zod/honeypot and reports state to StatusBar; system routes show fault readouts; reduced-motion holds all final states.

### Phase 5 — Hero Calibration Field (WebGL)
**Goal:** repaint the single Canvas into the monochrome oscilloscope with poster-as-LCP.
**Files (new):** `src/three/scenes/{lissajous,calibration-grid-material}.ts`, `src/components/sections/{hero-poster,hero-telemetry}.tsx`, `src/hooks/{use-viewport-size,use-fps-meter}.ts`. **(rewrite):** `src/three/scenes/signal-field.tsx` → `CalibrationField`, `src/components/three/scene-canvas.tsx` (frameloop=demand + active forward), `src/three/components/r3f-canvas.tsx` (stop override), `src/three/constants.ts` (calibration constants), `src/components/sections/hero-scene.tsx` + `hero.tsx`. Build order per §5.7: config → lissajous → grid material → CalibrationField → poster → hooks/telemetry → scene-canvas → hero-scene/hero.
**DoD:** poster (inline SVG) is the measured LCP; poster→canvas handoff pixel-identical (no jump, no CLS); one orange trace is the only continuous motion; `frameloop="demand"` idles off-screen; DPR clamped; reduced-motion/no-WebGL freeze on poster, `three`/R3F never download; telemetry real (VP/Y/REF/BUILT/FPS) with fixed-width slots.

### Phase 6 — A11y & Performance Verification (release gate)
**Goal:** the §8.8 build-gate checklist passes on every route, both themes.
**Files:** none new — verification + targeted fixes across the tree; add stylelint/eslint rule banning raw signal hex outside `tokens.css`.
**DoD:** all §8.8 boxes checked — axe/Lighthouse contrast 0 serious violations ×18 routes ×2 themes; keyboard + forced-colors + reduced-motion/transparency/contrast verified; LCP ≤2.5s / CLS ≤0.02 / INP ≤200ms on Home, projects, one `[slug]`; exactly one `<Canvas>`, ledger/list routes ship no Three.js; baseline route JS ≤ current build; 360px mobile reflow clean. Merge blocked until green.
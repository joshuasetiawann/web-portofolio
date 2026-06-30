# Navigation Structure

> Purpose: Define how all 16 destinations are exposed and grouped across desktop/tablet/mobile — primary bar, Explore mega-menu, command palette, and full footer sitemap — plus sticky/scroll behavior, active states, CTA placement, breadcrumbs, and the command-menu strategy.

Related: [Information Architecture](./information-architecture.md) · [User Journey](./user-journey.md) · [UX Flow](./ux-flow.md) · [Phase 1 Foundation](./PHASE-1-FOUNDATION.md)

---

## 1. The grouping problem & model

There are **16 navigable destinations** — far too many for a flat bar. The model resolves this with a four-surface system:

| Surface | Exposes | Purpose |
|---|---|---|
| **Primary bar** | 4 anchors + theme toggle + Cmd+K | The funnel's main path, always visible |
| **Explore mega-menu** | the other 9 destinations, grouped | Discoverable depth without clutter |
| **Command palette (Cmd+K)** | everything (nav + content search) | Power-user + keyboard parity |
| **Footer** | the **full** sitemap | Comprehensive, SEO-friendly map |

### Exact nav item groupings

**Primary bar (4 + utilities):**

| Item | Route | Notes |
|---|---|---|
| Projects | `/projects` | Work anchor |
| About | `/about` | Profile anchor |
| Blog | `/blog` | Writing anchor |
| **Contact** | `/contact` | **CTA-styled** (filled, accent), always the visual emphasis |
| Theme toggle | — | next-themes, dark default |
| ⌘K trigger | — | opens command palette |

**Explore mega-menu (9, grouped):**

| Group | Items (route) |
|---|---|
| **Work** | Open Source (`/open-source`) · GitHub (`/github`) |
| **Writing** | Research (`/research`) |
| **Profile** | Philosophy (`/philosophy`) · Experience (`/experience`) · Timeline (`/timeline`) |
| **Proof** | Certificates (`/certificates`) · Achievements (`/achievements`) · Gallery (`/gallery`) |

> Projects, About, and Blog are intentionally **not** repeated inside Explore's group headers (they live in the primary bar); the mega-menu group titles may still label them as the canonical "see all" link to avoid orphaning the cluster. **Assumption:** group titles in the mega-menu are non-clickable labels; only the 9 items are links.

The **logo** is a wordmark **"Joshua Setiawan"** that collapses to a **"JS" monogram** on scroll; it always links to `/`.

---

## 2. Desktop navigation (≥1024px)

**Layout:** sticky glass top bar (`backdrop-blur 12px`, solid fallback under `prefers-reduced-transparency`), height ~64px, `z-index: 50` (sticky-header token).

```
[ JS / Joshua Setiawan ]   Projects   About   Blog   Explore ▾      [⌘K] [☼/☾] [ Contact ]
```

- **Explore ▾** opens a **mega-menu panel** (`z-index: 60`, dropdown token) on hover-intent + click/focus, grouped per §1. Opens below the bar, full-width-constrained to the content container, with the four group columns (Work / Writing / Profile / Proof).
- Keyboard: `Tab` reaches Explore; `Enter/Space` opens; `Arrow` keys move within; `Esc` closes and returns focus to the trigger (Radix semantics).
- **⌘K** chip shows the shortcut; clicking opens the palette.
- **Contact** is the only filled/accent button — the persistent primary CTA.

---

## 3. Tablet navigation (768–1023px)

- Primary bar keeps the **logo + Contact CTA + ⌘K + theme toggle** visible.
- Projects / About / Blog / Explore **collapse into a single menu button** ("Menu") to preserve breathing room, OR — if width allows — the 4 anchors stay and only **Explore** moves into the menu. **Assumption:** at 768px the four text links collapse into the menu; Contact stays as a visible CTA.
- The menu opens as a **right-side sheet** (Radix dialog, focus-trapped, `inert` background, `z-index: 80` modal token) listing: primary 4, then the Explore groups as labeled sections, then theme + Cmd+K.

---

## 4. Mobile navigation (<768px)

- **Bar:** logo (monogram-first) on the left; **Contact** CTA + **hamburger** on the right; `⌘K`/search reachable inside the sheet. Theme toggle inside the sheet.
- **Hamburger → full-height sheet** (Radix dialog: focus trap, `inert`, return-to-trigger, scroll-lock):
  1. **Primary:** Projects · About · Blog · Contact
  2. **Explore — Work:** Open Source · GitHub
  3. **Explore — Writing:** Research
  4. **Explore — Profile:** Philosophy · Experience · Timeline
  5. **Explore — Proof:** Certificates · Achievements · Gallery
  6. **Utilities:** Theme toggle · Search (opens palette) · Privacy
- Targets ≥24px (WCAG 2.5.8), comfortable 44px+ recommended. The sheet is the mobile equivalent of the desktop mega-menu — same groupings, stacked.
- `↺` Reduced-motion: sheet appears without slide/spring (fade or instant); fully keyboard/screen-reader operable.

---

## 5. Sticky & scroll-aware behavior

| Behavior | Rule |
|---|---|
| **Sticky** | Header is sticky at `z-index: 50` on all routes; never overlaps focus (focus-not-obscured, WCAG 2.4.11 — focused elements scroll clear of the bar via `scroll-margin-top`). |
| **Logo collapse** | On scroll past hero threshold, wordmark "Joshua Setiawan" morphs to "JS" monogram (Framer layout); `↺` instant swap under reduced-motion. |
| **Condense** | Bar height/padding reduces slightly after threshold; glass intensity may increase for contrast over content. |
| **Hide-on-scroll-down / show-on-scroll-up** | **Optional**, off by default to keep the **Contact CTA persistently visible**. **Assumption:** we keep the bar always visible (never hide), because the persistent CTA outweighs the few px of reclaimed space. |
| **Scroll source** | Lenis drives scroll; the header reads scroll state from the shared store (no independent scroll listener). |
| **Reduced-motion** | No morph/condense animation; static condensed state applied immediately. |

---

## 6. Active-link states

| State | Treatment |
|---|---|
| **Active (current route)** | Accent underline/indicator + `aria-current="page"`; never color-alone (shape + weight too). |
| **Active cluster (in Explore)** | When on a route inside a group (e.g. `/timeline`), the **Explore** trigger shows an active dot, and inside the open menu that item is marked `aria-current`. |
| **Hover** | Subtle foreground lift + underline grow (magnetic ≤18px on the CTA only). `↺` no magnetic under reduced-motion. |
| **Focus-visible** | `:focus-visible` **outline** ≥2px + offset (survives forced-colors), `z` above glass. |
| **Detail routes** | On `/projects/[slug]`, the **Projects** primary item stays active (section ownership); breadcrumb carries the leaf (see §9). |

---

## 7. CTA placement

| CTA | Location | Style |
|---|---|---|
| **Contact** | Persistent in header (all routes) | Filled accent button — the single emphasized nav element |
| **View Projects** | Hero primary | Filled/primary |
| **Get in touch** | Hero secondary + closing landing band | Outline → accent on hover |
| **Résumé / CV** | About + Experience headers | Secondary |
| **Full GitHub dashboard →** | `/open-source` | Text-link/secondary |
| **Subscribe (RSS)** | `/blog` + blog detail footer | Icon + text |
| **⌘K** | Header chip + mobile sheet | Utility |

**Rule:** exactly **one** filled accent CTA in the chrome at a time (Contact). Page-level CTAs use primary/secondary hierarchy so the header CTA stays unmistakable.

---

## 8. Footer navigation (full sitemap)

The footer is the **comprehensive map** — every destination, grouped identically to the IA clusters.

| Column | Links |
|---|---|
| **Work** | Projects · Project case studies (→ /projects) · Open Source · GitHub |
| **Writing** | Blog · Research |
| **Profile** | About · Philosophy · Experience · Timeline |
| **Proof** | Certificates · Achievements · Gallery |
| **Connect** | Contact · Email · LinkedIn · GitHub · RSS |
| **Utility** | Privacy · Sitemap · Theme toggle |

Footer also carries: wordmark + one-line positioning, copyright, current year, and a "back to top" (smooth via Lenis; `↺` instant). All footer links are real anchors (crawlable, JS-off safe), reinforcing SEO and giving keyboard users a flat index of the whole site.

---

## 9. Breadcrumb strategy

Breadcrumbs appear **only on nested (depth-2) routes**; top-level pages do not show them (they would be redundant with the bar).

| Route | Breadcrumb | JSON-LD |
|---|---|---|
| `/projects/[slug]` | Home › Projects › *Title* | BreadcrumbList |
| `/research/[slug]` | Home › Research › *Title* | BreadcrumbList |
| `/blog/[slug]` | Home › Blog › *Title* | BreadcrumbList |

- The leaf (current page) is **not a link** and carries `aria-current="page"`.
- Breadcrumbs sit below the sticky header, above the article `<h1>`, in `nav[aria-label="Breadcrumb"]`.
- They mirror the URL hierarchy exactly (see [Information Architecture §4](./information-architecture.md)).
- `↺` Static, no animation; always rendered server-side for crawlers.

---

## 10. Command-menu strategy (⌘K)

Built with **cmdk**; the keyboard-first equalizer that gives **every** destination and content item a one-shortcut path.

| Aspect | Spec |
|---|---|
| **Open** | `⌘K` / `Ctrl K`, header chip, mobile sheet "Search" |
| **Z-index** | overlay/modal (`70`/`80`); Radix dialog — focus trap, `inert`, return-to-trigger |
| **Sections** | **Navigation** (all 16 destinations, grouped Work/Writing/Profile/Proof/Connect) · **Content search** (flat search across projects, blog, research titles/tags) · **Actions** (toggle theme, copy email, download résumé, pause motion) |
| **Search** | flat title/tag match over Velite content (built at compile, shipped as a small index); **Recent** is deferred (foundation decision) |
| **Keyboard** | `↑/↓` move, `Enter` go, `Esc` close, type to filter; results announce count to live region |
| **Empty** | "No results — try Projects, Blog, or Contact" with those as quick links |
| **Reduced-motion** | palette appears without scale/spring; `↺` instant |
| **A11y** | labeled combobox, `aria-activedescendant`, ≥24px rows, visible focus |

**Why it matters:** the palette is the safety valve for the 16-destination problem — power users and keyboard/AT users never need to traverse the mega-menu. It is the third pillar (with Explore + footer) ensuring **no destination is ever more than one action away**. See [User Journey §6 Returning-visitor](./user-journey.md) for who relies on it most.

---

## 11. Surface coverage matrix

Confirms every destination is reachable from at least the required surfaces (primary path + comprehensive map + keyboard).

| Destination | Primary bar | Explore | Footer | ⌘K |
|---|:--:|:--:|:--:|:--:|
| Projects | ✓ | (label) | ✓ | ✓ |
| About | ✓ | (label) | ✓ | ✓ |
| Blog | ✓ | (label) | ✓ | ✓ |
| Contact | ✓ (CTA) | — | ✓ | ✓ |
| Philosophy | — | ✓ | ✓ | ✓ |
| Research | — | ✓ | ✓ | ✓ |
| Open Source | — | ✓ | ✓ | ✓ |
| Experience | — | ✓ | ✓ | ✓ |
| Timeline | — | ✓ | ✓ | ✓ |
| Gallery | — | ✓ | ✓ | ✓ |
| Certificates | — | ✓ | ✓ | ✓ |
| Achievements | — | ✓ | ✓ | ✓ |
| GitHub | — | ✓ | ✓ | ✓ |
| Privacy | — | — | ✓ | ✓ (action-adjacent) |

Every destination is reachable from the **footer** and the **command palette** at minimum; the funnel's four anchors plus Contact get the **primary bar**; the remaining nine get the **Explore** mega-menu. This satisfies the 16-destination grouping mandate without a flat over-long bar.

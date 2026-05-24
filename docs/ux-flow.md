# UX Flow

> Purpose: Specify the detailed, step-by-step interaction flows (with decision points, error states, and empty states) for every primary path across the 18 routes, so engineering implements behavior — not just layout.

Related: [User Journey](./user-journey.md) · [Information Architecture](./information-architecture.md) · [Navigation Structure](./navigation-structure.md) · [Phase 1 Foundation](./PHASE-1-FOUNDATION.md)

---

## 0. Flow conventions (legend)

| Symbol | Meaning |
|---|---|
| `→` | navigation / transition to a route |
| `◆` | decision point (branch) |
| `⤷` | sub-step / consequence |
| `⚠` | error / failure branch |
| `∅` | empty state |
| `↺` | reduced-motion / no-JS equivalent (always present) |

**Global rules that apply to every flow below:**

- **Page transitions:** Framer curtain (state/lifecycle) on route change; focus moves to `#main-content` with a polite live-region announce. `↺` Under reduced-motion the curtain is a static cross-fade or instant swap; content is visible regardless.
- **Scroll:** Lenis is the sole scroll authority; GSAP/ScrollTrigger handles scrubbed/pinned sequences via one rAF. `↺` Reduced-motion → native scroll, no pin/scrub.
- **Content-first:** every flow's content is present without animation and works JS-off where it is server-rendered.
- **Back/forward:** browser history restores scroll position and filter query-state.

---

## 1. Landing → Projects

**Goal:** move a skimmer from the hero into the work index or straight into a case study.

1. Visitor on `/`, hero rendered (poster = LCP).
2. ◆ **Entry choice:**
   - ⤷ Clicks primary CTA **"View Projects"** → `/projects`.
   - ⤷ Scrolls to **Featured Projects** band → clicks a featured card → `/projects/[slug]` (skips the index entirely).
   - ⤷ Clicks **"see all →"** on the featured band → `/projects`.
3. On `/projects`: grid of project cards loads (SSG, instant). Filter bar exposes **kind** (`software / creative / research / oss`), **status**, **tag**, **stack**.
4. ◆ **Filter interaction:** selecting a facet updates URL query (`?kind=software`) and re-renders client-side; result count announced to live region.
   - ∅ **No matches:** show empty state — "No projects match these filters" + a **Clear filters** button; never a blank grid.
5. Hover a card → cover micro-interaction (shader hover on capable devices; `↺` static cover otherwise). Card shows title, kind badge, status badge, year, top stack chips, one headline metric.
6. Click card → `→ /projects/[slug]` (see §3).

**Decision quality:** default sort `featured → year → order` ensures the strongest work is above the fold without filtering.

---

## 2. Landing → Contact

**Goal:** convert from anywhere on the landing funnel.

1. ◆ **Entry choice:**
   - ⤷ Hero secondary CTA **"Get in touch"** → `/contact`.
   - ⤷ Persistent sticky-header **Contact** CTA (present on all routes) → `/contact`.
   - ⤷ Closing landing CTA band **"Let's build something"** → `/contact`.
2. `/contact` renders the form shell (SSG) + direct channels (email, LinkedIn, calendar link) + a one-line privacy note linking `/privacy`.
3. Continue at **§10 Contact form flow**.

---

## 3. Projects → Project Details

**Goal:** deliver a credible case study and route onward (live / repo / next project / contact).

1. Arrive `/projects/[slug]` (from index, featured card, or deep link).
2. ⚠ **Unknown slug** → `notFound()` → 404 (see §11).
3. Page composition, top to bottom:
   1. **Hero:** title (`<h1>`), summary, role, year, status badge, kind; primary actions **Live ↗**, **Repo ↗**, **Case study ↗** (only those present in `links`).
   2. **Cover** (LCP image, AVIF ≤120KB) → optional R3F cover-hover accent on capable devices; `↺` static.
   3. **Case-study body** (MDX): problem → approach → architecture → decisions → results, with sticky **TOC** from `toc`.
   4. **Metrics band:** `metrics[{label,value}]` with `tabular-nums`.
   5. **Gallery** (`gallery[]`): lightbox-capable; `↺` static grid, keyboard-navigable.
   6. **Stack + tags** chips (tags link to filtered index `/projects?tag=`).
   7. **Footer nav:** ◆ **Prev / Next project** (visible Prev/Next controls per WCAG 2.5.7) + **"Back to all projects"** + **Contact CTA**.
3. ◆ **Onward choice:**
   - ⤷ **Live ↗** → external (new tab, `rel=noopener`).
   - ⤷ **Repo ↗** → GitHub repo → engineer may continue to `/open-source` or `/github`.
   - ⤷ **Next project** → `/projects/[next-slug]`.
   - ⤷ **Contact** → `/contact` (§10).
4. ∅ **No gallery / no metrics:** those sections are omitted entirely (never render empty headers).

---

## 4. Blog → Blog Details

**Goal:** deliver a readable article and capture a soft conversion (subscribe / share / read-next).

1. `/blog`: list sorted `date desc`; filter by **tag**; each card shows title, description, date, reading time, tag, optional cover.
   - ∅ **No posts / empty tag filter:** "No posts yet — subscribe to be first" + RSS link.
2. Click card → `→ /blog/[slug]`.
   - ⚠ Unknown or `draft` slug → `notFound()` (drafts are invisible in prod).
3. Article page:
   1. **Header:** title (`<h1>`), date, `updated?` ("Updated …"), reading time, tags.
   2. **Sticky TOC** (from `toc`) on desktop; collapses to top on mobile.
   3. **Body** (MDX) with Shiki code blocks (copy-button), callouts, images with `blurDataURL`.
   4. **Reading progress** indicator (GSAP scrub on desktop; `↺` hidden under reduced-motion).
   5. **Footer:** **Share** (OG renders), **Subscribe (RSS)**, **Prev/Next post**, related-by-tag list, **Contact**.
4. ◆ **Onward:** read-next (related tag) → another `/blog/[slug]`; or subscribe; or share.

---

## 5. Research → Research Details

**Goal:** present rigorous work with verifiable artifacts.

1. `/research`: list sorted `date desc`; **status** badge (`published / preprint / wip`); filter by tag/status. Each item: title, abstract excerpt, authors, venue, date.
   - ∅ **Empty:** "Research in progress — see the blog for current writing" → `/blog`.
2. Click → `→ /research/[slug]`.
   - ⚠ Unknown slug → 404.
3. Detail page:
   1. **Header:** title (`<h1>`), authors, venue, date, status badge.
   2. **Abstract** block (callout-styled).
   3. **Artifact actions:** **PDF ↗**, **DOI ↗**, **Code ↗** (only those in `links`).
   4. **Body** (MDX): full write-up with figures, citations, TOC.
   5. **Footer:** Prev/Next, back to `/research`, Contact.
4. ◆ **Onward:** **Code ↗** → repo → `/open-source` / `/github`; **DOI/PDF** → external verification.

---

## 6. Open Source → GitHub

**Goal:** move an engineer from curated highlights to the live, comprehensive dashboard.

1. `/open-source` (SSR + ISR): curated highlight cards (`why` + `role`) merged with **live** repo data (stars, language, last commit).
   - ⚠ **Live fetch fails:** render ISR-cached snapshot; if none, show curated metadata only with a quiet "live stats unavailable" note (no error wall).
   - ∅ **No curated entries:** fall back to top live repos.
2. ◆ **Onward:**
   - ⤷ Repo card **"View repo ↗"** → GitHub.
   - ⤷ Prominent **"Full GitHub dashboard →"** → `/github`.
3. `/github` (SSR + ISR ~3600s + client React Query):
   1. **Profile stats** (followers, repos, stars, total contributions).
   2. **Contribution calendar** (heat ramp tokens; hover day → count tooltip; `↺` static grid, focusable cells with `aria-label`).
   3. **Language breakdown** (chart tokens chart-1…6).
   4. **Top repos** list.
   5. **Refresh** control → React Query refetch; shows last-updated timestamp + loading skeleton during refetch.
4. ⚠ **Dashboard live fetch fails:** ISR snapshot renders; manual refresh shows a non-blocking toast (sonner) "Couldn't refresh — showing cached data."
   ∅ **Cold/no data:** skeleton → empty state "GitHub data is warming up, check back shortly."

---

## 7. Experience → Timeline

**Goal:** let a recruiter move from role detail to the full career arc.

1. `/experience`: reverse-chronological roles. Each entry: role, company, location, start–end, summary, dated highlights, stack chips. **Résumé/CV download** in header.
2. ◆ **Onward:**
   - ⤷ Entry **"See in timeline →"** → `/timeline` (deep-anchored to that event if `ref` matches).
   - ⤷ Header **"Full timeline →"** → `/timeline`.
3. `/timeline`: unified vertical timeline aggregating `type` events (`role / launch / award / talk / education / milestone`), each color/icon-coded by type with a legend; GSAP scrub reveals as you scroll (`↺` static list).
   - ◆ Event with `ref` → links to its source page (a project launch → `/projects/[slug]`, an award → `/achievements`, a role → `/experience`).
   - ∅ **Sparse data:** timeline still renders with available events; no skeleton padding.

---

## 8. Certificates → credibility proof

**Goal:** convert credentials into trust, then route to contact.

1. `/certificates`: grid of credential cards — name, issuer, date, skills chips, image/badge.
2. ◆ **Verify:** card with `credentialId` + `url` exposes **"Verify ↗"** → issuer's verification page (new tab) — honesty signal.
   - ∅ **No verify link:** show issuer + date only; never fabricate a link.
3. Adjacent **Achievements** `/achievements`: awards/recognition by `category`, each with optional `proof?`/`link?`.
4. ◆ **Onward:** credibility established → persistent **Contact** CTA → `/contact` (§10). Cross-link "See the work behind these" → `/projects`.

---

## 9. Gallery → personality layer

**Goal:** add the human/taste dimension that reassures clients and humanizes the engineer.

1. `/gallery`: masonry/justified grid from typed `gallery` data (`src, alt, caption, category, w/h, blurDataURL`). Category filter chips.
2. Images use `next/image` with `blurDataURL` (no CLS); justified layout uses known `width/height`.
3. ◆ **Interaction:** click → lightbox (Framer) with caption + category; ← → keyboard nav, Esc closes, focus returns to the trigger (Radix dialog semantics). `↺` reduced-motion → instant lightbox, no zoom.
   - ∅ **Empty category:** "Nothing here yet" within the filter, grid persists for other categories.
4. ◆ **Onward:** gallery footer cross-links **About** (`/about`) and **Contact**.

---

## 10. Contact form flow

**Goal:** frictionless, accessible, trustworthy conversion. One shared **Zod** schema validates client + Server Action.

**Fields:** name, email, message, **intent** (select: Hiring / Project inquiry / Collaboration / Other), honeypot (hidden), time-trap (timestamp).

1. `/contact` renders form (React Hook Form + Zod resolver), direct channels, and a privacy line → `/privacy`.
2. User fills fields. **Inline validation** on blur: `aria-invalid` + `aria-describedby` error text; never color-alone.
3. ◆ **Submit:**
   - ⤷ **Client-invalid** → focus the **error summary** (which lists each error and links to its field); polite live-region announces error count. No network call.
   - ⤷ **Valid** → submit button enters loading state (disabled, spinner, `aria-busy`); Server Action runs.
4. Server Action:
   - Re-validates with the **same Zod schema** (never trust the client).
   - Spam checks: **honeypot** filled OR **time-trap** too fast → silently accept-and-drop (no signal to bots).
   - Sends via **Resend**; rate-limited (in-memory/edge).
5. ◆ **Result:**
   - ✅ **Success** → **persistent inline success state** (not just a toast): "Thanks — I'll reply within X business days." Form resets; success announced politely. Optional sonner toast as secondary confirmation.
   - ⚠ **Send failure (Resend/network)** → inline error banner "Something went wrong — email me directly at [address]" with the direct mailto preserved; the user's typed message is retained, not cleared.
   - ⚠ **Rate-limited** → polite "You've sent a few already — reach me directly at [address]."
6. `↺` **JS-off / progressive:** the form posts to the Server Action and returns a server-rendered success/error state — contact works without client JS.

**Accessibility contract:** associated `<label>`s, `autocomplete`, error summary focused on submit, polite live region, persistent inline success, ≥24px targets, focus not obscured by sticky header.

---

## 11. Error states

| State | Trigger | Behavior |
|---|---|---|
| **404 (not-found)** | Unknown route / bad slug → `notFound()` | Branded `not-found.tsx`: headline, short copy, **search via Cmd+K**, links to `/projects`, `/blog`, `/`. Keeps nav + footer. |
| **Route error boundary** | Unhandled render error | Group `error.tsx`: calm message + **"Try again"** (reset) + link home; `global-error.tsx` for root failures. Never a white screen. |
| **Live-data failure** | GitHub/open-source fetch fails | Render ISR-cached snapshot; if none, degraded state + quiet note; manual refresh → non-blocking toast. Never blocks the page. |
| **Form submit failure** | Resend/network error | Inline banner + direct email fallback; input retained (see §10). |
| **External link dead** | n/a (we don't control) | Links open new tab; we cannot detect — mitigated by curating `links`. |
| **Image load failure** | Asset 404 | `blurDataURL` placeholder persists; `alt` text shows; layout holds (no CLS). |
| **Offline** | Network lost | Static, already-rendered routes remain usable; live blocks show cached/empty state. |

**Reduced-motion on error pages:** all error/404 pages are static-safe and fully keyboard-navigable.

---

## 12. Empty states

| Surface | Empty condition | Copy / action |
|---|---|---|
| `/projects` (filtered) | No matches | "No projects match these filters" + **Clear filters** |
| `/blog` | No posts / empty tag | "No posts yet — subscribe to be first" + RSS |
| `/research` | No published items | "Research in progress — see the blog" → `/blog` |
| `/open-source` | No curated highlights | Fall back to top live repos |
| `/github` | Cold cache / no data | Skeleton → "GitHub data is warming up" |
| `/gallery` (category) | Empty category | Inline "Nothing here yet"; grid persists |
| `/timeline` | Sparse events | Render available events only; no padding |
| `/certificates` | None for a skill filter | "No certificates in this area yet" |
| `/contact` | — | N/A (always actionable) |

**Principle:** an empty state is never a dead end — it always offers the nearest useful action (clear filter, subscribe, or jump to a populated cluster). See [User Journey §9 Conversion points](./user-journey.md) for where these recover the funnel.

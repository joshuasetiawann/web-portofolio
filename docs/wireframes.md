# Wireframes

> Purpose: Provide text-based, low-fidelity wireframes (desktop, tablet, mobile) for every major route of Joshua Setiawan's portfolio, showing block layout, content order, and explicit responsive reflow so engineering and design build the same structure.

Related: [Information Architecture](./information-architecture.md) · [Navigation Structure](./navigation-structure.md) · [UX Flow](./ux-flow.md) · [User Journey](./user-journey.md) · [Component Inventory](./component-inventory.md) · [Design System](./design-system.md) · [Design Tokens](./design-tokens.md) · [Creative Direction](./creative-direction.md)

---

## 0. How to read these wireframes

These are **structure**, not pixels. Visual style (color, type, glow, glass) is defined in [design-tokens](./design-tokens.md) and [design-system](./design-system.md); motion in [creative-direction](./creative-direction.md).

### Block / bracket format

Each frame is a stack of labeled blocks. A block is `[BlockName] content · content · content`. Indentation and `│ │` columns show side-by-side layout; a new line is a new vertical band.

| Token | Meaning |
|---|---|
| `[Block]` | A layout region / section |
| `·` | separator between inline items in a block |
| `│` … `│` | columns sitting side-by-side (desktop/tablet) |
| `▸` | collapses/transforms into (e.g. wordmark ▸ JS) |
| `↓` | this band stacks vertically below the previous on smaller screens |
| `⌘K` | command-palette trigger | 
| `◐` | theme toggle | 
| `3D` | persistent `<Canvas>` WebGL moment (static poster under reduced-motion / no-WebGL — the poster is the LCP) |
| `[ Button ]` | filled/primary action · `( Button )` = secondary/ghost |
| `∅` | empty-state variant noted inline |

### Breakpoints (per [design-tokens](./design-tokens.md))

| Frame | Range | Canonical width | Grid |
|---|---|---|---|
| **Desktop** | ≥ 1024px (`lg`+) | 1440 | 12-col, content 1280 / gutter clamp(1.25rem,5vw,4rem) |
| **Tablet** | 768–1023px (`md`) | 834 | 8-col |
| **Mobile** | < 768px | 390 | 4-col, single column |

### Global rules baked into every frame

- **Skip link** `Skip to content` is the first focusable element on every page; target is `#main-content`.
- **Exactly one `<h1>` per route** = the hero display type.
- **Persistent header** (`z-50`, glass) and **persistent footer** (full sitemap) wrap every route — defined once in §1, referenced as `[Header]` / `[Footer]` thereafter.
- **Single persistent `<Canvas>`** lives above content via tunnel-rat; only routes that opt in render a 3D moment, never as the LCP.
- **Content is visible without animation** and JS-off safe where server-rendered.

---

## 1. Global chrome (shared by all routes)

### 1a. Header — Desktop (≥1024px)

```
[SkipLink]  Skip to content                                    (visually hidden until focus)
[Header · sticky glass z-50]
   │ Logo: "Joshua Setiawan" ▸ "JS" on scroll │   Projects · About · Blog · [Explore ▾] │   ◐ · ⌘K · [ Contact ] │
[MegaMenu · Explore ▾ open]
   │ WORK            │ WRITING        │ PROFILE                 │ PROOF                         │
   │ Open Source     │ Research       │ Philosophy              │ Certificates                  │
   │ GitHub          │                │ Experience · Timeline   │ Achievements · Gallery        │
```

### 1b. Header — Tablet (768–1023px)

```
[Header · sticky glass z-50]
   │ "JS" monogram │ ……spacer…… │ ◐ · ⌘K · [ Menu ☰ ] │
```
- Primary links **collapse into `Menu ☰`** (full-height sheet). `Contact` becomes the top item inside the sheet. `Explore` groups render as labeled sections inside the sheet.

### 1c. Header — Mobile (<768px)

```
[Header · sticky glass z-50]
   │ "JS" │ ………… │ ◐ · [ ☰ ] │
[Drawer ☰ open · full-screen]
   [ Contact ]                         ← primary CTA pinned top
   Projects · About · Blog
   ── Explore ──
   Work:    Open Source · GitHub
   Writing: Research
   Profile: Philosophy · Experience · Timeline
   Proof:   Certificates · Achievements · Gallery
   ◐ Theme · ⌘K Search
```
- `⌘K` is still reachable (search field) but keyboard-shortcut hint hidden on touch.

### 1d. Footer — all breakpoints (reflows columns)

```
[Footer]
 Desktop:  │ Wordmark + 1-line positioning + ◐ │ Work │ Writing │ Profile │ Proof │ Connect │
 Tablet:   │ Wordmark + blurb │ Work · Writing │ Profile · Proof │ Connect │   (4 → 3 cols)
 Mobile:   Wordmark + blurb ↓ accordion groups (Work/Writing/Profile/Proof/Connect) ↓ socials row ↓ © + Privacy + Sitemap + RSS
```
- Footer always carries the **full sitemap** (all 16 destinations + Privacy + RSS). Bottom bar: `© 2026 Joshua Setiawan · Privacy · Built with Next.js`.

---

## 2. Landing — `/`

Purpose: cinematic first impression + funnel to Projects/Contact. Hero `3D` "Signal Field" (poster = LCP).

### 2a. Desktop

```
[Header]
[Hero · full-viewport]
   Eyebrow: CREATIVE DEVELOPER · SOFTWARE ENGINEER
   H1 (display-2xl): "I build immersive, engineered web experiences."
   Subcopy (body-lg, ≤2 lines) · [ View Projects ] ( Get in touch )
   Visual: 3D Signal Field — full-bleed background, content left-aligned over it
   ↳ scroll cue ⌄
[FeaturedProjects]   Title "Selected Work" · see all →
   │ Card (lg, featured) │ Card │ Card │     (3-up; cover hover shader)
[CapabilitiesStrip]  "What I do" · 3 columns: Creative Eng · Software Eng · 3D/Motion
[Philosophy teaser]  Pull-quote + ( Read the philosophy → )
[StatsBand]          tabular-nums: yrs · projects · OSS stars · talks
[Logos/Stack marquee] tech logos, reduced-motion = static row
[BlogTeaser]         "Latest writing" · 3 post cards · all posts →
[CTABand]            "Let's build something." · [ Start a project ]
[Footer]
```

### 2b. Tablet

```
[Header(tablet)]
[Hero]  Eyebrow ↓ H1 (display-xl) ↓ subcopy ↓ CTAs (inline) · 3D scaled down, behind text
[FeaturedProjects]  2-up grid (featured card full-width on top, then 2)
[CapabilitiesStrip] 3 → 2 columns (third wraps)
[Philosophy teaser] full-width
[StatsBand]         2×2 grid
[Stack marquee]     static row, smaller logos
[BlogTeaser]        2-up cards
[CTABand] · [Footer]
```

### 2c. Mobile

```
[Header(mobile)]
[Hero]  3D becomes STATIC poster (LCP) ↓ Eyebrow ↓ H1 (display-lg) ↓ subcopy ↓ [ View Projects ] (full-width) ↓ ( Get in touch )
[FeaturedProjects]  1-up stacked cards · horizontal-scroll snap optional (Prev/Next visible, not motion-gated)
[CapabilitiesStrip] single column, stacked
[Philosophy teaser] stacked
[StatsBand]         1 column (or 2×2 compact)
[Stack marquee]     static, may hide secondary logos
[BlogTeaser]        1-up stacked
[CTABand]           full-width button
[Footer(mobile accordions)]
```
Responsive deltas: 3D → poster on mobile; 3-up → 2-up → 1-up grids; CTAs go full-width and stack on mobile.

---

## 3. About — `/about`

Purpose: the person + narrative + credibility. `3D` aurora gradient-mesh accent (not LCP). JSON-LD `ProfilePage`.

### 3a. Desktop

```
[Header]
[Hero]  │ Eyebrow ABOUT · H1 "Joshua Setiawan" · role line · short bio · [ Resume ↓ ] ( Contact ) │ Portrait + aurora 3D │
[NarrativeProse]  prose 720 measure, centered: long-form story (2–3 sections w/ subheads)
[ValuesGrid]      3-up "How I work" cards (icon · title · line)
[Stack/Toolbox]   grouped chips: Languages · Frameworks · 3D/Motion · Tooling
[Highlights]      mini stats / proof row (links → Certificates, Achievements, GitHub)
[NowSection]      "Currently" — what I'm building/learning (links Timeline)
[CTABand]         ( Read my philosophy → ) · [ Get in touch ]
[Footer]
```

### 3b. Tablet

```
[Hero]  Portrait stacks ABOVE text (3D poster behind portrait) ↓ eyebrow/H1/role/bio/CTAs
[NarrativeProse] prose measure preserved, full gutter
[ValuesGrid] 3 → 2 cols
[Stack/Toolbox] chips wrap, groups stack 2-up
[Highlights] 2×2 · [NowSection] full-width · [CTABand] · [Footer]
```

### 3c. Mobile

```
[Hero] STATIC portrait/poster ↓ eyebrow ↓ H1 (display-lg) ↓ role ↓ bio ↓ [Resume] ( Contact ) full-width
[NarrativeProse] single column
[ValuesGrid] 1-up stacked
[Stack/Toolbox] chip groups stacked, horizontal-scroll chip rows
[Highlights] 1 col · [Now] stacked · [CTABand] full-width · [Footer]
```
Deltas: side-by-side hero → stacked; aurora 3D → static portrait on mobile; value cards 3→2→1.

---

## 4. Engineering Philosophy — `/philosophy`

Purpose: depth-of-thinking manifesto. MDX singleton / structured principle sections; long-read editorial.

### 4a. Desktop

```
[Header]
[Hero]  Eyebrow PHILOSOPHY · H1 (display-xl) · 1-sentence thesis · est. read time
[PrinciplesNav · sticky left rail]   01 · 02 · 03 … (scroll-spy, active highlight)  │  [PrincipleSections · right]
   │ 01 Title │ principle prose (measure 65–72ch) · pull-quote · optional code/diagram
   │ 02 Title │ …
   │ 03 Title │ …
[ClosingStatement]  large pull-quote
[CrossLinks]  ( See it applied → Projects ) ( How I work → About )
[Footer]
```

### 4b. Tablet

```
[Hero]
[PrinciplesNav] becomes a horizontal sticky chip strip ABOVE content (scroll-spy)
[PrincipleSections] full-width single column, prose measure kept
[ClosingStatement] · [CrossLinks] · [Footer]
```

### 4c. Mobile

```
[Hero] (display-lg)
[PrinciplesNav] collapsible "Jump to" select / accordion at top
[PrincipleSections] stacked; pull-quotes full-bleed; code blocks horizontal-scroll
[ClosingStatement] · [CrossLinks stacked] · [Footer]
```
Deltas: sticky left rail → horizontal chip strip → "Jump to" select.

---

## 5. Projects — `/projects`

Purpose: filterable work index. Default sort `featured → year → order`. Filter state in URL query.

### 5a. Desktop

```
[Header]
[PageHeader]  Eyebrow WORK · H1 "Projects" · 1-line intro · result count (live region)
[FilterBar · sticky]  Kind: software/creative/research/oss · Status · Tag ▾ · Stack ▾ · Sort ▾ · ( Clear )
[ProjectGrid · 3-col]
   │ Card │ Card │ Card │
   │ Card │ Card │ Card │     Card = cover(hover shader) · title · kind+status badges · year · stack chips · 1 metric
   ∅ No matches → "No projects match these filters" + ( Clear filters )
[Footer]
```

### 5b. Tablet

```
[PageHeader]
[FilterBar] facets collapse into ( Filters ▾ ) button → opens popover/sheet; Sort stays inline
[ProjectGrid] 2-col
[Footer]
```

### 5c. Mobile

```
[PageHeader]
[FilterBar] sticky compact: ( Filters ) ( Sort ) → bottom-sheet; active filters shown as removable chips row
[ProjectGrid] 1-col stacked cards (cover static; shader off)
∅ empty state full-width
[Footer]
```
Deltas: 3→2→1 col; inline filters → popover → bottom-sheet; hover shader off on touch; active-filter chips appear on mobile for clarity.

---

## 6. Project Details — `/projects/[slug]`

Purpose: case study. JSON-LD `CreativeWork` / `SoftwareSourceCode`. Cover hover shader on related cards only.

### 6a. Desktop

```
[Header]
[Breadcrumb]  Home / Projects / {Title}
[CaseHero]  Eyebrow {kind} · H1 {title} · {role · year · status} · summary · links{ [ Live ] (Repo) (Case study) } · cover (full-bleed)
[MetaBar]   Role · Year · Stack chips · Status badge      (tabular where numeric)
[Body · 2-col]   │ TOC (sticky left) │ MDX prose (measure 65–72ch): Overview · Problem · Approach · Build · Outcome │
[MetricsBand]  metric cards [{label,value}] tabular-nums
[Gallery]   masonry / grid of project images (lightbox)
[NextPrev]  ( ← Prev project )            ( Next project → )
[RelatedProjects]  3-up cards
[CTABand]   "Like what you see?" · [ Get in touch ]
[Footer]
```

### 6b. Tablet

```
[Breadcrumb] · [CaseHero] cover below text
[MetaBar] wraps to 2 rows
[Body] TOC becomes top "On this page ▾"; prose full-width
[MetricsBand] 2×N grid · [Gallery] 2-col masonry · [NextPrev] inline · [Related] 2-up · [CTA] · [Footer]
```

### 6c. Mobile

```
[Breadcrumb (condensed: ‹ Projects)]
[CaseHero] cover static ↓ kind ↓ H1 ↓ meta stacked ↓ links stacked full-width
[MetaBar] stacked list
[Body] TOC = "On this page" accordion; prose single column; code horizontal-scroll
[MetricsBand] 1–2 col · [Gallery] 1-col + lightbox · [NextPrev] stacked buttons · [Related] 1-up · [CTA] full-width · [Footer]
```
Deltas: sticky TOC → top accordion; cover hover → static; galleries reflow masonry → 1-col.

---

## 7. Research — `/research` (+ `/research/[slug]`)

Purpose: scholarly index + article. JSON-LD `ScholarlyArticle` on detail.

### 7a. Index — Desktop

```
[Header]
[PageHeader]  Eyebrow RESEARCH · H1 "Research" · intro · count
[FilterBar]   Status: published/preprint/wip · Tag ▾ · Year ▾
[ResearchList · rows or 2-col]
   │ {title} · authors · venue · date · status badge · links{ PDF · DOI · Code } │
   ∅ "No papers yet — preprints in progress."
[Footer]
```

### 7b. Detail `/research/[slug]` — Desktop

```
[Breadcrumb]  Home / Research / {title}
[ArticleHero] Eyebrow {status} · H1 {title} · authors · venue · date · links{ [ PDF ] (DOI) (Code) }
[Abstract]    callout block (prose 720)
[Body · 2-col]  │ TOC sticky │ MDX: sections, figures, citations │
[References]  numbered list
[CrossLinks]  ( Related projects ) ( Back to Research )
[Footer]
```

### 7c. Tablet / Mobile (both index + detail)

```
Tablet:  list rows full-width; FilterBar → ( Filters ▾ ); detail TOC → top "On this page ▾"; abstract full-width
Mobile:  each research row stacks (title ↓ authors ↓ venue/date ↓ status ↓ link buttons row);
         FilterBar → bottom-sheet; detail: abstract → collapsible; TOC accordion; figures full-bleed + caption
```
Deltas: 2-col detail → single column; link clusters become full-width button rows on mobile.

---

## 8. Open Source — `/open-source`

Purpose: curated highlights + **live** GitHub repo data (TanStack Query; server-fetch + ISR, client refresh).

### 8a. Desktop

```
[Header]
[PageHeader]  Eyebrow OPEN SOURCE · H1 · intro · ( View GitHub dashboard → )
[Highlights]  2–3 featured contribution cards (curated): repo · role · impact · stars/forks (tabular)
[ReposGrid · live · 3-col]
   │ RepoCard: name · desc · lang dot · ★ stars · ⑂ forks · updated │ … │
   [State] loading → skeleton cards · error → "Couldn't load repos" + ( Retry ) · ∅ → curated only
[ContributionNote] philosophy of contributing
[CTABand] ( Sponsor / collaborate )
[Footer]
```

### 8b. Tablet

```
[PageHeader] · [Highlights] 2-up · [ReposGrid] 2-col · skeleton/error inline · [Footer]
```

### 8c. Mobile

```
[PageHeader] · [Highlights] 1-up stacked · [ReposGrid] 1-col · refresh control compact ↻ · [Footer]
```
Deltas: live repo grid 3→2→1; live-data states (loading skeleton / error+retry / empty) preserved at all sizes.

---

## 9. Blog — `/blog`

Purpose: writing index. RSS at `/rss.xml`. SSG cards.

### 9a. Desktop

```
[Header]
[PageHeader]  Eyebrow WRITING · H1 "Blog" · intro · ( RSS )
[FeaturedPost]  full-width: cover · title · description · date · reading time · tags
[FilterBar]   Tag ▾ · Sort (newest/oldest) · search field
[PostGrid · 3-col]
   │ PostCard: cover · title · desc · date · reading time · tags │
   ∅ "No posts match." + ( Clear )
[Pagination / load-more]
[Footer]
```

### 9b. Tablet

```
[FeaturedPost] full-width · [FilterBar] → ( Filters ▾ ) + search · [PostGrid] 2-col · [Footer]
```

### 9c. Mobile

```
[FeaturedPost] cover static, stacked text · [FilterBar] sticky: search + ( Tags ) sheet · [PostGrid] 1-col · load-more button · [Footer]
```
Deltas: featured banner reflows text below cover; grid 3→2→1; filters → sheet.

---

## 10. Blog Details — `/blog/[slug]`

Purpose: the read. JSON-LD `BlogPosting`. Shiki dual-theme code.

### 10a. Desktop

```
[Header]
[Breadcrumb]  Home / Blog / {title}
[ArticleHero]  H1 {title} · date · updated? · reading time · tags · cover?
[Body · 2-col]  │ TOC sticky + reading progress │ MDX prose (measure 65–72ch): headings, code, callouts, images │
[ShareRow]   copy-link · socials
[AuthorCard]  mini bio + ( About → )
[NextPrev]   ( ← Older )            ( Newer → )
[RelatedPosts]  3-up
[Footer]
```

### 10b. Tablet

```
[Breadcrumb] · [ArticleHero] cover below title
[Body] TOC → top "On this page ▾" + thin progress bar under header; prose full-width
[ShareRow] · [AuthorCard] · [NextPrev] · [RelatedPosts] 2-up · [Footer]
```

### 10c. Mobile

```
[Breadcrumb ‹ Blog] · [ArticleHero] cover static, stacked
[ProgressBar] under sticky header
[Body] TOC accordion; prose single column; code horizontal-scroll w/ copy
[ShareRow] · [AuthorCard] · [NextPrev stacked] · [RelatedPosts 1-up] · [Footer]
```
Deltas: sticky TOC+progress → top progress bar + accordion; related 3→2→1.

---

## 11. Experience — `/experience`

Purpose: career proof. Typed data (role,company,start,end,location,summary,highlights[],stack[]).

### 11a. Desktop

```
[Header]
[PageHeader]  Eyebrow EXPERIENCE · H1 · intro · [ Download CV ↓ ]
[ExperienceTimeline · vertical spine, alternating or left-anchored]
   ● {Role} — {Company} · {start–end} · {location}
       summary · highlights (bullets) · stack chips
   ● {Role} — {Company} · …
[SkillsSummary]  grouped competency bars / chips (tabular years)
[CrossLinks] ( Timeline → ) ( Certificates → )
[Footer]
```

### 11b. Tablet

```
[PageHeader] · [Timeline] left-anchored spine (no alternating) · entries full-width cards · [SkillsSummary] 2-col · [Footer]
```

### 11c. Mobile

```
[PageHeader] · [Timeline] left rail dots, content right, single column; highlights collapse to "Details ▾" optional
[SkillsSummary] 1-col chip groups · [CrossLinks stacked] · [Footer]
```
Deltas: alternating spine → left-anchored → compact left-rail; CV button full-width on mobile.

---

## 12. Timeline — `/timeline`

Purpose: aggregated chronology (role/launch/award/talk/education/milestone). GSAP scrub/pin moment (reduced-motion = static list).

### 12a. Desktop

```
[Header]
[PageHeader]  Eyebrow TIMELINE · H1 · intro · TypeFilter chips (All · Role · Launch · Award · Talk · Education · Milestone)
[TimelineTrack · horizontal scrub OR pinned vertical spine]
   ──●────●──────●───●──────●──   (year markers; events as nodes; scrub reveals)
   Event card: date · type badge · title · description · ref →
   ↺ reduced-motion: plain reverse-chronological vertical list, no pin/scrub
[YearJump]  sticky year index (2020 · 2021 · … · 2026)
[Footer]
```

### 12b. Tablet

```
[PageHeader + TypeFilter wraps] · [TimelineTrack] vertical spine (no horizontal scrub), event cards full-width · [YearJump] top chip row · [Footer]
```

### 12c. Mobile

```
[PageHeader] · TypeFilter horizontal-scroll chips · [Timeline] vertical single-column list, dot + card; YearJump = "Jump to year ▾"
[Footer]
```
Deltas: horizontal scrub → vertical spine → simple list; visible Prev/Next & year index keep horizontal navigation accessible (2.5.7).

---

## 13. Gallery — `/gallery`

Purpose: visual craft. Typed images (src,alt,caption,category,blurDataURL,date). Lightbox.

### 13a. Desktop

```
[Header]
[PageHeader]  Eyebrow GALLERY · H1 · intro · CategoryFilter chips
[MasonryGrid · 3–4 col]  image (blur-up) · hover: caption overlay
[Lightbox · on click]  large image · caption · category · date · ‹ Prev · Next › · ✕ close (focus-trapped)
[Footer]
```

### 13b. Tablet

```
[PageHeader + CategoryFilter] · [MasonryGrid] 2–3 col · [Lightbox] full-width w/ Prev/Next · [Footer]
```

### 13c. Mobile

```
[PageHeader] · CategoryFilter horizontal-scroll chips · [MasonryGrid] 1–2 col · tap → Lightbox (swipe + visible ‹ › buttons, not motion-gated) · [Footer]
```
Deltas: 4→3→2/1 col masonry; lightbox always has visible Prev/Next + close; blur-up placeholders prevent CLS at every size.

---

## 14. Certificates — `/certificates`

Purpose: credential proof. Typed data (name,issuer,date,credentialId?,url?,image,skills[]).

### 14a. Desktop

```
[Header]
[PageHeader]  Eyebrow CERTIFICATES · H1 · intro · IssuerFilter / SkillFilter ▾
[CertGrid · 3-col]
   │ CertCard: badge/image · name · issuer · date · skills chips · ( Verify ↗ credentialId ) │
[Footer]
```

### 14b. Tablet

```
[PageHeader] · filters → ( Filters ▾ ) · [CertGrid] 2-col · [Footer]
```

### 14c. Mobile

```
[PageHeader] · filter sheet · [CertGrid] 1-col stacked cards · Verify full-width link · [Footer]
```
Deltas: 3→2→1; verify link & credential id always visible (never color-only status).

---

## 15. Achievements — `/achievements`

Purpose: awards/milestones. Typed data (title,date,category,description,link?,proof?).

### 15a. Desktop

```
[Header]
[PageHeader]  Eyebrow ACHIEVEMENTS · H1 · intro · CategoryFilter chips
[AchievementGrid · 2–3 col]
   │ Card: category badge · title · date · description · ( View proof ↗ ) │
[StatsBand]  totals by category (tabular)
[Footer]
```

### 15b. Tablet

```
[PageHeader + CategoryFilter] · [Grid] 2-col · [StatsBand] 2×2 · [Footer]
```

### 15c. Mobile

```
[PageHeader] · CategoryFilter horizontal chips · [Grid] 1-col · [StatsBand] stacked · [Footer]
```
Deltas: 3→2→1; proof links full-width; stats reflow to 2×2 / stacked.

---

## 16. GitHub Dashboard — `/github`

Purpose: **live** GitHub stats. Server fetch + ISR (~3600s) + `GITHUB_TOKEN`; client React Query refresh. Charts use chart-1…6; contribution heat ramp. 3D-heaviest route (optional constellation depth).

### 16a. Desktop

```
[Header]
[ProfileHeader]  avatar · name · @handle · bio · followers/following (tabular) · ↻ Refresh · ( Open Source → )
[StatCards · 4-up]  Repos · Stars · Contributions(yr) · Streak
[ContributionCalendar · full-width]  52-wk heat grid (ramp #10131F→#8FC2FF) · optional 3D depth/constellation (poster fallback)
[Charts · 2-col]   │ Language breakdown (donut, chart-1..6) │ Commits over time (area/line) │
[TopRepos · 2–3 col]  RepoCard: name · desc · lang · ★ · ⑂ · updated
   [States] loading → skeletons · error → "GitHub data unavailable" + ( Retry ) + stale note · ∅ → hide section
[Footer]
```

### 16b. Tablet

```
[ProfileHeader] avatar above text · [StatCards] 2×2 · [ContributionCalendar] horizontal-scroll if needed (2.5.7 Prev/Next), 3D→poster
[Charts] stack to 1-col · [TopRepos] 2-col · states inline · [Footer]
```

### 16c. Mobile

```
[ProfileHeader] stacked, avatar centered · [StatCards] 2×2 compact · ↻ refresh icon
[ContributionCalendar] horizontal-scroll with visible ‹ › + "recent weeks" default view; 3D = static poster
[Charts] 1-col stacked (donut → list legend) · [TopRepos] 1-col · loading/error/retry preserved · [Footer]
```
Deltas: 3D depth → poster on tablet/mobile; charts 2→1 col; calendar gains horizontal-scroll with visible controls; all live-data states (loading/error+retry/stale/empty) present everywhere.

---

## 17. Contact — `/contact`

Purpose: convert. Server Action + one shared Zod schema; Resend email; sonner toast; collects PII → links `/privacy`.

### 17a. Desktop

```
[Header]
[PageHeader]  Eyebrow CONTACT · H1 "Let's talk." · 1-line intro
[Body · 2-col]
   │ FormCard                                  │ DirectChannels                    │
   │  Name*        [____________]              │  Email ↗                          │
   │  Email*       [____________]              │  LinkedIn ↗                       │
   │  Subject      [____________]              │  Book a call ↗ (calendar)         │
   │  Message*     [____________]              │  Response time note               │
   │  [ Send message ]  · privacy note → /privacy                                  │
   │  States: inline errors (aria-invalid+describedby) · error summary on submit (focused) ·
   │          polite live region · persistent inline success + toast                │
[Footer]
```

### 17b. Tablet

```
[PageHeader] · [Body] form full-width on top, DirectChannels below (2→1 stacking) · same validation/states · [Footer]
```

### 17c. Mobile

```
[PageHeader] · [FormCard] single column, full-width inputs (≥24px targets, autocomplete attrs)
[ErrorSummary] focused on submit · [Success] persistent inline + toast
[DirectChannels] stacked below as tappable rows · privacy note · [Footer]
```
Deltas: 2-col form/channels → stacked; error summary, live region, success, and labels identical across breakpoints (a11y-critical); buttons full-width on mobile.

---

## 18. 404 — `not-found.tsx`

Purpose: graceful recovery. Global noindex on non-prod; helpful routes out.

### 18a. Desktop

```
[Header]
[NotFound · centered]
   Big "404" (display) · "This page drifted off the grid." · subcopy
   [ Back home ] ( View Projects ) ( Search ⌘K )
   Optional small 3D/visual flourish (poster fallback)
[SuggestedLinks]  Projects · Blog · About · Contact
[Footer]
```

### 18b. Tablet

```
[NotFound] centered, slightly smaller display · CTAs inline (wrap) · [SuggestedLinks] row · [Footer]
```

### 18c. Mobile

```
[NotFound] centered · display-lg · [ Back home ] full-width ↓ ( View Projects ) ↓ ( Search )
[SuggestedLinks] stacked list · [Footer]
```
Deltas: visual flourish → static/omitted on mobile; CTAs stack full-width; suggested links reflow row → list.

---

## 19. Loading & skeletons (cross-route note)

`loading.tsx` (global + per-segment) mirrors each page's block skeleton so layout doesn't shift (CLS ≤ 0.02):

| Route | Skeleton shape |
|---|---|
| Projects / Blog / Research | header bar + filter bar + N card placeholders matching grid cols |
| Project/Blog detail | breadcrumb + hero block + TOC rail + prose lines |
| GitHub / Open Source | profile/stat-card blocks + chart/calendar placeholders + repo-card skeletons |
| Gallery | masonry of blur-up image placeholders (fixed aspect, no reflow) |

Skeletons reflow with the same breakpoint rules as their page (3→2→1 cols), so the loading frame always matches the loaded frame.

---

## 20. Responsive reflow summary (quick reference)

| Pattern | Desktop ≥1024 | Tablet 768–1023 | Mobile <768 |
|---|---|---|---|
| Header nav | full bar + Explore mega-menu | `Menu ☰` sheet | `☰` full-screen drawer |
| Logo | wordmark ▸ JS on scroll | JS monogram | JS monogram |
| Card grids | 3–4 col | 2 col | 1 col (snap optional) |
| Filters | inline bar | `Filters ▾` popover | bottom-sheet + active-chip row |
| Detail TOC | sticky side rail | top `On this page ▾` | accordion |
| Hero side-by-side | text + visual columns | visual stacks above text | static poster + stacked text |
| 3D `<Canvas>` | live (never LCP) | poster on heavy routes | static poster (LCP where hero) |
| Charts (GitHub) | 2-col | 1-col | 1-col + list legends |
| CTAs/buttons | inline | inline (wrap) | full-width stacked |
| Footer | 4–6 cols | 3 cols | accordion groups |

All horizontal/scrubbed views (Projects snap, Timeline, Gallery lightbox, GitHub calendar) expose **visible Prev/Next** and fall back to a **static layout under reduced-motion** per [creative-direction](./creative-direction.md) and WCAG 2.5.7 / 2.2.2.

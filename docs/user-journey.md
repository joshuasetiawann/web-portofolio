# User Journey

> Purpose: Narrate the concrete, step-by-step experiences of every visitor type across the 18 routes — from the first 5 seconds to conversion — so every page earns its place in a measurable funnel.

Related: [Information Architecture](./information-architecture.md) · [UX Flow](./ux-flow.md) · [Navigation Structure](./navigation-structure.md) · [Phase 1 Foundation](./PHASE-1-FOUNDATION.md) · [Content Checklist](./CONTENT-CHECKLIST.md)

---

## 0. Audiences & intent

Joshua Setiawan is positioned as a hybrid **Creative Developer + Software Engineer**. Four primary audiences arrive with different intents, different patience, and different proof requirements. Every journey below is designed to convert _that_ audience without taxing the others.

| Persona | Arrives from | Primary intent | Patience | Decision driver | Conversion |
|---|---|---|---|---|---|
| **Recruiter / Hiring Manager** | LinkedIn, referral, CV link | "Is this person credible, senior, and a culture fit — fast?" | Low (skim, 30–90s) | Proof of seniority + breadth + signal of taste | Contact / résumé / book intro |
| **Engineer peer / Tech Lead** | GitHub, Hacker News, dev Twitter/X, blog share | "Is the craft real? Can they actually build?" | Medium (will read code) | Depth, source, write-ups, reproducibility | Star repo / read more / follow / contact |
| **Prospective client / Founder** | Referral, agency search, social | "Can this person ship my product and make it feel premium?" | Low–medium | Outcomes, polish, reliability, process | Contact / project inquiry |
| **Returning visitor** | Direct, bookmark, RSS, newsletter | "What's new?" | Variable | Freshness, new writing/work | Re-read / subscribe / share |

**Assumption:** Recruiter and client traffic skews mobile; engineer traffic skews desktop. The journeys below assume **dark theme default** and that **all primary content is visible without animation** (motion is enhancement, never a gate).

---

## 1. The first 5 seconds (Landing `/`)

The hero is a single, decisive impression. It must communicate _who_, _what_, and _why-credible_ before any scroll.

**Frame-by-frame (cold load, p75 mobile, LCP ≤ 2.5s):**

1. **0.0–0.4s** — Brand-black `#05070D` paints instantly. The **static hero poster IS the LCP element** (the WebGL "Signal Field" never blocks LCP). No layout shift (CLS ≤ 0.02) because fonts ship with fallback metrics.
2. **0.4–1.2s** — The `display-2xl` headline resolves: a one-line value proposition naming the hybrid identity (e.g. _"Creative Developer & Software Engineer — I build interfaces that feel inevitable."_). This headline **is the page's single `<h1>`**.
3. **1.2–2.0s** — Eyebrow (Geist Mono, uppercase) + sub-headline establish specialization; the **azure→teal signature gradient** appears as a restrained accent, not decoration.
4. **2.0–2.5s** — Two CTAs settle into focusable order: **primary "View Projects"**, **secondary "Get in touch."** Sticky header glass-bar is present with primary nav + theme toggle + Cmd+K trigger.
5. **On capable devices only** — the persistent `<Canvas>` upgrades the poster into the live particle field (`frameloop="demand"`), an _enhancement_ that never delays interactivity.

**What the visitor must be able to conclude in 5 seconds:** _name, dual discipline, seniority signal (taste of the craft itself), and a clear next step._ The medium is the proof — the landing page's own polish is the first proof point.

**Reduced-motion / save-data / no-WebGL:** the poster stays static, copy and CTAs are identical, nothing is lost. An explicit **Pause-motion** control is always reachable (WCAG 2.2.2).

---

## 2. The first scroll (Landing `/`)

The landing page is a **curated funnel hub**, not a dumping ground. Scroll order is engineered so each audience finds their proof early, then is routed to a deep page.

| Order | Section | Job | Routes onward |
|---|---|---|---|
| 1 | **Hero** | Identity + dual CTA | `/projects`, `/contact` |
| 2 | **Featured Projects (2–3)** | Show range immediately (software + creative) | `/projects/[slug]`, `/projects` |
| 3 | **Proof strip / metrics** | Years, shipped products, OSS stars, signal logos | `/experience`, `/github` |
| 4 | **Philosophy teaser** | One sharp principle — signals seniority of _thought_ | `/philosophy` |
| 5 | **Selected writing (latest 2–3)** | Demonstrates communication + depth | `/blog`, `/blog/[slug]` |
| 6 | **GitHub pulse** | Live contribution graph — "still active, still building" | `/github` |
| 7 | **About teaser + human note** | Trust + personality | `/about`, `/gallery` |
| 8 | **Closing CTA band** | Convert — restated contact invite | `/contact` |

Decision point at every band: a **"see all →"** affordance lets impatient skimmers jump deep, while scrollers are carried to the next proof. The closing CTA guarantees that even a full-scroll reader ends on a conversion surface.

---

## 3. Recruiter journey

**Goal:** confirm credible + senior + fits, then capture contact — in under two minutes.

1. Lands on `/` (often from a CV/LinkedIn link). Reads hero `<h1>` → dual identity registered.
2. Skims **Featured Projects** + **proof strip** → seniority and range confirmed without scrolling far.
3. Taps primary nav **About** → `/about`: photo, concise narrative, current role, location, stack, **résumé/CV download**, and `ProfilePage` JSON-LD. This is the recruiter's anchor page.
4. (Optional credibility loop) **Explore → Experience** `/experience`: roles, companies, dated highlights, stack tags. From a single timeline entry they can jump to **Timeline** `/timeline` for the full arc, or to **Certificates** `/certificates` / **Achievements** `/achievements` for verifiable proof.
5. Converts via **Contact** `/contact`: short form (name, email, message, intent) with inline validation, persistent success state, and alternative direct channels (email, LinkedIn, calendar link).

**Recruiter exit ramps if not converting now:** résumé download (asset captured offline), LinkedIn follow, bookmark. Every recruiter page surfaces the **Contact CTA in the sticky header** so conversion is always one tap away.

---

## 4. Developer / engineer-peer journey

**Goal:** verify the craft is real, then follow/star/contact.

1. Often lands deep — directly on a `/blog/[slug]` (from a share) or `/projects/[slug]`.
2. On a **Project Detail**, reads the case study: problem → approach → architecture → results, with real **metrics**, **stack** chips, and links to **live** + **repo**.
3. Follows **repo** link OR navigates **Explore → Open Source** `/open-source`: curated OSS highlights + live repo cards (stars, language, last commit) powered by the GitHub API.
4. Jumps to **GitHub Dashboard** `/github`: live profile stats, contribution calendar, language breakdown, top repos — the definitive "is this person actually shipping" proof, refreshable client-side via React Query.
5. Reads **Engineering Philosophy** `/philosophy` to gauge judgment and values (testing, performance budgets, accessibility as a default).
6. Returns to **Blog** `/blog` for technical depth; may grab the **RSS** feed.
7. Converts softly: star a repo, follow on GitHub, subscribe — or hard: **Contact** for collaboration.

**Why this works:** the engineer is given _source-level_ and _live_ evidence (repos, dashboards, code-syntax-perfect write-ups), not marketing claims. The site never asks them to trust — it lets them verify.

---

## 5. Client / founder journey

**Goal:** believe Joshua can ship their product _and_ make it feel premium.

1. Lands on `/` → the page's own craft is the pitch; **Featured Projects** show shipped outcomes.
2. Opens a **Project Detail** with a **case-study** link → reads outcome-first narrative: the business problem, the role, measurable **metrics** (conversion, performance, launch), and visual proof (cover + gallery).
3. Skims **Experience** `/experience` for reliability signals (tenure, companies) and **Achievements** `/achievements` for awards/recognition.
4. Browses **Gallery** `/gallery` — the personality/taste layer that reassures a client the work will look expensive.
5. Converts via **Contact** `/contact`, selecting an intent (e.g. "Project inquiry"), which tailors the acknowledgement copy.

**Client trust accelerators:** outcome metrics on every project card, a clear statement of services/role, fast and obviously-polished UI (the product is the proof), and a frictionless inquiry form with a real reply commitment.

---

## 6. Returning-visitor journey

**Goal:** surface what's new, reward the return, deepen the relationship.

1. Direct/bookmark/RSS entry, frequently straight to `/blog` or `/`.
2. **Freshness cues:** latest writing on the landing page, `updated` dates on posts, "new" markers on recently shipped projects, the live GitHub pulse always current.
3. Picks up the **RSS** feed (`/rss.xml`) or follows social for push updates.
4. Re-engages with new **Project Details**, **Research** (`/research` + `/research/[slug]`), or **Timeline** milestones.
5. Shares a post (OG image renders cleanly per route) — turning a returning visitor into a referral source.

**Returning-visitor respect:** no re-onboarding, no nag modals; the command palette (Cmd+K) lets power users jump anywhere instantly; the site remembers theme via `next-themes`.

---

## 7. Trust-building moments

Trust is accumulated, not asserted. These are the deliberate moments, mapped to where they fire.

| Moment | Where | Signal it sends |
|---|---|---|
| Instant, no-CLS, sub-2.5s load | Every route | Engineering competence, respect for the visitor |
| The site's own craft | Landing, transitions | "The portfolio is the portfolio" — medium = proof |
| Live GitHub data | `/github`, `/open-source`, landing pulse | Active, real, verifiable |
| Real metrics on projects | `/projects/[slug]` | Outcomes, not adjectives |
| Verifiable credentials | `/certificates` (credential IDs + verify links) | Honesty, audit-ability |
| Case studies w/ named role | `/projects/[slug]` | Accountability, clarity |
| Engineering philosophy | `/philosophy` | Judgment, values, seniority of thought |
| Accessible + reduced-motion safe | Global | Cares about all users → cares about your users |
| Privacy line + `/privacy` | Contact form | Trustworthy with PII |
| Consistent voice & polish in writing | `/blog`, `/research` | Communication ability |

---

## 8. Proof points (evidence inventory)

| Proof type | Surface | Audience it convinces |
|---|---|---|
| **Shipped products** | Featured Projects, `/projects` | Recruiter, Client |
| **Source code & live repos** | `/open-source`, `/github`, project repo links | Engineer |
| **Contribution activity (live)** | `/github`, landing pulse | Engineer, Recruiter |
| **Quantified outcomes (metrics)** | `/projects/[slug]` | Client, Recruiter |
| **Written depth** | `/blog`, `/blog/[slug]` | Engineer, Recruiter |
| **Research rigor** | `/research`, `/research/[slug]` | Engineer, Academic-leaning recruiter |
| **Career arc** | `/experience`, `/timeline` | Recruiter, Client |
| **Credentials** | `/certificates`, `/achievements` | Recruiter, Client |
| **Taste & personality** | `/gallery`, hero craft | Client, all |
| **Values & judgment** | `/philosophy` | Engineer, senior recruiter |

---

## 9. Conversion points

Conversion is defined broadly: **hard** (contact/inquiry) and **soft** (subscribe, follow, star, download, share). The funnel is multi-exit so no visitor leaves without an available next step.

| # | Conversion | Type | Primary trigger surface | Reinforced at |
|---|---|---|---|---|
| 1 | **Contact / inquiry** | Hard | `/contact` | Sticky header CTA, hero secondary CTA, closing landing band, project-detail footer |
| 2 | **Résumé / CV download** | Hard-ish | `/about` | Experience page header |
| 3 | **Book a call** (calendar link) | Hard | `/contact` | About page |
| 4 | **Star / follow on GitHub** | Soft | `/github`, `/open-source` | Project repo links |
| 5 | **Subscribe (RSS)** | Soft | `/blog` | Blog detail footer |
| 6 | **Share a post/project** | Soft (viral) | `/blog/[slug]`, `/projects/[slug]` | OG images everywhere |
| 7 | **Deep-explore** (palette/Explore) | Micro | Global nav | Every "see all →" |

**Funnel guarantee:** the **Contact CTA is persistently reachable** in the sticky header on every route, and the landing page always **ends** on a conversion band. The command palette gives power users a zero-friction path to any conversion surface.

---

## 10. Cross-journey routing map (quick reference)

| From | Natural next | Detailed in |
|---|---|---|
| Landing → Projects | Featured card / "View Projects" | [UX Flow §Landing→Projects](./ux-flow.md) |
| Landing → Contact | Hero secondary CTA / closing band | [UX Flow §Landing→Contact](./ux-flow.md) |
| Projects → Project Detail | Card click → case study | [UX Flow §Projects→Detail](./ux-flow.md) |
| Blog → Blog Detail | Post card → article | [UX Flow §Blog→Detail](./ux-flow.md) |
| Open Source → GitHub | "Full dashboard →" | [UX Flow §OSS→GitHub](./ux-flow.md) |
| Experience → Timeline | "See full timeline →" | [UX Flow §Experience→Timeline](./ux-flow.md) |
| Certificates → Contact | Credibility → inquiry | [UX Flow §Certificates](./ux-flow.md) |

For the structural map of these routes see [Information Architecture](./information-architecture.md); for nav mechanics see [Navigation Structure](./navigation-structure.md).

# Product Strategy

> Purpose: define why this portfolio exists — its primary, secondary, and conversion goals; concrete, measurable success metrics; intended emotional impact; the single visitor takeaway; the positioning strategy; and how each goal maps to the 18 pages.

This document is the strategic spine. Every design, motion, content, and engineering decision in the sibling docs should trace back to a goal stated here. Audience-level reasoning lives in [target-audience](./target-audience.md); the page scope lives in [phase-1-overview](./phase-1-overview.md#2-the-18-page-scope-authoritative).

---

## 1. Positioning strategy

**Joshua Setiawan is a hybrid Creative Developer + Software Engineer — an engineer whose depth is proven through interactive craft, not claimed in a bullet list.**

The portfolio itself is the proof of work: it is the most polished "project" on the site. The medium is the message — Awwwards-quality motion, considered 3D, a strict performance budget, and WCAG 2.2 AA accessibility together demonstrate that creative ambition and engineering rigor are not a trade-off here.

| Positioning pillar | What it means | How the site proves it |
|---|---|---|
| **Engineering depth** | Architecture, performance, accessibility, and correctness are first-class. | Live GitHub dashboard, project case studies with metrics, research/open-source, the site's own CWV + a11y scores. |
| **Creative craft** | Motion, 3D, and editorial design are intentional and restrained. | The "Signal Field" hero, scroll choreography, gallery, micro-interactions. |
| **Calm intelligence** | Premium, precise, future-facing — never loud or gimmicky. | Dark-first cinematic palette, generous spacing, sharp typography. |
| **Trust** | Verifiable, credible, professional. | Certificates, achievements, experience, timeline, real links and metrics. |

**Differentiation.** Most engineer portfolios prove competence but feel generic; most creative-developer sites dazzle but hide substance. This site refuses the trade-off: **immersive on the surface, rigorous underneath.** That duality *is* the brand. See [design-principles](./design-system.md) and [editorial-voice-tone](./brand-identity.md).

---

## 2. Primary goal

**Convert high-intent visitors (recruiters, engineering managers, founders, and potential clients) into qualified contact** — a message, a meeting request, or a saved/forwarded profile — by establishing, within one session, that Joshua is a rare creative-engineering hybrid worth reaching out to.

Everything else is in service of this. The [Contact](./page-specifications.md) page is the conversion surface; [Projects](./page-specifications.md) is the credibility lead that earns the click to it.

---

## 3. Secondary goals

| # | Secondary goal | Why it matters |
|---|---|---|
| S1 | **Establish technical credibility** | Decision-makers must believe the engineering claims (depth, breadth, currency). |
| S2 | **Demonstrate creative range** | Differentiates from commodity engineer profiles; signals product taste. |
| S3 | **Build a durable, ownable brand surface** | A canonical home that outranks third-party profiles for "Joshua Setiawan". |
| S4 | **Provide a reference hub** | One link to share in applications, proposals, talks, and intros. |
| S5 | **Showcase current activity** | Live GitHub data + recent work/writing signal that Joshua is active, not archived. |
| S6 | **Model engineering values publicly** | The [philosophy](./page-specifications.md) page turns "how I work" into a recruiting and client-fit filter. |
| S7 | **Grow an audience** | Blog + RSS + research compound reach and inbound over time. |

---

## 4. Conversion goals

Conversions are tiered by intent. Each has an explicit on-page action and a target page.

| Tier | Conversion action | Where it happens | Intent signal |
|---|---|---|---|
| **Macro (primary)** | Submit the contact form | [Contact](./page-specifications.md) `/contact` | Highest — direct outreach |
| **Macro** | Request a meeting / booking link | Contact + footer CTA band | High |
| **Macro** | Download résumé / CV (PDF) | About, Contact, footer | High (recruiter) |
| **Micro** | Click an external project / live / repo link | Projects, Project detail, Open Source, GitHub | Validation of credibility |
| **Micro** | Open the GitHub / LinkedIn / X profile | Footer, Contact, About | Cross-channel follow |
| **Micro** | Subscribe to RSS / copy feed URL | Blog | Audience growth |
| **Micro** | Deep-read a case study (scroll ≥ 75%) | Project detail | Strong engagement |
| **Assist** | Open the ⌘K command palette / Explore menu | Global | Exploratory intent (often pre-conversion) |

A reusable **CTA band** ("Let's build something" → Contact) repeats at the end of credibility pages to keep the macro conversion one click away. See [navigation-model](./navigation-structure.md) and [interaction-microinteractions](./interaction-plan.md).

---

## 5. Success metrics (concrete and measurable)

Measured with Vercel cookieless analytics + `web-vitals` field RUM (see [tooling-quality-gates](./technical-architecture.md) and [performance-budget](./performance-strategy.md)). Baselines are set in the first 30 days post-launch; targets are quarterly unless noted.

### 5.1 Conversion metrics

| Metric | Definition | Target |
|---|---|---|
| Contact submission rate | Valid submissions ÷ sessions | ≥ 2.0% of sessions; ≥ 6% of sessions that reach `/contact` |
| Qualified inbound | Recruiter/EM/founder/client messages | ≥ 5 per quarter post-launch |
| Résumé downloads | Unique CV PDF downloads | ≥ 4% of sessions |
| Outbound credibility clicks | Sessions with ≥ 1 project/live/repo click | ≥ 25% of sessions |
| Contact form completion | Submits ÷ form starts (anti-abandonment) | ≥ 70% |

### 5.2 Engagement metrics

| Metric | Definition | Target |
|---|---|---|
| Project-detail read depth | Median scroll depth on `/projects/[slug]` | ≥ 75% |
| Pages per session | Mean unique routes per session | ≥ 3.0 |
| Projects index → detail CTR | Detail opens ÷ index views | ≥ 35% |
| GitHub dashboard interaction | Sessions interacting with the live dashboard | ≥ 15% of `/github` views |
| Blog returning readers | Returning visitors to `/blog/*` | Growing MoM |

### 5.3 Quality metrics (the credibility proof)

These are contractual and CI-enforced; details in [performance-budget](./performance-strategy.md) and [accessibility](./accessibility-strategy.md).

| Metric | Target |
|---|---|
| LCP (p75 mobile, field) | ≤ 2.5 s |
| INP (p75) | ≤ 200 ms |
| CLS | ≤ 0.02 |
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 (target 100 on content routes) |
| Lighthouse Best Practices / SEO | ≥ 95 / ≥ 95 |

### 5.4 Reach metrics

| Metric | Definition | Target |
|---|---|---|
| Brand SERP ownership | Site ranks #1 for "Joshua Setiawan" | Achieved within 90 days |
| Indexed routes | Valid, indexable pages in Search Console | All production routes; zero accidental noindex |
| Rich Results validity | JSON-LD errors | Zero |
| Organic impressions | Brand + topic queries | Growing QoQ |

**Assumption:** absolute traffic is modest (a personal portfolio), so *rate* and *quality* metrics outrank raw volume. Targets are conservative starting points to be re-baselined after launch.

---

## 6. Emotional impact

The intended felt experience, in order of the visitor's journey:

1. **Arrival — "Oh."** A quiet, confident, cinematic hero. Premium and calm, not busy. The motion is felt before it's noticed.
2. **Orientation — "This person is serious."** Clarity and control: sharp typography, obvious structure, nothing gratuitous.
3. **Exploration — "There's real depth here."** Each project, the philosophy, and the live GitHub data reward attention with substance.
4. **Trust — "I believe the claims."** Verifiable credentials, metrics, and a site that itself performs flawlessly.
5. **Action — "I want to talk to them."** Reaching out feels low-friction and high-confidence.

The throughline: **intelligent, calm, precise, technical, creative, trustworthy, premium, future-facing.** Never loud, never cluttered, never gimmicky. Restraint is the luxury signal. See [design-principles](./design-system.md).

---

## 7. The single visitor takeaway

> **"This is a rare engineer who builds with the craft of a designer — and I should reach out before someone else does."**

If a visitor remembers one thing, it is this. Every page is testable against it: does this section make the hybrid-craft claim more believable and more urgent? If not, it is decoration and should be cut (the depth-over-decoration rule, [design-principles](./design-system.md)).

---

## 8. Goals-to-pages mapping

How each goal is carried by the 18 pages. Legend: ● primary carrier · ◐ strong support · ○ assist.

| Page \ Goal | Primary: Convert | S1 Credibility | S2 Creative range | S3 Brand | S5 Currency | S6 Values |
|---|---|---|---|---|---|---|
| Landing `/` | ◐ | ◐ | ● | ● | ○ | ○ |
| About `/about` | ◐ | ◐ | ○ | ◐ | ○ | ◐ |
| Philosophy `/philosophy` | ○ | ◐ | ○ | ◐ | ○ | ● |
| Projects `/projects` | ◐ | ● | ◐ | ◐ | ○ | ○ |
| Project detail `/projects/[slug]` | ◐ | ● | ◐ | ○ | ○ | ◐ |
| Research `/research` | ○ | ● | ○ | ◐ | ○ | ◐ |
| Open Source `/open-source` | ○ | ● | ○ | ◐ | ◐ | ◐ |
| Blog `/blog` (+ detail) | ○ | ◐ | ○ | ● | ◐ | ◐ |
| Experience `/experience` | ◐ | ● | ○ | ○ | ○ | ○ |
| Timeline `/timeline` | ○ | ◐ | ○ | ◐ | ◐ | ○ |
| Gallery `/gallery` | ○ | ○ | ● | ◐ | ○ | ○ |
| Certificates `/certificates` | ○ | ● | ○ | ○ | ○ | ○ |
| Achievements `/achievements` | ○ | ● | ○ | ◐ | ○ | ○ |
| GitHub Dashboard `/github` | ○ | ● | ○ | ◐ | ● | ◐ |
| Contact `/contact` | ● | ○ | ○ | ○ | ○ | ○ |

**Reading the map.** The macro conversion concentrates on Contact, but its *fuel* is the credibility cluster (Projects/detail, Experience, Certificates, Achievements, GitHub, Research, Open Source). Creative range is owned by Landing and Gallery. Currency is owned by GitHub and Blog. Values are owned by Philosophy. Per-page section specs and the conversion CTAs they carry are detailed in [page-specifications](./page-specifications.md); per-audience routing is in [target-audience](./target-audience.md) and [user-flows](./ux-flow.md).

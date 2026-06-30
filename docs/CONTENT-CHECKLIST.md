# Content Intake Checklist

> Everything **you** need to provide so Phase 3 can fill the site with real content — aligned to the authoritative **18-page scope** (see [page-specifications](./page-specifications.md) and [information-architecture](./information-architecture.md)). You don't need all of it before Phase 2 (foundation) or Phase 4 (motion), but **projects, bio, and assets are the launch critical path**, so a head start helps.
> Tip: drop assets into `public/` (or share links) and fill copy into the MDX/data files we'll scaffold (`src/content/*`, `src/data/*`). For launch we need **≥ 3–4 fully fleshed projects**; the rest can ship summary-only.

Legend: ☐ = to provide · ⭐ = needed for launch · ◇ = optional/nice-to-have

---

## A. Identity & bio  → Landing, About, Engineering Philosophy
- ☐⭐ Full name + preferred display name (pronunciation note ◇)
- ☐⭐ Positioning headline (hero) + 1 supporting sub-line
- ☐⭐ Short bio (~1–2 sentences — Landing preview / footers / OG)
- ☐⭐ Long bio (3–4 first-person paragraphs — About)
- ☐⭐ Engineering philosophy: 3–6 principles / beliefs about how you build (the `/philosophy` page), each with a short rationale
- ☐⭐ Availability status + what you're open to (freelance / full-time / collab)
- ☐ Location + timezone

## B. Visual assets
- ☐⭐ Headshot/portrait — high-res, plus a version that works as duotone/dark
- ☐⭐ Logo/monogram preference (wordmark "Joshua Setiawan" vs "JS")
- ☐⭐ Favicon / app icon source (square, ≥512px) + avatar for OG footer chip & JSON-LD `Person.image`
- ☐⭐ Default OG/Twitter share image (1200×630) — _per-project/post/research OG is auto-generated_
- ◇ Hero canvas art-direction reference (the procedural Signal Field is generated; a mood ref is optional)

## C. Links & contact  → Contact, footer, About
- ☐⭐ Email address (display + contact-form delivery target)
- ☐⭐ Social/professional URLs: GitHub, LinkedIn, X/Twitter (+ Dribbble/CodePen/YouTube if any)
- ☐⭐ Résumé/CV as final PDF + last-updated date
- ☐ Response-time expectation copy (e.g. "within 48 hours")
- ☐⭐ Privacy/consent line for the contact form (feeds `/privacy`)
- ◇ Booking/calendar link

## D. Projects  → Projects, Project Details _(per project; provide ≥ 3–4 fully)_
- ☐⭐ Title + URL slug · ☐⭐ role(s) + responsibilities · ☐⭐ year/timeline · ☐ client/context + team size
- ☐⭐ `kind`: `software` | `creative` | `research` | `oss` (drives JSON-LD type) · ☐⭐ category + tags · ☐⭐ tech stack
- ☐⭐ 1-line summary (cards) · ☐⭐ overview · ☐⭐ problem/context · ☐⭐ solution/approach (MDX)
- ☐ Technical/design highlights (3–5) · ☐ outcomes/impact/metrics
- ☐⭐ Links: live, repo, external case study · ☐⭐ cover media (image + optional video) w/ alt
- ☐ Ordered gallery media w/ alt + captions · ◇ code snippets (with language) · ◇ credits · ☐ featured? + order

## E. Research  → Research, Research Details _(per item; ◇ for v1)_
- ☐ Title + slug · ☐ abstract · ☐ date · ☐ authors · ◇ venue/journal · ☐ status (published | preprint | wip)
- ☐ Tags/topics · ☐ links (PDF, DOI, code) · ☐ body/writeup (MDX) · ◇ figures w/ alt + captions

## F. Open Source  → Open Source page _(curated; live repos pulled from GitHub)_
- ☐⭐ Confirm GitHub username (drives live repo + stats pulls)
- ☐ Curated highlight repos (name, 1-line, why it matters, role: author/maintainer/contributor)
- ◇ Pinned packages with download/usage numbers · ◇ contribution highlights to notable projects

## G. Blog  → Blog, Blog Details _(per post; ◇ for v1 — site handles 0 posts gracefully)_
- ☐ Title + slug · ☐ publish date (+ updated date) · ☐ excerpt/dek · ☐ tags · ☐ draft/featured flags
- ◇ Cover image + alt · ☐ body (MDX: code, figures w/ captions+alt, callouts) · ◇ per-post OG override

## H. Experience  → Experience _(per role)_
- ☐⭐ Role / title · ☐⭐ company + (optional) link · ☐⭐ start + end dates · ☐ location
- ☐⭐ Summary (1–2 lines) · ☐ key highlights/achievements (bullets) · ☐ stack used

## I. Timeline  → Timeline _(per event)_
- ☐ Date · ☐ title · ☐ type (role | launch | award | talk | education | milestone) · ☐ short description · ◇ link/ref
- _(may aggregate Experience + Achievements + project launches automatically; flag any standalone milestones)_

## J. Gallery  → Gallery _(per item)_
- ☐ Image (high-res, with intrinsic width/height) · ☐⭐ alt text · ☐ caption · ☐ category · ◇ date/context

## K. Certificates  → Certificates _(per certificate)_
- ☐ Name · ☐ issuer · ☐ date · ◇ credential ID · ◇ verification URL · ☐ badge/cert image · ☐ skills covered

## L. Achievements  → Achievements _(per achievement)_
- ☐ Title · ☐ date · ☐ category (award | recognition | speaking | milestone) · ☐ description · ◇ link/proof

## M. GitHub Dashboard  → GitHub page _(live data — minimal manual input)_
- ☐⭐ Confirm GitHub username (public stats, contribution calendar, top repos, languages)
- ◇ Whether a `GITHUB_TOKEN` will be provided (raises API rate limits; otherwise unauthenticated + ISR caching)
- ◇ Any repos to feature/pin or exclude from the dashboard

## N. Site-wide copy & states
- ☐⭐ Capability pillars for Landing (title + 1–2 lines each, 3–4 pillars)
- ☐ Tech marquee list · ☐⭐ CTA-band copy (reused conversion block)
- ☐ 404 copy + visual direction · ☐ loading/error friendly microcopy
- ☐⭐ Contact form: project-type options, budget/timeline options (if used), success + error copy
- ◇ Footer colophon/credits line

## O. SEO / metadata defaults
- ☐⭐ Confirmed production domain (replaces the placeholder used in canonicals/OG)
- ☐⭐ Site title + default meta description (or approve drafted copy)
- ☐⭐ Verified social handles for `sameAs` + `twitter:creator`/`site`
- ☐ `jobTitle` wording + `knowsAbout` skill list (feeds JSON-LD `Person`)
- ☐ Per-project/post/research `excerpt`/`summary` (≤160 chars, written for SERP click-through)
- ◇ Search Console / Bing verification tokens · ◇ AI-crawler policy (default: allow)

---

### Decisions to confirm (mirror of [PHASE-1-FOUNDATION](./PHASE-1-FOUNDATION.md) §13)
- ☐ Hosting **Vercel** + cookieless analytics — OK?
- ☐ Email provider **Resend** — OK?
- ☐ Brand accent **azure + teal** — keep, or your own color?
- ☐ Display font **Space Grotesk** — keep, or confirm the **Clash Display** license?
- ☐ Production **domain** for canonicals + GitHub **username**.

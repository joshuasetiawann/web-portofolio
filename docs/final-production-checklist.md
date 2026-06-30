# Final Production Checklist

The consolidated go-live checklist for the portfolio. Work top to bottom; nothing here
should be skipped for a public launch. Detailed procedures live in
[deployment.md](./deployment.md), [environment-variables.md](./environment-variables.md),
[setup.md](./setup.md), and [CONTENT-CHECKLIST.md](./CONTENT-CHECKLIST.md).

---

## 1. Quality gates (must pass)

- [ ] `pnpm check` passes locally — runs **typecheck → lint → format:check → build** in
      order (`pnpm typecheck && pnpm lint && pnpm format:check && pnpm build`).
- [ ] `pnpm build` (`velite && next build`) succeeds — confirms Velite compiles blog MDX
      and env validation passes.
- [ ] No uncommitted changes; commits follow Conventional Commits (commitlint hook).
- [ ] CI / Vercel preview build is green.

## 2. Environment variables

> Set in **Vercel → Settings → Environment Variables**. Invalid values fail the build.

- [ ] `NEXT_PUBLIC_SITE_URL` set to the **real production origin** (no trailing slash) —
      not the `http://localhost:3000` default. (Breaks canonicals/OG/sitemap/robots if wrong.)
- [ ] `NEXT_PUBLIC_SITE_NAME` confirmed (or accepting the default).
- [ ] `NEXT_PUBLIC_GITHUB_USERNAME` set to the correct GitHub login.
- [ ] `GITHUB_TOKEN` set (read-only/public scope) to raise the GitHub API rate limit
      for `/github` (optional but recommended).
- [ ] Decision recorded on `RESEND_API_KEY` / `CONTACT_TO_EMAIL` — see §8.
- [ ] Verified each var is scoped to the right environment (Production vs Preview).

## 3. Real content swapped in

> Replace all placeholder copy/data per [CONTENT-CHECKLIST.md](./CONTENT-CHECKLIST.md).
> Blog = MDX in `src/content/blog/`; everything else = typed arrays in `src/data/`.

- [ ] Identity & bio (Landing, About, Engineering Philosophy) finalized.
- [ ] **≥ 3–4 projects** fully fleshed (`src/data/projects.ts` + detail content); rest
      summary-only is acceptable.
- [ ] Experience, Research, Timeline, Gallery, Certificates, Achievements, Skills,
      Social links reviewed — no lorem/placeholder values remain.
- [ ] Visual assets in place: headshot, favicon/`icon.svg`, default OG image source.
- [ ] Résumé/CV PDF (if linked) is the final version.
- [ ] Contact details + social URLs correct (used in footer, `sameAs`, `twitter:creator`).
- [ ] Site-wide copy: hero, capability pillars, CTA band, 404, loading/error microcopy.

## 4. Accessibility (WCAG 2.2 AA)

- [ ] Light **and** dark themes meet AA contrast (light-theme contrast fixed in Phase 5).
- [ ] Keyboard navigation + visible focus states across nav, cards, forms.
- [ ] Reduced-motion honored (OS pref + in-app toggle) — animations gate off; hero copy
      stays visible.
- [ ] Images have meaningful `alt`; decorative elements are `aria-hidden`.
- [ ] Headings/landmarks are logical; external links announce "opens in new tab".

## 5. SEO

- [ ] Centralized metadata correct (title template, default description) via `buildMetadata`.
- [ ] `sitemap.xml` includes static routes + dynamic `/projects/[slug]` and `/blog/[slug]`.
- [ ] `robots.txt` allows `/` in Production (disallows `/api/`) and **disallows all** on Preview.
- [ ] `manifest.webmanifest` + `icon.svg` correct (name, theme color).
- [ ] JSON-LD (`Person` / project structured data) references the production origin.
- [ ] Canonical URLs use the production domain on every page.
- [ ] Per-item `excerpt`/`summary` written for SERP click-through (≤160 chars).

## 6. Open Graph / social cards

- [ ] Default OG image (`/opengraph-image`) renders correctly.
- [ ] Per-project (`/projects/[slug]/opengraph-image`) and per-post
      (`/blog/[slug]/opengraph-image`) images render.
- [ ] Validated in the [OG debugger](https://www.opengraph.xyz/) + X / LinkedIn
      inspectors (re-scrape after the domain is live).

## 7. Performance

- [ ] `next/image` (AVIF/WebP) + `next/font` in use; no layout shift on hero/cards.
- [ ] 3D "Signal Field" hero and GSAP/ScrollTrigger are lazy / code-split off the
      critical path (Three only on Landing, GSAP only on `/timeline`).
- [ ] `/github` ISR working (revalidate = 3600s) and degrading gracefully on API failure.
- [ ] Lighthouse / Speed Insights on the deployed URL within target (no critical regressions).

## 8. Contact form email decision

> The contact server action (`src/actions/contact.ts`) currently **validates the
> submission and returns success WITHOUT sending email** (honeypot + min-fill-time
> anti-spam only). Resend is reserved, not wired.

- [ ] Decision made: **(a)** ship as validation-only for launch (no inbox delivery), or
      **(b)** wire Resend first (set `RESEND_API_KEY` + `CONTACT_TO_EMAIL`, implement the
      `TODO(phase-4)` send in the action).
- [ ] If (a): success copy does not over-promise a reply via this channel, and a direct
      email/contact link is provided as the real path.
- [ ] If (b): a live test submission lands in the destination inbox.

## 9. Domain & canonicals

- [ ] Custom domain added in Vercel; DNS verified; TLS active.
- [ ] Canonical host chosen (apex vs `www`); the other redirects to it.
- [ ] `NEXT_PUBLIC_SITE_URL` matches the canonical host exactly, then **redeployed**.

## 10. Analytics

- [ ] Vercel **Analytics** + **Speed Insights** enabled for the project (components are
      already mounted in `src/app/layout.tsx`; cookieless, no keys needed).
- [ ] Events appear in the dashboard after first production traffic.

## 11. Post-deploy smoke test

- [ ] Run the post-deploy verification list in [deployment.md](./deployment.md) §7
      against the live production URL.
- [ ] Spot-check every top-level route loads (18 pages + 404).
- [ ] Themes, reduced-motion, lazy hero, and scroll behavior verified on the live site.

# Deployment (Vercel)

The portfolio is a standard Next.js 16 (App Router) app and deploys to **Vercel** with
zero custom infrastructure. There is **no `vercel.json`** — Vercel auto-detects Next.js
and runs the project's own build script. This guide covers connecting the repo, setting
environment variables, build/runtime configuration, ISR for the GitHub page, custom
domains, and post-deploy verification.

> Prerequisite: the code already passes the local gate. Run `pnpm check` (typecheck +
> lint + format + build) before your first deploy. See [scripts.md](./scripts.md).

---

## 1. Connect the repository

1. Push the repo to GitHub (or GitLab/Bitbucket).
2. In the Vercel dashboard: **Add New… → Project**, then import this repository.
3. Framework preset is detected as **Next.js** — accept the defaults; the specifics
   below are what Vercel infers, listed so you can confirm them.

| Setting | Value | Notes |
| --- | --- | --- |
| Framework preset | **Next.js** | Auto-detected. |
| Install command | `pnpm install` | pnpm is detected from `packageManager` (`pnpm@11.9.0`) + `pnpm-lock.yaml`. |
| Build command | `pnpm build` → `velite && next build` | The package `build` script runs Velite (compiles blog MDX into `.velite/`) **before** `next build`. Do not override it — `next build` alone would skip content generation and fail on the `#site/content` import. |
| Output | (managed by Next.js adapter) | No manual output directory. |
| Root directory | `./` | Repo root. |

> Vercel reads the `packageManager` field and the lockfile, so pnpm 11.9 is used
> automatically — no Corepack step required in the dashboard.

---

## 2. Node version

- `.nvmrc` pins **Node 26**; `package.json` `engines.node` requires **`>= 20.9.0`**.
- Set the Vercel **Project → Settings → Build & Development → Node.js Version** to a
  supported LTS that satisfies the engines floor (Vercel offers fixed major versions; if
  26 is not selectable, choose the highest available `>= 20.9.0`).
- Keep the dashboard selection in line with `.nvmrc` to avoid local/CI drift.

---

## 3. Environment variables

Set these under **Project → Settings → Environment Variables**. Full reference:
[environment-variables.md](./environment-variables.md). Env is validated at build time by
`@t3-oss/env-nextjs` (`src/lib/env.ts`) and **invalid values fail the build**.

### Required for a correct production deploy

| Variable | Value | Environment | Why |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Real origin, e.g. `https://yourdomain.com` (no trailing slash) | **Production** (and Preview if you want correct URLs there) | Drives `metadataBase`, canonical links, Open Graph / OG images, `sitemap.xml`, `robots.txt`, and JSON-LD. Left at the `http://localhost:3000` default, **all canonicals and share cards break.** |

### Recommended / optional

| Variable | Value | Environment | Why |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_NAME` | e.g. `Joshua Setiawan` | All | Display name in metadata + structured data. Defaults if unset. |
| `NEXT_PUBLIC_GITHUB_USERNAME` | Your GitHub login | All | Powers the GitHub dashboard + Open Source data. Defaults if unset. |
| `GITHUB_TOKEN` | Read-only PAT (public scope) | Production (+ Preview) | Raises the GitHub REST API rate limit for the `/github` fetch. Without it, requests use the lower **unauthenticated** limit; the page still renders (degrades gracefully to an error state on failure). Mark as a secret. |
| `RESEND_API_KEY` | — | — | **Reserved / no effect today.** The contact action validates only; email is not yet sent. Setting it does nothing until Resend is wired. |
| `CONTACT_TO_EMAIL` | — | — | **Reserved / no effect today.** Must be a valid email if set, or the build fails. |

> `NEXT_PUBLIC_*` values are inlined into the browser bundle at build time. After
> changing any env var, **trigger a new deployment** for it to take effect.

> `robots.ts` keys off Vercel's built-in `VERCEL_ENV`: only the **Production** deployment
> is indexable; Preview and other environments return `Disallow: /`. You do not set
> `VERCEL_ENV` — Vercel provides it.

---

## 4. ISR / revalidation for the GitHub page

`/github` and the Open Source data are rendered on the **server** with **ISR**, not
client-side fetching. `src/lib/github.ts` calls the GitHub REST API with
`next: { revalidate: 3600 }` (`REVALIDATE_SECONDS = 3600`), so:

- The page is statically generated and **revalidated at most once per hour** per route.
- The first visitor after the window triggers a background regeneration; others are
  served the cached copy (stale-while-revalidate).
- API failures **degrade gracefully** — `getGitHubUser` / `getGitHubRepos` return
  `null` / `[]` and the page shows an error/empty state instead of crashing.
- Provide `GITHUB_TOKEN` to avoid hitting the unauthenticated rate limit, especially on
  busy or frequently-rebuilt deployments.

No cron or external scheduler is needed; Vercel handles ISR automatically.

---

## 5. Custom domain

1. **Project → Settings → Domains → Add** your domain (e.g. `yourdomain.com`).
2. Follow Vercel's DNS instructions (A/ALIAS or `CNAME`). Decide the canonical host
   (apex vs `www`) and set the other to redirect to it in the Domains panel.
3. TLS certificates are provisioned automatically.
4. **Set `NEXT_PUBLIC_SITE_URL` to the exact canonical origin you chose** (matching
   scheme + host, no trailing slash) and redeploy. This value — not the domain panel —
   is what canonicals, OG, sitemap, and robots emit.

---

## 6. Analytics

`@vercel/analytics` and `@vercel/speed-insights` are already mounted in the root layout
(`src/app/layout.tsx`). They activate automatically on Vercel — just enable
**Analytics** and **Speed Insights** for the project in the dashboard. No keys or env
vars required.

---

## 7. Post-deploy verification

After the first production deploy resolves on the real domain, confirm:

- [ ] **Site loads** over HTTPS on the canonical domain; non-canonical host redirects to it.
- [ ] **Canonicals** — view source on a few pages; `<link rel="canonical">` uses the
      production origin, not `localhost`.
- [ ] **`sitemap.xml`** — `https://yourdomain.com/sitemap.xml` lists static routes plus
      every `/projects/[slug]` and `/blog/[slug]` with production URLs.
- [ ] **`robots.txt`** — `https://yourdomain.com/robots.txt` allows `/` (disallows
      `/api/`) and references the sitemap. Confirm a **Preview** deployment instead
      returns `Disallow: /`.
- [ ] **OG images** — `https://yourdomain.com/opengraph-image` renders; per-page images
      at `/projects/[slug]/opengraph-image` and `/blog/[slug]/opengraph-image` render.
      Validate unfurls with the [Open Graph debugger](https://www.opengraph.xyz/) and
      X/LinkedIn post inspectors (re-scrape to bust cache).
- [ ] **`manifest.webmanifest`** + `icon.svg` load (PWA install metadata).
- [ ] **JSON-LD** — structured data references the production origin (test with Google's
      [Rich Results Test](https://search.google.com/test/rich-results)).
- [ ] **`/github`** renders live profile + repo data (or a clean error state); confirm
      `GITHUB_TOKEN` is set if you expect heavy traffic.
- [ ] **Contact form** submits and shows the success state (note: email is **not** sent
      yet — see [environment-variables.md](./environment-variables.md)).
- [ ] **Analytics + Speed Insights** begin reporting in the Vercel dashboard.
- [ ] **Dark/light themes**, reduced-motion, and the lazy 3D hero behave on the live URL.

See [final-production-checklist.md](./final-production-checklist.md) for the full go-live
checklist.

# Environment Variables

Every environment variable is declared and validated in **`src/lib/env.ts`** using
[`@t3-oss/env-nextjs`](https://env.t3.gg) + Zod. Import this `env` object instead of
reading `process.env` directly — it gives you type-safe, validated values and keeps
server secrets out of client bundles.

Copy `.env.example` to `.env.local` to get started:

```bash
cp .env.example .env.local
```

## Validation behavior

`src/lib/env.ts` enforces the rules below. Because the `env` module is imported during
the build, **invalid values fail the build** (`pnpm build`) rather than blowing up at
runtime:

- Each variable is parsed against a Zod schema (URL, email, non-empty string, etc.).
- `emptyStringAsUndefined: true` — an empty string (`FOO=""`) is treated as **unset**,
  so optional vars with empty values fall back to their defaults / stay undefined.
- **Client** vars are restricted to the `NEXT_PUBLIC_*` prefix and are inlined into the
  browser bundle. **Server** vars are never exposed to the client.

## Public variables (`NEXT_PUBLIC_*`)

Exposed to the browser — safe, non-secret. All have defaults, so the app boots locally
without configuration.

| Variable | Required | Default | Schema | Purpose |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **Yes in production** | `http://localhost:3000` | valid URL | Canonical origin (no trailing slash). Drives metadata `metadataBase`, canonical links, Open Graph / OG images, `sitemap.xml`, `robots.txt`, and JSON-LD. |
| `NEXT_PUBLIC_SITE_NAME` | No | `Joshua Setiawan` | non-empty string | Display name used across metadata and structured data. |
| `NEXT_PUBLIC_GITHUB_USERNAME` | No | `joshuasetiawan` | non-empty string | GitHub username powering the Open Source page and the GitHub dashboard (server fetch + ISR). |

### Critical: `NEXT_PUBLIC_SITE_URL` in production

The default `http://localhost:3000` is only correct for local development. **In
production you must set `NEXT_PUBLIC_SITE_URL` to the real deployed origin** (e.g.
`https://yourdomain.com`, no trailing slash). If it is left at the default:

- Canonical URLs point at localhost.
- Open Graph / Twitter image and page URLs break for crawlers and link unfurlers.
- `sitemap.xml` and `robots.txt` emit localhost URLs.
- JSON-LD structured data references the wrong origin.

On Vercel, set it as a Project Environment Variable for the Production environment.

## Server variables (secret)

Never exposed to the client. **All are optional** — the app builds and runs without
them. Set them to enable the corresponding feature.

| Variable | Required | Schema | Purpose |
| --- | --- | --- | --- |
| `GITHUB_TOKEN` | No | string | Personal access token (read-only / public scope) to **raise GitHub API rate limits** for the GitHub dashboard / Open Source data fetch. Without it, requests use the lower unauthenticated limit. |
| `RESEND_API_KEY` | No | string | **Reserved.** Intended for sending contact-form email via Resend. See note below. |
| `CONTACT_TO_EMAIL` | No | valid email | **Reserved.** Destination inbox for contact submissions. Must be a valid email if set. See note below. |

### Note: contact form email is not yet wired

`RESEND_API_KEY` and `CONTACT_TO_EMAIL` are reserved for a follow-up. The contact
**server action currently validates the submission (React Hook Form + Zod) and returns
success without actually sending an email.** Wiring Resend to dispatch mail is a planned
follow-up; setting these vars today has no effect on delivery.

## Adding a new variable

1. Add it to the appropriate `server` or `client` block in `src/lib/env.ts` with a Zod
   schema.
2. Add the matching entry to the `runtimeEnv` map in the same file.
3. Document it in `.env.example` (with a safe placeholder) and in this file.
4. Import and read it via `import { env } from "@/lib/env"` — never `process.env`.

> Client variables **must** be prefixed `NEXT_PUBLIC_` or `@t3-oss/env-nextjs` will
> reject them.

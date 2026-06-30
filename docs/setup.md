# Setup

Get the portfolio running locally, from a clean checkout to a live dev server.

## Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| **Node.js** | `>= 20.9.0` (engines), **26** recommended | `.nvmrc` pins **26**. Run `nvm use` to match it. |
| **pnpm** | `11.9.0` | This is the only supported package manager (`packageManager` field in `package.json`). |
| **Git** | any recent | Husky installs commit hooks on first install. |

Install pnpm if you don't have it:

```bash
corepack enable
corepack prepare pnpm@11.9.0 --activate
```

> The project is ESM (`"type": "module"`) and uses Next.js 16 (App Router) with React 19 and TypeScript 5 (strict).

## Install

```bash
pnpm install
```

What happens during install:

- Dependencies are resolved and linked by pnpm.
- The `prepare` script runs `husky`, installing the Git hooks in `.husky/` (`pre-commit` → `lint-staged`, `commit-msg` → `commitlint`).

> **Note:** `pnpm install` does **not** generate blog content on its own. Velite runs as part of `dev`, `build`, `content`, and `typecheck` (see below). The first `pnpm dev` will generate the `.velite` directory before the dev server starts.

## Environment variables

Copy the example file and adjust as needed:

```bash
cp .env.example .env.local
```

All variables have safe defaults for local development, so the app will boot without editing anything. For production you **must** set `NEXT_PUBLIC_SITE_URL` to the real origin. See [environment-variables.md](./environment-variables.md) for the full reference.

## First run

```bash
pnpm dev
```

This runs `velite && next dev`:

1. **Velite** compiles the MDX blog posts in `src/content/blog/*.mdx` into the generated `.velite/` directory (imported in code as `#site/content`).
2. **Next.js** starts the dev server, by default at <http://localhost:3000>.

Open the URL in your browser. Edits to app code hot-reload. Edits to **blog MDX** require Velite to re-run — either restart `pnpm dev` or run a content watcher in a second terminal (see [scripts.md](./scripts.md)):

```bash
pnpm content:watch
```

## Production build (local smoke test)

```bash
pnpm build   # velite && next build
pnpm start   # serve the production build
```

`pnpm build` validates environment variables (via `@t3-oss/env-nextjs`) and **fails the build on invalid values**. If the build aborts complaining about env, check `.env.local` against [environment-variables.md](./environment-variables.md).

## Full local verification

Before pushing, run the aggregate check (typecheck + lint + format + build):

```bash
pnpm check
```

See [scripts.md](./scripts.md) for every script and when to use it.

## Troubleshooting

**`Cannot find module '#site/content'` / missing blog data**
The `.velite/` directory hasn't been generated (or is stale). Regenerate it:

```bash
pnpm content
```

`.velite/` is a generated artifact — it is safe to delete and rebuild. Any script that touches content (`dev`, `build`, `content`, `content:watch`, `typecheck`) will recreate it.

**Blog edits don't show up**
The dev server only runs Velite once at startup. Run `pnpm content:watch` alongside `pnpm dev`, or restart `pnpm dev`.

**`tsc` errors about content types**
`pnpm typecheck` runs `velite && tsc --noEmit` precisely so the generated content types exist before type-checking. If you call `tsc` directly, run `pnpm content` first.

**Build fails on environment variables**
Env is validated at build time. A malformed `NEXT_PUBLIC_SITE_URL` (must be a valid URL) or `CONTACT_TO_EMAIL` (must be a valid email) will stop the build. Fix the value or leave it empty (empty strings are treated as undefined for optional vars).

**Wrong Node version**
Use `nvm use` to pick up `.nvmrc` (Node 26). The engines floor is `20.9.0`; older Node will fail to install.

**`pnpm` not found / wrong version**
Enable Corepack and activate the pinned version (see [Prerequisites](#prerequisites)). Using npm or yarn is not supported.

**Git hooks not running**
Hooks are installed by the `prepare` script during `pnpm install`. If they're missing, run `pnpm install` again (or `pnpm exec husky`).

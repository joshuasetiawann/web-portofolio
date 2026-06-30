# Scripts

Every script defined in `package.json`, what it does, and when to reach for it. Run them
with pnpm (the only supported package manager): `pnpm <script>`.

> Many scripts run **Velite** first. Velite compiles the blog MDX in
> `src/content/blog/*.mdx` into the generated `.velite/` directory (imported as
> `#site/content`). Anything that depends on content types or content data must run
> Velite first, which is why `dev`, `build`, `typecheck`, and `content` all invoke it.

## Development

### `pnpm dev`

```
velite && next dev
```

Generates blog content with Velite, then starts the Next.js dev server (default
<http://localhost:3000>). Your everyday command. Note: Velite runs **once** at startup —
to live-reload blog edits, run `pnpm content:watch` in a second terminal.

### `pnpm content`

```
velite
```

Compiles the blog MDX into `.velite/` a single time. Use it to (re)generate or refresh
content without starting the dev server — e.g. after pulling changes, or to fix a missing
`#site/content` import.

### `pnpm content:watch`

```
velite --watch
```

Watches `src/content/blog/*.mdx` and regenerates `.velite/` on every change. Run it
alongside `pnpm dev` when you're actively editing blog posts.

## Build & serve

### `pnpm build`

```
velite && next build
```

Generates content, then produces the optimized production build. Validates environment
variables via `@t3-oss/env-nextjs` and **fails on invalid values** (see
[environment-variables.md](./environment-variables.md)).

### `pnpm start`

```
next start
```

Serves the production build created by `pnpm build`. Run `pnpm build` first. Used to
smoke-test the production output locally; on Vercel this is handled by the platform.

## Quality gates

### `pnpm typecheck`

```
velite && tsc --noEmit
```

Generates content types (so `#site/content` resolves), then type-checks the whole project
with the TypeScript compiler — no files emitted. Run before committing or when chasing a
type error.

### `pnpm lint`

```
eslint
```

Lints the codebase with ESLint (`eslint-config-next`).

### `pnpm lint:fix`

```
eslint --fix
```

Lints and auto-fixes what it can. Use while cleaning up before a commit.

### `pnpm format`

```
prettier --write .
```

Formats the entire repo with Prettier (includes `prettier-plugin-tailwindcss` for class
sorting). Writes changes to disk.

### `pnpm format:check`

```
prettier --check .
```

Verifies formatting **without** writing — reports files that would change. Used in CI and
by `pnpm check`.

### `pnpm check`

```
pnpm typecheck && pnpm lint && pnpm format:check && pnpm build
```

The full local verification gate: typecheck, lint, format check, and production build, in
order. **Run this before pushing** to reproduce what CI / deploy will enforce. If any step
fails, the chain stops.

## Git hooks (Husky)

### `pnpm prepare`

```
husky
```

Installs the Git hooks in `.husky/`. Runs automatically during `pnpm install`; you rarely
call it directly. After it runs, the following hooks are active:

| Hook | Runs | What it enforces |
| --- | --- | --- |
| `pre-commit` | `pnpm lint-staged` | Runs ESLint `--fix` + Prettier on staged `*.{ts,tsx,js,jsx,mjs,cjs}` files, and Prettier on staged `*.{json,css,md,mdx,yml,yaml}` files. Keeps every commit lint-clean and formatted. |
| `commit-msg` | `pnpm commitlint --edit "$1"` | Validates the commit message against **Conventional Commits** (`@commitlint/config-conventional`). Non-conforming messages are rejected. |

> The `lint-staged` configuration lives in the `lint-staged` block of `package.json`.

## Quick reference

| Script | Command | When |
| --- | --- | --- |
| `dev` | `velite && next dev` | Local development |
| `build` | `velite && next build` | Production build |
| `start` | `next start` | Serve the production build |
| `content` | `velite` | One-off content (re)generation |
| `content:watch` | `velite --watch` | Live content rebuild while editing MDX |
| `lint` | `eslint` | Lint check |
| `lint:fix` | `eslint --fix` | Lint + auto-fix |
| `typecheck` | `velite && tsc --noEmit` | Type check |
| `format` | `prettier --write .` | Format the repo |
| `format:check` | `prettier --check .` | Verify formatting (no writes) |
| `check` | typecheck + lint + format:check + build | Pre-push verification |
| `prepare` | `husky` | Install Git hooks (auto on install) |

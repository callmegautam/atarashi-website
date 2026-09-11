# Contributing to the atarashi website

Thanks for helping. This is the Next.js 16 site behind
[atarashi.gautamsuthar.in](https://atarashi.gautamsuthar.in). The CLI itself
lives in [callmegautam/atarashi](https://github.com/callmegautam/atarashi); bugs
in generation, blueprints or the registry contents belong there, not here.

```bash
bun install
bun run dev
bun run lint && bun run typecheck && bun run build
```

Node 20.11+ and bun 1.3+. **bun is the package manager.** Never npm, pnpm or
yarn in this repo.

## What belongs where

| Change | Repo |
|---|---|
| Page copy, layout, styling, metadata, SEO | here |
| Documentation wording | the CLI repo, under `docs/guide`, then `bun run sync:docs` |
| Blueprint descriptions, registry contents | the CLI repo, then `bun run sync:registry` |
| A broken link inside a doc page | the CLI repo, unless the rewriting in `lib/docs.ts` is what is wrong |

`content/docs` and `public/registry` are generated. A pull request that edits
either by hand will be asked to move the change upstream. The registry index
carries a root hash the CLI verifies, so hand edits there break real installs.

## House rules

1. **No em dashes.** Not in code, copy, docs or commit messages. Use a comma, a
   colon, or a full stop.
2. **No comments in the codebase.** Write code that does not need them. Naming
   and small functions do the explaining.
3. Copy that repeats belongs in `lib/site.ts`, not inlined twice.
4. Components in `components/` are presentational. Data reading stays in `lib/`
   and in server components.
5. Every page keeps a `title`, a `description` and a canonical URL. If you add a
   route, add it to the sitemap and give it structured data through `lib/seo.ts`.

## Accessibility and performance

The site has no client-side data fetching and one small inline script for the
theme. Keep it that way. Before opening a pull request:

- Every interactive target stays at least 44px tall
- Headings stay in order, one `h1` per page
- Both themes are checked. The toggle writes `data-theme` on `<html>`
- No layout shift from fonts. Both faces load through `next/font`

## Commits

Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `chore:`, `refactor:`.
Feature work goes on `feat/*` and is squash-merged.

## Before you open a PR

- `bun run lint && bun run typecheck && bun run build` green
- Screenshots for anything visual, in light and dark
- `bun run check:docs && bun run check:registry` still pass if you touched the
  sync scripts

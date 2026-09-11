# atarashi-website

The marketing site, documentation and blueprint registry for
[atarashi](https://github.com/callmegautam/atarashi), a composable project
scaffolding engine for Node.js and TypeScript.

Live at **[atarashi.gautamsuthar.in](https://atarashi.gautamsuthar.in)**.

Built and maintained by [Gautam Suthar](https://gautamsuthar.in).

## What this repo serves

| Path | What it is |
|---|---|
| `/` | Landing page, built from the registry index so the counts are never stale |
| `/docs/*` | The CLI guide, rendered from Markdown synced out of the CLI repo |
| `/registry/v1/index.json` | The registry index every published CLI resolves against |
| `/registry/bp/*.tgz` | Blueprint tarballs, integrity-verified by the CLI |
| `/llms.txt` | Plain-text summary of the project for answer engines |
| `/sitemap.xml`, `/robots.txt` | Generated from the doc tree at build time |

## Getting started

Node 20.11+ and [bun](https://bun.sh) 1.3+.

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | What it does |
|---|---|
| `bun run dev` | Development server |
| `bun run build` | Production build |
| `bun run start` | Serve the production build |
| `bun run lint` | ESLint |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run sync:docs` | Copy the guide out of the CLI repo into `content/docs` |
| `bun run check:docs` | Verify `content/docs` still matches the CLI repo |
| `bun run sync:registry` | Copy the built registry into `public/registry` |
| `bun run check:registry` | Verify the copy matches the build, hash for hash |

Both sync scripts look for the CLI repo at `../atarashi`. Override with
`ATARASHI_REPO`, or `ATARASHI_REGISTRY_DIST` for the registry.

## Layout

| Path | What lives there |
|---|---|
| `app/` | Routes, metadata, OG image routes, `sitemap.ts`, `robots.ts`, `llms.txt` |
| `components/` | Presentational components, no data fetching |
| `lib/site.ts` | Site, author and keyword constants. Single source of truth for copy that repeats |
| `lib/seo.ts` | JSON-LD builders for the Person, WebSite, SoftwareApplication and doc graphs |
| `lib/docs.ts` | Markdown loading, link rewriting, heading extraction |
| `lib/og.tsx` | Shared Open Graph card, used by the static and dynamic image routes |
| `content/docs/` | Synced Markdown. Generated, not source |
| `public/registry/` | Synced registry. Generated, not source |
| `assets/` | Fonts read at build time by the OG image routes |

## Two directories are build artifacts

`content/docs` and `public/registry` are copied from the CLI repo. Never hand
edit either one.

The registry index carries a root hash computed over exactly those bytes and the
CLI verifies it, so an edit here breaks every install. To change the registry,
change the blueprints in the CLI repo, run `pnpm build:index` there, then
`bun run sync:registry` here. Same shape for the docs: edit `docs/guide` in the
CLI repo, then `bun run sync:docs`.

## Social cards

`/opengraph-image` renders the home card at build time. `/api/og` renders a card
per documentation page from `title`, `eyebrow` and `lede` search params, and
`generateMetadata` in the docs route builds that URL. Both share `lib/og.tsx`
and read Archivo and IBM Plex Mono from `assets/`, so the build needs no network
for them.

To preview one, run the dev server and open `/opengraph-image` or
`/api/og?title=CLI%20reference&lede=Every%20command`.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Please also read the
[Code of Conduct](./CODE_OF_CONDUCT.md).

## License

[MIT](./LICENSE) © Gautam Suthar. The site content and the atarashi CLI are both
MIT licensed.

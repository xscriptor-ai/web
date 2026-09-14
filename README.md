# X AI — Web

Static website for the `xscriptor-ai` ecosystem: landing page, searchable catalog of agents and
skills, command reference, and installation docs.

## Stack

- Next.js 16 App Router with static export (`output: "export"`)
- TypeScript, Tailwind CSS v4, CSS Modules, and theme tokens
- Content synced from the `agents` and `skills` repos at build time

## Local development

```bash
npm install
npm run sync   # generates src/data/*.json from sibling ../agents and ../skills checkouts
npm run dev
```

`npm run sync` looks for sibling checkouts of `xscriptor-ai/agents` and `xscriptor-ai/skills`
(override with `XSCRIPTOR_AGENTS_DIR` / `XSCRIPTOR_SKILLS_DIR`). If they are not present, it
downloads tarballs from GitHub (`XSCRIPTOR_REF`, default `main`).

## Build

```bash
npm run build   # runs sync automatically via prebuild
```

The static output is written to `out/`.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes to GitHub Pages on every
push to `main`, weekly by schedule, and manually. Because this is a project site, the workflow
sets `NEXT_PUBLIC_BASE_PATH=/web`.

For a custom domain, set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_BASE_PATH` in the workflow.

## Structure

```
scripts/sync-content.mjs   content pipeline (agents, skills, commands -> JSON)
src/app/                   routes: /, /agents, /agents/[slug], /skills, /skills/[name], /commands, /docs
src/components/            nav, footer, catalog, markdown, copy button
src/data/                  generated JSON (ignored by git)
src/lib/                   types and data access helpers
```

## Design system

Monochrome technical palette with a single lime accent, driven by CSS custom properties:

`--bg`, `--bg-alt`, `--panel`, `--panel-2`, `--fg`, `--muted`, `--border`,
`--border-strong`, `--primary`, `--primary-fill`, `--on-primary`, `--primary-soft`,
`--code-bg`, `--radius`, `--radius-lg`.

Type stack (self-hosted via Fontsource): Space Grotesk for display, Inter for body,
JetBrains Mono for code and labels.

Dark mode is the default; `data-theme` on `<html>` is set by a pre-paint script and toggled
from the navbar. The logo and favicon come from the organization avatar
(`public/logo-glyph.png`, `src/app/icon.png`, `src/app/apple-icon.png`).

## License

MIT

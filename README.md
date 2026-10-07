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
downloads tarballs from GitHub (`XSCRIPTOR_REF`, default `main`). Clone the workspace repos next
to this folder so the sync picks them up automatically:

```
xscriptor-ai/
├── agents/      # 181 specialized + 24 senior agents, claude/commands/
├── skills/      # web-fullstack/, content/, senior/ skill packs
└── web/         # this repo
```

The sync reads agents from `agents/agents` + `agents/senior/agents`, commands from
`agents/claude/commands`, project skills from `skills/web-fullstack`, content skills from
`skills/content`, and senior packs from `skills/senior`.

## Build

```bash
npm run build   # runs sync automatically via prebuild
npm run typecheck
```

The static output is written to `out/`.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes to GitHub Pages on every
push or merge to `main`, and manually via `workflow_dispatch`.

Because this is a project site, the workflow sets `NEXT_PUBLIC_BASE_PATH=/web`.

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

Samurai design system: monochrome, typographically driven, information-dense without clutter.

- **Canvas:** OLED black in dark mode, warm off-white in light mode, with a subtle dot grid.
- **Color is an event:** monochrome surfaces; color only encodes status (`--accent`, `--success`,
  `--warning`, `--interactive`).
- **Type:** Space Grotesk for body and headings, Space Mono for labels and data, Doto for hero
  numbers. Labels are 11px ALL CAPS with 0.08em tracking.
- **Surfaces:** flat, 1px borders, no gradients, no shadows, no blur, square panels and technical
  buttons.

Tokens are CSS custom properties in `src/app/globals.css`: `--black`, `--surface`,
`--surface-raised`, `--border`, `--border-visible`, `--text-disabled`, `--text-secondary`,
`--text-primary`, `--text-display`, `--accent`, `--success`, `--warning`, `--error`,
`--interactive`, `--radius`.

Fonts are self-hosted via Fontsource. Dark mode is the default; `data-theme` on `<html>` is set by
a pre-paint script and toggled from the navbar. The logo and favicon come from the organization
avatar (`public/logo-glyph.svg`, `src/app/icon.svg`, `src/app/apple-icon.png`). Color, mono, and
inverse glyph variants live in `public/logos/`.

## License

MIT

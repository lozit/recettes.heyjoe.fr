# CLAUDE.md

French-language recipe blog ("Recettes") built with Astro 6. Content is authored as Markdown under `src/content/recettes/`. Deployed on Netlify.

## Commands

```bash
npm run dev       # start dev server (http://localhost:4321)
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

No tests, no ESLint, no Prettier config enforced. The site is in French; all user-visible content must be French.

## Architecture

- `astro.config.mjs` — Astro config. `output: 'static'`, React integration enabled, `site: https://recettes.heyjoe.fr`.
- `src/content.config.ts` — defines the `recettes` content collection (loaded via `glob` from `src/content/recettes/**/*.md`) and its Zod schema: `title`, `description`, `date` (string `"JJ MM AAAA"`), `tags[]`, optional `photo` and `meta` (`portions`, `prep`, `cuisson`, `repos`).
- `src/pages/`:
  - `index.astro` — homepage: lists all recipes sorted by date DESC, with a FilterBar React island for tag/search filtering.
  - `recettes/[slug].astro` — per-recipe page generated from each entry of the `recettes` collection.
  - `404.astro` — not-found page.
- `src/layouts/BaseLayout.astro` — global `<html>` / `<head>`. Sets `lang="fr"`, OG tags, favicon (`/logo.png`), loads Fraunces + DM Sans from Google Fonts, and imports `src/styles/global.css`.
- `src/components/` — `Nav.astro`, `FeedCard.astro`, `FilterBar.tsx` (React island, hydrated `client:load`).
- `public/` — served as-is at the site root:
  - `public/images/recettes/<slug>.jpg` — recipe hero photos, referenced from frontmatter via `photo: "/images/recettes/<slug>.jpg"`.
  - `public/logo.png`, `public/_redirects`, `public/robots.txt`.
- `netlify.toml` — deployment config. Publishes `dist/` with CORS header `Access-Control-Allow-Origin: *`.

## Recipe content conventions

<important if="adding or editing a recipe in src/content/recettes/">

Every recipe is a single `.md` file in `src/content/recettes/`. Filename (kebab-case) becomes the URL slug (`/recettes/<slug>`). Required frontmatter:

```yaml
---
title: "Aloo Palak"
description: "Plat indien aux épinards et aux pommes de terre"
date: "10 04 2020"                        # "JJ MM AAAA"
tags: ["salé", "Inde", "épinard", "plat"]
photo: "/images/recettes/aloo-palak.jpg"  # optional but recommended
---
```

Tag conventions (follow existing recipes):
- Top-level category: `salé` or `sucré`.
- Course: `plat`, `dessert`, `boisson`, `apéro`, …
- Origin/cuisine when relevant: `Inde`, `Japon`, `Italie`, …
- Main ingredients when relevant: `épinard`, `pomme de terre`, …

Body structure (follow existing recipes — don't invent new headings):

1. A single `>` blockquote with a one-line intro.
2. `### Ingrédients` — bullet list.
3. `### Étapes` — numbered list.

The hero image comes from the `photo` frontmatter; do **not** also embed it in the body.

Keep French accents correct (é, è, ç, à).

</important>

## Image handling

New recipe photos go in `public/images/recettes/`. Reference them from frontmatter as `photo: "/images/recettes/<file>.jpg"` — Astro serves `public/` at the site root unchanged (no transformation, no hashing). If you want responsive images with Astro's built-in optimizer later, move them under `src/` and use `<Image />` from `astro:assets`.

## Gotchas

- Content collection dates are strings in the `"JJ MM AAAA"` format (not ISO 8601). `index.astro` parses them with `new Date(d.split(' ').reverse().join('-'))` when sorting — keep the format consistent.
- The FilterBar is a React island (`client:load`). The homepage listens for a `filter-recipes` CustomEvent dispatched from that island to show/hide `.feed-card-wrap` elements; don't rename the data attributes (`data-slug`, `data-tags`) without updating the listener in `src/pages/index.astro`.
- Fonts are loaded from Google Fonts (Fraunces + DM Sans) in `BaseLayout.astro`. Offline dev will fall back to system fonts.

# CLAUDE.md

French-language recipe blog ("Recettes") built with Gatsby v2. Content is authored as Markdown and editable via Netlify CMS. Deployed on Netlify.

## Commands

```bash
npm run develop   # start dev server (http://localhost:8000)
npm run build     # production build into public/
npm run serve     # serve built site
npm run clean     # clear Gatsby cache (.cache/ and public/)
npm run format    # prettier on **/*.{js,jsx,json,md}
```

No tests, no ESLint. Prettier is the only formatter — run it before committing JS/JSON changes (markdown recipes are exempt in practice; see below).

## Architecture

- `gatsby-config.js` — plugins + site metadata. Content source is `content/blog` (markdown) and `content/assets` (images).
- `gatsby-node.js` — generates two page types:
  - Blog posts from each `content/blog/*.md` → slug = filename, template `src/templates/blog-post.js`. Posts are sorted by `frontmatter.date DESC` and wired with `previous`/`next` context.
  - Tag archive pages at `/tags/<kebab-tag>/` from unique `frontmatter.tags`, template `src/templates/tags.js`.
- `src/pages/` — `index.js` (home, lists all recipes), `tags.js` (tag cloud), `404.js`.
- `src/components/layout.js` — global wrapper (logo, footer). `src/components/seo.js` — Helmet meta (lang="fr").
- `src/styles/global.css` — plain CSS, no CSS-in-JS. Max container width ~600px, serif (Lora).
- `static/admin/config.yml` — Netlify CMS config (GitHub backend).
- `netlify.toml` — deployment (CORS header `Access-Control-Allow-Origin: *`).

Images inside markdown are written as `![alt](/assets/file.jpg "caption")` and are transformed by `gatsby-remark-images` (maxWidth 590). Store new recipe images in `static/assets/` — this is what Netlify CMS uses (`media_folder: static/assets`, `public_folder: /assets` in `static/admin/config.yml`). `content/assets/` only holds the logo and a handful of legacy images bundled through Gatsby's asset pipeline; don't put new recipe photos there.

## Recipe content conventions

<important if="adding or editing a recipe in content/blog/">

Every recipe is a single `.md` file in `content/blog/`. Filename (kebab-case) becomes the URL slug. Required frontmatter:

```yaml
---
date: 2020-04-10T18:15:09.324Z   # ISO 8601, used for sorting
title: Aloo Palak
description: Plat indien aux épinards et aux pommes de terre
tags:
  - salé           # or "sucré" — top-level category
  - Inde           # origin/cuisine
  - épinard        # main ingredients
  - plat           # course: plat, dessert, boisson, etc.
---
```

Body structure (follow existing recipes — don't invent new headings):

1. A single `>` blockquote with a one-line intro.
2. A hero image: `![Title](/assets/slug.jpg "Title")`.
3. `### Ingrédients` — bullet list.
4. `### Étapes` — numbered list.

Keep French accents correct (é, è, ç, à). Do not run Prettier on recipe markdown — it reflows lists in ways that hurt readability. The site is in French; all user-visible content must be French.

</important>

## Gotchas

- Gatsby v2 (not v3+): APIs like `createPages` use the older signatures. Don't upgrade casually — plugins are pinned to v2-compatible versions.
- Node: Gatsby v2 officially requires Node ≤ 14 (EOL since April 2023). Newer Node versions often work but are unsupported. If `npm install` fails with peer-deps or engine errors, try `nvm use 14`.
- `gatsby-plugin-offline` is enabled: in dev the service worker can serve stale content. Run `npm run clean` if you see phantom old pages.
- `gatsby-plugin-remove-fingerprints` strips hashes from asset filenames in production — assume long-term caching may need manual busting.
- Netlify CMS writes commits to the repo directly. A malformed frontmatter push from the CMS can break the build; validate structure if a CMS-authored recipe fails to build.
- Analytics: Ackee tracker is loaded in production only. No action needed locally.

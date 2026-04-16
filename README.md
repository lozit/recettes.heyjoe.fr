# Recettes HeyJoe

> Le bloc-notes de recettes de la famille HeyJoe — site statique Gatsby, contenu en Markdown, édition via Netlify CMS, hébergement Netlify.

Site en ligne : https://recettes.heyjoe.fr

---

## 🇫🇷 À propos

Ce dépôt héberge un petit site de recettes familial. L'objectif est simple : garder au même endroit les recettes qu'on cuisine régulièrement à la maison, et pouvoir les consulter facilement depuis un téléphone en cuisine.

Les recettes sont écrites en Markdown dans `content/blog/`. Chaque fichier `.md` devient une page du site. On peut aussi ajouter une recette sans toucher au code grâce à Netlify CMS (interface web accessible sur `/admin/`).

## 🚀 Démarrage

### Prérequis
- **Node.js** — idéalement Node 14 (Gatsby v2 est officiellement supporté jusqu'à Node 14). Des versions plus récentes fonctionnent souvent mais peuvent casser à l'installation ; dans ce cas, utiliser `nvm use 14`.
- **npm**

### Installation

```bash
npm install
npm run develop   # http://localhost:8000
```

### Commandes utiles

| Commande | Description |
|---|---|
| `npm run develop` | Démarre le serveur de dev avec hot-reload |
| `npm run build` | Build de production dans `public/` |
| `npm run serve` | Sert le build local |
| `npm run clean` | Vide le cache Gatsby (`.cache/` et `public/`) |
| `npm run format` | Prettier sur les fichiers JS / JSON / MD |

## 📝 Ajouter une recette

### Option 1 — Via Netlify CMS (recommandé)

Se rendre sur `/admin/` du site déployé, se connecter avec GitHub, et créer un nouvel article dans la collection **Articles**. Le CMS commitera directement sur la branche principale.

### Option 2 — En local (Markdown)

Créer un fichier `content/blog/<slug>.md` (le nom du fichier devient l'URL) avec ce frontmatter :

```yaml
---
date: 2026-04-16T12:00:00.000Z
title: Nom de la recette
description: Courte description qui apparaît en liste
tags:
  - salé        # ou "sucré"
  - plat        # type : plat, dessert, boisson...
  - Inde        # origine (facultatif)
---
```

Puis le corps de la recette :

```markdown
> Phrase d'intro en blockquote.

![Titre](/assets/mon-image.jpg "Titre")

### Ingrédients

- ...

### Étapes

1. ...
```

Les photos vont dans `static/assets/` (servies à `/assets/...`).

Exemple canonique : [`content/blog/aloo-palak.md`](./content/blog/aloo-palak.md).

## 🏗️ Stack technique

- **Gatsby 2** + **React 16**
- Contenu Markdown via `gatsby-transformer-remark` / `gatsby-remark-images`
- **Netlify CMS** pour l'édition en ligne (configuré dans `static/admin/config.yml`)
- Déploiement **Netlify** (voir `netlify.toml`)
- Analytics **Ackee** (production uniquement, self-hosted)

Pour les détails d'architecture, voir [`CLAUDE.md`](./CLAUDE.md).

## 🇬🇧 English (short)

Static recipe site built with Gatsby (French content). Run `npm install && npm run develop` to start the dev server at `http://localhost:8000`. Add recipes as Markdown files in `content/blog/` (see any existing file for the frontmatter format), or use the Netlify CMS at `/admin/`. Full docs above in French; architecture notes in `CLAUDE.md`.

## 📄 Licence

À définir.

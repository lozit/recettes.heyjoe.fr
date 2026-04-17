# Recettes HeyJoe

> Le bloc-notes de recettes de la famille HeyJoe — site statique Astro, contenu en Markdown, hébergement Netlify.

Site en ligne : https://recettes.heyjoe.fr

---

## 🇫🇷 À propos

Ce dépôt héberge un petit site de recettes familial. L'objectif est simple : garder au même endroit les recettes qu'on cuisine régulièrement à la maison, et pouvoir les consulter facilement depuis un téléphone en cuisine.

Les recettes sont écrites en Markdown dans `src/content/recettes/`. Chaque fichier `.md` devient une page du site.

## 🚀 Démarrage

### Prérequis
- **Node.js** 18+
- **npm**

### Installation

```bash
npm install
npm run dev   # http://localhost:4321
```

### Commandes utiles

| Commande | Description |
|---|---|
| `npm run dev` | Démarre le serveur de dev Astro avec hot-reload |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Sert le build local |

## 📝 Ajouter une recette

Créer un fichier `src/content/recettes/<slug>.md` (le nom du fichier devient l'URL `/recettes/<slug>`) avec ce frontmatter :

```yaml
---
title: "Nom de la recette"
description: "Courte description qui apparaît en liste"
date: "16 04 2026"          # format JJ MM AAAA
tags: ["salé", "plat", "Inde"]
photo: "/images/recettes/<slug>.jpg"
---
```

Puis le corps de la recette :

```markdown
> Phrase d'intro en blockquote.

### Ingrédients

- ...

### Étapes

1. ...
```

Les photos vont dans `public/images/recettes/` (servies à `/images/recettes/...`).

Exemple canonique : [`src/content/recettes/aloo-palak.md`](./src/content/recettes/aloo-palak.md).

## 🏗️ Stack technique

- **Astro 6** + **React 19** (pour quelques îles interactives, ex. barre de filtres)
- Contenu Markdown via **Astro Content Collections** (`src/content.config.ts`)
- Déploiement **Netlify** (voir `netlify.toml`)

Pour les détails d'architecture, voir [`CLAUDE.md`](./CLAUDE.md).

## 🇬🇧 English (short)

Static recipe site built with Astro (French content). Run `npm install && npm run dev` to start the dev server at `http://localhost:4321`. Add recipes as Markdown files in `src/content/recettes/` (see any existing file for the frontmatter format). Full docs above in French; architecture notes in `CLAUDE.md`.

## 📄 Licence

MIT — voir [`LICENSE`](./LICENSE).

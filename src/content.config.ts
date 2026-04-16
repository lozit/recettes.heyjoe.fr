import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const recettes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/recettes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
    photo: z.string().optional(),
    meta: z.object({
      portions: z.string().optional(),
      prep: z.string().optional(),
      cuisson: z.string().optional(),
      repos: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { recettes };

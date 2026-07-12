import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tagSchema = z.union([
  z.string(),
  z.object({ tag: z.string() }),
]);

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(tagSchema).optional(),
    draft: z.boolean().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { posts, pages };

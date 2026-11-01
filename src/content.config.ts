import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: z.object({
    slug: z.string(),
    order: z.number(),
    // internal editorial flags: never rendered, and never used to hide a page
    draft: z.boolean().default(false),
    draftNote: z.string().optional(),
    navLabel: z.string(),
    title: z.string(),
    metaDescription: z.string(),
    h1: z.string(),
    tagline: z.string(),
    heroImage: z.string(),
    heroAlt: z.string(),
    images: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    services: z.array(z.object({ name: z.string(), text: z.string() })).default([]),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

export const collections = { services };

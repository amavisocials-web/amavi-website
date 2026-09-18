import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Adding a service is adding a markdown file to src/content/services/ — no
 * page edits.
 */

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    includes: z.array(z.string()),
    order: z.number().default(99),
    /** Marks a service AMAVI has not yet confirmed it sells as a line item. */
    provisional: z.boolean().default(false),
  }),
});

export const collections = { services };

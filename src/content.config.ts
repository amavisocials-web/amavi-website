import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Adding a case study or a service is adding a markdown file to the matching
 * folder — no page edits. `published: false` keeps an entry in the collection
 * but out of every rendered list, for clients whose sign-off is still pending.
 */

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    client: z.string(),
    sector: z.string(),
    summary: z.string(),
    challenge: z.string(),
    approach: z.array(z.string()),
    /** Results must come from AMAVI's own reporting. Never invent a figure. */
    results: z.array(z.object({ value: z.string(), label: z.string() })),
    deliverables: z.array(z.string()),
    /** Sets the placeholder composition until real photography is supplied. */
    tone: z.enum(['sage', 'clay', 'stone']).default('sage'),
    order: z.number().default(99),
    published: z.boolean().default(false),
  }),
});

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

export const collections = { 'case-studies': caseStudies, services };

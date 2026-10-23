import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * AMAVI Culture: one markdown file per post, in src/content/culture/.
 *
 * Adding a post is adding a file. Nothing here changes, no route is
 * registered by hand, and the listing, the feed and the sitemap all read from
 * this collection — see src/content/culture/README.md.
 *
 * README.md is excluded from the glob: it is instructions for whoever writes
 * the next post, not a post, and it would fail the schema below.
 */
const culture = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/README.md'], base: './src/content/culture' }),
  schema: z.object({
    title: z.string(),
    /** The standing line beneath the title, on the row and on the post. */
    subtitle: z.string().optional(),
    /** One or two sentences. The listing shows it, and so does the meta description. */
    excerpt: z.string(),
    date: z.coerce.date(),
    /** Minutes. Left out, the row simply has no reading time. */
    readingTime: z.number().optional(),
    tags: z.array(z.string()).optional(),
    /**
     * A cover image under /public, e.g. "/media/culture/fashion-month.jpg".
     * Never in the listing: the rows are an index, and the cursor preview came
     * off on 23 October 2026. Superseded on the post page by `heroImages`
     * below, and kept because it is what og:image uses.
     */
    image: z.string().optional(),
    /**
     * One or two pictures under /public, shown as a band above the title. Two
     * run side by side at equal height, at every width: the pair is a shape,
     * and stacking it on a phone would lose the shape rather than keep it.
     */
    heroImages: z.array(z.string()).min(1).max(2).optional(),
    /**
     * The piece on Substack. Every post here is a preview, so this is where
     * the reader is sent to finish it, and it carries the canonical link so
     * Substack is treated as the original.
     */
    substackUrl: z.string().url().or(z.literal('')).optional(),
    /** Never listed, never built. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { culture };

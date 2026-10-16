import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The journal: one markdown file per post, in src/content/journal/.
 *
 * Adding a post is adding a file. Nothing here changes, no route is
 * registered by hand, and the listing, the feed and the sitemap all read from
 * this collection — see src/content/journal/README.md.
 *
 * README.md is excluded from the glob: it is instructions for whoever writes
 * the next post, not a post, and it would fail the schema below.
 */
const journal = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/README.md'], base: './src/content/journal' }),
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
     * A cover image under /public, e.g. "/media/journal/fashion-month.jpg".
     * It is never shown in the listing row: it is the preview that follows the
     * cursor there, and the image under the title on the post's own page.
     */
    image: z.string().optional(),
    /**
     * Where the piece first appeared. Setting it points the post's canonical
     * link at Substack, so the two copies are not read as competing.
     */
    substackUrl: z.string().url().or(z.literal('')).optional(),
    /** Never listed, never built. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { journal };

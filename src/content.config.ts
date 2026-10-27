import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * AMAVI Culture: one markdown file per post, in src/content/culture/.
 *
 * Adding a post is adding a file. Nothing here changes, no route is
 * registered by hand, and the listing and the feed both read from this
 * collection — see src/content/culture/README.md.
 *
 * **Frontmatter only, since 28 October 2026.** The site no longer has article
 * pages: each piece is read on Substack, and its row in the listing links
 * there. A post is the fields below and nothing else; any text under the
 * frontmatter would never be shown.
 *
 * README.md is excluded from the glob: it is instructions for whoever writes
 * the next post, not a post, and it would fail the schema below.
 */
const culture = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/README.md'], base: './src/content/culture' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** One sentence. The row shows up to two lines of it, and so does the feed. */
      excerpt: z.string(),
      date: z.coerce.date(),
      /** Minutes. Left out, the row simply has no reading time. */
      readingTime: z.number().optional(),
      /** Where the piece is read, and where its row goes. Required: a row with nowhere to go is not a row. */
      substackUrl: z.string().url().startsWith('https://'),
      /**
       * The thumbnail, as a path from the post's own file: "./name.jpg", with
       * the picture in this folder. Optional; a post without one is a
       * text-only row.
       */
      image: image().optional(),
      /** Small print under the thumbnail, e.g. "Image: not owned by AMAVI Socials." */
      imageCredit: z.string().optional(),
      /**
       * Which part of the picture the 4:3 thumbnail keeps. "top" suits most
       * photographs of people, which is why it is the default.
       */
      imageCrop: z.enum(['top', 'center', 'bottom', 'left', 'right']).default('top'),
      /** Used in the feed only. */
      tags: z.array(z.string()).optional(),
      /** Never listed, never in the feed. */
      draft: z.boolean().default(false),
    }),
});

export const collections = { culture };

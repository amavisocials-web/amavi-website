import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Adding a service is adding a markdown file to src/content/services/ — no
 * page edits.
 */

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        summary: z.string(),
        includes: z.array(z.string()),
        order: z.number().default(99),
        /** Marks a service AMAVI has not yet confirmed it sells as a line item. */
        provisional: z.boolean().default(false),
        /**
         * The service's photograph, relative to the markdown file, e.g.
         * `image: ./images/campaign-management.jpg`. Shown at 4:5 and cropped
         * to fill; until it's set, an outlined placeholder holds the same space.
         */
        image: image().optional(),
        /** Describes the photograph. Required once `image` is set. */
        imageAlt: z.string().optional(),
      })
      .refine((data) => !data.image || data.imageAlt, {
        message: 'imageAlt is required when image is set',
        path: ['imageAlt'],
      }),
});

export const collections = { services };

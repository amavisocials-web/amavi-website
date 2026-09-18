// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { CREATOR_PATH } from './src/consts.ts';

// The production domain is set from the first commit so canonical URLs and
// sitemap entries are correct at launch. The site is reviewed on a Netlify
// subdomain until DNS access is granted — never hardcode that subdomain in
// links; all internal links are relative.
export default defineConfig({
  site: 'https://www.amavisocials.co',
  output: 'static',
  integrations: [
    sitemap({
      // A redirect is not a page; keep it out of the sitemap.
      filter: (page) => !page.endsWith('/creators/'),
    }),
  ],
  build: { inlineStylesheets: 'auto' },

  // /creators was the creator page's earlier address; anything already
  // linking there is sent on to the application page.
  redirects: {
    '/creators': CREATOR_PATH,
  },
});

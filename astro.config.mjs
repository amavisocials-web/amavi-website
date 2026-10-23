// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { CREATOR_PATH, CONTACT_PATH } from './src/consts.ts';

// The production domain is set from the first commit so canonical URLs and
// sitemap entries are correct at launch. The site is reviewed on a Netlify
// subdomain until DNS access is granted — never hardcode that subdomain in
// links; all internal links are relative.
/** The paths above, for the sitemap filter: a redirect is not a page. */
const REDIRECTED = ['/creators', '/services', '/journal'];

export default defineConfig({
  site: 'https://www.amavisocials.com',
  output: 'static',
  integrations: [
    sitemap({
      // A redirect is not a page; keep them all out of the sitemap.
      filter: (page) => !REDIRECTED.some((path) => page.endsWith(`${path}/`)),
    }),
  ],
  build: { inlineStylesheets: 'auto' },

  // Addresses that no longer have a page of their own. /creators was the
  // creator page's earlier one; /services is off the site for now
  // (src/pages/_services.astro), and anyone arriving on an old link or an old
  // search result is sent to Get in touch rather than shown a 404.
  redirects: {
    '/creators': CREATOR_PATH,
    '/services': CONTACT_PATH,
    /* The journal became AMAVI Culture on 23 October 2026. Anything already
       linking to the old address still lands. Post URLs are not redirected
       one by one: only the one piece existed, and it is in the sitemap at its
       new address. */
    '/journal': '/culture/',
  },
});

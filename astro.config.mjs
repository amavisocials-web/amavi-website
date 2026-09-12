// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The production domain is set from the first commit so canonical URLs and
// sitemap entries are correct at launch. The site is reviewed on a Netlify
// subdomain until DNS access is granted — never hardcode that subdomain in
// links; all internal links are relative.
export default defineConfig({
  site: 'https://www.amavisocials.co',
  output: 'static',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});

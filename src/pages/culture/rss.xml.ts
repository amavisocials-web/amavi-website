import type { APIRoute } from 'astro';
import { publishedPosts } from '../../lib/culture';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '../../consts';

/**
 * The AMAVI Culture feed, at /culture/rss.xml.
 *
 * Written by hand rather than through a dependency: the feed is a handful of
 * fields, and the only thing that has to be right is the escaping, which is
 * below and covers the five characters XML reserves.
 *
 * Each item points at the piece on Substack, as its link and its guid. Since
 * 28 October 2026 that is where every piece is read: the site has no article
 * pages of its own.
 *
 * It reads the same published list as the listing, so a draft is absent from
 * both or neither.
 */
const escape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = async () => {
  const posts = await publishedPosts();
  const self = new URL('/culture/rss.xml', SITE_URL).href;

  const items = posts
    .map((post) => {
      const link = post.data.substackUrl;
      return [
        '    <item>',
        `      <title>${escape(post.data.title)}</title>`,
        `      <link>${escape(link)}</link>`,
        `      <guid isPermaLink="true">${escape(link)}</guid>`,
        `      <description>${escape(post.data.excerpt)}</description>`,
        `      <pubDate>${post.data.date.toUTCString()}</pubDate>`,
        ...(post.data.tags ?? []).map((tag) => `      <category>${escape(tag)}</category>`),
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`${SITE_NAME} | AMAVI Culture`)}</title>
    <link>${escape(new URL('/culture/', SITE_URL).href)}</link>
    <atom:link href="${escape(self)}" rel="self" type="application/rss+xml" />
    <description>${escape(SITE_DESCRIPTION)}</description>
    <language>en-ie</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};

import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'culture'>;

/**
 * Every published post, newest first.
 *
 * One place decides two things, so nothing can disagree with anything else:
 * drafts never leave this function, and the order is always by date,
 * descending. The listing, each post page, the "next" rows and the feed all
 * read from here.
 */
export async function publishedPosts(): Promise<Post[]> {
  const posts = await getCollection('culture', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Up to `count` other posts, newest first: what to read after this one. */
export async function otherPosts(slug: string, count = 2): Promise<Post[]> {
  const posts = await publishedPosts();
  return posts.filter((post) => post.id !== slug).slice(0, count);
}

/** "08 Oct 2026" — the date as the rows and the post header set it. */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** "2026-10-08", for datetime attributes and structured data. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export const culturePath = (slug: string) => `/culture/${slug}/`;

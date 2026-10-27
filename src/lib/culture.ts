import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'culture'>;

/**
 * Every published post, newest first.
 *
 * One place decides two things, so nothing can disagree with anything else:
 * drafts never leave this function, and the order is always by date,
 * descending. The listing and the feed both read from here.
 */
export async function publishedPosts(): Promise<Post[]> {
  const posts = await getCollection('culture', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** "08 Oct 2026" — the date as the rows set it. */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** "2026-10-08", for datetime attributes. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

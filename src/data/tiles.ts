/**
 * Creator content from AMAVI's own campaigns, self-hosted in
 * public/media/tiles/. Every tile here drifts beside the figures on the home
 * page (src/components/Numbers.astro), which deals out the order.
 *
 * Changed on 17 October 2026: the two that led the collage, tiles 1 and 3,
 * were replaced by new footage and their files deleted. Tiles 6, 7 and 8 are
 * the new clips, and tile 5 came back in.
 *
 * Changed on 23 October 2026: tile 4, the Pearls Collective jewellery clip,
 * was taken out and its files deleted. It was asked for twice over, once as
 * the jewellery content and once as the creator with long brown hair in the
 * black strapless top — she is the one modelling the necklace, and the frame
 * carries the Pearls Collective watermark, so the two were one clip. **Five
 * are left.**
 *
 * TODO(client): **the collage wants five more clips.** Two columns of five is
 * ten slots against these five, so the collage runs three tiles in one column
 * and two in the other, each clip appearing exactly once — no repeats, but
 * short of the five-a-column the brief asks for. Five more would fill both
 * columns with nothing seen twice. Portrait 9:16, please: tile 7 arrived
 * landscape and had to be cropped to a third of its frame.
 *
 * Each tile links to its original Instagram post (`href`), opening in a new
 * tab, since 27 October 2026. A tile without one renders unlinked.
 *
 * - `src` is the video's base path, with no extension: the tile plays
 *   `<src>.webm` and `<src>.mp4`, whichever exist, and preloads neither.
 * - With no video file, the tile shows `poster` as an image, for a post that's
 *   a photo rather than a video.
 * - With neither file, the tile is an empty frame at the same 9:16, and the
 *   build logs which one is missing.
 *
 * The videos are the first 12 seconds of each post: silent H.264 at 540×960,
 * each under 2MB, with the first frame as the poster. See README → Visual content to make
 * more.
 *
 * TODO(client): creator handle and consent, for every tile. `credit` stays
 * empty (and nothing shows under the tile) until the creator's handle is
 * supplied and both the creator and the client have signed off on the post
 * appearing here (brief §5).
 */
export interface ContentTile {
  /** Video base path under /public, no extension. */
  src: string;
  /** The still: the video's first frame, or the image itself for a photo post. */
  poster: string;
  /** The original Instagram post. Optional: without one the tile is not a link. */
  href?: string;
  /** The creator's handle, e.g. '@handle', shown under the tile. Empty until cleared. */
  credit: string;
  /** What the post shows. Leads the link's accessible name. */
  alt: string;
}

export const TILES: ContentTile[] = [
  {
    src: '/media/tiles/tile-6',
    poster: '/media/tiles/tile-6.jpg',
    href: 'https://www.instagram.com/reel/DbJTBDFq21K/',
    credit: '',
    alt: 'A creator talks to camera in a car about being called thick for having ADHD',
  },
  {
    src: '/media/tiles/tile-7',
    poster: '/media/tiles/tile-7.jpg',
    href: 'https://www.instagram.com/p/DeMpxYwisJA/',
    credit: '',
    alt: 'A laptop on a table showing a grid of campaign photographs',
  },
  {
    src: '/media/tiles/tile-8',
    poster: '/media/tiles/tile-8.jpg',
    href: 'https://www.instagram.com/p/DejsiKOtqb7/',
    credit: '',
    alt: 'A magazine open on a portrait of Audrey Hepburn',
  },
  {
    src: '/media/tiles/tile-2',
    poster: '/media/tiles/tile-2.jpg',
    href: 'https://www.instagram.com/p/DbGxroTo6C0/',
    credit: '',
    alt: 'A creator chats with a brand founder on a bench by the sea in Dingle',
  },
  {
    src: '/media/tiles/tile-5',
    poster: '/media/tiles/tile-5.jpg',
    href: 'https://www.instagram.com/reel/DdPIN9tOP-8/',
    credit: '',
    alt: 'A man tells his story in a podcast-style interview',
  },
];

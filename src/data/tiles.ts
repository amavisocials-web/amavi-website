/**
 * Creator content from AMAVI's own campaigns, self-hosted in
 * public/media/tiles/. Tiles 1–4 play behind the home page's stat tiles
 * (src/components/StatTiles.astro), in this order. Tile 5 isn't on the site:
 * its burned-in captions read badly as a silent background loop.
 * (src/components/ContentTiles.astro, a linked row of all five, is kept but
 * not currently used.)
 *
 * Each tile keeps the link to its original Instagram post, for the linked row.
 *
 * - `src` is the video's base path, with no extension: the tile plays
 *   `<src>.webm` and `<src>.mp4`, whichever exist, and preloads neither.
 * - With no video file, the tile shows `poster` as an image, for a post that's
 *   a photo rather than a video.
 * - With neither file, the tile is an empty frame at the same 9:16, and the
 *   build logs which one is missing.
 *
 * The videos are the first 12 seconds of each post (tile 4 is whole): silent
 * H.264 at 540×960 (tile 1 at 360×640, all its source had), each under 2MB,
 * with the first frame as the poster. See README → Visual content to make
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
  /** The original Instagram post. */
  href: string;
  /** The creator's handle, e.g. '@handle', shown under the tile. Empty until cleared. */
  credit: string;
  /** What the post shows. Leads the link's accessible name. */
  alt: string;
}

export const TILES: ContentTile[] = [
  {
    src: '/media/tiles/tile-1',
    poster: '/media/tiles/tile-1.jpg',
    href: 'https://www.instagram.com/p/DVyh_TzjFtj/',
    credit: '',
    alt: 'A creator in a pageant sash talks to camera outdoors',
  },
  {
    src: '/media/tiles/tile-2',
    poster: '/media/tiles/tile-2.jpg',
    href: 'https://www.instagram.com/p/DbGxroTo6C0/',
    credit: '',
    alt: 'A creator chats with a brand founder on a bench by the sea in Dingle',
  },
  {
    src: '/media/tiles/tile-3',
    poster: '/media/tiles/tile-3.jpg',
    href: 'https://www.instagram.com/reel/DcjliuSOy5p/',
    credit: '',
    alt: 'Back to school, but make it cool: a creator models outfits in a doorway',
  },
  {
    src: '/media/tiles/tile-4',
    poster: '/media/tiles/tile-4.jpg',
    href: 'https://www.instagram.com/reel/DaZ3JjetuND/',
    credit: '',
    alt: 'A creator models a crystal necklace, earrings and bracelet',
  },
  {
    src: '/media/tiles/tile-5',
    poster: '/media/tiles/tile-5.jpg',
    href: 'https://www.instagram.com/p/DdE56TYOjHF/',
    credit: '',
    alt: 'A man tells his story in a podcast-style interview',
  },
];

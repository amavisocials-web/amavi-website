import type { ImageMetadata } from 'astro';

import cafeLaptop from '../assets/media/services-head.jpg';
import areaCreatorMarketing from '../assets/media/area-creator-marketing.jpg';
import areaBrandStrategy from '../assets/media/area-brand-strategy.jpg';
import areaGrowthPartnerships from '../assets/media/area-growth-partnerships.jpg';
import sectorSeafood from '../assets/media/sector-seafood.jpg';
import sectorHealthcare from '../assets/media/sector-healthcare.jpg';
import sectorWellness from '../assets/media/sector-wellness.jpg';
import sectorFood from '../assets/media/sector-food.jpg';
import sectorFashion from '../assets/media/sector-fashion.jpg';
import about2 from '../assets/media/about-2.jpg';
import about3 from '../assets/media/about-3.jpg';

/**
 * Every image and video slot on the site, in one place. Swap a file here (or
 * the file itself) and the page follows; leave a slot out and it shows its
 * outlined "Add image" / "Add video" frame.
 *
 * TODO(client): temporary fills, "until further notice". Each slot below holds
 * whatever was supplied on 21 September 2026, cropped to the slot's ratio —
 * replace each with the final photograph or footage. Sources:
 *   - cafe photo, and IMG_9245.mov (the café laptop): AMAVI's own
 *   - Video-43037.mp4: AMAVI's MyIrelandBox campaign (creator consent still
 *     to confirm, as for the other creator videos — see src/data/tiles.ts)
 *   - 16521739, 15636407, 6558143, 6374165: supplied clips with stock-library
 *     file names (6558143 is the stock office clip taken off the hero earlier)
 */

export interface ImageSlot {
  image: ImageMetadata;
  alt: string;
}

export interface VideoSlot {
  /** Base path under /public, no extension: `<src>.mp4`, poster `<src>.jpg`. */
  src: string;
}

const cafe: ImageSlot = { image: cafeLaptop, alt: 'A laptop showing the AMAVI Socials logo on a café table' };

export const MEDIA = {
  home: {
    /** "Creators are one part of the equation." 2:3. From 16521739. */
    creators: { src: '/media/features/creators' } as VideoSlot,
    /** "How we work." 2:3. From 15636407, first 12 seconds. */
    howWeWork: { src: '/media/features/studio' } as VideoSlot,
  },
  services: {
    head: cafe,
    /** Keyed by area id in src/data/services.ts. 2:3. */
    areas: {
      'creator-marketing': { image: areaCreatorMarketing, alt: 'A content studio, with a team at their desks' },
      'brand-campaign-strategy': { image: areaBrandStrategy, alt: 'An office, with a screen reading “Digital Marketing”' },
      'growth-partnerships': { image: areaGrowthPartnerships, alt: 'A creator and a brand founder talking on a bench by the sea' },
    } as Record<string, ImageSlot | undefined>,
    /** In the order of SECTOR_EXAMPLES in src/data/services.ts. 4:5. */
    sectors: [
      { image: sectorSeafood, alt: 'Sea cliffs on the Irish coast' },
      { image: sectorHealthcare, alt: 'A laptop in a quiet lounge' },
      { image: sectorWellness, alt: 'A woman at a laptop in a café' },
      { image: sectorFood, alt: 'A creator unboxing a parcel' },
      { image: sectorFashion, alt: 'A model on set at a photo shoot' },
    ] as (ImageSlot | undefined)[],
  },
  /** Four portraits, 2:3. */
  about: [
    cafe,
    { image: about2, alt: 'A woman closing a laptop in a café' },
    { image: about3, alt: 'An open gift box reading “Hello from Ireland!”' },
    { image: areaGrowthPartnerships, alt: 'A creator and a brand founder on a bench by the sea' },
  ] as (ImageSlot | undefined)[],
};

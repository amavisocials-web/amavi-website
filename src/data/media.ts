import type { ImageMetadata } from 'astro';

import cafeLaptop from '../assets/media/services-head.jpg';
import areaCreatorMarketing from '../assets/media/area-creator-marketing.jpg';
import areaBrandStrategy from '../assets/media/area-brand-strategy.jpg';
import areaContentSocial from '../assets/media/area-content-social.jpg';
import areaGrowthPartnerships from '../assets/media/area-growth-partnerships.jpg';
import seaCliffs from '../assets/media/sector-seafood.jpg';
import sectorHealthcare from '../assets/media/sector-healthcare.jpg';
import sectorWellness from '../assets/media/sector-wellness.jpg';
import unboxing from '../assets/media/sector-food.jpg';
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
 *     file names (6558143 is the stock office clip taken off the hero earlier).
 *     The Content & Social still (22 September) is 15636407 at 6 seconds.
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
      'content-social': { image: areaContentSocial, alt: 'A studio set for a shoot: lights, cameras and a rail of clothes' },
      'growth-partnerships': { image: areaGrowthPartnerships, alt: 'A creator and a brand founder talking on a bench by the sea' },
    } as Record<string, ImageSlot | undefined>,
    /**
     * Keyed by sector name in src/data/services.ts. 4:5.
     * TODO(client): nothing supplied suits Tech & Startups without repeating a
     * picture already on the page, so it shows "Add image" until one arrives.
     */
    sectors: {
      'Food & Hospitality': { image: unboxing, alt: 'A creator unboxing a parcel' },
      Healthcare: { image: sectorHealthcare, alt: 'A laptop in a quiet lounge' },
      Wellness: { image: sectorWellness, alt: 'A woman at a laptop in a café' },
      'Fashion & Beauty': { image: sectorFashion, alt: 'A model on set at a photo shoot' },
      'Lifestyle & Travel': { image: seaCliffs, alt: 'Sea cliffs on the Irish coast' },
    } as Record<string, ImageSlot | undefined>,
  },
  /** Four portraits, 2:3. */
  about: [
    cafe,
    { image: about2, alt: 'A woman closing a laptop in a café' },
    { image: about3, alt: 'An open gift box reading “Hello from Ireland!”' },
    { image: areaGrowthPartnerships, alt: 'A creator and a brand founder on a bench by the sea' },
  ] as (ImageSlot | undefined)[],
};

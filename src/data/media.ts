import type { ImageMetadata } from 'astro';

import servicesInvoice from '../assets/media/services-invoice.jpg';
import homeCreators from '../assets/media/home-creators.jpg';
import areaCreatorCommunity from '../assets/media/area-creator-community.jpg';
import areaCreatorUgc from '../assets/media/area-creator-ugc.jpg';
import areaAffiliateMarketing from '../assets/media/area-affiliate-marketing.jpg';
import seaCliffs from '../assets/media/sector-seafood.jpg';
import sectorHealthcare from '../assets/media/sector-healthcare.jpg';
import sectorWellness from '../assets/media/sector-wellness.jpg';
import unboxing from '../assets/media/sector-food.jpg';
import sectorFashion from '../assets/media/sector-fashion.jpg';
import aboutPhilosophy from '../assets/media/about-philosophy.jpg';

/**
 * Every image and video slot on the site, in one place. Swap a file here (or
 * the file itself) and the page follows; leave a slot out and it shows its
 * outlined "Add image" / "Add video" frame.
 *
 * TODO(client): temporary fills, "until further notice". Each slot below holds
 * whatever was supplied on 21 September 2026, cropped to the slot's ratio —
 * replace each with the final photograph or footage. Sources:
 *   - cafe photo: AMAVI's own, as is the hero footage (src/consts.ts)
 *   - Video-43037.mp4: AMAVI's MyIrelandBox campaign (creator consent still
 *     to confirm, as for the other creator videos — see src/data/tiles.ts)
 *   - 16521739, 15636407, 6558143, 6374165: supplied clips with stock-library
 *     file names (6558143 is the stock office clip taken off the hero earlier).
 *     The Content & Social still (22 September) is 15636407 at 6 seconds.
 */

export interface ImageSlot {
  image: ImageMetadata;
  alt: string;
  /**
   * Where the picture starts beside a column of text: level with the top of
   * it (the default), or level with the paragraph, below the number and
   * title. Only the service areas read this.
   */
  align?: 'top' | 'body';
}

export interface VideoSlot {
  /** Base path under /public, no extension: `<src>.mp4`, poster `<src>.jpg`. */
  src: string;
}

export const MEDIA = {
  home: {
    /**
     * "Creators are one part of the equation." 2:3. AMAVI's own: campaign work
     * for Le Olive and ADHD Now on the board (supplied 29 September 2026,
     * cropped past the Instagram overlay it came with). It replaced the
     * creators loop, which is still in public/media/features/ if wanted back.
     */
    creators: {
      image: homeCreators,
      alt: 'Someone looking at a board of AMAVI campaign work for Le Olive and ADHD Now',
    } as ImageSlot,
    /** "How we work." 2:3. From 15636407, first 12 seconds. */
    howWeWork: { src: '/media/features/studio' } as VideoSlot,
  },
  services: {
    /**
     * "Your goal comes first." 2:3. AMAVI's own: a printed receipt of the five
     * practice areas (supplied 30 September 2026), in place of the café laptop
     * photograph that was here.
     */
    head: {
      image: servicesInvoice,
      alt: 'A printed receipt headed “Services Invoice”, listing AMAVI’s five practice areas with each price still to be decided',
    } as ImageSlot,
    /**
     * Keyed by area id in src/data/services.ts. 2:3. `null` is an area that
     * runs without a picture on purpose; a missing key is one still waiting
     * for one, and shows "Add image".
     */
    areas: {
      'creator-community-aor': { image: areaCreatorCommunity, alt: 'Someone holding an oversized phone showing a fashion brand’s online shop' },
      'creator-campaigns': null,
      'creator-ugc': { image: areaCreatorUgc, alt: 'A grid of small printed creator photographs pinned to a steel sheet' },
      'live-experiences': null,
      'affiliate-marketing': { image: areaAffiliateMarketing, alt: 'Someone filming a flat lay of printed campaign shots on a phone mounted on a tripod', align: 'body' },
    } as Record<string, ImageSlot | null | undefined>,
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
  /**
   * Four portraits, 2:3. Not rendered at the moment: the row of cards came off
   * /about on 29 September 2026. Kept so putting it back is one line.
   */
  /** Behind "Our philosophy" on /about, under a black overlay: decoration. */
  philosophy: {
    image: aboutPhilosophy,
    alt: '',
  } as ImageSlot,
};

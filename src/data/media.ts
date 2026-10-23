import type { ImageMetadata } from 'astro';

import servicesInvoice from '../assets/media/services-invoice.jpg';
import homeCaseStudy from '../assets/media/home-case-study.jpg';
import areaCreatorCommunity from '../assets/media/area-creator-community.jpg';
import areaCreatorUgc from '../assets/media/area-creator-ugc.jpg';
// Affiliate Marketing came off the service list on 5 October 2026. The file
// stays in ../assets/media/, deliberately NOT imported: Astro copies every
// imported image into the build whether or not a page shows it. Uncomment
// this and its entry below if the area comes back.
// import areaAffiliateMarketing from '../assets/media/area-affiliate-marketing.jpg';
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
     * The case study. 2:3. AMAVI's own: the studio wall, with the printed
     * sign and a laptop of content on the trolley (supplied 17 October 2026),
     * replacing the earlier wide board shot.
     *
     * **Already cropped to 2:3**, so the frame crops nothing and the picture
     * is the same at every width. The photograph is 3:4; the 133px came off
     * the right, which was blazer and hair, because a centre crop clipped the
     * A from the AutismCare sheet on the left. The full-height original is
     * not in the repo — ask the client for it before re-cropping.
     *
     * Named `caseStudy`, not `creators`: the section it feeds has been the
     * case study since 7 October 2026.
     */
    caseStudy: {
      image: homeCaseStudy,
      alt: 'Someone in a black blazer at a wall of printed AMAVI campaign work, holding a sheet reading “This is your sign. Get professional marketing help.”, with a laptop of content on a trolley beside them',
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
      // TODO(client): nothing supplied suits Founder & Personal Brand or
      // Mobile First Organic Content, the two areas added on 5 October 2026,
      // so both open on their paragraph alone rather than on "Add image".
      'founder-personal-brand': null,
      'live-experiences': null,
      'mobile-first-organic': null,
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

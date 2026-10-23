import type { ImageMetadata } from 'astro';

import adhdNow from '../assets/logos/adhd-now.png';
import autismcare from '../assets/logos/autismcare-ireland.png';
import cleaningDoctor from '../assets/logos/cleaning-doctor-hub.png';
import fettle from '../assets/logos/fettle.png';
import leOlive from '../assets/logos/le-olive.png';
import line98 from '../assets/logos/line-98.png';
import myirelandbox from '../assets/logos/myirelandbox.png';
import pearlsCollective from '../assets/logos/pearls-collective.png';
import theHumbleFishmonger from '../assets/logos/the-humble-fishmonger.png';

// Beyond BMI was held back until 17 October 2026, when the client asked for it
// in the row and supplied its address. The supplied artwork is a white mark on
// a solid blue square; the copy in this folder was already black on
// transparent, and was cut to the roundel and the "Beyondbmi" wordmark, with
// the "Begin with Biology" strapline left off because at the row's height it
// would be about two pixels tall. That matches ADHD Now, the other roundel
// with its name under it. The uncut lockup, strapline and all, is still at
// ../assets/logos/pending/beyond-bmi.png and is not imported, so it ships
// nowhere: it is there in case the full lockup is ever wanted.
import beyondBmi from '../assets/logos/beyond-bmi.png';

/**
 * The clients, in the order the logo rows show them.
 *
 * Every logo file is solid black on transparent: `npm run logos:mono`
 * converted the supplied colour artwork in place (the originals are in git
 * history, and a recovered colour set sits unimported in
 * ../assets/logos/colour/). Light areas enclosed by the artwork stay open —
 * the knocked-out "IRELAND BOX" lettering, the ADHD Now roundel centre, the
 * Cleaning Doctor disc — and The Humble Fishmonger, supplied light-on-navy,
 * and Line 98, white-on-maroon, were inverted so their lettering is the black.
 *
 * Line 98 and Pearls Collective came as square social images, so each was cut
 * to its wordmark before the conversion. Pearls Collective's full stop is a
 * photographed pearl, redrawn as a flat dot the size of the pearl, as a
 * one-colour version of the logo would have it.
 *
 * Each file is trimmed to its own artwork, so a shared display height sizes
 * every logo by its mark rather than by its export settings.
 */
export interface Client {
  /** The client's name, as used in the alt text and the link's label. */
  name: string;
  /**
   * The logo file. Leave it out while none has been supplied and the name is
   * set in type in its place, at the same optical weight as the logos.
   */
  logo?: ImageMetadata;
  /**
   * The client's site. An empty string renders the logo as a plain image:
   * no link, no cursor, no hover. Filling it in is all a logo needs to
   * become a link.
   */
  url: string;
  /**
   * Hides the client from every row. Does NOT keep the file off the server:
   * for a client awaiting sign-off, leave the file in ../assets/logos/pending/
   * and its import commented out, as above.
   */
  cleared: boolean;
  /** Per-logo optical nudge, where a mark reads heavy or light beside the rest. */
  scale?: number;
}

/*
 * `scale` evens out ink, on top of the equal-area sizing. Equal area gets the
 * geometry right but cannot see how much of each box is black: the ADHD Now
 * disc is 49% ink, the Cleaning Doctor ring 21%. Each value starts from the one
 * that equalises measured ink and bounding area half and half, then was
 * checked by eye against the rendered row. MyIrelandBox sits above its
 * computed 0.90: its ink is packed into the box, and smaller than this the
 * knocked-out lettering closes up. The Humble Fishmonger is fine stipple and
 * small caps, so it sits above its computed 1.21 for the same reason.
 *
 * Beyond BMI is a solid disc with its name under it, square at 588x589, so
 * equal-area sizing gives it a factor of 1.00 and it would stand taller than
 * every wordmark in the row. Its 0.95 brings it level: a filled circle reads
 * heavier than a line of type at the same height, which is the same reason
 * ADHD Now sits at 0.96.
 *
 * A client without a logo file has its name set in type; there `scale`
 * multiplies the type size instead, set so each name's measured ink lands in
 * the range of the logos around it — a long name smaller, a short one larger.
 * Every client now has both a file and an address, so that branch and the
 * unlinked one in LogoWall.astro are kept for the next client rather than for
 * a current one.
 *
 * Re-measure if a logo file changes: all of them are solid black on
 * transparent (npm run logos:mono), so ink is simply total alpha.
 */
export const CLIENTS: Client[] = [
  { name: 'Fettle',                logo: fettle,              url: 'https://fettle.ie',                                      cleared: true, scale: 1.06 },
  { name: 'AutismCare',            logo: autismcare,          url: 'https://autismcare.ie',                                  cleared: true, scale: 0.93 },
  { name: 'ADHD Now',              logo: adhdNow,             url: 'https://adhdnow.ie',                                     cleared: true, scale: 0.96 },
  { name: 'Le Olive',              logo: leOlive,             url: 'https://le-olive.com',                                   cleared: true, scale: 1.08 },
  { name: 'MyIrelandBox',          logo: myirelandbox,        url: 'https://www.myirelandbox.com',                           cleared: true, scale: 1.08 },
  { name: 'Cleaning Doctor',       logo: cleaningDoctor,      url: 'https://cleaningdoctor.net',                             cleared: true, scale: 1.19 },
  { name: 'Beyond BMI',            logo: beyondBmi,           url: 'https://beyondbmi.ie',                                   cleared: true, scale: 0.95 },
  { name: 'The Humble Fishmonger', logo: theHumbleFishmonger, url: 'https://www.thehumblefishmonger.com/',                  cleared: true, scale: 1.4 },
  { name: 'Line 98',               logo: line98,              url: 'https://www.instagram.com/lineninetyeight/',             cleared: true, scale: 1.15 },
  { name: 'Pearls Collective',     logo: pearlsCollective,    url: 'https://www.instagram.com/pearlscollective/',            cleared: true, scale: 1.11 },
];

/**
 * Optical sizing factor.
 *
 * A shared height makes a 6:1 wordmark tower over a 1:1 roundel, because the
 * eye weighs a mark by the area it covers, not by how tall it is. Sizing so
 * they cover comparable area means height falls off as the ratio grows:
 * h ∝ 1 / ratio^EXP.
 *
 * 0.5 is exactly equal area, which over-shrinks very wide wordmarks until they
 * are hard to read. 0.45 keeps most of the correction and stays legible.
 *
 * A row multiplies its base height by this, so a logo is the same size
 * wherever the row appears. For a client set in type, it is the scale.
 */
export const OPTICAL_EXP = 0.45;

export const opticalK = (client: Client) =>
  client.logo
    ? (1 / Math.pow(client.logo.width / client.logo.height, OPTICAL_EXP)) * (client.scale ?? 1)
    : (client.scale ?? 1);

/** A row only ever shows cleared clients. */
export const clearedClients = () => CLIENTS.filter((client) => client.cleared);

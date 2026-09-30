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

// TODO(client): Beyond BMI is not cleared for publication (brief §9), so it is
// listed below with `cleared: false` and its file stays in
// ../assets/logos/pending/, deliberately NOT imported: Astro copies every
// imported image into the public build, rendered or not, so importing it here
// would put an uncleared client's logo on the live server. Once sign-off
// lands, move the file up a folder, uncomment this import, point `logo` at it
// and set `cleared: true`.
// import beyondBmi from '../assets/logos/beyond-bmi.png';

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
 * A client without a logo file has its name set in type; there `scale`
 * multiplies the type size instead, set so each name's measured ink lands in
 * the range of the logos around it — a long name smaller, a short one larger.
 *
 * Re-measure if a logo file changes: all of them are solid black on
 * transparent (npm run logos:mono), so ink is simply total alpha.
 */
export const CLIENTS: Client[] = [
  { name: 'Fettle',                logo: fettle,              url: 'https://fettle.ie',              cleared: true, scale: 1.06 },
  { name: 'AutismCare',            logo: autismcare,          url: 'https://autismcare.ie',          cleared: true, scale: 0.93 },
  { name: 'ADHD Now',              logo: adhdNow,             url: 'https://adhdnow.ie',             cleared: true, scale: 0.96 },
  { name: 'Le Olive',              logo: leOlive,             url: 'https://le-olive.com',           cleared: true, scale: 1.08 },
  { name: 'MyIrelandBox',          logo: myirelandbox,        url: 'https://www.myirelandbox.com',   cleared: true, scale: 1.08 },
  { name: 'Cleaning Doctor',       logo: cleaningDoctor,      url: 'https://cleaningdoctor.net',     cleared: true, scale: 1.19 },
  { name: 'The Humble Fishmonger', logo: theHumbleFishmonger, url: '',                               cleared: true, scale: 1.4 },
  { name: 'Line 98',               logo: line98,              url: '',                               cleared: true, scale: 1.15 },
  { name: 'Pearls Collective',     logo: pearlsCollective,    url: '',                               cleared: true, scale: 1.11 },

  // TODO(client): the two empty urls above, and sign-off below — see the note
  // on the imports. The Humble Fishmonger has no website.
  { name: 'Beyond BMI',            logo: undefined,           url: 'https://beyondbmi.ie',           cleared: false },
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

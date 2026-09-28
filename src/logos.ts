import type { ImageMetadata } from 'astro';

import adhdNow from './assets/logos/adhd-now.png';
import autismcareIreland from './assets/logos/autismcare-ireland.png';
import cleaningDoctorHub from './assets/logos/cleaning-doctor-hub.png';
import fettle from './assets/logos/fettle.png';
import leOlive from './assets/logos/le-olive.png';
import line98 from './assets/logos/line-98.png';
import myirelandbox from './assets/logos/myirelandbox.png';
import pearlsCollective from './assets/logos/pearls-collective.png';
import theHumbleFishmonger from './assets/logos/the-humble-fishmonger.png';

// TODO(client): Beyond BMI is not cleared for publication (brief §9). Its file
// sits in ./assets/logos/pending/ and is deliberately NOT imported: Astro
// copies every imported image into the public build, rendered or not, so
// importing it here would put an uncleared client's logo on the live server.
// Once sign-off lands, move the file up a folder and uncomment its import and
// manifest line below.
// import beyondBmi from './assets/logos/beyond-bmi.png';

/**
 * Client logos, supplied by AMAVI.
 *
 * Every file is solid black on transparent: `npm run logos:mono` converted the
 * supplied colour artwork in place (the originals are in git history). Light
 * areas enclosed by the artwork stay open — the knocked-out "IRELAND BOX"
 * lettering, the ADHD Now roundel centre, the Cleaning Doctor disc — and The
 * Humble Fishmonger, supplied light-on-navy, and Line 98, white-on-maroon, were
 * inverted so their lettering is the black. There are no colour versions on
 * the site.
 *
 * Le Olive came as a gold gradient on white (supplied 24 September 2026); the
 * gradient reads as ink at every stop, so it converted to a solid black script
 * in one pass.
 *
 * Line 98 and Pearls Co. came as square social images, so each was cut to its
 * wordmark before the conversion. Pearls Co.'s full stop is a photographed
 * pearl, which would convert to a broken crescent of shading; it was redrawn
 * as a flat dot the size of the pearl, as a one-colour version of the logo
 * would have it. The "ESTD 2021" line under that image is not part of the mark.
 *
 * Each file is also trimmed to its own artwork, so the surrounding canvas no
 * longer varies from logo to logo and a shared display height sizes them by
 * their mark rather than by their export settings.
 *
 * Only clients already public on the related agency site may appear (brief
 * §9). Note what keeps a logo off the site: NOT importing it. `cleared: false`
 * hides a logo from every page, but Astro still copies any imported image into
 * the public build — so for a client awaiting sign-off, leave the file in
 * ./assets/logos/pending/ and its import commented out, as below.
 */
export interface ClientLogo {
  /** The client's name, as used in the logo's alt text. */
  name: string;
  /**
   * The logo file. Leave it out while none has been supplied, and the name is
   * set in type in its place, at the same optical weight as the logos.
   */
  src?: ImageMetadata;
  /** Hides the logo from pages. Does NOT keep the file off the server — see above. */
  cleared: boolean;
  /** Per-logo optical nudge, where a mark reads heavy or light beside the rest. */
  scale?: number;
}

/*
 * `scale` evens out ink, on top of the equal-area sizing. Equal area gets the
 * geometry right but cannot see how much of each box is black: the ADHD Now
 * disc is 49% ink, the Cleaning Doctor ring 21%. Each value starts from the one
 * that equalises measured ink and bounding area half and half, then was
 * checked by eye against the rendered wall. MyIrelandBox sits above its
 * computed 0.90: its ink is packed into the box, and smaller than this the
 * knocked-out lettering closes up. The Humble Fishmonger is fine stipple and
 * small caps, so it sits above its computed 1.21 for the same reason.
 *
 * A partner without a logo file has its name set in type; there `scale`
 * multiplies the type size instead, set so each name's measured ink lands in
 * the range of the logos around it — a long name smaller, a short one larger.
 *
 * Re-measure if a logo file changes: all of them are solid black on
 * transparent (npm run logos:mono), so ink is simply total alpha.
 */
export const CLIENT_LOGOS: ClientLogo[] = [
  // In display order.
  { name: 'ADHD Now',              src: adhdNow,             cleared: true,  scale: 0.96 },
  { name: 'Line 98',               src: line98,              cleared: true,  scale: 1.15 },
  { name: 'Fettle',                src: fettle,              cleared: true,  scale: 1.06 },
  { name: 'The Humble Fishmonger', src: theHumbleFishmonger, cleared: true,  scale: 1.4 },
  { name: 'AutismCare Ireland',    src: autismcareIreland,   cleared: true,  scale: 0.93 },
  { name: 'Pearls Collective',     src: pearlsCollective,    cleared: true,  scale: 1.11 },
  { name: 'Cleaning Doctor Hub',   src: cleaningDoctorHub,   cleared: true,  scale: 1.19 },
  { name: 'Le Olive',              src: leOlive,             cleared: true,  scale: 1.08 },
  { name: 'MyIrelandBox',          src: myirelandbox,        cleared: true,  scale: 1.08 },

  // Pending sign-off — see the note on the imports above.
  // { name: 'Beyond BMI',            src: beyondBmi,           cleared: true },
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
 * The logo wall multiplies its base height by this, so a logo is the same
 * size wherever the wall appears. For a partner set in type, it is the scale.
 */
export const OPTICAL_EXP = 0.45;

export const opticalK = (logo: ClientLogo) =>
  logo.src
    ? (1 / Math.pow(logo.src.width / logo.src.height, OPTICAL_EXP)) * (logo.scale ?? 1)
    : (logo.scale ?? 1);

/** The wall only ever shows cleared logos. */
export const clearedLogos = () => CLIENT_LOGOS.filter((l) => l.cleared);


import type { ImageMetadata } from 'astro';

import adhdNow from './assets/logos/adhd-now.png';
import autismcareIreland from './assets/logos/autismcare-ireland.png';
import cleaningDoctorHub from './assets/logos/cleaning-doctor-hub.png';
import fettle from './assets/logos/fettle.png';
import myirelandbox from './assets/logos/myirelandbox.png';

// TODO(client): not cleared for publication (brief §9). Their files sit in
// ./assets/logos/pending/ and are deliberately NOT imported: Astro copies every
// imported image into the public build, rendered or not, so importing them
// here would put an uncleared client's logo on the live server. Once sign-off
// lands, move the file up a folder, uncomment its import and manifest line
// below, and set `published: true` in the matching case study.
// import theHumbleFishmonger from './assets/logos/the-humble-fishmonger.png';
// import beyondBmi from './assets/logos/beyond-bmi.png';

/**
 * Client logos, supplied by AMAVI.
 *
 * Each file has been trimmed to its own artwork, so the surrounding canvas no
 * longer varies from logo to logo and a shared display height sizes them by
 * their mark rather than by their export settings.
 *
 * The white background each logo shipped on has been cut at the asset level:
 * a flood fill inward from the border clears background white while leaving
 * white that is enclosed by artwork alone — the knocked-out "IRELAND BOX"
 * lettering, the ADHD Now roundel centre, the Cleaning Doctor disc. That is
 * why these sit on any surface without a blend mode, and why re-exporting one
 * of these files from an original means re-running that cut.
 *
 * The Humble Fishmonger is the exception: its artwork *is* a navy field, so it
 * renders as its own tile. Nothing to cut.
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
  src: ImageMetadata;
  /** Hides the logo from pages. Does NOT keep the file off the server — see above. */
  cleared: boolean;
  /** Per-logo optical nudge, where a mark reads heavy or light beside the rest. */
  scale?: number;
}

/*
 * `scale` values below were set by eye against the rendered wall, on top of the
 * equal-area sizing. Equal area gets the geometry right but cannot see ink:
 * AutismCare is a saturated bold wordmark and reads heavy at its computed size,
 * while the ADHD Now roundel, the Cleaning Doctor circle and the pale Fettle
 * brushstroke all read light. These close that gap.
 */
export const CLIENT_LOGOS: ClientLogo[] = [
  { name: 'ADHD Now',              src: adhdNow,             cleared: true,  scale: 1.18 },
  { name: 'Fettle',                src: fettle,              cleared: true,  scale: 1.15 },
  { name: 'AutismCare Ireland',    src: autismcareIreland,   cleared: true,  scale: 0.82 },
  { name: 'Cleaning Doctor Hub',   src: cleaningDoctorHub,   cleared: true,  scale: 1.15 },
  { name: 'MyIrelandBox',          src: myirelandbox,        cleared: true,  scale: 0.95 },

  // Pending sign-off — see the note on the imports above.
  // { name: 'The Humble Fishmonger', src: theHumbleFishmonger, cleared: true },
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
 * Both the logo wall and the case-study lockups multiply their own base height
 * by this, so one logo is never two different sizes on the same page.
 */
export const OPTICAL_EXP = 0.45;

export const opticalK = (logo: ClientLogo) =>
  (1 / Math.pow(logo.src.width / logo.src.height, OPTICAL_EXP)) * (logo.scale ?? 1);

/** The wall only ever shows cleared logos. */
export const clearedLogos = () => CLIENT_LOGOS.filter((l) => l.cleared);


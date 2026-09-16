import type { ImageMetadata } from 'astro';

import adhdNow from './assets/logos/adhd-now.png';
import autismcareIreland from './assets/logos/autismcare-ireland.png';
import beyondBmi from './assets/logos/beyond-bmi.png';
import cleaningDoctorHub from './assets/logos/cleaning-doctor-hub.png';
import fettle from './assets/logos/fettle.png';
import myirelandbox from './assets/logos/myirelandbox.png';
import theHumbleFishmonger from './assets/logos/the-humble-fishmonger.png';

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
 * `cleared` follows the brief: only clients already public on the related
 * agency site may appear. The two held back are wired up and ready — flip the
 * flag here and in the matching case-study markdown once sign-off lands.
 */
export interface ClientLogo {
  /** Must match the `client` field in src/content/case-studies/. */
  name: string;
  src: ImageMetadata;
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

  // TODO(client): not cleared for publication (brief §9). Flip `cleared` here
  // and `published` in the matching case study once sign-off is confirmed.
  { name: 'The Humble Fishmonger', src: theHumbleFishmonger, cleared: false },
  { name: 'Beyond BMI',            src: beyondBmi,           cleared: false },
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

/** Look one up by the case study's `client` field. */
export const logoFor = (client: string) =>
  CLIENT_LOGOS.find((l) => l.name === client);

/**
 * Site-wide constants. Anything that appears in more than one place lives
 * here, so a change is a single edit.
 */

export const SITE_NAME = 'AMAVI Socials';
export const SITE_URL = 'https://www.amavisocials.co';

/**
 * Positioning, used throughout the copy: AMAVI is a creator-led marketing and
 * partnerships agency — not a traditional influencer agency, a PR agency or a
 * social media manager. Creator marketing is the core speciality; the work
 * also spans campaign strategy, content, brand partnerships, audience
 * development and creative outreach. The brand idea: "Creators are one part
 * of the equation." AMAVI starts from the goal and finds the people and
 * opportunities that reach it — a creator, a community, a tour operator, a
 * hotel, a brand partner, a media opportunity.
 *
 * Voice: premium, editorial, confident, minimal. Short lines. No agency
 * clichés ("next level", "game-changing", "full-service", "digital
 * solutions").
 */

/**
 * The home hero headline and the About page statement. A line break ("\n")
 * sets where display type breaks; anywhere it's plain text it reads as a
 * space.
 */
export const TAGLINE = 'We find the people\nwho move your\nbusiness forward.';

/** The line under the headline: four words, each with its own full stop. */
export const HERO_SUBLINE = ['Creators', 'Communities', 'Opportunities'];

/** One sentence of positioning, under the hero and wherever AMAVI is introduced. */
export const POSITIONING =
  'AMAVI Socials is a creator-led marketing and partnerships agency helping brands reach new audiences through the right people, relationships and opportunities.';

/**
 * The home hero's full-screen video: two separate cuts, one base path.
 *
 *   desktop (landscape screens)  public<path>.mp4 / .webm, poster <path>.jpg
 *   mobile  (portrait screens)   public<path>-portrait.mp4 / .webm / .jpg
 *
 * Each file is looked for at build time and left out if it isn't there, so
 * nothing 404s; a cut with no video file shows an outlined "Add video" frame
 * instead.
 *
 * Now: AMAVI's own café clip (IMG_9245.mov, 5.8s, shot 9:16), with a 1s
 * crossfade where it loops. The desktop cut is a 16:9 band across the laptop
 * (1920×1080, 1.9MB); the mobile cut is the whole frame (1080×1920, 1.6MB).
 * MP4 only — see README, "Making the video files".
 *
 * TODO(client): temporary fill "until further notice" — replace with the
 * final footage when it's ready: silent, 10–20 seconds and loopable; a
 * compressed H.264 MP4 plus a WebM, each under ~5MB; and a JPEG poster from
 * each cut's first frame. Keep these file names and no code changes; use
 * other names and this is the one line to edit.
 */
export const HERO_VIDEO = '/media/hero';

export const SITE_DESCRIPTION =
  'AMAVI Socials is a creator-led marketing and partnerships agency helping brands reach new audiences through the right people, relationships and opportunities';

/**
 * The working mailbox. Verified: amavisocials.com has Google Workspace MX
 * records, so this address receives mail.
 *
 * TODO(client): the live creator form still tells creators to email
 * hello@amavi.social. That domain has no DNS at all — mail to it bounces.
 * Worth fixing on the form itself, independently of this site.
 */
export const CONTACT_EMAIL = 'hello@amavisocials.com';

/**
 * Brands are sent to email rather than a form. The subject and a short
 * prompt are pre-filled so enquiries arrive with the basics in them.
 */
export const BRAND_ENQUIRY_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'Brand enquiry',
)}&body=${encodeURIComponent(
  'Hi AMAVI team,\n\nCompany:\nWhat we sell:\nWho we want to reach:\nRough budget, if known:\n\n',
)}`;

/**
 * The creator application, on this site. Nav, hero, footer and contact paths
 * all point here, and /creators redirects here (astro.config.mjs).
 *
 * TODO(client): the previous form (the Vercel app at www.amavisocials.co)
 * saved applications through its own /api/submit. New applications arrive in
 * the Google Sheet instead (backed up in Netlify Forms). Export anything the
 * old form collected before DNS moves, or those records stay behind with the
 * old app.
 */
export const CREATOR_PATH = '/become-a-creator/';

/** Both supplied by the client on 24 September 2026. */
export const SOCIALS = [
  { name: 'Instagram', handle: '@amavi.socials', url: 'https://www.instagram.com/amavi.socials/' },
  { name: 'LinkedIn', handle: 'AMAVI Socials', url: 'https://www.linkedin.com/company/amavi-socials/' },
  // TODO(client): TikTok is in the footer copy, but no account link was
  // supplied. Add it here — e.g. { name: 'TikTok', handle: '@…', url: 'https://www.tiktok.com/@…' }
  // — and it appears wherever the socials are listed.
] as const;

/** TODO(client): confirm the response-time commitment. */
export const RESPONSE_TIME = 'We reply to every enquiry within two working days.';

/**
 * Where the agency works, not where it is registered. The brief describes
 * AMAVI as working with Irish brands; it never says the agency is based in
 * Ireland, so no copy claims that.
 */
export const REGION = 'Ireland';

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

/** "Get in Touch" is rendered separately, as the header's one button. */
export const NAV_LINKS: NavLink[] = [
  { label: 'About', href: '/about/' },
  { label: 'Services', href: '/services/' },
  { label: 'Become a Creator', href: CREATOR_PATH },
];

export const CONTACT_PATH = '/contact/';

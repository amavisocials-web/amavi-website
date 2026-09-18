/**
 * Site-wide constants. Anything that appears in more than one place lives
 * here, so a change is a single edit.
 */

export const SITE_NAME = 'AMAVI Socials';
export const SITE_URL = 'https://www.amavisocials.co';

/**
 * TODO(client): working tagline, flagged as not final. Used as the home hero
 * headline and the About page statement — refine it here and both update.
 */
export const TAGLINE = 'Creator partnerships that reach the people you don’t already have.';

export const SITE_DESCRIPTION =
  'AMAVI Socials is an influencer marketing agency working with brands across Ireland. We source and vet creators, handle the agreements, run the campaign and report on what it returned.';

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
 * Netlify Forms instead. Export anything the old form collected before DNS
 * moves, or those records stay behind with the old app.
 */
export const CREATOR_PATH = '/become-a-creator/';

/** Verified live. The previous LinkedIn URL returned 404. */
export const SOCIALS = [
  { name: 'Instagram', handle: '@amavi.agency', url: 'https://www.instagram.com/amavi.agency/' },
  { name: 'LinkedIn', handle: 'AMAVI Socials', url: 'https://www.linkedin.com/company/amavi-socials' },
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

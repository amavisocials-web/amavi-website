/**
 * Site-wide constants. Values that appear in more than one place live here so
 * a change is a single edit.
 */

export const SITE_NAME = 'AMAVI Socials';
export const SITE_URL = 'https://www.amavisocials.co';
export const SITE_TAGLINE = 'Influencer and creator partnerships, run end to end.';
export const SITE_DESCRIPTION =
  'AMAVI Socials is an influencer marketing agency in Ireland. We source and vet creators, handle agreements, run gifted and paid campaigns, and report on what they returned.';

/**
 * TODO(client): confirm the correct public address before launch. Two are in
 * circulation — hello@amavi.social (on the current live signup page) and
 * hello@amavisocials.com (the working mailbox). Using the working mailbox.
 */
export const CONTACT_EMAIL = 'hello@amavisocials.com';

/** TODO(client): confirm social handles and add any others in use. */
export const SOCIALS = [
  { name: 'Instagram', url: 'https://www.instagram.com/amavisocials' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/amavisocials' },
] as const;

/** TODO(client): confirm the response-time commitment. */
export const RESPONSE_TIME = 'We reply to every enquiry within two working days.';

export const NAV_LINKS = [
  { label: 'About', href: '/about/' },
  { label: 'Services', href: '/services/' },
  { label: 'Work', href: '/work/' },
  { label: 'Creators', href: '/creators/' },
] as const;

export const LOCATION = 'Ireland';

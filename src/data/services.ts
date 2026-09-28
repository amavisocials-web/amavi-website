/**
 * What AMAVI does, for /services: four areas, each with its services, the
 * sectors the work spans, and a few results. Edit the copy here; the page
 * needn't change.
 *
 * Positioning: a creator-led marketing and partnerships agency. Creator
 * marketing is the strongest speciality, never the limit — the goal comes
 * first, and the mix is built around it.
 */

export interface Service {
  name: string;
  /** One line: what the client gets. */
  description: string;
}

export interface ServiceArea {
  /** Anchor on the page, e.g. /services/#creator-marketing. */
  id: string;
  number: string;
  title: string;
  /** Short paragraphs under the title. */
  intro: string[];
  services: Service[];
  /** The line the area closes on. */
  closing: string;
}

export const SERVICE_AREAS: ServiceArea[] = [
  {
    id: 'creator-marketing',
    number: '01',
    title: 'Creator Marketing',
    intro: ['The right creator can give a brand something media buying can’t: trust, relevance and attention.'],
    services: [
      {
        name: 'Creator Sourcing',
        description: 'Finding creators based on audience, content, location, values and campaign objectives.',
      },
      {
        name: 'Campaign Management',
        description: 'From outreach and negotiation to briefs, timelines, approvals and delivery.',
      },
      { name: 'Ambassador Programmes', description: 'Building longer-term relationships between brands and creators.' },
      {
        name: 'UGC & Creator Content',
        description:
          'Content designed to feel natural on social while giving brands assets they can use beyond the creator’s own channels.',
      },
    ],
    closing: 'One creator or one hundred — we build the right mix.',
  },
  {
    id: 'brand-campaign-strategy',
    number: '02',
    title: 'Brand & Campaign Strategy',
    intro: ['Before we choose the platform, creator or format, we need to know what we’re trying to achieve.'],
    services: [
      { name: 'Campaign Concepts', description: 'Turning a business objective into an idea people want to engage with.' },
      {
        name: 'Audience Strategy',
        description: 'Defining who we’re trying to reach and where they already spend their attention.',
      },
      { name: 'Creative Direction', description: 'Building the messaging, content direction and campaign framework.' },
      {
        name: 'Campaign Planning',
        description: 'Connecting strategy, creators, content and distribution into one clear plan.',
      },
    ],
    closing: 'The idea comes first. The channel follows.',
  },
  {
    id: 'content-social',
    number: '03',
    title: 'Content & Social',
    intro: [
      'Good content shouldn’t look like advertising.',
      'It should look like something people actually want to watch.',
    ],
    services: [
      { name: 'Content Strategy', description: 'What to say, who to say it to and what formats make sense.' },
      { name: 'Short-Form Video', description: 'Reels, TikToks and social-first content built around attention.' },
      {
        name: 'Editing & Creative',
        description: 'Turning raw footage and creator content into polished, platform-ready assets.',
      },
      {
        name: 'Content Systems',
        description: 'Repeatable formats and creative frameworks that make content easier to produce consistently.',
      },
    ],
    closing: 'Built for the feed. Made for the brand.',
  },
  {
    id: 'growth-partnerships',
    number: '04',
    title: 'Growth Partnerships',
    intro: [
      'Sometimes the fastest route to a new audience isn’t another post.',
      'It’s finding the people who already have them.',
    ],
    services: [
      {
        name: 'Partnership Discovery',
        description: 'Finding businesses, organisations and communities with access to relevant audiences.',
      },
      { name: 'Outreach', description: 'Researching, identifying and approaching potential partners.' },
      { name: 'Audience Access', description: 'Creating opportunities to reach people beyond your existing channels.' },
      {
        name: 'Partnership Strategy',
        description: 'Building mutually valuable collaborations around a shared audience.',
      },
    ],
    closing: 'Find the people who already have the audience.',
  },
];

/**
 * Where the work happens: a sector and what the work there usually involves.
 * Not case studies — no metrics and no client names.
 */
export interface Sector {
  name: string;
  focus: string[];
}

export const SECTORS: Sector[] = [
  { name: 'Food & Hospitality', focus: ['Creators', 'Tourism partnerships', 'Local audience growth'] },
  { name: 'Healthcare', focus: ['Education', 'Creator partnerships', 'Community'] },
  { name: 'Wellness', focus: ['Creators', 'UGC', 'Content strategy'] },
  { name: 'Fashion & Beauty', focus: ['Seeding', 'Creators', 'Campaigns'] },
  { name: 'Lifestyle & Travel', focus: ['Creators', 'Partnerships', 'Audience development'] },
  { name: 'Tech & Startups', focus: ['Creator campaigns', 'Content', 'Brand awareness'] },
];

/**
 * Results, as client · objective · approach · result.
 *
 * Clients are described, never named, as on the home page. Figures come only
 * from AMAVI's creator-programme report, April–August 2026 (brief §5), written
 * out as counts so nothing depends on reading a percentage: nothing rounded,
 * recomputed or added. A seafood bar is never called a restaurant here
 * (brief §2).
 */
export interface CaseStudy {
  client: string;
  objective: string;
  approach: string;
  result: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    client: 'A seafood bar',
    objective: 'Reach more of the visitors travelling through the area.',
    approach:
      'Creators — and research and outreach to the tour operators, bus companies and local partners already bringing those visitors in.',
    // TODO(client): no measured outcome was supplied for this one; replace
    // with the figure when there is one.
    result: 'New routes to the audience, beyond social media.',
  },
  {
    client: 'Four brands in healthcare and home services',
    objective: 'A combined target of 40 creator partnerships in five months.',
    approach: 'Creator partnership programmes, from sourcing and outreach to agreements and reporting.',
    result: '49 partnerships delivered — 9 beyond target.',
  },
];

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
  /** Anchor on the page, e.g. /services/#creator-campaigns. */
  id: string;
  number: string;
  title: string;
  /** One line under the title, set in italics: what this area is. */
  summary: string;
  /** The paragraph under it. */
  intro: string;
  /** What the area actually covers, as a name and a line each. */
  services: Service[];
  /** The line the area closes on. */
  closing: string;
}

/** The five practice areas, in the order they open on the page. */
export const SERVICE_AREAS: ServiceArea[] = [
  {
    id: 'creator-community-aor',
    number: '01',
    title: 'Creator & Influencer Community AOR',
    summary: 'Creator communities run as an ongoing programme, not a one-off campaign.',
    intro: 'Build lasting relevance through creator communities rather than one-off activity. By developing long-term relationships with creators who genuinely fit the brand, we create a group of advocates who keep speaking for you between campaigns, not just during them.',
    services: [
      {
        name: 'Strategy',
        description: 'We build the creative and strategic proposal around your objective, grounded in audience behaviour and what’s actually happening on the platforms, with clear timings and success measures agreed up front.',
      },
      {
        name: 'Creator sourcing & vetting',
        description: 'We search on audience rather than follower count, then check every creator for genuine engagement, content quality and brand fit before they reach you.',
      },
      {
        name: 'Ambassador programmes',
        description: 'Longer-term relationships that keep a brand present between campaigns rather than only during them.',
      },
    ],
    closing: 'One creator or one hundred. We build the right mix.',
  },
  {
    id: 'creator-campaigns',
    number: '02',
    title: 'Influencer & Creator Campaigns',
    summary: 'Campaigns built around a business objective, managed end to end.',
    intro: 'Our campaigns are built around a business objective, not a posting schedule. We source and vet the creators, negotiate the rates, brief the work and manage it through to publication, so each campaign reaches people the brand hasn’t reached before.',
    services: [
      {
        name: 'Creator sourcing & vetting',
        description: 'Deep searches to find creators with real engagement and the right audience, followed by a multi-step check so nothing reaches you that doesn’t fit the brand.',
      },
      {
        name: 'Contracting & briefing',
        description: 'We handle agreements, licensing, usage rights and compliance in house, then brief each creator directly so expectations are clear before any content starts.',
      },
      {
        name: 'Campaign management',
        description: 'From outreach and negotiation through to timelines, approvals and delivery.',
      },
      {
        name: 'Measurement',
        description: 'Tracking throughout the campaign and a final report against the original objective, including how much of the audience was new to the brand.',
      },
    ],
    closing: 'The objective comes first. The channel follows.',
  },
  {
    id: 'creator-ugc',
    number: '03',
    title: 'Creator UGC Content',
    summary: 'Creator content produced in volume, for your channels as well as theirs.',
    intro: 'Creator content is one of the most useful assets a brand can own. We produce it in volume, native to the platforms people actually use, and hand it over for your own channels and paid media long after the original post has run.',
    services: [
      {
        name: 'Content production',
        description: 'We oversee content from concept through to final cut, with a structured review at each stage. Nothing publishes before you’ve seen it.',
      },
      {
        name: 'Paid amplification',
        description: 'Creator content works harder when it doesn’t stop at the creator’s channel. We help put it to work across your own social and paid media.',
      },
      {
        name: 'Content systems',
        description: 'Repeatable formats and frameworks that make content easier to produce consistently.',
      },
    ],
    closing: 'Built for the feed. Made for the brand.',
  },
  {
    id: 'affiliate-marketing',
    number: '04',
    title: 'Affiliate Marketing',
    summary: 'Creator partnerships structured around performance.',
    intro: 'We connect creators, content and commerce so the work can be measured against revenue. Partnerships are structured around performance, with tracking and commission agreed from the start.',
    services: [
      {
        name: 'Partnership structure',
        description: 'Commission, tracking and terms agreed before anything goes live, so everyone knows what success looks like.',
      },
      {
        name: 'Creator communities',
        description: 'We identify the creators whose audiences are most likely to convert, not just the ones with the largest reach.',
      },
      {
        name: 'Measurement',
        description: 'Reporting tied to revenue rather than impressions alone.',
      },
    ],
    closing: 'Work that can be measured against the till.',
  },
  {
    id: 'live-experiences',
    number: '05',
    title: 'Live Experiences',
    summary: 'Activations that put creators, customers and the brand in the same room.',
    intro: 'We bring creators, customers and the brand into the same room. Each activation is built to be worth attending and worth filming, turning a single moment into content that keeps working afterwards.',
    services: [
      { name: 'Creative production', description: 'Planning and running the activation itself, in person or online.' },
      { name: 'Talent management', description: 'Sourcing, briefing and looking after the creators on the day.' },
      {
        name: 'Content capture',
        description: 'Everything filmed on the day becomes content the brand can use long after the event has ended.',
      },
    ],
    closing: 'One day of work. Months of content.',
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
 * Not rendered at the moment: the Results section came off /services on
 * 28 September 2026. Kept because these are the verified figures — put the
 * section back and it reads from here.
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
      'Creators, plus research and outreach to the tour operators, bus companies and local partners already bringing those visitors in.',
    // TODO(client): no measured outcome was supplied for this one; replace
    // with the figure when there is one.
    result: 'New routes to the audience, beyond social media.',
  },
  {
    client: 'Four brands in healthcare and home services',
    objective: 'A combined target of 40 creator partnerships in five months.',
    approach: 'Creator partnership programmes, from sourcing and outreach to agreements and reporting.',
    result: '49 partnerships delivered, 9 beyond target.',
  },
];

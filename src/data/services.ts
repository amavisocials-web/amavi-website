/**
 * What AMAVI does, for /services: three areas, each with its services, and a
 * handful of sector examples. Edit the copy here; the page needn't change.
 *
 * Positioning: creator partnerships are the speciality, not the limit.
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
  services: Service[];
}

export const SERVICE_AREAS: ServiceArea[] = [
  {
    id: 'creator-marketing',
    number: '01',
    title: 'Creator Marketing',
    services: [
      { name: 'Creator Partnerships', description: 'Finding, negotiating and managing the right creators.' },
      { name: 'Influencer Campaigns', description: 'End-to-end campaign strategy and execution.' },
      { name: 'Ambassador Programmes', description: 'Long-term creator relationships, not one-off posts.' },
      { name: 'UGC & Content', description: 'Creator-led content for organic and paid use.' },
    ],
  },
  {
    id: 'brand-campaign-strategy',
    number: '02',
    title: 'Brand & Campaign Strategy',
    services: [
      { name: 'Campaign Strategy', description: 'Concept to audience to creators to execution.' },
      { name: 'Content Strategy', description: 'What the brand should actually be creating.' },
      { name: 'Audience Development', description: 'Finding new communities and audiences.' },
      {
        name: 'Partnership Strategy',
        description: 'Organisations and people who can help the brand reach new customers.',
      },
    ],
  },
  {
    id: 'growth-partnerships',
    number: '03',
    title: 'Growth Partnerships',
    services: [
      { name: 'Brand Partnerships', description: 'Businesses that can introduce the brand to new audiences.' },
      {
        name: 'Audience Growth',
        description: 'Communities, channels and opportunities the brand isn’t reaching yet.',
      },
    ],
  },
];

/**
 * Short sector examples — not case studies. No metrics and no client names:
 * a sector, the kind of work, and at most one line on how it was done.
 */
export interface SectorExample {
  sector: string;
  work: string;
  how?: string;
}

export const SECTOR_EXAMPLES: SectorExample[] = [
  {
    sector: 'Seafood bar',
    work: 'Tourism partnerships and creator campaign',
    how: 'Reached tourists by partnering with tour operators, bus companies, hotels and local tourism businesses alongside creators.',
  },
  { sector: 'Healthcare brand', work: 'Creator ambassador programme' },
  { sector: 'Wellness brand', work: 'Creator content and social strategy' },
  { sector: 'Food brand', work: 'UGC and influencer campaign' },
  { sector: 'Fashion brand', work: 'Creator seeding and event coverage' },
];

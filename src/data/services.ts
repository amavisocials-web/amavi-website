/**
 * What AMAVI does: six areas, each with its paragraph and the services it
 * covers, plus the sectors the work spans and a few results. One file, two
 * readers: the home page's accordion and /services. Edit the copy here; the
 * pages needn't change.
 *
 * The list went from five areas to six on 5 October 2026: Affiliate Marketing
 * came off, Founder & Personal Brand and Mobile First Organic Content came on,
 * and Influencer & Creator Campaigns was renamed Creator-Led Campaigns.
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
  /**
   * The service, in a paragraph. This is the whole description: it opens the
   * panel on both pages, and on the home page it is all a panel shows. It
   * replaced the italic summary line and the separate intro on 5 October 2026.
   */
  description: string;
  /**
   * What the area covers, as a name and a line each. Only /services shows
   * these; an empty list is an area that opens on its paragraph alone.
   */
  services: Service[];
}

/** The six practice areas, in the order they open on the page. */
export const SERVICE_AREAS: ServiceArea[] = [
  {
    id: 'creator-community-aor',
    number: '01',
    title: 'Creator & Influencer Community AOR',
    description: 'Build lasting relevance through creator communities instead of one-off campaigns. We work as an extension of your brand, building genuine creator relationships that keep your brand part of the conversation year-round.',
    services: [
      {
        name: 'Strategy',
        description: 'We develop data-driven creative proposals aligned with your commercial targets, grounded in real platform behaviors and actionable KPIs.',
      },
      {
        name: 'Creator Sourcing & Vetting',
        description: 'We prioritize audience trust over vanity metrics, auditing every creator for genuine engagement, content aesthetics, and brand fit before they reach your desk.',
      },
      {
        name: 'Ambassador Programmes',
        description: 'Long-term strategic partnerships engineered to maintain continuous brand presence and advocacy between campaign launches.',
      },
    ],
  },
  {
    // The id predates the title: "Influencer & Creator Campaigns" became
    // "Creator-Led Campaigns" on 5 October 2026, and the anchor stays so
    // /services/#creator-campaigns keeps working.
    id: 'creator-campaigns',
    number: '02',
    title: 'Creator-Led Campaigns',
    description: 'We source and vet the creators, negotiate the rates, brief the work and manage it through to publication, so each campaign reaches people the brand hasn\u2019t reached before.',
    services: [
      {
        name: 'Creator Sourcing & Vetting',
        description: 'Targeted searches to identify creators with authentic influence, backed by a rigorous vetting process to guarantee brand safety.',
      },
      {
        name: 'Contracting & Briefing',
        description: 'End-to-end management of legal agreements, usage rights, and creative briefs, ensuring complete clarity and alignment before production starts.',
      },
      {
        name: 'Campaign Management',
        description: 'Full-service oversight covering creator outreach, negotiation, production timelines, asset approvals, and publishing.',
      },
      {
        name: 'Measurement & Reporting',
        description: 'Real-time performance tracking and comprehensive post-campaign reporting evaluated directly against your core business objectives.',
      },
    ],
  },
  {
    id: 'creator-ugc',
    number: '03',
    title: 'Creator UGC Content',
    description: 'Create authentic, platform-native content at scale. We manage creators from sourcing to briefing and delivery, giving your brand a steady stream of content built for your audience and channels.',
    services: [
      {
        name: 'Content Production',
        description: 'Structured creative direction from concepting through final edit, featuring multi-stage brand reviews before anything goes live.',
      },
      {
        name: 'Paid Amplification',
        description: 'Scaling top-performing creator creative through targeted paid social campaigns to maximize reach, engagement, and conversion.',
      },
      {
        name: 'Content Systems',
        description: 'Repeatable creative frameworks and content playbooks that make high-volume output consistent and scalable.',
      },
    ],
  },
  {
    id: 'founder-personal-brand',
    number: '04',
    title: 'Founder & Personal Brand',
    description: 'We help founders turn their expertise and personality into a strong social presence, from positioning and content strategy to ongoing content creation and management.',
    // TODO(client): no sub-services supplied for this area yet, so the panel
    // opens on the paragraph alone. Add them here and the rows appear.
    services: [],
  },
  {
    id: 'live-experiences',
    number: '05',
    title: 'Live Experiences',
    description: 'Bring your brand, creators and audience together through live experiences designed to drive engagement, conversation and content. From online Q&As to in-person activations, we manage the experience from concept to execution.',
    services: [
      { name: 'Creative Production', description: 'End-to-end concepting, planning, and execution for live, hybrid, and digital brand activations.' },
      { name: 'Talent Management', description: 'Curation, briefing, and dedicated on-site coordination for creators and brand VIPs.' },
      {
        name: 'Content Capture',
        description: 'Professional multi-platform content capture on the day, providing a rich library of assets for ongoing marketing.',
      },
    ],
  },
  {
    id: 'mobile-first-organic',
    number: '06',
    title: 'Mobile First Organic Content',
    description: 'Mobile content is one of the most useful assets a brand can own. We create high-volume, iPhone-shot content that feels native to the platforms people actually use, ready for your organic channels and paid media.',
    // TODO(client): no sub-services supplied for this area yet, so the panel
    // opens on the paragraph alone. Add them here and the rows appear.
    services: [],
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
  { name: 'Healthcare', focus: ['Education', 'Creator partnerships', 'Community trust'] },
  { name: 'Wellness', focus: ['Creators', 'UGC assets', 'Content strategy'] },
  { name: 'Fashion & Beauty', focus: ['Product seeding', 'Creators', 'Full-funnel campaigns'] },
  { name: 'Lifestyle & Travel', focus: ['Creators', 'Strategic partnerships', 'Audience development'] },
  { name: 'Tech & Startups', focus: ['Creator campaigns', 'Native content', 'Brand awareness'] },
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
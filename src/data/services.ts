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
}

/** The five practice areas, in the order they open on the page. */
export const SERVICE_AREAS: ServiceArea[] = [
  {
    id: 'creator-community-aor',
    number: '01',
    title: 'Creator & Influencer Community AOR',
    summary: 'Always-on creator programmes that drive sustained brand relevance, not short-lived spikes.',
    intro: 'Build lasting audience relevance through ongoing creator communities rather than isolated campaigns. By cultivating genuine, long-term relationships with creators who mirror your brand values, we build a dedicated network of brand advocates who champion your business continuously.',
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
    id: 'creator-campaigns',
    number: '02',
    title: 'Influencer & Creator Campaigns',
    summary: 'Full-funnel creator campaigns built around commercial goals and managed end-to-end.',
    intro: 'We design campaigns to deliver measurable business outcomes, not just impressions. From creator discovery and fee negotiation to contract compliance, briefing, and delivery, we handle every detail so your brand consistently unlocks new, high-converting audiences.',
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
    summary: 'High-performing creator assets produced at scale for both organic and paid media.',
    intro: 'Authentic creator content is one of the most powerful conversion assets a brand can leverage. We produce high-volume, platform-native content and deliver full usage rights so assets continue driving ROI across your paid ad channels long after the original post.',
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
    id: 'affiliate-marketing',
    number: '04',
    title: 'Affiliate Marketing',
    summary: 'Performance-driven creator partnerships structured directly around revenue.',
    intro: 'We connect creative content directly to commercial revenue. By structuring creator partnerships around trackable performance and transparent commission structures, every campaign dollar is directly accountable to bottom-line growth.',
    services: [
      {
        name: 'Partnership Structure',
        description: 'Clear commission models, attribution tracking, and commercial terms established up front to align goals and maximize ROI.',
      },
      {
        name: 'Creator Communities',
        description: 'Targeting creators with high-intent audiences and proven conversion records rather than focusing strictly on follower counts.',
      },
      {
        name: 'Measurement & Attribution',
        description: 'Granular sales tracking and financial reporting that measure success by revenue generated rather than vanity impressions.',
      },
    ],
  },
  {
    id: 'live-experiences',
    number: '05',
    title: 'Live Experiences',
    summary: 'High-impact activations that bring creators, communities, and brands into the same room.',
    intro: 'We design experiential events that bring creators, key partners, and customers face-to-face. Each activation is engineered to deliver an unforgettable real-world experience while generating an ecosystem of digital content that extends campaign life for months.',
    services: [
      { name: 'Creative Production', description: 'End-to-end concepting, planning, and execution for live, hybrid, and digital brand activations.' },
      { name: 'Talent Management', description: 'Curation, briefing, and dedicated on-site coordination for creators and brand VIPs.' },
      {
        name: 'Content Capture',
        description: 'Professional multi-platform content capture on the day, providing a rich library of assets for ongoing marketing.',
      },
    ],
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
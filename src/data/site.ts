import type { NavItem, SiteSettings } from './types'

// Site chrome and marketing copy that is not (yet) managed in Payload. Solutions, case studies and
// industries come from the database.
export const siteSettings: SiteSettings = {
  tagline: 'Research. Solve. Align.',
  description:
    'Pro Solutors helps engineering consultants, contractors, research centres and government institutions innovate, align their technical data, and choose solutions backed by feasibility analysis.',
  promiseText: 'Every submission is read by an engineer and answered within 2 working days.',
  notificationEmail: 'hello@prosolutors.com',
  sampleDisclaimerText:
    'This is an illustrative sample. The company, project and all figures are fictional and are not real client data or real client results. It shows the structure and standard of our reports.',
}

// DECISION: four short links only (Home is the logo). The page itself is still titled
// "Who We Serve & Domains"; the nav uses the short label to keep the bar uncluttered.
export const headerNav: NavItem[] = [
  { label: 'Solutions', href: '/solutions' },
  { label: 'Who We Serve', href: '/who-we-serve' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Sample Report', href: '/sample-reports' },
]

export const footerLinks: NavItem[] = [
  { label: 'Privacy policy', href: '/privacy' },
  { label: 'Terms of use', href: '/terms' },
]

export const heroPillars = [
  { icon: 'search-check', label: 'Solve', text: 'Feasibility · Options · Cost' },
  { icon: 'trending-up', label: 'Improve', text: 'Operations · Roadmap · Innovation' },
  { icon: 'database', label: 'Align', text: 'Technical data · One source of truth' },
] as const

export const homeContent = {
  whyTitle: 'Why engineering organisations call us',
  whyLead: 'Three problems we see again and again.',
  why: [
    { title: 'Scattered technical data', text: 'Drawings, calculations and models live in different places and never quite agree.' },
    { title: 'Problems that keep coming back', text: 'The same issues return because the root cause was never analysed.' },
    { title: 'Decisions without proof', text: 'Costly choices made on experience alone, with no feasibility evidence.' },
  ],
  solutionsTitle: 'Three solutions',
  solutionsLead: 'One dedicated approach for each kind of engineering challenge.',
  pathTitle: 'Start small, grow with confidence',
  pathLead: 'A low-risk path from first conversation to long-term partnership.',
  path: [
    { title: 'Free Problem Review', text: 'A 30-minute call or written review. We tell you clearly whether we can help.' },
    { title: 'Fixed-scope Audit or Feasibility Study', text: 'A defined problem, a defined deliverable, a decision-ready report.' },
    { title: 'Ongoing Partnership', text: 'Monthly support for data management, analysis and continuous improvement.' },
  ],
}

export const solutionsPage = {
  guide: [
    ['“Our project data is inconsistent and we keep re-checking it.”', 'Align Your Technical Data'],
    ['“We need proof before we commit to this method or design.”', 'Solve and Prove'],
    ['“We want to improve, but don’t know where to begin.”', 'Improve and Innovate'],
    ['“I’m not sure.”', 'Free Problem Review'],
  ] as [string, string][],
}

export const processSteps = [
  { title: 'Submit', description: 'Tell us the problem.' },
  { title: 'Review', description: 'An engineer reads it and replies.' },
  { title: 'Study', description: 'Fixed-scope analysis of the real case.' },
  { title: 'Decide', description: 'A report you can take to your board.' },
]

export const whoWeServe = {
  audiences: [
    {
      title: 'Engineering Consultants',
      text: 'Design and advisory firms. Stop losing time to searching and re-checking project data.',
      lead: 'Lead: Align Your Technical Data',
      start: 'Start: Technical Data Health Check',
    },
    {
      title: 'Contractors',
      text: 'General, MEP and specialist contractors. Cut cost and schedule risk with proven methods.',
      lead: 'Lead: Solve and Prove',
      start: 'Start: Feasibility Proof Report',
    },
    {
      title: 'Research Centres & R&D',
      text: 'Universities, labs and institutes. Turn scattered research into feasible results.',
      lead: 'Lead: Improve and Innovate',
      start: 'Start: Innovation Roadmap Sprint',
    },
    {
      title: 'Government & Public Institutions',
      text: 'Authorities, municipalities and regulators. Decide with evidence and audit-friendly documentation.',
      lead: 'Lead: Align Your Technical Data + Solve and Prove',
      start: 'Start: Independent Feasibility Review or Data Audit',
    },
  ],
  domains: [
    { name: 'Civil' },
    { name: 'Mechanical' },
    { name: 'HVAC' },
    { name: 'Electrical' },
    { name: 'MEP' },
    { name: 'Mechatronics', note: 'Coming soon' },
    { name: 'Transportation', note: 'Coming soon' },
    { name: 'Other disciplines' },
  ],
  reassurance: [
    'Independent, confidential and NDA-ready. NDA first on request.',
    'Audit-friendly reports and clear documentation standards.',
    'Procurement-friendly scope, deliverables, timelines and invoicing, with international payment methods.',
    'Willing to respond to tenders and requests for proposal.',
    'One-page Capability Statement available on request.',
  ],
}

export const sampleReportPage = {
  options: [
    ['A. Air-cooled chillers', '620', '118', '22', '2,020', 'Higher running cost'],
    ['B. VRF system', '540', '135', '30', '2,190', 'Refrigerant volume, long pipe runs'],
    ['C. Water-cooled chillers + towers', '780', '86', '34', '1,980', 'Roof loading, water use, upkeep'],
  ],
  conditions: ['Structural check of the roof for tower loads', 'Confirmed water supply and treatment plan', 'Plant room access for chiller replacement'],
  risks: [
    'Cost overrun: fixed-price supplier quotes before tender',
    'Programme delay: order long-lead chillers early',
    'Maintenance burden: agree a service contract up front',
  ],
  assumptions: ['Prices and energy figures are placeholders', 'No discounting or inflation applied', 'Final design is outside this study'],
}

export const legalPages: Record<string, { title: string; updated: string; sections: { heading: string; text: string }[] }> = {
  privacy: {
    title: 'Privacy policy',
    updated: '2026-10-01',
    sections: [
      { heading: 'What we collect', text: 'Only what you send us through the Submit your problem form: your name, organisation, email, country, the problem description and any files you attach.' },
      { heading: 'How we use it', text: 'An engineer reads your submission and replies within 2 working days. We do not sell your data or use it for unrelated marketing.' },
      { heading: 'Your rights', text: 'You may ask us to access, correct or delete your submission at any time by emailing us.' },
      { heading: 'Sample content', text: 'Sample reports and case studies on this site are fictional and contain no real client data.' },
    ],
  },
  terms: {
    title: 'Terms of use',
    updated: '2026-10-01',
    sections: [
      { heading: 'Illustrative content', text: 'Sample reports and case studies are illustrative. Results depend on the client starting point, team and market and are never guaranteed.' },
      { heading: 'No design or price', text: 'Our studies compare options. They are not a detailed design or a construction price.' },
      { heading: 'Your submissions', text: 'Do not send confidential material you are not entitled to share. We will treat what you send as confidential to the review.' },
    ],
  },
}

// Home hero: one stage per pillar. Figures come from the illustrative sample case studies
// (PS-SAMPLE-001 to 003), so they are fictional and labelled as such on the page.
export const heroStages = [
  {
    icon: 'search-check',
    label: 'Solve',
    text: 'Feasibility · Options · Cost',
    kicker: 'Feasibility and options report',
    title: 'Solve and Prove',
    stat: 'Option C, 77/100',
    statNote: 'Recommended in sample PS-SAMPLE-001',
    offer: 'Feasibility Proof Report',
    tile: { left: 11.8, top: 18.6 },
  },
  {
    icon: 'trending-up',
    label: 'Improve',
    text: 'Operations · Roadmap · Innovation',
    kicker: 'Operational and business improvement',
    title: 'Improve and Innovate',
    stat: '+33%',
    statNote: 'Daily output in sample PS-SAMPLE-002',
    offer: 'Innovation Roadmap Sprint',
    tile: { left: 32.2, top: 9.8 },
  },
  {
    icon: 'database',
    label: 'Align',
    text: 'Technical data · One source of truth',
    kicker: 'A single, trusted source of truth',
    title: 'Align Your Technical Data',
    stat: '14 → 2',
    statNote: 'Places data is kept, sample PS-SAMPLE-003',
    offer: 'Technical Data Health Check',
    tile: { left: 53.1, top: 14.3 },
  },
] as const

export const footerColumns = [
  {
    title: 'Solutions',
    links: [
      { label: 'Improve and Innovate', href: '/solutions/improve-and-innovate' },
      { label: 'Align Your Technical Data', href: '/solutions/align-your-technical-data' },
      { label: 'Solve and Prove', href: '/solutions/solve-and-prove' },
      { label: 'Which solution fits you?', href: '/solutions', muted: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Who We Serve', href: '/who-we-serve' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Sample Report', href: '/sample-reports' },
      { label: 'Share your case study', href: '/case-studies#share' },
    ],
  },
  {
    title: 'Disciplines',
    links: [
      { label: 'Civil and Mechanical', href: '/who-we-serve' },
      { label: 'HVAC and Electrical', href: '/who-we-serve' },
      { label: 'MEP', href: '/who-we-serve' },
      { label: 'Mechatronics and Transportation, coming soon', href: '/who-we-serve', muted: true },
    ],
  },
  {
    title: 'For institutions',
    links: [
      { label: 'Audit-friendly reports', href: '/who-we-serve' },
      { label: 'Tenders and RFPs', href: '/who-we-serve' },
      { label: 'International payments', href: '/who-we-serve' },
      { label: 'Capability Statement', href: '/who-we-serve', accent: true },
    ],
  },
] as { title: string; links: { label: string; href: string; muted?: boolean; accent?: boolean }[] }[]

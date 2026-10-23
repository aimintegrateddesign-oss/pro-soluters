import type { NavItem, SiteSettings } from './types'

/**
 * Default site copy. Every page reads its text from a Payload global (see src/globals/); this file is
 * (1) the fallback when the database is unreachable or a field is left empty, and (2) the source the
 * seed script writes into those globals. Field names here match the global field names one to one.
 * Lists of plain strings are stored in Payload as `{ text }` rows and mapped back by src/lib/content-merge.ts.
 */

export type Cta = { eyebrow: string; title: string; body: string; primaryLabel: string; secondaryLabel: string }
export type Hero = { title: string; accent: string; intro: string }

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
export const navigation = {
  headerNav: [
    { label: 'Solutions', href: '/solutions' },
    { label: 'Who We Serve', href: '/who-we-serve' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Sample Report', href: '/sample-reports' },
  ] as NavItem[],
  footer: {
    blurb:
      'Practical engineering solutions that solve problems, improve performance and align your data. Research-led, evidence-based and built only for engineering organisations worldwide.',
    responseTime: 'Within 2 working days',
    confidentiality: 'NDA first on request',
    sampleNote: 'Sample reports and case studies are illustrative and fictional.',
    copyright: 'Pro Solutors. All rights reserved.',
  },
  footerColumns: [
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
  ] as { title: string; links: { label: string; href: string; muted?: boolean; accent?: boolean }[] }[],
  legalLinks: [
    { label: 'Privacy policy', href: '/privacy' },
    { label: 'Terms of use', href: '/terms' },
  ] as NavItem[],
}

const homeCta: Cta = {
  eyebrow: 'Free problem review',
  title: 'Have an engineering problem worth solving?',
  body: siteSettings.promiseText,
  primaryLabel: 'Submit your problem',
  secondaryLabel: 'See a sample report',
}

// Hero stages: figures come from the illustrative sample case studies (PS-SAMPLE-001 to 003), so they are
// fictional and labelled as such on the page. Keep them in step with those case studies if you edit them.
export type HeroStage = {
  icon: 'search-check' | 'trending-up' | 'database'
  label: string
  text: string
  kicker: string
  title: string
  stat: string
  statNote: string
  offer: string
}

export const homePage = {
  hero: {
    eyebrow: 'Research. Solve. Align.',
    headline: 'Engineering problems solved. Data aligned.',
    headlineAccent: 'Decisions proven.',
    intro:
      'Pro Solutors helps engineering consultants, contractors, research centres and government institutions around the world innovate, align their technical data, and choose solutions backed by feasibility analysis.',
    primaryCta: 'Submit your problem',
    secondaryCta: 'Explore our solutions',
    figuresNote: 'Figures from illustrative sample studies',
    stages: [
      {
        icon: 'search-check',
        label: 'Solve',
        text: 'Feasibility · Options · Cost',
        kicker: 'Feasibility and options report',
        title: 'Solve and Prove',
        stat: 'Option C, 77/100',
        statNote: 'Recommended in sample PS-SAMPLE-001',
        offer: 'Feasibility Proof Report',
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
      },
    ] as HeroStage[],
  },
  why: {
    title: 'Why engineering organisations call us',
    lead: 'Three problems we see again and again.',
    items: [
      { title: 'Scattered technical data', text: 'Drawings, calculations and models live in different places and never quite agree.' },
      { title: 'Problems that keep coming back', text: 'The same issues return because the root cause was never analysed.' },
      { title: 'Decisions without proof', text: 'Costly choices made on experience alone, with no feasibility evidence.' },
    ],
  },
  solutions: {
    title: 'Three solutions',
    lead: 'One dedicated approach for each kind of engineering challenge.',
  },
  path: {
    title: 'Start small, grow with confidence',
    lead: 'A low-risk path from first conversation to long-term partnership.',
    steps: [
      { title: 'Free Problem Review', text: 'A 30-minute call or written review. We tell you clearly whether we can help.' },
      { title: 'Fixed-scope Audit or Feasibility Study', text: 'A defined problem, a defined deliverable, a decision-ready report.' },
      { title: 'Ongoing Partnership', text: 'Monthly support for data management, analysis and continuous improvement.' },
    ],
  },
  cta: homeCta,
}

export const caseStudiesPage = {
  hero: {
    title: 'Sample work,',
    accent: 'shown in full',
    intro: 'Every study here is an illustrative sample with fictional companies and figures.',
  } as Hero,
  cta: homeCta,
}

export const solutionsPage = {
  hero: {
    title: 'Three solutions, one purpose:',
    accent: 'decision-ready engineering.',
    intro: 'Research-led, practical and evidence-based. Choose the one that fits, or combine them.',
  } as Hero,
  fit: {
    title: 'Which solution fits you?',
    lead: 'A quick guide. Pick the sentence that sounds most like your team.',
    items: [
      { quote: '“Our project data is inconsistent and we keep re-checking it.”', startWith: 'Align Your Technical Data' },
      { quote: '“We need proof before we commit to this method or design.”', startWith: 'Solve and Prove' },
      { quote: '“We want to improve, but don’t know where to begin.”', startWith: 'Improve and Innovate' },
      { quote: '“I’m not sure.”', startWith: 'Free Problem Review' },
    ],
  },
  how: {
    title: 'How we work',
    lead: 'Human-led and confidential. Decisions are made after studying the practical case. Select a step to see what happens.',
    steps: [
      {
        title: 'Submit',
        description: 'Tell us the problem.',
        detail: 'Describe your engineering problem in plain words. If your data is sensitive, ask for an NDA first.',
        youGet: 'Your problem, on record with an engineer',
      },
      {
        title: 'Review',
        description: 'An engineer reads it and replies.',
        detail: 'An engineer reads every submission and replies within 2 working days with a clear yes or no.',
        youGet: 'A clear yes or no, and a next step',
      },
      {
        title: 'Study',
        description: 'Fixed-scope analysis of the real case.',
        detail: 'We agree a defined problem and a defined deliverable, then analyse your real case.',
        youGet: 'A fixed-scope study with a fixed deliverable',
      },
      {
        title: 'Decide',
        description: 'A report you can take to your board.',
        detail: 'You receive a decision-ready report with the evidence, the options and a clear recommendation.',
        youGet: 'A report you can take to your board',
      },
    ],
  },
  cta: {
    eyebrow: 'Free problem review',
    title: 'Not sure which solution you need?',
    body: 'Start with a free problem review. Every submission is read by an engineer and answered within 2 working days.',
    primaryLabel: 'Submit your problem',
    secondaryLabel: 'Browse case studies',
  } as Cta,
}

export const whoWeServePage = {
  hero: {
    title: 'Built for engineering,',
    accent: 'across every discipline.',
    intro: 'We work only in engineering, for organisations worldwide.',
  } as Hero,
  audiences: {
    title: 'Who we serve',
    lead: 'Four audiences, each with a clear starting point. Select yours.',
    items: [
      {
        code: 'EC',
        title: 'Engineering Consultants',
        text: 'Design and advisory firms. Stop losing time to searching and re-checking project data.',
        lead: 'Align Your Technical Data',
        start: 'Technical Data Health Check',
      },
      {
        code: 'CO',
        title: 'Contractors',
        text: 'General, MEP and specialist contractors. Cut cost and schedule risk with proven methods.',
        lead: 'Solve and Prove',
        start: 'Feasibility Proof Report',
      },
      {
        code: 'RD',
        title: 'Research Centres & R&D',
        text: 'Universities, labs and institutes. Turn scattered research into feasible results.',
        lead: 'Improve and Innovate',
        start: 'Innovation Roadmap Sprint',
      },
      {
        code: 'GP',
        title: 'Government & Public Institutions',
        text: 'Authorities, municipalities and regulators. Decide with evidence and audit-friendly documentation.',
        lead: 'Align Your Technical Data + Solve and Prove',
        start: 'Independent Feasibility Review or Data Audit',
      },
    ],
  },
  domains: {
    title: 'Engineering domains',
    lead: 'Practical support in every major discipline.',
    items: [
      { name: 'Civil', note: '' },
      { name: 'Mechanical', note: '' },
      { name: 'HVAC', note: '' },
      { name: 'Electrical', note: '' },
      { name: 'MEP', note: '' },
      { name: 'Mechatronics', note: 'Coming soon' },
      { name: 'Transportation', note: 'Coming soon' },
      { name: 'Other disciplines', note: '' },
    ],
  },
  reassurance: {
    title: 'Reassurance for institutional buyers',
    lead: 'For authorities, municipalities, regulators and procurement teams.',
    items: [
      'Independent, confidential and NDA-ready. NDA first on request.',
      'Audit-friendly reports and clear documentation standards.',
      'Procurement-friendly scope, deliverables, timelines and invoicing, with international payment methods.',
      'Willing to respond to tenders and requests for proposal.',
      'One-page Capability Statement available on request.',
    ],
  },
  cta: {
    eyebrow: 'Any discipline',
    title: 'Tell us your discipline and your problem',
    body: 'We will tell you honestly whether we can help.',
    primaryLabel: 'Submit your problem',
    secondaryLabel: 'Explore our solutions',
  } as Cta,
}

export const sampleReportPage = {
  hero: {
    tag: 'Sample',
    title: 'What a feasibility report',
    accent: 'looks like.',
    intro: 'An illustrative example for a fictional company, so you can see the structure, the evidence and the way we state a recommendation.',
    primaryCta: 'Open the full case study',
    secondaryCta: 'Read the sample',
  },
  notice: 'Example Contractors Ltd is a fictional company. All figures are illustrative and are not real project data or real client results.',
  report: {
    title: 'Feasibility Proof Report',
    client: 'Example Contractors Ltd (fictional mid-size MEP contractor)',
    project: 'Cooling plant replacement, 12,000 m² office building',
    decision: 'Which cooling system should we propose and install?',
  },
  summary: {
    title: 'Summary of recommendation',
    text: 'Option C (water-cooled chillers with cooling towers) has the lowest 10-year cost, but only if the roof structure check passes and water supply is secure. If either fails, Option A is the safer choice.',
  },
  options: {
    title: 'Options compared',
    lead: 'Illustrative 10-year view (undiscounted, USD thousands).',
    rows: [
      { option: 'A. Air-cooled chillers', capital: '620', energy: '118', maintenance: '22', total: '2,020', risk: 'Higher running cost' },
      { option: 'B. VRF system', capital: '540', energy: '135', maintenance: '30', total: '2,190', risk: 'Refrigerant volume, long pipe runs' },
      { option: 'C. Water-cooled chillers + towers', capital: '780', energy: '86', maintenance: '34', total: '1,980', risk: 'Roof loading, water use, upkeep' },
    ],
    note: 'Option C costs about 160 more upfront than Option A but saves about 32 a year in energy. The 10-year gap is small, so the conditions below matter more than the headline number.',
  },
  conditions: {
    title: 'Conditions to confirm first',
    items: ['Structural check of the roof for tower loads', 'Confirmed water supply and treatment plan', 'Plant room access for chiller replacement'],
  },
  risks: {
    title: 'Risks and how to reduce them',
    items: [
      'Cost overrun: fixed-price supplier quotes before tender',
      'Programme delay: order long-lead chillers early',
      'Maintenance burden: agree a service contract up front',
    ],
  },
  assumptions: {
    title: 'Assumptions and limits',
    items: ['Prices and energy figures are placeholders', 'No discounting or inflation applied', 'Final design is outside this study'],
  },
  example: {
    title: 'Read the full worked example',
    text: 'The complete case study adds the challenge, method, 10-year cost model, sensitivity test and risk register.',
    linkLabel: 'Open the full case study',
  },
  feedback: {
    title: 'Client feedback',
    text: 'We are running our first pilot projects. Feedback will be published here only when it is real, in a client’s own words and with their written permission.',
    buttonLabel: 'Become a founding client',
  },
  // Mini report in the hero. Scores are the weighted scores from case study PS-SAMPLE-001.
  sheet: {
    reference: 'PS-SAMPLE-001',
    title: 'Cooling Plant Replacement Options Study',
    recommendation: 'Option C',
    recommendationText: 'Water-cooled chillers with cooling towers, if the roof check and water supply are secure.',
    scores: [
      { label: 'A. Air-cooled', score: 72, best: false },
      { label: 'B. VRF', score: 62, best: false },
      { label: 'C. Water-cooled', score: 77, best: true },
    ],
  },
  cta: {
    eyebrow: 'Solve and Prove',
    title: 'Want a report like this for your project?',
    body: siteSettings.promiseText,
    primaryLabel: 'Submit your problem',
    secondaryLabel: 'Read about Solve and Prove',
  } as Cta,
}

export const submitPage = {
  hero: { title: 'Submit your', accent: 'problem.', intro: siteSettings.promiseText } as Hero,
  next: {
    title: 'What happens next',
    steps: [
      'An engineer reads your submission',
      'We reply within 2 working days',
      'Free problem review: a clear yes or no and a next step',
      'NDA first, if your data is sensitive',
    ],
  },
  thanks: {
    eyebrow: 'Received',
    title: 'Thank you. We have your problem.',
    text: 'While you wait, see how we present our work in the sample reports.',
  },
}

export type LegalPage = { slug: string; title: string; updated: string; sections: { heading: string; text: string }[] }

export const legalPages = {
  pages: [
    {
      slug: 'privacy',
      title: 'Privacy policy',
      updated: '2026-10-01',
      sections: [
        { heading: 'What we collect', text: 'Only what you send us through the Submit your problem form: your name, organisation, email, country, the problem description and any files you attach.' },
        { heading: 'How we use it', text: 'An engineer reads your submission and replies within 2 working days. We do not sell your data or use it for unrelated marketing.' },
        { heading: 'Your rights', text: 'You may ask us to access, correct or delete your submission at any time by emailing us.' },
        { heading: 'Sample content', text: 'Sample reports and case studies on this site are fictional and contain no real client data.' },
      ],
    },
    {
      slug: 'terms',
      title: 'Terms of use',
      updated: '2026-10-01',
      sections: [
        { heading: 'Illustrative content', text: 'Sample reports and case studies are illustrative. Results depend on the client starting point, team and market and are never guaranteed.' },
        { heading: 'No design or price', text: 'Our studies compare options. They are not a detailed design or a construction price.' },
        { heading: 'Your submissions', text: 'Do not send confidential material you are not entitled to share. We will treat what you send as confidential to the review.' },
      ],
    },
  ] as LegalPage[],
}

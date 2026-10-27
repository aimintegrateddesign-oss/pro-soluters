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
    { label: 'About Us', href: '/about' },
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
        { label: 'About Us', href: '/about' },
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

// The three solution pillars shown under the hero headline.
export type HeroStage = {
  icon: 'search-check' | 'trending-up' | 'database'
  label: string
  text: string
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
    stages: [
      {
        icon: 'search-check',
        label: 'Solve',
        text: 'Feasibility · Options · Cost',
      },
      {
        icon: 'trending-up',
        label: 'Improve',
        text: 'Operations · Roadmap · Innovation',
      },
      {
        icon: 'database',
        label: 'Align',
        text: 'Technical data · One source of truth',
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
    images: {
      improveAndInnovate: {
        src: '/images/home-improve-and-innovate.webp',
        alt: 'Isometric illustration of a connected factory with machines, conveyors and a cloud, representing improved operations',
      },
      alignYourTechnicalData: {
        src: '/images/home-align-your-technical-data.webp',
        alt: 'Isometric illustration of a glowing building model above layered technical drawings, representing aligned technical data',
      },
      solveAndProve: {
        src: '/images/home-solve-and-prove.webp',
        alt: 'Illustration comparing three chiller options with a scoring panel, representing a feasibility analysis',
      },
    },
  },
  about: {
    enabled: true,
    eyebrow: 'ABOUT PRO SOLUTORS',
    heading: 'Engineering thinking. Business perspective. Practical solutions.',
    description:
      'Pro Solutors was founded by Zaid Mohiyuddin with a vision to bring engineering, research, business strategy and structured data together to solve complex organisational and technical challenges.',
    secondaryDescription:
      'With a multidisciplinary background spanning Civil Engineering, Engineering Management and Business Administration, Zaid established Pro Solutors around one principle: meaningful solutions must be technically sound, operationally practical and commercially viable.',
    founderName: 'Zaid Mohiyuddin',
    founderRole: 'Founder & Chief Executive Officer',
    // Empty until a portrait is uploaded in Payload; the section then shows a branded placeholder.
    founderImage: { src: '', alt: '' },
    expertise: ['Civil Engineering', 'Engineering Management', 'Business Strategy', 'Innovation'],
    ctaLabel: 'Meet Zaid & Our Team',
    ctaLink: '/about',
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
    eyebrow: 'SOLUTIONS',
    title: 'Three solutions, one purpose:',
    accent: 'decision-ready engineering.',
    intro:
      'Research-led, practical and evidence-based. Choose the solution that fits your challenge, or combine them when the problem crosses multiple areas.',
    primaryLabel: 'Submit your problem',
    secondaryLabel: 'Find my solution',
    flow: ['Complex problem', 'Engineering analysis', 'Structured evidence', 'Decision'],
    image: {
      src: '/images/solutions-hero-review.webp',
      alt: 'A multidisciplinary team of engineers reviewing technical drawings and an engineering analysis on a laptop around a meeting table',
    },
  },
  navigator: {
    items: [
      { number: '01', label: 'Improve', text: 'Improve operations and implement innovation.', cta: 'Explore Improve' },
      { number: '02', label: 'Align', text: 'Create one trusted structure for technical information.', cta: 'Explore Align' },
      { number: '03', label: 'Solve', text: 'Evaluate options and prove the right decision.', cta: 'Explore Solve' },
    ],
  },
  improve: {
    eyebrow: '01 — IMPROVE',
    title: 'Improve and Innovate',
    value:
      'Find where your industry, systems and operations can improve, then build a practical roadmap for implementing meaningful innovation.',
    sequence: ['Current state', 'Opportunities', 'Improvement roadmap'],
    analyseTitle: 'What we analyse',
    analyse: [
      'Existing operations',
      'Bottlenecks and inefficiencies',
      'Process improvement opportunities',
      'Technology opportunities',
      'Innovation potential',
      'Implementation constraints',
    ],
    receiveTitle: 'What you receive',
    receive: [
      'Improvement opportunity review',
      'Practical recommendations',
      'Implementation plan',
      'Prioritised roadmap',
      'Evidence to support investment decisions',
    ],
    offerName: 'Innovation Roadmap Sprint',
    ctaLabel: 'Explore Improve',
    ctaHref: '/solutions/improve-and-innovate',
    image: {
      src: '/images/solutions-improve-operations.webp',
      alt: 'Two engineers reviewing a production flow dashboard on a screen in a precast concrete factory',
    },
  },
  align: {
    eyebrow: '02 — ALIGN',
    title: 'Align Your Technical Data',
    value:
      'Bring fragmented technical information into one structured, reliable and accessible system so teams can work from the same source of truth.',
    sequence: ['Fragmented information', 'Structure', 'One source of truth'],
    analyseTitle: 'What we review',
    analyse: [
      'Drawings',
      'Calculations',
      'Schedules',
      'Models',
      'Technical files',
      'Test results',
      'Existing naming structures',
      'Version inconsistencies',
    ],
    receiveTitle: 'What you receive',
    receive: [
      'Structured technical information model',
      'Common naming and classification approach',
      'Data alignment recommendations',
      'Repository structure',
      'Governance recommendations',
      'Implementation roadmap',
    ],
    offerName: 'Technical Data Health Check',
    ctaLabel: 'Explore Align',
    ctaHref: '/solutions/align-your-technical-data',
    image: {
      src: '/images/solutions-align-data.webp',
      alt: 'Technical drawings, schedules, a model and test results flowing into one structured database, shown on a laptop as a single organised project',
    },
  },
  solve: {
    eyebrow: '03 — SOLVE',
    title: 'Solve and Prove',
    value:
      'Evaluate complex engineering and business challenges through technical analysis, feasibility studies and evidence-based comparison before committing to a decision.',
    sequence: ['Problem', 'Options', 'Evidence', 'Decision'],
    analyseTitle: 'What we evaluate',
    analyse: [
      'Problem definition',
      'Technical feasibility',
      'Alternative solutions',
      'Cost',
      'Risk',
      'Implementation complexity',
      'Operational impact',
      'Commercial considerations',
    ],
    receiveTitle: 'What you receive',
    receive: [
      'Structured options comparison',
      'Technical evidence',
      'Risk assessment',
      'Feasibility findings',
      'Recommendation',
      'Decision-ready report',
    ],
    offerName: 'Feasibility Proof Report',
    ctaLabel: 'Explore Solve',
    ctaHref: '/solutions/solve-and-prove',
    image: {
      src: '/images/solutions-solve-options.webp',
      alt: 'Three engineering options compared side by side on scorecards, with the recommended option highlighted next to a feasibility study report',
    },
  },
  finder: {
    title: 'Which solution fits your challenge?',
    lead: 'Choose the statement that best describes your situation.',
    options: [
      {
        statement: 'Our technical information is inconsistent or scattered.',
        resultTitle: 'Align Your Technical Data',
        resultText: 'Bring drawings, calculations, schedules and models into one structured, trusted source so your teams stop re-checking each other.',
        offer: 'Technical Data Health Check',
        ctaLabel: 'Submit your problem',
        ctaHref: '/submit-a-problem?solution=align-your-technical-data',
        learnLabel: 'Explore Align',
        learnHref: '/solutions/align-your-technical-data',
      },
      {
        statement: 'We need evidence before making a major technical or business decision.',
        resultTitle: 'Solve and Prove',
        resultText: 'Compare the options on technical, cost and risk evidence, and receive a clear recommendation you can take to your board.',
        offer: 'Feasibility Proof Report',
        ctaLabel: 'Submit your problem',
        ctaHref: '/submit-a-problem?solution=solve-and-prove',
        learnLabel: 'Explore Solve',
        learnHref: '/solutions/solve-and-prove',
      },
      {
        statement: 'We want to improve operations or introduce innovation but do not know where to start.',
        resultTitle: 'Improve and Innovate',
        resultText: 'Find the improvement opportunities in your operations, rank them, and build a roadmap your own team can deliver.',
        offer: 'Innovation Roadmap Sprint',
        ctaLabel: 'Submit your problem',
        ctaHref: '/submit-a-problem?solution=improve-and-innovate',
        learnLabel: 'Explore Improve',
        learnHref: '/solutions/improve-and-innovate',
      },
      {
        statement: 'Our challenge involves more than one of these areas.',
        resultTitle: 'Combined Solution',
        resultText: 'Some challenges require more than one solution path. Pro Solutors can combine Improve, Align and Solve based on the problem.',
        offer: '',
        ctaLabel: 'Submit your problem',
        ctaHref: '/submit-a-problem',
        learnLabel: '',
        learnHref: '',
      },
      {
        statement: 'We are not sure yet.',
        resultTitle: 'Start with a Problem Review',
        resultText: 'Tell us what is happening. An engineer will read it and tell you clearly whether and how we can help.',
        offer: '',
        ctaLabel: 'Submit your problem',
        ctaHref: '/submit-a-problem',
        learnLabel: '',
        learnHref: '',
      },
    ],
  },
  how: {
    title: 'How we work',
    lead: 'A structured process that turns a complex problem into a decision-ready outcome.',
    steps: [
      {
        title: 'Submit',
        description: 'Tell us the problem.',
        detail:
          'Describe the problem in plain language and share only the information necessary to understand the challenge. If your information is sensitive, an NDA can be arranged before detailed material is shared.',
        youGet: 'Your problem, on record with an engineer',
      },
      {
        title: 'Review',
        description: 'We understand the challenge.',
        detail: 'An engineer reads every submission, identifies the relevant disciplines and replies within 2 working days with the best starting point.',
        youGet: 'A clear yes or no, and a next step',
      },
      {
        title: 'Study',
        description: 'We analyse the real case.',
        detail:
          'We investigate the real case using technical analysis, structured research, data review and feasibility assessment as required, against a defined scope and deliverable.',
        youGet: 'A fixed-scope study with a fixed deliverable',
      },
      {
        title: 'Decide',
        description: 'You receive a clear recommendation.',
        detail: 'You receive clear findings, evidence, recommendations and a decision-ready output you can take to your board.',
        youGet: 'A report you can take to your board',
      },
    ],
    previewTitle: 'Feasibility report',
    previewItems: ['Executive summary', 'Problem definition', 'Options comparison', 'Technical analysis', 'Risk assessment', 'Recommendation'],
    previewLinkLabel: 'See a sample report',
  },
}

export const whoWeServePage = {
  hero: {
    eyebrow: 'WHO WE SERVE',
    title: 'Built for engineering,',
    accent: 'across every discipline.',
    intro: 'We work only in engineering, for organisations worldwide.',
    support:
      'From consultants and contractors to research teams and public institutions, Pro Solutors helps engineering organisations solve complex problems through structured analysis, aligned information and evidence-based decisions.',
    primaryLabel: 'Submit your problem',
    secondaryLabel: 'Explore solutions',
    labels: ['Engineering Consultants', 'Contractors', 'Research & R&D', 'Public Institutions'],
    image: {
      src: '/images/who-we-serve-hero.webp',
      alt: 'Engineers at work across disciplines: a technician with a wrench, a manufacturing line, wind and solar energy, site engineers reading drawings and an engineer at a CAD workstation',
    },
  },
  audiences: {
    title: 'Who we serve',
    lead: 'Four audiences, each with a clear starting point.',
    items: [
      {
        code: 'EC',
        title: 'Engineering Consultants',
        text: 'Design and advisory firms.',
        challenge: 'Losing time to searching and re-checking project data.',
        lead: 'Align Your Technical Data',
        start: 'Technical Data Health Check',
      },
      {
        code: 'CO',
        title: 'Contractors',
        text: 'General, MEP and specialist contractors.',
        challenge: 'Cost and schedule risk that proven methods can reduce.',
        lead: 'Solve and Prove',
        start: 'Feasibility Proof Report',
      },
      {
        code: 'R&D',
        title: 'Research Centres & R&D',
        text: 'Universities, labs and institutes.',
        challenge: 'Scattered research that needs to become feasible results.',
        lead: 'Improve and Innovate',
        start: 'Innovation Roadmap Sprint',
      },
      {
        code: 'PI',
        title: 'Government & Public Institutions',
        text: 'Authorities, municipalities and regulators.',
        challenge: 'Deciding with evidence and audit-friendly documentation.',
        lead: 'Align Your Technical Data + Solve and Prove',
        start: 'Independent Feasibility Review or Data Audit',
      },
    ],
    cardCta: 'Start with this',
  },
  domains: {
    eyebrow: 'ENGINEERING DOMAINS',
    title: 'Practical support across major engineering disciplines.',
    lead: 'One engineering approach, applied to the discipline in front of you.',
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
    // Optional. Clear it in Payload to fall back to the built-in illustration.
    image: {
      src: '/images/who-we-serve-domains.webp',
      alt: 'Multidisciplinary engineering systems around a central hub: a structural frame, mechanical gear assembly, HVAC ductwork, electrical transmission, piping, rail and bridge, robotics and electronics, and layered city infrastructure',
    },
  },
  reassurance: {
    eyebrow: 'FOR INSTITUTIONAL BUYERS',
    title: 'Procurement should not make engineering harder.',
    lead: 'For authorities, municipalities, regulators and procurement teams.',
    items: [
      'Independent, confidential and NDA-ready. NDA first on request.',
      'Audit-friendly reports and clear documentation standards.',
      'Procurement-friendly scope, deliverables, timelines and invoicing, with international payment methods.',
      'Willing to respond to tenders and requests for proposal.',
      'One-page Capability Statement available on request.',
    ],
    ctaLabel: 'Submit your problem',
    ctaHref: '/submit-a-problem',
    // Optional. Leave empty to show the built-in document mockup.
    image: { src: '', alt: '' },
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
    image: { src: '/images/case-cooling-plant.webp', alt: 'Two engineers reviewing cooling plant options on a laptop, with Option C recommended' },
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

export type TeamMember = {
  name: string
  role: string
  discipline: string
  linkedin: string
  /** Populated Media record from Payload; empty means the initials placeholder (or the founder portrait for the founder). */
  photo?: { url?: string | null; alt?: string | null } | null
}

export const aboutPage = {
  hero: {
    eyebrow: 'ABOUT PRO SOLUTORS',
    title: 'Engineering insight. Business thinking. Better decisions.',
    intro:
      'Pro Solutors is a multidisciplinary problem-solving organisation that brings engineering, research, structured data and business strategy together to help organisations understand complex challenges and make practical, evidence-based decisions.',
    secondLine: 'We focus on solutions that are technically sound, operationally practical and commercially viable.',
  },
  founder: {
    eyebrow: 'OUR FOUNDER',
    name: 'Zaid Mohiyuddin',
    role: 'Founder & Chief Executive Officer',
    descriptor: ['Civil Engineer', 'Engineering Management Professional', 'MBA Graduate', 'Entrepreneur'],
    paragraphs: [
      'Zaid Mohiyuddin is a Civil Engineer, Engineering Management professional, and MBA graduate with a multidisciplinary academic background combining technical engineering knowledge, strategic management, and business administration.',
      'He completed his Master of Engineering Management and Master of Business Administration (MBA) at the University of Technology Sydney (UTS), Australia, equipping him with an integrated perspective on engineering, business strategy, organisational performance, and innovation.',
    ],
    // Optional. Leave empty to hide the LinkedIn button.
    linkedin: '',
    // Optional portrait. When empty the page uses the founder image from the Home page About section, then the placeholder.
    image: { src: '', alt: '' },
  },
  journey: {
    title: 'A multidisciplinary foundation',
    paragraphs: [
      'His academic journey shaped the belief that meaningful progress requires more than technical knowledge alone. It requires understanding how engineering systems, organisational processes, commercial objectives and human expertise work together.',
      'This integrated perspective became the foundation of Pro Solutors and its commitment to developing solutions that are technically sound, operationally practical and commercially viable.',
    ],
    steps: ['Civil Engineering', 'Engineering Management', 'Business Administration', 'Pro Solutors'],
  },
  why: {
    title: 'Why Pro Solutors exists',
    paragraphs: [
      'As the Founder and CEO of Pro Solutors, Zaid aims to build an international problem-solving organisation that bridges the gap between engineering, business strategy, data management and innovation.',
      'The goal is to help organisations overcome complex challenges through structured research, technical analysis, feasibility studies and practical, evidence-based solutions.',
    ],
    disciplines: ['Engineering', 'Research', 'Data', 'Business Strategy'],
  },
  focus: {
    title: 'What we focus on',
    items: [
      {
        number: '01',
        label: 'Improve',
        title: 'Improve industries through innovation',
        text: 'Identify opportunities to improve systems, processes and operations, and develop practical strategies that help organisations implement meaningful innovation.',
      },
      {
        number: '02',
        label: 'Align',
        title: 'Structure and align technical information',
        text: 'Transform fragmented technical knowledge and business information into organised, reliable and accessible systems that support better decisions.',
      },
      {
        number: '03',
        label: 'Solve',
        title: 'Evaluate and solve complex challenges',
        text: 'Use structured research, technical analysis, feasibility studies and strategic reporting to evaluate engineering and business problems and identify practical solutions.',
      },
    ],
  },
  philosophy: {
    eyebrow: 'OUR PHILOSOPHY',
    statement: 'Understand the problem. Challenge conventional thinking. Engineer a better solution.',
    support: 'Every meaningful solution begins with understanding the real problem before deciding how to solve it.',
  },
  team: {
    title: 'The people behind the solutions',
    intro: 'Pro Solutors brings together multidisciplinary expertise in engineering, research, analysis and strategic problem solving.',
    members: [
      {
        name: 'Zaid Mohiyuddin',
        role: 'Founder & Chief Executive Officer',
        discipline: 'Civil Engineering · Engineering Management · Business Strategy',
        linkedin: '',
      },
    ] as TeamMember[],
  },
  vision: {
    eyebrow: 'GLOBAL VISION',
    title: 'Built for problems without borders',
    paragraphs: [
      'With an international outlook shaped by postgraduate education in Australia and a foundation in civil engineering, Zaid aspires to connect professionals, researchers and industry specialists across geographical boundaries to address challenges that demand multidisciplinary thinking.',
      'The long-term vision is to establish Pro Solutors as a globally connected problem-solving partner, transforming complex challenges into structured solutions that create measurable value for businesses, industries and communities.',
    ],
  },
  cta: {
    eyebrow: 'Work with us',
    title: 'Have a complex problem worth solving?',
    body: 'Bring us the challenge. We will help define the problem, evaluate the options and identify the most practical path forward.',
    primaryLabel: 'Submit your problem',
    secondaryLabel: 'Explore our solutions',
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

import type { Solution } from '../../data/types'

export const solutions: Solution[] = [
  {
    slug: 'solve-and-prove',
    name: 'Solve and Prove',
    eyebrow: 'Solve and Prove | Feasibility Proof Report',
    order: 3,
    shortSummary:
      'Solve technical problems through practical analysis and prove the best solution with a feasibility report.',
    image: '/images/feasibility-analysis.webp',
    imageAlt: 'Feasibility and options analysis comparing three chiller options, with Option C recommended',
    icon: 'search-check',
    highlights: [
      'Clear problem definition and options',
      'Cost and risk analysis',
      'Recommendation in a decision-ready report',
    ],
    problemStatement: [
      'A technical decision with real money behind it needs more than a supplier quote. Which system should you install, and will the answer still hold if energy prices rise?',
      'Solve and Prove turns that question into a Feasibility Proof Report your team and your client can rely on.',
    ],
    approachSteps: [
      { title: 'Check the load', description: 'Confirm the real requirement before sizing anything.' },
      { title: 'Shortlist', description: 'Pick the options that fit the site and the budget cap.' },
      { title: 'Cost model', description: 'Capital, energy and maintenance over 10 years.' },
      { title: 'Stress test', description: 'Repeat the model with rising energy prices.' },
      { title: 'Score', description: 'Rate each option on agreed, weighted criteria.' },
      { title: 'Risk review', description: 'List what could go wrong with the leading option and how to control it.' },
    ],
    deliverables: [
      'Options study with a clear recommendation and fallback',
      '10-year lifecycle cost model with sensitivity tests',
      'Weighted scoring against criteria agreed before pricing',
      'Risk register with controls, and a dated next-steps plan',
    ],
    entryOffer: {
      label: 'Feasibility Proof Report',
      description: 'Tell us the decision you face. An engineer reads it and tells you clearly whether a feasibility proof report would help.',
      ctaLabel: 'Request a Feasibility Proof Report',
    },
  },
  {
    slug: 'improve-and-innovate',
    name: 'Improve and Innovate',
    eyebrow: 'Improve and Innovate | Operations Review',
    order: 1,
    shortSummary:
      'Find how your industry and operations can improve, and plan how to implement innovation.',
    image: '/images/case-production-flow.webp',
    imageAlt: 'Engineers reviewing a production flow dashboard in a precast concrete factory',
    icon: 'trending-up',
    highlights: [
      'Review of operations and improvement opportunities',
      'Practical plan to implement innovation',
      'Prioritised roadmap you can act on',
    ],
    problemStatement: [
      'Your team is working hard, yet deliveries slip and nobody can say where the time is going.',
      'Improve and Innovate makes the delays visible, ranks what to fix first, and builds a phased roadmap that your own team can deliver.',
    ],
    approachSteps: [
      { title: 'Review', description: 'Walk the site, interview supervisors and operators, analyse shift data.' },
      { title: 'Find', description: 'List the improvement opportunities across production, quality, planning and equipment.' },
      { title: 'Prioritise', description: 'Rank each by impact and effort so quick wins pay for bigger changes.' },
      { title: 'Plan', description: 'Build a roadmap with an owner, a target and a date for every action.' },
    ],
    deliverables: [
      'Ranked opportunity list (impact versus effort)',
      'Phased implementation roadmap with named owners',
      'Weekly measures tracked against your starting figures',
      'Value case with one-off investment and payback',
    ],
    entryOffer: {
      label: 'Innovation Roadmap Sprint',
      description: 'A short, fixed-scope sprint that turns improvement ideas into a prioritised roadmap you can act on.',
      ctaLabel: 'Book an Innovation Roadmap Sprint',
    },
  },
  {
    slug: 'align-your-technical-data',
    name: 'Align Your Technical Data',
    eyebrow: 'Align Your Technical Data | Data Register',
    order: 2,
    shortSummary:
      'Gather all technical structure into one database and align structure and data across the whole company.',
    image: '/images/case-technical-data.webp',
    imageAlt: 'Two engineers comparing scattered data with one aligned, structured project data source',
    icon: 'database',
    highlights: [
      'Audit of drawings, calculations, schedules, models and test results',
      'One aligned structure for the whole company',
      'Audit report and alignment roadmap',
    ],
    problemStatement: [
      'Engineers know the data exists somewhere but cannot be sure which version is right, and errors surface late at checking or on site.',
      'Align Your Technical Data brings the structure, naming and ownership into one place so everyone works from the same truth.',
    ],
    approachSteps: [
      { title: 'Audit', description: 'Inventory drawings, calculations, schedules, models and test results.' },
      { title: 'Map', description: 'Find duplicates, conflicts and gaps, and trace how data moves.' },
      { title: 'Design', description: 'One structure: naming, metadata, ownership and change control.' },
      { title: 'Align', description: 'Pilot on live projects, fix what fails, then roll out with training.' },
    ],
    deliverables: [
      'Technical Data Health Check with a conflicts report',
      'One naming standard and project data register',
      'Change control, ownership and access rules',
      'Automatic checking rules before each issue',
    ],
    entryOffer: {
      label: 'Technical Data Health Check',
      description: 'We audit what you have, show you where it disagrees, and give you a roadmap.',
      ctaLabel: 'Book a Technical Data Health Check',
    },
  },
]

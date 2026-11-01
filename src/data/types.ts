import type { Seo } from '@/lib/content-merge'

export type SolutionSlug = 'solve-and-prove' | 'improve-and-innovate' | 'align-your-technical-data'

export type Kpi = { value: string; caption: string }
export type Level = 'low' | 'medium' | 'high'

export type Solution = {
  slug: SolutionSlug
  name: string
  eyebrow: string
  order: number
  shortSummary: string
  image: string
  imageAlt: string
  icon: 'search-check' | 'trending-up' | 'database'
  /** Short checklist shown on the solutions overview cards. */
  highlights: string[]
  problemStatement: string[]
  approachSteps: { title: string; description: string }[]
  deliverables: string[]
  entryOffer: { label: string; description: string; ctaLabel: string }
  /** SEO overrides set in Payload; blanks fall back to generated values. */
  seo?: Seo
}

export type Industry = { slug: string; name: string }

export type CaseStudy = {
  slug: string
  title: string
  subtitle: string
  solution: SolutionSlug
  industries: string[]
  referenceCode: string
  /** ISO date */
  editionDate: string
  clientName: string
  clientDescription: string
  isSample: boolean
  featured: boolean
  cover: string
  coverAlt: string
  duration: string
  outcome: string
  kpis: Kpi[]
  challengeIntro: string
  symptoms: { symptom: string; finding: string }[]
  approachSteps: { title: string; description: string }[]
  opportunities?: { opportunity: string; impact: Level; effort: Level; phase: number }[]
  phases: { name: string; when: string; focus: string; goal: string }[]
  resultsHeadings: [string, string, string, string]
  results: { measure: string; before: string; after: string; change: string }[]
  /** Highlight box (accent-soft + teal left border), e.g. a recommendation. */
  recommendation?: { title: string; text: string }
  chart: { title: string; type: 'line' | 'bar'; labels: string[]; values: number[]; caption: string; unit?: string }
  benefits?: { label: string; amountUsdK: number }[]
  investmentUsdK?: number
  paybackText?: string
  lessonsHeading: string
  whatMadeItWork: { title: string; text: string }[]
  nextSteps: string[]
  assumptions: string[]
  pdf?: string
  seo?: Seo
}

export type SiteSettings = {
  promiseText: string
  notificationEmail: string
  phone: string
  address: string
  sampleDisclaimerText: string
  tagline: string
  description: string
}

export type NavItem = { label: string; href: string }

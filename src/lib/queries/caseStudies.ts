import type { CaseStudy as CaseStudyDoc, Industry as IndustryDoc, Solution as SolutionDoc } from '@/payload-types'
import type { CaseStudy, Level, SolutionSlug } from '@/data/types'
import { getPayloadClient } from '@/lib/payload'
import { readSeo } from '@/lib/content-merge'
import { isOffline } from './offline'

export const CASE_STUDIES_PER_PAGE = 9

export type CaseStudyFilters = {
  solution?: string
  industry?: string
  q?: string
  page?: number
}

const texts = (rows?: { text?: string | null }[] | null) => (rows ?? []).map((r) => r.text ?? '')
const s = (v?: string | null) => v ?? ''

function mapCaseStudy(d: CaseStudyDoc): CaseStudy {
  const solution = d.solution as SolutionDoc
  const headings = texts(d.resultsHeadings)
  return {
    slug: d.slug,
    title: d.title,
    subtitle: s(d.subtitle),
    solution: solution.slug as SolutionSlug,
    industries: ((d.industries ?? []) as IndustryDoc[]).map((i) => i.slug),
    referenceCode: d.referenceCode,
    editionDate: d.editionDate ?? new Date().toISOString(),
    clientName: s(d.clientName),
    clientDescription: s(d.clientDescription),
    isSample: d.isSample ?? true,
    featured: d.featured ?? false,
    cover: s(d.cover),
    coverAlt: s(d.coverAlt),
    duration: s(d.duration),
    outcome: s(d.outcome),
    kpis: (d.kpis ?? []).map((k) => ({ value: k.value, caption: k.caption })),
    challengeIntro: s(d.challengeIntro),
    symptoms: (d.symptoms ?? []).map((x) => ({ symptom: x.symptom, finding: x.finding })),
    approachSteps: (d.approachSteps ?? []).map((x) => ({ title: x.title, description: x.description })),
    opportunities: d.opportunities?.length
      ? d.opportunities.map((o) => ({ opportunity: o.opportunity, impact: o.impact as Level, effort: o.effort as Level, phase: o.phase }))
      : undefined,
    phases: (d.phases ?? []).map((p) => ({ name: p.name, when: p.when, focus: p.focus, goal: p.goal })),
    resultsHeadings: [headings[0] ?? 'Measure', headings[1] ?? 'Before', headings[2] ?? 'After', headings[3] ?? 'Change'],
    results: (d.results ?? []).map((r) => ({ measure: r.measure, before: s(r.before), after: s(r.after), change: s(r.change) })),
    recommendation: d.recommendation?.title ? { title: d.recommendation.title, text: s(d.recommendation.text) } : undefined,
    chart: {
      title: s(d.chart?.title),
      type: d.chart?.type ?? 'bar',
      labels: texts(d.chart?.labels),
      values: (d.chart?.values ?? []).map((v) => v.value),
      caption: s(d.chart?.caption),
      unit: d.chart?.unit ?? undefined,
    },
    benefits: d.benefits?.length ? d.benefits.map((b) => ({ label: b.label, amountUsdK: b.amountUsdK })) : undefined,
    investmentUsdK: d.investmentUsdK ?? undefined,
    paybackText: d.paybackText ?? undefined,
    lessonsHeading: d.lessonsHeading ?? 'What made it work',
    whatMadeItWork: (d.whatMadeItWork ?? []).map((w) => ({ title: w.title, text: w.text })),
    nextSteps: texts(d.nextSteps),
    assumptions: texts(d.assumptions),
    pdf: d.pdf ?? undefined,
    seo: readSeo(d),
  }
}

// Public queries only ever see published documents (access control also enforces this for anonymous users).
const published = { _status: { equals: 'published' } } as const

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  if (isOffline()) return [...(await import('@/seed/data/caseStudies')).caseStudies].sort((a, b) => a.referenceCode.localeCompare(b.referenceCode))
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: published,
    sort: 'referenceCode',
    limit: 200,
    depth: 1,
    pagination: false,
  })
  return docs.map(mapCaseStudy)
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | undefined> {
  if (isOffline()) return (await getAllCaseStudies()).find((c) => c.slug === slug)
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: { and: [published, { slug: { equals: slug } }] },
    limit: 1,
    depth: 1,
  })
  return docs[0] ? mapCaseStudy(docs[0]) : undefined
}

export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  return (await getAllCaseStudies()).filter((c) => c.featured)
}

export async function getLatestCaseStudies(limit: number): Promise<CaseStudy[]> {
  return [...(await getAllCaseStudies())].sort((a, b) => b.editionDate.localeCompare(a.editionDate)).slice(0, limit)
}

export async function getRelatedCaseStudies(current: CaseStudy, limit = 2): Promise<CaseStudy[]> {
  const others = (await getAllCaseStudies()).filter((c) => c.slug !== current.slug)
  return [...others.filter((c) => c.solution === current.solution), ...others.filter((c) => c.solution !== current.solution)].slice(0, limit)
}

export async function getCaseStudiesForSolution(solution: SolutionSlug): Promise<CaseStudy[]> {
  return (await getAllCaseStudies()).filter((c) => c.solution === solution)
}

// DECISION: filtering happens in memory after one query. The catalogue is small (tens of items);
// move this into a Payload `where` if it ever grows past a few hundred.
export async function searchCaseStudies(filters: CaseStudyFilters) {
  const q = filters.q?.trim().toLowerCase()
  const matches = (await getAllCaseStudies()).filter((c) => {
    if (filters.solution && c.solution !== filters.solution) return false
    if (filters.industry && !c.industries.includes(filters.industry)) return false
    if (q && !`${c.title} ${c.subtitle} ${c.clientName} ${c.referenceCode}`.toLowerCase().includes(q)) return false
    return true
  })
  const page = Math.max(1, filters.page ?? 1)
  return {
    docs: matches.slice((page - 1) * CASE_STUDIES_PER_PAGE, page * CASE_STUDIES_PER_PAGE),
    total: matches.length,
    page,
    totalPages: Math.max(1, Math.ceil(matches.length / CASE_STUDIES_PER_PAGE)),
  }
}

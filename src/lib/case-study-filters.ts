import type { CaseStudyFilters } from '@/lib/queries/caseStudies'

export const ALL_SOLUTIONS = 'all-solutions'
export type CaseStudySearchParams = Record<string, string | string[] | undefined>

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

/** Keep direct links and GET form submissions consistent; no solution means the full catalogue. */
export function parseCaseStudyFilters(params: CaseStudySearchParams): CaseStudyFilters {
  const solution = first(params.solution)
  const page = Number(first(params.page))
  return {
    solution: solution && solution !== ALL_SOLUTIONS ? solution : undefined,
    industry: first(params.industry),
    q: first(params.q),
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
  }
}

/** Shareable filter URLs used by solution tabs, pagination and the reset link. */
export function caseStudiesHref({ solution, industry, q, page }: CaseStudyFilters = {}): string {
  const params = new URLSearchParams({ solution: solution || ALL_SOLUTIONS })
  if (industry) params.set('industry', industry)
  if (q) params.set('q', q)
  if (page !== undefined && Number.isSafeInteger(page) && page > 1) params.set('page', String(page))
  return '/case-studies?' + params.toString() + '#case-results'
}

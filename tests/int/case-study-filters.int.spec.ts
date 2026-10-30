import { describe, expect, it } from 'vitest'

import { ALL_SOLUTIONS, caseStudiesHref, parseCaseStudyFilters } from '@/lib/case-study-filters'

const urlFor = (href: string) => new URL(href, 'https://example.test')

describe('case-study filter URLs', () => {
  it('gives the unfiltered list an explicit all-solutions URL', () => {
    expect(caseStudiesHref()).toBe('/case-studies?solution=all-solutions#case-results')
    expect(ALL_SOLUTIONS).toBe('all-solutions')
  })

  it.each(['solve-and-prove', 'improve-and-innovate', 'align-your-technical-data', 'new-cms-solution'])('preserves the solution slug %s', (solution) => {
    const url = urlFor(caseStudiesHref({ solution }))

    expect(url.pathname).toBe('/case-studies')
    expect(url.searchParams.get('solution')).toBe(solution)
    expect(url.hash).toBe('#case-results')
    expect(parseCaseStudyFilters(Object.fromEntries(url.searchParams)).solution).toBe(solution)
  })

  it('round-trips combined filters and safely encodes search text', () => {
    const filters = {
      solution: 'solve-and-prove',
      industry: 'mep-construction',
      q: 'pump & motor + 50% / #1',
      page: 3,
    }
    const url = urlFor(caseStudiesHref(filters))

    expect(url.searchParams.get('q')).toBe(filters.q)
    expect(url.searchParams.get('industry')).toBe(filters.industry)
    expect(url.hash).toBe('#case-results')
    expect(parseCaseStudyFilters(Object.fromEntries(url.searchParams))).toEqual(filters)
  })

  it('retains search and industry when switching solution and restarting pagination', () => {
    const current = { solution: 'solve-and-prove', industry: 'manufacturing', q: 'production', page: 4 }
    const url = urlFor(caseStudiesHref({ solution: 'improve-and-innovate', industry: current.industry, q: current.q }))

    expect(url.searchParams.get('solution')).toBe('improve-and-innovate')
    expect(url.searchParams.get('industry')).toBe(current.industry)
    expect(url.searchParams.get('q')).toBe(current.q)
    expect(url.searchParams.has('page')).toBe(false)
  })

  it('keeps search, industry and pagination when returning to all solutions', () => {
    const url = urlFor(caseStudiesHref({ industry: 'manufacturing', q: 'output', page: 2 }))

    expect(url.searchParams.get('solution')).toBe(ALL_SOLUTIONS)
    expect(parseCaseStudyFilters(Object.fromEntries(url.searchParams))).toEqual({
      solution: undefined,
      industry: 'manufacturing',
      q: 'output',
      page: 2,
    })
  })

  it('omits empty optional filters and the first page', () => {
    expect(caseStudiesHref({ q: '', industry: '', page: 1 })).toBe(caseStudiesHref())
  })

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1])('omits invalid pagination %s when creating links', (page) => {
    expect(urlFor(caseStudiesHref({ page })).searchParams.has('page')).toBe(false)
  })
})

describe('parsing case-study filters', () => {
  it.each([undefined, '', 'all-solutions'])('treats %s as all solutions', (solution) => {
    const filters = parseCaseStudyFilters({ solution })

    expect(filters.solution).toBeUndefined()
    expect(filters.page).toBe(1)
  })

  it('uses the first value when a query parameter is repeated', () => {
    expect(parseCaseStudyFilters({
      solution: ['solve-and-prove', 'improve-and-innovate'],
      industry: ['mep-construction', 'manufacturing'],
      q: ['first search', 'second search'],
      page: ['2', '5'],
    })).toEqual({ solution: 'solve-and-prove', industry: 'mep-construction', q: 'first search', page: 2 })
  })

  it('preserves search and industry strings for the existing data query', () => {
    const filters = parseCaseStudyFilters({ q: '  Cooling plant  ', industry: 'mep-construction' })

    expect(filters.q).toBe('  Cooling plant  ')
    expect(filters.industry).toBe('mep-construction')
  })

  it.each([undefined, '', '0', '-2', '1.5', 'abc', 'Infinity', '9007199254740992'])('normalizes invalid pagination %s to the first page', (page) => {
    expect(parseCaseStudyFilters({ page }).page).toBe(1)
  })
})

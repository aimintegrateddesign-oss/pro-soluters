import type { Metadata } from 'next'
import Link from 'next/link'

import { Button, CheckList, Container, Section, SectionHead } from '@/components/ds/primitives'
import { CaseStudyForm } from '@/components/forms/CaseStudyForm'
import { CaseStudyCard, PageBand, cardClass } from '@/components/sections/sections'
import { getIndustries } from '@/lib/queries/industries'
import { searchCaseStudies } from '@/lib/queries/caseStudies'
import { getSolutions } from '@/lib/queries/solutions'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Case studies',
  description: 'Sample case studies and feasibility reports showing how Pro Solutors works. All sample content is fictional.',
  alternates: { canonical: '/case-studies' },
}

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

function href(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams(Object.entries(params).filter((e): e is [string, string] => Boolean(e[1])))
  return qs.size ? `/case-studies?${qs}` : '/case-studies'
}

export default async function CaseStudiesPage({ searchParams }: Props) {
  const sp = await searchParams
  const solution = one(sp.solution)
  const industry = one(sp.industry)
  const q = one(sp.q)
  const page = Number(one(sp.page)) || 1

  const [solutions, industries, result] = await Promise.all([getSolutions(), getIndustries(), searchCaseStudies({ solution, industry, q, page })])
  const names = Object.fromEntries(solutions.map((s) => [s.slug, s.name]))
  const chip = (active: boolean) =>
    cn(
      'inline-flex min-h-10 items-center rounded-full border-2 px-4 text-sm font-bold transition-colors',
      active ? 'border-navy bg-navy text-white' : 'border-line text-heading hover:border-navy',
    )

  return (
    <>
      <PageBand eyebrow="Case studies" title="Sample work, shown in full">
        <p>Every study here is an illustrative sample with fictional companies and figures.</p>
        <Button href="#share" tone="navy" variant="secondary" className="mt-6">
          Share your case study
        </Button>
      </PageBand>

      <Section className="py-12 lg:py-16">
        <Container>
          <nav aria-label="Filter by solution" className="flex flex-wrap gap-2">
            <Link href={href({ industry, q })} className={chip(!solution)} aria-current={!solution ? 'true' : undefined}>
              All solutions
            </Link>
            {solutions.map((s) => (
              <Link key={s.slug} href={href({ solution: s.slug, industry, q })} className={chip(solution === s.slug)} aria-current={solution === s.slug ? 'true' : undefined}>
                {s.name}
              </Link>
            ))}
          </nav>

          {/* DECISION: a plain GET form keeps filters in the URL with no client JS. */}
          <form method="get" action="/case-studies" className="mt-6 flex flex-col gap-3 sm:flex-row">
            {solution && <input type="hidden" name="solution" value={solution} />}
            <label className="sr-only" htmlFor="q">
              Search case studies
            </label>
            <input id="q" name="q" type="search" defaultValue={q} placeholder="Search by title, client or reference" className="min-h-12 flex-1 rounded-lg border border-line bg-card px-4 text-ink" />
            <label className="sr-only" htmlFor="industry">
              Industry
            </label>
            <select id="industry" name="industry" defaultValue={industry ?? ''} className="min-h-12 rounded-lg border border-line bg-card px-4 text-ink">
              <option value="">All industries</option>
              {industries.map((i) => (
                <option key={i.slug} value={i.slug}>
                  {i.name}
                </option>
              ))}
            </select>
            <Button type="submit">Apply</Button>
          </form>

          <p className="mt-6 text-sm text-muted" aria-live="polite">
            {result.total} {result.total === 1 ? 'result' : 'results'}
          </p>

          {result.docs.length === 0 ? (
            <div className="mt-6 rounded-card border border-dashed border-line p-10 text-center">
              <p className="text-lg font-bold text-heading">No case studies match those filters.</p>
              <Button href="/case-studies" variant="secondary" className="mt-4">
                Reset filters
              </Button>
            </div>
          ) : (
            <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {result.docs.map((c) => (
                <li key={c.slug}>
                  <CaseStudyCard study={c} solutionName={names[c.solution]} />
                </li>
              ))}
            </ul>
          )}

          {result.totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-10 flex justify-center gap-2">
              {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={href({ solution, industry, q, page: p === 1 ? undefined : String(p) })} className={chip(p === result.page)}>
                  {p}
                </Link>
              ))}
            </nav>
          )}
        </Container>
      </Section>

      <Section tone="alt" id="share" className="scroll-mt-[var(--header-h)]">
        <Container className="grid items-start gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <SectionHead
              title="Share your case study"
              lead="Delivered a project that shows what good engineering can achieve? Send it to us and we will help you turn it into a published case study."
            />
            <CheckList
              items={[
                'Every submission is read by an engineer before anything is published',
                'Nothing goes live until you have approved the final version',
                'Share only what you have the right to share, and remove anything confidential',
              ]}
            />
          </div>
          <div className={cardClass + ' hover:translate-y-0 hover:border-line'}>
            <CaseStudyForm
              solutions={solutions.map((s) => ({ value: s.slug, label: s.name }))}
              industries={industries.map((i) => ({ value: i.slug, label: i.name }))}
            />
          </div>
        </Container>
      </Section>
    </>
  )
}

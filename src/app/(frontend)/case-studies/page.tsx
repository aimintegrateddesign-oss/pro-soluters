import type { Metadata } from 'next'
import Link from 'next/link'
import { Search } from 'lucide-react'

import { CaseCard } from '@/components/case-study/parts'
import { Band, HeroContainer, HeroShell, WIDE } from '@/components/ds/band'
import { Button, Container } from '@/components/ds/primitives'
import { HomeCta } from '@/components/home/HomeCta'
import { getCaseStudiesPage, getSiteSettings, pageMetadata } from '@/lib/queries/content'
import { getIndustries } from '@/lib/queries/industries'
import { searchCaseStudies } from '@/lib/queries/caseStudies'
import { getSolutions } from '@/lib/queries/solutions'
import { cn } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const [{ seo: site }, { seo }] = await Promise.all([getSiteSettings(), getCaseStudiesPage()])
  return pageMetadata(
    seo,
    { title: 'Case studies', description: 'Sample case studies and feasibility reports showing how Pro Solutors works. All sample content is fictional.', path: '/case-studies' },
    site,
  )
}

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

function href(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams(Object.entries(params).filter((e): e is [string, string] => Boolean(e[1])))
  return qs.size ? `/case-studies?${qs}` : '/case-studies'
}

const fieldClass = 'min-h-12 rounded-[4px] border border-line bg-bg px-4 text-ink'

export default async function CaseStudiesPage({ searchParams }: Props) {
  const sp = await searchParams
  const solution = one(sp.solution)
  const industry = one(sp.industry)
  const q = one(sp.q)
  const page = Number(one(sp.page)) || 1

  const [solutions, industries, result, { content }] = await Promise.all([
    getSolutions(),
    getIndustries(),
    searchCaseStudies({ solution, industry, q, page }),
    getCaseStudiesPage(),
  ])
  const names = Object.fromEntries(solutions.map((s) => [s.slug, s.name]))
  const industryNames = Object.fromEntries(industries.map((i) => [i.slug, i.name]))
  // Active chip inverts the band: light on navy, navy on white.
  const chip = (active: boolean) =>
    cn(
      'inline-flex min-h-11 items-center rounded-[4px] border px-4 text-sm font-bold transition-colors',
      active ? 'border-heading bg-heading text-bg' : 'border-line text-heading hover:border-accent',
    )

  return (
    <>
      {/* Navy hero */}
      <HeroShell>
        <HeroContainer>
          <h1 className="text-[clamp(2.25rem,4.6vw,4rem)] font-extrabold leading-[1.02] !tracking-[-0.035em] text-white">
            {content.hero.title} <span className="text-accent">{content.hero.accent}</span>
          </h1>
          <p className="mt-4 max-w-[36rem] text-lg text-[#c3d0dd]">{content.hero.intro}</p>
        </HeroContainer>
      </HeroShell>

      {/* White results */}
      <Band tone="light" className="py-12 lg:py-16">
        <Container className={WIDE}>
          {/* DECISION: a plain GET form keeps filters in the URL with no client JS. */}
          <div className="theme-dark rounded-[4px] border border-line bg-[#0a1626] p-4 sm:p-5">
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

            <form method="get" action="/case-studies" className="mt-4 flex flex-col gap-3 sm:flex-row">
              {solution && <input type="hidden" name="solution" value={solution} />}
              <label className="sr-only" htmlFor="q">
                Search case studies
              </label>
              <div className="relative flex-1">
                <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input id="q" name="q" type="search" defaultValue={q} placeholder="Search by title, client or reference" className={cn(fieldClass, 'w-full pl-11')} />
              </div>
              <label className="sr-only" htmlFor="industry">
                Industry
              </label>
              <select id="industry" name="industry" defaultValue={industry ?? ''} className={fieldClass}>
                <option value="">All industries</option>
                {industries.map((i) => (
                  <option key={i.slug} value={i.slug}>
                    {i.name}
                  </option>
                ))}
              </select>
              <Button type="submit">Apply</Button>
            </form>
          </div>

          <p className="mt-6 text-sm text-muted" aria-live="polite">
            {result.total} {result.total === 1 ? 'result' : 'results'}
          </p>

          {result.docs.length === 0 ? (
            <div className="mt-6 rounded-[4px] border border-dashed border-line p-10 text-center">
              <p className="text-lg font-bold text-heading">No case studies match those filters.</p>
              <Button href="/case-studies" variant="secondary" className="mt-4">
                Reset filters
              </Button>
            </div>
          ) : (
            <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {result.docs.map((c) => (
                <li key={c.slug}>
                  <CaseCard study={c} solutionName={names[c.solution]} industryName={industryNames[c.industries[0]]} />
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
      </Band>

      <HomeCta cta={content.cta} secondaryHref="/sample-reports" tone="dark" />
    </>
  )
}

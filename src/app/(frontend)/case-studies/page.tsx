import { Info, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

import { CaseMetricCard } from '@/components/case-study/parts'
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
  return qs.size ? `/case-studies?${qs}#case-results` : '/case-studies#case-results'
}

const fieldClass = 'min-h-12 rounded-[4px] border border-line bg-card px-4 text-ink'

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
  const { hero } = content
  const names = Object.fromEntries(solutions.map((s) => [s.slug, s.name]))
  const industryNames = Object.fromEntries(industries.map((i) => [i.slug, i.name]))
  // Active filter is solid navy; the others are outlined.
  const chip = (active: boolean) =>
    cn(
      'inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-[4px] border px-4 text-sm font-bold transition-colors',
      active ? 'border-heading bg-heading text-bg' : 'border-line bg-card text-heading hover:border-accent',
    )

  return (
    <>
      <HeroShell>
        <HeroContainer>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:gap-14">
            <div>
              <p className="flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.14em] text-accent">
                <span aria-hidden className="h-px w-8 bg-accent" />
                {hero.eyebrow}
              </p>
              <h1 className="mt-5 text-balance text-[clamp(2.25rem,4.6vw,4.25rem)] font-extrabold leading-[1.04] !tracking-[-0.035em] text-white">
                {hero.title} <span className="text-accent">{hero.accent}</span>
              </h1>
              <p className="mt-5 max-w-[34rem] text-pretty text-[clamp(1rem,1.3vw,1.1875rem)] leading-relaxed text-[#d5dfe9]">{hero.intro}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href="#case-results" className="min-h-12 w-full px-7 sm:w-auto">
                  {hero.primaryLabel}
                </Button>
                <Button href="/sample-reports" tone="navy" variant="secondary" className="min-h-12 w-full px-7 !border-white/30 sm:w-auto">
                  {hero.secondaryLabel}
                </Button>
              </div>
              {hero.disclosure && (
                <p className="mt-7 flex max-w-[34rem] items-start gap-2.5 text-[14px] leading-relaxed text-[#c3d0dd]">
                  <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                  {hero.disclosure}
                </p>
              )}
            </div>

            {hero.image.src && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-line shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)]">
                <Image src={hero.image.src} alt={hero.image.alt} fill priority sizes="(min-width: 1024px) 500px, 92vw" className="object-cover" />
              </div>
            )}
          </div>
        </HeroContainer>
      </HeroShell>

      {/* Filters and results */}
      <Band tone="light" id="case-results" aria-label="Case studies" className="!bg-alt scroll-mt-[var(--header-h)] py-12 sm:py-16 lg:py-20">
        <Container className={WIDE}>
          {/* DECISION: a plain GET form keeps filters in the URL with no client JS. */}
          <div className="rounded-[4px] border border-line bg-card p-4 sm:p-6">
            <nav aria-label="Filter by solution" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
              <Link href={href({ industry, q })} className={chip(!solution)} aria-current={!solution ? 'true' : undefined}>
                All solutions
              </Link>
              {solutions.map((s) => (
                <Link key={s.slug} href={href({ solution: s.slug, industry, q })} className={chip(solution === s.slug)} aria-current={solution === s.slug ? 'true' : undefined}>
                  {s.name}
                </Link>
              ))}
            </nav>

            <form method="get" action="/case-studies#case-results" className="mt-4 flex flex-col gap-3 sm:flex-row">
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
              <select id="industry" name="industry" defaultValue={industry ?? ''} className={cn(fieldClass, 'w-full sm:w-auto')}>
                <option value="">All industries</option>
                {industries.map((i) => (
                  <option key={i.slug} value={i.slug}>
                    {i.name}
                  </option>
                ))}
              </select>
              <Button type="submit" className="min-h-12 w-full sm:w-auto">
                Apply
              </Button>
            </form>
          </div>

          <p className="mb-6 mt-8 text-sm font-semibold text-muted" aria-live="polite">
            {result.total} {result.total === 1 ? 'case study' : 'case studies'}
          </p>

          {result.docs.length === 0 ? (
            <div className="rounded-[4px] border border-dashed border-line bg-card p-10 text-center">
              <p className="text-lg font-bold text-heading">No case studies match those filters.</p>
              <Button href="/case-studies" variant="secondary" className="mt-4">
                Reset filters
              </Button>
            </div>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {result.docs.map((c) => (
                <li key={c.slug}>
                  <CaseMetricCard study={c} solutionName={names[c.solution]} industryName={industryNames[c.industries[0]]} />
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

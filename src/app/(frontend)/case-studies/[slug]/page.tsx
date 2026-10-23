import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { CaseCard, CaseCover, KpiTiles, ResultsChart, Roadmap, StudySection } from '@/components/case-study/parts'
import { Band, WIDE, otherTone, ruleCard, toneAt } from '@/components/ds/band'
import { Callout, Container, DataTable, Disclaimer } from '@/components/ds/primitives'
import { HomeCta } from '@/components/home/HomeCta'
import { getHomePage, getSiteSettings, pageMetadata } from '@/lib/queries/content'
import { getAllCaseStudies, getCaseStudy, getRelatedCaseStudies } from '@/lib/queries/caseStudies'
import { getIndustries } from '@/lib/queries/industries'
import { getSolution, getSolutions } from '@/lib/queries/solutions'
import { cn } from '@/lib/utils'
import { getServerSideURL } from '@/utilities/getURL'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = true

export async function generateStaticParams() {
  return (await getAllCaseStudies()).map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [study, { seo: site }] = await Promise.all([getCaseStudy((await params).slug), getSiteSettings()])
  if (!study) return {}
  return pageMetadata(
    study.seo ?? {},
    { title: study.title, description: `${study.subtitle}. ${study.outcome}`, path: `/case-studies/${study.slug}` },
    { image: study.cover || site.image },
  )
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export default async function CaseStudyPage({ params }: Props) {
  const study = await getCaseStudy((await params).slug)
  if (!study) notFound()

  const [solution, related, solutions, industries, { content: settings }, { content: home }] = await Promise.all([
    getSolution(study.solution),
    getRelatedCaseStudies(study),
    getSolutions(),
    getIndustries(),
    getSiteSettings(),
    getHomePage(),
  ])
  const names = Object.fromEntries(solutions.map((s) => [s.slug, s.name]))
  const industryNames = Object.fromEntries(industries.map((i) => [i.slug, i.name]))
  const totalBenefit = study.benefits?.reduce((sum, b) => sum + b.amountUsdK, 0)

  const url = `${getServerSideURL()}/case-studies/${study.slug}`
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: study.title,
      description: study.subtitle,
      datePublished: study.editionDate,
      author: { '@type': 'Organization', name: 'Pro Solutors' },
      mainEntityOfPage: url,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Case studies', item: `${getServerSideURL()}/case-studies` },
        { '@type': 'ListItem', position: 2, name: study.title, item: url },
      ],
    },
  ]

  // Content blocks are numbered in order and alternate white / navy, so numbering and colours never have gaps.
  const blocks: { id: string; title: string; node: ReactNode }[] = []

  blocks.push({
    id: 'glance',
    title: 'The result at a glance',
    node: (
      <>
        <KpiTiles kpis={study.kpis} />
        <DataTable
          caption="Result at a glance"
          headings={['Item', 'Detail']}
          rows={[
            ['Client', `${study.clientName} (${study.clientDescription})`],
            ['Our solution', solution?.name ?? ''],
            ['Duration', study.duration],
            ['Outcome', study.outcome],
          ]}
        />
        {study.isSample && <p className="text-sm text-muted">All results are fictional and illustrative.</p>}
      </>
    ),
  })

  blocks.push({
    id: 'challenge',
    title: 'The challenge',
    node: (
      <>
        <p className="max-w-3xl text-lg">{study.challengeIntro}</p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {study.symptoms.map((x) => (
            <li key={x.symptom} className={ruleCard}>
              <h3 className="text-lg font-bold text-heading">{x.symptom}</h3>
              <p className="mt-2 text-[15px] text-muted">{x.finding}</p>
            </li>
          ))}
        </ul>
      </>
    ),
  })

  blocks.push({
    id: 'approach',
    title: 'Our approach',
    node: (
      <>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {study.approachSteps.map((a, i) => (
            <li key={a.title} className={ruleCard}>
              <span aria-hidden className="inline-flex size-8 items-center justify-center rounded-[4px] bg-btn text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-3 text-lg font-bold text-heading">{a.title}</h3>
              <p className="mt-1.5 text-[15px] text-muted">{a.description}</p>
            </li>
          ))}
        </ol>
        {study.opportunities && (
          <>
            <h3 className="text-xl font-bold text-heading">The main opportunities, ranked</h3>
            <DataTable
              caption="Ranked opportunities"
              headings={['Opportunity', 'Impact', 'Effort', 'Phase']}
              rows={study.opportunities.map((o) => [o.opportunity, cap(o.impact), cap(o.effort), String(o.phase)])}
            />
          </>
        )}
      </>
    ),
  })

  blocks.push({ id: 'roadmap', title: 'The roadmap', node: <Roadmap phases={study.phases} /> })

  blocks.push({
    id: 'results',
    title: 'The evidence and results',
    node: (
      <>
        <DataTable caption="Results" headings={[...study.resultsHeadings]} rows={study.results.map((r) => [r.measure, r.before, r.after, r.change])} />
        {study.recommendation && <Callout title={study.recommendation.title}>{study.recommendation.text}</Callout>}
        <ResultsChart chart={study.chart} />
      </>
    ),
  })

  if (study.benefits && totalBenefit !== undefined) {
    blocks.push({
      id: 'value',
      title: 'Value delivered (illustrative)',
      node: (
        <>
          <DataTable
            caption="Annual benefit and investment"
            headings={['Annual benefit', 'USD thousands']}
            rows={[
              ...study.benefits.map((b) => [b.label, String(b.amountUsdK)]),
              [<strong key="t">Total annual benefit</strong>, <strong key="tv">{totalBenefit.toLocaleString('en-US')}</strong>],
              ['One-off investment', String(study.investmentUsdK ?? '')],
            ]}
          />
          {study.paybackText && <Callout title="Payback">{study.paybackText}</Callout>}
        </>
      ),
    })
  }

  blocks.push({
    id: 'lessons',
    title: study.lessonsHeading,
    node: (
      <ul className="grid gap-4 md:grid-cols-2">
        {study.whatMadeItWork.map((w) => (
          <li key={w.title} className={ruleCard}>
            <p className="font-bold text-heading">{w.title}</p>
            <p className="mt-1 text-[16px] text-muted">{w.text}</p>
          </li>
        ))}
      </ul>
    ),
  })

  blocks.push({
    id: 'next',
    title: study.recommendation ? 'Conditions to confirm first' : 'What comes next',
    node: (
      <div className="grid gap-10 lg:grid-cols-2">
        <ul className="space-y-3">
          {study.nextSteps.map((x) => (
            <li key={x} className={cn(ruleCard, 'text-[15px]')}>
              {x}
            </li>
          ))}
        </ul>
        <section aria-labelledby="assumptions">
          <h3 id="assumptions" className="text-xl font-bold text-heading">
            Assumptions and limits
          </h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-6 text-[15px] text-muted">
            {study.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          {study.isSample && <Disclaimer className="mt-4">{settings.sampleDisclaimerText}</Disclaimer>}
        </section>
      </div>
    ),
  })

  // The first band after the cover is white, then they alternate. The closing CTA takes the opposite tone of the band before it.
  const bandCount = blocks.length + (related.length > 0 ? 1 : 0)
  const ctaTone = otherTone(toneAt(bandCount - 1))

  return (
    <>
      <CaseCover
        study={study}
        disclaimer={settings.sampleDisclaimerText}
        solutionName={solution?.name ?? ''}
        entryOffer={study.solution === 'solve-and-prove' ? 'Feasibility Proof Report' : 'Case Study'}
        sections={blocks.map(({ id, title }) => ({ id, title }))}
      />

      {blocks.map((b, i) => (
        <StudySection key={b.id} n={i + 1} id={b.id} title={b.title} tone={toneAt(i)}>
          {b.node}
        </StudySection>
      ))}

      {related.length > 0 && (
        <Band tone={toneAt(blocks.length)}>
          <Container className={WIDE}>
            <h2 className="text-[clamp(1.9rem,3.6vw,3rem)] font-extrabold leading-[1.05] text-heading">Related case studies</h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {related.map((c) => (
                <li key={c.slug}>
                  <CaseCard study={c} solutionName={names[c.solution]} industryName={industryNames[c.industries[0]]} />
                </li>
              ))}
            </ul>
          </Container>
        </Band>
      )}

      <HomeCta
        tone={ctaTone}
        cta={
          solution
            ? {
                eyebrow: solution.name,
                title: solution.entryOffer.label,
                body: solution.entryOffer.description,
                primaryLabel: solution.entryOffer.ctaLabel,
                secondaryLabel: 'All case studies',
              }
            : home.cta
        }
        secondaryHref="/case-studies"
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}

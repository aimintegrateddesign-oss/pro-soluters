import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Download } from 'lucide-react'

import { CoverBand, ResultsChart, Roadmap, StudySection } from '@/components/case-study/parts'
import { Button, Callout, Container, DataTable, Disclaimer, Section } from '@/components/ds/primitives'
import { CaseStudyCard, CtaBand, KpiStrip } from '@/components/sections/sections'
import { siteSettings } from '@/data/site'
import { getAllCaseStudies, getCaseStudy, getRelatedCaseStudies } from '@/lib/queries/caseStudies'
import { getSolution, getSolutions } from '@/lib/queries/solutions'
import { getServerSideURL } from '@/utilities/getURL'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = true

export async function generateStaticParams() {
  return (await getAllCaseStudies()).map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = await getCaseStudy((await params).slug)
  if (!study) return {}
  return {
    title: study.title,
    description: `${study.subtitle}. ${study.outcome}`,
    alternates: { canonical: `/case-studies/${study.slug}` },
  }
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export default async function CaseStudyPage({ params }: Props) {
  const study = await getCaseStudy((await params).slug)
  if (!study) notFound()

  const [solution, related, solutions] = await Promise.all([getSolution(study.solution), getRelatedCaseStudies(study), getSolutions()])
  const names = Object.fromEntries(solutions.map((s) => [s.slug, s.name]))
  const totalBenefit = study.benefits?.reduce((sum, b) => sum + b.amountUsdK, 0)

  // Numbered sections are built in order so the numbering never has gaps.
  let n = 0
  const next = () => ++n

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

  return (
    <>
      <CoverBand study={study} eyebrow={`${solution?.name ?? ''} | ${study.solution === 'solve-and-prove' ? 'Feasibility Proof Report' : 'Case Study'}`.toUpperCase()} />

      <Container className="pb-8">
        <figure className="relative mb-4 aspect-video overflow-hidden rounded-card border border-line bg-navy">
          <Image src={study.cover} alt={study.coverAlt} fill priority sizes="(min-width: 1080px) 1040px, 100vw" className="object-cover" />
        </figure>
        {study.pdf && (
          <div className="mb-4 flex justify-end lg:sticky lg:top-24 lg:z-30 lg:float-right lg:mb-0 lg:ml-6">
            <Button href={study.pdf} variant="secondary" data-analytics="download-pdf">
              <Download aria-hidden className="size-4" /> Download PDF
            </Button>
          </div>
        )}

        <StudySection n={next()} id="glance" title="The result at a glance">
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
          <KpiStrip kpis={study.kpis} note={study.isSample ? 'All results are fictional and illustrative.' : undefined} />
        </StudySection>

        <StudySection n={next()} id="challenge" title="The challenge">
          <p className="max-w-3xl">{study.challengeIntro}</p>
          <DataTable caption="Symptoms and findings" headings={['Symptom', 'What we found']} rows={study.symptoms.map((s) => [s.symptom, s.finding])} />
        </StudySection>

        <StudySection n={next()} id="approach" title="Our approach">
          <DataTable caption="Approach steps" headings={['Step', 'What we did']} rows={study.approachSteps.map((s, i) => [`${i + 1}. ${s.title}`, s.description])} />
          {study.opportunities && (
            <>
              <h3 className="type-h3 text-xl">The main opportunities, ranked</h3>
              <DataTable
                caption="Ranked opportunities"
                headings={['Opportunity', 'Impact', 'Effort', 'Phase']}
                rows={study.opportunities.map((o) => [o.opportunity, cap(o.impact), cap(o.effort), String(o.phase)])}
              />
            </>
          )}
        </StudySection>

        <StudySection n={next()} id="roadmap" title="The roadmap">
          <Roadmap phases={study.phases} />
        </StudySection>

        <StudySection n={next()} id="results" title="The evidence and results">
          <DataTable
            caption="Results"
            headings={[...study.resultsHeadings]}
            rows={study.results.map((r) => [r.measure, r.before, r.after, r.change])}
          />
          {study.recommendation && <Callout title={study.recommendation.title}>{study.recommendation.text}</Callout>}
          <ResultsChart chart={study.chart} />
        </StudySection>

        {study.benefits && totalBenefit !== undefined && (
          <StudySection n={next()} id="value" title="Value delivered (illustrative)">
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
          </StudySection>
        )}

        <StudySection n={next()} id="lessons" title={study.lessonsHeading}>
          <ul className="grid gap-4 md:grid-cols-2">
            {study.whatMadeItWork.map((w) => (
              <li key={w.title} className="rounded-card border border-line p-5">
                <p className="font-bold text-heading">{w.title}</p>
                <p className="mt-1 text-[16px] text-muted">{w.text}</p>
              </li>
            ))}
          </ul>
        </StudySection>

        <StudySection n={next()} id="next" title={study.recommendation ? 'Conditions to confirm first' : 'What comes next'}>
          <ul className="list-disc space-y-2 pl-6">
            {study.nextSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </StudySection>

        <section aria-labelledby="assumptions" className="mt-4 border-t border-line pt-8">
          <h2 id="assumptions" className="text-xl font-bold text-accent-strong">
            Assumptions and limits
          </h2>
          <ul className="mt-3 list-disc space-y-1 pl-6 text-[16px]">
            {study.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          {study.isSample && <Disclaimer className="mt-4">{siteSettings.sampleDisclaimerText}</Disclaimer>}
        </section>
      </Container>

      <CtaBand
        title={solution?.entryOffer.label ?? 'Submit a problem'}
        body={solution?.entryOffer.description}
        label={solution?.entryOffer.ctaLabel}
      />

      {related.length > 0 && (
        <Section tone="alt">
          <Container>
            <h2 className="type-h2">Related case studies</h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {related.map((c) => (
                <li key={c.slug}>
                  <CaseStudyCard study={c} solutionName={names[c.solution]} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}

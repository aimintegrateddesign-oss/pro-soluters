import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Button, CheckList, Container, Eyebrow, Section, SectionHead } from '@/components/ds/primitives'
import { CaseStudyCard, CtaBand, PageBand, StepCard, cardClass } from '@/components/sections/sections'
import { getCaseStudiesForSolution } from '@/lib/queries/caseStudies'
import { getSolution, getSolutions } from '@/lib/queries/solutions'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getSolutions()).map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const solution = await getSolution((await params).slug)
  if (!solution) return {}
  return { title: solution.name, description: solution.shortSummary, alternates: { canonical: `/solutions/${solution.slug}` } }
}

export default async function SolutionPage({ params }: Props) {
  const solution = await getSolution((await params).slug)
  if (!solution) notFound()
  const studies = await getCaseStudiesForSolution(solution.slug)

  return (
    <>
      <PageBand eyebrow={solution.eyebrow} title={solution.name} image={{ src: solution.image, alt: solution.imageAlt }}>
        <span className="block max-w-xl lg:max-w-md">{solution.shortSummary}</span>
      </PageBand>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>The problem it solves</Eyebrow>
            <div className="mt-3 space-y-4 text-lg">
              {solution.problemStatement.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <div className={cardClass}>
            <h2 className="type-h3 mb-1">What you get</h2>
            <CheckList items={solution.deliverables} />
          </div>
        </Container>
      </Section>

      <Section tone="alt">
        <Container>
          <SectionHead title="How it works" lead="A fixed-scope approach with a decision-ready result." />
          <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {solution.approachSteps.map((s, i) => (
              <StepCard key={s.title} n={i + 1} title={s.title}>
                {s.description}
              </StepCard>
            ))}
          </div>
        </Container>
      </Section>

      {studies.length > 0 && (
        <Section>
          <Container>
            <SectionHead title="Related case studies" />
            <ul className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
              {studies.map((c) => (
                <li key={c.slug}>
                  <CaseStudyCard study={c} solutionName={solution.name} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <Section tone="tint">
        <Container className="max-w-3xl text-center">
          <h2 className="type-h2">{solution.entryOffer.label}</h2>
          <p className="mx-auto mb-5 mt-2 max-w-xl text-muted">{solution.entryOffer.description}</p>
          <Button href={`/submit-a-problem?solution=${solution.slug}`}>{solution.entryOffer.ctaLabel}</Button>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}

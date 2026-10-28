import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { CaseCard } from '@/components/case-study/parts'
import { Band, SectionTitle, WIDE, otherTone, toneAt, type Tone } from '@/components/ds/band'
import { Container } from '@/components/ds/primitives'
import { HomeCta } from '@/components/home/HomeCta'
import { DeliverableGrid, EntryOfferBand, OtherSolutions, ProblemBlock, SolutionHero, StepLine } from '@/components/solutions/parts'
import { getCaseStudiesForSolution } from '@/lib/queries/caseStudies'
import { getHomePage, getSiteSettings, pageMetadata } from '@/lib/queries/content'
import { getIndustries } from '@/lib/queries/industries'
import { getSolution, getSolutions } from '@/lib/queries/solutions'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getSolutions()).map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [solution, { seo: site }] = await Promise.all([getSolution((await params).slug), getSiteSettings()])
  if (!solution) return {}
  return pageMetadata(
    solution.seo ?? {},
    { title: solution.name, description: solution.shortSummary, path: `/solutions/${solution.slug}` },
    { image: solution.image || site.image },
  )
}

export default async function SolutionPage({ params }: Props) {
  const solution = await getSolution((await params).slug)
  if (!solution) notFound()
  const [studies, solutions, industries, { content: home }] = await Promise.all([
    getCaseStudiesForSolution(solution.slug),
    getSolutions(),
    getIndustries(),
    getHomePage(),
  ])
  const industryNames = Object.fromEntries(industries.map((i) => [i.slug, i.name]))

  // Bands after the hero: white first, then alternating. The case-study band is skipped when there are none,
  // so the colours never double up. The closing CTA takes the opposite tone of the band before it.
  const sections: ((tone: Tone) => ReactNode)[] = [
    (tone) => <ProblemBlock key="problem" tone={tone} statements={solution.problemStatement} />,
    (tone) => <DeliverableGrid key="get" tone={tone} items={solution.deliverables} />,
    (tone) => (
      <StepLine key="how" tone={tone} title="How it works" lead="A fixed-scope approach with a decision-ready result." steps={solution.approachSteps} />
    ),
    ...(studies.length > 0
      ? [
          (tone: Tone) => (
            <Band key="cases" tone={tone} className="py-12 sm:py-14">
              <Container className={WIDE}>
                <SectionTitle>Related case studies</SectionTitle>
                <ul className="mt-8 grid gap-6">
                  {studies.map((c) => (
                    <li key={c.slug}>
                      <CaseCard wide study={c} solutionName={solution.name} industryName={industryNames[c.industries[0]]} />
                    </li>
                  ))}
                </ul>
              </Container>
            </Band>
          ),
        ]
      : []),
    (tone) => <EntryOfferBand key="offer" tone={tone} solution={solution} />,
    (tone) => <OtherSolutions key="others" tone={tone} solutions={solutions.filter((s) => s.slug !== solution.slug)} />,
  ]

  return (
    <>
      <SolutionHero solution={solution} study={studies[0]} />
      {sections.map((render, i) => render(toneAt(i)))}
      <HomeCta tone={otherTone(toneAt(sections.length - 1))} cta={home.cta} secondaryHref="/sample-reports" />
    </>
  )
}

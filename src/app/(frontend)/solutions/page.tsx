import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'

import { CheckList, Container, DataTable, Section, SectionHead } from '@/components/ds/primitives'
import { CtaBand, PageBand, ProcessSteps, cardClass } from '@/components/sections/sections'
import { solutionsPage } from '@/data/site'
import { getSolutions } from '@/lib/queries/solutions'
import { NumberBadge } from '@/components/ds/primitives'

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'Improve and Innovate, Align Your Technical Data, and Solve and Prove: three ways Pro Solutors delivers decision-ready engineering.',
  alternates: { canonical: '/solutions' },
}

export default async function SolutionsPage() {
  const solutions = await getSolutions()
  return (
    <>
      <PageBand eyebrow="Solutions" title="Three solutions, one purpose: decision-ready engineering.">
        Research-led, practical and evidence-based. Choose the one that fits, or combine them.
      </PageBand>

      <Container className="pt-14">
        <div className="relative aspect-[1752/897] overflow-hidden rounded-card border border-line">
          <Image
            src="/images/solutions-banner.webp"
            alt="Practical engineering solutions that solve problems, improve performance and align your data"
            fill
            priority
            sizes="(min-width: 1080px) 1040px, 100vw"
            className="object-cover"
          />
        </div>
      </Container>

      <Section>
        <Container>
          <ul className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <li key={s.slug} className={`${cardClass} flex flex-col`}>
                <NumberBadge className="mb-2.5">{s.order}</NumberBadge>
                <h2 className="mb-1.5 text-[1.5rem] font-bold leading-tight text-heading">{s.name}</h2>
                <p className="text-[15px] text-muted">{s.shortSummary}</p>
                <CheckList items={s.highlights} className="mt-3 flex-1" />
                <p className="mt-3 text-[13px] font-semibold text-accent-strong">Entry offer: {s.entryOffer.label}</p>
                <Link href={`/solutions/${s.slug}`} className="mt-3 text-[15px] font-semibold text-accent-strong hover:underline">
                  Read more about {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="alt">
        <Container>
          <SectionHead title="Which solution fits you?" lead="A quick guide." />
          <DataTable caption="Which solution fits you" headings={['If you say…', 'Start with']} rows={solutionsPage.guide} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead title="How we work" lead="Human-led and confidential. Decisions are made after studying the practical case." />
          <ProcessSteps />
        </Container>
      </Section>

      <CtaBand title="Not sure which solution you need?" body="Start with a free problem review." />
    </>
  )
}

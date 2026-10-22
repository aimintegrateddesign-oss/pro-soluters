import Image from 'next/image'
import type { Metadata } from 'next'

import { Button, CheckList, Container, DataTable, Section, SectionHead } from '@/components/ds/primitives'
import { CtaBand, PageBand, cardClass } from '@/components/sections/sections'
import { sampleReportPage } from '@/data/site'

export const metadata: Metadata = {
  title: 'Sample Report',
  description: 'See what a Pro Solutors feasibility report looks like: an illustrative example for a fictional company.',
  alternates: { canonical: '/sample-reports' },
}

export default function SampleReportPage() {
  return (
    <>
      <PageBand
        eyebrow="Solve and Prove · Sample"
        title="What a feasibility report looks like."
        image={{ src: '/images/feasibility-analysis.webp', alt: 'Feasibility and options analysis comparing three chiller options, with Option C recommended' }}
      >
        <span className="block lg:max-w-[28rem]">
          An illustrative example for a fictional company, so you can see the structure, the evidence and the way we state a recommendation.
        </span>
      </PageBand>

      <Section>
        <Container>
          <div className="mb-[22px] rounded-card border border-accent bg-tint p-[22px]">
            <b>Sample only.</b> Example Contractors Ltd is a fictional company. All figures are illustrative and are not real project data
            or real client results.
          </div>
          <div className="grid gap-7 md:grid-cols-2">
            <div className={cardClass}>
              <h2 className="mb-2 text-[1.5rem] font-bold text-heading">Feasibility Proof Report</h2>
              <p className="text-[15px] text-muted">
                <b className="text-ink">Client:</b> Example Contractors Ltd (fictional mid-size MEP contractor)
                <br />
                <b className="text-ink">Project:</b> Cooling plant replacement, 12,000 m² office building
                <br />
                <b className="text-ink">Decision needed:</b> Which cooling system should we propose and install?
              </p>
            </div>
            <div className={cardClass}>
              <h3 className="type-h3 mb-1.5">1. Summary of recommendation</h3>
              <p className="text-[15px] text-muted">
                Option C (water-cooled chillers with cooling towers) has the lowest 10-year cost, but only if the roof structure check
                passes and water supply is secure. If either fails, Option A is the safer choice.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="alt">
        <Container>
          <SectionHead title="2. Options compared" lead="Illustrative 10-year view (undiscounted, USD thousands)." />
          <DataTable
            caption="Options compared over 10 years"
            headings={['Option', 'Capital', 'Energy / yr', 'Maintenance / yr', '10-year total', 'Main risk']}
            rows={sampleReportPage.options}
          />
          <p className="mt-3.5 max-w-[42rem] text-muted">
            Option C costs about 160 more upfront than Option A but saves about 32 a year in energy. The 10-year gap is small, so the
            conditions below matter more than the headline number.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            <div className={cardClass}>
              <h3 className="type-h3 mb-1.5">3. Conditions to confirm first</h3>
              <CheckList items={sampleReportPage.conditions} />
            </div>
            <div className={cardClass}>
              <h3 className="type-h3 mb-1.5">4. Risks and how to reduce them</h3>
              <CheckList items={sampleReportPage.risks} />
            </div>
            <div className={cardClass}>
              <h3 className="type-h3 mb-1.5">5. Assumptions and limits</h3>
              <CheckList items={sampleReportPage.assumptions} />
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="alt">
        <Container className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative aspect-video overflow-hidden rounded-card border border-line">
            <Image
              src="/images/case-cooling-plant.webp"
              alt="Two engineers reviewing cooling plant options on a laptop, with Option C recommended"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="type-h2">Read the full worked example</h2>
            <p className="mb-5 mt-2 text-muted">
              The complete case study adds the challenge, method, 10-year cost model, sensitivity test and risk register.
            </p>
            <Button href="/case-studies/cooling-plant-replacement-options-study" variant="secondary">
              Open the full case study
            </Button>
          </div>
        </Container>
      </Section>

      <Section tone="tint">
        <Container>
          <h2 className="type-h2">Client feedback</h2>
          <p className="mb-[22px] mt-2 max-w-[42rem] text-muted">
            We are running our first pilot projects. Feedback will be published here only when it is real, in a client’s own words and
            with their written permission.
          </p>
          <Button href="/submit-a-problem">Become a founding client</Button>
        </Container>
      </Section>

      <CtaBand title="Want a report like this for your project?" />
    </>
  )
}

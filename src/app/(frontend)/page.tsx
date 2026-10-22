import type { Metadata } from 'next'

import { Container, Section, SectionHead } from '@/components/ds/primitives'
import { CtaBand, Hero, InfoCard, SolutionsGrid, StepCard } from '@/components/sections/sections'
import { homeContent, siteSettings } from '@/data/site'
import { getSolutions } from '@/lib/queries/solutions'

export const metadata: Metadata = {
  title: { absolute: `Pro Solutors | ${siteSettings.tagline}` },
  alternates: { canonical: '/' },
}

export default async function HomePage() {
  const solutions = await getSolutions()

  return (
    <>
      <Hero image={{ src: '/images/hero.webp', alt: 'Engineer in a hard hat reviewing a 3D building model on a tablet at a rooftop plant' }} />

      <Section>
        <Container>
          <SectionHead title={homeContent.whyTitle} lead={homeContent.whyLead} />
          <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
            {homeContent.why.map((c) => (
              <InfoCard key={c.title} title={c.title}>
                {c.text}
              </InfoCard>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="alt">
        <Container>
          <SectionHead title={homeContent.solutionsTitle} lead={homeContent.solutionsLead} />
          <SolutionsGrid solutions={solutions} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead title={homeContent.pathTitle} lead={homeContent.pathLead} />
          <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
            {homeContent.path.map((c, i) => (
              <StepCard key={c.title} n={i + 1} title={c.title}>
                {c.text}
              </StepCard>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}

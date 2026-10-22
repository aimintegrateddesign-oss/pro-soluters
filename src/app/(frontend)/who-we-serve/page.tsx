import Image from 'next/image'
import type { Metadata } from 'next'

import { CheckList, Container, Section, SectionHead } from '@/components/ds/primitives'
import { CtaBand, InfoCard, PageBand } from '@/components/sections/sections'
import { whoWeServe } from '@/data/site'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Who We Serve & Domains',
  description: 'Pro Solutors serves engineering consultants, contractors, research centres and government institutions across every major engineering discipline.',
  alternates: { canonical: '/who-we-serve' },
  openGraph: { images: [{ url: '/images/og-who-we-serve.jpg', width: 1200, height: 630, alt: 'Who we serve: a mixed team reviewing an engineering analysis' }] },
}

export default function WhoWeServePage() {
  return (
    <>
      <PageBand eyebrow="Who we serve & domains" title="Built for engineering, across every discipline.">
        We work only in engineering, for organisations worldwide.
      </PageBand>

      <Section>
        <Container>
          <div className="relative mb-12 aspect-[1671/941] overflow-hidden rounded-card border border-line">
            <Image
              src="/images/who-we-serve.webp"
              alt="Engineers, managers and clients around a table reviewing an engineering analysis, with five audience groups shown above"
              fill
              priority
              sizes="(min-width: 1080px) 1040px, 100vw"
              className="object-cover"
            />
          </div>
          <SectionHead title="Who we serve" lead="Four audiences, each with a clear starting point." />
          <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-4">
            {whoWeServe.audiences.map((a) => (
              <InfoCard
                key={a.title}
                title={a.title}
                footer={
                  <>
                    {a.lead}
                    <br />
                    {a.start}
                  </>
                }
              >
                {a.text}
              </InfoCard>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="alt">
        <Container>
          <SectionHead title="Engineering domains" lead="Practical support in every major discipline." />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {whoWeServe.domains.map((d) => (
              <li
                key={d.name}
                className={cn(
                  'rounded-[10px] border border-line bg-card px-2.5 py-[18px] text-center font-semibold transition-colors',
                  'hover:border-accent hover:bg-accent hover:text-white [&_small]:hover:text-white',
                )}
              >
                {d.name}
                {d.note && <small className="block text-xs font-normal text-muted">{d.note}</small>}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="tint">
        <Container>
          <h2 className="type-h2">Reassurance for institutional buyers</h2>
          <CheckList items={whoWeServe.reassurance} className="mt-3.5" />
        </Container>
      </Section>

      <CtaBand title="Tell us your discipline and your problem" body="We will tell you honestly whether we can help." />
    </>
  )
}

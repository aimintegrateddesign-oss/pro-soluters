import type { Metadata } from 'next'

import { Button, Container, Section } from '@/components/ds/primitives'
import { PageBand } from '@/components/sections/sections'
import { siteSettings } from '@/data/site'

export const metadata: Metadata = { title: 'Thank you', robots: { index: false } }

export default function ThankYouPage() {
  return (
    <>
      <PageBand eyebrow="Received" title="Thank you. We have your problem.">
        {siteSettings.promiseText}
      </PageBand>
      <Section>
        <Container className="max-w-2xl">
          <p className="text-lg">While you wait, see how we present our work in the sample reports.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/sample-reports">View sample reports</Button>
            <Button href="/" variant="secondary">Back to home</Button>
          </div>
        </Container>
      </Section>
    </>
  )
}

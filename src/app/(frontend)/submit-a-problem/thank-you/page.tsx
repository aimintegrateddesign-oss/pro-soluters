import type { Metadata } from 'next'

import { Button, Container, Section } from '@/components/ds/primitives'
import { PageBand } from '@/components/sections/sections'
import { getSiteSettings, getSubmitPage } from '@/lib/queries/content'

export const metadata: Metadata = { title: 'Thank you', robots: { index: false } }

export default async function ThankYouPage() {
  const [{ content: settings }, { content: submit }] = await Promise.all([getSiteSettings(), getSubmitPage()])
  const { thanks } = submit
  return (
    <>
      <PageBand eyebrow={thanks.eyebrow} title={thanks.title}>
        {settings.promiseText}
      </PageBand>
      <Section>
        <Container className="max-w-2xl">
          <p className="text-lg">{thanks.text}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/sample-reports">View sample reports</Button>
            <Button href="/" variant="secondary">Back to home</Button>
          </div>
        </Container>
      </Section>
    </>
  )
}

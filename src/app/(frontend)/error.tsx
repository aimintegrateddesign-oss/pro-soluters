'use client'

import { Button, Container, Section } from '@/components/ds/primitives'
import { PageBand } from '@/components/sections/sections'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <PageBand eyebrow="Something went wrong" title="We hit an unexpected error" />
      <Section>
        <Container>
          <Button onClick={reset}>Try again</Button>
        </Container>
      </Section>
    </>
  )
}

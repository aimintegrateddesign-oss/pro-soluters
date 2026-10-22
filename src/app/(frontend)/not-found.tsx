import { Button, Container, Section } from '@/components/ds/primitives'
import { PageBand } from '@/components/sections/sections'

export default function NotFound() {
  return (
    <>
      <PageBand eyebrow="404" title="That page could not be found" />
      <Section>
        <Container className="flex flex-wrap gap-3">
          <Button href="/">Go home</Button>
          <Button href="/case-studies" variant="secondary">Browse case studies</Button>
        </Container>
      </Section>
    </>
  )
}

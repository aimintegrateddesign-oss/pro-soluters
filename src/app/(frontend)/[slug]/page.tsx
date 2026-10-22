import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Container, Section } from '@/components/ds/primitives'
import { PageBand } from '@/components/sections/sections'
import { legalPages } from '@/data/site'
import { formatDate } from '@/lib/utils'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = legalPages[(await params).slug]
  return page ? { title: page.title, alternates: { canonical: `/${(await params).slug}` } } : {}
}

export default async function GenericPage({ params }: Props) {
  const page = legalPages[(await params).slug]
  if (!page) notFound()
  return (
    <>
      <PageBand eyebrow="Legal" title={page.title}>
        Last updated {formatDate(page.updated)}.
      </PageBand>
      <Section>
        <Container className="max-w-3xl space-y-8">
          {page.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="type-h3">{s.heading}</h2>
              <p className="mt-2">{s.text}</p>
            </section>
          ))}
        </Container>
      </Section>
    </>
  )
}

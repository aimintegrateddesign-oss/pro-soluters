import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Container, Section } from '@/components/ds/primitives'
import { PageBand } from '@/components/sections/sections'
import { getLegalPages } from '@/lib/queries/content'
import { formatDate } from '@/lib/utils'

type Props = { params: Promise<{ slug: string }> }

// Pages added in Payload appear without a rebuild; unknown slugs 404.
export const dynamicParams = true

async function findPage(slug: string) {
  const { content } = await getLegalPages()
  return content.pages.find((p) => p.slug === slug)
}

export async function generateStaticParams() {
  const { content } = await getLegalPages()
  return content.pages.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug
  const page = await findPage(slug)
  return page ? { title: page.title, alternates: { canonical: `/${slug}` } } : {}
}

export default async function GenericPage({ params }: Props) {
  const page = await findPage((await params).slug)
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

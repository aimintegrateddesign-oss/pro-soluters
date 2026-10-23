import type { Solution as SolutionDoc } from '@/payload-types'
import type { Solution, SolutionSlug } from '@/data/types'
import { getPayloadClient } from '@/lib/payload'
import { readSeo } from '@/lib/content-merge'
import { isOffline } from './offline'

const list = (rows?: { text?: string | null }[] | null) => (rows ?? []).map((r) => r.text ?? '')

export function mapSolution(d: SolutionDoc): Solution {
  return {
    slug: d.slug as SolutionSlug,
    name: d.name,
    eyebrow: d.eyebrow,
    order: d.order,
    shortSummary: d.shortSummary,
    image: d.image,
    imageAlt: d.imageAlt,
    icon: d.icon ?? 'search-check',
    highlights: list(d.highlights),
    problemStatement: list(d.problemStatement),
    approachSteps: (d.approachSteps ?? []).map((s) => ({ title: s.title, description: s.description })),
    deliverables: list(d.deliverables),
    entryOffer: d.entryOffer,
    seo: readSeo(d),
  }
}

export async function getSolutions(): Promise<Solution[]> {
  if (isOffline()) return [...(await import('@/seed/data/solutions')).solutions].sort((a, b) => a.order - b.order)
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'solutions', sort: 'order', limit: 50, depth: 0, pagination: false })
  return docs.map(mapSolution)
}

export async function getSolution(slug: string): Promise<Solution | undefined> {
  if (isOffline()) return (await getSolutions()).find((x) => x.slug === slug)
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'solutions', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  return docs[0] ? mapSolution(docs[0]) : undefined
}

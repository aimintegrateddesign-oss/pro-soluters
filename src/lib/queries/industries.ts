import type { Industry } from '@/data/types'
import { getPayloadClient } from '@/lib/payload'
import { isOffline } from './offline'

export async function getIndustries(): Promise<Industry[]> {
  if (isOffline()) return (await import('@/seed/data/industries')).industries
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'industries', sort: 'name', limit: 100, depth: 0, pagination: false })
  return docs.map((d) => ({ slug: d.slug, name: d.name }))
}

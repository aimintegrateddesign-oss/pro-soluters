import type { MetadataRoute } from 'next'

import { legalPages } from '@/data/site'
import { getAllCaseStudies } from '@/lib/queries/caseStudies'
import { getSolutions } from '@/lib/queries/solutions'
import { getServerSideURL } from '@/utilities/getURL'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getServerSideURL()
  const [solutions, studies] = await Promise.all([getSolutions(), getAllCaseStudies()])
  const paths = [
    '',
    '/solutions',
    '/case-studies',
    '/who-we-serve',
    '/sample-reports',
    '/submit-a-problem',
    ...Object.keys(legalPages).map((s) => `/${s}`),
    ...solutions.map((s) => `/solutions/${s.slug}`),
    ...studies.map((c) => `/case-studies/${c.slug}`),
  ]
  return paths.map((p) => ({ url: `${base}${p}` }))
}

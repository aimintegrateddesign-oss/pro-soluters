import type { MetadataRoute } from 'next'

import { getLegalPages } from '@/lib/queries/content'
import { getAllCaseStudies } from '@/lib/queries/caseStudies'
import { getSolutions } from '@/lib/queries/solutions'
import { getServerSideURL } from '@/utilities/getURL'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getServerSideURL()
  const [solutions, studies, { content: legal }] = await Promise.all([getSolutions(), getAllCaseStudies(), getLegalPages()])
  const paths = [
    '',
    '/solutions',
    '/case-studies',
    '/about',
    '/who-we-serve',
    '/sample-reports',
    '/submit-a-problem',
    ...legal.pages.map((p) => `/${p.slug}`),
    ...solutions.map((s) => `/solutions/${s.slug}`),
    ...studies.map((c) => `/case-studies/${c.slug}`),
  ]
  return paths.map((p) => ({ url: `${base}${p}` }))
}

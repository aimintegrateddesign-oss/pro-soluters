import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })
for (const slug of ['site-settings', 'navigation', 'home-page', 'case-studies-page', 'solutions-page', 'who-we-serve-page', 'sample-report-page', 'submit-page', 'legal-pages'] as const) {
  const d = (await payload.findGlobal({ slug, depth: 0 })) as Record<string, any>
  console.log(slug, 'updatedAt=', d.updatedAt ?? 'NEVER SAVED', '| meta.title=', d.meta?.title ?? '-')
}
const sol = await payload.count({ collection: 'solutions' })
const cs = await payload.count({ collection: 'case-studies' })
console.log('solutions', sol.totalDocs, 'case-studies', cs.totalDocs)
process.exit(0)

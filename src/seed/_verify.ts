import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })
for (const slug of ['site-settings', 'navigation'] as const) {
  const d = (await payload.findGlobal({ slug, depth: 0 })) as Record<string, any>
  console.log(slug, 'updatedAt=', d.updatedAt ?? 'NEVER SAVED', '| meta.title=', d.meta?.title ?? '-')
}
const pg = await payload.find({ collection: 'site-pages', limit: 50, depth: 0, pagination: false })
for (const p of pg.docs) console.log('page', p.pageType, p.slug, 'updatedAt=', p.updatedAt, '| meta.title=', p.meta?.title ?? '-')
const sol = await payload.count({ collection: 'solutions' })
const cs = await payload.count({ collection: 'case-studies' })
console.log('solutions', sol.totalDocs, 'case-studies', cs.totalDocs)
process.exit(0)

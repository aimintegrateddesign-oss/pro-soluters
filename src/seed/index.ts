/**
 * Seed script for Pro Solutors. Idempotent: records are created, or updated in place when their slug already exists, so
 * re-running it refreshes the content without duplicating anything.
 *
 * Run once the database is reachable:
 *   npm run seed
 * Optional env: SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD (creates the first admin user).
 * Page text lives in Payload globals (src/globals). They are filled from src/data/site.ts, but only when a global has
 * never been saved, so re-running never overwrites edits made in the admin. Set SEED_FORCE_GLOBALS=true to reset them.
 *
 * All case-study content is fictional SAMPLE content (see src/seed/data/caseStudies.ts).
 */
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'
import { caseStudies } from './data/caseStudies'
import { industries } from './data/industries'
import { solutions } from './data/solutions'
import { toDoc } from '../lib/content-merge'
import { caseStudiesPage, homePage, legalPages, navigation, sampleReportPage, siteSettings, solutionsPage, submitPage, whoWeServePage } from '../data/site'

// SEO defaults seeded into each page global. Inner-page titles carry the brand suffix themselves because a title set in
// Payload is used exactly as written.
const OG = '/images/og-default.jpg'
const seo = (title: string, description: string, image = OG) => ({ meta: { title, description, image } })
const brand = ' | Pro Solutors'

const globals = [
  ['site-settings', { ...siteSettings, ...seo(`Pro Solutors | ${siteSettings.tagline}`, siteSettings.description) }],
  ['navigation', navigation],
  ['home-page', { ...homePage, ...seo(`Pro Solutors | ${siteSettings.tagline}`, siteSettings.description) }],
  [
    'case-studies-page',
    { ...caseStudiesPage, ...seo(`Case studies${brand}`, 'Sample case studies and feasibility reports showing how Pro Solutors works. All sample content is fictional.') },
  ],
  [
    'solutions-page',
    {
      ...solutionsPage,
      ...seo(`Solutions${brand}`, 'Improve and Innovate, Align Your Technical Data, and Solve and Prove: three ways Pro Solutors delivers decision-ready engineering.', '/images/solutions-banner.webp'),
    },
  ],
  [
    'who-we-serve-page',
    {
      ...whoWeServePage,
      ...seo(
        `Who We Serve & Domains${brand}`,
        'Pro Solutors serves engineering consultants, contractors, research centres and government institutions across every major engineering discipline.',
        '/images/og-who-we-serve.jpg',
      ),
    },
  ],
  [
    'sample-report-page',
    { ...sampleReportPage, ...seo(`Sample Report${brand}`, 'See what a Pro Solutors feasibility report looks like: an illustrative example for a fictional company.') },
  ],
  ['submit-page', { ...submitPage, ...seo(`Submit your problem${brand}`, siteSettings.promiseText) }],
  ['legal-pages', legalPages],
] as const

const rows = <K extends string>(key: K, items: string[]) => items.map((v) => ({ [key]: v }) as Record<K, string>)

async function seed() {
  console.log('[seed] connecting to database...')
  const payload = await getPayload({ config })

  const exists = async (collection: 'solutions' | 'industries' | 'case-studies' | 'users', where: Parameters<typeof payload.find>[0]['where']) =>
    (await payload.find({ collection, where, limit: 1, depth: 0, pagination: false })).docs[0]

  // 1. Admin user
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (email && password) {
    if (await exists('users', { email: { equals: email } })) payload.logger.info(`user ${email}: exists, skipped`)
    else {
      await payload.create({ collection: 'users', data: { email, password, name: 'Admin' } })
      payload.logger.info(`user ${email}: created`)
    }
  } else payload.logger.info('SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set: skipping admin user')

  // 2. Industries
  const industryIds: Record<string, string> = {}
  for (const i of industries) {
    const found = await exists('industries', { slug: { equals: i.slug } })
    industryIds[i.slug] = found ? found.id : (await payload.create({ collection: 'industries', data: i })).id
    payload.logger.info(`industry ${i.slug}: ${found ? 'exists' : 'created'}`)
  }

  // 3. Solutions
  const solutionIds: Record<string, string> = {}
  for (const s of solutions) {
    const data = {
      ...s,
      highlights: rows('text', s.highlights),
      problemStatement: rows('text', s.problemStatement),
      deliverables: rows('text', s.deliverables),
    }
    const found = await exists('solutions', { slug: { equals: s.slug } })
    if (found) {
      await payload.update({ collection: 'solutions', id: found.id, data })
      solutionIds[s.slug] = found.id
      payload.logger.info(`solution ${s.slug}: updated`)
    } else {
      solutionIds[s.slug] = (await payload.create({ collection: 'solutions', data })).id
      payload.logger.info(`solution ${s.slug}: created`)
    }
  }

  // 4. Sample case studies
  for (const c of caseStudies) {
    const data = {
      ...c,
      _status: 'published' as const,
      solution: solutionIds[c.solution],
      industries: c.industries.map((s) => industryIds[s]),
      resultsHeadings: rows('text', c.resultsHeadings),
      chart: {
        ...c.chart,
        labels: rows('text', c.chart.labels),
        values: c.chart.values.map((value) => ({ value })),
      },
      nextSteps: rows('text', c.nextSteps),
      assumptions: rows('text', c.assumptions),
    }
    const found = await exists('case-studies', { slug: { equals: c.slug } })
    if (found) {
      await payload.update({ collection: 'case-studies', id: found.id, data, draft: false })
      payload.logger.info(`case study ${c.slug}: updated`)
    } else {
      await payload.create({ collection: 'case-studies', data, draft: false })
      payload.logger.info(`case study ${c.slug}: created`)
    }
  }

  // 5. Page text and SEO (Payload globals)
  const force = process.env.SEED_FORCE_GLOBALS === 'true'
  for (const [slug, content] of globals) {
    const current = (await payload.findGlobal({ slug, depth: 0 })) as { updatedAt?: string | null }
    if (current.updatedAt && !force) {
      payload.logger.info(`global ${slug}: already has content, skipped (SEED_FORCE_GLOBALS=true to reset)`)
      continue
    }
    await payload.updateGlobal({ slug, data: toDoc(content) as never, depth: 0 })
    payload.logger.info(`global ${slug}: ${current.updatedAt ? 'reset' : 'created'}`)
  }

  payload.logger.info('Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})

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
import { readdirSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'

import config from '../payload.config'
import { caseStudies } from './data/caseStudies'
import { industries } from './data/industries'
import { solutions } from './data/solutions'
import { toDoc } from '../lib/content-merge'
import { aboutPage, caseStudiesPage, homePage, legalPages, navigation, sampleReportPage, siteSettings, solutionsPage, submitPage, whoWeServePage } from '../data/site'

// SEO defaults seeded into each page global. Inner-page titles carry the brand suffix themselves because a title set in
// Payload is used exactly as written.
const OG = '/images/og-default.jpg'
const seo = (title: string, description: string, image = OG) => ({ meta: { title, description, image } })
const brand = ' | Pro Solutors'

const globals = [
  ['site-settings', { ...siteSettings, ...seo(`Pro Solutors | ${siteSettings.tagline}`, siteSettings.description) }],
  ['navigation', navigation],
] as const

// [pageType, slug, title, content, seo]
const pages = [
  ['home', 'home', 'Home', homePage, seo(`Pro Solutors | ${siteSettings.tagline}`, siteSettings.description)],
  [
    'about',
    'about',
    'About Us',
    aboutPage,
    seo(
      'About Pro Solutors | Engineering, Research & Strategic Problem Solving',
      'Learn about Pro Solutors, its founder Zaid Mohiyuddin, multidisciplinary approach, team, philosophy and vision for solving complex engineering and business challenges.',
    ),
  ],
  [
    'caseStudies',
    'case-studies',
    'Case studies',
    caseStudiesPage,
    seo(`Case studies${brand}`, 'Sample case studies and feasibility reports showing how Pro Solutors works. All sample content is fictional.'),
  ],
  [
    'solutions',
    'solutions',
    'Solutions',
    solutionsPage,
    seo('Engineering Solutions | Improve, Align & Solve | Pro Solutors', "Explore Pro Solutors' three engineering solution paths: improve operations and innovation, align technical data, and solve complex challenges through feasibility analysis and evidence-based recommendations.", '/images/solutions-banner.webp'),
  ],
  [
    'whoWeServe',
    'who-we-serve',
    'Who we serve',
    whoWeServePage,
    seo(
      `Who We Serve & Domains${brand}`,
      'Pro Solutors serves engineering consultants, contractors, research centres and government institutions across every major engineering discipline.',
      '/images/og-who-we-serve.jpg',
    ),
  ],
  ['sampleReport', 'sample-report', 'Sample report', sampleReportPage, seo(`Sample Report${brand}`, 'See what a Pro Solutors feasibility report looks like: an illustrative example for a fictional company.')],
  ['submit', 'submit-a-problem', 'Submit your problem', submitPage, seo(`Submit your problem${brand}`, siteSettings.promiseText)],
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

  // 1b. Images: upload public/images into the Media collection (Vercel Blob when BLOB_READ_WRITE_TOKEN is set). Pages,
  // solutions, case studies and SEO fields below point at these records. Alt text is taken from wherever the site defaults
  // describe the image, so the Media records start with proper alt text.
  const defaultAlt: Record<string, string> = {}
  const collectAlt = (v: unknown): void => {
    if (Array.isArray(v)) return v.forEach(collectAlt)
    if (typeof v !== 'object' || v === null) return
    const o = v as Record<string, unknown>
    if (typeof o.src === 'string' && typeof o.alt === 'string') defaultAlt[path.basename(o.src)] = o.alt
    Object.values(o).forEach(collectAlt)
  }
  collectAlt([homePage, solutionsPage, whoWeServePage, sampleReportPage])
  for (const x of solutions) defaultAlt[path.basename(x.image)] ??= x.imageAlt
  for (const x of caseStudies) defaultAlt[path.basename(x.cover)] ??= x.coverAlt

  const imagesDir = path.resolve(process.cwd(), 'public/images')
  const mime: Record<string, string> = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' }
  const mediaIds: Record<string, string> = {}
  for (const file of readdirSync(imagesDir).filter((f) => mime[path.extname(f).toLowerCase()])) {
    const alt = defaultAlt[file] ?? path.basename(file, path.extname(file)).replace(/[-_]+/g, ' ')
    const found = (await payload.find({ collection: 'media', where: { filename: { equals: file } }, limit: 1, depth: 0, pagination: false })).docs[0]
    if (found) {
      if (found.alt !== alt) await payload.update({ collection: 'media', id: found.id, data: { alt }, depth: 0 })
      mediaIds[file] = found.id
      payload.logger.info(`media ${file}: exists`)
      continue
    }
    mediaIds[file] = (await payload.create({ collection: 'media', data: { alt }, filePath: path.join(imagesDir, file), depth: 0 })).id
    payload.logger.info(`media ${file}: uploaded`)
  }
  const mediaId = (src: string) => mediaIds[path.basename(src)]
  // Content with every { src, alt } image replaced by the id of its Media record.
  const mediaize = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(mediaize)
    if (typeof v !== 'object' || v === null) return v
    const o = v as Record<string, unknown>
    if (typeof o.src === 'string' && typeof o.alt === 'string' && Object.keys(o).length === 2) return mediaId(o.src)
    return Object.fromEntries(Object.entries(o).map(([k, x]) => [k, mediaize(x)]))
  }
  // Social share image: the SEO defaults hold a path in meta.image; the field stores a Media id in meta.ogImage.
  const withOg = <T extends { meta?: { image?: string } }>(o: T) => {
    if (!o.meta?.image) return o
    const { image, ...rest } = o.meta
    return { ...o, meta: { ...rest, ogImage: mediaId(image) } }
  }

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
      imageUpload: mediaId(s.image),
      meta: { ogImage: mediaId(s.image) },
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
      coverUpload: mediaId(c.cover),
      meta: { ogImage: mediaId(c.cover) },
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

  // 5. Site settings and navigation (Payload globals)
  const force = process.env.SEED_FORCE_GLOBALS === 'true'
  for (const [slug, content] of globals) {
    const current = (await payload.findGlobal({ slug, depth: 0 })) as { updatedAt?: string | null; meta?: { ogImage?: unknown } }
    if (slug === 'site-settings' && current.updatedAt && !force && !current.meta?.ogImage) {
      await payload.updateGlobal({ slug, data: { meta: { ogImage: mediaId(OG) } } as never, depth: 0 })
      payload.logger.info('global site-settings: share image added')
      continue
    }
    if (current.updatedAt && !force) {
      payload.logger.info(`global ${slug}: already has content, skipped (SEED_FORCE_GLOBALS=true to reset)`)
      continue
    }
    await payload.updateGlobal({ slug, data: toDoc(withOg(content as never)) as never, depth: 0 })
    payload.logger.info(`global ${slug}: ${current.updatedAt ? 'reset' : 'created'}`)
  }

  // 6. Pages (site-pages collection): page text and SEO, then the legal pages
  const forcePages = process.env.SEED_FORCE_PAGES === 'true'
  const upsertPage = async (pageType: string, slug: string, title: string, data: Record<string, unknown>) => {
    const found = (await payload.find({ collection: 'site-pages', where: { slug: { equals: slug } }, limit: 1, depth: 0, pagination: false })).docs[0]
    if (found && !force && !forcePages) return payload.logger.info(`page ${slug}: already exists, skipped (SEED_FORCE_PAGES=true to reset)`)
    const doc = { title, slug, pageType, ...data } as never
    if (found) await payload.update({ collection: 'site-pages', id: found.id, data: doc, depth: 0 })
    else await payload.create({ collection: 'site-pages', data: doc, depth: 0 })
    payload.logger.info(`page ${slug}: ${found ? 'reset' : 'created'}`)
  }
  for (const [pageType, slug, title, content, meta] of pages) await upsertPage(pageType, slug, title, { [pageType]: toDoc(mediaize(content)), ...withOg(meta) })
  for (const p of legalPages.pages) await upsertPage('legal', p.slug, p.title, { legal: toDoc({ updated: p.updated, sections: p.sections }) })

  // 6b. Homepage "About Pro Solutors" section. A home page created before this section existed gets it added here, and
  // nothing else on the page is touched; once the section exists in the database it is never overwritten (edit it in the admin).
  const homeDoc = (await payload.find({ collection: 'site-pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0, pagination: false })).docs[0] as
    | (Record<string, any> & { id: string })
    | undefined
  if (homeDoc && !homeDoc.home?.about?.heading) {
    await payload.update({ collection: 'site-pages', id: homeDoc.id, data: { home: { ...homeDoc.home, about: toDoc(mediaize(homePage.about)) } } as never, depth: 0 })
    payload.logger.info('page home: About section added')
  } else payload.logger.info('page home: About section already present, skipped')

  // 6b2. Redesigned Solutions page. A Solutions page saved with the earlier structure (no "navigator" group) is rewritten once
  // with the new content and SEO; its social share image is kept. A page that already has the new structure is never touched.
  const solutionsDoc = (await payload.find({ collection: 'site-pages', where: { slug: { equals: 'solutions' } }, limit: 1, depth: 0, pagination: false })).docs[0] as
    | (Record<string, any> & { id: string })
    | undefined
  if (solutionsDoc && !solutionsDoc.solutions?.navigator?.items?.length) {
    await payload.update({
      collection: 'site-pages',
      id: solutionsDoc.id,
      data: {
        solutions: toDoc(mediaize(solutionsPage)),
        meta: {
          ...solutionsDoc.meta,
          title: 'Engineering Solutions | Improve, Align & Solve | Pro Solutors',
          description:
            "Explore Pro Solutors' three engineering solution paths: improve operations and innovation, align technical data, and solve complex challenges through feasibility analysis and evidence-based recommendations.",
        },
      } as never,
      depth: 0,
    })
    payload.logger.info('page solutions: redesigned content applied')
  } else payload.logger.info('page solutions: already on the redesigned structure, skipped')

  // 6b3. Photos for the Align and Solve chapters. Added only where the chapter has no image yet, so an image chosen in the admin is kept.
  if (solutionsDoc?.solutions?.navigator?.items?.length) {
    const sol = solutionsDoc.solutions as Record<string, Record<string, unknown>>
    const patch: Record<string, unknown> = {}
    for (const key of ['align', 'solve'] as const) {
      const id = mediaId(solutionsPage[key].image.src)
      if (!sol[key]?.image && id) patch[key] = { ...sol[key], image: id }
    }
    if (Object.keys(patch).length) {
      await payload.update({ collection: 'site-pages', id: solutionsDoc.id, data: { solutions: { ...sol, ...patch } } as never, depth: 0 })
      payload.logger.info(`page solutions: images added for ${Object.keys(patch).join(', ')}`)
    }
  }

  // 6c. "About Us" link in the navigation. A navigation saved before the About page existed gets the link added here (after
  // "Who We Serve" in the header, first in the footer's Company column). Nothing else is touched, and it is added only once.
  const nav = (await payload.findGlobal({ slug: 'navigation', depth: 0 })) as unknown as {
    updatedAt?: string | null
    headerNav?: { label: string; href: string }[]
    footerColumns?: { title: string; links?: { label: string; href: string; muted?: boolean | null; accent?: boolean | null }[] }[]
  }
  const clean = <T extends object>(rows: T[]) => rows.map((r) => Object.fromEntries(Object.entries(r).filter(([k, v]) => k !== 'id' && v !== null)))
  if (nav.updatedAt && nav.headerNav && !nav.headerNav.some((i) => i.href === '/about')) {
    const at = nav.headerNav.findIndex((i) => i.href === '/who-we-serve')
    const headerNav = clean(nav.headerNav)
    headerNav.splice(at >= 0 ? at + 1 : headerNav.length, 0, { label: 'About Us', href: '/about' })
    const footerColumns = (nav.footerColumns ?? []).map((c) => ({
      title: c.title,
      links: clean(c.links ?? []),
    }))
    const company = footerColumns.find((c) => c.title === 'Company')
    if (company && !company.links.some((l) => l.href === '/about')) company.links.unshift({ label: 'About Us', href: '/about' })
    await payload.updateGlobal({ slug: 'navigation', data: { headerNav, footerColumns } as never, depth: 0 })
    payload.logger.info('navigation: About Us link added')
  } else payload.logger.info('navigation: About Us link already present, skipped')

  payload.logger.info('Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})

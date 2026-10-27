import type { Metadata } from 'next'
import { cache } from 'react'

import {
  aboutPage,
  caseStudiesPage,
  homePage,
  legalPages,
  navigation,
  sampleReportPage,
  siteSettings,
  solutionsPage,
  submitPage,
  whoWeServePage,
} from '@/data/site'
import { applyUploadedImages, mergeContent, readSeo, type Seo } from '@/lib/content-merge'
import { getPayloadClient } from '@/lib/payload'
import type { Config } from '@/payload-types'
import { isOffline } from './offline'

type GlobalSlug = keyof Config['globals']
type PageKey = 'home' | 'about' | 'caseStudies' | 'solutions' | 'whoWeServe' | 'sampleReport' | 'submit'

/** Page copy plus its SEO overrides. */
export type Page<T> = { content: T; seo: Seo }

/**
 * Reads one Payload global and merges it over the code defaults. Offline mode, a database error or an empty field all
 * fall back to the defaults, so a page never renders blank. `cache` shares the read between the layout and the page.
 */
function loader<T>(slug: GlobalSlug, defaults: T) {
  return cache(async (): Promise<Page<T>> => {
    if (isOffline()) return { content: defaults, seo: {} }
    try {
      const payload = await getPayloadClient()
      const doc = await payload.findGlobal({ slug, depth: 1 })
      return { content: mergeContent(defaults, doc), seo: readSeo(doc) }
    } catch (err) {
      console.warn(`[content] "${slug}" unavailable, using defaults:`, err instanceof Error ? err.message : err)
      return { content: defaults, seo: {} }
    }
  })
}

/** Same as `loader`, for a page stored as a document of the `site-pages` collection (text in the group named `key`). */
function pageLoader<T>(key: PageKey, defaults: T) {
  return cache(async (): Promise<Page<T>> => {
    if (isOffline()) return { content: defaults, seo: {} }
    try {
      const payload = await getPayloadClient()
      const doc = (await payload.find({ collection: 'site-pages', where: { pageType: { equals: key } }, limit: 1, depth: 1, pagination: false })).docs[0]
      if (!doc) return { content: defaults, seo: {} }
      const text = applyUploadedImages(defaults, (doc as unknown as Record<string, unknown>)[key])
      return { content: mergeContent(defaults, text), seo: readSeo(doc) }
    } catch (err) {
      console.warn(`[content] page "${key}" unavailable, using defaults:`, err instanceof Error ? err.message : err)
      return { content: defaults, seo: {} }
    }
  })
}

export const getSiteSettings = loader('site-settings', siteSettings)
export const getNavigation = loader('navigation', navigation)
export const getHomePage = pageLoader('home', homePage)
export const getAboutPage = pageLoader('about', aboutPage)
export const getCaseStudiesPage = pageLoader('caseStudies', caseStudiesPage)
export const getSolutionsPage = pageLoader('solutions', solutionsPage)
export const getWhoWeServePage = pageLoader('whoWeServe', whoWeServePage)
export const getSampleReportPage = pageLoader('sampleReport', sampleReportPage)
export const getSubmitPage = pageLoader('submit', submitPage)

/** Legal pages are many documents (pageType "legal"); the slug is the URL. No documents means the code defaults. */
export const getLegalPages = cache(async (): Promise<Page<typeof legalPages>> => {
  if (isOffline()) return { content: legalPages, seo: {} }
  try {
    const payload = await getPayloadClient()
    const docs = (await payload.find({ collection: 'site-pages', where: { pageType: { equals: 'legal' } }, limit: 100, depth: 0, pagination: false })).docs
    if (docs.length === 0) return { content: legalPages, seo: {} }
    const pages = docs.map((d) => {
      const legal = ((d as unknown as Record<string, unknown>).legal ?? {}) as { updated?: string | null; sections?: { heading: string; text: string }[] }
      return {
        slug: d.slug,
        title: d.title,
        updated: legal.updated ?? d.updatedAt,
        sections: (legal.sections ?? []).map((s) => ({ heading: s.heading, text: s.text })),
      }
    })
    return { content: { pages }, seo: {} }
  } catch (err) {
    console.warn('[content] legal pages unavailable, using defaults:', err instanceof Error ? err.message : err)
    return { content: legalPages, seo: {} }
  }
})

/**
 * Next.js metadata for a page: SEO fields from Payload win, otherwise the code defaults are used.
 * `site` supplies the default social image.
 */
export function pageMetadata(
  seo: Seo,
  fallback: { title: string; description: string; path: string },
  site?: Seo,
  options: { absoluteTitle?: boolean } = {},
): Metadata {
  const title = seo.title ?? fallback.title
  const description = seo.description ?? fallback.description
  const image = seo.image ?? site?.image
  return {
    title: options.absoluteTitle || seo.title ? { absolute: seo.title ?? title } : title,
    description,
    alternates: { canonical: fallback.path },
    ...(image ? { openGraph: { title, description, images: [{ url: image, width: 1200, height: 630, alt: title }] } } : {}),
  }
}

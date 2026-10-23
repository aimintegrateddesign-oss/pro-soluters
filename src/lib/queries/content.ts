import type { Metadata } from 'next'
import { cache } from 'react'

import {
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
import { mergeContent, readSeo, type Seo } from '@/lib/content-merge'
import { getPayloadClient } from '@/lib/payload'
import type { Config } from '@/payload-types'
import { isOffline } from './offline'

type Slug = keyof Config['globals']

/** Page copy plus its SEO overrides. */
export type Page<T> = { content: T; seo: Seo }

/**
 * Reads one Payload global and merges it over the code defaults. Offline mode, a database error or an empty field all
 * fall back to the defaults, so a page never renders blank. `cache` shares the read between the layout and the page.
 */
function loader<T>(slug: Slug, defaults: T) {
  return cache(async (): Promise<Page<T>> => {
    if (isOffline()) return { content: defaults, seo: {} }
    try {
      const payload = await getPayloadClient()
      const doc = await payload.findGlobal({ slug, depth: 0 })
      return { content: mergeContent(defaults, doc), seo: readSeo(doc) }
    } catch (err) {
      console.warn(`[content] "${slug}" unavailable, using defaults:`, err instanceof Error ? err.message : err)
      return { content: defaults, seo: {} }
    }
  })
}

export const getSiteSettings = loader('site-settings', siteSettings)
export const getNavigation = loader('navigation', navigation)
export const getHomePage = loader('home-page', homePage)
export const getCaseStudiesPage = loader('case-studies-page', caseStudiesPage)
export const getSolutionsPage = loader('solutions-page', solutionsPage)
export const getWhoWeServePage = loader('who-we-serve-page', whoWeServePage)
export const getSampleReportPage = loader('sample-report-page', sampleReportPage)
export const getSubmitPage = loader('submit-page', submitPage)
export const getLegalPages = loader('legal-pages', legalPages)

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

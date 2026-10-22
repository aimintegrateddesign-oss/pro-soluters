import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

// DECISION: pages are static and refreshed on demand (no time-based revalidation). Revalidation
// throws outside a Next.js request (e.g. the seed script), so failures are ignored.
const refresh = (basePath: '/case-studies' | '/solutions' | null, slug?: string) => {
  try {
    revalidatePath('/')
    revalidatePath('/case-studies')
    revalidatePath('/solutions')
    revalidatePath('/sample-reports')
    revalidatePath('/sitemap.xml')
    if (basePath && slug) revalidatePath(`${basePath}/${slug}`)
  } catch {
    /* not running inside Next.js */
  }
}

export const revalidateContent =
  (basePath: '/case-studies' | '/solutions' | null): CollectionAfterChangeHook =>
  ({ doc }) => {
    refresh(basePath, doc?.slug)
    return doc
  }

export const revalidateContentDelete =
  (basePath: '/case-studies' | '/solutions' | null): CollectionAfterDeleteHook =>
  ({ doc }) => {
    refresh(basePath, doc?.slug)
    return doc
  }

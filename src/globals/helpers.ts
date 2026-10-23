import { revalidatePath } from 'next/cache'
import type { Field, GlobalAfterChangeHook, GlobalConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

// Small field builders so each global reads like the page it describes.
export const text = (name: string, label?: string, extra: Record<string, unknown> = {}): Field =>
  ({ name, type: 'text', label: label ?? undefined, ...extra }) as Field

export const area = (name: string, label?: string, extra: Record<string, unknown> = {}): Field =>
  ({ name, type: 'textarea', label: label ?? undefined, ...extra }) as Field

export const flag = (name: string, label?: string): Field => ({ name, type: 'checkbox', label: label ?? undefined, defaultValue: false })

export const group = (name: string, label: string, fields: Field[]): Field => ({ name, type: 'group', label, fields })

/** Repeating rows of fields. */
export const rows = (name: string, label: string, fields: Field[], extra: Record<string, unknown> = {}): Field =>
  ({ name, type: 'array', label, labels: { singular: 'Item', plural: 'Items' }, fields, ...extra }) as Field

/** Repeating list of plain text lines (stored as `{ text }` rows). */
export const lines = (name: string, label: string): Field => rows(name, label, [{ name: 'text', type: 'text', required: true, label: 'Text' }])

/** Heading in two parts (the second is shown in teal) plus an intro, used by most page heroes. */
export const heroGroup = (): Field => group('hero', 'Hero', [text('title', 'Heading (first part)'), text('accent', 'Heading (teal part)'), area('intro', 'Intro')])

export const ctaGroup = (): Field =>
  group('cta', 'Closing call to action', [
    text('eyebrow', 'Small label'),
    text('title', 'Heading'),
    area('body', 'Text'),
    text('primaryLabel', 'Main button label'),
    text('secondaryLabel', 'Second button label'),
  ])

/** SEO fields shared by the page globals and the solutions / case studies collections. Blanks fall back to sensible defaults. */
export const seoGroup = (): Field =>
  group('meta', 'SEO', [
    text('title', 'Meta title', { admin: { description: 'Shown in the browser tab and search results. Aim for 50 to 60 characters.' }, maxLength: 70 }),
    area('description', 'Meta description', { admin: { description: 'Shown under the title in search results. Aim for 120 to 160 characters.' }, maxLength: 200 }),
    text('image', 'Social share image', { admin: { description: 'Path under /public, e.g. /images/og-default.jpg (1200 x 630).' } }),
  ])

// Content changes must reach every page that shows them (nav and footer are on all pages), so refresh the whole site.
const refresh: GlobalAfterChangeHook = ({ doc }) => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    /* not running inside Next.js (e.g. the seed script) */
  }
  return doc
}

export const makeGlobal = ({
  slug,
  label,
  description,
  content,
  seo = true,
}: {
  slug: string
  label: string
  description?: string
  content: Field[]
  seo?: boolean
}): GlobalConfig => ({
  slug,
  label,
  access: { read: anyone, update: authenticated },
  admin: { group: 'Site content', description },
  fields: seo
    ? [
        {
          type: 'tabs',
          tabs: [
            { label: 'Content', fields: content },
            { label: 'SEO', fields: [seoGroup()] },
          ],
        },
      ]
    : content,
  hooks: { afterChange: [refresh] },
})

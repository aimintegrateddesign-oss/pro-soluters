import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig, Field } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { pageDefs } from '../globals'
import { seoGroup, type PageDef } from '../globals/helpers'

// Content changes must reach every page that shows them (nav and footer are on all pages), so refresh the whole site.
const refresh = () => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    /* not running inside Next.js (e.g. the seed script) */
  }
}
const afterChange: CollectionAfterChangeHook = ({ doc }) => {
  refresh()
  return doc
}
const afterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  refresh()
  return doc
}

// DECISION: every page is a document of this collection, so editors see all pages in one list and can add legal pages
// without code. The text of each page type sits in its own group, shown only for that type. The layout stays in code.
// Each page type is a group shown only for that type. Its sections (hero, problems, call to action, ...) are tabs under the
// title, so an editor picks a section and edits it below. Every section keeps its own group, so the stored shape is unchanged.
const sectionTabs = (def: PageDef): Field[] => [
  {
    type: 'tabs',
    tabs: def.content.map((field) => {
      const label = ('label' in field && typeof field.label === 'string' && field.label) || ('name' in field && field.name) || 'Section'
      return { label, fields: [field.type === 'group' ? { ...field, label: false as const } : field] }
    }),
  },
]

const typeFields: Field[] = pageDefs.map((def) => ({
  name: def.key,
  type: 'group',
  label: false,
  admin: { description: def.description, condition: (_, siblingData) => siblingData?.pageType === def.key },
  fields: def.tabs === false ? def.content : sectionTabs(def),
}))

export const SitePages: CollectionConfig = {
  slug: 'site-pages',
  labels: { singular: 'Page', plural: 'Pages' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'pageType', 'slug', 'updatedAt'] },
  hooks: { afterChange: [afterChange], afterDelete: [afterDelete] },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'pageType',
      type: 'select',
      required: true,
      index: true,
      options: pageDefs.map((d) => ({ label: d.label, value: d.key })),
      admin: { position: 'sidebar', description: 'Each page type can exist once, except Legal page.' },
      validate: async (value: string | null | undefined, { req, id }: { req: { payload: { count: Function } }; id?: string | number }) => {
        if (!value) return 'Choose a page type.'
        if (value === 'legal') return true
        const { totalDocs } = await req.payload.count({
          collection: 'site-pages',
          where: { and: [{ pageType: { equals: value } }, ...(id ? [{ id: { not_equals: id } }] : [])] },
          req,
        })
        return totalDocs > 0 ? 'This page already exists. Edit the existing one instead.' : true
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Lowercase, no spaces. For a legal page this is the URL, e.g. privacy gives /privacy.' },
    },
    ...typeFields,
    seoGroup(),
  ],
}

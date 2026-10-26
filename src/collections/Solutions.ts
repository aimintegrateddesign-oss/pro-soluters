import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { seoGroup } from '../globals/helpers'
import { revalidateContent, revalidateContentDelete } from '../hooks/revalidateContent'

// DECISION: images are stored as public-folder paths (text) rather than Media uploads, so the
// collection and the local test data have the same shape and no object storage is needed yet.
export const Solutions: CollectionConfig = {
  slug: 'solutions',
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'order', 'updatedAt'] },
  hooks: { afterChange: [revalidateContent('/solutions')], afterDelete: [revalidateContentDelete('/solutions')] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'eyebrow', type: 'text', required: true },
    { name: 'order', type: 'number', required: true, defaultValue: 1 },
    { name: 'shortSummary', type: 'textarea', required: true },
    { name: 'imageUpload', type: 'upload', relationTo: 'media', label: 'Image (upload)', admin: { description: 'Used on the site when set. Its alt text comes from the Media record unless you fill the alt below.' } },
    { name: 'image', type: 'text', label: 'Image path (fallback)', admin: { description: 'Path under /public, e.g. /images/feasibility-analysis.webp. Used only when no image is uploaded.' } },
    { name: 'imageAlt', type: 'text', label: 'Image alt text (optional with an upload)' },
    {
      name: 'icon',
      type: 'select',
      defaultValue: 'search-check',
      options: ['search-check', 'trending-up', 'database'],
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Highlights (short checklist for overview cards)',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'problemStatement',
      type: 'array',
      label: 'Problem statement (paragraphs)',
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    {
      name: 'approachSteps',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    { name: 'deliverables', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    {
      name: 'entryOffer',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'ctaLabel', type: 'text', required: true },
      ],
    },
    seoGroup(),
  ],
}

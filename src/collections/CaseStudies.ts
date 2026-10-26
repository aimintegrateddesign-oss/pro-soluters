import type { CollectionConfig, Field } from 'payload'

import { authenticated } from '../access/authenticated'
import { seoGroup } from '../globals/helpers'
import { revalidateContent, revalidateContentDelete } from '../hooks/revalidateContent'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'

const level = (name: string): Field => ({
  name,
  type: 'select',
  required: true,
  options: ['low', 'medium', 'high'],
})

// DECISION: cover/pdf are text paths for now (see Solutions.ts). Brief and chart arrays of scalars
// are stored as `{ text }` / `{ value }` rows because Payload arrays hold objects.
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  access: { read: authenticatedOrPublished, create: authenticated, update: authenticated, delete: authenticated },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'solution', 'isSample', '_status', 'updatedAt'] },
  hooks: { afterChange: [revalidateContent('/case-studies')], afterDelete: [revalidateContentDelete('/case-studies')] },
  versions: { maxPerDoc: 20, drafts: { autosave: { interval: 800 } } },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basics',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'slug', type: 'text', required: true, unique: true, index: true },
            { name: 'subtitle', type: 'text' },
            { name: 'solution', type: 'relationship', relationTo: 'solutions', required: true },
            { name: 'industries', type: 'relationship', relationTo: 'industries', hasMany: true },
            {
              name: 'referenceCode',
              type: 'text',
              required: true,
              validate: (v: unknown) => (typeof v === 'string' && /^PS-[A-Z0-9]+-\d{3}$/.test(v)) || 'Use the format PS-SAMPLE-001',
            },
            { name: 'editionDate', type: 'date' },
            { name: 'clientName', type: 'text' },
            { name: 'clientDescription', type: 'text' },
            { name: 'isSample', type: 'checkbox', defaultValue: true },
            { name: 'featured', type: 'checkbox', defaultValue: false },
            { name: 'coverUpload', type: 'upload', relationTo: 'media', label: 'Cover (upload)', admin: { description: 'Used on the site when set.' } },
            { name: 'cover', type: 'text', label: 'Cover path (fallback)', admin: { description: 'Path under /public. Used only when no cover is uploaded.' } },
            { name: 'coverAlt', type: 'text', label: 'Cover alt text (optional with an upload)' },
            {
              // Filled by the public "Share your case study" form. Those entries are saved as drafts,
              // so nothing appears on the site until an editor completes and publishes it.
              name: 'submission',
              type: 'group',
              label: 'Submitted via website form',
              admin: { description: 'Set only for case studies sent in through the public form.' },
              fields: [
                { name: 'userSubmitted', type: 'checkbox', defaultValue: false },
                { name: 'submitterName', type: 'text' },
                { name: 'submitterEmail', type: 'email' },
                { name: 'organisation', type: 'text' },
                { name: 'ipHash', type: 'text', index: true, admin: { hidden: true } },
              ],
            },
          ],
        },
        {
          label: 'At a glance',
          fields: [
            { name: 'duration', type: 'text' },
            { name: 'outcome', type: 'textarea' },
            {
              name: 'kpis',
              type: 'array',
              minRows: 4,
              maxRows: 4,
              fields: [
                { name: 'value', type: 'text', required: true },
                { name: 'caption', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Challenge',
          fields: [
            { name: 'challengeIntro', type: 'textarea' },
            {
              name: 'symptoms',
              type: 'array',
              fields: [
                { name: 'symptom', type: 'text', required: true },
                { name: 'finding', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'Approach',
          fields: [
            {
              name: 'approachSteps',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
              ],
            },
            {
              name: 'opportunities',
              type: 'array',
              fields: [
                { name: 'opportunity', type: 'text', required: true },
                level('impact'),
                level('effort'),
                { name: 'phase', type: 'number', required: true },
              ],
            },
          ],
        },
        {
          label: 'Roadmap',
          fields: [
            {
              name: 'phases',
              type: 'array',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'when', type: 'text', required: true },
                { name: 'focus', type: 'text', required: true },
                { name: 'goal', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Results',
          fields: [
            {
              name: 'resultsHeadings',
              type: 'array',
              minRows: 4,
              maxRows: 4,
              admin: { description: 'Column headings for the results table (4).' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'results',
              type: 'array',
              fields: [
                { name: 'measure', type: 'text', required: true },
                { name: 'before', type: 'text' },
                { name: 'after', type: 'text' },
                { name: 'change', type: 'text' },
              ],
            },
            {
              name: 'recommendation',
              type: 'group',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'text', type: 'textarea' },
              ],
            },
            {
              name: 'chart',
              type: 'group',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'type', type: 'select', defaultValue: 'bar', options: ['line', 'bar'] },
                { name: 'unit', type: 'text' },
                { name: 'labels', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
                { name: 'values', type: 'array', fields: [{ name: 'value', type: 'number', required: true }] },
                { name: 'caption', type: 'textarea' },
              ],
              validate: (v: unknown) => {
                const c = v as { labels?: unknown[]; values?: unknown[] } | undefined
                return (c?.labels?.length ?? 0) === (c?.values?.length ?? 0) || 'Chart labels and values must be the same length.'
              },
            },
          ],
        },
        {
          label: 'Value',
          fields: [
            {
              name: 'benefits',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'amountUsdK', type: 'number', required: true },
              ],
            },
            { name: 'investmentUsdK', type: 'number' },
            { name: 'paybackText', type: 'textarea' },
          ],
        },
        {
          label: 'Closing',
          fields: [
            { name: 'lessonsHeading', type: 'text', defaultValue: 'What made it work' },
            {
              name: 'whatMadeItWork',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea', required: true },
              ],
            },
            { name: 'nextSteps', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
            { name: 'assumptions', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
            { name: 'pdf', type: 'text', admin: { description: 'Path or URL of the public PDF' } },
          ],
        },
        { label: 'SEO', fields: [seoGroup()] },
      ],
    },
  ],
}

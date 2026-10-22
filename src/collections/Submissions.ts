import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { DISCIPLINES, ORG_TYPES, URGENCIES } from '../lib/validation/submission'

const toOptions = (list: readonly { value: string; label: string }[]) => list.map((o) => ({ label: o.label, value: o.value }))

// Create is server-only: the Server Action uses the Local API with overrideAccess.
export const Submissions: CollectionConfig = {
  slug: 'submissions',
  access: { read: authenticated, update: authenticated, delete: authenticated, create: () => false },
  admin: { useAsTitle: 'company', defaultColumns: ['name', 'company', 'solution', 'urgency', 'status', 'createdAt'] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'company', type: 'text', required: true, label: 'Organisation' },
    { name: 'email', type: 'email', required: true },
    { name: 'country', type: 'text', required: true },
    { name: 'orgType', type: 'select', required: true, label: 'Organisation type', options: toOptions(ORG_TYPES) },
    { name: 'discipline', type: 'select', required: true, label: 'Engineering discipline', options: toOptions(DISCIPLINES) },
    { name: 'solution', type: 'relationship', relationTo: 'solutions', label: 'Solution of interest' },
    { name: 'description', type: 'textarea', required: true },
    { name: 'urgency', type: 'select', required: true, options: toOptions(URGENCIES) },
    { name: 'consent', type: 'checkbox', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In review', value: 'in-review' },
        { label: 'Replied', value: 'replied' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'internalNotes', type: 'textarea', admin: { position: 'sidebar' } },
    { name: 'ipHash', type: 'text', index: true, admin: { hidden: true } },
    { name: 'userAgent', type: 'text', admin: { hidden: true } },
  ],
}

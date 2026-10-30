import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const refreshCountryOptions = (skip: boolean) => {
  if (skip) return
  try {
    revalidatePath('/submit-a-problem')
  } catch {
    // The country-only seed also runs outside a Next.js request.
  }
}

export const Countries: CollectionConfig = {
  slug: 'countries',
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'code'], group: 'Site content' },
  hooks: {
    afterChange: [({ doc, req }) => { refreshCountryOptions(Boolean(req.context?.disableRevalidate)); return doc }],
    afterDelete: [({ doc, req }) => { refreshCountryOptions(Boolean(req.context?.disableRevalidate)); return doc }],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      maxLength: 80,
      hooks: { beforeValidate: [({ value }) => typeof value === 'string' ? value.trim() : value] },
    },
    {
      name: 'code',
      label: 'Country code',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      minLength: 2,
      maxLength: 2,
      admin: { description: 'Two-letter country code, e.g. AU or PK.' },
      hooks: { beforeValidate: [({ value }) => typeof value === 'string' ? value.trim().toUpperCase() : value] },
      validate: (value: unknown) => (typeof value === 'string' && /^[A-Z]{2}$/.test(value)) || 'Use a two-letter country code, such as AU or PK.',
    },
  ],
}

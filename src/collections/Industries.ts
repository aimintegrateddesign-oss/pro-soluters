import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { revalidateContent, revalidateContentDelete } from '../hooks/revalidateContent'

export const Industries: CollectionConfig = {
  slug: 'industries',
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  admin: { useAsTitle: 'name' },
  hooks: { afterChange: [revalidateContent(null)], afterDelete: [revalidateContentDelete(null)] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
  ],
}

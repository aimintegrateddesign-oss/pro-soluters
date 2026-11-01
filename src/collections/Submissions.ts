import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { sendSubmissionEmails } from '../lib/email/sendSubmissionEmails'
import { DISCIPLINES, ORG_TYPES, URGENCIES } from '../lib/validation/submission'

const toOptions = (list: readonly { value: string; label: string }[]) => list.map((o) => ({ label: o.label, value: o.value }))

// Create is server-only: the Server Action uses the Local API with overrideAccess.
export const Submissions: CollectionConfig = {
  slug: 'submissions',
  access: { read: authenticated, update: authenticated, delete: authenticated, create: () => false },
  admin: { useAsTitle: 'company', defaultColumns: ['name', 'company', 'solution', 'urgency', 'status', 'createdAt'] },
  hooks: {
    // Emails go out after the submission is saved; a failure is recorded on the document and never blocks saving.
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc
        try {
          const solutionId = typeof doc.solution === 'object' && doc.solution ? doc.solution.id : doc.solution
          const solution = solutionId
            ? (await req.payload.findByID({ collection: 'solutions', id: solutionId, depth: 0, req })).name
            : null
          const result = await sendSubmissionEmails({ ...doc, solution }, String(doc.id))
          if (result.error) console.error('[submissions] email failed', result.error)
          await req.payload.update({
            collection: 'submissions',
            id: doc.id,
            req,
            data: { notifySentAt: result.notifiedAt, confirmationSentAt: result.confirmedAt, emailError: result.error },
          })
        } catch (err) {
          console.error('[submissions] email hook crashed', err)
        }
        return doc
      },
    ],
  },
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
    { name: 'notifySentAt', type: 'date', label: 'Team notified at', admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'confirmationSentAt', type: 'date', label: 'Thank-you sent at', admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'emailError', type: 'textarea', label: 'Email error', admin: { position: 'sidebar', readOnly: true, description: 'Set when an email failed to send. The submission itself is still saved.' } },
    { name: 'ipHash', type: 'text', index: true, admin: { hidden: true } },
    { name: 'userAgent', type: 'text', admin: { hidden: true } },
  ],
}

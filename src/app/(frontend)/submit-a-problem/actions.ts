'use server'

import { createHash } from 'node:crypto'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { findCountryByName } from '@/data/countries'
import { getPayloadClient } from '@/lib/payload'
import { getCountries } from '@/lib/queries/countries'
import { validateSubmission, type FieldErrors, type SubmissionFields } from '@/lib/validation/submission'

export type SubmitState = { ok: false; fieldErrors: FieldErrors; formError?: string; values?: Partial<SubmissionFields> } | null

const text = (fd: FormData, key: string) => String(fd.get(key) ?? '')
const MAX_PER_HOUR = 5

export async function submitProblem(_prev: SubmitState, fd: FormData): Promise<SubmitState> {
  // Honeypot: bots fill the hidden field. Pretend success so they learn nothing.
  if (text(fd, 'website')) redirect('/submit-a-problem/thank-you')

  const values: SubmissionFields = {
    name: text(fd, 'name'),
    company: text(fd, 'company'),
    email: text(fd, 'email'),
    country: text(fd, 'country'),
    orgType: text(fd, 'orgType'),
    discipline: text(fd, 'discipline'),
    solution: text(fd, 'solution'),
    urgency: text(fd, 'urgency'),
    description: text(fd, 'description'),
    consent: fd.get('consent') === 'on',
  }

  const countries = await getCountries()
  const country = findCountryByName(values.country, countries)
  if (country) values.country = country.name
  const fieldErrors = validateSubmission(values, countries)
  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors, values }

  try {
    const payload = await getPayloadClient()
    const h = await headers()
    const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    // DECISION: the IP is stored only as a salted hash, used for the hourly rate limit.
    const ipHash = createHash('sha256').update(`${process.env.IP_HASH_SALT ?? process.env.PAYLOAD_SECRET}:${ip}`).digest('hex')

    const recent = await payload.count({
      collection: 'submissions',
      where: { and: [{ ipHash: { equals: ipHash } }, { createdAt: { greater_than: new Date(Date.now() - 3_600_000).toISOString() } }] },
    })
    if (recent.totalDocs >= MAX_PER_HOUR) {
      return { ok: false, fieldErrors: {}, formError: 'Too many submissions from your network. Please try again later.', values }
    }

    const solution = values.solution === 'not-sure'
      ? undefined
      : (await payload.find({ collection: 'solutions', where: { slug: { equals: values.solution } }, limit: 1, depth: 0 })).docs[0]?.id

    await payload.create({
      collection: 'submissions',
      overrideAccess: true, // create is server-only; this action is the only caller
      data: {
        name: values.name.trim(),
        company: values.company.trim(),
        email: values.email.trim(),
        country: values.country.trim(),
        orgType: values.orgType as 'consultant',
        discipline: values.discipline as 'civil',
        urgency: values.urgency as 'exploring',
        description: values.description.trim(),
        consent: true,
        solution,
        ipHash,
        userAgent: h.get('user-agent') ?? undefined,
      },
    })
  } catch (err) {
    console.error('[submit-a-problem] failed to save submission', err)
    return { ok: false, fieldErrors: {}, formError: 'We could not send your submission. Please try again, or email us directly.', values }
  }

  redirect('/submit-a-problem/thank-you')
}

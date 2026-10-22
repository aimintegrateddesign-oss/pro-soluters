'use server'

import { createHash, randomBytes } from 'node:crypto'
import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/payload'
import { validateCaseStudy, type CaseStudyErrors, type CaseStudyFields } from '@/lib/validation/caseStudySubmission'

export type CaseStudyState =
  | { ok: true }
  | { ok: false; fieldErrors: CaseStudyErrors; formError?: string; values?: Partial<CaseStudyFields> }
  | null

const text = (fd: FormData, key: string) => String(fd.get(key) ?? '')
const MAX_PER_HOUR = 3

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'case-study'

export async function submitCaseStudy(_prev: CaseStudyState, fd: FormData): Promise<CaseStudyState> {
  // Honeypot: bots fill the hidden field. Pretend success so they learn nothing.
  if (text(fd, 'website')) return { ok: true }

  const values: CaseStudyFields = {
    title: text(fd, 'title'),
    solution: text(fd, 'solution'),
    industry: text(fd, 'industry'),
    organisation: text(fd, 'organisation'),
    summary: text(fd, 'summary'),
    challenge: text(fd, 'challenge'),
    approach: text(fd, 'approach'),
    results: text(fd, 'results'),
    name: text(fd, 'name'),
    email: text(fd, 'email'),
    consent: fd.get('consent') === 'on',
  }

  try {
    const payload = await getPayloadClient()
    const solutions = await payload.find({ collection: 'solutions', limit: 20, depth: 0, pagination: false })
    const solutionBySlug = new Map(solutions.docs.map((d) => [d.slug, d.id]))

    const fieldErrors = validateCaseStudy(values, [...solutionBySlug.keys()])
    if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors, values }

    const h = await headers()
    const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    // DECISION: the IP is kept only as a salted hash, for the hourly rate limit.
    const ipHash = createHash('sha256').update(`${process.env.IP_HASH_SALT ?? process.env.PAYLOAD_SECRET}:${ip}`).digest('hex')
    const recent = await payload.count({
      collection: 'case-studies',
      where: {
        and: [
          { 'submission.ipHash': { equals: ipHash } },
          { createdAt: { greater_than: new Date(Date.now() - 3_600_000).toISOString() } },
        ],
      },
    })
    if (recent.totalDocs >= MAX_PER_HOUR) {
      return { ok: false, fieldErrors: {}, formError: 'Too many submissions from your network. Please try again later.', values }
    }

    const industry = values.industry
      ? (await payload.find({ collection: 'industries', where: { slug: { equals: values.industry } }, limit: 1, depth: 0 })).docs[0]?.id
      : undefined

    // DECISION: saved as an unpublished DRAFT (never published) so an editor reviews and completes it
    // (KPIs, cover, reference code) in /admin first. Public queries only return published documents.
    await payload.create({
      collection: 'case-studies',
      draft: true,
      overrideAccess: true, // creating is restricted to editors; this action is the only public path
      data: {
        title: values.title.trim(),
        slug: `${slugify(values.title)}-${randomBytes(3).toString('hex')}`,
        subtitle: values.summary.trim(),
        solution: solutionBySlug.get(values.solution)!,
        industries: industry ? [industry] : [],
        referenceCode: 'PS-PENDING-000',
        clientName: values.organisation.trim(),
        isSample: false,
        featured: false,
        challengeIntro: values.challenge.trim(),
        approachSteps: [{ title: 'What was done', description: values.approach.trim() }],
        outcome: values.results.trim(),
        submission: {
          userSubmitted: true,
          submitterName: values.name.trim(),
          submitterEmail: values.email.trim(),
          organisation: values.organisation.trim(),
          ipHash,
        },
      },
    })
    return { ok: true }
  } catch (err) {
    console.error('[submit-case-study] failed to save', err)
    return { ok: false, fieldErrors: {}, formError: 'We could not send your case study. Please try again, or email us directly.', values }
  }
}

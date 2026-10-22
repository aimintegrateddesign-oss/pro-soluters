// Shared by the client form and the server action; the server is the source of truth.

export type CaseStudyFields = {
  title: string
  solution: string
  industry: string
  organisation: string
  summary: string
  challenge: string
  approach: string
  results: string
  name: string
  email: string
  consent: boolean
}

export type CaseStudyErrors = Partial<Record<keyof CaseStudyFields, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateCaseStudy(v: CaseStudyFields, validSolutions: string[]): CaseStudyErrors {
  const e: CaseStudyErrors = {}
  if (v.title.trim().length < 5) e.title = 'Give the case study a title (at least 5 characters).'
  if (!validSolutions.includes(v.solution)) e.solution = 'Choose the solution it relates to.'
  if (v.organisation.trim().length < 2) e.organisation = 'Enter the organisation or client.'
  if (v.summary.trim().length < 20) e.summary = 'Add a one or two sentence summary (at least 20 characters).'
  if (v.summary.length > 300) e.summary = 'Keep the summary under 300 characters.'
  if (v.challenge.trim().length < 30) e.challenge = 'Describe the challenge in at least 30 characters.'
  if (v.approach.trim().length < 30) e.approach = 'Describe what was done in at least 30 characters.'
  if (v.results.trim().length < 20) e.results = 'Describe the results in at least 20 characters.'
  for (const k of ['challenge', 'approach', 'results'] as const) {
    if (v[k].length > 3000) e[k] = 'Keep this under 3,000 characters.'
  }
  if (v.name.trim().length < 2) e.name = 'Enter your name.'
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter a valid email address.'
  if (!v.consent) e.consent = 'Please confirm you have the right to share this case study.'
  return e
}

// DECISION: hand-written validator (no zod dependency). It is imported by both the client form
// and the server action, so the rules live in one place; the server is the source of truth.

export const ORG_TYPES = [
  { value: 'consultant', label: 'Consultant' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'research', label: 'Research centre' },
  { value: 'government', label: 'Government or public institution' },
  { value: 'other', label: 'Other' },
] as const

export const DISCIPLINES = [
  { value: 'civil', label: 'Civil' },
  { value: 'mechanical', label: 'Mechanical' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'mep', label: 'MEP' },
  { value: 'mechatronics', label: 'Mechatronics' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'other', label: 'Other' },
] as const

export const URGENCIES = [
  { value: 'exploring', label: 'Exploring' },
  { value: 'three-months', label: 'Within 3 months' },
  { value: 'urgent', label: 'Urgent' },
] as const

export const SOLUTION_OPTIONS = [
  { value: 'not-sure', label: 'Not sure' },
  { value: 'improve-and-innovate', label: 'Improve and Innovate' },
  { value: 'align-your-technical-data', label: 'Align Your Technical Data' },
  { value: 'solve-and-prove', label: 'Solve and Prove' },
] as const

export const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'xlsx', 'csv', 'dwg', 'png', 'jpg', 'jpeg']
export const MAX_FILE_BYTES = 20 * 1024 * 1024
export const MAX_FILES = 5

export type SubmissionFields = {
  name: string
  company: string
  email: string
  country: string
  orgType: string
  discipline: string
  solution: string
  urgency: string
  description: string
  consent: boolean
}

export type FieldErrors = Partial<Record<keyof SubmissionFields | 'files', string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateSubmission(v: SubmissionFields): FieldErrors {
  const e: FieldErrors = {}
  if (v.name.trim().length < 2) e.name = 'Enter your full name.'
  if (v.company.trim().length < 2) e.company = 'Enter your organisation.'
  if (v.country.trim().length < 2) e.country = 'Enter your country.'
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter a valid email address.'
  if (!ORG_TYPES.some((o) => o.value === v.orgType)) e.orgType = 'Choose an organisation type.'
  if (!DISCIPLINES.some((o) => o.value === v.discipline)) e.discipline = 'Choose a discipline.'
  if (!SOLUTION_OPTIONS.some((o) => o.value === v.solution)) e.solution = 'Choose a solution.'
  if (!URGENCIES.some((o) => o.value === v.urgency)) e.urgency = 'Choose an urgency.'
  if (v.description.trim().length < 30) e.description = 'Please describe your problem in at least 30 characters.'
  if (v.description.length > 5000) e.description = 'Keep the description under 5,000 characters.'
  if (!v.consent) e.consent = 'Please agree so we can contact you about this submission.'
  return e
}

export function validateFile(file: { name: string; size: number }): string | null {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED_EXTENSIONS.includes(ext)) return `${file.name}: file type not allowed.`
  if (file.size > MAX_FILE_BYTES) return `${file.name}: larger than 20 MB.`
  return null
}

'use client'

import { useActionState, useRef, useState, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

import { submitProblem, type SubmitState } from '@/app/(frontend)/submit-a-problem/actions'
import { Button } from '@/components/ds/primitives'
import {
  DISCIPLINES,
  ORG_TYPES,
  SOLUTION_OPTIONS,
  URGENCIES,
  validateSubmission,
  type FieldErrors,
  type SubmissionFields,
} from '@/lib/validation/submission'
import { cn } from '@/lib/utils'

const inputClass = (invalid: boolean) =>
  cn('w-full rounded-lg border bg-card px-3 py-[11px] text-ink', invalid ? 'border-red-600' : 'border-line')

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="mt-3.5">
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-sm text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

const options = (list: readonly { value: string; label: string }[]) =>
  list.map((o) => (
    <option key={o.value} value={o.value}>
      {o.label}
    </option>
  ))

export function SubmitProblemForm({ defaultSolution }: { defaultSolution: string }) {
  const [state, action, pending] = useActionState<SubmitState, FormData>(submitProblem, null)
  const [blurErrors, setBlurErrors] = useState<FieldErrors>({})
  const formRef = useRef<HTMLFormElement>(null)

  const errors: FieldErrors = { ...blurErrors, ...state?.fieldErrors }
  const v = state?.values

  const readValues = (): SubmissionFields => {
    const fd = new FormData(formRef.current!)
    const t = (k: string) => String(fd.get(k) ?? '')
    return {
      name: t('name'), company: t('company'), email: t('email'), country: t('country'), orgType: t('orgType'),
      discipline: t('discipline'), solution: t('solution'), urgency: t('urgency'), description: t('description'), consent: fd.get('consent') === 'on',
    }
  }

  // Inline validation on blur: only the blurred field's message is set or cleared.
  const onBlur = (field: keyof SubmissionFields) => () => {
    const msg = validateSubmission(readValues())[field]
    setBlurErrors((prev) => ({ ...prev, [field]: msg }))
  }

  const errorList = Object.entries(errors).filter(([, m]) => m)
  const fp = (k: keyof SubmissionFields) => ({
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `${k}-error` : undefined,
    onBlur: onBlur(k),
  })

  return (
    <form ref={formRef} action={action} noValidate>
      <div role="alert" aria-live="assertive">
        {state && errorList.length > 0 && (
          <div className="mb-2 rounded-lg border-2 border-red-600 bg-red-600/10 p-4">
            <p className="font-bold">Please fix the following before sending:</p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {errorList.map(([k, m]) => (
                <li key={k}>
                  <a href={`#${k}`} className="underline">
                    {m}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {state?.formError && <p className="mb-2 font-bold text-red-600">{state.formError}</p>}
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <Field id="name" label="Full name *" error={errors.name}>
        <input id="name" name="name" autoComplete="name" defaultValue={v?.name} className={inputClass(!!errors.name)} {...fp('name')} />
      </Field>

      <div className="grid gap-x-3.5 sm:grid-cols-2">
        <Field id="company" label="Organisation *" error={errors.company}>
          <input id="company" name="company" autoComplete="organization" defaultValue={v?.company} className={inputClass(!!errors.company)} {...fp('company')} />
        </Field>
        <Field id="email" label="Email *" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" defaultValue={v?.email} className={inputClass(!!errors.email)} {...fp('email')} />
        </Field>
        <Field id="country" label="Country *" error={errors.country}>
          <input id="country" name="country" autoComplete="country-name" defaultValue={v?.country} className={inputClass(!!errors.country)} {...fp('country')} />
        </Field>
        <Field id="orgType" label="Organisation type *" error={errors.orgType}>
          <select id="orgType" name="orgType" defaultValue={v?.orgType ?? 'consultant'} className={inputClass(!!errors.orgType)} {...fp('orgType')}>
            {options(ORG_TYPES)}
          </select>
        </Field>
        <Field id="discipline" label="Engineering discipline *" error={errors.discipline}>
          <select id="discipline" name="discipline" defaultValue={v?.discipline ?? 'civil'} className={inputClass(!!errors.discipline)} {...fp('discipline')}>
            {options(DISCIPLINES)}
          </select>
        </Field>
        <Field id="solution" label="Solution of interest" error={errors.solution}>
          <select id="solution" name="solution" defaultValue={v?.solution ?? defaultSolution} className={inputClass(!!errors.solution)} {...fp('solution')}>
            {options(SOLUTION_OPTIONS)}
          </select>
        </Field>
      </div>

      <Field id="description" label="Describe your problem * (min. 30 characters)" error={errors.description}>
        <textarea id="description" name="description" rows={5} defaultValue={v?.description} className={inputClass(!!errors.description)} {...fp('description')} />
      </Field>

      <Field id="urgency" label="Urgency" error={errors.urgency}>
        <select id="urgency" name="urgency" defaultValue={v?.urgency ?? 'exploring'} className={inputClass(!!errors.urgency)} {...fp('urgency')}>
          {options(URGENCIES)}
        </select>
      </Field>

      <div className="mt-4">
        <label className="flex items-start gap-3 text-sm">
          <input id="consent" name="consent" type="checkbox" className="mt-0.5 size-5 accent-accent" {...fp('consent')} />
          <span>I agree that Pro Solutors may contact me about this submission. See the privacy policy.</span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="mt-1 text-sm font-semibold text-red-600">
            {errors.consent}
          </p>
        )}
      </div>

      <Button type="submit" disabled={pending} className="mt-5">
        {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
        {pending ? 'Sending…' : 'Submit your problem'}
      </Button>
    </form>
  )
}

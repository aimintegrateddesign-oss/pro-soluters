'use client'

import { useActionState, useRef, useState, type ReactNode } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

import { submitCaseStudy, type CaseStudyState } from '@/app/(frontend)/case-studies/actions'
import { Button } from '@/components/ds/primitives'
import { validateCaseStudy, type CaseStudyErrors, type CaseStudyFields } from '@/lib/validation/caseStudySubmission'
import { cn } from '@/lib/utils'

type Option = { value: string; label: string }

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

export function CaseStudyForm({ solutions, industries }: { solutions: Option[]; industries: Option[] }) {
  const [state, action, pending] = useActionState<CaseStudyState, FormData>(submitCaseStudy, null)
  const [blurErrors, setBlurErrors] = useState<CaseStudyErrors>({})
  const formRef = useRef<HTMLFormElement>(null)

  if (state?.ok) {
    return (
      <div role="status" aria-live="polite" className="rounded-card border border-accent bg-tint p-6">
        <CheckCircle2 aria-hidden className="size-8 text-accent-strong" />
        <h3 className="type-h3 mt-3">Thank you. We have your case study.</h3>
        <p className="mt-2 text-muted">
          An engineer will review it and get in touch before anything is published. Nothing appears on the site until you have
          agreed the final version.
        </p>
      </div>
    )
  }

  const errors: CaseStudyErrors = { ...blurErrors, ...(state && !state.ok ? state.fieldErrors : undefined) }
  const v = state && !state.ok ? state.values : undefined
  const formError = state && !state.ok ? state.formError : undefined

  const readValues = (): CaseStudyFields => {
    const fd = new FormData(formRef.current!)
    const t = (k: string) => String(fd.get(k) ?? '')
    return {
      title: t('title'), solution: t('solution'), industry: t('industry'), organisation: t('organisation'), summary: t('summary'),
      challenge: t('challenge'), approach: t('approach'), results: t('results'), name: t('name'), email: t('email'), consent: fd.get('consent') === 'on',
    }
  }

  // Inline validation on blur: only the blurred field's message is set or cleared.
  const onBlur = (field: keyof CaseStudyFields) => () => {
    const msg = validateCaseStudy(readValues(), solutions.map((s) => s.value))[field]
    setBlurErrors((prev) => ({ ...prev, [field]: msg }))
  }

  const errorList = Object.entries(errors).filter(([, m]) => m)
  const fp = (k: keyof CaseStudyFields) => ({
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `cs-${k}-error` : undefined,
    onBlur: onBlur(k),
  })
  // Field ids are prefixed so they never clash with other forms on the page.
  const id = (k: string) => `cs-${k}`

  return (
    <form ref={formRef} action={action} noValidate>
      <div role="alert" aria-live="assertive">
        {state && !state.ok && errorList.length > 0 && (
          <div className="mb-2 rounded-lg border-2 border-red-600 bg-red-600/10 p-4">
            <p className="font-bold">Please fix the following before sending:</p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {errorList.map(([k, m]) => (
                <li key={k}>
                  <a href={`#${id(k)}`} className="underline">
                    {m}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {formError && <p className="mb-2 font-bold text-red-600">{formError}</p>}
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="cs-website">Leave this empty</label>
        <input id="cs-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <Field id={id('title')} label="Case study title *" error={errors.title}>
        <input id={id('title')} name="title" defaultValue={v?.title} className={inputClass(!!errors.title)} {...fp('title')} />
      </Field>

      <div className="grid gap-x-3.5 sm:grid-cols-2">
        <Field id={id('solution')} label="Related solution *" error={errors.solution}>
          <select id={id('solution')} name="solution" defaultValue={v?.solution ?? ''} className={inputClass(!!errors.solution)} {...fp('solution')}>
            <option value="" disabled>
              Choose…
            </option>
            {solutions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id={id('industry')} label="Industry">
          <select id={id('industry')} name="industry" defaultValue={v?.industry ?? ''} className={inputClass(false)}>
            <option value="">Not listed / other</option>
            {industries.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id={id('organisation')} label="Client or organisation *" error={errors.organisation}>
        <input id={id('organisation')} name="organisation" defaultValue={v?.organisation} className={inputClass(!!errors.organisation)} {...fp('organisation')} />
      </Field>

      <Field id={id('summary')} label="One-line summary *" error={errors.summary} hint="Shown under the title, e.g. “How a precast manufacturer lifted output by a third”.">
        <input id={id('summary')} name="summary" maxLength={300} defaultValue={v?.summary} className={inputClass(!!errors.summary)} {...fp('summary')} />
      </Field>

      <Field id={id('challenge')} label="The challenge *" error={errors.challenge}>
        <textarea id={id('challenge')} name="challenge" rows={4} defaultValue={v?.challenge} className={inputClass(!!errors.challenge)} {...fp('challenge')} />
      </Field>
      <Field id={id('approach')} label="What was done *" error={errors.approach}>
        <textarea id={id('approach')} name="approach" rows={4} defaultValue={v?.approach} className={inputClass(!!errors.approach)} {...fp('approach')} />
      </Field>
      <Field id={id('results')} label="The results *" error={errors.results} hint="Include numbers where you can: output, cost, time saved.">
        <textarea id={id('results')} name="results" rows={3} defaultValue={v?.results} className={inputClass(!!errors.results)} {...fp('results')} />
      </Field>

      <div className="grid gap-x-3.5 sm:grid-cols-2">
        <Field id={id('name')} label="Your name *" error={errors.name}>
          <input id={id('name')} name="name" autoComplete="name" defaultValue={v?.name} className={inputClass(!!errors.name)} {...fp('name')} />
        </Field>
        <Field id={id('email')} label="Email *" error={errors.email}>
          <input id={id('email')} name="email" type="email" autoComplete="email" defaultValue={v?.email} className={inputClass(!!errors.email)} {...fp('email')} />
        </Field>
      </div>

      <div className="mt-4">
        <label className="flex items-start gap-3 text-sm">
          <input id={id('consent')} name="consent" type="checkbox" className="mt-0.5 size-5 accent-accent" {...fp('consent')} />
          <span>I have the right to share this case study and agree to Pro Solutors reviewing it and contacting me about it.</span>
        </label>
        {errors.consent && (
          <p id={id('consent-error')} className="mt-1 text-sm font-semibold text-red-600">
            {errors.consent}
          </p>
        )}
      </div>

      <Button type="submit" disabled={pending} className="mt-5">
        {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
        {pending ? 'Sending…' : 'Submit case study'}
      </Button>
    </form>
  )
}

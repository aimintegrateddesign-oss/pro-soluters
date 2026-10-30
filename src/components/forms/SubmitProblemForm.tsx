'use client'

import { useActionState, useRef, useState, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

import { submitProblem, type SubmitState } from '@/app/(frontend)/submit-a-problem/actions'
import { Button } from '@/components/ds/primitives'
import { CountryCombobox } from '@/components/forms/CountryCombobox'
import type { CountryOption } from '@/data/countries'
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

const MIN_DESCRIPTION = 30

// The form always sits on a navy card (theme-dark), so these colours are tuned for dark: red-400 on navy is 6:1.
const inputClass = (invalid: boolean) =>
  cn('min-h-11 w-full rounded-[4px] border bg-bg px-3 py-[11px] text-ink', invalid ? 'border-red-400' : 'border-line')

const labelClass = 'mb-1.5 block text-[13px] font-semibold text-heading'
const errorClass = 'mt-1 text-sm font-semibold text-red-400'

function Field({ id, label, error, children, className }: { id: string; label: ReactNode; error?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className={errorClass}>
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

/** Radio group drawn as a row of buttons. Submits the same `name`/value pair a select would. */
function Segmented({
  id,
  name,
  label,
  list,
  defaultValue,
  error,
}: {
  id: string
  name: string
  label: string
  list: readonly { value: string; label: string }[]
  defaultValue: string
  error?: string
}) {
  return (
    <fieldset id={id} tabIndex={-1} className="min-w-0 border-0 p-0">
      <legend className={labelClass}>{label}</legend>
      <div className="grid overflow-hidden rounded-[4px] border border-line bg-bg" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(8.5rem, 1fr))' }}>
        {list.map((o) => (
          <label key={o.value} className="relative flex min-h-11 cursor-pointer border-line [&:not(:first-child)]:border-l">
            <input type="radio" name={name} value={o.value} defaultChecked={o.value === defaultValue} className="peer sr-only" />
            <span className="flex w-full items-center justify-center px-3 py-2.5 text-center text-[13px] font-semibold leading-tight text-muted transition-colors peer-checked:bg-btn peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-accent hover:text-heading">
              {o.label}
            </span>
          </label>
        ))}
      </div>
      {error && <p className={errorClass}>{error}</p>}
    </fieldset>
  )
}

export function SubmitProblemForm({ defaultSolution, countries }: { defaultSolution: string; countries: readonly CountryOption[] }) {
  const [state, action, pending] = useActionState<SubmitState, FormData>(submitProblem, null)
  const [blurErrors, setBlurErrors] = useState<FieldErrors>({})
  const formRef = useRef<HTMLFormElement>(null)

  const errors: FieldErrors = { ...blurErrors, ...state?.fieldErrors }
  const v = state?.values
  const [length, setLength] = useState(v?.description?.length ?? 0)

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
    const msg = validateSubmission(readValues(), countries)[field]
    setBlurErrors((prev) => ({ ...prev, [field]: msg }))
  }

  const errorList = Object.entries(errors).filter(([, m]) => m)
  const fp = (k: keyof SubmissionFields) => ({
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `${k}-error` : undefined,
    onBlur: onBlur(k),
  })

  return (
    <form ref={formRef} action={action} noValidate className="space-y-5">
      <div role="alert" aria-live="assertive">
        {state && errorList.length > 0 && (
          <div className="rounded-[4px] border-2 border-red-400 bg-red-400/10 p-4">
            <p className="font-bold text-heading">Please fix the following before sending:</p>
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
        {state?.formError && <p className="font-bold text-red-400">{state.formError}</p>}
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field id="name" label="Full name *" error={errors.name}>
          <input id="name" name="name" autoComplete="name" defaultValue={v?.name} className={inputClass(!!errors.name)} {...fp('name')} />
        </Field>
        <Field id="company" label="Organisation *" error={errors.company}>
          <input id="company" name="company" autoComplete="organization" defaultValue={v?.company} className={inputClass(!!errors.company)} {...fp('company')} />
        </Field>
        <Field id="email" label="Email *" error={errors.email} className="sm:col-span-2 lg:col-span-1">
          <input id="email" name="email" type="email" autoComplete="email" defaultValue={v?.email} className={inputClass(!!errors.email)} {...fp('email')} />
        </Field>
        <Field id="country" label="Country *" error={errors.country}>
          <CountryCombobox key={v?.country ?? ''} id="country" name="country" countries={countries} defaultValue={v?.country} className={inputClass(!!errors.country)} {...fp('country')} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
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
      </div>

      <Segmented id="solution" name="solution" label="Solution of interest" list={SOLUTION_OPTIONS} defaultValue={v?.solution ?? defaultSolution} error={errors.solution} />

      <Field
        id="description"
        error={errors.description}
        label={
          <span className="flex items-baseline justify-between gap-3">
            <span>
              Describe your problem * <span className="font-normal text-muted">(min. {MIN_DESCRIPTION} characters)</span>
            </span>
            <span aria-hidden className={cn('text-[12px] font-normal tabular-nums', length >= MIN_DESCRIPTION ? 'text-accent' : 'text-muted')}>
              {length} / {MIN_DESCRIPTION}
            </span>
          </span>
        }
      >
        <textarea
          id="description"
          name="description"
          rows={6}
          placeholder="What is happening, what you have already tried, and the decision you need to make."
          defaultValue={v?.description}
          className={cn(inputClass(!!errors.description), 'resize-y placeholder:text-muted/80')}
          {...fp('description')}
          onChange={(e) => setLength(e.currentTarget.value.length)}
        />
      </Field>

      <Segmented id="urgency" name="urgency" label="Urgency" list={URGENCIES} defaultValue={v?.urgency ?? 'exploring'} error={errors.urgency} />

      <div>
        <label className="flex min-h-11 items-start gap-3 text-sm">
          <input id="consent" name="consent" type="checkbox" className="mt-0.5 size-5 shrink-0 accent-accent" {...fp('consent')} />
          <span>I agree that Pro Solutors may contact me about this submission. See the privacy policy.</span>
        </label>
        {errors.consent && (
          <p id="consent-error" className={errorClass}>
            {errors.consent}
          </p>
        )}
      </div>

      <Button type="submit" disabled={pending} className="min-h-12 w-full shadow-[0_8px_28px_-8px_rgba(45,212,196,0.55)]">
        {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
        {pending ? 'Sending…' : 'Submit your problem'}
      </Button>
    </form>
  )
}

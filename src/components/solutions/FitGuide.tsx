'use client'

import { useState } from 'react'

import { Button } from '@/components/ds/primitives'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export type FitOption = {
  /** What the visitor might say, e.g. "Our project data is inconsistent". */
  quote: string
  /** Recommended starting point. */
  name: string
  summary: string
  firstStep: string
  /** Where "Read about" goes; omitted for the generic free review. */
  slug?: string
}

/** "Which solution fits you?": pick the sentence that sounds like your team, see where to start. */
export function FitGuide({ options }: { options: FitOption[] }) {
  const [active, setActive] = useState(0)
  const pick = options[active]

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div role="group" aria-label="Pick the sentence that sounds most like your team" className="space-y-3">
        {options.map((o, i) => (
          <button
            key={o.quote}
            type="button"
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            className={cn(
              'flex min-h-11 w-full items-center gap-3 rounded-[4px] border px-4 py-3.5 text-left text-[15px] font-semibold transition-colors',
              i === active ? 'border-accent bg-accent/10 text-heading' : 'border-line bg-card text-muted hover:border-accent',
            )}
          >
            <span aria-hidden className={cn('size-4 shrink-0 rounded-[3px] border-2', i === active ? 'border-accent bg-accent' : 'border-line')} />
            {o.quote}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="rounded-[4px] border border-line border-t-[3px] border-t-btn bg-card p-6 sm:p-8">
        <p className="text-[13px] font-bold text-accent-strong">Start with</p>
        <h3 className="mt-2 text-2xl font-extrabold leading-tight text-heading">{pick.name}</h3>
        <p className="mt-3 text-[15px] text-muted">{pick.summary}</p>
        <p className="mt-5 rounded-[4px] border border-line bg-bg p-3.5 text-[13px] text-muted">
          First step
          <span className="mt-0.5 block text-[15px] font-bold text-heading">{pick.firstStep}</span>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={pick.slug ? `/submit-a-problem?solution=${pick.slug}` : '/submit-a-problem'}>Submit your problem</Button>
          {pick.slug && (
            <Link
              href={`/solutions/${pick.slug}`}
              className="inline-flex min-h-11 items-center rounded-lg border border-line px-5 text-[15px] font-semibold text-heading transition hover:border-accent"
            >
              Read about {pick.name}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

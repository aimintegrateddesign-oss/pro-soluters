'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ds/primitives'
import { cn } from '@/lib/utils'

export type FinderOption = {
  statement: string
  resultTitle: string
  resultText: string
  offer: string
  ctaLabel: string
  ctaHref: string
  learnLabel: string
  learnHref: string
}

/** "Which solution fits your challenge?": pick the statement that matches, see the recommended starting point. */
export function SolutionFinder({ options }: { options: FinderOption[] }) {
  const [active, setActive] = useState(0)
  const pick = options[active]
  if (!pick) return null

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
      <div role="group" aria-label="Choose the statement that best describes your situation" className="space-y-3">
        {options.map((o, i) => (
          <button
            key={o.statement}
            type="button"
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            className={cn(
              'flex min-h-11 w-full items-start gap-3 rounded-[4px] border px-4 py-3.5 text-left text-[15px] font-semibold leading-snug transition-colors',
              i === active ? 'border-accent bg-accent/10 text-heading' : 'border-line bg-card text-muted hover:border-accent',
            )}
          >
            <span aria-hidden className={cn('mt-0.5 size-4 shrink-0 rounded-full border-2', i === active ? 'border-accent bg-accent' : 'border-line')} />
            {o.statement}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="rounded-[4px] border border-line bg-card p-6 sm:p-8">
        {/* Keyed so each recommendation fades in. */}
        <div key={active} className="animate-[finder-in_300ms_ease-out_both] motion-reduce:animate-none">
          <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-accent-strong">Best starting point</p>
          <h3 className="mt-2 text-2xl font-extrabold leading-tight text-heading">{pick.resultTitle}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{pick.resultText}</p>
          {pick.offer && (
            <p className="mt-5 rounded-[4px] border border-line bg-bg p-3.5 text-[13px] text-muted">
              Entry offer
              <span className="mt-0.5 block text-[15px] font-bold text-heading">{pick.offer}</span>
            </p>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button href={pick.ctaHref} className="min-h-12 w-full px-6 sm:w-auto">
              {pick.ctaLabel}
            </Button>
            {pick.learnLabel && pick.learnHref && (
              <Link href={pick.learnHref} className="inline-flex min-h-11 items-center gap-1.5 px-1 text-[15px] font-semibold text-accent-strong hover:underline">
                {pick.learnLabel}
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

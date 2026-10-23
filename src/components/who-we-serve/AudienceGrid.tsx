'use client'

import { useState } from 'react'

import { Button } from '@/components/ds/primitives'
import { cn } from '@/lib/utils'

export type Audience = { code: string; title: string; text: string; lead: string; start: string }

/** Four audience cards. Choosing one lifts it and shows the recommended first step beneath the row. */
export function AudienceGrid({ audiences }: { audiences: Audience[] }) {
  const [active, setActive] = useState(0)
  const pick = audiences[active]

  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {audiences.map((a, i) => {
          const on = i === active
          return (
            <li key={a.title}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setActive(i)}
                className={cn(
                  'flex h-full min-h-11 w-full flex-col rounded-[4px] border border-t-[3px] bg-card p-5 text-left transition duration-200 motion-reduce:transition-none',
                  on
                    ? 'border-line border-t-accent shadow-[0_18px_36px_-18px_rgba(10,22,38,0.55)] motion-safe:-translate-y-1'
                    : 'border-line border-t-line hover:border-accent hover:border-t-accent',
                )}
              >
                <span
                  aria-hidden
                  className="flex size-10 items-center justify-center rounded-[4px] border border-accent/30 bg-accent/10 text-[12px] font-bold text-accent-strong"
                >
                  {a.code}
                </span>
                <span className="mt-4 text-lg font-bold leading-snug text-heading">{a.title}</span>
                <span className="mt-2 text-[14px] leading-relaxed text-muted">{a.text}</span>
                <span className="mt-auto grid grid-cols-[3rem_1fr] gap-x-2 gap-y-1 pt-5 text-[12px]">
                  <span className="text-muted">Lead</span>
                  <span className="font-semibold text-accent-strong">{a.lead}</span>
                  <span className="text-muted">Start</span>
                  <span className="font-semibold text-heading">{a.start}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <div
        aria-live="polite"
        className="theme-dark mt-4 flex flex-col justify-between gap-4 rounded-[4px] border border-accent/30 bg-[#0e2a2c] p-5 sm:flex-row sm:items-center"
      >
        <p className="text-[13px] text-[#c3d0dd]">
          Recommended first step for {pick.title}
          <span className="mt-1 block text-xl font-extrabold text-white [font-family:var(--font-display)]">{pick.start}</span>
        </p>
        <Button href="/submit-a-problem" className="min-h-12 shrink-0 px-6">
          Start with this
        </Button>
      </div>
    </div>
  )
}

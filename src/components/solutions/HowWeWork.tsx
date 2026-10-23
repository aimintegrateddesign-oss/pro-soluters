'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

export type WorkStep = { title: string; description: string; detail: string; youGet: string }

/** "How we work" stepper: choose a step (or use the arrows) to see what happens and what you get. */
export function HowWeWork({ steps }: { steps: WorkStep[] }) {
  const [active, setActive] = useState(0)
  const step = steps[active]
  const arrow = 'flex size-11 items-center justify-center rounded-[4px] border border-line text-heading transition hover:border-accent disabled:opacity-40 disabled:hover:border-line'

  return (
    <div>
      <ol className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title}>
            <button
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={cn('block min-h-11 w-full border-t-2 pt-3 text-left transition-colors', i <= active ? 'border-btn' : 'border-line hover:border-accent')}
            >
              <span
                aria-hidden
                className={cn('flex size-8 items-center justify-center rounded-[4px] text-sm font-bold', i === active ? 'bg-btn text-white' : 'border border-line text-muted')}
              >
                {i + 1}
              </span>
              <span className="mt-2 block font-bold text-heading">{s.title}</span>
              <span className="mt-0.5 block text-[13px] text-muted">{s.description}</span>
            </button>
          </li>
        ))}
      </ol>

      <div aria-live="polite" className="mt-8 grid items-center gap-6 rounded-[4px] border border-line border-t-[3px] border-t-btn bg-card p-6 md:grid-cols-[1.4fr_1fr_auto]">
        <div>
          <p className="text-[12px] font-bold text-accent-strong">
            Step {active + 1} of {steps.length}
          </p>
          <h3 className="mt-1 text-xl font-bold text-heading">{step.title}</h3>
          <p className="mt-2 text-[15px] text-muted">{step.detail}</p>
        </div>
        <p className="rounded-[4px] border border-line bg-bg p-3.5 text-[13px] text-muted">
          You get
          <span className="mt-0.5 block text-[15px] font-bold text-heading">{step.youGet}</span>
        </p>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous step" disabled={active === 0} onClick={() => setActive(active - 1)} className={arrow}>
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <button type="button" aria-label="Next step" disabled={active === steps.length - 1} onClick={() => setActive(active + 1)} className={cn(arrow, active < steps.length - 1 && 'border-btn bg-btn text-white hover:border-accent')}>
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

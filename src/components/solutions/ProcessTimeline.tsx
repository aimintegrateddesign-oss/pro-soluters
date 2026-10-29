'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { cn } from '@/lib/utils'

export type ProcessStep = { title: string; description: string; detail: string; youGet: string }

/**
 * "How we work": a four-step timeline (horizontal from md, vertical on phones). Selecting a step shows what happens and what
 * you get. Beside it, a restrained preview of a feasibility report links to the sample report.
 */
export function ProcessTimeline({
  steps,
  previewTitle,
  previewItems,
  previewLinkLabel,
  previewHref = '/sample-reports',
}: {
  steps: ProcessStep[]
  previewTitle: string
  previewItems: string[]
  previewLinkLabel: string
  previewHref?: string
}) {
  const [active, setActive] = useState(0)
  const step = steps[active]
  if (!step) return null

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-14">
      <div>
        <ol className="relative flex flex-col gap-1 md:grid md:gap-3" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {/* One subtle connector: vertical on phones, horizontal from md. */}
          <span aria-hidden className="absolute bottom-6 left-[17px] top-6 w-px bg-line md:hidden" />
          <span aria-hidden className="absolute left-[17px] right-[17px] top-[17px] hidden h-px bg-line md:block" />
          {steps.map((s, i) => {
            const reached = i <= active
            return (
              <li key={s.title} className="relative">
                <button
                  type="button"
                  aria-pressed={i === active}
                  aria-label={`Step ${i + 1}: ${s.title}`}
                  onClick={() => setActive(i)}
                  className="flex min-h-11 w-full items-start gap-4 text-left md:flex-col md:gap-3"
                >
                  <span
                    aria-hidden
                    className={cn(
                      'relative flex size-9 shrink-0 items-center justify-center rounded-[4px] text-sm font-bold ring-4 ring-bg transition-colors',
                      reached ? 'bg-btn text-white' : 'border border-line bg-card text-muted',
                    )}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="pb-4 md:pb-0">
                    <span className={cn('block text-[13px] font-bold uppercase tracking-[0.1em]', i === active ? 'text-accent-strong' : 'text-heading')}>{s.title}</span>
                    <span className="mt-0.5 block text-[14px] leading-snug text-muted">{s.description}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <div aria-live="polite" className="mt-8 rounded-[4px] border border-line bg-card p-6">
          <div key={active} className="animate-[finder-in_300ms_ease-out_both] motion-reduce:animate-none">
            <p className="text-[12px] font-bold text-accent-strong">
              Step {active + 1} of {steps.length}
            </p>
            <h3 className="mt-1 text-xl font-bold text-heading">{step.title}</h3>
            <p className="mt-2 max-w-[40rem] text-[15px] leading-relaxed text-muted">{step.detail}</p>
            <p className="mt-4 text-[13px] text-muted">
              You get <span className="font-bold text-heading">{step.youGet}</span>
            </p>
          </div>
        </div>
      </div>

      <Link
        href={previewHref}
        className="group mx-auto block w-full max-w-[22rem] rounded-[4px] border border-line bg-white p-5 text-[#0a1626] shadow-[0_12px_30px_-20px_rgba(10,22,38,0.45)] transition hover:border-accent lg:mx-0"
      >
        <span className="flex items-center justify-between text-[11px] font-bold">
          <span className="tracking-tight">
            Pro<span className="text-[#0e7c75]">Solutors</span>
          </span>
          <span className="uppercase tracking-[0.12em] text-[#4a5d70]">{previewTitle}</span>
        </span>
        <span className="mt-2 block h-0.5 bg-[#0e7c75]" />
        <ul className="mt-4 space-y-2.5">
          {previewItems.map((item, i) => (
            <li key={item} className="flex items-center gap-3 text-[13px] font-semibold">
              <span aria-hidden className="w-5 text-[11px] text-[#4a5d70]">
                {String(i + 1).padStart(2, '0')}
              </span>
              {item}
            </li>
          ))}
        </ul>
        <span className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-[#0b6b65] group-hover:underline">
          {previewLinkLabel}
          <ArrowRight aria-hidden className="size-4" />
        </span>
      </Link>
    </div>
  )
}

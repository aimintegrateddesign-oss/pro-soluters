import { Check } from 'lucide-react'

import { Button } from '@/components/ds/primitives'
import type { Cta } from '@/data/site'
import { cn } from '@/lib/utils'

// What happens after a visitor submits. These restate commitments already made elsewhere on the site.
const steps = [
  { title: 'Problem received', text: 'You describe it through the form.' },
  { title: 'Read by an engineer', text: 'Every submission is read by an engineer.' },
  { title: 'A clear yes or no, and a next step', text: 'You hear back within 2 working days.' },
]

/**
 * Closing call to action: the message and two actions on the left, the submission workflow on the right.
 * Text comes from the page's Payload content; `tone` is the colour of the band around the panel (the panel is always navy).
 * Leave `cta.secondaryLabel` empty to hide the second button. Static, so it renders the same with or without motion.
 */
export function HomeCta({
  cta,
  primaryHref = '/submit-a-problem',
  secondaryHref,
  tone = 'dark',
}: {
  cta: Cta
  primaryHref?: string
  secondaryHref?: string
  tone?: 'dark' | 'light'
}) {
  return (
    <section className={cn(tone === 'dark' ? 'theme-dark bg-hero' : 'theme-light bg-bg', 'px-5 py-14 sm:py-20')}>
      <div className="theme-dark mx-auto max-w-[77.5rem] rounded-[4px] border border-line border-t-2 border-t-accent bg-[#0b2038] px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <h2 className="text-balance text-[clamp(1.9rem,3.6vw,3rem)] font-extrabold leading-[1.05] text-white">{cta.title}</h2>
            <p className="mt-4 max-w-[30rem] text-[17px] leading-relaxed text-[#c3d0dd]">{cta.body}</p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href={primaryHref} className="min-h-12 w-full px-7 sm:w-auto">
                {cta.primaryLabel}
              </Button>
              {cta.secondaryLabel && secondaryHref && (
                <Button href={secondaryHref} tone="navy" variant="secondary" className="min-h-12 w-full px-7 !border-white/30 sm:w-auto">
                  {cta.secondaryLabel}
                </Button>
              )}
            </div>

          </div>

          <div className="w-full max-w-[26rem] justify-self-center overflow-hidden rounded-[4px] bg-[#f4f8fb] text-[#0a1626] lg:justify-self-end">
            <h3 className="bg-[#0a1626] px-5 py-3 text-[13px] font-bold text-white">What happens after you submit</h3>
            <ol className="px-5 py-5">
              {steps.map((s, i) => (
                <li key={s.title} className="relative flex gap-3.5 pb-5 last:pb-0">
                  {i < steps.length - 1 && <span aria-hidden className="absolute bottom-0 left-[13px] top-7 w-px bg-[#c5d2de]" />}
                  <span aria-hidden className="relative flex size-7 shrink-0 items-center justify-center rounded-[4px] bg-[#0e7c75] text-white">
                    {i === steps.length - 1 ? <Check className="size-4" /> : <span className="text-[13px] font-bold">{i + 1}</span>}
                  </span>
                  <div>
                    <p className="text-[15px] font-bold leading-snug">{s.title}</p>
                    <p className="mt-0.5 text-[13px] leading-snug text-[#3d5064]">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

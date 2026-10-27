import { ArrowRight, Check } from 'lucide-react'
import type { ReactNode } from 'react'

import { Band, WIDE, type Tone } from '@/components/ds/band'
import { Button, Container } from '@/components/ds/primitives'
import type { solutionsPage } from '@/data/site'
import { cn } from '@/lib/utils'

export type SolutionBlock = Omit<(typeof solutionsPage)['improve'], 'image'>

/** Small "A → B → C" strip used under the visuals and in the hero. Decorative arrows are hidden from assistive tech. */
export function Sequence({ items, className }: { items: string[]; className?: string }) {
  return (
    <ol className={cn('flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-bold uppercase tracking-[0.08em] text-muted', className)}>
      {items.map((item, i) => (
        <li key={item} className="flex items-center gap-2">
          {i > 0 && <ArrowRight aria-hidden className="size-3.5 text-accent" />}
          {item}
        </li>
      ))}
    </ol>
  )
}

/**
 * One solution chapter. Mobile order is heading, visual, details. From lg the visual sits beside the text; `flip`
 * puts it on the right, so the three chapters alternate.
 */
export function SolutionSection({
  id,
  tone,
  className,
  block,
  visual,
  flip,
}: {
  id: string
  tone: Tone
  className?: string
  block: SolutionBlock
  visual: ReactNode
  flip?: boolean
}) {
  const textCol = flip ? 'lg:col-start-1' : 'lg:col-start-2'
  const visualCol = flip ? 'lg:col-start-2' : 'lg:col-start-1'
  return (
    <Band tone={tone} id={id} aria-labelledby={`${id}-title`} className={cn('scroll-mt-[var(--header-h)]', className)}>
      <Container className={cn(WIDE, 'grid items-start gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]', flip && 'lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]')}>
        <header className={cn('lg:row-start-1 lg:self-end', textCol)}>
          <p className="flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.14em] text-accent-strong">
            <span aria-hidden className="h-px w-8 bg-btn" />
            {block.eyebrow}
          </p>
          <h2 id={`${id}-title`} className="mt-4 text-balance text-[clamp(1.9rem,3.6vw,3rem)] font-extrabold leading-[1.05] text-heading">
            {block.title}
          </h2>
          <p className="mt-4 max-w-[34rem] text-pretty text-[17px] leading-relaxed text-muted">{block.value}</p>
        </header>

        <div className={cn('lg:row-span-2 lg:row-start-1 lg:self-center', visualCol)}>{visual}</div>

        <div className={cn('lg:row-start-2', textCol)}>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-heading">{block.analyseTitle}</h3>
              <ul className="mt-3 space-y-2">
                {block.analyse.map((a) => (
                  <li key={a} className="flex items-start gap-2.5 text-[15px] text-muted">
                    <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-btn" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-heading">{block.receiveTitle}</h3>
              <ul className="mt-3 space-y-2">
                {block.receive.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-[15px] text-ink">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-strong" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-muted">
              Entry offer
              <span className="mt-0.5 block text-[16px] font-bold text-accent-strong">{block.offerName}</span>
            </p>
            <Button href={block.ctaHref} className="min-h-12 w-full px-6 sm:w-auto">
              {block.ctaLabel}
              <ArrowRight aria-hidden className="size-4" />
            </Button>
          </div>
        </div>
      </Container>
    </Band>
  )
}

import type { ComponentProps, ReactNode } from 'react'

import { Container } from '@/components/ds/primitives'
import { cn } from '@/lib/utils'

/**
 * Shared building blocks for the redesigned pages: full-width bands that alternate navy (`dark`) and white
 * (`light`), plus the navy hero they all open with. Each band sets its own colour scope, so contrast holds
 * whatever the OS colour scheme is.
 */
export type Tone = 'dark' | 'light'
export const otherTone = (t: Tone): Tone => (t === 'dark' ? 'light' : 'dark')

/** Tone of the nth band after the hero: white first, then alternating. */
export const toneAt = (i: number): Tone => (i % 2 === 0 ? 'light' : 'dark')

/** Wider container used by the redesigned pages (matches the home page). */
export const WIDE = '!max-w-[77.5rem]'

/** Bordered card with the 3px teal top rule. */
export const ruleCard = 'rounded-[4px] border border-line border-t-[3px] border-t-btn bg-card p-5 shadow-[0_12px_30px_-20px_rgba(10,22,38,0.45)]'

export function Band({ tone, className, ...props }: ComponentProps<'section'> & { tone: Tone }) {
  return <section className={cn(tone === 'dark' ? 'theme-dark' : 'theme-light', 'bg-bg py-14 text-ink sm:py-20', className)} {...props} />
}

/** Navy hero wrapper with the blueprint grid. Children supply their own container. */
export function HeroShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('theme-dark relative isolate flex flex-col lg:min-h-svh justify-center overflow-x-clip text-white', className)} style={{ background: 'linear-gradient(105deg, #0b2442, #0a1626)' }}>
      <div aria-hidden className="bg-blueprint absolute inset-0 -z-10" />
      {children}
    </div>
  )
}

export function HeroContainer({ children }: { children: ReactNode }) {
  return <Container className={cn(WIDE, 'px-3 pb-6 pt-[calc(var(--header-h)+1rem)] lg:px-5 lg:pb-12 lg:pt-[calc(var(--header-h)+2rem)]')}>{children}</Container>
}

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('text-[clamp(1.9rem,3.6vw,3rem)] font-extrabold leading-[1.05] text-heading', className)}>{children}</h2>
}

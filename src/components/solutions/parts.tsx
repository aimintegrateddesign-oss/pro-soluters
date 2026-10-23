import { ArrowRight, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Band, HeroContainer, HeroShell, SectionTitle, WIDE, ruleCard, type Tone } from '@/components/ds/band'
import { Button, Container } from '@/components/ds/primitives'
import type { CaseStudy, Solution } from '@/data/types'
import { cn } from '@/lib/utils'

const tagClass = 'inline-flex items-center rounded-[3px] px-2.5 py-1 text-[12px] font-bold'

/** Navy hero for a single solution: copy and two actions on the left, tilted photo with a sample stat on the right. */
export function SolutionHero({ solution, study }: { solution: Solution; study?: CaseStudy }) {
  const kpi = study?.kpis[0]
  const secondTag = solution.eyebrow.split('|')[1]?.trim()
  return (
    <HeroShell>
      <HeroContainer>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <p className="flex flex-wrap gap-2">
              <span className={cn(tagClass, 'bg-btn text-white')}>{solution.name}</span>
              {secondTag && <span className={cn(tagClass, 'border border-line text-[#c3d0dd]')}>{secondTag}</span>}
            </p>
            <h1 className="mt-5 text-[clamp(2.25rem,4.6vw,4rem)] font-extrabold leading-[1.02] !tracking-[-0.035em] text-white">{solution.name}</h1>
            <p className="mt-5 max-w-[30rem] text-lg text-[#c3d0dd]">{solution.shortSummary}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={`/submit-a-problem?solution=${solution.slug}`} className="min-h-12 px-6 shadow-[0_8px_28px_-8px_rgba(45,212,196,0.55)]">
                {solution.entryOffer.ctaLabel}
              </Button>
              {study && (
                <Button href={`/case-studies/${study.slug}`} tone="navy" variant="secondary" className="min-h-12 px-6 !border-line">
                  See the case study
                </Button>
              )}
            </div>
          </div>

          <figure className="relative pb-10 lg:[perspective:1600px]">
            <div className="relative aspect-video overflow-hidden rounded-[4px] border border-line shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)] motion-safe:lg:[transform:rotateY(-8deg)_rotateX(2deg)]">
              <Image src={solution.image} alt={solution.imageAlt} fill priority sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
            </div>
            {kpi && study && (
              <figcaption className="absolute -bottom-0 left-4 w-[min(17rem,80%)] rounded-[4px] border border-accent/40 bg-[#0a1626]/95 p-4 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)]">
                <span className="text-2xl font-extrabold leading-none text-accent [font-family:var(--font-display)]">{kpi.value}</span>
                <span className="mt-1.5 block text-[12px] leading-snug text-[#c3d0dd]">{kpi.caption}</span>
                <span className="mt-2 block font-mono text-[11px] text-muted">
                  {study.referenceCode}, illustrative sample
                </span>
              </figcaption>
            )}
          </figure>
        </div>
      </HeroContainer>
    </HeroShell>
  )
}

/** "The problem it solves": the lead statement large, the rest as a quoted callout. */
export function ProblemBlock({ tone, statements }: { tone: Tone; statements: string[] }) {
  const [lead, ...rest] = statements
  return (
    <Band tone={tone}>
      <Container className={cn(WIDE, 'grid gap-8 lg:grid-cols-[14rem_1fr]')}>
        <p className="flex items-start gap-2.5 text-[13px] font-bold text-accent-strong">
          <span aria-hidden className="mt-1.5 size-2 shrink-0 bg-btn" />
          The problem it solves
        </p>
        <div>
          <p className="max-w-[52rem] text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold leading-[1.2] text-heading">{lead}</p>
          {rest.length > 0 && (
            <div className="mt-8 max-w-[52rem] space-y-3 rounded-r-[4px] border-l-[3px] border-btn bg-card p-5 text-[16px] text-muted">
              {rest.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Band>
  )
}

export function DeliverableGrid({ tone, items }: { tone: Tone; items: string[] }) {
  return (
    <Band tone={tone}>
      <Container className={WIDE}>
        <SectionTitle>What you get</SectionTitle>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((d) => (
            <li key={d} className={ruleCard}>
              <span aria-hidden className="flex size-9 items-center justify-center rounded-[4px] border border-accent/30 bg-accent/10 text-accent-strong">
                <Check className="size-4" />
              </span>
              <p className="mt-4 text-[16px] font-bold leading-snug text-heading">{d}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Band>
  )
}

/** Numbered steps hanging off a horizontal line (vertical list on small screens). */
export function StepLine({ tone, title, lead, steps }: { tone: Tone; title: string; lead: string; steps: { title: string; description: string }[] }) {
  return (
    <Band tone={tone}>
      <Container className={WIDE}>
        <SectionTitle>{title}</SectionTitle>
        <p className="mt-3 text-muted">{lead}</p>
        <div className="relative mt-12">
          <span aria-hidden className="absolute left-4 right-0 top-[17px] hidden h-px bg-btn lg:block" />
          <ol className="grid gap-8 sm:grid-cols-2 lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))] lg:gap-6" style={{ ['--n' as string]: steps.length }}>
            {steps.map((s, i) => (
              <li key={s.title}>
                <span aria-hidden className="relative flex size-9 items-center justify-center rounded-[4px] bg-btn font-bold text-white ring-4 ring-bg">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold text-heading">{s.title}</h3>
                <p className="mt-1.5 text-[15px] text-muted">{s.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Band>
  )
}

export function EntryOfferBand({ tone, solution }: { tone: Tone; solution: Solution }) {
  return (
    <Band tone={tone} className="!bg-tint py-12 sm:py-16">
      <Container className={cn(WIDE, 'flex flex-col justify-between gap-6 md:flex-row md:items-center')}>
        <div>
          <p className="text-[13px] font-bold text-accent-strong">Entry offer</p>
          <h2 className="mt-2 text-[clamp(1.75rem,3.2vw,2.75rem)] font-extrabold leading-[1.05] text-heading">{solution.entryOffer.label}</h2>
          <p className="mt-3 max-w-[38rem] text-muted">{solution.entryOffer.description}</p>
        </div>
        <Button href={`/submit-a-problem?solution=${solution.slug}`} className="min-h-12 shrink-0 px-6">
          {solution.entryOffer.ctaLabel}
        </Button>
      </Container>
    </Band>
  )
}

export function OtherSolutions({ tone, solutions }: { tone: Tone; solutions: Solution[] }) {
  return (
    <Band tone={tone} className="py-12 sm:py-16">
      <Container className={WIDE}>
        <h2 className="text-xl font-bold text-heading">Other solutions</h2>
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {solutions.map((s) => (
            <li key={s.slug}>
              <Link href={`/solutions/${s.slug}`} className={cn(ruleCard, 'group flex h-full items-center justify-between gap-4 transition hover:-translate-y-[3px] hover:border-accent motion-reduce:hover:translate-y-0')}>
                <span>
                  <span className="block text-lg font-bold text-heading">{s.name}</span>
                  <span className="mt-1 block text-[14px] text-muted">{s.shortSummary}</span>
                </span>
                <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-[4px] border border-line text-accent-strong transition-colors group-hover:border-accent">
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Band>
  )
}


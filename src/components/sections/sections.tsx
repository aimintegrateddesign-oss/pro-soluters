import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Database, SearchCheck, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button, Container, Eyebrow, NumberBadge, SampleBadge, Section } from '@/components/ds/primitives'
import { heroPillars, processSteps, siteSettings } from '@/data/site'
import type { CaseStudy, Kpi, Solution } from '@/data/types'
import { cn } from '@/lib/utils'

export function PromiseLine({ className, onNavy }: { className?: string; onNavy?: boolean }) {
  return (
    <p className={cn('text-[15px] font-semibold', onNavy ? 'text-on-navy-muted' : 'text-muted', className)}>
      {siteSettings.promiseText}
    </p>
  )
}

/** Navy band that opens every inner page (the approved design's `.hero.sm`). */
export function PageBand({
  eyebrow,
  title,
  children,
  image,
  className,
}: {
  eyebrow: string
  title: string
  children?: ReactNode
  /** Optional photo shown on the right from lg up, fading into the navy band. */
  image?: { src: string; alt: string }
  className?: string
}) {
  return (
    <div className={cn('relative overflow-hidden bg-dot-grid text-white', className)}>
      {image && (
        <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <Image src={image.src} alt={image.alt} fill sizes="50vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-hero via-hero/70 to-transparent" />
        </div>
      )}
      <Container className="relative pb-12 pt-[calc(var(--header-h)+3rem)]">
        <Eyebrow onNavy className="mb-3">
          {eyebrow}
        </Eyebrow>
        <h1 className="type-h1 mb-4 max-w-[48.75rem]">{title}</h1>
        {children && <div className="max-w-[43.75rem] text-lg text-on-navy-muted">{children}</div>}
      </Container>
    </div>
  )
}

const pillarIcons = { 'search-check': SearchCheck, 'trending-up': TrendingUp, database: Database }

/** Full-bleed hero: photo background, left-aligned copy, three pillars along the bottom. */
export function Hero({ image }: { image: { src: string; alt: string } }) {
  return (
    <div className="relative isolate flex min-h-[640px] flex-col overflow-hidden bg-hero text-white lg:min-h-[min(100svh,820px)]">
      <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="-z-20 object-cover object-[72%_center]" />
      {/* Legibility: stronger on the copy side and at the bottom, lighter over the building. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-hero via-hero/70 to-hero/10 max-lg:from-hero/90 max-lg:via-hero/75 max-lg:to-hero/50" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-hero/90 to-transparent" />

      <Container className="flex flex-1 flex-col justify-center pb-10 pt-[calc(var(--header-h)+2.5rem)]">
        <div className="fade-up max-w-[40rem]">
          <p className="mb-6 flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-white/90">
            <span aria-hidden className="h-px w-8 bg-accent" />
            Research. Solve. Align.
          </p>
          <h1 className="text-[clamp(2.25rem,6.2vw,4.25rem)] font-bold leading-[1.05] tracking-tight">
            Engineering problems solved. Data aligned.{' '}
            <span className="text-accent">Decisions proven.</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-white/85">
            Pro Solutors helps engineering consultants, contractors, research centres and government institutions around the world
            innovate, align their technical data, and choose solutions backed by feasibility analysis.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/submit-a-problem" className="min-h-12 px-6">
              Submit your problem
              <ArrowRight aria-hidden className="size-4" />
            </Button>
            <Button href="/solutions" tone="navy" variant="secondary" className="min-h-12 px-6">
              Explore our solutions
            </Button>
          </div>
        </div>
      </Container>

      <Container className="pb-8">
        <ul className="grid border-t border-white/20 pt-6 sm:grid-cols-3 sm:gap-0">
          {heroPillars.map((p, i) => {
            const Icon = pillarIcons[p.icon]
            return (
              <li key={p.label} className={cn('flex items-start gap-3 py-3 sm:py-0', i > 0 && 'sm:border-l sm:border-white/20 sm:pl-8', i < 2 && 'sm:pr-8')}>
                <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-white/80" />
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.16em]">{p.label}</p>
                  <p className="mt-1 text-sm text-white/75">{p.text}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </Container>
    </div>
  )
}

export function KpiStrip({ kpis, note, className }: { kpis: Kpi[]; note?: string; className?: string }) {
  return (
    <div className={className}>
      <dl className="grid grid-cols-2 divide-line border-t-[3px] border-accent bg-alt lg:grid-cols-4 lg:divide-x">
        {kpis.map((k) => (
          <div key={k.caption} className="flex flex-col justify-center px-5 py-6 text-center">
            <dt className="order-2 mt-2 text-sm leading-snug text-muted">{k.caption}</dt>
            <dd className={cn('font-bold text-heading', k.value.length > 10 ? 'text-2xl' : 'text-3xl sm:text-4xl')}>{k.value}</dd>
          </div>
        ))}
      </dl>
      {note && <p className="mt-2 text-sm text-muted">{note}</p>}
    </div>
  )
}

/** The approved design's `.card`: bordered, 12px radius, lifts and turns teal on hover. */
export const cardClass =
  'rounded-card border border-line bg-card p-[22px] transition duration-200 hover:-translate-y-[3px] hover:border-accent motion-reduce:hover:translate-y-0'

export function InfoCard({ title, children, footer, className }: { title: string; children: ReactNode; footer?: ReactNode; className?: string }) {
  return (
    <div className={cn(cardClass, className)}>
      <h3 className="type-h3 mb-1.5">{title}</h3>
      <p className="text-[15px] text-muted">{children}</p>
      {footer && <div className="mt-2.5 text-[13px] font-semibold text-accent-strong">{footer}</div>}
    </div>
  )
}

export function StepCard({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <div className={cardClass}>
      <NumberBadge className="mb-2.5">{n}</NumberBadge>
      <h3 className="type-h3 mb-1.5">{title}</h3>
      <p className="text-[15px] text-muted">{children}</p>
    </div>
  )
}

export function SolutionCard({ solution }: { solution: Solution }) {
  return (
    <Link
      href={`/solutions/${solution.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-card transition duration-200 hover:-translate-y-[3px] hover:border-accent motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-video overflow-hidden bg-navy">
        <Image
          src={solution.image}
          alt={solution.imageAlt}
          fill
          sizes="(min-width: 1024px) 350px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div className="flex flex-1 flex-col p-[22px]">
        <NumberBadge className="mb-2.5">{solution.order}</NumberBadge>
        <h3 className="type-h3 mb-1.5">{solution.name}</h3>
        <p className="flex-1 text-[15px] text-muted">{solution.shortSummary}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent-strong">
          Learn more
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
        </span>
      </div>
    </Link>
  )
}

export function SolutionsGrid({ solutions }: { solutions: Solution[] }) {
  return (
    <ul className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
      {solutions.map((s) => (
        <li key={s.slug}>
          <SolutionCard solution={s} />
        </li>
      ))}
    </ul>
  )
}

export function CaseStudyCard({ study, solutionName }: { study: CaseStudy; solutionName: string }) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-card transition duration-200 hover:-translate-y-[3px] hover:border-accent motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-video overflow-hidden bg-navy">
        <Image
          src={study.cover}
          alt={study.coverAlt}
          fill
          sizes="(min-width: 1024px) 350px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div className="flex flex-1 flex-col p-[22px]">
        <Eyebrow>{solutionName}</Eyebrow>
        <h3 className="type-h3 mt-2 text-xl">{study.title}</h3>
        <dl className="mb-5 mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
          {study.kpis.slice(0, 2).map((k) => (
            <div key={k.caption}>
              <dd className="text-lg font-bold leading-tight text-heading">{k.value}</dd>
              <dt className="mt-0.5 text-xs leading-snug text-muted">{k.caption}</dt>
            </div>
          ))}
        </dl>
        {/* Reference code and badge are stacked so neither wraps or crowds the other. */}
        <div className="mt-auto flex flex-col items-start gap-2 border-t border-line pt-4">
          <span className="whitespace-nowrap text-xs font-bold tracking-wide text-muted">{study.referenceCode}</span>
          {study.isSample && <SampleBadge className="px-3 py-0.5 text-[11px]" />}
        </div>
      </div>
    </Link>
  )
}

export function ProcessSteps() {
  return (
    <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
      {processSteps.map((s, i) => (
        <StepCard key={s.title} n={i + 1} title={s.title}>
          {s.description}
        </StepCard>
      ))}
    </div>
  )
}

export function CtaBand({
  title = 'Have an engineering problem worth solving?',
  body = siteSettings.promiseText,
  label = 'Submit your problem',
  href = '/submit-a-problem',
}: {
  title?: string
  body?: string
  label?: string
  href?: string
}) {
  return (
    <Section tone="navy" className="px-5 py-14 text-center">
      <h2 className="type-h2 !text-white">{title}</h2>
      <p className="mx-auto mb-[22px] mt-2 max-w-2xl text-on-navy-muted">{body}</p>
      <Button href={href}>{label}</Button>
    </Section>
  )
}

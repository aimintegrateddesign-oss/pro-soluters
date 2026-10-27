import { ArrowRight, Download, Info } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Band, HeroShell, WIDE, ruleCard, type Tone } from '@/components/ds/band'
import { Button, Container, SampleBadge } from '@/components/ds/primitives'
import type { CaseStudy } from '@/data/types'
import { cn, formatDate } from '@/lib/utils'

const tagClass = 'inline-flex items-center rounded-[3px] px-2.5 py-1 text-[12px] font-bold'

export function CaseCover({
  study,
  disclaimer,
  solutionName,
  entryOffer,
  sections,
}: {
  study: CaseStudy
  /** Sample disclaimer text from Payload site settings. */
  disclaimer: string
  solutionName: string
  entryOffer: string
  sections: { id: string; title: string }[]
}) {
  const meta: [string, string][] = [
    ['Client', `${study.clientName} (${study.clientDescription})`],
    ['Prepared by', 'Pro Solutors'],
    ['Reference', study.referenceCode],
    ['Edition', `${study.isSample ? 'Sample, ' : ''}${formatDate(study.editionDate)}`],
  ]
  return (
    <HeroShell>
      <Container className={cn(WIDE, 'pb-8 pt-[calc(var(--header-h)+2rem)]')}>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="flex flex-wrap gap-2">
              <span className={cn(tagClass, 'bg-btn text-white')}>{solutionName}</span>
              <span className={cn(tagClass, 'border border-line text-[#c3d0dd]')}>{entryOffer}</span>
            </p>
            <h1 className="mt-5 text-[clamp(2.25rem,4.6vw,4rem)] font-extrabold leading-[1.02] !tracking-[-0.035em] text-white">{study.title}</h1>
            <p className="mt-5 max-w-[34rem] text-lg text-[#c3d0dd]">{study.subtitle}</p>

            <dl className="mt-7 grid max-w-[34rem] grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-line bg-line text-[14px]">
              {meta.map(([k, v], i) => (
                <div key={k} className={cn('bg-[#0a1626] p-3.5', (i === 0 || i === meta.length - 1) && 'col-span-2')}>
                  <dt className="text-[12px] text-muted">{k}</dt>
                  <dd className="mt-0.5 font-semibold text-white">{v}</dd>
                </div>
              ))}
            </dl>
            {study.pdf && (
              <Button href={study.pdf} tone="navy" variant="secondary" className="mt-5 !border-line" data-analytics="download-pdf">
                <Download aria-hidden className="size-4" /> Download PDF
              </Button>
            )}
          </div>

          <figure className="relative lg:[perspective:1600px]">
            <div className="relative aspect-video overflow-hidden rounded-[4px] border border-line shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)] motion-safe:lg:[transform:rotateY(-8deg)_rotateX(2deg)]">
              <Image src={study.cover} alt={study.coverAlt} fill priority sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
            </div>
            {study.isSample && (
              <SampleBadge className="absolute -bottom-3 right-4 bg-[#0a1626] px-3 py-1 text-[11px] !text-accent" />
            )}
          </figure>
        </div>

        {study.isSample && (
          <p className="mt-10 flex items-start gap-3 rounded-[4px] border border-line bg-[#0a1626]/70 p-4 text-[13px] leading-relaxed text-[#c3d0dd]">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
            {disclaimer}
          </p>
        )}

        <nav aria-label="On this page" className="mt-6 overflow-x-auto border-t border-line pt-4">
          <ol className="flex gap-6 whitespace-nowrap text-[13px]">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex min-h-11 items-center gap-2 text-[#c3d0dd] hover:text-accent">
                  <span className="font-bold text-accent">{String(i + 1).padStart(2, '0')}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Container>
    </HeroShell>
  )
}

export function StudySection({ n, title, id, tone, children }: { n: number; title: string; id: string; tone: Tone; children: ReactNode }) {
  return (
    <Band tone={tone} aria-labelledby={id} className="scroll-mt-20">
      <Container className={WIDE}>
        <p className="text-[13px] font-bold text-accent-strong">{String(n).padStart(2, '0')}</p>
        <h2 id={id} className="mt-1 text-[clamp(1.9rem,3.6vw,3rem)] font-extrabold leading-[1.05] text-heading">
          {title}
        </h2>
        <div className="mt-8 space-y-8">{children}</div>
      </Container>
    </Band>
  )
}

export function KpiTiles({ kpis }: { kpis: CaseStudy['kpis'] }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k, i) => (
        <div key={k.caption} className={cn('flex flex-col rounded-[4px] border p-5', i === 2 ? 'border-btn bg-btn text-white' : 'border-line bg-card')}>
          <dd className={cn('order-1 font-extrabold leading-tight [font-family:var(--font-display)]', k.value.length > 10 ? 'text-2xl' : 'text-3xl sm:text-4xl', i !== 2 && 'text-heading')}>{k.value}</dd>
          <dt className={cn('order-2 mt-2 text-[14px] leading-snug', i === 2 ? 'text-white/90' : 'text-muted')}>{k.caption}</dt>
        </div>
      ))}
    </dl>
  )
}

export function Roadmap({ phases }: { phases: CaseStudy['phases'] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-2 lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]" style={{ ['--n' as string]: phases.length }}>
      {phases.map((p, i) => (
        <li key={p.name} className={ruleCard}>
          <span className="text-[12px] font-bold text-accent-strong">
            Step {i + 1} · {p.when}
          </span>
          <h3 className="mt-1 text-lg font-bold text-heading">{p.name}</h3>
          <p className="mt-2 text-[15px] text-muted">{p.focus}</p>
          <p className="mt-3 border-t border-line pt-3 text-[13px] text-muted">
            <span className="font-bold text-heading">Goal:</span> {p.goal}
          </p>
        </li>
      ))}
    </ol>
  )
}

/** Case-study card for the listing and "related" grids. Reads its colours from the surrounding band. */
export function CaseCard({
  study,
  solutionName,
  industryName,
  wide,
}: {
  study: CaseStudy
  solutionName: string
  industryName?: string
  /** Image beside the text from md up, with a "Read the case study" link. */
  wide?: boolean
}) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-[4px] border border-line border-t-[3px] border-t-btn bg-card shadow-[0_12px_30px_-20px_rgba(10,22,38,0.45)] transition duration-200 hover:-translate-y-[3px] hover:border-accent motion-reduce:hover:translate-y-0',
        wide && 'md:flex-row',
      )}
    >
      <div className={cn('relative aspect-video overflow-hidden bg-hero', wide && 'md:aspect-auto md:w-[42%] md:shrink-0')}>
        <Image
          src={study.cover}
          alt={study.coverAlt}
          fill
          sizes="(min-width: 1024px) 450px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div className={cn('flex flex-1 flex-col p-5', wide && 'md:p-7')}>
        <div className="flex items-start justify-between gap-3 text-[12px]">
          <span className="font-bold text-accent-strong">{solutionName}</span>
          {industryName && <span className="text-right text-muted">{industryName}</span>}
        </div>
        <h3 className="mt-2 text-xl font-bold leading-snug text-heading">{study.title}</h3>
        <dl className="mb-5 mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
          {study.kpis.slice(0, 2).map((k) => (
            <div key={k.caption}>
              <dd className="text-lg font-extrabold leading-tight text-heading">{k.value}</dd>
              <dt className="mt-0.5 text-xs leading-snug text-muted">{k.caption}</dt>
            </div>
          ))}
        </dl>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
          <span className="whitespace-nowrap font-mono text-xs font-bold tracking-wide text-muted">{study.referenceCode}</span>
          {study.isSample && <SampleBadge className="px-3 py-0.5 text-[11px]" />}
          {wide && (
            <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent-strong">
              Read the case study <ArrowRight aria-hidden className="size-4" />
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

/**
 * Case-study card for the listing: taxonomy, title, context line and the two headline metrics, no photograph.
 * (CaseCard above keeps the image layout used on the solution pages.)
 */
export function CaseMetricCard({ study, solutionName, industryName }: { study: CaseStudy; solutionName: string; industryName?: string }) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="group flex h-full flex-col rounded-[4px] border border-line border-t-[3px] border-t-btn bg-card p-6 shadow-[0_1px_2px_rgba(10,22,38,0.06)] transition duration-200 hover:border-accent hover:shadow-[0_18px_36px_-22px_rgba(10,22,38,0.5)]"
    >
      <div className="flex items-start justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.1em]">
        <span className="text-accent-strong">{solutionName}</span>
        {industryName && <span className="text-right text-muted">{industryName}</span>}
      </div>
      <h3 className="mt-3 text-balance text-xl font-bold leading-snug text-heading">{study.title}</h3>
      {study.subtitle && <p className="mt-2 text-[15px] leading-snug text-muted">{study.subtitle}</p>}

      <dl className="my-6 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-line py-5">
        {study.kpis.slice(0, 2).map((k) => (
          <div key={k.caption}>
            <dd className="text-[1.6rem] font-extrabold leading-none text-heading [font-family:var(--font-display)]">{k.value}</dd>
            <dt className="mt-2 text-[11px] font-bold uppercase leading-snug tracking-[0.06em] text-muted">{k.caption}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-auto flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs font-bold tracking-wide text-muted">{study.referenceCode}</p>
          {study.isSample && <p className="mt-1 text-[12px] text-muted">Illustrative sample · Fictional company</p>}
        </div>
        <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-[4px] border border-line text-accent-strong transition-all group-hover:border-accent group-hover:bg-accent/10">
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
        </span>
        <span className="sr-only">Read the case study</span>
      </div>
    </Link>
  )
}

const W = 800
const H = 340
const PAD = { top: 28, right: 16, bottom: 44, left: 52 }

function niceMax(v: number) {
  const pow = 10 ** Math.floor(Math.log10(v))
  const step = pow / 2
  return Math.ceil(v / step) * step
}

/** DECISION: hand-rolled server-rendered chart instead of Recharts. No client JS, no CLS, and the data is also
 *  exposed as a screen-reader table. Bar charts are horizontal bars; line charts stay SVG. Colours come from the
 *  surrounding band so the chart reads on navy and on white. */
export function ResultsChart({ chart }: { chart: CaseStudy['chart'] }) {
  const max = niceMax(Math.max(...chart.values))
  const fmt = (v: number) => `${v.toLocaleString('en-US')}${chart.unit ?? ''}`
  const summary = `${chart.title}. ${chart.labels.map((l, i) => `${l}: ${fmt(chart.values[i])}`).join('; ')}.`

  const srTable = (
    <div className="sr-only">
      <table>
      <caption>{chart.title}</caption>
      <thead>
        <tr>
          <th scope="col">Period</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {chart.labels.map((l, i) => (
          <tr key={l}>
            <th scope="row">{l}</th>
            <td>{fmt(chart.values[i])}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  )

  if (chart.type === 'bar') {
    return (
      <figure className={cn(ruleCard, 'relative p-6')}>
        <figcaption className="mb-5 text-[15px] font-bold text-heading">{chart.title}</figcaption>
        <div role="img" aria-label={summary} className="space-y-3">
          {chart.values.map((v, i) => (
            <div key={chart.labels[i]} className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3 text-[14px] sm:grid-cols-[9rem_1fr_auto]">
              <span className="text-muted">{chart.labels[i]}</span>
              <span className="h-8 rounded-[3px] bg-line/50">
                <span
                  className={cn('block h-full rounded-[3px]', v === Math.min(...chart.values) ? 'bg-accent' : 'bg-[#6b7f94]')}
                  style={{ width: `${(v / max) * 100}%` }}
                />
              </span>
              <span className="font-bold text-heading">{fmt(v)}</span>
            </div>
          ))}
        </div>
        <p className="mt-5 text-[15px] text-muted">{chart.caption}</p>
        {srTable}
      </figure>
    )
  }

  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const x = (i: number) => PAD.left + (plotW / chart.values.length) * (i + 0.5)
  const y = (v: number) => PAD.top + plotH - (v / max) * plotH
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max)

  return (
    <figure className={cn(ruleCard, 'relative p-6')}>
      <figcaption className="mb-3 text-[15px] font-bold text-heading">{chart.title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary} className="aspect-[800/340] w-full" preserveAspectRatio="xMidYMid meet">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="stroke-line" />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fontSize="12" className="fill-muted">
              {Math.round(t * 10) / 10}
            </text>
          </g>
        ))}
        <polyline fill="none" className="stroke-accent" strokeWidth={3} points={chart.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />
        {chart.values.map((v, i) => (
          <g key={`l${i}`}>
            <circle cx={x(i)} cy={y(v)} r={4} className="fill-accent" />
            <text x={x(i)} y={y(v) - 8} textAnchor="middle" fontSize="13" fontWeight="700" className="fill-heading">
              {fmt(v)}
            </text>
            <text x={x(i)} y={H - 18} textAnchor="middle" fontSize="12" className="fill-muted">
              {chart.labels[i]}
            </text>
          </g>
        ))}
        <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} className="stroke-muted" />
      </svg>
      <p className="mt-3 text-[15px] text-muted">{chart.caption}</p>
      {srTable}
    </figure>
  )
}

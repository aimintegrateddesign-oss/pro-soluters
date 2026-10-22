import type { ReactNode } from 'react'

import { Container, Disclaimer, Eyebrow, NumberBadge, SampleBadge } from '@/components/ds/primitives'
import { siteSettings } from '@/data/site'
import type { CaseStudy } from '@/data/types'
import { formatDate } from '@/lib/utils'

export function CoverBand({ study, eyebrow }: { study: CaseStudy; eyebrow: string }) {
  const meta: [string, string][] = [
    ['Client', `${study.clientName} (${study.clientDescription})`],
    ['Prepared by', 'Pro Solutors'],
    ['Reference', study.referenceCode],
    ['Edition', `${study.isSample ? 'Sample, ' : ''}${formatDate(study.editionDate)}`],
  ]
  return (
    <>
      <div className="bg-dot-grid text-white">
        <Container className="pb-12 pt-[calc(var(--header-h)+3rem)]">
          <Eyebrow onNavy>{eyebrow}</Eyebrow>
          <h1 className="type-h1 mt-3 max-w-3xl">{study.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-on-navy-muted">{study.subtitle}</p>
          {study.isSample && (
            <div className="mt-8">
              <SampleBadge className="border-accent bg-transparent text-accent" />
            </div>
          )}
        </Container>
      </div>
      <div className="h-1.5 bg-accent" />
      <Container className="py-8">
        <dl className="grid max-w-3xl gap-x-8 gap-y-2 text-[15px] sm:grid-cols-[8rem_1fr]">
          {meta.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="font-bold text-heading">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        {study.isSample && <Disclaimer className="mt-6 max-w-2xl">{siteSettings.sampleDisclaimerText}</Disclaimer>}
      </Container>
    </>
  )
}

export function StudySection({ n, title, id, children }: { n: number; title: string; id: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="scroll-mt-24 py-10">
      <div className="flex items-center gap-4">
        <NumberBadge className="size-10 text-lg">{n}</NumberBadge>
        <h2 id={id} className="type-h2">
          {title}
        </h2>
      </div>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  )
}

export function Roadmap({ phases }: { phases: CaseStudy['phases'] }) {
  return (
    <ol className="grid gap-4 lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]" style={{ ['--n' as string]: phases.length }}>
      {phases.map((p, i) => (
        <li key={p.name} className="relative rounded-card border border-line bg-card p-5 lg:border-t-4 lg:border-t-accent">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-accent-strong">
            Step {i + 1} · {p.when}
          </span>
          <h3 className="mt-1 text-lg font-bold text-heading">{p.name}</h3>
          <p className="mt-2 text-[15px]">{p.focus}</p>
          <p className="mt-2 text-sm text-muted">
            <span className="font-bold">Goal:</span> {p.goal}
          </p>
        </li>
      ))}
    </ol>
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

/** DECISION: hand-rolled server-rendered SVG instead of Recharts. No client JS, no CLS (fixed aspect ratio),
 *  and the data is also exposed as a screen-reader table. */
export function ResultsChart({ chart }: { chart: CaseStudy['chart'] }) {
  const max = niceMax(Math.max(...chart.values))
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const x = (i: number) => PAD.left + (plotW / chart.values.length) * (i + 0.5)
  const y = (v: number) => PAD.top + plotH - (v / max) * plotH
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max)
  const barW = Math.min(64, (plotW / chart.values.length) * 0.6)
  const fmt = (v: number) => `${v.toLocaleString('en-US')}${chart.unit ?? ''}`
  const summary = `${chart.title}. ${chart.labels.map((l, i) => `${l}: ${fmt(chart.values[i])}`).join('; ')}.`

  return (
    <figure>
      <figcaption className="mb-3 text-sm font-bold text-muted">{chart.title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary} className="aspect-[800/340] w-full" preserveAspectRatio="xMidYMid meet">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#C3CED9" strokeOpacity={0.6} />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fontSize="12" fill="#7F93A8">
              {Math.round(t * 10) / 10}
            </text>
          </g>
        ))}
        {chart.type === 'bar' &&
          chart.values.map((v, i) => (
            <rect key={i} x={x(i) - barW / 2} y={y(v)} width={barW} height={y(0) - y(v)} rx={3} fill="#14A39A" />
          ))}
        {chart.type === 'line' && (
          <polyline
            fill="none"
            stroke="#14A39A"
            strokeWidth={3}
            points={chart.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
          />
        )}
        {chart.values.map((v, i) => (
          <g key={`l${i}`}>
            {chart.type === 'line' && <circle cx={x(i)} cy={y(v)} r={4} fill="#14A39A" />}
            <text x={x(i)} y={y(v) - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F2A47">
              {fmt(v)}
            </text>
            <text x={x(i)} y={H - 18} textAnchor="middle" fontSize="12" fill="#53667A">
              {chart.labels[i]}
            </text>
          </g>
        ))}
        <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} stroke="#7F93A8" />
      </svg>
      <p className="mt-3 text-[15px]">{chart.caption}</p>
      <table className="sr-only">
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
    </figure>
  )
}

import { ArrowRight, Check, MessageSquareQuote } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

import { Band, HeroContainer, HeroShell, SectionTitle, WIDE, otherTone, ruleCard, toneAt } from '@/components/ds/band'
import { Button, Container } from '@/components/ds/primitives'
import { HomeCta } from '@/components/home/HomeCta'
import { ReportSheet } from '@/components/sample-report/ReportSheet'
import { getSampleReportPage, getSiteSettings, pageMetadata } from '@/lib/queries/content'
import { cn } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const [{ seo: site }, { seo }] = await Promise.all([getSiteSettings(), getSampleReportPage()])
  return pageMetadata(
    seo,
    {
      title: 'Sample Report',
      description: 'See what a Pro Solutors feasibility report looks like: an illustrative example for a fictional company.',
      path: '/sample-reports',
    },
    site,
  )
}

const CASE_STUDY = '/case-studies/cooling-plant-replacement-options-study'
const tagClass = 'inline-flex items-center rounded-[3px] px-2.5 py-1 text-[12px] font-bold'

function ChecklistCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className={ruleCard}>
      <h3 className="text-lg font-bold text-heading">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2.5 text-[14px] text-muted">
            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-strong" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function SampleReportPage() {
  const { content } = await getSampleReportPage()

  // Lowest 10-year total is the recommended option; its table row is highlighted.
  const total = (value: string) => Number(value.replace(/,/g, ''))
  const bestTotal = Math.min(...content.options.rows.map((r) => total(r.total)))
  const numeric = 'whitespace-nowrap px-4 py-3 text-right tabular-nums'

  return (
    <>
      <HeroShell>
        <HeroContainer>
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="flex flex-wrap gap-2">
                <span className={cn(tagClass, 'bg-btn text-white')}>Solve and Prove</span>
                <span className={cn(tagClass, 'border border-line text-[#c3d0dd]')}>{content.hero.tag}</span>
              </p>
              <h1 className="mt-5 text-[clamp(2.25rem,4.6vw,4rem)] font-extrabold leading-[1.02] !tracking-[-0.035em] text-white">
                {content.hero.title} <span className="text-accent">{content.hero.accent}</span>
              </h1>
              <p className="mt-5 max-w-[32rem] text-lg text-[#c3d0dd]">{content.hero.intro}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href={CASE_STUDY} className="min-h-12 px-6 shadow-[0_8px_28px_-8px_rgba(45,212,196,0.55)]">
                  {content.hero.primaryCta}
                </Button>
                <Button href="#sample" tone="navy" variant="secondary" className="min-h-12 px-6 !border-line">
                  {content.hero.secondaryCta}
                </Button>
              </div>
            </div>
            <ReportSheet sheet={content.sheet} />
          </div>
        </HeroContainer>
      </HeroShell>

      <Band tone={toneAt(0)} id="sample" className="scroll-mt-20 py-12 sm:py-16">
        <Container className={WIDE}>
          <p className="rounded-[4px] border border-line border-l-[3px] border-l-btn bg-card p-4 text-[14px]">
            <b className="text-heading">Sample only.</b> {content.notice}
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className={cn(ruleCard, 'p-6 sm:p-8')}>
              <h2 className="text-2xl font-extrabold text-heading">{content.report.title}</h2>
              <dl className="mt-5 grid grid-cols-[7rem_1fr] gap-x-4 gap-y-2.5 text-[14px]">
                <dt className="text-muted">Client</dt>
                <dd>{content.report.client}</dd>
                <dt className="text-muted">Project</dt>
                <dd>{content.report.project}</dd>
                <dt className="text-muted">Decision needed</dt>
                <dd className="font-bold text-heading">{content.report.decision}</dd>
              </dl>
            </div>
            <div className="rounded-[4px] border border-accent/40 border-t-[3px] border-t-btn bg-tint p-6 sm:p-8">
              <h3 className="text-lg font-bold text-heading">
                <span className="mr-1 text-accent-strong">1</span> {content.summary.title}
              </h3>
              <p className="mt-3 text-[15px] text-muted">{content.summary.text}</p>
            </div>
          </div>
        </Container>
      </Band>

      <Band tone={toneAt(1)}>
        <Container className={WIDE}>
          <SectionTitle>
            <span className="text-accent-strong">2</span> {content.options.title}
          </SectionTitle>
          <p className="mb-8 mt-3 text-muted">{content.options.lead}</p>
          <div role="region" aria-label={content.options.title} tabIndex={0} className="overflow-x-auto rounded-[4px] border border-line bg-card">
            <table className="w-full min-w-[40rem] border-collapse text-left text-[15px]">
              <caption className="sr-only">{content.options.title}</caption>
              <thead>
                <tr className="border-b border-line text-[13px] text-heading">
                  <th scope="col" className="px-4 py-3 font-bold">Option</th>
                  {['Capital', 'Energy / yr', 'Maintenance / yr', '10-year total'].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 text-right font-bold">
                      {h}
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-3 font-bold">Main risk</th>
                </tr>
              </thead>
              <tbody>
                {content.options.rows.map((row) => {
                  const best = total(row.total) === bestTotal
                  return (
                    <tr key={row.option} className={cn('border-b border-line last:border-b-0', best && 'bg-accent/10')}>
                      <th scope="row" className={cn('px-4 py-3 font-semibold', best ? 'text-accent-strong' : 'text-heading')}>
                        {row.option}
                      </th>
                      <td className={numeric}>{row.capital}</td>
                      <td className={numeric}>{row.energy}</td>
                      <td className={numeric}>{row.maintenance}</td>
                      <td className={cn(numeric, 'font-bold', best ? 'text-accent-strong' : 'text-heading')}>{row.total}</td>
                      <td className="px-4 py-3 text-muted">{row.risk}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-5 max-w-[42rem] text-muted">{content.options.note}</p>
        </Container>
      </Band>

      <Band tone={toneAt(2)} className="py-12 sm:py-16">
        <Container className={cn(WIDE, 'grid gap-6 md:grid-cols-2 lg:grid-cols-3')}>
          <ChecklistCard title={`3. ${content.conditions.title}`} items={content.conditions.items} />
          <ChecklistCard title={`4. ${content.risks.title}`} items={content.risks.items} />
          <ChecklistCard title={`5. ${content.assumptions.title}`} items={content.assumptions.items} />
        </Container>
      </Band>

      <Band tone={toneAt(3)}>
        <Container className={cn(WIDE, 'grid gap-6 lg:grid-cols-2')}>
          <Link href={CASE_STUDY} className={cn(ruleCard, 'group flex flex-col overflow-hidden p-0 transition hover:-translate-y-[3px] hover:border-accent motion-reduce:hover:translate-y-0')}>
            <span className="relative block aspect-video bg-hero">
              <Image
                src={content.example.image.src}
                alt={content.example.image.alt}
                fill
                sizes="(min-width: 1024px) 600px, 100vw"
                className="object-cover"
              />
            </span>
            <span className="block p-6 sm:p-8">
              <span className="block text-xl font-extrabold text-heading">{content.example.title}</span>
              <span className="mt-2 block text-[15px] text-muted">{content.example.text}</span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent-strong">
                {content.example.linkLabel} <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
              </span>
            </span>
          </Link>

          <div className={cn(ruleCard, 'flex flex-col overflow-hidden p-0', !content.feedback.image.src && 'lg:self-start')}>
            {content.feedback.image.src && (
              <div className="relative aspect-[16/7] bg-hero">
                <Image src={content.feedback.image.src} alt={content.feedback.image.alt} fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover object-[50%_28%]" />
              </div>
            )}
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-[4px] border border-accent/30 bg-accent/10 text-accent-strong">
                  <MessageSquareQuote className="size-5" />
                </span>
                <h2 className="text-xl font-extrabold text-heading">{content.feedback.title}</h2>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">{content.feedback.text}</p>
              <Button href="/submit-a-problem" variant="secondary" className={cn('mt-6 self-start', content.feedback.image.src && 'lg:mt-auto')}>
                {content.feedback.buttonLabel}
              </Button>
            </div>
          </div>
        </Container>
      </Band>

      <HomeCta tone={otherTone(toneAt(3))} cta={content.cta} secondaryHref="/solutions/solve-and-prove" />
    </>
  )
}

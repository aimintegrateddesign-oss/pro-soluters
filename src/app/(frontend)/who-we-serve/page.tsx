import { Check } from 'lucide-react'
import Image from 'next/image'
import type { Metadata } from 'next'

import { Band, HeroContainer, HeroShell, WIDE, otherTone } from '@/components/ds/band'
import { Button, Container } from '@/components/ds/primitives'
import { HomeCta } from '@/components/home/HomeCta'
import { AudienceGrid } from '@/components/who-we-serve/AudienceGrid'
import { CapabilityMockup, DomainsVisual } from '@/components/who-we-serve/visuals'
import { getWhoWeServePage, pageMetadata } from '@/lib/queries/content'
import { cn } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getWhoWeServePage()
  return pageMetadata(
    seo,
    {
      title: 'Who We Serve & Domains',
      description: 'Pro Solutors serves engineering consultants, contractors, research centres and government institutions across every major engineering discipline.',
      path: '/who-we-serve',
    },
    { image: '/images/og-who-we-serve.jpg' },
  )
}

const eyebrow = 'flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.14em] text-accent-strong'
const h2 = 'text-balance text-[clamp(1.9rem,3.6vw,3rem)] font-extrabold leading-[1.05] text-heading'

function AudienceLabels({ labels, className }: { labels: string[]; className?: string }) {
  return (
    <ul aria-label="Who we serve" className={cn('flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold text-[#c3d0dd]', className)}>
      {labels.map((l) => (
        <li key={l} className="flex items-center gap-2">
          <span aria-hidden className="size-1.5 bg-accent" />
          {l}
        </li>
      ))}
    </ul>
  )
}

export default async function WhoWeServePage() {
  const { content } = await getWhoWeServePage()
  const { hero, audiences, domains, reassurance } = content

  return (
    <>
      <HeroShell>
        <HeroContainer>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:gap-14">
            <div>
              <p className="flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.14em] text-accent">
                <span aria-hidden className="h-px w-8 bg-accent" />
                {hero.eyebrow}
              </p>
              <h1 className="mt-5 text-balance text-[clamp(2.25rem,4.6vw,4.25rem)] font-extrabold leading-[1.04] !tracking-[-0.035em] text-white">
                {hero.title} <span className="text-accent">{hero.accent}</span>
              </h1>
              <p className="mt-5 text-xl font-semibold text-white">{hero.intro}</p>
              <p className="mt-3 max-w-[34rem] text-pretty text-[16px] leading-relaxed text-[#c3d0dd]">{hero.support}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href="/submit-a-problem" className="min-h-12 w-full px-7 sm:w-auto">
                  {hero.primaryLabel}
                </Button>
                <Button href="/solutions" tone="navy" variant="secondary" className="min-h-12 w-full px-7 !border-white/30 sm:w-auto">
                  {hero.secondaryLabel}
                </Button>
              </div>
              <AudienceLabels labels={hero.labels} className="mt-8 hidden border-t border-white/15 pt-5 lg:flex" />
            </div>

            <div>
              {hero.image.src && (
                <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] border border-line shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)]">
                  <Image src={hero.image.src} alt={hero.image.alt} fill priority sizes="(min-width: 1024px) 500px, 92vw" className="object-cover" />
                </div>
              )}
              <AudienceLabels labels={hero.labels} className="mt-6 lg:hidden" />
            </div>
          </div>
        </HeroContainer>
      </HeroShell>

      {/* Audiences */}
      <Band tone="light" aria-labelledby="audiences-title">
        <Container className={WIDE}>
          <h2 id="audiences-title" className={h2}>
            {audiences.title}
          </h2>
          <p className="mb-10 mt-3 max-w-[40rem] text-muted">{audiences.lead}</p>
          <AudienceGrid audiences={audiences.items} cardCta={audiences.cardCta} />
        </Container>
      </Band>

      {/* Domains */}
      <Band tone="light" aria-labelledby="domains-title">
        <Container className={cn(WIDE, 'grid items-center gap-12 lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)] lg:gap-20')}>
          <div>
            <p className={eyebrow}>
              <span aria-hidden className="h-px w-8 bg-btn" />
              {domains.eyebrow}
            </p>
            <h2 id="domains-title" className={cn(h2, 'mt-4')}>
              {domains.title}
            </h2>
            <p className="mt-4 max-w-[30rem] text-[17px] leading-relaxed text-muted">{domains.lead}</p>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {domains.items.map((d, i) => (
                <li key={d.name} className="flex items-center gap-3 rounded-[4px] border border-line border-l-[3px] border-l-btn bg-card px-4 py-3">
                  <span aria-hidden className="text-[11px] font-bold text-accent-strong">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-bold leading-tight text-heading">
                    {d.name}
                    {d.note && <small className="block text-[11px] font-normal text-muted">{d.note}</small>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {domains.image.src ? (
            <div className="relative aspect-square w-full max-w-[34rem] justify-self-center overflow-hidden rounded-[4px] border border-line lg:justify-self-end">
              <Image src={domains.image.src} alt={domains.image.alt} fill sizes="(min-width: 1024px) 540px, 92vw" className="object-cover" />
            </div>
          ) : (
            <DomainsVisual className="lg:justify-self-end" />
          )}
        </Container>
      </Band>

      {/* Institutional buyers */}
      <Band tone="light" className="!bg-tint" aria-labelledby="buyers-title">
        <Container className={cn(WIDE, 'grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20')}>
          <div className="order-last lg:order-first">
            {reassurance.image.src ? (
              <div className="relative mx-auto aspect-[4/3] w-full max-w-[32rem] overflow-hidden rounded-[4px] border border-line">
                <Image src={reassurance.image.src} alt={reassurance.image.alt} fill sizes="(min-width: 1024px) 480px, 92vw" className="object-cover" />
              </div>
            ) : (
              <CapabilityMockup />
            )}
          </div>
          <div>
            <p className={eyebrow}>
              <span aria-hidden className="h-px w-8 bg-btn" />
              {reassurance.eyebrow}
            </p>
            <h2 id="buyers-title" className={cn(h2, 'mt-4')}>
              {reassurance.title}
            </h2>
            <p className="mt-4 max-w-[34rem] text-[17px] leading-relaxed text-muted">{reassurance.lead}</p>
            <ul className="mt-7 space-y-3">
              {reassurance.items.map((r) => (
                <li key={r} className="flex items-start gap-3 text-[16px] text-ink">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent-strong" />
                  {r}
                </li>
              ))}
            </ul>
            {reassurance.ctaLabel && reassurance.ctaHref && (
              <Button href={reassurance.ctaHref} className="mt-8 min-h-12 w-full px-7 sm:w-auto">
                {reassurance.ctaLabel}
              </Button>
            )}
          </div>
        </Container>
      </Band>

      {/* The closing panel also shows the three steps after a submission (received, read by an engineer, clear next step). */}
      <HomeCta tone={otherTone('light')} cta={content.cta} secondaryHref="/solutions" />
    </>
  )
}

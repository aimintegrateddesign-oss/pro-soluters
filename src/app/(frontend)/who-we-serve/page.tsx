import { Check } from 'lucide-react'
import Image from 'next/image'
import type { Metadata } from 'next'

import { Band, HeroContainer, HeroShell, SectionTitle, WIDE, otherTone, toneAt } from '@/components/ds/band'
import { Container } from '@/components/ds/primitives'
import { HomeCta } from '@/components/home/HomeCta'
import { Reveal } from '@/components/motion/Reveal'
import { AudienceGrid } from '@/components/who-we-serve/AudienceGrid'
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

export default async function WhoWeServePage() {
  const { content } = await getWhoWeServePage()
  return (
    <>
      <HeroShell>
        <HeroContainer>
          <div className="grid items-end gap-6 lg:grid-cols-[2fr_1fr]">
            <h1 className="text-[clamp(2.25rem,4.6vw,4rem)] font-extrabold leading-[1.02] !tracking-[-0.035em] text-white">
              {content.hero.title} <span className="text-accent">{content.hero.accent}</span>
            </h1>
            <p className="text-lg text-[#c3d0dd]">{content.hero.intro}</p>
          </div>

          <div className="relative mt-10">
            <span aria-hidden className="absolute -left-3 -top-3 hidden size-8 border-l border-t border-accent lg:block" />
            <span aria-hidden className="absolute -bottom-3 -right-3 hidden size-8 border-b border-r border-accent lg:block" />
            <div className="relative aspect-[1671/941] overflow-hidden rounded-[4px] border border-line shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)]">
              <Image
                src="/images/who-we-serve.webp"
                alt="Engineers, managers and clients around a table reviewing an engineering analysis, with five audience groups shown above"
                fill
                priority
                sizes="(min-width: 1280px) 1240px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </HeroContainer>
      </HeroShell>

      <Band tone={toneAt(0)}>
        <Container className={WIDE}>
          <SectionTitle>{content.audiences.title}</SectionTitle>
          <p className="mb-10 mt-3 text-muted">{content.audiences.lead}</p>
          <AudienceGrid audiences={content.audiences.items} />
        </Container>
      </Band>

      <Band tone={toneAt(1)}>
        <Container className={WIDE}>
          <SectionTitle>{content.domains.title}</SectionTitle>
          <p className="mb-10 mt-3 text-muted">{content.domains.lead}</p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {content.domains.items.map((d, i) => (
              <li key={d.name}>
                <Reveal delay={(i % 4) * 0.1} tilt={20} lift={40}>
                  <div
                    className={cn(
                      'group flex h-full min-h-[6.5rem] flex-col justify-between rounded-[4px] border border-line border-t-[3px] border-t-btn bg-card p-3.5 transition-colors',
                      'hover:border-accent hover:bg-btn motion-reduce:transition-none',
                    )}
                  >
                    <span className="text-[11px] font-bold text-accent group-hover:text-white">{String(i + 1).padStart(2, '0')}</span>
                    <span className="mt-4 block font-bold leading-tight text-heading group-hover:text-white">
                      {d.name}
                      {d.note && <small className="mt-0.5 block text-[11px] font-normal text-muted group-hover:text-white/90">{d.note}</small>}
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Band>

      <Band tone={toneAt(2)} className="!bg-tint">
        <Container className={cn(WIDE, 'grid items-start gap-10 lg:grid-cols-[1fr_1.6fr]')}>
          <div>
            <SectionTitle>{content.reassurance.title}</SectionTitle>
            <p className="mt-3 max-w-[22rem] text-muted">{content.reassurance.lead}</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {content.reassurance.items.map((r) => (
              <li key={r} className="flex items-start gap-3 rounded-[4px] border border-line bg-card p-4 text-[15px]">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-strong" />
                {r}
              </li>
            ))}
          </ul>
        </Container>
      </Band>

      <HomeCta tone={otherTone(toneAt(2))} cta={content.cta} secondaryHref="/solutions" />
    </>
  )
}

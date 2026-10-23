import type { Metadata } from 'next'
import { LayoutGrid, RefreshCw, ShieldCheck } from 'lucide-react'

import { Container } from '@/components/ds/primitives'
import { HomeCta } from '@/components/home/HomeCta'
import { HomeHero } from '@/components/home/HomeHero'
import { SolutionRow } from '@/components/home/SolutionRow'
import { SolutionStack } from '@/components/home/SolutionStack'
import { Reveal } from '@/components/motion/Reveal'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { homeContent, siteSettings } from '@/data/site'
import { getSolutions } from '@/lib/queries/solutions'

export const metadata: Metadata = {
  title: { absolute: `Pro Solutors | ${siteSettings.tagline}` },
  alternates: { canonical: '/' },
}

const whyIcons = [LayoutGrid, RefreshCw, ShieldCheck]

const cardBase = 'h-full rounded-[4px] border border-line border-t-[3px] border-t-btn bg-card p-6 shadow-[0_12px_30px_-18px_rgba(15,42,71,0.35)]'

export default async function HomePage() {
  const solutions = await getSolutions()

  return (
    <SmoothScroll>
      {/* Sections alternate navy (theme-dark) and white (theme-light), whatever the OS colour scheme. */}
      <div className="overflow-x-clip">
        <HomeHero image={{ src: '/images/hero.webp', alt: 'Engineer in a hard hat reviewing a 3D building model on a tablet at a rooftop plant' }} />

        <section className="theme-light bg-bg py-16 sm:py-20">
          <Container className="!max-w-[77.5rem]">
            <div className="mb-10 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <h2 className="max-w-[34rem] text-[clamp(1.9rem,3.6vw,3rem)] font-extrabold leading-[1.05] text-heading">{homeContent.whyTitle}</h2>
              <p className="text-muted">{homeContent.whyLead}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {homeContent.why.map((c, i) => {
                const Icon = whyIcons[i]
                return (
                  <Reveal key={c.title} delay={i * 0.14}>
                    <div className={cardBase}>
                      <Icon aria-hidden className="mb-5 size-6 text-accent-strong" />
                      <h3 className="text-lg font-bold text-heading">{c.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.text}</p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </Container>
        </section>

        <section className="theme-dark bg-bg py-16 sm:py-20">
          <Container className="!max-w-[77.5rem]">
            <div className="mb-10">
              <h2 className="text-[clamp(1.9rem,3.6vw,3rem)] font-extrabold leading-[1.05] text-heading">{homeContent.solutionsTitle}</h2>
              <p className="mt-3 text-muted">{homeContent.solutionsLead}</p>
            </div>
            {/* Alternating layout: image left, then right, then left. */}
            <SolutionStack cards={solutions.map((s, i) => <SolutionRow key={s.slug} solution={s} flip={i % 2 === 1} />)} />
          </Container>
        </section>

        <section className="theme-light bg-alt py-16 sm:py-20">
          <Container className="!max-w-[77.5rem]">
            <div className="mb-10">
              <h2 className="text-[clamp(1.9rem,3.6vw,3rem)] font-extrabold leading-[1.05] text-heading">{homeContent.pathTitle}</h2>
              <p className="mt-3 text-muted">{homeContent.pathLead}</p>
            </div>
            <ol className="grid gap-5 md:grid-cols-3 lg:items-end lg:pt-24">
              {homeContent.path.map((c, i) => (
                <li key={c.title} className={['', 'lg:mb-12', 'lg:mb-24'][i]}>
                  <Reveal delay={i * 0.18} tilt={-30} lift={90}>
                    <div className={`${cardBase} border-b-[3px] border-b-btn`}>
                      <span aria-hidden className="mb-4 inline-flex size-9 items-center justify-center rounded-[4px] bg-btn font-bold text-white">
                        {i + 1}
                      </span>
                      <h3 className="text-lg font-bold text-heading">{c.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.text}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <HomeCta />
      </div>
    </SmoothScroll>
  )
}

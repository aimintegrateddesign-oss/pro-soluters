import { ClipboardCheck, Clock, Cog, Database } from 'lucide-react'

import { Button } from '@/components/ds/primitives'
import { HeroVideo } from '@/components/home/HeroVideo'
import type { homePage } from '@/data/site'
import { cn } from '@/lib/utils'

const icons = { 'search-check': ClipboardCheck, 'trending-up': Cog, database: Database }

/**
 * Home hero: the background video (see HeroVideo) with the headline, the two calls to action and the three solution
 * pillars centred on top. Text comes from the Home page global in Payload. Without the video (reduced motion, or the
 * file failing to load) it is the plain navy gradient.
 */
export function HomeHero({ hero, promiseText }: { hero: (typeof homePage)['hero']; promiseText: string }) {
  return (
    <section
      className="theme-dark relative isolate flex min-h-svh flex-col justify-center overflow-x-clip text-white"
      style={{ background: 'linear-gradient(105deg, #0b2442, #0a1626)' }}
    >
      <HeroVideo src="/hero-video.mp4" />

      <div className="mx-auto w-full max-w-[77.5rem] px-5 pb-12 pt-[calc(var(--header-h)+2rem)] sm:pb-16">
        <div className="fade-up mx-auto flex max-w-[52rem] flex-col items-center text-center">
          <p className="flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.14em] text-accent">
            <span aria-hidden className="h-px w-8 bg-accent" />
            {hero.eyebrow}
            <span aria-hidden className="h-px w-8 bg-accent" />
          </p>

          <h1 className="mt-5 max-w-[48rem] text-balance text-[clamp(2.25rem,4.8vw,4.5rem)] font-extrabold leading-[1.04] !tracking-[-0.035em] text-white">
            {hero.headline} <span className="text-accent">{hero.headlineAccent}</span>
          </h1>

          <p className="mt-5 max-w-[38rem] text-pretty text-[clamp(1rem,1.2vw,1.125rem)] leading-relaxed text-[#d5dfe9] sm:mt-6">{hero.intro}</p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
            <Button href="/submit-a-problem" className="min-h-12 w-full px-7 shadow-[0_8px_28px_-8px_rgba(45,212,196,0.55)] sm:w-auto">
              {hero.primaryCta}
            </Button>
            <Button href="/solutions" tone="navy" variant="secondary" className="min-h-12 w-full px-7 !border-white/30 sm:w-auto">
              {hero.secondaryCta}
            </Button>
          </div>

          <ul className="mt-10 grid w-full max-w-[46rem] grid-cols-1 border-t border-white/20 sm:mt-12 sm:grid-cols-3">
            {hero.stages.map((s, i) => {
              const Icon = icons[s.icon]
              return (
                <li key={s.label} className={cn('flex flex-col items-center py-3.5 sm:px-4 sm:py-5', i > 0 && 'border-t border-white/10 sm:border-l sm:border-t-0 sm:border-white/20')}>
                  <span aria-hidden className="hidden size-9 items-center justify-center rounded-[4px] border border-accent/30 bg-accent/10 text-accent sm:flex">
                    <Icon className="size-[18px]" />
                  </span>
                  <p className="text-[15px] font-bold text-white sm:mt-3">{s.label}</p>
                  <p className="mt-0.5 max-w-[16rem] text-[13px] leading-snug text-[#c3d0dd]">{s.text}</p>
                </li>
              )
            })}
          </ul>

          <p className="flex w-full max-w-[46rem] items-center justify-center gap-2.5 border-t border-white/20 pt-4 text-[13px] text-[#c3d0dd]">
            <Clock aria-hidden className="size-4 shrink-0 text-accent" />
            {promiseText}
          </p>
        </div>
      </div>
    </section>
  )
}

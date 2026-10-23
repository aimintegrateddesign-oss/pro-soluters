'use client'

import { ClipboardCheck, Clock, Cog, Database } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ds/primitives'
import { useMediaQuery } from '@/components/motion/useMediaQuery'
import { useTilt } from '@/components/motion/useTilt'
import type { homePage } from '@/data/site'
import { cn } from '@/lib/utils'

const icons = { 'search-check': ClipboardCheck, 'trending-up': Cog, database: Database }
const CYCLE_MS = 3800
// Position of each floating tile on the photo, in percent. Layout tuning, so it stays in code.
const TILES = [
  { left: 11.8, top: 18.6 },
  { left: 32.2, top: 9.8 },
  { left: 53.1, top: 14.3 },
]

/**
 * Home hero. A tilting 3D plane (photo, three floating solution tiles, an info panel) reads scroll and pointer
 * position. Tiles and the pillar buttons under the headline are one control: both pick the active solution.
 * Resting state (no scroll, no pointer, reduced motion) is a flat, finished layout.
 */
export function HomeHero({ hero, promiseText, image }: { hero: (typeof homePage)['hero']; promiseText: string; image: { src: string; alt: string } }) {
  const heroStages = hero.stages
  const heroRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const coarse = useMediaQuery('(hover: none)')
  const k = coarse ? 0.5 : 1

  const [active, setActive] = useState(0)
  const [held, setHeld] = useState(false)
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    if (held || pinned || reduce) return
    const id = setInterval(() => setActive((a) => (a + 1) % heroStages.length), CYCLE_MS)
    return () => clearInterval(id)
  }, [held, pinned, reduce])

  const choose = (i: number) => {
    setActive(i)
    setPinned(true)
  }

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const h = useTransform(scrollYProgress, [0, 0.8], [0, 1])
  const { mx, my, bind } = useTilt()
  const rotateY = useTransform([mx, h], ([x, v]: number[]) => k * (-9 + x * 5 + v * 9))
  const rotateX = useTransform([my, h], ([y, v]: number[]) => k * (3 - y * 3 - v * 4))
  const z = useTransform(h, [0, 1], [0, -60])
  const panelY = useTransform(h, [0, 1], [0, -40])

  const stage = heroStages[active]

  return (
    <section
      ref={heroRef}
      {...bind}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'touch') setHeld(true)
      }}
      onFocus={() => setHeld(true)}
      onPointerLeave={() => {
        bind.onPointerLeave()
        setHeld(false)
      }}
      onBlur={() => setHeld(false)}
      className="relative isolate overflow-x-clip text-white"
      style={{ background: 'linear-gradient(105deg, #0b2442, #0a1626)' }}
    >
      <div aria-hidden className="bg-blueprint absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-[77.5rem] px-5 pb-10 pt-[calc(var(--header-h)+2rem)] lg:min-h-[min(100svh,760px)] lg:pb-14 lg:pt-[calc(var(--header-h)+3rem)]">
        <div className="fade-up max-w-[34rem]">
          <p className="mb-5 flex items-center gap-2.5 text-[13px] font-bold text-accent">
            <span aria-hidden className="size-2 bg-accent" />
            {hero.eyebrow}
          </p>
          <h1 className="text-[clamp(2.25rem,4.4vw,4rem)] font-extrabold leading-[1.02] !tracking-[-0.035em] text-white">
            {hero.headline} <span className="text-accent">{hero.headlineAccent}</span>
          </h1>
          <p className="mt-6 max-w-[30rem] text-[17px] leading-relaxed text-[#c3d0dd]">
            {hero.intro}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/submit-a-problem" className="min-h-12 px-6 shadow-[0_8px_28px_-8px_rgba(45,212,196,0.55)]">
              {hero.primaryCta}
            </Button>
            <Button href="/solutions" tone="navy" variant="secondary" className="min-h-12 px-6 !border-line">
              {hero.secondaryCta}
            </Button>
          </div>

          <ul className="mt-9 grid grid-cols-3 border-y border-line">
            {heroStages.map((s, i) => {
              const Icon = icons[s.icon]
              const on = i === active
              return (
                <li key={s.label} className={cn('border-line', i > 0 && 'border-l')}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => choose(i)}
                    className={cn(
                      'flex min-h-11 w-full flex-col items-start gap-1 border-t-2 px-3 py-3.5 text-left transition-colors sm:px-4',
                      on ? 'border-accent bg-accent/10' : 'border-transparent hover:bg-white/5',
                    )}
                  >
                    <Icon aria-hidden className="size-5 text-accent" />
                    <span className="text-[15px] font-bold text-white">{s.label}</span>
                    <span className="text-[12px] leading-snug text-[#a3b3c4]">{s.text}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          <p className="mt-5 flex items-center gap-2.5 text-[13px] text-[#a3b3c4]">
            <Clock aria-hidden className="size-4 shrink-0 text-accent" />
            {promiseText}
          </p>
        </div>
      </div>

      {/* 3D stage. Below lg it sits under the copy; from lg it fills the right half of the hero. */}
      <div
        className="relative mx-5 mb-3 aspect-[4/5] sm:aspect-[5/4] lg:absolute lg:inset-y-0 lg:left-[47%] lg:right-0 lg:mx-0 lg:mb-0 lg:aspect-auto lg:pb-12 lg:pt-[calc(var(--header-h)+2.5rem)]"
        style={{ perspective: 1700, perspectiveOrigin: '30% 30%' }}
      >
        <motion.div
          suppressHydrationWarning className="rm-flat relative size-full"
          style={reduce ? { transformStyle: 'preserve-3d' } : { rotateY, rotateX, z, transformStyle: 'preserve-3d' }}
        >
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ maskImage: 'linear-gradient(90deg, transparent 0%, #000 22%)', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 22%)' }}
          >
            <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1024px) 53vw, 100vw" className="object-cover object-[78%_center]" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0a1626]/50 via-transparent to-transparent" />
          </div>

          <span aria-hidden className="absolute -top-3 left-[14%] hidden h-8 w-12 border-l border-t border-accent lg:block" />
          <span aria-hidden className="absolute -bottom-3 right-3 hidden size-8 border-b border-r border-accent lg:block" />

          {heroStages.map((s, i) => {
            const Icon = icons[s.icon]
            const on = i === active
            return (
              <motion.button
                key={s.label}
                type="button"
                aria-pressed={on}
                aria-label={`Show ${s.title}`}
                onClick={() => choose(i)}
                animate={reduce ? undefined : { z: on ? 95 : 36, scale: on ? 1.1 : 1 }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                className={cn(
                  'absolute flex aspect-square min-h-11 min-w-11 items-center justify-center rounded-[4px] border transition-[background-color,box-shadow,border-color] duration-[450ms]',
                  on
                    ? 'border-accent bg-btn text-white shadow-[0_0_28px_rgba(45,212,196,0.55)]'
                    : 'border-accent/40 bg-[#0e1d30]/85 text-accent backdrop-blur-sm hover:border-accent',
                )}
                style={{ left: `${TILES[i].left}%`, top: `${TILES[i].top}%`, width: '11.4%' }}
              >
                <Icon aria-hidden className="size-[46%]" />
              </motion.button>
            )
          })}

          <motion.div
            aria-live="polite"
            suppressHydrationWarning className="rm-flat absolute bottom-[7%] left-[3%] w-[min(19rem,78%)] rounded-[4px] border border-accent/40 bg-[#0a1626]/95 p-4 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)]"
            style={reduce ? undefined : { z: 120, y: panelY }}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-[12px] font-semibold text-accent">{stage.kicker}</p>
              <span aria-hidden className="mt-1.5 flex gap-1">
                {heroStages.map((s, i) => (
                  <span key={s.label} className={cn('h-0.5 w-3.5', i === active ? 'bg-accent' : 'bg-white/25')} />
                ))}
              </span>
            </div>
            <p className="mt-1 text-[19px] font-extrabold leading-tight text-white [font-family:var(--font-display)]">{stage.title}</p>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="whitespace-nowrap text-2xl font-extrabold leading-none text-accent [font-family:var(--font-display)]">{stage.stat}</span>
              <span className="text-[12px] leading-snug text-[#a3b3c4]">{stage.statNote}</span>
            </div>
            <p className="mt-3 border-t border-line pt-2.5 text-[12px] text-[#a3b3c4]">
              Entry offer: <span className="font-semibold text-white">{stage.offer}</span>
            </p>
          </motion.div>
        </motion.div>
        <p className="absolute bottom-3 right-0 hidden text-[11px] text-[#8fa2b6] lg:block">{hero.figuresNote}</p>
      </div>
      <p className="px-5 pb-6 text-right text-[11px] text-[#8fa2b6] lg:hidden">{hero.figuresNote}</p>
    </section>
  )
}

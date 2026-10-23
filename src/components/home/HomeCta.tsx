'use client'

import { Check, Square } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

import { Button } from '@/components/ds/primitives'
import { useTilt } from '@/components/motion/useTilt'
import type { Cta } from '@/data/site'
import { cn } from '@/lib/utils'

const fields = [
  ['Organisation', 'Contractor'],
  ['Discipline', 'HVAC'],
  ['Solution', 'Not sure yet'],
  ['Urgency', 'Within 3 months'],
]

const facts = [
  ['2 days', 'working days to a clear reply'],
  ['Engineer', 'reads every submission'],
  ['NDA first', 'on request, before details'],
]

/**
 * Closing call to action with a tilting 3D "submission ticket". Flat and complete at rest and for reduced motion.
 * The text comes from the page's Payload content; `tone` is the colour of the band around the panel (the panel is always navy).
 * Leave `cta.secondaryLabel` empty to hide the second button.
 */
export function HomeCta({
  cta,
  primaryHref = '/submit-a-problem',
  secondaryHref,
  tone = 'dark',
}: {
  cta: Cta
  primaryHref?: string
  secondaryHref?: string
  tone?: 'dark' | 'light'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { mx, my, bind } = useTilt()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.96', 'start 0.54'] })
  const rotateY = useTransform(mx, (x) => -14 + x * 10)
  const rotateX = useTransform([my, scrollYProgress], ([y, p]: number[]) => 8 - y * 8 + (1 - p) * 24)

  return (
    <section className={cn(tone === 'dark' ? 'theme-dark bg-hero' : 'theme-light bg-bg', 'px-5 py-14 sm:py-20')}>
      <div
        ref={ref}
        className="theme-dark bg-blueprint relative mx-auto max-w-[77.5rem] overflow-hidden rounded-[4px] border border-line border-t-2 border-t-accent bg-[#0b2038] px-6 py-10 sm:px-12 sm:py-14 lg:overflow-visible"
      >
        <span aria-hidden className="absolute right-4 top-4 size-6 border-r border-t border-accent" />
        <span aria-hidden className="absolute bottom-4 left-4 size-6 border-b border-l border-accent" />

        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="mb-4 flex items-center gap-2.5 text-[13px] font-bold text-accent">
              <span aria-hidden className="size-2 bg-accent" />
              {cta.eyebrow}
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.02] text-white">{cta.title}</h2>
            <p className="mt-4 max-w-[30rem] text-[17px] text-[#c3d0dd]">{cta.body}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={primaryHref} className="min-h-12 px-6 shadow-[0_8px_28px_-8px_rgba(45,212,196,0.55)]">
                {cta.primaryLabel}
              </Button>
              {cta.secondaryLabel && secondaryHref && (
                <Button href={secondaryHref} tone="navy" variant="secondary" className="min-h-12 px-6 !border-line">
                  {cta.secondaryLabel}
                </Button>
              )}
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-5">
              {facts.map(([t, d]) => (
                <div key={t}>
                  <dt className="text-lg font-extrabold leading-tight text-white [font-family:var(--font-display)]">{t}</dt>
                  <dd className="mt-0.5 text-[12px] leading-snug text-[#a3b3c4]">{d}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div aria-hidden className="mx-auto w-full max-w-[24rem] py-4 lg:max-w-none" style={{ perspective: 1200 }} {...bind}>
            <motion.div
              suppressHydrationWarning className="rm-flat relative mx-auto w-full max-w-[24rem]"
              style={reduce ? { transformStyle: 'preserve-3d' } : { rotateY, rotateX, transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 rounded-[4px] bg-[#16314f]" style={{ transform: 'translateZ(-80px) translate(26px,-16px)' }} />
              <div className="absolute inset-0 rounded-[4px] bg-[#1b3a5c]" style={{ transform: 'translateZ(-40px) translate(13px,-8px)' }} />
              <div className="relative overflow-hidden rounded-[4px] bg-[#f4f8fb] text-[#0a1626] shadow-[0_28px_60px_-20px_rgba(0,0,0,0.75)]">
                <div className="flex items-center justify-between bg-[#0a1626] px-4 py-3">
                  <span className="text-[13px] font-bold text-white">New submission</span>
                  <span className="rounded-[2px] bg-accent px-2 py-0.5 text-[11px] font-bold text-[#06201e]">In review</span>
                </div>
                <dl className="space-y-1.5 px-4 py-4 text-[13px]">
                  {fields.map(([k, v]) => (
                    <div key={k} className="flex gap-4">
                      <dt className="w-24 shrink-0 text-[#4a5d70]">{k}</dt>
                      <dd className="font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="space-y-2.5 border-t border-[#d3dde6] px-4 pb-8 pt-4 text-[13px]">
                  <li className="flex items-center gap-2.5">
                    <span className="flex size-5 items-center justify-center rounded-[3px] bg-btn text-white">
                      <Check className="size-3.5" />
                    </span>
                    Received<span className="ml-auto text-[#4a5d70]">Today</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="flex size-5 items-center justify-center rounded-[3px] border-2 border-btn text-btn">
                      <Square className="size-2 fill-current" />
                    </span>
                    Read by an engineer<span className="ml-auto font-semibold text-[#0b6b65]">In progress</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#4a5d70]">
                    <span className="size-5 rounded-[3px] border-2 border-[#b9c6d2]" />
                    Clear yes or no, and a next step
                  </li>
                </ul>
              </div>
              <span
                className="absolute -bottom-3 -left-4 rounded-[3px] bg-btn px-3 py-1.5 text-[12px] font-bold text-white shadow-lg"
                style={{ transform: 'translateZ(70px)' }}
              >
                Free problem review
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

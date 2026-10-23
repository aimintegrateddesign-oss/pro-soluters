'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

import { useMediaQuery } from '@/components/motion/useMediaQuery'
import { useTilt } from '@/components/motion/useTilt'
import type { sampleReportPage } from '@/data/site'
import { cn } from '@/lib/utils'

/**
 * Decorative mini feasibility report: three sheets stacked in depth. The stack turns with the pointer, and as the page
 * scrolls it flattens and the back sheets fan out. Resting state (and reduced motion) is a flat stack with a small
 * offset. Hidden from assistive tech: the same facts are on the page as text.
 */
export function ReportSheet({ sheet }: { sheet: (typeof sampleReportPage)['sheet'] }) {
  const { reference, title, recommendation, recommendationText, scores } = sheet
  const best = scores.find((s) => s.best)

  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const k = useMediaQuery('(hover: none)') ? 0.5 : 1
  const { mx, my, bind } = useTilt()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const h = useTransform(scrollYProgress, [0, 0.8], [0, 1])

  const rotateY = useTransform([mx, h], ([x, v]: number[]) => k * (-18 + x * 8 + v * 12))
  const rotateX = useTransform([my, h], ([y, v]: number[]) => k * (10 - y * 5 - v * 6))
  const midX = useTransform(h, [0, 1], [0, 18])
  const midY = useTransform(h, [0, 1], [0, -9])
  const backX = useTransform(h, [0, 1], [0, 30])
  const backY = useTransform(h, [0, 1], [0, -16])

  return (
    <div ref={ref} aria-hidden className="mx-auto w-full max-w-[27rem] py-6 pr-6" style={{ perspective: 1600 }} {...bind}>
      <motion.div
        suppressHydrationWarning
        className="rm-flat relative"
        style={reduce ? { transformStyle: 'preserve-3d' } : { rotateY, rotateX, transformStyle: 'preserve-3d' }}
      >
        <motion.div
          suppressHydrationWarning
          className="rm-flat absolute inset-0 translate-x-10 -translate-y-5 rotate-[5deg] rounded-[3px] bg-[#b9c9d8]"
          style={reduce ? undefined : { z: -80, x: backX, y: backY }}
        />
        <motion.div
          suppressHydrationWarning
          className="rm-flat absolute inset-0 translate-x-5 -translate-y-2.5 rotate-[2.5deg] rounded-[3px] bg-[#d3dee9]"
          style={reduce ? undefined : { z: -40, x: midX, y: midY }}
        />
        <div className="relative rounded-[3px] bg-white p-5 text-[#0a1626] shadow-[0_28px_60px_-20px_rgba(0,0,0,0.75)]">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-base font-extrabold tracking-tight [font-family:var(--font-display)]">
              Pro<span className="text-[#0e7c75]">Solutors</span>
            </span>
            <span className="font-mono text-[#4a5d70]">{reference}</span>
          </div>
          <div className="mt-2 h-0.5 bg-[#0e7c75]" />
          <p className="mt-3 text-[11px] font-bold text-[#0e7c75]">Feasibility Proof Report</p>
          <p className="mt-1 text-lg font-extrabold leading-tight [font-family:var(--font-display)]">{title}</p>
          <div className="mt-3 rounded-[3px] border border-[#0e7c75]/30 bg-[#e6f5f3] p-3 text-[12px] leading-snug">
            <b>Recommendation: {recommendation}</b>
            <span className="mt-0.5 block text-[#33475a]">{recommendationText}</span>
          </div>
          <ul className="mt-4 space-y-2 text-[12px]">
            {scores.map((s) => (
              <li key={s.label} className="grid grid-cols-[6.5rem_1fr_1.5rem] items-center gap-2">
                <span className={cn('text-[#33475a]', s.best && 'font-bold text-[#0a1626]')}>{s.label}</span>
                <span className="h-2 rounded-full bg-[#e3eaf0]">
                  <span className={cn('block h-full rounded-full', s.best ? 'bg-[#0e7c75]' : 'bg-[#8497aa]')} style={{ width: `${s.score}%` }} />
                </span>
                <span className="text-right font-bold">{s.score}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[10px] text-[#4a5d70]">Illustrative sample, not real client data.</p>
        </div>
        <motion.span
          suppressHydrationWarning
          className="rm-flat absolute -bottom-4 right-0 rounded-[3px] bg-[#0e7c75] px-3 py-1.5 text-[12px] font-bold text-white shadow-lg"
          style={reduce ? undefined : { z: 80 }}
        >
          Weighted score {best?.score} / 100
        </motion.span>
      </motion.div>
    </div>
  )
}

'use client'

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef, type ReactNode } from 'react'

import { Reveal } from '@/components/motion/Reveal'
import { useMediaQuery } from '@/components/motion/useMediaQuery'

/**
 * Solution cards. From lg each card sticks near the top and sinks (scale, tilt, dim) as the next one slides over it.
 * Below lg, and for reduced motion, the cards are a plain list with the tip-up reveal: sticky stacking needs
 * viewport-tall room that phones do not have.
 */
export function SolutionStack({ cards }: { cards: ReactNode[] }) {
  const reduce = useReducedMotion()
  const desktop = useMediaQuery('(min-width: 1024px)')

  if (!desktop || reduce) {
    return (
      <div className="flex flex-col gap-6">
        {cards.map((card, i) => (
          <Reveal key={i} delay={0.12}>
            {card}
          </Reveal>
        ))}
      </div>
    )
  }

  return <DesktopStack cards={cards} />
}

// Separate component so useScroll only runs when its target ref is actually rendered.
function DesktopStack({ cards }: { cards: ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  return (
    <div ref={ref} className="flex flex-col gap-12" style={{ perspective: 1600 }}>
      {cards.map((card, i) => (
        <StackCard key={i} i={i} n={cards.length} progress={scrollYProgress}>
          {card}
        </StackCard>
      ))}
    </div>
  )
}

function StackCard({ i, n, progress, children }: { i: number; n: number; progress: MotionValue<number>; children: ReactNode }) {
  const last = i === n - 1
  const s = useTransform(progress, [i / n, (i + 1) / n], last ? [0, 0] : [0, 1])
  const scale = useTransform(s, [0, 1], [1, 0.93])
  const rotateX = useTransform(s, [0, 1], [0, 7])
  const y = useTransform(s, [0, 1], [0, -12])
  const filter = useTransform(s, (v) => `brightness(${1 - v * 0.4})`)

  return (
    <div className="sticky" style={{ top: 100 + i * 18 }}>
      <motion.div style={{ scale, rotateX, y, filter, transformOrigin: '50% 0%' }}>{children}</motion.div>
    </div>
  )
}

'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Tip-up reveal: the card rises and flattens as it scrolls into view. The scroll ref sits on an untransformed
 * outer div so the transform never changes what is measured. At rest (and for reduced motion) it is flat.
 */
export function Reveal({
  children,
  delay = 0,
  tilt = 30,
  lift = 70,
  className,
}: {
  children: ReactNode
  delay?: number
  tilt?: number
  lift?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.96', 'start 0.54'] })
  const p = useTransform(scrollYProgress, [delay, 1], [0, 1])
  const rotateX = useTransform(p, [0, 1], [tilt, 0])
  const y = useTransform(p, [0, 1], [lift, 0])
  const opacity = useTransform(p, [0, 1], [0.25, 1])

  return (
    <div ref={ref} style={{ perspective: 1200 }} className={cn('h-full', className)}>
      <motion.div suppressHydrationWarning className="rm-flat h-full" style={reduce ? undefined : { rotateX, y, opacity, transformOrigin: '50% 100%' }}>
        {children}
      </motion.div>
    </div>
  )
}

'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Cards that arrive one after another: when the group scrolls into view, each card tips up out of the floor in turn
 * (`index` sets the order), then stays put. Plays once. Reduced motion shows the cards immediately.
 */
export function SequentialReveal({ index, children, step = 0.4 }: { index: number; children: ReactNode; step?: number }) {
  const reduce = useReducedMotion()
  if (reduce) return <>{children}</>
  return (
    <div className="h-full" style={{ perspective: 1200 }}>
      <motion.div
        className="h-full"
        style={{ transformOrigin: '50% 100%' }}
        initial={{ opacity: 0, rotateX: -38, y: 80, scale: 0.96 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, delay: index * step, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}

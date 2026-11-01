'use client'

import { useInView } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'

import { useMediaQuery } from '@/components/motion/useMediaQuery'

/** Reveal a step once on entry without adding wrappers or changing its resting styles. */
export function StepReveal({ children, index, className }: { children: ReactNode; index: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    const card = ref.current
    if (!inView || reduce || !card?.animate) return
    const animation = card.animate(
      [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 500, delay: index * 120, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'backwards' },
    )
    return () => animation.cancel()
  }, [inView, reduce, index])

  return <div ref={ref} className={className}>{children}</div>
}

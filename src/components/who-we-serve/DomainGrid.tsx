'use client'

import { useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { useMediaQuery } from '@/components/motion/useMediaQuery'
import { cn } from '@/lib/utils'

type Domain = { name: string; note?: string }
const HIGHLIGHT_MS = 1_000

/** Highlight each discipline for one second while the list is visible, then repeat in order. */
export function DomainGrid({ domains }: { domains: Domain[] }) {
  const ref = useRef<HTMLUListElement>(null)
  const inView = useInView(ref, { amount: 0.2 })
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [activeIndex, setActiveIndex] = useState(0)
  const count = domains.length

  useEffect(() => {
    if (!inView || reduce || count < 2) return
    setActiveIndex(0)
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % count), HIGHLIGHT_MS)
    return () => window.clearInterval(timer)
  }, [inView, reduce, count])

  return (
    <ul ref={ref} className="mt-8 grid grid-cols-2 gap-3">
      {domains.map((domain, i) => {
        const active = !reduce && i === activeIndex % count
        return (
          <li key={domain.name} className={cn('flex items-center gap-3 rounded-[4px] border border-line px-4 py-3', active ? 'bg-btn' : 'bg-card')}>
            <span aria-hidden className={cn('text-[11px] font-bold', active ? 'text-white' : 'text-accent-strong')}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className={cn('font-bold leading-tight', active ? 'text-white' : 'text-heading')}>
              {domain.name}
              {domain.note && <small className={cn('block text-[11px] font-normal', active ? 'text-white' : 'text-muted')}>{domain.note}</small>}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

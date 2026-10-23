'use client'

import { useMotionValue, useSpring } from 'motion/react'
import type { PointerEvent } from 'react'

/** Pointer position over an element as springy -1..1 values. Touch is ignored; values ease back to 0 on leave. */
export function useTilt() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mx = useSpring(x, { stiffness: 140, damping: 20 })
  const my = useSpring(y, { stiffness: 140, damping: 20 })
  const bind = {
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === 'touch') return
      const r = e.currentTarget.getBoundingClientRect()
      x.set(((e.clientX - r.left) / r.width - 0.5) * 2)
      y.set(((e.clientY - r.top) / r.height - 0.5) * 2)
    },
    onPointerLeave: () => {
      x.set(0)
      y.set(0)
    },
  }
  return { mx, my, bind }
}

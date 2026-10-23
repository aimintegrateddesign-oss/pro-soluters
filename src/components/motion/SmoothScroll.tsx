'use client'

import { ReactLenis, type LenisRef } from 'lenis/react'
import { cancelFrame, frame, useReducedMotion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import 'lenis/dist/lenis.css'

/** Smooth wheel scrolling, driven by Motion's frame loop so scroll-linked values never drift. Off for reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const update = (d: { timestamp: number }) => lenisRef.current?.lenis?.raf(d.timestamp)
    frame.update(update, true)
    return () => cancelFrame(update)
  }, [])

  if (reduce) return <>{children}</>
  return (
    <ReactLenis root options={{ autoRaf: false, lerp: 0.1 }} ref={lenisRef}>
      {children}
    </ReactLenis>
  )
}

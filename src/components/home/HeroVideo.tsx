'use client'

import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

/**
 * Looping, muted background video for the home hero, with the dark overlay that keeps the text readable on top of it.
 *
 * It renders nothing (so the hero keeps its navy gradient and blueprint grid) until the browser is ready to play, and
 * stays that way for visitors who prefer reduced motion, or if the file fails to load. It also pauses while the hero is
 * scrolled out of view.
 */
export function HeroVideo({ src }: { src: string }) {
  const reduce = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  // The video is added after hydration, so nothing is downloaded on the server render and there is no hydration mismatch.
  useEffect(() => setMounted(true), [])

  // Save battery and CPU: play only while the hero is on screen.
  useEffect(() => {
    const video = videoRef.current
    if (!video || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void video.play().catch(() => undefined)
      else video.pause()
    })
    io.observe(video)
    return () => io.disconnect()
  }, [mounted, reduce])

  if (!mounted || reduce || failed) return null

  return (
    <>
      <video
        ref={videoRef}
        aria-hidden
        tabIndex={-1}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        disableRemotePlayback
        onCanPlay={() => setReady(true)}
        onError={() => setFailed(true)}
        // Keep the desk, laptop and hands in frame on wide screens; on narrow screens favour the left of the picture.
        className={cn('absolute inset-0 -z-20 size-full object-cover object-[40%_60%] transition-opacity duration-1000 sm:object-[50%_60%]', ready ? 'opacity-100' : 'opacity-0')}
      >
        <source src={src} type="video/mp4" />
      </video>
      {/* Overlay: navy wash for overall contrast, strongest behind the centred text and easing toward the edges so the film still shows, plus a soft fade at top and bottom. */}
      <div
        aria-hidden
        className={cn('absolute inset-0 -z-10 transition-opacity duration-1000', ready ? 'opacity-100' : 'opacity-0')}
        style={{
          background:
            'linear-gradient(180deg, rgba(10,22,38,0.4) 0%, rgba(10,22,38,0) 18%, rgba(10,22,38,0) 82%, rgba(10,22,38,0.5) 100%), radial-gradient(ellipse 75% 70% at 50% 50%, rgba(10,22,38,0.66) 0%, rgba(10,22,38,0.56) 55%, rgba(10,22,38,0.4) 100%)',
        }}
      />
    </>
  )
}

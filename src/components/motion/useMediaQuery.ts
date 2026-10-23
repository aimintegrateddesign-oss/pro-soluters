'use client'

import { useSyncExternalStore } from 'react'

/** Subscribes to a CSS media query. Server and first client render report `false`, so hydration matches. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', notify)
      return () => mq.removeEventListener('change', notify)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

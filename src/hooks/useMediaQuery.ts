'use client'

import { useSyncExternalStore } from 'react'

/** `undefined` on the server and during hydration, like react-responsive's SSR behavior. */
export function useMediaQuery(query: string): boolean | undefined {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => undefined
  )
}

export const DESKTOP_QUERY = '(min-width: 992px)'
export const useIsDesktop = () => useMediaQuery(DESKTOP_QUERY)

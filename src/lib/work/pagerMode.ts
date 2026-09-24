'use client'

import { useSyncExternalStore } from 'react'

export type PagerMode = 'horizontal' | 'vertical'

/** What visitors get. Switch to 'vertical' once the team decides. */
export const DEFAULT_PAGER: PagerMode = 'horizontal'

const KEY = 'tf-pager'
const EVENT = 'tf-pager-change'

function read(): PagerMode {
  // ?pager=vertical|horizontal wins and is remembered for the next project pages
  const q = new URLSearchParams(window.location.search).get('pager')
  if (q === 'vertical' || q === 'horizontal') {
    try {
      localStorage.setItem(KEY, q)
    } catch {}
    return q
  }
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'vertical' || saved === 'horizontal') return saved
  } catch {}
  return DEFAULT_PAGER
}

export function setPagerMode(mode: PagerMode) {
  try {
    localStorage.setItem(KEY, mode)
  } catch {}
  const url = new URL(window.location.href)
  if (url.searchParams.has('pager')) {
    url.searchParams.set('pager', mode)
    window.history.replaceState(window.history.state, '', url)
  }
  window.dispatchEvent(new Event(EVENT))
}

/** `undefined` during SSR/hydration (the pager renders nothing until the viewport is known anyway). */
export function usePagerMode(): PagerMode | undefined {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener(EVENT, cb)
      window.addEventListener('storage', cb)
      return () => {
        window.removeEventListener(EVENT, cb)
        window.removeEventListener('storage', cb)
      }
    },
    read,
    () => undefined
  )
}

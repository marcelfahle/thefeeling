'use client'

import { usePathname } from 'next/navigation'
import { useLayoutEffect, useRef } from 'react'
import { pickPalette } from '@/lib/palette/palette'

/** The old Header re-randomized its palette on every page mount; re-pick on each navigation. */
export default function PaletteRouter() {
  const pathname = usePathname()
  const first = useRef(true)
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false // the boot script already picked one for the first paint
      return
    }
    document.documentElement.setAttribute('data-palette', String(pickPalette(location.search)))
  }, [pathname])
  return null
}

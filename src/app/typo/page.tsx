import type { Metadata } from 'next'
import TypeSpecimen from '@/components/typo/TypeSpecimen'
import { CATALOG, ENABLED, SIZE_STEPS, cssStack, type FontId } from '@/lib/fonts/catalog'

export const metadata: Metadata = {
  title: 'Font shortlist',
  robots: { index: false, follow: false },
}

/** Internal picker for the editor's Font menu (not linked from the site). */
export default function TypoPage() {
  const fonts = (Object.keys(CATALOG) as FontId[]).map((id) => ({
    id,
    family: CATALOG[id].family,
    role: CATALOG[id].role,
    why: CATALOG[id].why,
    stack: cssStack(CATALOG[id]),
    enabled: ENABLED.includes(id),
  }))
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-css-tags -- only this page loads the candidate fonts */}
      <link rel="stylesheet" href="/fonts/specimen/specimen.css" />
      <TypeSpecimen fonts={fonts} sizes={SIZE_STEPS} />
    </>
  )
}

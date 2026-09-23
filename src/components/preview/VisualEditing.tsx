'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ContentLink } from 'react-datocms/content-link'
import { usePreview } from './PreviewContext'

/** Click-to-edit overlays + navigation sync with the DatoCMS Web Previews "Visual" tab. */
export default function VisualEditing() {
  const router = useRouter()
  const pathname = usePathname()
  const { layoutMode } = usePreview()
  if (layoutMode) return null // tiles are drag targets in layout mode
  return <ContentLink onNavigateTo={(path) => router.push(path)} currentPath={pathname} />
}

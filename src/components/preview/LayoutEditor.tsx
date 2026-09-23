'use client'

import type { IParallax } from '@react-spring/parallax'
import type { CollageItem } from '@/lib/datocms/queries'
import type { CollageKind } from '@/components/collage/CollageTile'

export default function LayoutEditor(props: {
  items: CollageItem[]
  kind: CollageKind
  parallaxRef: React.RefObject<IParallax | null>
}) {
  void props
  return null
}

'use client'

import Collage from '@/components/collage/Collage'
import type { CollageKind } from '@/components/collage/CollageTile'
import type { CollageItem } from '@/lib/datocms/queries'
import type { Subscription } from '@/lib/datocms/subscription'
import { useRealtime } from './useRealtime'

type Data = {
  items: CollageItem[]
  background: { [k: string]: { url: string } | null } | null
}

export default function RealtimeCollage({
  subscription,
  kind,
  bgKey,
}: {
  subscription: Subscription<Data, unknown>
  kind: CollageKind
  bgKey: 'oeuvre' | 'archive'
}) {
  const data = useRealtime(subscription)
  return <Collage items={data.items} kind={kind} bg={data.background?.[bgKey]?.url} />
}

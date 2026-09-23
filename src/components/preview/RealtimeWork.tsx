'use client'

import { useEffect, useState } from 'react'
import { stripStega } from 'react-datocms/stega'
import { getBoldVideosAction } from '@/actions/preview'
import WorkPager, { type WorkData } from '@/components/work/WorkPager'
import type { BoldVideo } from '@/lib/bold'
import type { Subscription } from '@/lib/datocms/subscription'
import { useRealtime } from './useRealtime'

type Data = {
  work: WorkData | null
  background: { detail: { url: string } | null } | null
}

export default function RealtimeWork({
  subscription,
  archive,
  initialBoldVideos,
}: {
  subscription: Subscription<Data, { slug: string }>
  archive: boolean
  initialBoldVideos: Record<string, BoldVideo>
}) {
  const data = useRealtime(subscription)
  const [boldVideos, setBoldVideos] = useState(initialBoldVideos)
  const ids = (data.work?.subPages ?? []).map((s) => (s.boldVideoId ? stripStega(s.boldVideoId) : '')).filter(Boolean)
  const missing = ids.filter((id) => !boldVideos[id]).join(',')

  useEffect(() => {
    if (!missing) return
    let cancelled = false
    getBoldVideosAction(missing.split(','))
      .then((v) => !cancelled && setBoldVideos((prev) => ({ ...prev, ...v })))
      .catch(console.error)
    return () => {
      cancelled = true
    }
  }, [missing])

  if (!data.work) return <p style={{ padding: 40 }}>This record no longer exists in the draft.</p>
  return <WorkPager work={data.work} archive={archive} bg={data.background?.detail?.url} boldVideos={boldVideos} />
}

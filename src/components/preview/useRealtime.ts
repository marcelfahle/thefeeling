'use client'

import { useEffect } from 'react'
import { useQuerySubscription } from 'react-datocms/use-query-subscription'
import type { Subscription } from '@/lib/datocms/subscription'
import { useRealtimeStatus } from './PreviewContext'

/** Live draft data for editor sessions; reports connection status to the preview toolbar. */
export function useRealtime<R, V>(subscription: Subscription<R, V>): R {
  const { initialData, ...options } = subscription
  const { data, status, error } = useQuerySubscription<R, V>({
    ...options,
    initialData,
  } as never)
  const setStatus = useRealtimeStatus()
  useEffect(() => setStatus(status), [status, setStatus])
  useEffect(() => {
    if (error) console.error('DatoCMS realtime error', error)
  }, [error])
  return data ?? initialData
}

'use client'

import About from '@/components/about/About'
import type { AboutResult } from '@/lib/datocms/queries'
import type { Subscription } from '@/lib/datocms/subscription'
import { useRealtime } from './useRealtime'

export default function RealtimeAbout({ subscription }: { subscription: Subscription<AboutResult, unknown> }) {
  return <About data={useRealtime(subscription)} />
}

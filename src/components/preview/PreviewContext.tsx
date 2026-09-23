'use client'

import { createContext, useContext, useMemo, useState } from 'react'
type ConnectionStatus = 'connecting' | 'connected' | 'closed'
import type { Role } from '@/lib/preview/session'

export type RealtimeStatus = ConnectionStatus | 'off'

type PreviewState = {
  enabled: boolean
  role: Role | null
  realtime: RealtimeStatus
  setRealtime: (s: RealtimeStatus) => void
  /** false = all parallax speeds 0 (tiles at rest positions) */
  motion: boolean
  setMotion: (m: boolean) => void
  layoutMode: boolean
  setLayoutMode: (m: boolean) => void
  /** true while the current page renders a collage (enables Motion/Layout toggles) */
  onCollage: boolean
  setOnCollage: (v: boolean) => void
}

const noop = () => {}
const PUBLIC: PreviewState = {
  enabled: false,
  role: null,
  realtime: 'off',
  setRealtime: noop,
  motion: true,
  setMotion: noop,
  layoutMode: false,
  setLayoutMode: noop,
  onCollage: false,
  setOnCollage: noop,
}

const Ctx = createContext<PreviewState>(PUBLIC)

export function PreviewProvider({ role, children }: { role: Role | null; children: React.ReactNode }) {
  const [realtime, setRealtime] = useState<RealtimeStatus>('off')
  const [motion, setMotion] = useState(true)
  const [layoutMode, setLayoutMode] = useState(false)
  const [onCollage, setOnCollage] = useState(false)
  const value = useMemo(
    () => ({
      enabled: true,
      role,
      realtime,
      setRealtime,
      motion: motion && !layoutMode,
      setMotion,
      layoutMode: layoutMode && role === 'editor',
      setLayoutMode,
      onCollage,
      setOnCollage,
    }),
    [role, realtime, motion, layoutMode, onCollage]
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const usePreview = () => useContext(Ctx)
export const useRealtimeStatus = () => useContext(Ctx).setRealtime

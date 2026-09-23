'use server'

import { z } from 'zod'
import { getBoldVideos } from '@/lib/bold'
import { getPreview } from '@/lib/preview/isPreview'
import { POPOUT_TTL_MS, SHARE_TTL_MS, isSafeRedirectUrl, signSession } from '@/lib/preview/session'

/** Realtime editors: re-fetch Bold metadata when `boldVideoId`s change in a draft. */
export async function getBoldVideosAction(ids: unknown) {
  const { enabled } = await getPreview()
  if (!enabled) throw new Error('Forbidden')
  return getBoldVideos(z.array(z.string().max(64)).max(100).parse(ids))
}

async function linkFor(path: unknown, role: 'viewer' | 'editor', ttl: number) {
  const { enabled, role: current } = await getPreview()
  if (!enabled || current !== 'editor') throw new Error('Forbidden')
  const p = z.string().max(2048).parse(path)
  if (!isSafeRedirectUrl(p)) throw new Error('Invalid path')
  const t = signSession({ role, exp: Date.now() + ttl, path: p })
  return `/api/draft-mode/share?t=${encodeURIComponent(t)}`
}

/** View-only link for stakeholders (7 days). Returns a path; the client prefixes its origin. */
export async function createShareLink(path: unknown) {
  return linkFor(path, 'viewer', SHARE_TTL_MS)
}

/** Short-lived editor link to open the current preview in a top-level tab (partitioned iframe cookies don't carry over). */
export async function createPopoutLink(path: unknown) {
  return linkFor(path, 'editor', POPOUT_TTL_MS)
}

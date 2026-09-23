import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { enableDraftModeForIframes, setSessionCookie } from '@/lib/preview/cookies'
import { EDITOR_TTL_MS, isSafeRedirectUrl } from '@/lib/preview/session'

/** Called by the Web Previews plugin (Visual tab and "draft" links): `?token=…&redirect=/path` */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const target = request.nextUrl.searchParams.get('redirect') || '/'
  if (!process.env.PREVIEW_SECRET || token !== process.env.PREVIEW_SECRET)
    return new Response('Invalid token', { status: 401 })
  if (!isSafeRedirectUrl(target)) return new Response('URL must be relative!', { status: 422 })

  await enableDraftModeForIframes()
  await setSessionCookie({ role: 'editor', exp: Date.now() + EDITOR_TTL_MS })
  redirect(target)
}

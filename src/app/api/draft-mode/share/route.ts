import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { enableDraftModeForIframes, setSessionCookie } from '@/lib/preview/cookies'
import { isSafeRedirectUrl, verifySession } from '@/lib/preview/session'

/** Share links (viewer, 7 days) and pop-out links (editor, 10 min): `?t=<signed {role, exp, path}>` */
export async function GET(request: NextRequest) {
  const t = request.nextUrl.searchParams.get('t')
  const session = verifySession(t)
  if (!session) return new Response('This preview link is invalid or has expired.', { status: 401 })
  const target = isSafeRedirectUrl(session.path) ? session.path : '/'

  await enableDraftModeForIframes()
  await setSessionCookie(session, t!)
  redirect(target)
}

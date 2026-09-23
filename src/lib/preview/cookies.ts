import 'server-only'
import type { NextResponse } from 'next/server'
import { SESSION_COOKIE, signSession, type Session } from './session'

const iframeSafe = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  partitioned: true,
  path: '/',
} as const

/**
 * Next sets `__prerender_bypass` with SameSite=Lax, which the DatoCMS iframe drops.
 * Re-set it as SameSite=None + Partitioned (datocms/nextjs-starter-kit `makeDraftModeWorkWithinIframes`).
 */
export function makeDraftModeWorkWithinIframes(res: NextResponse, bypassValue: string | undefined) {
  if (bypassValue) res.cookies.set('__prerender_bypass', bypassValue, iframeSafe)
}

export function setSessionCookie(res: NextResponse, session: Session) {
  res.cookies.set(SESSION_COOKIE, signSession(session), {
    ...iframeSafe,
    expires: new Date(session.exp),
  })
}

export function clearPreviewCookies(res: NextResponse) {
  for (const name of [SESSION_COOKIE, '__prerender_bypass']) res.cookies.set(name, '', { ...iframeSafe, maxAge: 0 })
}

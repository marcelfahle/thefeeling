import 'server-only'
import { cookies, draftMode } from 'next/headers'
import { SESSION_COOKIE, signSession, type Session } from './session'

const iframeSafe = { httpOnly: true, secure: true, sameSite: 'none', partitioned: true, path: '/' } as const

/**
 * Enables Next draft mode and re-sets `__prerender_bypass` as SameSite=None + Partitioned, so it
 * survives inside the DatoCMS iframe (datocms/nextjs-starter-kit `makeDraftModeWorkWithinIframes`).
 */
export async function enableDraftModeForIframes() {
  const draft = await draftMode()
  draft.enable()
  const store = await cookies()
  const bypass = store.get('__prerender_bypass')
  if (bypass) store.set({ name: bypass.name, value: bypass.value, ...iframeSafe })
}

export async function setSessionCookie(session: Session, value = signSession(session)) {
  ;(await cookies()).set({ name: SESSION_COOKIE, value, ...iframeSafe, expires: new Date(session.exp) })
}

export async function clearPreview() {
  ;(await draftMode()).disable()
  const store = await cookies()
  // partitioned cookies are only removed by a partitioned deletion
  for (const name of [SESSION_COOKIE, '__prerender_bypass']) store.set({ name, value: '', ...iframeSafe, maxAge: 0 })
}

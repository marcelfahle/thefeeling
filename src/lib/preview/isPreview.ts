import 'server-only'
import { cookies, draftMode } from 'next/headers'
import { cache } from 'react'
import { SESSION_COOKIE, verifySession, type Role } from './session'

export type Preview = { enabled: boolean; role: Role | null; expired: boolean }

/** Draft content only when Next draft mode is on AND a valid, unexpired preview session exists. */
export const getPreview = cache(async (): Promise<Preview> => {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return { enabled: false, role: null, expired: false }
  const session = verifySession((await cookies()).get(SESSION_COOKIE)?.value)
  if (!session) return { enabled: false, role: null, expired: true }
  return { enabled: true, role: session.role, expired: false }
})

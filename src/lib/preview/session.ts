import { createHmac, timingSafeEqual } from 'node:crypto'

export type Role = 'editor' | 'viewer'
export type Session = { role: Role; exp: number; path?: string }

export const SESSION_COOKIE = 'tf_preview'
export const EDITOR_TTL_MS = 12 * 60 * 60 * 1000
export const SHARE_TTL_MS = 7 * 24 * 60 * 60 * 1000
export const POPOUT_TTL_MS = 10 * 60 * 1000

const b64url = (buf: Buffer | string) => Buffer.from(buf).toString('base64url')

function secret(): string {
  const s = process.env.PREVIEW_SESSION_SECRET
  if (!s) throw new Error('PREVIEW_SESSION_SECRET is not set')
  return s
}

function mac(payload: string, key: string) {
  return createHmac('sha256', key).update(payload).digest()
}

/** `<base64url(json)>.<base64url(hmac)>` */
export function signSession(session: Session, key = secret()): string {
  const payload = b64url(JSON.stringify(session))
  return `${payload}.${b64url(mac(payload, key))}`
}

/** Returns the session when the signature is valid and it has not expired; otherwise null. */
export function verifySession(value: string | undefined | null, now = Date.now(), key = secret()): Session | null {
  if (!value) return null
  const [payload, sig] = value.split('.')
  if (!payload || !sig) return null
  const expected = mac(payload, key)
  const given = Buffer.from(sig, 'base64url')
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  try {
    const s = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Session
    if (s.role !== 'editor' && s.role !== 'viewer') return null
    if (typeof s.exp !== 'number' || s.exp <= now) return null
    return s
  } catch {
    return null
  }
}

/** Only same-origin relative paths: "/foo", never "//evil" or "https://…". */
export function isSafeRedirectUrl(url: string | null | undefined): url is string {
  if (!url || !url.startsWith('/') || url.startsWith('//') || url.startsWith('/\\')) return false
  try {
    const u = new URL(url, 'http://x.invalid')
    return u.origin === 'http://x.invalid'
  } catch {
    return false
  }
}

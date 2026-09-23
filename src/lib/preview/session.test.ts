import { describe, expect, it } from 'vitest'
import { isSafeRedirectUrl, signSession, verifySession } from './session'

const KEY = 'test-key'

describe('session', () => {
  it('round-trips', () => {
    const t = signSession({ role: 'editor', exp: 2000 }, KEY)
    expect(verifySession(t, 1000, KEY)).toEqual({ role: 'editor', exp: 2000 })
  })
  it('rejects expiry', () => {
    const t = signSession({ role: 'viewer', exp: 2000 }, KEY)
    expect(verifySession(t, 2000, KEY)).toBeNull()
  })
  it('rejects tampering', () => {
    const t = signSession({ role: 'viewer', exp: 2000 }, KEY)
    const [, sig] = t.split('.')
    const forged = `${Buffer.from(JSON.stringify({ role: 'editor', exp: 2000 })).toString('base64url')}.${sig}`
    expect(verifySession(forged, 1000, KEY)).toBeNull()
    expect(verifySession(t, 1000, 'other-key')).toBeNull()
    expect(verifySession('garbage', 1000, KEY)).toBeNull()
    expect(verifySession(undefined, 1000, KEY)).toBeNull()
  })
  it('rejects unknown roles', () => {
    const t = signSession({ role: 'admin' as never, exp: 2000 }, KEY)
    expect(verifySession(t, 1000, KEY)).toBeNull()
  })
})

describe('isSafeRedirectUrl', () => {
  it.each([
    ['/oeuvre', true],
    ['/oeuvre/foo?focus=1#12', true],
    ['//evil.com', false],
    ['/\\evil.com', false],
    ['https://evil.com', false],
    ['javascript:alert(1)', false],
    ['', false],
    [null, false],
  ])('%s → %s', (url, ok) => expect(isSafeRedirectUrl(url)).toBe(ok))
})

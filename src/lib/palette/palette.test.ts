import { describe, expect, it } from 'vitest'
import { PALETTES, pickPalette } from './palette'

describe('pickPalette', () => {
  it('returns an index within range', () => {
    for (let k = 0; k < 200; k++) {
      const i = pickPalette('')
      expect(i).toBeGreaterThanOrEqual(0)
      expect(i).toBeLessThan(PALETTES.length)
    }
    expect(pickPalette('', () => 0.999999)).toBe(4)
    expect(pickPalette('', () => 0)).toBe(0)
  })
  it('honors ?__palette', () => {
    expect(pickPalette('?__palette=3')).toBe(3)
    expect(pickPalette('?foo=1&__palette=0')).toBe(0)
  })
  it('ignores invalid forced values', () => {
    expect(pickPalette('?__palette=9', () => 0)).toBe(0)
    expect(pickPalette('?__palette=x', () => 0.5)).toBe(2)
  })
})

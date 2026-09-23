import { describe, expect, it } from 'vitest'
import fixture from './__fixtures__/portfolio.json'
import {
  cssLeft,
  cssMaxWidth,
  dwToWidth,
  dxToXPosition,
  dyToYOffset,
  layerOffsets,
  layerSpeed,
  moveTile,
  pageCount,
} from './math'

/** Literal JS port of PortfolioScroller2.js render loop + calculateHeight/realPageNum. */
function oldOffsets(items: { yOffset: number | null }[]) {
  let offset = 0
  return items.map((e, i) => {
    offset -= e.yOffset as number
    return i === 0 ? 0 : 0 - offset / 100
  })
}
function oldPages(items: { yOffset: number | null }[], winHeight: number) {
  const offset = items.reduce((c, e) => c + (e.yOffset as number) / 100, 0)
  const maxHeight = offset * winHeight + winHeight / 1.2
  return Math.ceil(maxHeight / winHeight)
}

const ys = (fixture as { yOffset: number | null }[]).map((f) => f.yOffset)

describe('forward math matches the Gatsby formulas', () => {
  it('fixture has real data', () => expect(ys.length).toBeGreaterThan(10))
  it('offsets', () => {
    const a = layerOffsets(ys)
    const b = oldOffsets(fixture as { yOffset: number | null }[])
    a.forEach((v, i) => expect(v).toBeCloseTo(b[i], 10))
  })
  it('page count', () => {
    for (const h of [700, 800, 900, 1080])
      expect(pageCount(ys)).toBe(oldPages(fixture as { yOffset: number | null }[], h))
  })
  it('pins tile 0 while its y_offset still shifts the rest', () => {
    expect(layerOffsets([50, 100, 20])).toEqual([0, 1.5, 1.7])
  })
  it('treats null as 0', () => {
    expect(layerOffsets([null, 100, null])).toEqual([0, 1, 1])
    expect(pageCount([null, null])).toBe(1)
    expect(layerSpeed(null)).toBe(0)
    expect(layerSpeed(25)).toBe(0.25)
  })
  it('css helpers', () => {
    expect(cssLeft(0)).toBe('auto')
    expect(cssLeft(null)).toBe('auto')
    expect(cssLeft(34)).toBe('34%')
    expect(cssMaxWidth(null)).toBe('100%')
    expect(cssMaxWidth(100)).toBe('100%')
    expect(cssMaxWidth(60)).toBe('60%')
  })
})

describe('inverse math', () => {
  it('rounds and clamps', () => {
    expect(dyToYOffset(100, 900)).toBe(11)
    expect(dxToXPosition(10, 144, 1440)).toBe(20)
    expect(dxToXPosition(95, 500, 1000)).toBe(100)
    expect(dxToXPosition(5, -500, 1000)).toBe(0)
    expect(dwToWidth(50, -1000, 1000)).toBe(10)
    expect(dwToWidth(190, 1000, 1000)).toBe(200)
  })
  it('moveTile keeps later tiles in place by default', () => {
    const y = [0, 100, 50, 80]
    const before = layerOffsets(y)
    const after = layerOffsets(moveTile(y, 2, 11))
    expect(after[2] - before[2]).toBeCloseTo(0.11)
    expect(after[1]).toBe(before[1])
    expect(after[3]).toBeCloseTo(before[3])
  })
  it('moveTile with push shifts every later tile', () => {
    const y = [0, 100, 50, 80]
    const before = layerOffsets(y)
    const after = layerOffsets(moveTile(y, 1, -20, true))
    for (let i = 1; i < y.length; i++) expect(after[i] - before[i]).toBeCloseTo(-0.2)
  })
  it('moveTile on the last tile does not need compensation', () => {
    expect(moveTile([0, 10, 20], 2, 5)).toEqual([0, 10, 25])
  })
  it('tile 0 is a no-op', () => {
    expect(moveTile([30, 100], 0, 50)).toEqual([30, 100])
  })
  it('px → units → px round trip stays within 1 unit', () => {
    const vh = 900
    for (const px of [-250, -37, 0, 13, 100, 451]) {
      const units = dyToYOffset(px, vh)
      expect(Math.abs((units / 100) * vh - px)).toBeLessThanOrEqual(vh / 100)
    }
  })
})

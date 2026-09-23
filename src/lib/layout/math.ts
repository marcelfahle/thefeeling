export const n = (v: number | null | undefined) => v ?? 0

/** PortfolioScroller2.js:193-196 — tile 0 pinned at 0; others at cumulative y_offset/100 (tile 0's y_offset included). */
export function layerOffsets(yOffsets: (number | null | undefined)[]): number[] {
  let sum = 0
  return yOffsets.map((y, i) => {
    sum += n(y)
    return i === 0 ? 0 : sum / 100
  })
}

/** PortfolioScroller2.js:118-149 — ceil((Σ y/100 · vh + vh/1.2) / vh) */
export function pageCount(yOffsets: (number | null | undefined)[]): number {
  const total = yOffsets.reduce<number>((a, y) => a + n(y) / 100, 0)
  return Math.ceil(total + 1 / 1.2)
}

/** PortfolioScroller2.js:194 — `speed / 100 || 0` */
export const layerSpeed = (speed: number | null | undefined) => n(speed) / 100

/** PortfolioItem.js:121 */
export const cssLeft = (x: number | null | undefined) => (x ? `${x}%` : 'auto')
/** PortfolioItem.js:122-123 */
export const cssMaxWidth = (w: number | null | undefined) => (!w || w === 100 ? '100%' : `${w}%`)

// ---- inverse direction (layout mode) ----

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
export const LIMITS = {
  xPosition: [0, 100],
  width: [10, 200],
  speed: [-90, 90],
} as const

/** px → field units (fields are integers) */
export const dyToYOffset = (dyPx: number, viewportH: number) => Math.round((dyPx / viewportH) * 100)
export const dxToXPosition = (x0: number, dxPx: number, containerW: number) =>
  clamp(Math.round(x0 + (dxPx / containerW) * 100), ...LIMITS.xPosition)
export const dwToWidth = (w0: number, dwPx: number, containerW: number) =>
  clamp(Math.round(w0 + (dwPx / containerW) * 100), ...LIMITS.width)

/** Move tile i by d units. Default keeps all later tiles in place by compensating tile i+1. */
export function moveTile(y: (number | null | undefined)[], i: number, d: number, pushBelow = false): number[] {
  const next = y.map(n)
  if (i === 0 || d === 0) return next // tile 0 is pinned at 0 (PortfolioScroller2.js:196)
  next[i] += d
  if (!pushBelow && i + 1 < next.length) next[i + 1] -= d
  return next
}

/**
 * Turns a stream of wheel events (mouse wheel or trackpad with inertia) into single
 * "next / previous" steps: one step per gesture, however long its inertia tail is.
 * Pure, so it can be unit-tested with synthetic event streams.
 */
export type WheelPagerOptions = {
  /** accumulated |deltaY| (px) needed to trigger a step */
  threshold?: number
  /** quiet time (ms) after which the next wheel event starts a new gesture */
  gestureGap?: number
  /** a delta this many times larger than the decaying tail counts as a fresh flick */
  reaccelerate?: number
}

export function createWheelPager(opts: WheelPagerOptions = {}) {
  const threshold = opts.threshold ?? 24
  const gap = opts.gestureGap ?? 140
  const boost = opts.reaccelerate ?? 1.8
  let acc = 0
  let last = -Infinity
  let lastMag = 0
  let fired = false // this gesture already produced a step

  /** Feed one event; returns +1 / -1 when the page should move, else 0. */
  return function onWheel(deltaY: number, now: number): -1 | 0 | 1 {
    const mag = Math.abs(deltaY)
    const quiet = now - last > gap
    const fresh = fired && mag > 8 && mag > lastMag * boost
    last = now
    if (quiet || fresh) {
      acc = 0
      fired = false
    }
    lastMag = mag
    if (fired) return 0
    acc += deltaY
    if (Math.abs(acc) < threshold) return 0
    fired = true
    const dir = acc > 0 ? 1 : -1
    acc = 0
    return dir
  }
}

/** Normalizes WheelEvent.deltaY to pixels (Firefox can report lines). */
export const wheelPixels = (e: { deltaY: number; deltaMode: number }) =>
  e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * 800 : e.deltaY

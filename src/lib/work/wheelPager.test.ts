import { describe, expect, it } from 'vitest'
import { createWheelPager } from './wheelPager'

/** Simulates a trackpad flick: big deltas decaying over ~1s, one event every 16ms. */
function flick(start: number, t0: number, sign = 1) {
  const events: [number, number][] = []
  let d = start
  let t = t0
  while (d > 0.5) {
    events.push([sign * d, t])
    d *= 0.93
    t += 16
  }
  return { events, end: t }
}

const run = (events: [number, number][], pager = createWheelPager()) => events.map(([d, t]) => pager(d, t))
const steps = (r: number[]) => r.filter((x) => x !== 0)

describe('wheel pager', () => {
  it('one trackpad flick with a long inertia tail = one step', () => {
    expect(steps(run(flick(60, 0).events))).toEqual([1])
  })
  it('one mouse-wheel notch = one step', () => {
    expect(steps(run([[100, 0]]))).toEqual([1])
  })
  it('separate notches after a pause = separate steps, both directions', () => {
    expect(
      steps(
        run([
          [100, 0],
          [-100, 400],
          [100, 800],
        ])
      )
    ).toEqual([1, -1, 1])
  })
  it('a fresh flick during the previous tail is picked up', () => {
    const a = flick(60, 0)
    const pager = createWheelPager()
    const r1 = steps(run(a.events.slice(0, 20), pager)) // tail still running…
    const b = flick(70, a.events[19][1] + 16) // …when the user flicks again
    const r2 = steps(run(b.events, pager))
    expect([...r1, ...r2]).toEqual([1, 1])
  })
  it('tiny jitter does nothing', () => {
    expect(
      steps(
        run([
          [3, 0],
          [4, 16],
          [2, 32],
        ])
      )
    ).toEqual([])
  })
})

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { BoldVideo } from '@/lib/bold'
import type { SubPage } from '@/lib/datocms/queries'
import { createWheelPager, wheelPixels } from '@/lib/work/wheelPager'
import ContentBlock from './ContentBlock'
import type { WorkData } from './WorkPager'
import styles from './VerticalPager.module.css'

const DURATION = 420 // ms per slide: fast but smooth
const ease = (t: number) => 1 - Math.pow(1 - t, 4) // quick start, soft landing

type Props = {
  work: WorkData
  boldVideos: Record<string, BoldVideo>
  editingUrl: string | undefined
  onStartVideo: (url: string) => void
}

/**
 * Vertical, snapping project pager (experiment next to the horizontal one).
 * Touch: native scroll-snap, one slide per swipe. Wheel/trackpad/keys: one slide per gesture,
 * animated here because native smooth scrolling is too slow and can't be tuned.
 */
export default function VerticalPager({ work, boldVideos, editingUrl, onStartVideo }: Props) {
  const subs: SubPage[] = work.subPages
  const ref = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const animating = useRef(false)
  const target = useRef(0)

  const goTo = useCallback(
    (i: number) => {
      const el = ref.current
      if (!el) return
      const next = Math.max(0, Math.min(subs.length - 1, i))
      const slide = el.children[next] as HTMLElement | undefined
      if (!slide) return
      target.current = next
      setIndex(next)
      const from = el.scrollTop
      const to = slide.offsetTop
      if (Math.abs(to - from) < 1) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.scrollTop = to
        return
      }
      // snapping would fight the animation; switch it off while we move
      animating.current = true
      el.style.scrollSnapType = 'none'
      const start = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION)
        el.scrollTop = from + (to - from) * ease(t)
        if (t < 1) requestAnimationFrame(step)
        else {
          el.style.scrollSnapType = ''
          animating.current = false
        }
      }
      requestAnimationFrame(step)
    },
    [subs.length]
  )

  // wheel + trackpad: one slide per gesture
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const pager = createWheelPager()
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return // pinch zoom
      const slide = el.children[target.current] as HTMLElement | undefined
      const dy = wheelPixels(e)
      // a slide taller than the screen (long text on small windows) scrolls natively inside
      if (slide && !animating.current && slide.offsetHeight > el.clientHeight + 2) {
        const top = el.scrollTop - slide.offsetTop
        const room = slide.offsetHeight - el.clientHeight
        if ((dy > 0 && top < room - 1) || (dy < 0 && top > 1)) return
      }
      e.preventDefault()
      const dir = pager(dy, performance.now())
      if (dir) goTo(target.current + dir)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [goTo])

  // keys
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))) return
      if (t?.closest('mux-player')) return // space/arrows control the video
      const k = e.key
      if (k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) goTo(target.current + 1)
      else if (k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey)) goTo(target.current - 1)
      else if (k === 'Home') goTo(0)
      else if (k === 'End') goTo(subs.length - 1)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo, subs.length])

  // touch scrolling (native snap) updates the current slide
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      if (animating.current) return
      const i = Math.round(el.scrollTop / el.clientHeight)
      const slides = Array.from(el.children) as HTMLElement[]
      // with taller slides, pick the last one whose top has been reached
      let cur = 0
      slides.forEach((s, n) => {
        if (s.offsetTop <= el.scrollTop + el.clientHeight / 2) cur = n
      })
      const next = slides.length ? cur : i
      target.current = next
      setIndex(next)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // pause videos that scrolled away (the horizontal pager did this on page change)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    Array.from(el.children).forEach((slide, n) => {
      if (n === index) return
      slide.querySelectorAll<HTMLElement & { pause?: () => void }>('mux-player').forEach((p) => p.pause?.())
    })
  }, [index])

  return (
    <>
      <div ref={ref} className={styles.scroller} tabIndex={-1} aria-label="Project pages">
        {subs.map((item, i) => (
          <section
            key={item.id}
            className={styles.slide}
            aria-label={`${i + 1} of ${subs.length}`}
            data-datocms-content-link-url={editingUrl}
          >
            <ContentBlock item={item} work={work} boldVideos={boldVideos} onStartVideo={onStartVideo} />
          </section>
        ))}
      </div>
      {subs.length > 1 && (
        <ol className={styles.dots} aria-label="Pages">
          {subs.map((item, i) => (
            <li key={item.id}>
              <button type="button" aria-label={`Page ${i + 1}`} aria-current={i === index} onClick={() => goTo(i)} />
            </li>
          ))}
        </ol>
      )}
      {subs.length > 1 && (
        <button
          type="button"
          className={styles.hint}
          data-hidden={index > 0}
          aria-label="Next page"
          onClick={() => goTo(index + 1)}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 9l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </>
  )
}

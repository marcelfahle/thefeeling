'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Header from '@/components/header/Header'
import styles from './BackgroundVideo.module.css'

/** BackgroundVideoPlayer.js:122-126 */
const shuffle = <T,>(arr: T[]) =>
  arr
    .map((a) => [Math.random(), a] as const)
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1])

/**
 * Replaces video.js + videojs-playlist: shuffled once, 0.5s auto-advance, repeat.
 * Each item is a list of MP4 renditions tried in order on error.
 */
export default function BackgroundVideo({ playlist }: { playlist: string[][] }) {
  const [order, setOrder] = useState<string[][] | null>(null)
  const [index, setIndex] = useState(0)
  const [rendition, setRendition] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // shuffle on mount only (client), so SSR and hydration agree
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(shuffle(playlist))
    return () => clearTimeout(timer.current)
  }, [playlist])

  const advance = () => {
    if (!order?.length) return
    setRendition(0)
    setIndex((i) => (i + 1) % order.length)
  }

  const src = order?.[index]?.[rendition]

  useEffect(() => {
    const v = videoRef.current
    if (!v || !src) return
    v.play().catch(() => {})
  }, [src])

  return (
    <div className={styles.wrapper}>
      <Header />
      <Link href="/oeuvre" className={styles.link} aria-label="Oeuvre" />
      <video
        ref={videoRef}
        src={src}
        playsInline
        muted
        autoPlay
        controls={false}
        onEnded={() => {
          timer.current = setTimeout(advance, 500)
        }}
        onError={() => {
          const renditions = order?.[index] ?? []
          if (rendition + 1 < renditions.length) setRendition(rendition + 1)
          else advance()
        }}
      />
    </div>
  )
}

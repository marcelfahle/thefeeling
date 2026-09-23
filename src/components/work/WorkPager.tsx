'use client'

import { Parallax, ParallaxLayer, type IParallax } from '@react-spring/parallax'
import clsx from 'clsx'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import Header from '@/components/header/Header'
import YouTubeModal from '@/components/video/YouTubeModal'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import type { BoldVideo } from '@/lib/bold'
import type { Rgba } from '@/lib/color'
import type { SubPage } from '@/lib/datocms/queries'
import { youtubeId } from '@/lib/work/youtube'
import { usePreview } from '@/components/preview/PreviewContext'
import fallbackBg from '@/assets/bg-home.jpg'
import ContentBlock from './ContentBlock'
import styles from './Work.module.css'

export type WorkData = {
  id: string
  _editingUrl: string | null
  themeColor: Rgba | null
  textColor: Rgba | null
  subPages: SubPage[]
}

type Props = {
  work: WorkData
  archive: boolean
  bg: string | null | undefined
  boldVideos: Record<string, BoldVideo>
}

function isSafariUA(ua: string) {
  return /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(ua)
}

/** Port of single-work.js (SingleWork) */
export default function WorkPager({ work, archive, bg, boldVideos }: Props) {
  const isDesktop = useIsDesktop()
  const preview = usePreview()
  const parallaxRef = useRef<IParallax>(null)
  const current = useRef(0)
  const [cursor, setCursor] = useState<'default' | 'left' | 'right'>('default')
  const [videoId, setVideoId] = useState<string | null>(null)
  const [lastPos, setLastPos] = useState('#0')
  const subs = work.subPages

  // html,body { position: fixed } (single-work.js:34-40) + UA flags for the player CSS
  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('data-lock', '')
    if (isSafariUA(navigator.userAgent)) html.setAttribute('data-safari', '')
    if (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    )
      html.setAttribute('data-ios', '')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.location.hash) setLastPos(window.location.hash)
    return () => {
      html.removeAttribute('data-lock')
      html.removeAttribute('data-safari')
      html.removeAttribute('data-ios')
    }
  }, [])

  const scroll = useCallback((to: number) => {
    current.current = to
    parallaxRef.current?.scrollTo(to)
  }, [])

  const onMouseMove = (e: React.MouseEvent) => {
    const w = document.documentElement.clientWidth
    setCursor(e.clientX > w / 2 ? 'right' : current.current > 0 ? 'left' : 'default')
  }

  const swipe = useSwipeable({
    onSwipedLeft: () => {
      const i = current.current
      scroll(i + 1 >= subs.length ? 0 : i + 1)
    },
    onSwipedRight: () => {
      const i = current.current
      scroll(i > 1 ? i - 1 : 0)
    },
    preventScrollOnSwipe: true,
  })

  const handleClick = useCallback(
    (i: number, e: React.MouseEvent, content: SubPage) => {
      if (preview.layoutMode) return
      const player = content.boldVideoId ? document.getElementById(`id-${content.boldVideoId}`) : null
      // clicks on the player (video, play or fullscreen button) must not page (single-work.js:482-503)
      if (player && e.nativeEvent.composedPath().includes(player)) return

      const w = document.documentElement.clientWidth
      const dir = e.clientX > w / 2 ? 1 : i >= 1 ? -1 : 0

      // stop video if there was one (:510-515)
      const vid = player as (HTMLElement & { pause?: () => void; currentTime?: number }) | null
      if (vid && typeof vid.pause === 'function') {
        vid.pause()
        vid.currentTime = 0
      }
      scroll(i >= subs.length - 1 ? 0 : i + dir)
    },
    [scroll, subs.length, preview.layoutMode]
  )

  const startVideo = useCallback((url: string) => setVideoId(youtubeId(url) || null), [])
  const closeVideo = useCallback(() => setVideoId(null), [])
  const editingUrl = preview.enabled ? (work._editingUrl ?? undefined) : undefined

  // memoized so cursor changes don't re-render the pager mid-animation
  const desktop = useMemo(
    () => (
      <div {...swipe}>
        <Parallax className={styles.container} ref={parallaxRef} pages={subs.length} horizontal enabled={false}>
          {subs.map((item, i) => (
            <ParallaxLayer
              offset={i}
              key={item.id}
              speed={0}
              onClick={(ev: React.MouseEvent) => handleClick(i, ev, item)}
            >
              <div className={styles.contentWrap} data-datocms-content-link-url={editingUrl}>
                <ContentBlock item={item} work={work} boldVideos={boldVideos} onStartVideo={startVideo} />
              </div>
            </ParallaxLayer>
          ))}
        </Parallax>
      </div>
    ),
    [swipe, subs, handleClick, work, boldVideos, startVideo, editingUrl]
  )

  const bgUrl = bg || fallbackBg.src
  return (
    <div
      className={clsx(styles.wrapper, styles[cursor])}
      style={{ '--bg': `url('${bgUrl}')` } as React.CSSProperties}
      onMouseMove={onMouseMove}
    >
      <Header
        backto={archive ? `/ye-olden-stuffe${lastPos}` : `/oeuvre${lastPos}`}
        action={archive ? 'backarchive' : 'backhome'}
        size="small"
        position="fixed"
        flipped
      />
      {isDesktop === true && desktop}
      {isDesktop === false && (
        <div className={styles.mobileContainer}>
          {subs.map((item) => (
            <div className={styles.contentWrapMobile} key={item.id} data-datocms-content-link-url={editingUrl}>
              <ContentBlock item={item} work={work} boldVideos={boldVideos} onStartVideo={startVideo} />
            </div>
          ))}
        </div>
      )}
      <YouTubeModal videoId={videoId} onClose={closeVideo} />
    </div>
  )
}

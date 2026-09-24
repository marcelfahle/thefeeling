'use client'

import { Parallax, ParallaxLayer, type IParallax } from '@react-spring/parallax'
import { useEffect, useRef, useState } from 'react'
import Header, { type HeaderAction } from '@/components/header/Header'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import type { CollageItem } from '@/lib/datocms/queries'
import { layerOffsets, layerSpeed, pageCount } from '@/lib/layout/math'
import { usePreview } from '@/components/preview/PreviewContext'
import { useLayoutEditor } from '@/components/preview/useLayoutEditor'
import CollageTile, { type CollageKind } from './CollageTile'
import styles from './Collage.module.css'
import { editLink } from '@/lib/datocms/editLink'

type Props = {
  items: CollageItem[]
  kind: CollageKind
  bg: string | null | undefined
}

const HEADER: Record<CollageKind, { backTo: string; action: HeaderAction }> = {
  oeuvre: { backTo: '/about', action: 'toabout' },
  'ye-olden-stuffe': { backTo: '/oeuvre', action: 'backhome' },
}

/** Port of PortfolioScroller2.js */
export default function Collage({ items: source, kind, bg }: Props) {
  const isDesktop = useIsDesktop()
  const preview = usePreview()
  const pageRef = useRef<HTMLDivElement>(null)
  const parallaxRef = useRef<IParallax>(null)
  const [logoFlip, setLogoFlip] = useState(false)
  const [lastPos, setLastPos] = useState(0)
  const [focusId, setFocusId] = useState<string | null>(null)

  const layoutMode = preview.layoutMode && isDesktop === true
  const layout = useLayoutEditor(source, layoutMode, parallaxRef)
  // unsaved layout edits stay visible (and savable) even after leaving layout mode
  const items = isDesktop === true ? layout.items : source
  const { setOnCollage } = preview
  useEffect(() => {
    setOnCollage(true)
    return () => setOnCollage(false)
  }, [setOnCollage])

  // scroll listener (PortfolioScroller2.js:65-71, 129-139)
  useEffect(() => {
    if (isDesktop === undefined) return
    const el: HTMLElement | null | undefined = isDesktop ? parallaxRef.current?.container.current : pageRef.current
    if (!el) return
    const onScroll = () => {
      if ((el.scrollTop || window.scrollY) > 300) {
        setLogoFlip(true)
        setLastPos(el.scrollTop)
      } else {
        setLogoFlip(false)
      }
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [isDesktop])

  // #lastPos restore (PortfolioScroller2.js:77-101) and ?focus=<id>
  useEffect(() => {
    if (isDesktop === undefined) return
    const el: HTMLElement | null | undefined = isDesktop ? parallaxRef.current?.container.current : pageRef.current
    if (!el) return
    let top: number | null = null
    const focusParam = new URLSearchParams(window.location.search).get('focus')
    if (focusParam) {
      const i = items.findIndex((it) => it.id === focusParam)
      if (i >= 0) {
        if (isDesktop) {
          // the layer's own page, centered: offset × viewport height
          top = layerOffsets(items.map((it) => it.yOffset))[i] * el.clientHeight
        } else {
          const tile = el.querySelector<HTMLElement>(`[data-tile-id="${CSS.escape(focusParam)}"]`)
          top = tile ? tile.offsetTop - 100 : null
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFocusId(focusParam)
      }
    } else if (window.location.hash) {
      const n = parseInt(window.location.hash.replace('#', ''))
      if (!Number.isNaN(n)) top = n
    }
    if (top === null) return
    const t = setTimeout(() => el.scroll({ top: top!, behavior: 'smooth' }), isDesktop ? 1000 : 700)
    const f = setTimeout(() => setFocusId(null), (isDesktop ? 1000 : 700) + 2500)
    return () => {
      clearTimeout(t)
      clearTimeout(f)
    }
    // run once per layout (desktop/mobile), not on every realtime update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop])

  const header = HEADER[kind]
  const yOffsets = items.map((it) => it.yOffset)
  const offsets = layerOffsets(yOffsets)
  const pages = pageCount(yOffsets)
  const editUrl = (it: CollageItem) => (preview.enabled ? editLink(it._editingUrl, 'preview_text') : undefined)

  return (
    <div className={styles.page} ref={pageRef} style={{ '--bg': bg ? `url('${bg}')` : 'none' } as React.CSSProperties}>
      <Header backto={header.backTo} action={header.action} flipped={logoFlip} position="fixed" size="small" />
      <div id="">
        {isDesktop === true && (
          <Parallax className="parallaxer" ref={parallaxRef} pages={pages}>
            {items.map((it, i) => {
              const speed = preview.motion && !layoutMode ? layerSpeed(it.speed) : 0
              return (
                // ParallaxLayer memoizes offset/speed at mount: remount when they change
                <ParallaxLayer
                  key={`${it.id}:${offsets[i]}:${speed}`}
                  offset={offsets[i]}
                  speed={speed}
                  className={styles.layer}
                >
                  <CollageTile
                    data={it}
                    kind={kind}
                    lastPos={lastPos}
                    editingUrl={layoutMode ? undefined : editUrl(it)}
                    focused={focusId === it.id}
                    editable={layoutMode ? layout.tileProps(it, i) : undefined}
                  >
                    {layoutMode && layout.tileChrome(it, i)}
                  </CollageTile>
                </ParallaxLayer>
              )
            })}
          </Parallax>
        )}
        {isDesktop === true && preview.role === 'editor' && layout.overlay}
        {isDesktop === false && (
          <div className={styles.list}>
            {items.map((it) => (
              <CollageTile
                key={it.id}
                data={it}
                kind={kind}
                lastPos={lastPos}
                editingUrl={editUrl(it)}
                focused={focusId === it.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

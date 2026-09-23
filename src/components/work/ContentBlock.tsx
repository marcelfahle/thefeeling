import clsx from 'clsx'
import { stripStega } from 'react-datocms/stega'
import type { SubPage } from '@/lib/datocms/queries'
import type { BoldVideo } from '@/lib/bold'
import { blockParts } from '@/lib/work/blocks'
import BoldPlayer from '@/components/video/BoldPlayer'
import { toHex, type Rgba } from '@/lib/color'
import styles from './Work.module.css'

type Colors = { themeColor: Rgba | null; textColor: Rgba | null }

const hex = toHex

function textVars(item: SubPage, bg: string | undefined, fg: string | undefined): React.CSSProperties {
  const v: Record<string, string> = {}
  if (item.baseFontSize != null) v['--fs'] = `${item.baseFontSize}px`
  if (item.baseFontSizeMobile != null) v['--fs-m'] = `${item.baseFontSizeMobile}px`
  if (bg) v['--tf-bg'] = bg
  if (fg) v['--tf-fg'] = fg
  return v as React.CSSProperties
}

/** Port of renderContent (single-work.js:532-613). */
export default function ContentBlock({
  item,
  work,
  boldVideos,
  onStartVideo,
}: {
  item: SubPage
  work: Colors
  boldVideos: Record<string, BoldVideo>
  onStartVideo: (url: string) => void
}) {
  const parts = blockParts(item)
  const accent = hex(item.themeColor) ?? hex(work.themeColor) ?? 'white'
  const video = item.boldVideoId ? boldVideos[stripStega(item.boldVideoId)] : undefined
  return (
    <div className={styles.content}>
      {parts.text && (
        <div
          className={clsx(styles.textBase, styles.textContent)}
          style={textVars(
            item,
            hex(item.themeColor) ?? hex(work.themeColor) ?? 'rgba(0,0,0,0)',
            hex(item.textColor) ?? hex(work.textColor) ?? 'white'
          )}
          dangerouslySetInnerHTML={{ __html: item.text! }}
        />
      )}
      {parts.textOverImage && (
        <div
          className={clsx(styles.textBase, styles.textOverImage)}
          style={textVars(
            item,
            hex(item.themeColor) ?? hex(work.themeColor),
            hex(item.textColor) ?? hex(work.textColor)
          )}
          dangerouslySetInnerHTML={{ __html: item.text! }}
        />
      )}
      {parts.image && (
        <img
          className={styles.image}
          src={stripStega(item.image!.url)}
          style={
            {
              '--opacity': item.opacity == null ? 1 : item.opacity / 100,
            } as React.CSSProperties
          }
          alt=""
          draggable={false}
        />
      )}
      {parts.boldPlayer && (
        <div className={styles.videoLayer}>
          {video && (
            <BoldPlayer
              poster={stripStega(item.image!.url)}
              video={video}
              color={accent}
              aspect={video.aspect ?? 16 / 9}
            />
          )}
        </div>
      )}
      {parts.youtubeButton && (
        <div
          className={styles.startVideo}
          onClick={(evt) => {
            evt.preventDefault()
            evt.stopPropagation()
            onStartVideo(stripStega(item.video!.url))
          }}
        >
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path
              fill={accent}
              d="M50 5C25.2 5 5 25.1 5 50c0 24.8 20.2 45 45 45s45-20.2 45-45C95 25.1 74.8 5 50 5zm18.2 46.7L40 69.1c-1.3.8-3-.1-3-1.7V32.6c0-1.6 1.7-2.5 3-1.7l28.2 17.4c1.2.8 1.2 2.6 0 3.4z"
            />
          </svg>
        </div>
      )}
    </div>
  )
}

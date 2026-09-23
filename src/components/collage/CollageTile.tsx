import Link from 'next/link'
import clsx from 'clsx'
import { stripStega } from 'react-datocms/stega'
import type { CollageItem } from '@/lib/datocms/queries'
import { cssLeft, cssMaxWidth } from '@/lib/layout/math'
import { toHex } from '@/lib/color'
import styles from './CollageTile.module.css'

export type CollageKind = 'oeuvre' | 'ye-olden-stuffe'

const s = (v: string | null | undefined) => (v ? stripStega(v) : v)
const hasImage = (d: CollageItem) => !!d.previewImage?.url

/** PortfolioItem.js:150-166 — GIFs lose their imgix params to keep transparency */
export function imageUrl(url: string, format: string | null | undefined) {
  if (format === 'gif') {
    const u = new URL(url)
    return `${u.origin}${u.pathname}`
  }
  return url
}

/** Which of the four PortfolioItem.js link variants a tile uses. */
export function tileLink(d: CollageItem, kind: CollageKind, lastPos: number) {
  const first = d.subPages[0]
  if (first && s(first.externalLink)) return { type: 'external' as const, href: s(first.externalLink)! }
  if (s(d.slug) === 'ye-olden-stuffe')
    return {
      type: 'internal' as const,
      href: '/ye-olden-stuffe',
      imageOnly: true,
    }
  if (d.subPages.length === 0) return { type: 'none' as const }
  return { type: 'internal' as const, href: `/${kind}/${s(d.slug)}#${lastPos}` }
}

function Img({ d }: { d: CollageItem }) {
  const img = d.previewImage!
  return (
    <img
      className={styles.image}
      style={
        {
          '--opacity': d.imageOpacity ? d.imageOpacity / 100 : 1,
        } as React.CSSProperties
      }
      src={imageUrl(s(img.url)!, img.format)}
      alt={d.title ? stripStega(d.title) : ''}
      draggable={false}
    />
  )
}

function Txt({ d }: { d: CollageItem }) {
  const vars: Record<string, string> = {}
  if (d.baseFontSize != null) vars['--fs'] = `${d.baseFontSize}px`
  if (d.baseFontSizeMobile != null) vars['--fs-m'] = `${d.baseFontSizeMobile}px`
  return (
    <div
      className={clsx(styles.text, hasImage(d) && styles.overImage)}
      style={{
        ...vars,
        backgroundColor: toHex(d.themeColor) ?? 'transparent',
        color: toHex(d.textColor) ?? 'transparent',
      }}
      dangerouslySetInnerHTML={{
        __html: d.previewText ? d.previewText : 'No Data',
      }}
    />
  )
}

type Props = {
  data: CollageItem
  kind: CollageKind
  lastPos: number
  editingUrl?: string
  focused?: boolean
  /** Layout mode: render a non-navigating element and hand it these props */
  editable?: React.HTMLAttributes<HTMLSpanElement> & {
    ref?: React.Ref<HTMLSpanElement>
  }
  children?: React.ReactNode
}

/** Port of PortfolioItem.js */
export default function CollageTile({ data: d, kind, lastPos, editingUrl, focused, editable, children }: Props) {
  const link = tileLink(d, kind, lastPos)
  const linkStyle = {
    '--left': cssLeft(d.xPosition),
    '--max-width': cssMaxWidth(d.width),
  } as React.CSSProperties
  const cls = clsx(styles.link, focused && styles.focused)
  const inner =
    link.type === 'internal' && link.imageOnly ? (
      hasImage(d) ? (
        <Img d={d} />
      ) : null
    ) : (
      <>
        {hasImage(d) ? <Img d={d} /> : null}
        {d.previewText && d.previewText !== '' && <Txt d={d} />}
      </>
    )

  let el: React.ReactNode
  if (editable) {
    el = (
      <span {...editable} className={clsx(cls, editable.className)} style={{ ...linkStyle, ...editable.style }}>
        {inner}
        {children}
      </span>
    )
  } else if (link.type === 'external') {
    el = (
      <a className={cls} style={linkStyle} href={link.href} target="_blank">
        {inner}
      </a>
    )
  } else if (link.type === 'internal') {
    el = (
      <Link className={cls} style={linkStyle} href={link.href}>
        {inner}
      </Link>
    )
  } else {
    el = (
      <span className={cls} style={linkStyle}>
        {inner}
      </span>
    )
  }

  return (
    <div className={styles.item} data-tile-id={d.id} data-datocms-content-link-url={editingUrl}>
      {el}
    </div>
  )
}

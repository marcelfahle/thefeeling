'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { useQuerySubscription } from 'react-datocms/use-query-subscription'
import { createPopoutLink, createShareLink } from '@/actions/preview'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import type { Subscription } from '@/lib/datocms/subscription'
import type { Role } from '@/lib/preview/session'
import { usePreview } from './PreviewContext'
import styles from './PreviewToolbar.module.css'

type Rec = { id: string; title?: string | null; _status: string; _editingUrl: string | null } | null
type Unpublished = { portfolio: Rec[]; archive: Rec[]; pageAbout: Rec; background: Rec }

const inIframe = () => {
  try {
    return window.top !== window
  } catch {
    return true
  }
}
const noopSubscribe = () => () => {}

function useUnpublished(sub: Subscription<Unpublished, unknown> | null | undefined) {
  const { initialData, ...options } = sub ?? { initialData: undefined }
  const { data, status } = useQuerySubscription<Unpublished>(
    sub ? ({ ...options, initialData } as never) : { enabled: false }
  )
  const d = data ?? initialData
  const items = d
    ? [
        ...d.portfolio.map((r) => ({ r, kind: 'Oeuvre' })),
        ...d.archive.map((r) => ({ r, kind: 'Archive' })),
        { r: d.pageAbout, kind: 'About' },
        { r: d.background, kind: 'Backgrounds' },
      ].filter((x) => x.r && x.r._status !== 'published')
    : []
  return { items, status: sub ? status : ('off' as const) }
}

export default function PreviewToolbar({
  role,
  expired,
  unpublished,
}: {
  role: Role | null
  expired: boolean
  unpublished?: Subscription<Unpublished, unknown> | null
}) {
  const pathname = usePathname()
  const preview = usePreview()
  const isDesktop = useIsDesktop()
  const framed = useSyncExternalStore(noopSubscribe, inIframe, () => false)
  const [collapsed, setCollapsed] = useState(false)
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const { items, status: listStatus } = useUnpublished(unpublished)
  const status = preview.realtime !== 'off' ? preview.realtime : listStatus

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const here = () => `${pathname}${window.location.search}${window.location.hash}`
  const exitHref = `/api/draft-mode/disable?redirect=${encodeURIComponent(pathname)}`

  if (expired)
    return (
      <div className={styles.bar} data-preview-toolbar>
        <span className={styles.status}>
          <span className={styles.dot} data-s="closed" /> Preview expired — showing published content
        </span>
        <a className={styles.btn} href={exitHref}>
          Dismiss
        </a>
      </div>
    )

  if (collapsed)
    return (
      <div className={`${styles.bar} ${styles.collapsed}`} data-preview-toolbar>
        <button
          className={`${styles.btn} ${styles.collapse}`}
          title="Show preview toolbar"
          onClick={() => setCollapsed(false)}
        >
          <span className={styles.dot} data-s={status} style={{ display: 'inline-block' }} />
        </button>
      </div>
    )

  const editor = role === 'editor'
  const canLayout = editor && preview.onCollage && isDesktop === true

  return (
    <div className={styles.bar} data-preview-toolbar>
      <button className={`${styles.btn} ${styles.collapse}`} title="Collapse" onClick={() => setCollapsed(true)}>
        –
      </button>
      <span className={styles.status} title={`Realtime: ${status}`}>
        <span className={styles.dot} data-s={status} />
        Draft preview <span className={styles.role}>· {editor ? 'editor' : 'view only'}</span>
      </span>

      {editor && (
        <span style={{ position: 'relative' }}>
          <button className={styles.btn} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
            {items.length} unpublished
          </button>
          {open && (
            <ul className={styles.list}>
              {items.length === 0 && <li className={styles.muted}>Everything is published.</li>}
              {items.map(({ r, kind }) => (
                <li key={r!.id}>
                  <a href={r!._editingUrl ?? '#'} target="_blank" rel="noreferrer">
                    <span>{r!.title || kind}</span>
                    <span className={styles.muted}>
                      {kind} · {r!._status}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </span>
      )}

      {preview.onCollage && (
        <button
          className={styles.btn}
          aria-pressed={!preview.motion}
          disabled={preview.layoutMode}
          title="Stop parallax: show every tile at its resting position"
          onClick={() => preview.setMotion(!preview.motion)}
        >
          Motion {preview.motion ? 'on' : 'off'}
        </button>
      )}
      {canLayout && (
        <button
          className={styles.btn}
          aria-pressed={preview.layoutMode}
          onClick={() => preview.setLayoutMode(!preview.layoutMode)}
        >
          Layout
        </button>
      )}

      {editor && (
        <button
          className={styles.btn}
          onClick={async () => {
            try {
              const url = new URL(await createShareLink(here()), window.location.origin).toString()
              await navigator.clipboard.writeText(url).catch(() => window.prompt('Copy this link', url))
              setToast('Share link copied (view only, 7 days)')
            } catch (e) {
              setToast(null)
              console.error(e)
            }
          }}
        >
          Share view-only link
        </button>
      )}
      {editor && framed && (
        <button
          className={styles.btn}
          onClick={async () => {
            const w = window.open('', '_blank')
            const url = new URL(await createPopoutLink(here()), window.location.origin).toString()
            if (w) w.location.href = url
            else window.open(url, '_blank')
          }}
        >
          Pop out
        </button>
      )}
      {framed ? (
        <a className={styles.btn} href={pathname} target="_blank" rel="noreferrer">
          View published
        </a>
      ) : (
        <a className={styles.btn} href={exitHref}>
          Exit preview
        </a>
      )}
      {toast && <span className={styles.toast}>{toast}</span>}
    </div>
  )
}

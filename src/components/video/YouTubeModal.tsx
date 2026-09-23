'use client'

import { useEffect } from 'react'
import styles from './YouTubeModal.module.css'

/** Replaces react-modal-video (channel="youtube"). */
export default function YouTubeModal({ videoId, onClose }: { videoId: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!videoId) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [videoId, onClose])

  if (!videoId) return null
  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onClick={(e) => {
        e.stopPropagation()
        onClose()
      }}
    >
      <div className={styles.body}>
        <div className={styles.inner}>
          <div className={styles.wrap} onClick={(e) => e.stopPropagation()}>
            <button className={styles.close} aria-label="Close the modal by clicking here" onClick={onClose} />
            <iframe
              width="460"
              height="230"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              tabIndex={-1}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

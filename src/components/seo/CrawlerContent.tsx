'use client'

import { useSyncExternalStore } from 'react'
import styles from './CrawlerContent.module.css'

const noop = () => () => {}

/**
 * The collage and pager only render in the browser (they depend on the viewport width), so the
 * server HTML would otherwise be empty for crawlers and LLM fetchers that don't run JavaScript.
 * This renders a plain, visually hidden version of the page on the server and removes it once
 * the interactive page has hydrated.
 */
export default function CrawlerContent({ children }: { children: React.ReactNode }) {
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false
  )
  if (hydrated) return null
  return <div className={styles.srOnly}>{children}</div>
}

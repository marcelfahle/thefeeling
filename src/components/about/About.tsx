'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import Header from '@/components/header/Header'
import type { AboutResult } from '@/lib/datocms/queries'
import fallbackBg from '@/assets/quer_1.jpg'
import styles from './About.module.css'
import { editLink } from '@/lib/datocms/editLink'

/** Port of pages/about.js */
export default function About({ data }: { data: AboutResult }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => setHasScrolled(el.scrollTop > 300)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const bg = data.background?.about?.url ?? fallbackBg.src
  return (
    <div className={styles.page} ref={ref} style={{ '--bg': `url('${bg}')` } as React.CSSProperties}>
      <Header backto="/oeuvre" action="backhome" size="small" position="fixed" flipped={hasScrolled} />
      <div className={styles.content}>
        <div data-datocms-content-link-url={editLink(data.pageAbout?._editingUrl, 'content')}>
          {data.pageAbout?.content.map((c) => (
            <Fragment key={c.id}>
              <div>
                <div className={styles.label}>{c.label}</div>
              </div>
              <div>
                <div className={styles.block} dangerouslySetInnerHTML={{ __html: c.body ?? '' }} />
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

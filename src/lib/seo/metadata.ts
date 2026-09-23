import 'server-only'
import type { Metadata } from 'next'
import { SITE_NAME, indexable } from './site'

/**
 * Per-page metadata. Social images come from the `opengraph-image` route files next to each page,
 * which Next wires into og:image automatically (X/Twitter falls back to og:image).
 */
export function pageMetadata(opts: {
  title?: string
  description: string
  path: string
  type?: 'website' | 'article' | 'profile'
  keywords?: string[]
}): Metadata {
  const fullTitle = opts.title ? `${opts.title} · ${SITE_NAME}` : SITE_NAME
  return {
    title: opts.title ? opts.title : { absolute: SITE_NAME },
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: opts.path },
    openGraph: {
      type: opts.type ?? 'website',
      siteName: SITE_NAME,
      locale: 'en_US',
      url: opts.path,
      title: fullTitle,
      description: opts.description,
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description: opts.description },
    robots: indexable()
      ? { index: true, follow: true, 'max-image-preview': 'large', 'max-video-preview': -1, 'max-snippet': -1 }
      : { index: false, follow: false },
  }
}

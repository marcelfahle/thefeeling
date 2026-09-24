import type { Metadata, Viewport } from 'next'
import { toNextMetadata } from 'react-datocms/seo'
import { executeQuery } from '@/lib/datocms/executeQuery'
import { LayoutQuery } from '@/lib/datocms/queries'
import { paletteBootScript, paletteCss } from '@/lib/palette/palette'
import { getPreview } from '@/lib/preview/isPreview'
import { ORG, SITE_NAME, TAGLINE, siteUrl } from '@/lib/seo/site'
import PaletteRouter from '@/components/PaletteRouter'
import PreviewChrome from '@/components/preview/PreviewChrome'
import { PreviewProvider } from '@/components/preview/PreviewContext'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const { _site } = await executeQuery(LayoutQuery)
  return {
    ...toNextMetadata(_site.faviconMetaTags),
    metadataBase: siteUrl(),
    title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
    description: TAGLINE,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: '/' }],
    creator: SITE_NAME,
    publisher: ORG.legalName,
    category: 'Advertising & brand design',
    formatDetection: { telephone: false, email: false, address: false },
  }
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const preview = await getPreview()
  return (
    <html lang="en" data-palette="0" suppressHydrationWarning>
      <head>
        {/* @font-face only: a font file downloads when text actually uses it (fonts picked in the editor) */}
        {/* eslint-disable-next-line @next/next/no-css-tags -- same file the DatoCMS editor plugin loads */}
        <link rel="stylesheet" href="/fonts/fonts.css" />
        <style dangerouslySetInnerHTML={{ __html: paletteCss }} />
        <script dangerouslySetInnerHTML={{ __html: paletteBootScript }} />
      </head>
      <body>
        {preview.enabled ? (
          <PreviewProvider role={preview.role}>
            <div className="site">{children}</div>
            <PreviewChrome preview={preview} />
          </PreviewProvider>
        ) : (
          <div className="site">{children}</div>
        )}
        {preview.expired && <PreviewChrome preview={preview} />}
        <PaletteRouter />
      </body>
    </html>
  )
}

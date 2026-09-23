import type { Metadata, Viewport } from 'next'
import { toNextMetadata } from 'react-datocms/seo'
import { executeQuery } from '@/lib/datocms/executeQuery'
import { LayoutQuery } from '@/lib/datocms/queries'
import { paletteBootScript, paletteCss } from '@/lib/palette/palette'
import { getPreview } from '@/lib/preview/isPreview'
import PaletteRouter from '@/components/PaletteRouter'
import PreviewChrome from '@/components/preview/PreviewChrome'
import { PreviewProvider } from '@/components/preview/PreviewContext'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const { _site } = await executeQuery(LayoutQuery)
  return {
    ...toNextMetadata(_site.faviconMetaTags),
    title: 'THE FEELING',
    description: '',
    keywords: '',
  }
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const preview = await getPreview()
  return (
    <html lang="en" data-palette="0" suppressHydrationWarning>
      <head>
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

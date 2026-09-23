import { executeQuery } from '@/lib/datocms/executeQuery'
import { AboutQuery } from '@/lib/datocms/queries'
import { getPreview } from '@/lib/preview/isPreview'
import { subscriptionFor } from '@/lib/datocms/subscription'
import RealtimeAbout from '@/components/preview/RealtimeAbout'
import type { Metadata } from 'next'
import About from '@/components/about/About'
import CrawlerContent from '@/components/seo/CrawlerContent'
import JsonLd from '@/components/seo/JsonLd'
import { ORG_ID, breadcrumbs, graph, organization } from '@/lib/seo/jsonld'
import { pageMetadata } from '@/lib/seo/metadata'
import { getSeoIndex } from '@/lib/seo/projects'
import { abs } from '@/lib/seo/site'

export async function generateMetadata(): Promise<Metadata> {
  const idx = await getSeoIndex()
  return pageMetadata({ title: 'About & contact', description: idx.studioDescription, path: '/about', type: 'profile' })
}

export default async function AboutPage() {
  const preview = await getPreview()
  const data = await executeQuery(AboutQuery, {
    includeDrafts: preview.enabled,
  })
  const idx = await getSeoIndex()
  const seo = (
    <>
      <JsonLd
        data={graph(
          {
            '@type': ['AboutPage', 'ContactPage'],
            '@id': abs('/about'),
            url: abs('/about'),
            name: 'About THE FEELING',
            description: idx.studioDescription,
            mainEntity: { '@id': ORG_ID() },
            ...(idx.aboutUpdatedAt ? { dateModified: idx.aboutUpdatedAt } : {}),
          },
          organization(idx.studioDescription),
          breadcrumbs([
            { name: 'THE FEELING', path: '/' },
            { name: 'About & contact', path: '/about' },
          ])
        )}
      />
      <CrawlerContent>
        <h1>About THE FEELING — creative studio for advertising and brand design, Berlin</h1>
      </CrawlerContent>
    </>
  )
  return (
    <>
      {seo}
      {preview.role === 'editor' ? (
        <RealtimeAbout subscription={subscriptionFor(AboutQuery, data)} />
      ) : (
        <About data={data} />
      )}
    </>
  )
}

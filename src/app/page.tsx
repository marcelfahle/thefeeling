import type { Metadata } from 'next'
import Link from 'next/link'
import { getHomePlaylist } from '@/lib/bold'
import BackgroundVideo from '@/components/video/BackgroundVideo'
import CrawlerContent from '@/components/seo/CrawlerContent'
import JsonLd from '@/components/seo/JsonLd'
import { graph, organization, website } from '@/lib/seo/jsonld'
import { pageMetadata } from '@/lib/seo/metadata'
import { getSeoIndex } from '@/lib/seo/projects'
import { SITE_NAME, TAGLINE } from '@/lib/seo/site'

export async function generateMetadata(): Promise<Metadata> {
  const idx = await getSeoIndex()
  return pageMetadata({
    description: idx.studioDescription,
    path: '/',
    keywords: [
      'creative studio Berlin',
      'advertising agency Berlin',
      'brand design',
      'campaigns',
      'social media campaigns',
    ],
  })
}

export default async function IndexPage() {
  const [playlist, idx] = await Promise.all([getHomePlaylist(), getSeoIndex()])
  return (
    <div>
      <JsonLd data={graph(organization(idx.studioDescription), website())} />
      <CrawlerContent>
        <h1>
          {SITE_NAME} — {TAGLINE}
        </h1>
        <p>{idx.studioDescription}</p>
        <nav>
          <Link href="/oeuvre">Oeuvre (selected work)</Link> <Link href="/ye-olden-stuffe">Archive</Link>{' '}
          <Link href="/about">About &amp; contact</Link>
        </nav>
      </CrawlerContent>
      {playlist.length > 0 && <BackgroundVideo playlist={playlist} />}
    </div>
  )
}

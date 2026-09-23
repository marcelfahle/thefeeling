import { notFound } from 'next/navigation'
import { stripStega } from 'react-datocms/stega'
import { getBoldVideos } from '@/lib/bold'
import { executeQuery } from '@/lib/datocms/executeQuery'
import { ArchiveWorkQuery, PortfolioWorkQuery } from '@/lib/datocms/queries'
import { subscriptionFor } from '@/lib/datocms/subscription'
import { getPreview } from '@/lib/preview/isPreview'
import RealtimeWork from '@/components/preview/RealtimeWork'
import CrawlerContent from '@/components/seo/CrawlerContent'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbs, creativeWork, graph } from '@/lib/seo/jsonld'
import { getProjectSeo } from '@/lib/seo/projects'
import WorkPager from './WorkPager'

/** Server part of both detail routes (gatsby-node.js createPages → single-work.js). */
export default async function WorkPage({ slug, archive }: { slug: string; archive: boolean }) {
  const preview = await getPreview()
  const query = archive ? ArchiveWorkQuery : PortfolioWorkQuery
  const data = await executeQuery(query, {
    variables: { slug },
    includeDrafts: preview.enabled,
  })
  if (!data.work) notFound()
  const kind = archive ? 'ye-olden-stuffe' : 'oeuvre'
  const [boldVideos, seo] = await Promise.all([
    getBoldVideos(data.work.subPages.map((s) => (s.boldVideoId ? stripStega(s.boldVideoId) : ''))),
    getProjectSeo(kind, slug),
  ])
  const pager =
    preview.role === 'editor' ? (
      <RealtimeWork
        subscription={subscriptionFor(query, data, { slug })}
        archive={archive}
        initialBoldVideos={boldVideos}
      />
    ) : (
      <WorkPager work={data.work} archive={archive} bg={data.background?.detail?.url} boldVideos={boldVideos} />
    )
  if (!seo) return pager
  const videos = seo.videoIds.map((id) => boldVideos[id]).filter(Boolean)
  return (
    <>
      <JsonLd
        data={graph(
          creativeWork(seo, videos),
          breadcrumbs([
            { name: 'THE FEELING', path: '/' },
            { name: archive ? 'Ye olden stuffe' : 'Oeuvre', path: `/${kind}` },
            { name: seo.name, path: `/${kind}/${slug}` },
          ])
        )}
      />
      <CrawlerContent>
        <article>
          <h1>{seo.subject ? `${seo.name} — ${seo.subject}` : seo.name}</h1>
          <p>A project by THE FEELING{seo.service ? ` (${seo.service})` : ''}.</p>
          {seo.fullText.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <a href={`/${kind}`}>All {archive ? 'archive' : 'work'}</a>
        </article>
      </CrawlerContent>
      {pager}
    </>
  )
}

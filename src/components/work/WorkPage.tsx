import { notFound } from 'next/navigation'
import { stripStega } from 'react-datocms/stega'
import { getBoldVideos } from '@/lib/bold'
import { executeQuery } from '@/lib/datocms/executeQuery'
import { ArchiveWorkQuery, PortfolioWorkQuery } from '@/lib/datocms/queries'
import { subscriptionFor } from '@/lib/datocms/subscription'
import { getPreview } from '@/lib/preview/isPreview'
import RealtimeWork from '@/components/preview/RealtimeWork'
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
  const boldVideos = await getBoldVideos(
    data.work.subPages.map((s) => (s.boldVideoId ? stripStega(s.boldVideoId) : ''))
  )
  if (preview.role === 'editor')
    return (
      <RealtimeWork
        subscription={subscriptionFor(query, data, { slug })}
        archive={archive}
        initialBoldVideos={boldVideos}
      />
    )
  return <WorkPager work={data.work} archive={archive} bg={data.background?.detail?.url} boldVideos={boldVideos} />
}

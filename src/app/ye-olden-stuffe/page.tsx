import type { Metadata } from 'next'
import CollageSeo from '@/components/seo/CollageSeo'
import { pageMetadata } from '@/lib/seo/metadata'
import { getSeoIndex, type ProjectSeo } from '@/lib/seo/projects'
import { truncate } from '@/lib/seo/text'
import { executeQuery } from '@/lib/datocms/executeQuery'
import { ArchiveCollageQuery } from '@/lib/datocms/queries'
import { subscriptionFor } from '@/lib/datocms/subscription'
import { getPreview } from '@/lib/preview/isPreview'
import Collage from '@/components/collage/Collage'
import RealtimeCollage from '@/components/preview/RealtimeCollage'

function describe(projects: ProjectSeo[]) {
  const clients = [...new Set(projects.filter((p) => p.path).map((p) => p.client))].join(', ')
  return truncate(`Archive of earlier campaigns and brand work by THE FEELING: ${clients}.`, 300)
}

export async function generateMetadata(): Promise<Metadata> {
  const { archive } = await getSeoIndex()
  return pageMetadata({ title: 'Ye olden stuffe', description: truncate(describe(archive)), path: '/ye-olden-stuffe' })
}

export default async function ArchivePage() {
  const preview = await getPreview()
  const { archive } = await getSeoIndex()
  const data = await executeQuery(ArchiveCollageQuery, {
    includeDrafts: preview.enabled,
  })
  return (
    <>
      <CollageSeo path="/ye-olden-stuffe" name="Ye olden stuffe" description={describe(archive)} projects={archive} />
      {preview.role === 'editor' ? (
        <RealtimeCollage
          subscription={subscriptionFor(ArchiveCollageQuery, data)}
          kind="ye-olden-stuffe"
          bgKey="archive"
        />
      ) : (
        <Collage items={data.items} kind="ye-olden-stuffe" bg={data.background?.archive?.url} />
      )}
    </>
  )
}

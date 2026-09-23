import { executeQuery } from '@/lib/datocms/executeQuery'
import { ArchiveCollageQuery } from '@/lib/datocms/queries'
import { subscriptionFor } from '@/lib/datocms/subscription'
import { getPreview } from '@/lib/preview/isPreview'
import Collage from '@/components/collage/Collage'
import RealtimeCollage from '@/components/preview/RealtimeCollage'

export default async function ArchivePage() {
  const preview = await getPreview()
  const data = await executeQuery(ArchiveCollageQuery, {
    includeDrafts: preview.enabled,
  })
  return (
    <>
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

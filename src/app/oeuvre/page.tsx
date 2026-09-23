import { executeQuery } from '@/lib/datocms/executeQuery'
import { PortfolioCollageQuery } from '@/lib/datocms/queries'
import { subscriptionFor } from '@/lib/datocms/subscription'
import { getPreview } from '@/lib/preview/isPreview'
import Collage from '@/components/collage/Collage'
import RealtimeCollage from '@/components/preview/RealtimeCollage'

export default async function OeuvrePage() {
  const preview = await getPreview()
  const data = await executeQuery(PortfolioCollageQuery, {
    includeDrafts: preview.enabled,
  })
  return (
    <>
      {preview.role === 'editor' ? (
        <RealtimeCollage subscription={subscriptionFor(PortfolioCollageQuery, data)} kind="oeuvre" bgKey="oeuvre" />
      ) : (
        <Collage items={data.items} kind="oeuvre" bg={data.background?.oeuvre?.url} />
      )}
    </>
  )
}

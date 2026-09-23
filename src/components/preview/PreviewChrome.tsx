import { executeQuery } from '@/lib/datocms/executeQuery'
import { UnpublishedQuery } from '@/lib/datocms/queries'
import { subscriptionFor } from '@/lib/datocms/subscription'
import type { Preview } from '@/lib/preview/isPreview'
import PreviewToolbar from './PreviewToolbar'
import VisualEditing from './VisualEditing'

/** Everything preview sessions add on top of the page (rendered by the root layout). */
export default async function PreviewChrome({ preview }: { preview: Preview }) {
  if (!preview.enabled) return <PreviewToolbar role={null} expired />
  const unpublished =
    preview.role === 'editor'
      ? subscriptionFor(UnpublishedQuery, await executeQuery(UnpublishedQuery, { includeDrafts: true }))
      : null
  return (
    <>
      <VisualEditing />
      <PreviewToolbar role={preview.role} expired={false} unpublished={unpublished} />
    </>
  )
}

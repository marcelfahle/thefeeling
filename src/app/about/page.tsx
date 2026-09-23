import { executeQuery } from '@/lib/datocms/executeQuery'
import { AboutQuery } from '@/lib/datocms/queries'
import { getPreview } from '@/lib/preview/isPreview'
import { subscriptionFor } from '@/lib/datocms/subscription'
import RealtimeAbout from '@/components/preview/RealtimeAbout'
import About from '@/components/about/About'

export default async function AboutPage() {
  const preview = await getPreview()
  const data = await executeQuery(AboutQuery, {
    includeDrafts: preview.enabled,
  })
  if (preview.role === 'editor') return <RealtimeAbout subscription={subscriptionFor(AboutQuery, data)} />
  return <About data={data} />
}

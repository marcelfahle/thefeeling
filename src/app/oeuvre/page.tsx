import type { Metadata } from 'next'
import CollageSeo from '@/components/seo/CollageSeo'
import { pageMetadata } from '@/lib/seo/metadata'
import { getSeoIndex, type ProjectSeo } from '@/lib/seo/projects'
import { truncate } from '@/lib/seo/text'
import { executeQuery } from '@/lib/datocms/executeQuery'
import { PortfolioCollageQuery } from '@/lib/datocms/queries'
import { subscriptionFor } from '@/lib/datocms/subscription'
import { getPreview } from '@/lib/preview/isPreview'
import Collage from '@/components/collage/Collage'
import RealtimeCollage from '@/components/preview/RealtimeCollage'

function describe(projects: ProjectSeo[]) {
  const clients = [...new Set(projects.filter((p) => p.path).map((p) => p.client))].join(', ')
  return truncate(
    `Selected work by THE FEELING, a Berlin creative studio for advertising and brand design: ${clients}.`,
    300
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const { work } = await getSeoIndex()
  return pageMetadata({ title: 'Oeuvre', description: truncate(describe(work)), path: '/oeuvre' })
}

export default async function OeuvrePage() {
  const preview = await getPreview()
  const { work } = await getSeoIndex()
  const data = await executeQuery(PortfolioCollageQuery, {
    includeDrafts: preview.enabled,
  })
  return (
    <>
      <CollageSeo path="/oeuvre" name="Oeuvre" description={describe(work)} projects={work} />
      {preview.role === 'editor' ? (
        <RealtimeCollage subscription={subscriptionFor(PortfolioCollageQuery, data)} kind="oeuvre" bgKey="oeuvre" />
      ) : (
        <Collage items={data.items} kind="oeuvre" bg={data.background?.oeuvre?.url} />
      )}
    </>
  )
}

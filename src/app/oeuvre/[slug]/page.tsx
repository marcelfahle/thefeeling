import { executeQuery } from '@/lib/datocms/executeQuery'
import { AllSlugsQuery } from '@/lib/datocms/queries'
import type { Metadata } from 'next'
import WorkPage from '@/components/work/WorkPage'
import { pageMetadata } from '@/lib/seo/metadata'
import { getProjectSeo } from '@/lib/seo/projects'

export const dynamicParams = true

export async function generateStaticParams() {
  const { portfolio } = await executeQuery(AllSlugsQuery)
  return portfolio.filter((r) => r.slug).map((r) => ({ slug: r.slug! }))
}

export async function generateMetadata({ params }: PageProps<'/oeuvre/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const p = await getProjectSeo('oeuvre', slug)
  if (!p) return { title: 'Not found', robots: { index: false } }
  return pageMetadata({
    title: p.subject ? `${p.name} — ${p.subject}` : p.name,
    description: p.description,
    path: `/oeuvre/${slug}`,
    type: 'article',
    keywords: [p.client, p.service, p.subject].filter(Boolean),
  })
}

export default async function Page({ params }: PageProps<'/oeuvre/[slug]'>) {
  const { slug } = await params
  return <WorkPage slug={slug} archive={false} />
}

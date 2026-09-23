import { executeQuery } from '@/lib/datocms/executeQuery'
import { AllSlugsQuery } from '@/lib/datocms/queries'
import WorkPage from '@/components/work/WorkPage'

export const dynamicParams = true

export async function generateStaticParams() {
  const { portfolio } = await executeQuery(AllSlugsQuery)
  return portfolio.filter((r) => r.slug).map((r) => ({ slug: r.slug! }))
}

export default async function Page({ params }: PageProps<'/oeuvre/[slug]'>) {
  const { slug } = await params
  return <WorkPage slug={slug} archive={false} />
}

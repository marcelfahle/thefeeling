import { executeQuery } from '@/lib/datocms/executeQuery'
import { AllSlugsQuery } from '@/lib/datocms/queries'
import WorkPage from '@/components/work/WorkPage'

export const dynamicParams = true

export async function generateStaticParams() {
  const { archive } = await executeQuery(AllSlugsQuery)
  return archive.filter((r) => r.slug).map((r) => ({ slug: r.slug! }))
}

export default async function Page({ params }: PageProps<'/ye-olden-stuffe/[slug]'>) {
  const { slug } = await params
  return <WorkPage slug={slug} archive={true} />
}

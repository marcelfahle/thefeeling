import { getProjectSeo } from '@/lib/seo/projects'
import { OG_SIZE, OG_TYPE, projectCard } from '@/lib/seo/og'

export const alt = 'A project by THE FEELING'
export const size = OG_SIZE
export const contentType = OG_TYPE

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getProjectSeo('ye-olden-stuffe', slug)
  return projectCard({
    image: p?.images.find((u) => !/\.gif(\?|$)/i.test(u)) ?? p?.images[0],
    client: p?.client ?? 'THE FEELING',
    service: p?.service ?? '',
    subject: p?.subject,
  })
}

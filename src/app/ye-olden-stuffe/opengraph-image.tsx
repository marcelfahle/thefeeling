import { getSeoIndex } from '@/lib/seo/projects'
import { OG_SIZE, OG_TYPE, mosaicCard } from '@/lib/seo/og'

export const alt = 'THE FEELING — Ye olden stuffe'
export const size = OG_SIZE
export const contentType = OG_TYPE

export default async function Image() {
  const { archive } = await getSeoIndex()
  const withPage = archive.filter((p) => p.path && p.images[0])
  const visuals = withPage.map((p) => p.images.find((u) => /\.jpe?g(\?|$)/i.test(u)) ?? p.images[0])
  return mosaicCard({
    images: visuals,
    title: 'Ye olden stuffe',
    line: `The archive · ${withPage.length} projects`,
  })
}

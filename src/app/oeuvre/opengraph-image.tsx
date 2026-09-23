import { getSeoIndex } from '@/lib/seo/projects'
import { OG_SIZE, OG_TYPE, mosaicCard } from '@/lib/seo/og'

export const alt = 'THE FEELING — Oeuvre'
export const size = OG_SIZE
export const contentType = OG_TYPE

export default async function Image() {
  const { work } = await getSeoIndex()
  const withPage = work.filter((p) => p.path && p.images[0])
  const visuals = withPage.map((p) => p.images.find((u) => /\.jpe?g(\?|$)/i.test(u)) ?? p.images[0])
  return mosaicCard({
    images: visuals,
    title: 'Oeuvre',
    line: `Selected work · ${withPage.length} projects`,
  })
}

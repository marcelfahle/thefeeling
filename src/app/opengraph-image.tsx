import { getSeoIndex } from '@/lib/seo/projects'
import { OG_SIZE, OG_TYPE, brandCard } from '@/lib/seo/og'
import { TAGLINE } from '@/lib/seo/site'

export const alt = 'THE FEELING — creative studio for advertising and brand design, Berlin'
export const size = OG_SIZE
export const contentType = OG_TYPE

export default async function Image() {
  const idx = await getSeoIndex()
  return brandCard({ bg: idx.backgrounds?.oeuvre?.url, line: TAGLINE, small: 'Ideas · Campaigns · Brand design' })
}

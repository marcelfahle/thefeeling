import { getSeoIndex } from '@/lib/seo/projects'
import { OG_SIZE, OG_TYPE, brandCard } from '@/lib/seo/og'
import { ORG } from '@/lib/seo/site'

export const alt = 'About THE FEELING'
export const size = OG_SIZE
export const contentType = OG_TYPE

export default async function Image() {
  const idx = await getSeoIndex()
  return brandCard({
    bg: idx.backgrounds?.about?.url,
    line: 'About & contact',
    small: `${ORG.address.street} · ${ORG.address.postalCode} ${ORG.address.city} · ${ORG.email}`,
  })
}

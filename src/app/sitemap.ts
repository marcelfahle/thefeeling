import type { MetadataRoute } from 'next'
import { getSeoIndex } from '@/lib/seo/projects'
import { abs, cardImage } from '@/lib/seo/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const idx = await getSeoIndex()
  const all = [...idx.work, ...idx.archive]
  const latest = (list: typeof all) =>
    list
      .map((p) => p.updatedAt)
      .sort()
      .at(-1)
  const images = (list: typeof all) =>
    list
      .flatMap((p) => p.images.slice(0, 1))
      .slice(0, 50)
      .map((u) => cardImage(u)!)
  return [
    { url: abs('/'), lastModified: latest(all), changeFrequency: 'monthly', priority: 1 },
    {
      url: abs('/oeuvre'),
      lastModified: latest(idx.work),
      changeFrequency: 'monthly',
      priority: 0.9,
      images: images(idx.work),
    },
    ...idx.work
      .filter((p) => p.path)
      .map((p) => ({
        url: abs(p.path!),
        lastModified: p.updatedAt,
        changeFrequency: 'yearly' as const,
        priority: 0.8,
        images: p.images.slice(0, 10).map((u) => cardImage(u)!),
      })),
    { url: abs('/about'), lastModified: idx.aboutUpdatedAt ?? undefined, changeFrequency: 'yearly', priority: 0.7 },
    {
      url: abs('/ye-olden-stuffe'),
      lastModified: latest(idx.archive),
      changeFrequency: 'yearly',
      priority: 0.5,
      images: images(idx.archive),
    },
    ...idx.archive
      .filter((p) => p.path)
      .map((p) => ({
        url: abs(p.path!),
        lastModified: p.updatedAt,
        changeFrequency: 'yearly' as const,
        priority: 0.4,
        images: p.images.slice(0, 10).map((u) => cardImage(u)!),
      })),
  ]
}

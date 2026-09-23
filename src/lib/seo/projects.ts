import 'server-only'
import { cache } from 'react'
import { executeQuery } from '@/lib/datocms/executeQuery'
import { SeoIndexQuery, type SeoProject } from '@/lib/datocms/queries'
import { recordToRoutes } from '@/lib/datocms/recordToRoutes'
import { SITE_NAME } from './site'
import { htmlToText, projectSummary, truncate } from './text'

export type Kind = 'oeuvre' | 'ye-olden-stuffe'

export type ProjectSeo = {
  slug: string
  kind: Kind
  path: string | null // null when the tile has no project page
  externalUrl: string | null
  name: string // e.g. "Porsche Bank: Ads and Social Media Campaign"
  client: string
  service: string
  subject: string
  description: string
  fullText: string
  images: string[]
  videoIds: string[]
  updatedAt: string
  publishedAt: string | null
}

/** Pure: turns one CMS record into the SEO view of a project. */
export function toProjectSeo(p: SeoProject, kind: Kind): ProjectSeo | null {
  if (!p.slug) return null
  const texts = p.subPages.map((s) => s.text).filter((t): t is string => !!t)
  const sum = projectSummary(texts[0])
  const rest = texts.slice(1).map(htmlToText).filter(Boolean)
  const title = p.title?.replace(/_/g, ' ').trim() || p.slug
  const client = sum.client || title
  const name = sum.kind ? `${client}: ${sum.kind}` : client
  const body = [sum.body, ...rest].filter(Boolean).join(' ')
  const route = recordToRoutes({
    model: kind === 'oeuvre' ? 'page_portfolio' : 'page_archive',
    id: '',
    slug: p.slug,
    subPages: p.subPages,
  })
  const page = route.find((r) => r.label === 'Project page')
  const first = p.subPages[0]
  return {
    slug: p.slug,
    kind,
    path: page?.path ?? null,
    externalUrl: first?.externalLink || null,
    name,
    client,
    service: sum.kind,
    subject: sum.subject,
    description: truncate(body || [name, sum.subject].filter(Boolean).join(' — ') + ` — a project by ${SITE_NAME}.`),
    fullText: [sum.subject, body].filter(Boolean).join('\n\n'),
    images: [p.previewImage?.url, ...p.subPages.map((s) => s.image?.url)].filter((u): u is string => !!u),
    videoIds: p.subPages.map((s) => s.boldVideoId).filter((v): v is string => !!v),
    updatedAt: p._updatedAt,
    publishedAt: p._firstPublishedAt ?? null,
  }
}

export const getSeoIndex = cache(async () => {
  const data = await executeQuery(SeoIndexQuery)
  const work = data.portfolio.map((p) => toProjectSeo(p, 'oeuvre')).filter((p): p is ProjectSeo => !!p)
  const archive = data.archive.map((p) => toProjectSeo(p, 'ye-olden-stuffe')).filter((p): p is ProjectSeo => !!p)
  const about = (data.pageAbout?.content ?? []).map((c) => ({ label: c.label ?? '', text: htmlToText(c.body) }))
  const aboutText = about.find((a) => /about/i.test(a.label))?.text ?? ''
  return {
    work,
    archive,
    about,
    /** first two sentences of the About text */
    studioDescription: truncate(
      aboutText
        .split(/(?<=\.)\s+/)
        .slice(0, 2)
        .join(' ') || `${SITE_NAME} — creative studio.`,
      300
    ),
    aboutUpdatedAt: data.pageAbout?._updatedAt ?? null,
    backgrounds: data.background,
  }
})

export async function getProjectSeo(kind: Kind, slug: string) {
  const idx = await getSeoIndex()
  return (kind === 'oeuvre' ? idx.work : idx.archive).find((p) => p.slug === slug) ?? null
}

import 'server-only'
import type { BoldVideo } from '@/lib/bold'
import type { ProjectSeo } from './projects'
import { ORG, SITE_NAME, TAGLINE, abs, cardImage } from './site'

type Node = Record<string, unknown>
export const ORG_ID = () => abs('/#organization')
const WEBSITE_ID = () => abs('/#website')

export function organization(description: string): Node {
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID(),
    name: ORG.name,
    legalName: ORG.legalName,
    url: abs('/'),
    logo: { '@type': 'ImageObject', url: abs('/logo.png'), width: 1200, height: 184 },
    image: abs('/logo-square.png'),
    description,
    slogan: TAGLINE,
    email: ORG.email,
    telephone: ORG.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORG.address.street,
      postalCode: ORG.address.postalCode,
      addressLocality: ORG.address.city,
      addressCountry: ORG.address.country,
    },
    areaServed: ['DE', 'AT', 'CH', 'EU'],
    knowsAbout: ORG.knowsAbout,
    founder: ORG.founders.map((name) => ({ '@type': 'Person', name })),
    contactPoint: { '@type': 'ContactPoint', contactType: 'new business', email: ORG.email, telephone: ORG.telephone },
  }
}

export function website(): Node {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID(),
    url: abs('/'),
    name: SITE_NAME,
    description: TAGLINE,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID() },
  }
}

export function breadcrumbs(items: { name: string; path: string }[]): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  }
}

export function collectionPage(opts: {
  path: string
  name: string
  description: string
  projects: ProjectSeo[]
}): Node {
  const listed = opts.projects.filter((p) => p.path || p.externalUrl)
  return {
    '@type': 'CollectionPage',
    '@id': abs(opts.path),
    url: abs(opts.path),
    name: opts.name,
    description: opts.description,
    isPartOf: { '@id': WEBSITE_ID() },
    about: { '@id': ORG_ID() },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: listed.length,
      itemListElement: listed.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: p.path ? abs(p.path) : p.externalUrl,
        name: p.name,
      })),
    },
  }
}

/** ISO 8601 duration from seconds (VideoObject.duration). */
export const isoDuration = (s: number) =>
  `PT${Math.floor(s / 60) ? `${Math.floor(s / 60)}M` : ''}${Math.round(s % 60)}S`

export function videoObject(v: BoldVideo, project: ProjectSeo, poster?: string): Node {
  return {
    '@type': 'VideoObject',
    name: v.title && !/final|edit|_v\d/i.test(v.title) ? v.title : `${project.name} (video)`,
    description: v.description || project.description,
    thumbnailUrl: [cardImage(poster), v.thumbnail].filter(Boolean),
    uploadDate: v.published_at ? `${v.published_at.replace(/Z?$/, '')}Z` : project.publishedAt,
    ...(v.duration ? { duration: isoDuration(v.duration) } : {}),
    contentUrl: `https://stream.mux.com/${v.playback_id}.m3u8`,
    embedUrl: abs(project.path ?? '/'),
    publisher: { '@id': ORG_ID() },
  }
}

export function creativeWork(p: ProjectSeo, videos: BoldVideo[]): Node {
  const url = abs(p.path ?? '/')
  return {
    '@type': 'CreativeWork',
    '@id': `${url}#work`,
    url,
    name: p.name,
    headline: p.subject ? `${p.name} — ${p.subject}` : p.name,
    description: p.description,
    abstract: p.fullText.slice(0, 5000),
    genre: p.service || undefined,
    keywords: [p.client, p.service, p.subject].filter(Boolean).join(', '),
    image: p.images.slice(0, 6).map((u) => cardImage(u)),
    creator: { '@id': ORG_ID() },
    author: { '@id': ORG_ID() },
    copyrightHolder: { '@id': ORG_ID() },
    sourceOrganization: { '@id': ORG_ID() },
    ...(p.client ? { funder: { '@type': 'Organization', name: p.client } } : {}),
    dateCreated: p.publishedAt ?? undefined,
    dateModified: p.updatedAt,
    inLanguage: 'en',
    isPartOf: { '@id': abs(`/${p.kind}`) },
    ...(videos.length ? { video: videos.map((v) => videoObject(v, p, p.images[0])) } : {}),
  }
}

export function graph(...nodes: Node[]): Node {
  return { '@context': 'https://schema.org', '@graph': nodes }
}

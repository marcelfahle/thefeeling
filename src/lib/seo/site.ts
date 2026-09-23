import 'server-only'

export const SITE_NAME = 'THE FEELING'
export const TAGLINE = 'Creative studio for advertising and brand design, Berlin'
export const BRAND_YELLOW = '#ffed00'

/** Studio facts, as published on the About page (Contact / Site Notice). */
export const ORG = {
  name: SITE_NAME,
  legalName: 'The Feeling – Kreienkamp & Nowack GbR',
  email: 'team@thefeeling.de',
  telephone: '+49 173 7016687',
  address: { street: 'Mainzer Str. 5', postalCode: '12053', city: 'Berlin', country: 'DE' },
  founders: ['Felix Nowack', 'Christian Kreienkamp'],
  knowsAbout: ['Advertising', 'Brand design', 'Campaigns', 'Social media campaigns', 'Corporate design', 'Naming'],
} as const

/** Canonical origin. Set SITE_URL=https://thefeeling.de at cutover; until then the Vercel URL is used. */
export function siteUrl(): URL {
  const explicit = process.env.SITE_URL
  if (explicit) return new URL(explicit)
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return new URL(`https://${vercel}`)
  return new URL('http://localhost:3000')
}

export const abs = (path: string) => new URL(path, siteUrl()).toString()

/** Only the real domain gets indexed; *.vercel.app stays out of search results. */
export const indexable = () => !!process.env.SITE_URL

/** DatoCMS (imgix) URL → 1200×630 JPEG for social cards and structured data. */
export function cardImage(url: string | null | undefined, w = 1200, h = 630): string | undefined {
  if (!url) return undefined
  const u = new URL(url)
  u.search = ''
  u.searchParams.set('w', String(w))
  u.searchParams.set('h', String(h))
  u.searchParams.set('fit', 'crop')
  u.searchParams.set('fm', 'jpg')
  u.searchParams.set('q', '80')
  return u.toString()
}

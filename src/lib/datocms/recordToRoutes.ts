export type RecordInput = {
  model: string
  id: string
  slug?: string | null
  subPages?: { externalLink?: string | null }[] | null
}

export type Route = { label: string; path: string }
export type ItemStatus = 'draft' | 'updated' | 'published'
export type PreviewLink = { label: string; url: string; reloadPreviewOnRecordUpdate?: boolean }

const COLLAGE: Record<string, { base: string; title: string }> = {
  page_portfolio: { base: '/oeuvre', title: 'Oeuvre' },
  page_archive: { base: '/ye-olden-stuffe', title: 'Archive' },
}

/** Which site pages show a record (mirrors CollageTile `tileLink`). */
export function recordToRoutes(r: RecordInput): Route[] {
  const collage = COLLAGE[r.model]
  if (collage) {
    const routes: Route[] = []
    const subs = r.subPages ?? []
    if (r.slug && subs.length > 0 && !subs[0].externalLink && r.slug !== 'ye-olden-stuffe')
      routes.push({ label: 'Project page', path: `${collage.base}/${encodeURIComponent(r.slug)}` })
    routes.push({ label: 'On the collage', path: `${collage.base}?focus=${encodeURIComponent(r.id)}` })
    return routes
  }
  if (r.model === 'page_about') return [{ label: 'About', path: '/about' }]
  if (r.model === 'background')
    return [
      { label: 'Oeuvre', path: '/oeuvre' },
      { label: 'Archive', path: '/ye-olden-stuffe' },
      { label: 'About', path: '/about' },
    ]
  return []
}

/** Draft links unless the record is fully published; published links unless it was never published. */
export function previewLinks(routes: Route[], status: ItemStatus, origin: string, token: string): PreviewLink[] {
  const links: PreviewLink[] = []
  for (const r of routes) {
    if (status !== 'published') {
      const u = new URL('/api/draft-mode/enable', origin)
      u.searchParams.set('token', token)
      u.searchParams.set('redirect', r.path)
      // realtime updates the draft preview; no plugin reload needed
      links.push({ label: `${r.label} (draft)`, url: u.toString(), reloadPreviewOnRecordUpdate: false })
    }
    if (status !== 'draft') {
      const u = new URL('/api/draft-mode/disable', origin)
      u.searchParams.set('redirect', r.path)
      links.push({ label: `${r.label} (published)`, url: u.toString() })
    }
  }
  return links
}

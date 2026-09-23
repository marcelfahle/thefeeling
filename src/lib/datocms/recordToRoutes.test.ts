import { describe, expect, it } from 'vitest'
import { previewLinks, recordToRoutes } from './recordToRoutes'

describe('recordToRoutes', () => {
  it('portfolio with sub-pages → project page + collage', () => {
    expect(
      recordToRoutes({ model: 'page_portfolio', id: 'abc', slug: 'donqi', subPages: [{ externalLink: '' }] })
    ).toEqual([
      { label: 'Project page', path: '/oeuvre/donqi' },
      { label: 'On the collage', path: '/oeuvre?focus=abc' },
    ])
  })
  it('archive uses /ye-olden-stuffe', () => {
    expect(
      recordToRoutes({ model: 'page_archive', id: 'x', slug: 'immer', subPages: [{}] }).map((r) => r.path)
    ).toEqual(['/ye-olden-stuffe/immer', '/ye-olden-stuffe?focus=x'])
  })
  it('external link as first sub-page → collage only', () => {
    expect(
      recordToRoutes({ model: 'page_portfolio', id: 'a', slug: 's', subPages: [{ externalLink: 'https://x' }] })
    ).toEqual([{ label: 'On the collage', path: '/oeuvre?focus=a' }])
  })
  it('the ye-olden-stuffe tile has no project page', () => {
    expect(recordToRoutes({ model: 'page_portfolio', id: 'a', slug: 'ye-olden-stuffe', subPages: [{}] })).toHaveLength(
      1
    )
  })
  it('empty sub-pages → collage only', () => {
    expect(recordToRoutes({ model: 'page_portfolio', id: 'a', slug: 'intro', subPages: [] })).toHaveLength(1)
  })
  it('about and background', () => {
    expect(recordToRoutes({ model: 'page_about', id: '1' })).toEqual([{ label: 'About', path: '/about' }])
    expect(recordToRoutes({ model: 'background', id: '1' }).map((r) => r.path)).toEqual([
      '/oeuvre',
      '/ye-olden-stuffe',
      '/about',
    ])
  })
  it('unknown models → nothing', () => expect(recordToRoutes({ model: 'page_home', id: '1' })).toEqual([]))
})

describe('previewLinks', () => {
  const routes = [{ label: 'About', path: '/about' }]
  const o = 'https://site.test'
  it('draft → draft link only', () => {
    const l = previewLinks(routes, 'draft', o, 's3cret')
    expect(l).toHaveLength(1)
    expect(l[0].url).toBe('https://site.test/api/draft-mode/enable?token=s3cret&redirect=%2Fabout')
    expect(l[0].reloadPreviewOnRecordUpdate).toBe(false)
  })
  it('updated → both', () =>
    expect(previewLinks(routes, 'updated', o, 't').map((l) => l.label)).toEqual(['About (draft)', 'About (published)']))
  it('published → published link only', () => {
    const l = previewLinks(routes, 'published', o, 't')
    expect(l).toEqual([
      { label: 'About (published)', url: 'https://site.test/api/draft-mode/disable?redirect=%2Fabout' },
    ])
  })
})

import { describe, expect, it } from 'vitest'
import { editLink } from './editLink'

// the Web Previews plugin's pattern (datocms/plugins web-previews ContentLinkContext)
const pluginRegExp =
  /^(?<base_url>.+?)(?:\/environments\/(?<environment>[^/]+))?\/editor\/item_types\/(?<item_type_id>[^/]+)\/items\/(?<item_id>[^/]+)\/edit#fieldPath=(?<field_path>.+)$/

describe('editLink', () => {
  const url = 'https://the-feeling.admin.datocms.com/editor/item_types/31400/items/WJNSjLEjQ9Gf6E0BupRKgw/edit'
  it('matches the Web Previews plugin pattern', () => {
    expect(url).not.toMatch(pluginRegExp)
    const m = editLink(url, 'preview_text')!.match(pluginRegExp)
    expect(m?.groups).toMatchObject({
      item_type_id: '31400',
      item_id: 'WJNSjLEjQ9Gf6E0BupRKgw',
      field_path: 'preview_text',
    })
  })
  it('replaces an existing fragment and handles missing urls', () => {
    expect(editLink(`${url}#fieldPath=x`, 'sub_pages')).toBe(`${url}#fieldPath=sub_pages`)
    expect(editLink(null, 'x')).toBeUndefined()
  })
})

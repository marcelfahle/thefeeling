/**
 * Record-level click-to-edit link. The Web Previews plugin only recognises edit URLs that end in
 * `#fieldPath=…` (stega-encoded text always has one; plain `_editingUrl` doesn't), so without it
 * the Visual tab's side panel never learns which records are on the page.
 */
export function editLink(editingUrl: string | null | undefined, fieldPath: string): string | undefined {
  if (!editingUrl) return undefined
  return `${editingUrl.split('#')[0]}#fieldPath=${fieldPath}`
}

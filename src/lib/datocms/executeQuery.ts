import 'server-only'
import { executeQuery as cda } from '@datocms/cda-client'
import type { TadaDocumentNode } from 'gql.tada'

export const DATOCMS_TAG = 'datocms'

/** `v1` only works on DatoCMS plans with Visual Editing; otherwise click-to-edit is record-level. */
export const contentLinkMode = () => (process.env.DATOCMS_CONTENT_LINK === 'v1' ? ('v1' as const) : undefined)

export async function executeQuery<R, V>(
  query: TadaDocumentNode<R, V>,
  opts: { variables?: V; includeDrafts?: boolean } = {}
): Promise<R> {
  const drafts = !!opts.includeDrafts
  return cda(query, {
    variables: opts.variables,
    token: drafts ? process.env.DATOCMS_DRAFT_CDA_TOKEN! : process.env.DATOCMS_PUBLISHED_CDA_TOKEN!,
    environment: process.env.DATOCMS_ENVIRONMENT || undefined,
    includeDrafts: drafts,
    excludeInvalid: true,
    contentLink: drafts ? contentLinkMode() : undefined,
    // `_editingUrl` needs the base URL on every request, published or not
    baseEditingUrl: process.env.DATOCMS_BASE_EDITING_URL,
    requestInitOptions: drafts ? { cache: 'no-store' } : { cache: 'force-cache', next: { tags: [DATOCMS_TAG] } },
  })
}

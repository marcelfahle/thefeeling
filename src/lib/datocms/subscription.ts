import 'server-only'
import { print } from '@0no-co/graphql.web'
import type { TadaDocumentNode } from 'gql.tada'
import { contentLinkMode } from './executeQuery'

/** Serializable props for a client-side `useQuerySubscription`. Only ever built for editor sessions. */
export type Subscription<R, V> = {
  query: string
  variables?: V
  initialData: R
  token: string
  environment?: string
  includeDrafts: true
  excludeInvalid: true
  contentLink?: 'v1'
  baseEditingUrl?: string
}

export function subscriptionFor<R, V>(
  query: TadaDocumentNode<R, V>,
  initialData: R,
  variables?: V
): Subscription<R, V> {
  return {
    query: print(query),
    variables,
    initialData,
    token: process.env.DATOCMS_DRAFT_CDA_TOKEN!,
    environment: process.env.DATOCMS_ENVIRONMENT || undefined,
    includeDrafts: true,
    excludeInvalid: true,
    contentLink: contentLinkMode(),
    baseEditingUrl: process.env.DATOCMS_BASE_EDITING_URL,
  }
}

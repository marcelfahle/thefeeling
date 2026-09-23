import { initGraphQLTada } from 'gql.tada'
import type { introspection } from './graphql-env.d.ts'

export const graphql = initGraphQLTada<{
  introspection: introspection
  scalars: {
    BooleanType: boolean
    CustomData: Record<string, string>
    Date: string
    DateTime: string
    FloatType: number
    IntType: number
    ItemId: string
    JsonField: unknown
    MetaTagAttributes: Record<string, string>
    UploadId: string
  }
}>()

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada'
export { readFragment } from 'gql.tada'

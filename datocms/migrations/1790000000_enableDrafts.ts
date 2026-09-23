import type { Client } from '@datocms/cli/lib/cma-client-node'
import { enableDrafts } from '../enableDrafts'

export default async function enableDraftsMigration(client: Client) {
  await enableDrafts(client as never)
}

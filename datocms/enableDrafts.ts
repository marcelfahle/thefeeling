import type { Client } from '@datocms/cma-client-node'

export const DRAFT_MODELS = ['page_portfolio', 'page_archive', 'page_about', 'background']

/** Idempotent: turns on draft/published for the models the site renders. Records keep their published values. */
export async function enableDrafts(client: Client, log = console.log) {
  for (const key of DRAFT_MODELS) {
    const itemType = await client.itemTypes.find(key) // accepts ID or API key
    if (itemType.draft_mode_active) {
      log(`  ${key}: drafts already on`)
      continue
    }
    await client.itemTypes.update(itemType.id, { draft_mode_active: true })
    log(`  ${key}: drafts enabled`)
  }
}

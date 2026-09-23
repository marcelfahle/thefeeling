'use server'

import { buildClient } from '@datocms/cma-client-node'
import { z } from 'zod'
import { getPreview } from '@/lib/preview/isPreview'
import { LIMITS } from '@/lib/layout/math'

const Change = z.object({
  id: z.string().min(1).max(64),
  baseUpdatedAt: z.string(),
  fields: z
    .object({
      x_position: z.number().int().min(LIMITS.xPosition[0]).max(LIMITS.xPosition[1]),
      width: z.number().int().min(LIMITS.width[0]).max(LIMITS.width[1]),
      y_offset: z.number().int().min(-100000).max(100000),
      speed: z.number().int().min(LIMITS.speed[0]).max(LIMITS.speed[1]),
    })
    .partial(),
})

export type LayoutChange = z.input<typeof Change>
export type LayoutResult = { id: string; status: 'saved' | 'conflict' | 'error'; message?: string }

/** CDA `_updatedAt` has second precision and a local offset; CMA `updated_at` has ms in UTC. */
const sameInstant = (a: string, b: string) => Math.floor(Date.parse(a) / 1000) === Math.floor(Date.parse(b) / 1000)

/** Writes collage layout numbers to DatoCMS as a new draft version (publishing stays in DatoCMS). */
export async function saveLayout(input: unknown): Promise<LayoutResult[]> {
  const { enabled, role } = await getPreview()
  if (!enabled || role !== 'editor') throw new Error('Forbidden')
  const changes = z.array(Change).max(100).parse(input)
  if (!process.env.DATOCMS_LAYOUT_CMA_TOKEN)
    throw new Error('Layout saving is not configured (DATOCMS_LAYOUT_CMA_TOKEN)')

  const client = buildClient({
    apiToken: process.env.DATOCMS_LAYOUT_CMA_TOKEN,
    environment: process.env.DATOCMS_ENVIRONMENT || undefined,
  })
  const allowed = new Set(
    (await Promise.all(['page_portfolio', 'page_archive'].map((k) => client.itemTypes.find(k)))).map((t) => t.id)
  )

  const results: LayoutResult[] = []
  for (const c of changes) {
    try {
      const item = await client.items.find(c.id)
      if (!allowed.has(item.item_type.id)) throw new Error('Wrong model')
      if (!sameInstant(item.meta.updated_at, c.baseUpdatedAt)) {
        results.push({ id: c.id, status: 'conflict' })
        continue
      }
      await client.items.update(c.id, { ...c.fields, meta: { current_version: item.meta.current_version } })
      results.push({ id: c.id, status: 'saved' })
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      // STALE_ITEM_VERSION: someone saved in between find and update
      results.push({ id: c.id, status: /STALE_ITEM_VERSION/.test(message) ? 'conflict' : 'error', message })
    }
  }
  return results
}

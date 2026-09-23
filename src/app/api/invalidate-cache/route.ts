import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'
import { DATOCMS_TAG } from '@/lib/datocms/executeQuery'

/** DatoCMS webhook (entity `cda_cache_tags`, event `invalidate`): published content changed. */
export async function POST(request: NextRequest) {
  if (!process.env.WEBHOOK_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.WEBHOOK_SECRET}`)
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  revalidateTag(DATOCMS_TAG, { expire: 0 })
  return Response.json({ revalidated: true, now: Date.now() })
}

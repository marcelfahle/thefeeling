import type { NextRequest } from 'next/server'
import { executeQuery } from '@/lib/datocms/executeQuery'
import { graphql } from '@/lib/datocms/graphql'
import { previewLinks, recordToRoutes, type ItemStatus } from '@/lib/datocms/recordToRoutes'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const RecordQuery = graphql(`
  query PreviewLinksRecord($id: ItemId) {
    portfolio: pagePortfolio(filter: { id: { eq: $id } }) {
      slug
      subPages {
        externalLink
      }
    }
    archive: pageArchive(filter: { id: { eq: $id } }) {
      slug
      subPages {
        externalLink
      }
    }
  }
`)

type Payload = {
  item: { id: string; meta: { status: ItemStatus }; attributes?: { slug?: string | null } }
  itemType: { attributes: { api_key: string } }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: cors })
}

/** Web Previews plugin webhook: returns the sidebar links for one record. */
export async function POST(request: NextRequest) {
  if (!process.env.PREVIEW_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.PREVIEW_SECRET}`)
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: cors })

  const { item, itemType } = (await request.json()) as Payload
  const model = itemType.attributes.api_key
  let slug = item.attributes?.slug ?? null
  let subPages: { externalLink: string | null }[] | null = null
  if (model === 'page_portfolio' || model === 'page_archive') {
    // the CMA payload only has block ids for sub_pages; read the saved draft through the CDA
    const data = await executeQuery(RecordQuery, { variables: { id: item.id }, includeDrafts: true })
    const record = model === 'page_portfolio' ? data.portfolio : data.archive
    slug = record?.slug ?? slug
    subPages = record?.subPages ?? null
  }

  const routes = recordToRoutes({ model, id: item.id, slug, subPages })
  const links = previewLinks(routes, item.meta.status, request.nextUrl.origin, process.env.PREVIEW_SECRET)
  return Response.json({ previewLinks: links }, { headers: cors })
}

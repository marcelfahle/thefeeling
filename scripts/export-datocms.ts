/**
 * Full backup of the DatoCMS project: schema, every record, every asset, and project settings.
 * See docs/backup.md for what's in an export and how to use it.
 *
 *   pnpm datocms:export                    # everything → backups/datocms-<date>/
 *   pnpm datocms:export --out=<dir>        # choose the folder (re-running resumes)
 *   pnpm datocms:export --used-assets      # only files referenced by records
 *   pnpm datocms:export --skip-assets      # schema + records + asset metadata only
 *
 * Needs the full-access token as DATO_CMA_TOKEN (or DATOCMS_CMA_TOKEN) in .env.local.
 * Read-only: it never writes to DatoCMS.
 */
import { buildClient } from '@datocms/cma-client-node'
import { config } from 'dotenv'
import { createHash } from 'node:crypto'
import { createWriteStream, existsSync } from 'node:fs'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { parseArgs } from 'node:util'

config({ path: '.env.local', quiet: true })

const { values } = parseArgs({
  options: {
    out: { type: 'string' },
    'used-assets': { type: 'boolean' },
    'skip-assets': { type: 'boolean' },
    concurrency: { type: 'string', default: '6' },
  },
})

const token = process.env.DATOCMS_CMA_TOKEN ?? process.env.DATO_CMA_TOKEN
if (!token) throw new Error('Set DATO_CMA_TOKEN (full-access) in .env.local')
const client = buildClient({ apiToken: token })

const stamp = new Date().toISOString().slice(0, 10)
const out = values.out ?? join('backups', `datocms-${stamp}`)
const json = (file: string, data: unknown) => writeFile(join(out, file), JSON.stringify(data, null, 2) + '\n')
const log = (...a: unknown[]) => console.log('•', ...a)

async function all<T>(iter: AsyncIterable<T>): Promise<T[]> {
  const items: T[] = []
  for await (const it of iter) items.push(it)
  return items
}

/** Collects every upload id referenced anywhere in a record tree (file/gallery fields, nested blocks). */
function collectUploadIds(value: unknown, ids: Set<string>) {
  if (Array.isArray(value)) value.forEach((v) => collectUploadIds(v, ids))
  else if (value && typeof value === 'object') {
    const o = value as Record<string, unknown>
    if (typeof o.upload_id === 'string') ids.add(o.upload_id)
    Object.values(o).forEach((v) => collectUploadIds(v, ids))
  }
}

/** Plugin parameters hold the preview secret (custom headers, `token=` in URLs). */
function redact<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value)
      .replace(/([?&]token=)[^&"\\]+/g, '$1REDACTED')
      .replace(/("name":"Authorization","value":")[^"]+/g, '$1REDACTED')
  )
}

async function md5(file: string) {
  return createHash('md5')
    .update(await readFile(file))
    .digest('hex')
}

async function download(url: string, file: string, size: number, hash: string | null) {
  if (existsSync(file) && (await stat(file)).size === size && (!hash || (await md5(file)) === hash)) return 'skipped'
  const res = await fetch(url)
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status} for ${url}`)
  await pipeline(Readable.fromWeb(res.body as never), createWriteStream(file))
  if (hash && (await md5(file)) !== hash) throw new Error(`md5 mismatch for ${url}`)
  return 'downloaded'
}

async function main() {
  await mkdir(join(out, 'records'), { recursive: true })
  log(`exporting to ${out}`)

  // project settings (no secrets: API token values are never exported)
  const site = await client.site.find()
  await json('site.json', site)
  const [environments, roles, plugins, webhooks, buildTriggers, accessTokens] = await Promise.all([
    client.environments.list(),
    client.roles.list(),
    client.plugins.list(),
    client.webhooks.list(),
    client.buildTriggers.list(),
    client.accessTokens.list(),
  ])
  await json('settings.json', {
    environments,
    roles,
    plugins: redact(plugins),
    // header values can hold secrets
    webhooks: webhooks.map((w) => ({ ...w, headers: Object.keys(w.headers ?? {}) })),
    buildTriggers: buildTriggers.map(
      ({ id, name, adapter, indexing_enabled, autotrigger_on_scheduled_publications }) => ({
        id,
        name,
        adapter,
        indexing_enabled,
        autotrigger_on_scheduled_publications,
      })
    ),
    accessTokens: accessTokens.map(({ id, name, can_access_cda, can_access_cda_preview, can_access_cma, role }) => ({
      id,
      name,
      can_access_cda,
      can_access_cda_preview,
      can_access_cma,
      role,
    })),
  })
  log('settings')

  // schema
  const itemTypes = await client.itemTypes.list()
  const schema = await Promise.all(
    itemTypes.map(async (it) => ({
      ...it,
      fields: await client.fields.list(it.id),
      fieldsets: await client.fieldsets.list(it.id),
    }))
  )
  await json('schema.json', schema)
  log(`schema: ${itemTypes.length} models/blocks`)

  // records: current (includes unpublished drafts) and published, with blocks inlined
  const byModel = new Map(itemTypes.map((it) => [it.id, it.api_key]))
  const usedUploads = new Set<string>()
  const counts: Record<string, number> = {}
  for (const version of ['current', 'published'] as const) {
    const items = await all(client.items.listPagedIterator({ nested: true, version }))
    const grouped: Record<string, unknown[]> = {}
    for (const item of items) {
      const key = byModel.get(item.item_type.id) ?? item.item_type.id
      ;(grouped[key] ??= []).push(item)
      collectUploadIds(item, usedUploads)
    }
    for (const [key, list] of Object.entries(grouped)) {
      await json(join('records', `${key}.${version}.json`), list)
      if (version === 'current') counts[key] = list.length
    }
  }
  log(
    `records: ${Object.entries(counts)
      .map(([k, n]) => `${k} ${n}`)
      .join(', ')}`
  )

  // assets
  const uploads = await all(client.uploads.listPagedIterator())
  await json('uploads.json', uploads)
  const wanted = values['used-assets'] ? uploads.filter((u) => usedUploads.has(u.id)) : uploads
  log(`assets: ${uploads.length} in library, ${usedUploads.size} referenced by records`)

  let downloaded = 0,
    skipped = 0
  const failed: { id: string; url: string; error: string }[] = []
  if (!values['skip-assets']) {
    await mkdir(join(out, 'assets'), { recursive: true })
    const queue = [...wanted]
    const total = queue.length
    const worker = async () => {
      for (let u = queue.shift(); u; u = queue.shift()) {
        const file = join(out, 'assets', u.path.split('/').pop()!)
        try {
          const r = await download(u.url, file, u.size, u.md5 ?? null)
          if (r === 'downloaded') downloaded++
          else skipped++
        } catch (e) {
          failed.push({ id: u.id, url: u.url, error: String(e) })
        }
        const done = downloaded + skipped + failed.length
        if (done % 100 === 0 || done === total) log(`  ${done}/${total} files`)
      }
    }
    await Promise.all(Array.from({ length: Number(values.concurrency) }, worker))
  }

  const manifest = {
    exportedAt: new Date().toISOString(),
    project: { id: site.id, name: site.name, locales: site.locales },
    models: itemTypes.length,
    records: counts,
    assets: {
      library: uploads.length,
      referenced: usedUploads.size,
      exported: values['skip-assets'] ? 0 : wanted.length - failed.length,
      bytes: wanted.reduce((a, u) => a + u.size, 0),
      downloaded,
      skipped,
      failed,
    },
  }
  await json('manifest.json', manifest)
  await writeFile(
    join(out, 'README.md'),
    `# DatoCMS export — ${site.name} (${stamp})\n\nSee docs/backup.md in the website repo for the format.\n\n` +
      '```json\n' +
      JSON.stringify(manifest, null, 2) +
      '\n```\n'
  )
  log(`done: ${downloaded} downloaded, ${skipped} unchanged, ${failed.length} failed`)
  if (failed.length) process.exitCode = 1
}

await main()

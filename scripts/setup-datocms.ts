/**
 * DatoCMS setup for the Next.js site. Every step is idempotent.
 *
 *   DATOCMS_CMA_TOKEN=<full-access token> pnpm tsx scripts/setup-datocms.ts [steps] [options]
 *
 * Steps (run all by default):
 *   --fork=<id>        fork the primary environment into sandbox <id> (skipped if it exists)
 *   --drafts           turn on drafts for page_portfolio, page_archive, page_about, background
 *   --plugin           install/configure the Web Previews plugin (needs --base-url)
 *   --webhook          create/update the "Invalidate website cache" webhook (needs --base-url)
 *   --tokens           create the roles + API tokens the site uses, write them to .env.datocms
 *   --editor=on|off    swap the rich-text fields to THE FEELING editor (Font/Size menus) or back
 *                      to the stock DatoCMS editor (needs --base-url for "on"); not part of "all"
 * Options:
 *   --environment=<id> environment for --drafts/--plugin (default: primary)
 *   --base-url=<url>   deployed site origin, e.g. https://thefeeling.de
 *
 * Reads PREVIEW_SECRET and WEBHOOK_SECRET from the environment (.env.local is loaded).
 */
import { buildClient, type Client } from '@datocms/cma-client-node'
import { config } from 'dotenv'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import { enableDrafts } from '../datocms/enableDrafts'

config({ path: '.env.local', quiet: true })

const { values } = parseArgs({
  options: {
    fork: { type: 'string' },
    drafts: { type: 'boolean' },
    plugin: { type: 'boolean' },
    webhook: { type: 'boolean' },
    tokens: { type: 'boolean' },
    editor: { type: 'string' }, // on | off
    environment: { type: 'string' },
    'base-url': { type: 'string' },
  },
})

const token = process.env.DATOCMS_CMA_TOKEN ?? process.env.DATO_CMA_TOKEN
if (!token) throw new Error('Set DATOCMS_CMA_TOKEN (or DATO_CMA_TOKEN) to a full-access CMA token')
const all = !values.fork && !values.drafts && !values.plugin && !values.webhook && !values.tokens && !values.editor
const baseUrl = values['base-url']?.replace(/\/$/, '')
const env = values.environment

const root = buildClient({ apiToken: token })
const client = buildClient({ apiToken: token, environment: env })

const PLUGIN = 'datocms-plugin-web-previews'
const VIEWPORTS = [
  { name: 'Desktop 1440×900', width: 1440, height: 900, icon: 'desktop-alt' },
  { name: 'Laptop 1280×800', width: 1280, height: 800, icon: 'laptop' },
  { name: 'Breakpoint 991×800', width: 991, height: 800, icon: 'tablet-alt' },
  { name: 'Phone 390×844', width: 390, height: 844, icon: 'mobile-alt' },
]

async function fork(id: string) {
  const envs = await root.environments.list()
  if (envs.some((e) => e.id === id)) return console.log(`• sandbox "${id}" already exists`)
  const primary = envs.find((e) => e.meta.primary)!
  console.log(`• forking ${primary.id} → ${id} (this can take a minute)`)
  await root.environments.fork(primary.id, { id })
  console.log(`  done`)
}

async function plugin(c: Client) {
  if (!baseUrl) throw new Error('--plugin needs --base-url')
  const secret = process.env.PREVIEW_SECRET
  if (!secret) throw new Error('PREVIEW_SECRET is not set')
  const existing = (await c.plugins.list()).find((p) => p.package_name === PLUGIN)
  const p = existing ?? (await c.plugins.create({ package_name: PLUGIN }))
  await c.plugins.update(p.id, {
    parameters: {
      frontends: [
        {
          name: 'Website',
          previewWebhook: `${baseUrl}/api/preview-links`,
          customHeaders: [{ name: 'Authorization', value: `Bearer ${secret}` }],
          visualEditing: {
            enableDraftModeUrl: `${baseUrl}/api/draft-mode/enable?token=${encodeURIComponent(secret)}`,
            initialPath: '/oeuvre',
          },
        },
      ],
      showVisualTab: true,
      startOpen: true,
      defaultSidebarWidth: '900',
      previewLinksSidebarDisabled: false,
      previewLinksSidebarPanelDisabled: false,
      defaultViewports: VIEWPORTS,
    },
  })
  console.log(`• ${existing ? 'updated' : 'installed'} ${PLUGIN} → ${baseUrl}`)
}

async function webhook() {
  if (!baseUrl) throw new Error('--webhook needs --base-url')
  const secret = process.env.WEBHOOK_SECRET
  if (!secret) throw new Error('WEBHOOK_SECRET is not set')
  const name = 'Invalidate website cache'
  const body = {
    name,
    url: `${baseUrl}/api/invalidate-cache`,
    custom_payload: null,
    headers: { Authorization: `Bearer ${secret}` },
    events: [{ entity_type: 'cda_cache_tags' as const, event_types: ['invalidate' as const] }],
    http_basic_user: null,
    http_basic_password: null,
    enabled: true,
    payload_api_version: '3',
    auto_retry: true,
  }
  const existing = (await root.webhooks.list()).find((w) => w.name === name)
  if (existing) await root.webhooks.update(existing.id, body)
  else await root.webhooks.create(body)
  console.log(`• ${existing ? 'updated' : 'created'} webhook "${name}" → ${body.url}`)
  const others = (await root.webhooks.list()).filter((w) => w.name !== name)
  if (others.length)
    console.log(`  other webhooks (note them for rollback): ${others.map((w) => `${w.name} → ${w.url}`).join('; ')}`)
}

async function tokens() {
  const [portfolio, archive] = await Promise.all([
    root.itemTypes.find('page_portfolio'),
    root.itemTypes.find('page_archive'),
  ])
  const primary = (await root.environments.list()).find((e) => e.meta.primary)!.id
  const envRef = primary

  async function role(name: string, extra: Parameters<Client['roles']['create']>[0]) {
    const found = (await root.roles.list()).find((r) => r.name === name)
    return found ? root.roles.update(found.id, extra) : root.roles.create(extra)
  }
  const readAll = { environments_access: 'all' as const }
  const reader = await role('Website (read)', {
    name: 'Website (read)',
    ...readAll,
    negative_item_type_permissions: [],
    positive_item_type_permissions: [{ action: 'read', environment: envRef, item_type: null, on_creator: 'anyone' }],
  })
  const writer = await role('Layout writer', {
    name: 'Layout writer',
    ...readAll,
    negative_item_type_permissions: [],
    positive_item_type_permissions: [portfolio, archive].flatMap((it) => [
      { action: 'read' as const, environment: envRef, item_type: it.id, on_creator: 'anyone' as const },
      {
        action: 'update' as const,
        environment: envRef,
        item_type: it.id,
        on_creator: 'anyone' as const,
        localization_scope: 'all' as const,
      },
    ]),
  })

  async function accessToken(name: string, flags: { cda: boolean; preview: boolean; cma: boolean }, roleId: string) {
    const found = (await root.accessTokens.list()).find((t) => t.name === name)
    const body = {
      name,
      can_access_cda: flags.cda,
      can_access_cda_preview: flags.preview,
      can_access_cma: flags.cma,
      role: { type: 'role' as const, id: roleId },
    }
    const t = found ? await root.accessTokens.update(found.id, body) : await root.accessTokens.create(body)
    return t.token ?? (await root.accessTokens.regenerateToken(t.id)).token
  }
  // Legacy plans cap API tokens (3 on this project): create what fits, fall back for the rest.
  const tryToken = async (...args: Parameters<typeof accessToken>) => {
    try {
      return await accessToken(...args)
    } catch (e) {
      if (!String(e).includes('PLAN_UPGRADE_REQUIRED')) throw e
      console.log(`  ! plan limit: "${args[0]}" not created`)
      return null
    }
  }
  const published = await tryToken('Website (published)', { cda: true, preview: false, cma: false }, reader.id)
  const drafts = await tryToken('Website (drafts)', { cda: true, preview: true, cma: false }, reader.id)
  const layout = await tryToken('Layout writer', { cda: false, preview: false, cma: true }, writer.id)
  const lines = [
    published && `DATOCMS_PUBLISHED_CDA_TOKEN=${published}`,
    drafts ? `DATOCMS_DRAFT_CDA_TOKEN=${drafts}` : '# DATOCMS_DRAFT_CDA_TOKEN: use the built-in "Read-only API token"',
    layout
      ? `DATOCMS_LAYOUT_CMA_TOKEN=${layout}`
      : '# DATOCMS_LAYOUT_CMA_TOKEN: use the built-in "Full-access API token" (server-only)',
  ].filter(Boolean)
  writeFileSync('.env.datocms', lines.join('\n') + '\n', { mode: 0o600 })
  console.log('• roles + tokens ready; values written to .env.datocms (gitignored)')
}

/** HTML fields that get the Font/Size editor. */
const EDITOR_FIELDS = [
  ['content', 'text'],
  ['page_portfolio', 'preview_text'],
] as const
const EDITOR_PLUGIN = 'THE FEELING editor'
const APPEARANCE_BACKUP = 'datocms/field-appearance-backup.json'

async function editor(mode: string) {
  const fields = await Promise.all(
    EDITOR_FIELDS.map(async ([model, apiKey]) => {
      const f = (await client.fields.list(model)).find((x) => x.api_key === apiKey)
      if (!f) throw new Error(`field ${model}.${apiKey} not found`)
      return f
    })
  )
  if (mode === 'off') {
    const backup = JSON.parse(readFileSync(APPEARANCE_BACKUP, 'utf8')) as Record<string, unknown>
    for (const f of fields) {
      await client.fields.update(f.id, { appearance: backup[f.id] as never })
      console.log(`• ${f.api_key}: back to the stock editor`)
    }
    return
  }
  if (!baseUrl) throw new Error('--editor=on needs --base-url')
  const url = `${baseUrl}/datocms-editor/index.html`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}; deploy the site first`)
  // keep the stock appearance so --editor=off can restore it
  if (!existsSync(APPEARANCE_BACKUP)) {
    const current = Object.fromEntries(fields.map((f) => [f.id, f.appearance]))
    if (fields.every((f) => f.appearance.editor === 'wysiwyg')) {
      writeFileSync(APPEARANCE_BACKUP, JSON.stringify(current, null, 2) + '\n')
      console.log(`• saved stock editor settings to ${APPEARANCE_BACKUP}`)
    }
  }
  const existing = (await client.plugins.list()).find((p) => p.name === EDITOR_PLUGIN)
  const plugin = existing
    ? await client.plugins.update(existing.id, { url })
    : await client.plugins.create({
        name: EDITOR_PLUGIN,
        description: 'Text editor with Font and Size menus (fonts come from the website)',
        url,
        permissions: ['currentUserAccessToken'],
      })
  console.log(`• ${existing ? 'updated' : 'installed'} plugin "${EDITOR_PLUGIN}" → ${url}`)
  for (const f of fields) {
    await client.fields.update(f.id, {
      appearance: { editor: plugin.id, field_extension: 'tf-editor', parameters: {}, addons: [] },
    })
    console.log(`• ${f.api_key}: now uses the Font/Size editor`)
  }
}

if (values.editor) await editor(values.editor)
if (all || values.fork) if (values.fork) await fork(values.fork)
if (all || values.drafts) {
  console.log(`• drafts on ${env ?? 'primary'}`)
  await enableDrafts(client)
}
if (all || values.plugin) await plugin(client)
if (all || values.webhook) await webhook()
if (all || values.tokens) await tokens()

import { expect, test } from '@playwright/test'

const secret = process.env.PREVIEW_SECRET ?? ''

test.describe('preview routes', () => {
  test('enable: bad token → 401', async ({ request }) => {
    const r = await request.get('/api/draft-mode/enable?token=nope&redirect=/oeuvre', { maxRedirects: 0 })
    expect(r.status()).toBe(401)
  })
  test('enable: off-site redirect → 422', async ({ request }) => {
    test.skip(!secret, 'PREVIEW_SECRET not set')
    const r = await request.get(`/api/draft-mode/enable?token=${secret}&redirect=https://evil.example`, {
      maxRedirects: 0,
    })
    expect(r.status()).toBe(422)
  })
  test('enable: sets iframe-safe cookies', async ({ request }) => {
    test.skip(!secret, 'PREVIEW_SECRET not set')
    const r = await request.get(`/api/draft-mode/enable?token=${secret}&redirect=/oeuvre`, { maxRedirects: 0 })
    expect(r.status()).toBe(307)
    const cookies = r
      .headersArray()
      .filter((h) => h.name.toLowerCase() === 'set-cookie')
      .map((h) => h.value)
    for (const name of ['__prerender_bypass', 'tf_preview']) {
      const c = cookies.find((v) => v.startsWith(`${name}=`))
      expect(c, name).toBeTruthy()
      expect(c).toMatch(/SameSite=none/i)
      expect(c).toMatch(/Partitioned/)
      expect(c).toMatch(/Secure/)
    }
  })
  test('preview-links: no auth → 401; with auth → links', async ({ request }) => {
    expect((await request.post('/api/preview-links', { data: {} })).status()).toBe(401)
    test.skip(!secret, 'PREVIEW_SECRET not set')
    const r = await request.post('/api/preview-links', {
      headers: { Authorization: `Bearer ${secret}` },
      data: { item: { id: 'x', meta: { status: 'updated' } }, itemType: { attributes: { api_key: 'page_about' } } },
    })
    const body = await r.json()
    expect(body.previewLinks.map((l: { label: string }) => l.label)).toEqual(['About (draft)', 'About (published)'])
  })
  test('invalidate-cache: no auth → 401', async ({ request }) => {
    expect((await request.post('/api/invalidate-cache')).status()).toBe(401)
  })
  test('share: invalid token → 401', async ({ request }) => {
    expect((await request.get('/api/draft-mode/share?t=forged.token', { maxRedirects: 0 })).status()).toBe(401)
  })
})

test.describe('preview UI', () => {
  test.skip(!secret, 'PREVIEW_SECRET not set')

  test('editor: toolbar, realtime, layout mode, share link for viewers', async ({ page, browser }) => {
    await page.goto(`/api/draft-mode/enable?token=${secret}&redirect=/oeuvre`)
    const bar = page.locator('[data-preview-toolbar]')
    await expect(bar).toContainText('Draft preview')
    await expect(bar.locator('[data-s="connected"]').first()).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: 'Layout' }).click()
    const tiles = page.locator('[data-tile-id] > span')
    await expect(tiles.first()).toBeVisible()

    // drag tile 3 down by 100px, then undo
    const t = tiles.nth(3)
    await t.scrollIntoViewIfNeeded()
    const b = (await t.boundingBox())!
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2)
    await page.mouse.down()
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2 + 100, { steps: 8 })
    await page.mouse.up()
    await expect(page.locator('[data-layout-savebar]')).toContainText('2 unsaved changes')
    await page.keyboard.press('ControlOrMeta+z')
    await expect(page.locator('[data-layout-savebar]')).toHaveCount(0)
    await page.getByRole('button', { name: 'Layout' }).click()

    // share link
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.getByRole('button', { name: 'Share view-only link' }).click()
    await expect(bar).toContainText('copied')
    const share = await page.evaluate(() => navigator.clipboard.readText())
    const viewer = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
    await viewer.goto(share)
    await expect(viewer.locator('[data-preview-toolbar]')).toContainText('view only')
    await expect(viewer.getByRole('button', { name: 'Layout' })).toHaveCount(0)
  })

  test('?focus=<id> scrolls the tile into view', async ({ page }) => {
    await page.goto('/oeuvre')
    const id = await page.locator('[data-tile-id]').nth(10).getAttribute('data-tile-id')
    await page.goto(`/oeuvre?focus=${id}`)
    await expect
      .poll(() => page.evaluate(() => document.querySelector('.parallaxer')?.scrollTop ?? 0), { timeout: 6000 })
      .toBeGreaterThan(1000)
  })
})

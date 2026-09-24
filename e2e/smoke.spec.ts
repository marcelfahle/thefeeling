import { expect, test } from '@playwright/test'

const pages: [string, number][] = [
  ['/', 200],
  ['/oeuvre', 200],
  ['/ye-olden-stuffe', 200],
  ['/about', 200],
  ['/oeuvre/donqi', 200],
  ['/does-not-exist', 404],
]

for (const [path, status] of pages) {
  test(`${path} → ${status}, no console errors, no Bold calls from the browser`, async ({ page }) => {
    const errors: string[] = []
    const bold: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    page.on(
      'console',
      (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errors.push(m.text())
    )
    page.on('request', (r) => r.url().includes('app.boldvideo.io') && bold.push(r.url()))
    const res = await page.goto(path)
    expect(res?.status()).toBe(status)
    await page.waitForTimeout(2000)
    expect(errors).toEqual([])
    expect(bold).toEqual([])
    await expect(page.locator('[data-preview-toolbar]')).toHaveCount(0)
  })
}

test('published HTML has no stega and no draft token', async ({ request }) => {
  const html = await (await request.get('/oeuvre')).text()
  expect(html).not.toContain('data-datocms-contains-stega')
  expect(html).not.toContain('data-datocms-content-link-url')
  if (process.env.DATOCMS_DRAFT_CDA_TOKEN) expect(html).not.toContain(process.env.DATOCMS_DRAFT_CDA_TOKEN)
})

test('collage tiles and background images load', async ({ page }) => {
  await page.goto('/oeuvre')
  const imgs = page.locator('[data-tile-id] img')
  await expect(imgs.first()).toBeVisible({ timeout: 15_000 })
  expect(await imgs.count()).toBeGreaterThan(10)
  await expect
    .poll(() => imgs.evaluateAll((els) => els.filter((i) => (i as HTMLImageElement).naturalWidth > 0).length))
    .toBeGreaterThan(10)
  const bg = await page.evaluate(() => getComputedStyle(document.querySelector('[class*="page"]')!).backgroundImage)
  expect(bg).toContain('datocms-assets.com')
})

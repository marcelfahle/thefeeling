import { expect, test, type Page } from '@playwright/test'

/**
 * Screenshot parity against baselines recorded from the old Gatsby site (see playwright.config.ts).
 * The header (random palette), video frames and animated GIFs are masked.
 */
const base = process.env.PARITY_BASE
test.skip(!base, 'PARITY_BASE not set')

const url = (p: string) => new URL(p, base).toString()
const DETAIL = ['/oeuvre/donqi', '/oeuvre/stadt-bochum-social-media', '/ye-olden-stuffe/spd-berlin']

async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready)
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.waitForTimeout(1500)
}
const mask = (page: Page) => [
  page.locator('svg[viewBox="0 0 300 46"]'),
  page.locator('video, mux-player'),
  page.locator('img[src*=".gif"]'),
]
/** One screenshot per state (animated GIFs never produce two identical frames). */
async function shot(page: Page, name: string) {
  const buf = await page.screenshot({ mask: mask(page), animations: 'disabled' })
  expect(buf).toMatchSnapshot(name)
}

for (const [name, path] of [
  ['oeuvre', '/oeuvre'],
  ['archive', '/ye-olden-stuffe'],
] as const) {
  test(`collage ${name}: every page`, async ({ page }) => {
    await page.goto(url(path))
    await settle(page)
    const pages = await page.evaluate(() => {
      const c = document.querySelector('.parallaxer') as HTMLElement
      return Math.ceil(c.scrollHeight / c.clientHeight)
    })
    for (let k = 0; k < pages; k++) {
      await page.evaluate((k) => {
        const c = document.querySelector('.parallaxer') as HTMLElement
        c.scrollTop = k * c.clientHeight
      }, k)
      await page.waitForTimeout(1800)
      await shot(page, `${name}-${k}.png`)
    }
  })
}

for (const path of DETAIL) {
  test(`detail ${path}: every slide`, async ({ page }) => {
    await page.goto(url(path))
    await settle(page)
    const n = await page.locator(`.parallaxer, div[style*="will-change: transform"]`).count()
    for (let i = 0; i < Math.max(n, 1); i++) {
      await shot(page, `${path.replace(/\W+/g, '_')}-${i}.png`)
      await page.mouse.click(1300, 450)
      await page.waitForTimeout(1500)
    }
  })

  test(`detail ${path}: mobile full page`, async ({ browser }) => {
    const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
    await page.goto(url(path))
    await settle(page)
    await shot(page, `${path.replace(/\W+/g, '_')}-mobile.png`)
  })
}

test('about', async ({ page }) => {
  await page.goto(url('/about'))
  await settle(page)
  await shot(page, 'about.png')
})

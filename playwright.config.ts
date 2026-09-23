import { defineConfig, devices } from '@playwright/test'

/**
 * E2E_BASE     — site under test (default: local `pnpm start` on :3000)
 * PARITY_BASE  — for parity.spec: where screenshots come from. Record baselines against the old
 *                site with `PARITY_BASE=https://thefeeling.de pnpm e2e parity --update-snapshots`,
 *                then compare with `PARITY_BASE=<new url> pnpm e2e parity`.
 */
const base = process.env.E2E_BASE ?? 'http://localhost:3000'

export default defineConfig({
  testDir: 'e2e',
  timeout: 120_000,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' },
    toMatchSnapshot: { maxDiffPixelRatio: 0.01 },
  },
  use: { baseURL: base, ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
  webServer: process.env.E2E_BASE
    ? undefined
    : { command: 'pnpm start', url: 'http://localhost:3000', reuseExistingServer: true, timeout: 120_000 },
})

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Built into the website's public/ folder: DatoCMS loads the plugin from
// https://<site>/datocms-editor/index.html, the same origin as /fonts/*.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { outDir: '../../public/datocms-editor', emptyOutDir: true },
  // harness.html: /fonts comes from a running website (`pnpm dev` / `pnpm start`)
  server: { proxy: { '/fonts': process.env.SITE_ORIGIN ?? 'http://localhost:3000' } },
})

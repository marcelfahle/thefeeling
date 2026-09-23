import { llmsTxt } from '@/lib/seo/llms'

export async function GET() {
  return new Response(await llmsTxt(false), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'X-Robots-Tag': 'noindex' },
  })
}

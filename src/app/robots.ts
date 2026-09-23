import type { MetadataRoute } from 'next'
import { abs, indexable, siteUrl } from '@/lib/seo/site'

/** Search and AI assistants are welcome on the real domain; preview hosts are kept out. */
const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Amazonbot',
  'DuckAssistBot',
  'meta-externalagent',
  'MistralAI-User',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  if (!indexable()) return { rules: [{ userAgent: '*', disallow: '/' }] }
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      { userAgent: AI_AGENTS, allow: ['/', '/llms.txt', '/llms-full.txt'], disallow: ['/api/'] },
    ],
    sitemap: abs('/sitemap.xml'),
    host: siteUrl().host,
  }
}

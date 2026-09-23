import 'server-only'
import { getSeoIndex, type ProjectSeo } from './projects'
import { ORG, SITE_NAME, TAGLINE, abs } from './site'

const line = (p: ProjectSeo) =>
  `- [${p.name}${p.subject ? ` — ${p.subject}` : ''}](${p.path ? abs(p.path) : p.externalUrl}): ${p.description}`

/** https://llmstxt.org — a Markdown map of the site for LLMs. */
export async function llmsTxt(full: boolean): Promise<string> {
  const idx = await getSeoIndex()
  const work = idx.work.filter((p) => p.path)
  const archive = idx.archive.filter((p) => p.path)
  const out: string[] = [
    `# ${SITE_NAME}`,
    '',
    `> ${TAGLINE}. ${idx.studioDescription}`,
    '',
    `${ORG.legalName}, ${ORG.address.street}, ${ORG.address.postalCode} ${ORG.address.city}, Germany. ` +
      `Founders: ${ORG.founders.join(' and ')}. Contact: ${ORG.email}, ${ORG.telephone}. ` +
      `Services: ${ORG.knowsAbout.join(', ').toLowerCase()}.`,
    '',
  ]
  if (!full) {
    out.push('## Selected work', '', ...work.map(line), '')
    out.push(
      '## About',
      '',
      `- [About & contact](${abs('/about')}): who we are, how to reach us, imprint and privacy.`,
      ''
    )
    out.push('## Optional', '', ...archive.map(line), `- [Full text of every project](${abs('/llms-full.txt')})`, '')
    return out.join('\n')
  }
  for (const [title, list] of [
    ['Selected work', work],
    ['Archive', archive],
  ] as const) {
    out.push(`## ${title}`, '')
    for (const p of list) {
      out.push(`### ${p.name}${p.subject ? ` — ${p.subject}` : ''}`, '', `URL: ${abs(p.path!)}`)
      if (p.service) out.push(`Services: ${p.service}`)
      out.push('', p.fullText || p.description, '')
    }
  }
  out.push('## About', '')
  for (const a of idx.about) out.push(`### ${a.label}`, '', a.text, '')
  return out.join('\n')
}

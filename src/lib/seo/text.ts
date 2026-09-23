import { stripStega } from 'react-datocms/stega'

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  lsquo: '‘',
  rsquo: '’',
  sbquo: '‚',
  ldquo: '“',
  rdquo: '”',
  bdquo: '„',
  auml: 'ä',
  ouml: 'ö',
  uuml: 'ü',
  Auml: 'Ä',
  Ouml: 'Ö',
  Uuml: 'Ü',
  szlig: 'ß',
  eacute: 'é',
  egrave: 'è',
  aacute: 'á',
  agrave: 'à',
  ccedil: 'ç',
  euro: '€',
  copy: '©',
  reg: '®',
  trade: '™',
}

export function decodeEntities(s: string): string {
  return s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)
      return Number.isFinite(code) ? String.fromCodePoint(code) : m
    }
    return ENTITIES[e] ?? m
  })
}

/** HTML (or Markdown-ish) → one line of plain text. */
export function htmlToText(html: string | null | undefined): string {
  if (!html) return ''
  return decodeEntities(
    stripStega(html)
      .replace(/<(br|\/p|\/div|\/h\d|\/li)\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/[*_#`]+/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  )
    .replace(/\s+/g, ' ')
    .trim()
}

/** Cuts at a word boundary and adds an ellipsis. */
export function truncate(s: string, max = 158): string {
  if (s.length <= max) return s
  const cut = s.slice(0, max - 1)
  const at = cut.lastIndexOf(' ')
  return `${(at > max * 0.5 ? cut.slice(0, at) : cut).replace(/[\s,;:–—-]+$/, '')}…`
}

export type ProjectSummary = { client: string; kind: string; subject: string; body: string }

/**
 * Project texts start with a credit paragraph: `client<br><strong>kind</strong><br><em>subject</em>`,
 * followed by the story. Splits that apart; everything is optional.
 */
export function projectSummary(html: string | null | undefined): ProjectSummary {
  const empty = { client: '', kind: '', subject: '', body: '' }
  if (!html) return empty
  const clean = stripStega(html)
  const first = /<p\b[^>]*>([\s\S]*?)<\/p>/i.exec(clean)
  if (!first) return { ...empty, body: htmlToText(clean) }
  const segments = first[1].split(/<br\s*\/?>/i).filter((s) => htmlToText(s))
  const rest = htmlToText(clean.slice(first.index + first[0].length))
  if (segments.length < 2) return { ...empty, body: htmlToText(clean) }
  // the subject is the italic line; some records run the story on in the same line
  const third = segments.slice(2).join('<br>')
  const em = /^\s*(?:<[^>]+>\s*)*<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/i.exec(third)
  let subject = em ? htmlToText(em[2]) : htmlToText(third)
  let spill = em ? htmlToText(third.slice(em.index + em[0].length)) : ''
  if (!em && subject.length > 90) {
    spill = subject
    subject = ''
  }
  const body = [spill, rest].filter(Boolean).join(' ')
  return { client: htmlToText(segments[0]), kind: htmlToText(segments[1]), subject, body }
}

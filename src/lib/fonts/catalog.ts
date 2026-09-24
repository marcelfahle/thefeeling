/**
 * Fonts editors can pick in the DatoCMS text editor ("Font" menu).
 *
 * To change the selection: edit ENABLED below, run `pnpm fonts:fetch`, commit, deploy.
 * The editor plugin and the site both read the generated files, so DatoCMS needs no changes.
 * The team picks on /typo (every CATALOG font, self-hosted, noindex).
 * Don't remove a font that texts already use: those texts would fall back to Helvetica/Times.
 */

export type FontRole = 'grotesk' | 'serif' | 'display' | 'mono'

export type CatalogFont = {
  /** Google Fonts family name, also the CSS font-family name */
  family: string
  role: FontRole
  /** Google Fonts css2 axis spec */
  axes: string
  /** CSS fallbacks, in case the webfont hasn't loaded */
  fallback: string
  why: string
}

/** Shortlist for the meeting: two to four candidates per role. */
export const CATALOG = {
  // Helvetica-like
  inter: {
    family: 'Inter',
    role: 'grotesk',
    axes: 'ital,wght@0,400;0,700;1,400;1,700',
    fallback: 'Helvetica, Arial, sans-serif',
    why: 'Neutral, very readable, the closest modern Helvetica',
  },
  arimo: {
    family: 'Arimo',
    role: 'grotesk',
    axes: 'ital,wght@0,400;0,700;1,400;1,700',
    fallback: 'Helvetica, Arial, sans-serif',
    why: 'Same letter widths as Helvetica/Arial, so line breaks match',
  },
  'instrument-sans': {
    family: 'Instrument Sans',
    role: 'grotesk',
    axes: 'ital,wght@0,400;0,700;1,400;1,700',
    fallback: 'Helvetica, Arial, sans-serif',
    why: 'A little warmer and more contemporary',
  },
  // Times-like
  tinos: {
    family: 'Tinos',
    role: 'serif',
    axes: 'ital,wght@0,400;0,700;1,400;1,700',
    fallback: 'Times, "Times New Roman", serif',
    why: 'Same letter widths as Times: looks like today, on every device',
  },
  'libre-caslon-text': {
    family: 'Libre Caslon Text',
    role: 'serif',
    axes: 'ital,wght@0,400;0,700;1,400',
    fallback: 'Times, "Times New Roman", serif',
    why: 'Classic book serif, more elegant than Times',
  },
  newsreader: {
    family: 'Newsreader',
    role: 'serif',
    axes: 'ital,wght@0,400;0,700;1,400;1,700',
    fallback: 'Times, "Times New Roman", serif',
    why: 'Editorial serif made for screens',
  },
  'instrument-serif': {
    family: 'Instrument Serif',
    role: 'serif',
    axes: 'ital@0;1',
    fallback: 'Times, "Times New Roman", serif',
    why: 'Condensed display serif, great for big headlines',
  },
  // Headlines
  'archivo-black': {
    family: 'Archivo Black',
    role: 'display',
    axes: 'wght@400',
    fallback: 'Helvetica, Arial, sans-serif',
    why: 'Wide and heavy, the same family feel as the logo',
  },
  anton: {
    family: 'Anton',
    role: 'display',
    axes: 'wght@400',
    fallback: 'Impact, sans-serif',
    why: 'Tall and condensed, poster headlines',
  },
  'bebas-neue': {
    family: 'Bebas Neue',
    role: 'display',
    axes: 'wght@400',
    fallback: 'Impact, sans-serif',
    why: 'All caps, condensed, very campaign-like',
  },
  // Typewriter
  'ibm-plex-mono': {
    family: 'IBM Plex Mono',
    role: 'mono',
    axes: 'ital,wght@0,400;0,700;1,400;1,700',
    fallback: 'Menlo, Consolas, monospace',
    why: 'Clean typewriter look for credits and captions',
  },
  'space-mono': {
    family: 'Space Mono',
    role: 'mono',
    axes: 'ital,wght@0,400;0,700;1,400;1,700',
    fallback: 'Menlo, Consolas, monospace',
    why: 'Quirkier mono with character',
  },
} satisfies Record<string, CatalogFont>

export type FontId = keyof typeof CATALOG

/** What editors see in the Font menu, in this order. Recommendation until the team picks. */
export const ENABLED: FontId[] = ['inter', 'tinos', 'archivo-black', 'ibm-plex-mono']

/** "Standard" keeps the site's current font (the browser's default serif). */
export const STANDARD = { label: 'Standard', stack: 'inherit' }

/** Relative steps, so sizes follow each block's base font size (desktop and mobile). */
export const SIZE_STEPS = [
  { label: 'S', value: '0.75em' },
  { label: 'M', value: '1em' },
  { label: 'L', value: '1.5em' },
  { label: 'XL', value: '2.25em' },
  { label: 'XXL', value: '3.5em' },
]

export const cssStack = (f: CatalogFont) => `'${f.family}', ${f.fallback}`

export type Rgba = { red: number; green: number; blue: number; alpha: number }

const h = (v: number) => v.toString(16).padStart(2, '0')

/** gatsby-source-datocms `hex`: lowercase #rrggbb, plus `aa` when not fully opaque (the CDA's `hex` drops alpha). */
export function toHex(c: Rgba | null | undefined): string | undefined {
  if (!c) return undefined
  return `#${h(c.red)}${h(c.green)}${h(c.blue)}${c.alpha === 255 ? '' : h(c.alpha)}`
}

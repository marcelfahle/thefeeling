import 'server-only'
import { ImageResponse } from 'next/og'
import { LOGO_SVG } from './logoSvg'
import { BRAND_YELLOW, cardImage } from './site'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_TYPE = 'image/png'

type Font = { name: string; data: ArrayBuffer; weight: 400 | 700; style: 'normal' }

/** Archivo 400/700 as TTF (Satori can't read woff2); cached per server instance. */
let fonts: Promise<Font[]> | null = null
function loadFonts() {
  fonts ??= (async () => {
    try {
      const css = await (await fetch('https://fonts.googleapis.com/css2?family=Archivo:wght@400;700')).text()
      const urls = [...css.matchAll(/src: url\((.+?\.ttf)\)/g)].map((m) => m[1])
      const [regular, bold] = await Promise.all(urls.slice(0, 2).map(async (u) => (await fetch(u)).arrayBuffer()))
      return [
        { name: 'Archivo', data: regular, weight: 400, style: 'normal' },
        { name: 'Archivo', data: bold, weight: 700, style: 'normal' },
      ]
    } catch {
      fonts = null
      return []
    }
  })()
  return fonts
}
const options = async () => ({ ...OG_SIZE, fonts: await loadFonts() })

const LOGO = `data:image/svg+xml;base64,${Buffer.from(LOGO_SVG).toString('base64')}`
const logo = (width: number) => <img src={LOGO} width={width} height={Math.round((width * 46) / 300)} alt="" />

// Satori has no `inset`; overlays need explicit boxes
const FULL = { position: 'absolute', top: 0, left: 0, width: 1200, height: 630 } as const
const FRAME = {
  display: 'flex',
  width: '100%',
  height: '100%',
  background: '#000',
  position: 'relative',
  fontFamily: 'Archivo',
} as const

/** Home / About: background photo, big logo, one line of text. */
export async function brandCard(opts: { bg?: string | null; line: string; small?: string }) {
  const bg = cardImage(opts.bg)
  return new ImageResponse(
    <div style={FRAME}>
      {bg && <img src={bg} width={1200} height={630} alt="" style={{ ...FULL, objectFit: 'cover' }} />}
      <div
        style={{
          ...FULL,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.7))',
          color: '#fff',
        }}
      >
        {logo(900)}
        <div style={{ display: 'flex', fontSize: 44, fontWeight: 700, marginTop: 44, textAlign: 'center' }}>
          {opts.line}
        </div>
        {opts.small && (
          <div style={{ display: 'flex', fontSize: 28, color: BRAND_YELLOW, marginTop: 14 }}>{opts.small}</div>
        )}
      </div>
    </div>,
    await options()
  )
}

/** Collages: a mosaic of project visuals under the logo. */
export async function mosaicCard(opts: { images: string[]; title: string; line: string }) {
  const tiles = opts.images.slice(0, 8).map((u) => cardImage(u, 300, 315)!)
  return new ImageResponse(
    <div style={FRAME}>
      <div style={{ ...FULL, display: 'flex', flexWrap: 'wrap' }}>
        {tiles.map((src) => (
          <img key={src} src={src} width={300} height={315} alt="" style={{ objectFit: 'cover' }} />
        ))}
      </div>
      <div
        style={{
          ...FULL,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 56,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 20%, rgba(0,0,0,0.9))',
          color: '#fff',
        }}
      >
        {logo(520)}
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, marginTop: 28 }}>{opts.title}</div>
        <div style={{ display: 'flex', fontSize: 32, color: BRAND_YELLOW, marginTop: 6 }}>{opts.line}</div>
      </div>
    </div>,
    await options()
  )
}

/** Project pages: full-bleed visual, client + service, small logo. */
export async function projectCard(opts: { image?: string | null; client: string; service: string; subject?: string }) {
  const img = cardImage(opts.image)
  const long = opts.client.length > 26
  return new ImageResponse(
    <div style={{ ...FRAME, background: '#111' }}>
      {img && <img src={img} width={1200} height={630} alt="" style={{ ...FULL, objectFit: 'cover' }} />}
      <div
        style={{
          ...FULL,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 56,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.92) 100%)',
          color: '#fff',
        }}
      >
        {logo(420)}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: long ? 60 : 80, fontWeight: 700, lineHeight: 1.05 }}>
            {opts.client}
          </div>
          {opts.service && (
            <div style={{ display: 'flex', fontSize: 36, color: BRAND_YELLOW, marginTop: 14 }}>{opts.service}</div>
          )}
          {opts.subject && (
            <div style={{ display: 'flex', fontSize: 30, marginTop: 8, opacity: 0.9 }}>{opts.subject}</div>
          )}
        </div>
      </div>
    </div>,
    await options()
  )
}

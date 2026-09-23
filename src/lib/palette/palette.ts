/** Header.js:118-150 / layouts/index.js:31-63 */
export const PALETTES = [
  {
    leftBg: '#e53212',
    leftText: '#2b632d',
    rightBg: '#c78800',
    rightText: '#ffed00',
  },
  {
    leftBg: '#009ee3',
    leftText: '#273582',
    rightBg: '#e53212',
    rightText: '#c78800',
  },
  {
    leftBg: '#009ee3',
    leftText: '#ffffff',
    rightBg: '#2b632d',
    rightText: '#c78800',
  },
  {
    leftBg: '#b51614',
    leftText: '#009ee3',
    rightBg: '#273582',
    rightText: '#e30513',
  },
  {
    leftBg: '#ffed00',
    leftText: '#273582',
    rightBg: '#e30513',
    rightText: '#b51614',
  },
] as const

/** Picks a palette index, honoring `?__palette=N` (tests / screenshots). */
export function pickPalette(search: string, random: () => number = Math.random): number {
  const forced = new URLSearchParams(search).get('__palette')
  if (forced !== null && /^\d+$/.test(forced) && Number(forced) < PALETTES.length) return Number(forced)
  return Math.floor(random() * PALETTES.length)
}

export const paletteCss = PALETTES.map(
  (p, i) =>
    `html[data-palette="${i}"]{--pal-left-bg:${p.leftBg};--pal-left-text:${p.leftText};--pal-right-bg:${p.rightBg};--pal-right-text:${p.rightText}}`
).join('')

/** Runs in <head> before first paint so the header never flashes the wrong palette. */
export const paletteBootScript = `(function(){try{var m=/[?&]__palette=(\\d+)/.exec(location.search);var n=${PALETTES.length};var i=m&&+m[1]<n?+m[1]:Math.floor(Math.random()*n);document.documentElement.setAttribute('data-palette',String(i))}catch(e){document.documentElement.setAttribute('data-palette','0')}})()`

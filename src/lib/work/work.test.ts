import { describe, expect, it } from 'vitest'
import { youtubeId } from './youtube'
import { blockParts } from './blocks'

/** Verbatim copy of the old parser to compare against. */
function oldParser(url: string) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[7].length == 11 ? match[7] : false
}

describe('youtubeId', () => {
  it.each([
    'https://youtu.be/2FuLzqgWuHQ',
    'https://youtu.be/Ufx0ulpx7-0',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'http://www.youtube.com/v/dQw4w9WgXcQ?version=3',
    'https://www.youtube.com/u/1/dQw4w9WgXcQ',
    'https://vimeo.com/12345',
    'https://youtu.be/short',
  ])('%s', (url) => expect(youtubeId(url)).toBe(oldParser(url)))
  it('extracts the id', () => expect(youtubeId('https://youtu.be/2FuLzqgWuHQ')).toBe('2FuLzqgWuHQ'))
})

const img = { url: 'x', width: 100, height: 100 }
const vid = {
  url: 'https://youtu.be/2FuLzqgWuHQ',
  provider: 'youtube',
  providerUid: '2FuLzqgWuHQ',
}

describe('blockParts', () => {
  it('text only', () =>
    expect(
      blockParts({
        text: '<p>a</p>',
        image: null,
        boldVideoId: null,
        video: null,
      })
    ).toMatchObject({ text: true, textOverImage: false, image: false }))
  it('empty text is ignored', () =>
    expect(blockParts({ text: '', image: null, boldVideoId: null, video: null }).text).toBe(false))
  it('text + image', () =>
    expect(
      blockParts({
        text: '<p>a</p>',
        image: img,
        boldVideoId: null,
        video: null,
      })
    ).toMatchObject({ text: false, textOverImage: true, image: true }))
  it('image + bold video → player with poster, no plain image', () =>
    expect(blockParts({ text: null, image: img, boldVideoId: 'abc', video: null })).toMatchObject({
      image: false,
      boldPlayer: true,
    }))
  it('bold video without image renders nothing', () =>
    expect(Object.values(blockParts({ text: null, image: null, boldVideoId: 'abc', video: null })).some(Boolean)).toBe(
      false
    ))
  it('external video → youtube button (alongside image)', () =>
    expect(blockParts({ text: null, image: img, boldVideoId: null, video: vid })).toMatchObject({
      image: true,
      youtubeButton: true,
    }))
  it('bold video wins over external video', () =>
    expect(blockParts({ text: null, image: img, boldVideoId: 'abc', video: vid }).youtubeButton).toBe(false))
})

import { toHex } from '@/lib/color'
describe('toHex (gatsby-source-datocms parity)', () => {
  it('opaque', () => expect(toHex({ red: 255, green: 255, blue: 255, alpha: 255 })).toBe('#ffffff'))
  it('with alpha', () => expect(toHex({ red: 0, green: 0, blue: 255, alpha: 0 })).toBe('#0000ff00'))
  it('null', () => expect(toHex(null)).toBeUndefined())
})

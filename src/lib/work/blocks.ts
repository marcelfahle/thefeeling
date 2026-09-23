import type { SubPage } from '@/lib/datocms/queries'

export type BlockParts = {
  text: boolean
  textOverImage: boolean
  image: boolean
  boldPlayer: boolean
  youtubeButton: boolean
}

/** single-work.js:532-613 — which parts a sub-page renders (several can apply at once). */
export function blockParts(item: Pick<SubPage, 'text' | 'image' | 'boldVideoId' | 'video'>): BlockParts {
  const hasText = !!item.text && item.text !== ''
  return {
    text: hasText && !item.image,
    textOverImage: hasText && !!item.image,
    image: !!item.image && !item.boldVideoId,
    boldPlayer: !!item.image && !!item.boldVideoId,
    youtubeButton: !!item.video && !item.boldVideoId,
  }
}

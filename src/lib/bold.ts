import 'server-only'

const BASE = 'https://app.boldvideo.io/api'
const HOME_PLAYLIST = 'geg8b'

export type BoldVideo = {
  id: string
  playback_id: string
  title: string | null
}

function init(): RequestInit {
  return {
    headers: {
      Authorization: process.env.BOLD_API_KEY!,
      'Content-Type': 'application/json; charset=utf-8',
    },
    cache: 'force-cache',
    next: { tags: ['bold'], revalidate: 3600 },
  }
}

/** Candidate MP4 URLs for one Mux asset, best first (medium.mp4 uses the legacy mp4_support). */
export function mp4Sources(playbackId: string): string[] {
  return ['medium.mp4', 'highest.mp4', 'capped-1080p.mp4'].map((r) => `https://stream.mux.com/${playbackId}/${r}`)
}

/** index.js:11-47 — the home background playlist. Returns [] on any failure. */
export async function getHomePlaylist(): Promise<string[][]> {
  try {
    const res = await fetch(`${BASE}/playlists/${HOME_PLAYLIST}`, init())
    if (!res.ok) throw new Error(`Bold playlist: HTTP ${res.status}`)
    const data = (await res.json()) as { videos: { playback_id: string }[] }
    return data.videos.filter((v) => v.playback_id).map((v) => mp4Sources(v.playback_id))
  } catch (err) {
    console.error(err)
    return []
  }
}

/** single-work.js:419-447 — fetch in parallel, drop non-200s. Keyed by Bold video id. */
export async function getBoldVideos(ids: string[]): Promise<Record<string, BoldVideo>> {
  const unique = [...new Set(ids.filter(Boolean))]
  const results = await Promise.all(
    unique.map(async (id) => {
      try {
        const res = await fetch(`${BASE}/videos/${encodeURIComponent(id)}`, init())
        if (res.status !== 200) return null
        const { data } = (await res.json()) as { data: BoldVideo }
        return {
          id: data.id,
          playback_id: data.playback_id,
          title: data.title ?? null,
        }
      } catch {
        return null
      }
    })
  )
  return Object.fromEntries(results.filter((v): v is BoldVideo => !!v).map((v) => [v.id, v]))
}

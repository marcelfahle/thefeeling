'use client'

import MuxPlayer from '@mux/mux-player-react'
import { useEffect, useState } from 'react'
import type { BoldVideo } from '@/lib/bold'

/** Port of bold-player.js */
export default function BoldPlayer({ poster, video, color }: { poster: string; video: BoldVideo; color: string }) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  // bumping the key remounts the player so the poster shows again after the end
  const [round, setRound] = useState(0)

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  return (
    <div className="bold-player">
      <MuxPlayer
        key={round}
        streamType="on-demand"
        {...{ id: `id-${video.id}` }}
        poster={poster}
        primaryColor={color}
        playbackId={video.playback_id}
        defaultHiddenCaptions
        className={isFullscreen ? 'fullscreen' : undefined}
        metadata={{
          video_id: video.id,
          video_title: video.title ?? '',
          viewer_user_id: 'the-feeling',
        }}
        onEnded={() => {
          if (!document.fullscreenElement) setRound((r) => r + 1)
        }}
      />
    </div>
  )
}

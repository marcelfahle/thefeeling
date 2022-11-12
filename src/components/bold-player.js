import React, { useEffect } from 'react'
import MuxPlayer from '@mux/mux-player-react'

export default function BoldPlayer({poster, videoId}) {

  return (
    <div className="bold-player">
      <MuxPlayer
        streamType="on-demand"
        id={videoId}
        poster={poster}
        playbackId={videoId}
        defaultHiddenCaptions={true}
        metadata={{
          video_id: 'video-id-54321',
          video_title: 'Test video title',
          viewer_user_id: 'user-id-007',
        }}
      />
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import MuxPlayer from '@mux/mux-player-react'

export default function BoldPlayer({ poster, video }) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Watch for fullscreenchange
  React.useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const handleOnEnded = (e) => {
    const video = e.target
    const poster = video.shadowRoot
      .querySelector(`media-theme-mux`)
      .shadowRoot.querySelector('media-controller media-poster-image')

    poster.removeAttribute('media-has-played')
  }

  return (
    <div className="bold-player">
      <MuxPlayer
        streamType="on-demand"
        id={`id-${video.id}`}
        poster={poster}
        playbackId={video.playback_id}
        defaultHiddenCaptions={true}
        className={isFullscreen && 'fullscreen'}
        metadata={{
          video_id: video.id,
          video_title: video.title,
          viewer_user_id: 'the-feeling',
        }}
        onEnded={handleOnEnded}
      />
    </div>
  )
}

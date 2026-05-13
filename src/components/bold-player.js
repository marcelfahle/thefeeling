import React from 'react'
import MuxPlayer from '@mux/mux-player-react'

function stopSlideNavigation(event) {
  event.stopPropagation()
}

export default function BoldPlayer({ poster, video, color, aspectRatio }) {
  const playerRef = React.useRef(null)
  const [hasStarted, setHasStarted] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const playerStyle = {
    '--video-aspect-ratio': String(aspectRatio || 16 / 9),
    '--video-accent-color': color || 'white',
  }

  // Watch for fullscreenchange
  React.useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)

    return () =>
      document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  const handleOnEnded = (e) => {
    setIsPlaying(false)
    const video = e.target
    const poster = video.shadowRoot
      ?.querySelector(`media-theme-mux`)
      ?.shadowRoot?.querySelector('media-controller media-poster-image')

    if (poster) poster.removeAttribute('media-has-played')
  }

  const handlePlay = () => {
    setHasStarted(true)
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleOverlayClick = (event) => {
    stopSlideNavigation(event)

    if (!playerRef.current) return

    const play = playerRef.current.play()
    if (play && play.catch) play.catch(() => {})
  }

  return (
    <div
      className="bold-player"
      style={playerStyle}
      onClick={stopSlideNavigation}
      onMouseDown={stopSlideNavigation}
      onMouseUp={stopSlideNavigation}
      onPointerDown={stopSlideNavigation}
      onPointerUp={stopSlideNavigation}
      onTouchStart={stopSlideNavigation}
      onTouchEnd={stopSlideNavigation}
    >
      <MuxPlayer
        ref={playerRef}
        streamType="on-demand"
        id={`id-${video.id}`}
        poster={poster}
        primaryColor={color}
        playbackId={video.playback_id}
        defaultHiddenCaptions={true}
        className={isFullscreen ? 'fullscreen' : undefined}
        metadata={{
          video_id: video.id,
          video_title: video.title,
          viewer_user_id: 'the-feeling',
        }}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleOnEnded}
      />
      {hasStarted && !isPlaying && (
        <button
          type="button"
          className="bold-player__play"
          aria-label="Play video"
          onClick={handleOverlayClick}
        >
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <path d="M36 24v52l43-26z" />
          </svg>
        </button>
      )}
    </div>
  )
}

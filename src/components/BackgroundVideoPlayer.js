import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import videojs from 'video.js'
import 'videojs-playlist'

import Header from './Header'

const BackgroundVideoPlayer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  border: 5px solid red;
  > a {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    z-index: 40;
    background: black;
  }
  .video-js > div,
  .video-js > button {
    display: none !important;
  }
  video {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
    + * {
      display: none !important;
    }
  }
  @media (min-aspect-ratio: 16/9) {
    video {
      height: 300%;
      top: -100%;
    }
  }
  @media (max-aspect-ratio: 16/9) {
    video {
      width: 300%;
      left: -100%;
    }
  }
  @supports (object-fit: cover) {
    video {
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { playlist } = this.props
    const shuffled = this.shuffle(playlist)
    const pl = shuffled.map((e, i) => ({
      sources: [
        {
          type: 'video/mp4',
          src: e.videoUrl,
        },
      ],
    }))
    const videoJsOptions = {
      autoplay: true,
      controls: false,
      preload: 'none',
      sources: pl,
    }

    this.player = videojs(this.videoNode, null, () => console.log('ready'))
    this.player.playlist(pl)
    this.player.playlist.autoadvance(0)
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  shuffle = arr =>
    arr
      .map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1])

  render() {
    return (
      <BackgroundVideoPlayer>
        <Header siteTitle="THE FEELING" />
        <Link to="/oeuvre">
          <video
            playsInline="true"
            muted
            autoPlay
            ref={node => (this.videoNode = node)}
            className="video-js"
          />
        </Link>
      </BackgroundVideoPlayer>
    )
  }
}

export default VideoPlayer

import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import Link from 'gatsby-link'
import videojs from 'video.js'
import './BackgroundVideoPlayer.css'
import videojsPlaylistPlugin from 'videojs-playlist'
import Header from './Header'

videojs.registerPlugin('playlist', videojsPlaylistPlugin)

const GlobalStyle = createGlobalStyle`
	.video-js > div,
	video + div {
	opacity: 0;
		display: none !important;
	}
`

const Wrapper = styled.div`
  background: black;
  position: fixed;
  width: 100vw;
  height: 100wh;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  > a {
    .video-js ~ {
      display: none !important;
    }
  }

  video {
    z-index: 30;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
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

const StyledLink = styled(Link)`
  z-index: 100;
  height: 100vh;
  width: 100vw;
  display: block;
  position: relative;
  display: block;
  background: rgba(0, 0, 0, 0);
  > div {
    position: relative;
    z-index: 100;
  }
`

class VideoPlayer extends React.Component {
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
    //const videoJsOptions = {
    //  autoplay: true,
    //  controls: false,
    //  preload: 'none',
    //  sources: pl,
    //}
    //console.log('component did mount')
    //console.log('playlist', pl)

    this.player = videojs(this.videoNode, { controls: false }, () => {
      //console.log('player ready.', this, this.player)
    })
    this.player.on('play', () => videojs.log('play'))
    //this.player.on('ended', () => this.player.playlist.next())
    //this.player.on('playlistitem', (e, f) => videojs.log('playlistitem', e, f))
    this.player.playlist(pl)
    this.player.playlist.repeat(true)
    //this.player.playlist.shuffle()
    this.player.playlist.autoadvance(0.5)
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
    const { color } = this.props
    return (
      <Wrapper>
        <GlobalStyle />
        <Header color={color} siteTitle="THE FEELING" />
        <StyledLink to="/oeuvre" />
        <video
          playsInline
          muted
          autoPlay
          controls={false}
          ref={node => (this.videoNode = node)}
          className="video-js"
        />
      </Wrapper>
    )
  }
}

export default VideoPlayer

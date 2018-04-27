import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import { connect } from 'react-redux'
import JPlayer, { Poster, Video } from 'react-jplayer'
import JPlaylist, {
  initializeOptions,
  Playlist,
  actions,
} from 'react-jplaylist'
import Header from './Header'

const jPlayerOptions = {
  id: 'feeling',
  verticalVolume: true,
  paused: false,
  autoplay: true,
}

const jPlaylistOptions = {
  hidePlaylist: true,
  shuffleOnLoop: true,
}

initializeOptions(jPlayerOptions, jPlaylistOptions)

const BackgroundVideoPlayer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  video {
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

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { dispatch, playlist } = this.props
    const shuffled = this.shuffle(playlist)
    const pl = shuffled.map((e, i) => ({
      id: i,
      sources: { m4v: e.videoUrl },
    }))

    dispatch(actions.setPlaylist('feeling', pl))
    dispatch(actions.shuffle('feeling', true, true))
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
          <JPlaylist id="feeling">
            <JPlayer className="jp-sleek">
              <div className="jp-media-container">
                <Poster />
                <Video />
              </div>
            </JPlayer>
          </JPlaylist>
        </Link>
      </BackgroundVideoPlayer>
    )
  }
}

export default connect()(VideoPlayer)

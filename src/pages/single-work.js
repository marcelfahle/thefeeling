import React from 'react'
import { graphql } from 'gatsby'
import styled, { css } from 'styled-components'
import { isSafari, isIOS } from 'react-device-detect'
import { Swipeable } from './../components/swipeable'
import ModalVideo from 'react-modal-video'
import Header from './../components/Header'
//import CloseIcon from './../components/CloseIcon'
import Smile from './../components/icons8-happy-96.png'
import MouseLeft from './../components/mouse-left.png'
import MouseRight from './../components/mouse-right.png'
import MouseUp from './../components/mouse-up.png'
import BoldPlayer from './../components/bold-player'
//import CloseIconWhite from './../components/kreuz-white.svg'
//import BackArrow from './../components/icons8-undo-96.png'
//import PlayIcon from './../components/icons8-play-96.png'
//import { Transition } from 'react-spring'
import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons'
import { useMediaQuery } from 'react-responsive'
import './../../node_modules/react-modal-video/css/modal-video.min.css'
import bg from './../layouts/bg-home.jpg'

import { createGlobalStyle } from 'styled-components'

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 })
  return isDesktop ? children : null
}
const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 991 })
  return isMobile ? children : null
}

const GlobalStyle = createGlobalStyle`
  html,body {
		position: fixed;
		width: 100vw;
		height: calc(var(--vh, 1vh) * 100);
  }
`

const Image = styled.img`
  height: auto;
  max-width: 91%;
  max-height: calc(100vh - 160px);
  user-select: none;
  opacity: ${(props) => props.opacity};
  margin-bottom: -5px;

  transition: bottom 0.8s ease;
  @media (orientation: landscape) and (max-height: 480px) {
    margin-top: 0;
    max-height: calc(100vh - 100px);
  }
`

//const StyledSwipeable = styled(Swipeable)``

const StartVideoButton2 = styled.div`
  width: 152px;
  height: 152px;
  position: absolute;
  left: calc(50% - 76px);
  top: calc(calc(var(--vh, 1vh) * 50) - 76px);
  cursor: url(${MouseUp}), auto !important;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 50%;
  }
  @media (orientation: landscape) and (max-height: 480px) {
    top: calc(calc(var(--vh, 1vh) * 50) - 76px);
    z-index: 60;
  }
  @media (orientation: portrait) {
    top: calc(calc(var(--vh, 1vh) * 51) - 76px);
  }
`
const StartVideoButton = styled.div`
  width: 152px;
  height: 152px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: url(${MouseUp}), auto !important;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 50%;
  }
`

const Wrapper = styled.div`
  /* position: relative; */
  background: black;
  background: url('${(props) => props.bg || bg}') no-repeat;
  background-attachment: fixed;
  background-size: cover;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  min-height: calc(var(--vh, 1vh) * 100);
  /* mobile viewport bug fix */
  /*min-height: -webkit-fill-available;*/
  overflow: auto;
  -webkit-overflow-scrolling: auto;
  z-index: 49;
  .container > div > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &.default {
    cursor: url(${Smile}), auto;
  }
  &.left {
    cursor: url(${MouseLeft}), auto;
  }
  &.right {
    cursor: url(${MouseRight}), auto;
  }
  &.execute {
    cursor: url(${MouseUp}), auto;
  }

  .modal-video-movie-wrap {
    @media (max-width: 960px) {
      margin: 45px;
      width: calc(100% - 120px);
      max-height: calc(100% - 240px);
    }
  }
`

const ContentWrap = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`
const MobileContainer = styled.div`
  margin-top: 26vw;
  @media (min-width: 550px) {
    margin-top: 130px;
  }
`
const ContentWrapMobile = styled.div`
  /* padding-top: 140px; */
  /* padding-bottom: 140px; */

  position: relative;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  /* align-items: center; */
  margin-bottom: 30px;
`
const Content = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (orientation: portrait) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`
const TextFieldBaseStyles = css`
  background: ${(props) => props.bgColor || 'black'};
  color: ${(props) => props.textColor || 'white'};
  padding: 20px;
  text-align: left;
  font-size: ${(props) => props.baseFontSizeMobile}px;
  @media (min-width: 720px) and (min-height: 760px) {
    font-size: ${(props) => props.baseFontSize}px;
  }
  user-select: none;
  p {
    font-size: 1em;
  }
  h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }
  h2 {
    font-size: 1.5em;
    margin: 0.75em 0;
  }
  h3 {
    font-size: 1.17em;
    margin: 0.83em 0;
  }
  h4 {
    margin: 1.12em 0;
  }
  h5 {
    font-size: 0.83em;
    margin: 1.5em 0;
  }
  h6 {
    font-size: 0.75em;
    margin: 1.67em 0;
  }
`
const TextOverImageContent = styled.div`
  ${TextFieldBaseStyles};
  width: calc(100% - 10px);
  height: calc(100% - 12px);
  position: absolute;
  z-index: 20;
  overflow: hidden;
  p {
    margin-top: 0;
  }
`
const TextContent = styled.div`
  ${TextFieldBaseStyles};
  min-width: 240px;
  width: 100%;
  max-width: calc(91% - 40px);
  /* margin-left: 50%; */
  /* transform: translateX(-50%); */
  z-index: 21;

  p:first-child {
    margin-top: 0;
  }
  p:last-child {
    margin-bottom: 0;
  }

  /*@media (min-width: 420px) {
    font-size: 24px;
  }
  @media (min-width: 960px) {
    max-width: 720px;
    font-size: 40px;
    padding: 6px 10px;
  }*/
`

const VideoLayer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .bold-player {
    max-width: 91%;
    max-height: calc(100vh - 160px);
    height: 100%;
    min-width: ${isSafari ? '60vw' : '0'};
    @media (orientation: landscape) and (max-height: 480px) {
      margin-top: 0;
      max-height: calc(100vh - 100px);
    }

    mux-player {
      width: 100%;
      --controls-backdrop-color: rgb(0 0 0 / 0%);
      --seek-live-button: none;
      --seek-backward-button: none;
      --seek-forward-button: none;
      --mute-button: none;
      --captions-button: none;
      --airplay-button: none;
      --pip-button: none;
      --cast-button: none;
      --playback-rate-button: none;
      --volume-range: none;
      --time-range: none;
      --time-display: none;
      --media-object-fit: cover;
      --bottom-play-button: none;
      --media-button-icon-width: 48px;
      --media-button-icon-height: 48px;
      --fullscreen-button: ${isSafari && !isIOS ? 'none' : 'white'};
    }
    mux-player.fullscreen {
      border: 5px solid blue;
    }
    mux-player:not(:fullscreen) {
      max-height: calc(100vh - 160px);
    }
    track {
      display: none !important;
      opacity: 0;
    }
    mux-player::cue {
      opacity: 0;
      display: none !important;
    }
    mux-player::-webkit-media-text-track-display {
      opacity: 0;
      display: none !important;
    }
    mux-player::part(gesture-layer) {
      display: none;
    }
    mux-player::part(poster) img {
      object-fit: cover !important;
    }

    mux-player::part(video) {
      min-width: auto;
      min-height: auto;
      width: 100%;
      height: 100%;
      max-height: calc(100vh - 160px);
      object-fit: contain;
    }
    mux-player.fullscreen::part(video) {
      max-height: 100vh;
    }
  }
`

//const CloseButton = styled(Link)`
//  position: absolute;
//  display: none;
//  right: 25px;
//  top: 25px;
//  width: 28px;
//  height: 28px;
//  z-index: 151;
//
//  svg {
//    width: 100%;
//    height: 100%;
//  }
//
//  @media (min-width: 720px) {
//    right: 50px;
//    width: 54px;
//    height: 54px;
//  }
//  @media (orientation: landscape) {
//    display: none;
//  }
//`

const StyledModalVideo = styled(ModalVideo)``

function isEventInElement(event, element) {
  if (!element) return false
  var rect = element.getBoundingClientRect()
  var x = event.clientX
  if (x < rect.left || x >= rect.right) return false
  var y = event.clientY
  if (y < rect.top || y >= rect.bottom) return false
  return true
}

export default class SingleWork extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 0,
      cursor: 'default',
      showVideo: false,
      videoId: null,
      lastPos: '#0',
      orientation: null,
      boldVideos: null,
    }
  }

  async componentDidMount() {
    if (window && window.location.hash) {
      this.setState({ lastPos: window.location.hash })
    }

    // dirty
    var type
    if (this.props.data.work) {
      type = 'work'
    } else {
      type = 'archive'
    }
    const subs = this.props.data[type].subPages

    const boldVideoIds = subs
      .map((sub) => (sub.boldVideoId ? sub.boldVideoId : null))
      .filter((sub) => sub)

    console.log('bold Ids', boldVideoIds)
    const videos = await this.loadBoldVideos(boldVideoIds)
    return this.setState({
      boldVideos: videos.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
    })
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth })
  }

  loadBoldVideos = async (ids) => {
    let results
    const headers = {
      Authorization: process.env.GATSBY_BOLD_API,
      'Content-Type': 'application/json; charset=utf-8',
    }

    try {
      const resp = await Promise.all(
        ids.map((id) => {
          return fetch(`https://app.boldvideo.io/api/videos/${id}`, { headers })
        })
      )
      const filteredResp = resp.filter((res) => res.status === 200)

      console.log(filteredResp)
      results = Promise.all(
        filteredResp.map(async (res) => {
          const video = await res.json()
          console.log(video)
          return video.data
        })
      )
    } catch (err) {
      console.log('Error fetching Bold Videos', err)
    }
    console.log('results', results)
    return results
  }

  onMouseMove = (e) => {
    const w = document.documentElement.clientWidth
    const mx = e.clientX
    let dir
    if (mx > w / 2) {
      dir = 'right'
    } else {
      if (this.state.current > 0) {
        dir = 'left'
      } else {
        dir = 'default'
      }
    }

    this.setState({ cursor: dir })
  }

  scroll = (to) => {
    this.setState({ current: to })
    this.refs.parallax.scrollTo(to)
  }

  handleSwipeRight = (_pics, _e) => {
    const i = this.state.current
    this.scroll(i > 1 ? i - 1 : 0)
  }

  handleSwipeLeft = (pics, _e) => {
    const i = this.state.current
    this.scroll(i + 1 >= pics.length ? 0 : i + 1)
  }

  handleClick = (pics, i, e, content) => {
    if (content.boldVideoId) {
      const vid = document.getElementById(`id-${content.boldVideoId}`)
      const playButton = document
        .querySelector(`#id-${content.boldVideoId}`)
        ?.shadowRoot.querySelector('media-theme-mux')
        ?.shadowRoot.querySelector('media-controller media-play-button')

      // add fullscreen button
      const fsButton = document
        .querySelector(`#id-${content.boldVideoId}`)
        ?.shadowRoot.querySelector('media-theme-mux')
        ?.shadowRoot.querySelector('media-controller media-fullscreen-button')
      // .shadowRoot.querySelector('media-fullscreen-button')

      if (
        content.boldVideoId &&
        ((vid && isEventInElement(e, vid)) ||
          isEventInElement(e, playButton) ||
          isEventInElement(e, fsButton))
      )
        return
    }

    const w = document.documentElement.clientWidth
    const mx = e.clientX

    const dir = mx > w / 2 ? 1 : i >= 1 ? -1 : 0

    // stop video if there was one
    if (content.boldVideoId) {
      const vid = document.getElementById(`id-${content.boldVideoId}`)
      vid.pause()
      vid.currentTime = 0
    }

    this.scroll(i >= pics.length - 1 ? 0 : i + dir)
  }

  youtube_parser = (url) => {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    var match = url.match(regExp)
    return match && match[7].length == 11 ? match[7] : false
  }

  startVideo = (url, e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ videoId: this.youtube_parser(url), showVideo: true })
  }

  renderContent = (item, work) => {
    console.log('item', item)
    return (
      <Content>
        {item.text && item.text !== '' && !item.image && (
          <TextContent
            baseFontSize={item.baseFontSize}
            baseFontSizeMobile={item.baseFontSizeMobile}
            bgColor={
              item.themeColor
                ? item.themeColor.hex
                : work.themeColor
                ? work.themeColor.hex
                : 'rgba(0,0,0,0)'
            }
            textColor={
              item.textColor
                ? item.textColor.hex
                : work.textColor
                ? work.textColor.hex
                : 'white'
            }
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
        )}
        {item.text && item.text !== '' && item.image && (
          <TextOverImageContent
            baseFontSize={item.baseFontSize}
            baseFontSizeMobile={item.baseFontSizeMobile}
            bgColor={
              item.themeColor ? item.themeColor.hex : work.themeColor.hex
            }
            textColor={item.textColor ? item.textColor.hex : work.textColor.hex}
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
        )}
        {item.image && !item.boldVideoId && (
          <Image src={item.image.url} opacity={item.opacity / 100} />
        )}
        {item.image && item.boldVideoId && (
          <VideoLayer>
            {this.state.boldVideos &&
              this.state.boldVideos[item.boldVideoId] && (
                <BoldPlayer
                  poster={item.image.url}
                  videoId={item.boldVideoId}
                  video={this.state.boldVideos[item.boldVideoId]}
                  color={
                    item.themeColor
                      ? item.themeColor.hex
                      : work.themeColor
                      ? work.themeColor.hex
                      : 'white'
                  }
                />
              )}
          </VideoLayer>
        )}
        {item.video && !item.boldVideoId && (
          <StartVideoButton
            onClick={(evt) => {
              evt.preventDefault()
              this.startVideo(item.video.url, evt)
            }}
          >
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path
                fill={
                  item.themeColor
                    ? item.themeColor.hex
                    : work.themeColor
                    ? work.themeColor.hex
                    : 'white'
                }
                d="M50 5C25.2 5 5 25.1 5 50c0 24.8 20.2 45 45 45s45-20.2 45-45C95 25.1 74.8 5 50 5zm18.2 46.7L40 69.1c-1.3.8-3-.1-3-1.7V32.6c0-1.6 1.7-2.5 3-1.7l28.2 17.4c1.2.8 1.2 2.6 0 3.4z"
              />
            </svg>
          </StartVideoButton>
        )}
      </Content>
    )
  }

  render() {
    var isArchive = false
    var bg, type
    var color = this.props.color
    if (this.props.data.work) {
      type = 'work'
      bg = this.props.bg.oeuvreDetail.url
    } else {
      type = 'archive'
      isArchive = true
      bg = this.props.bg.archiveDetail.url
    }
    const work = this.props.data[type]
    //const pics = this.props.data[type].pictures
    //const desc = this.props.data[type].descriptionNode.childMarkdownRemark.html

    //if (desc !== '') {
    //  const d = { type: 'text', content: desc }
    //  if (pics.length === 1 || !pics[1].type) pics.splice(1, 0, d)
    //}

    const lp = this.state.lastPos

    const subs = this.props.data[type].subPages

    return (
      <Wrapper
        bg={bg}
        className={this.state.cursor}
        onMouseMove={this.onMouseMove}
      >
        <GlobalStyle />
        <Header
          backto={isArchive ? `/ye-olden-stuffe${lp}` : `/oeuvre${lp}`}
          action={isArchive ? 'backarchive' : 'backhome'}
          size="small"
          siteTitle="THE FEELING"
          mini={true}
          color={color}
          position="fixed"
          flipped
        />

        <Desktop>
          <Swipeable
            onSwipedLeft={(e) => this.handleSwipeLeft(subs, e)}
            onSwipedRight={(e) => this.handleSwipeRight(subs, e)}
            preventScrollOnSwipe={true}
          >
            <Parallax
              className="container"
              ref="parallax"
              pages={subs.length}
              horizontal
              scrolling={false}
            >
              {subs.map((item, i) => (
                <ParallaxLayer
                  offset={i}
                  key={item.id}
                  speed={0}
                  onClick={(ev) => this.handleClick(subs, i, ev, item)}
                >
                  <ContentWrap>{this.renderContent(item, work)}</ContentWrap>
                </ParallaxLayer>
              ))}
            </Parallax>
          </Swipeable>
        </Desktop>
        <Mobile>
          <MobileContainer>
            {subs.map((item) => (
              <ContentWrapMobile key={item.id}>
                {this.renderContent(item, work)}
              </ContentWrapMobile>
            ))}
          </MobileContainer>
        </Mobile>

        {/*

        <InfoBox bgColor={work.themeColor.hex} textColor={work.textColor.hex}>
          <p
            dangerouslySetInnerHTML={{
              __html: work.infoNode.childMarkdownRemark.html,
            }}
          />
        </InfoBox>
        <CounterBox
          bgColor={work.themeColor.hex}
          textColor={work.textColor.hex}
        >
          <p>{this.state.current + 1}</p>
          <p>{pics.length}</p>
        </CounterBox>
				*/}
        <StyledModalVideo
          channel="youtube"
          isOpen={this.state.showVideo}
          videoId={this.state.videoId}
          onClose={() => this.setState({ showVideo: false })}
        />
      </Wrapper>
    )
  }
}

export const query = graphql`
  query WorkQuery($slug: String) {
    work: datoCmsPagePortfolio(slug: { eq: $slug }) {
      title
      width
      themeColor {
        hex
      }
      textColor {
        hex
      }

      subPages {
        id
        text
        externalLink
        baseFontSize
        baseFontSizeMobile
        opacity
        boldVideoId
        video {
          url
          title
          provider
          providerUid
          thumbnailUrl
          width
          height
        }
        themeColor {
          hex
        }
        textColor {
          hex
        }
        image {
          url
          resolutions {
            aspectRatio
          }
        }
      }
    }
    archive: datoCmsPageArchive(slug: { eq: $slug }) {
      title
      width
      themeColor {
        hex
      }
      textColor {
        hex
      }

      subPages {
        id
        text
        externalLink
        baseFontSize
        baseFontSizeMobile
        opacity
        boldVideoId
        video {
          url
          title
          provider
          providerUid
          thumbnailUrl
          width
          height
        }
        themeColor {
          hex
        }
        textColor {
          hex
        }
        image {
          url
          resolutions {
            aspectRatio
          }
        }
      }
    }
  }
`

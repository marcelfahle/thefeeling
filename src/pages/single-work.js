import React from 'react'
import { graphql } from 'gatsby'
import styled, { css } from 'styled-components'
import { Swipeable } from './../components/swipeable'
import ModalVideo from 'react-modal-video'
import Header from './../components/Header'
//import CloseIcon from './../components/CloseIcon'
import Smile from './../components/icons8-happy-96.png'
import MouseLeft from './../components/mouse-left.png'
import MouseRight from './../components/mouse-right.png'
//import CloseIconWhite from './../components/kreuz-white.svg'
//import BackArrow from './../components/icons8-undo-96.png'
//import PlayIcon from './../components/icons8-play-96.png'
import WatchIcon from './../components/play-button.png'
//import { Transition } from 'react-spring'
import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons'
import './../../node_modules/react-modal-video/css/modal-video.min.css'
import bg from './../layouts/bg-home.jpg'

import { createGlobalStyle } from 'styled-components'

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

const StartVideoButton = styled.div`
  width: 76px;
  height: 76px;
  position: absolute;
  left: calc(50% - 50px);
  top: calc(50% - 12px);
  z-index: 60;
  @media (orientation: landscape) and (max-height: 860px) {
    top: calc(50% - 45px);
  }
`

const Wrapper = styled.div`
  position: relative;
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

  .modal-video-movie-wrap {
    @media (max-width: 960px) {
      margin: 45px;
      width: calc(100% - 120px);
      max-height: calc(100% - 240px);
    }
  }
`

//const InfoBox = styled.div`
//  position: absolute;
//  background: ${props => props.bgColor || 'black'};
//  color: ${props => props.textColor || 'white'};
//  margin-left: 25px;
//  bottom: 25px;
//  text-align: left;
//  padding: 6px 10px;
//  font-size: 15px;
//  line-height: 1.2;
//  letter-spacing: 1px;
//  max-width: 50%;
//  p {
//    margin: 0;
//    padding: 0;
//  }
//
//  @media (min-width: 720px) {
//    font-size: 15px;
//    bottom: 35px;
//    margin-left: 4.5%;
//  }
//
//  transition: bottom 0.8s ease;
//  @media (orientation: landscape) {
//    bottom: -100px;
//  }
//`
//const CounterBox = styled.div`
//  position: absolute;
//  background: ${props => props.bgColor || 'black'};
//  color: ${props => props.textColor || 'white'};
//  width: 60px;
//  right: 25px;
//  bottom: 25px;
//  text-align: center;
//  padding: 6px 10px;
//  line-height: 1.2;
//  letter-spacing: 1px;
//  font-size: 14px;
//  transition: bottom 0.8s ease;
//  p {
//    margin: 0;
//    padding: 0;
//  }
//
//  @media (min-width: 720px) {
//    width: 100px;
//    font-size: 15px;
//    bottom: 35px;
//    margin-left: 4.5%;
//  }
//
//  @media (orientation: landscape) {
//    bottom: -100px;
//  }
//`
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
const Content = styled.div`
  position: relative;
  @media (orientation: portrait) {
    margin-top: 75px;
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
  margin-left: 50%;
  transform: translateX(-50%);
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
    }
  }

  componentDidMount() {
    if (window && window.location.hash) {
      this.setState({ lastPos: window.location.hash })
    }
  }

  onMouseMove = (e) => {
    const w = document.documentElement.clientWidth
    const mx = e.clientX

    const dir = mx > w / 2 ? 'right' : 'left'

    this.setState({ cursor: dir })
  }

  scroll = (to) => {
    this.setState({ current: to })
    this.refs.parallax.scrollTo(to)
  }

  handleSwipeRight = (pics, e) => {
    const i = this.state.current
    this.scroll(i > 1 ? i - 1 : 0)
  }

  handleSwipeLeft = (pics, e) => {
    const i = this.state.current
    this.scroll(i + 1 >= pics.length ? 0 : i + 1)
  }

  handleClick = (pics, i, e) => {
    const w = document.documentElement.clientWidth
    const mx = e.clientX

    const dir = mx > w / 2 ? 1 : i >= 1 ? -1 : 0

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
          position="absolute"
          flipped
        />

        <Swipeable
          onSwipedLeft={(e) => this.handleSwipeLeft(subs, e)}
          onSwipedRight={(e) => this.handleSwipeRight(subs, e)}
        >
          <Parallax
            className="container"
            ref="parallax"
            pages={subs.length}
            horizontal
            scrolling={false}
          >
            {subs.map((e, i) => (
              <ParallaxLayer
                offset={i}
                key={i}
                speed={0}
                onClick={(e) => this.handleClick(subs, i, e)}
              >
                <ContentWrap>
                  <Content>
                    {e.text && e.text !== '' && !e.image && (
                      <TextContent
                        baseFontSize={e.baseFontSize}
                        baseFontSizeMobile={e.baseFontSizeMobile}
                        bgColor={
                          e.themeColor
                            ? e.themeColor.hex
                            : work.themeColor
                            ? work.themeColor.hex
                            : 'rgba(0,0,0,0)'
                        }
                        textColor={
                          e.textColor
                            ? e.textColor.hex
                            : work.textColor
                            ? work.textColor.hex
                            : 'white'
                        }
                        dangerouslySetInnerHTML={{ __html: e.text }}
                      />
                    )}
                    {e.text && e.text !== '' && e.image && (
                      <TextOverImageContent
                        baseFontSize={e.baseFontSize}
                        baseFontSizeMobile={e.baseFontSizeMobile}
                        bgColor={
                          e.themeColor ? e.themeColor.hex : work.themeColor.hex
                        }
                        textColor={
                          e.textColor ? e.textColor.hex : work.textColor.hex
                        }
                        dangerouslySetInnerHTML={{ __html: e.text }}
                      />
                    )}
                    {e.image && (
                      <Image src={e.image.url} opacity={e.opacity / 100} />
                    )}
                  </Content>
                </ContentWrap>
                {e.video && (
                  <StartVideoButton
                    onClick={(evt) => this.startVideo(e.video.url, evt)}
                  >
                    <svg
                      height="100"
                      width="100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill={
                          e.themeColor
                            ? e.themeColor.hex
                            : work.themeColor
                            ? work.themeColor.hex
                            : 'white'
                        }
                        d="M50 5C25.2 5 5 25.1 5 50c0 24.8 20.2 45 45 45s45-20.2 45-45C95 25.1 74.8 5 50 5zm18.2 46.7L40 69.1c-1.3.8-3-.1-3-1.7V32.6c0-1.6 1.7-2.5 3-1.7l28.2 17.4c1.2.8 1.2 2.6 0 3.4z"
                      />
                    </svg>
                  </StartVideoButton>
                )}
              </ParallaxLayer>
            ))}
          </Parallax>
        </Swipeable>
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
        text
        externalLink
        baseFontSize
        baseFontSizeMobile
        opacity
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
        text
        externalLink
        baseFontSize
        baseFontSizeMobile
        opacity
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

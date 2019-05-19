import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import Swipeable from 'react-swipeable'
import ModalVideo from 'react-modal-video'
import Header from './../components/Header'
//import CloseIcon from './../components/CloseIcon'
import Smile from './../components/icons8-happy-96.png'
//import CloseIconWhite from './../components/kreuz-white.svg'
//import BackArrow from './../components/icons8-undo-96.png'
//import PlayIcon from './../components/icons8-play-96.png'
import WatchIcon from './../components/play-button.png'
//import { Transition } from 'react-spring'
import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons'
import './../../node_modules/react-modal-video/css/modal-video.min.css'
import bg from './../layouts/bg-home.jpg'

const Image = styled.img`
  height: auto;
  max-width: 80vw;
  max-height: calc(100vh - 160px);
  user-select: none;
  margin-top: 50px;

  transition: bottom 0.8s ease;
  @media (orientation: landscape) and (max-height: 480px) {
    margin-top: 0;
    max-height: calc(100vh - 100px);
  }
`

const StyledSwipeable = styled(Swipeable)``

const StartVideoButton = styled.div`
  width: 76px;
  height: 76px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  background: transparent url(${WatchIcon}) top left no-repeat;
  background-size: contain;
  z-index: 60;
`

const Wrapper = styled.div`
  position: relative;
	background: black;
	background: url('${props => props.bg || bg}') no-repeat;
	background-attachment: fixed;
	background-size: cover;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  z-index: 49;
  .container > div > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &.defaulttttt {
    cursor: url(${Smile}), auto;
  }
  &.leftttt {
    cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHASURBVHhe7d27TcQAFETRjQmARuiIIuiLLggIKIUibF5gJyutZD5ngdEcybL80QS3APtUVVVVVVVVVVVVVX/dsiyP67reb5c/QmxGmlBPE2qd89uc7rbb3yI2I+2hdnP9Osft9vhLxGak81C7uf8yp5vttU8Rm5EuhdrN8+ft1cPEZqQDod7neNheP0RsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsxhKxxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGa0A8H66WLtUrC53493X8t5sLnu5+uvbQ825/7A4bdMqP7CpKqqqqqqqqqqquofOJ0+AGIJEJ5SYMMhAAAAAElFTkSuQmCC)
        48 48,
      auto;
  }
  &.rightttt {
    cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAG7SURBVHhe7d2xTcRQFETRjQmARuiIIuiLLggIKIUi7H0IEyBtwq6PLA1zJMuyJU9wC/g+VVVVVVVVVVVVVdWe1nV9XJbleXvchdiMNKEeJtTH3Ne5v2yvbyI2I02c+7nev0L9uDWY2Iw0Xe4mzNt3ot+uDTaf7r4Za4K8bm0uuiaY2Iw1MZ7m+tzaXPTXYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzloglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNmNNiB5dfKTp0cO7jzZRenz90aZPf+BwtOnUX5hUVVVVVVVVVVVV/VOn0xkp1RCeWq6/XAAAAABJRU5ErkJggg==)
        48 48,
      auto;
  }

  .modal-video-movie-wrap {
    margin: 45px;
    width: calc(100% - 90px);
    height: calc(100% - 90px);
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
const TextContent = styled.div`
  background: ${props => props.bgColor || 'black'};
  color: ${props => props.textColor || 'white'};
  min-width: 240px;
  max-width: calc(100% - 100px);
  padding: 6px 5px;
  text-align: left;
  font-size: 18px;
  user-select: none;

  p:first-child {
    margin-top: 0;
  }
  p:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 420px) {
    font-size: 24px;
  }
  @media (min-width: 960px) {
    max-width: 720px;
    font-size: 40px;
    padding: 6px 10px;
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

export default class SingleWork extends React.Component {
  state = {
    current: 0,
    cursor: 'default',
    showVideo: false,
    videoId: null,
    lastPos: '#0',
  }

  componentDidMount() {
    if (window && window.location.hash) {
      this.setState({ lastPos: window.location.hash })
    }
  }

  onMouseMove = e => {
    const w = document.documentElement.clientWidth
    const mx = e.clientX

    const dir = mx > w / 2 ? 'right' : 'left'

    this.setState({ cursor: dir })
  }

  scroll = to => {
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

  startVideo = (url, e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ videoId: url, showVideo: true })
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
    const pics = this.props.data[type].pictures
    //const desc = this.props.data[type].descriptionNode.childMarkdownRemark.html

    //if (desc !== '') {
    //  const d = { type: 'text', content: desc }
    //  if (pics.length === 1 || !pics[1].type) pics.splice(1, 0, d)
    //}

    const lp = this.state.lastPos

    const subs = this.props.data[type].subPages
    console.log('work', work)

    return (
      <Wrapper bg={bg} className={this.state.cursor}>
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

        <StyledSwipeable
          onSwipedLeft={e => this.handleSwipeLeft(pics, e)}
          onSwipedRight={e => this.handleSwipeRight(pics, e)}
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
                onClick={e => this.handleClick(subs, i, e)}
              >
                {e.mediaType && e.mediaType === 'text' ? (
                  <TextContent
                    bgColor={
                      e.themeColor ? e.themeColor.hex : work.themeColor.hex
                    }
                    textColor={
                      e.textColor ? e.textColor.hex : work.textColor.hex
                    }
                    dangerouslySetInnerHTML={{ __html: e.text }}
                  />
                ) : (
                  <div>
                    <Image src={e.image.url} />
                    {e.mediaType &&
                      e.mediaType === 'video' && (
                        <StartVideoButton
                          onClick={evt => this.startVideo(e.video.url, evt)}
                        />
                      )}
                  </div>
                )}
              </ParallaxLayer>
            ))}
          </Parallax>
        </StyledSwipeable>
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
        mediaType
        text
        externalLink
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
      pictures {
        url
        alt
        title
        resolutions {
          aspectRatio
        }
      }
      subPages {
        mediaType
        text
        externalLink
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

import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import smoothscroll from 'smoothscroll-polyfill'
import MediaQuery from 'react-responsive'
import Link from 'gatsby-link'
import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons'
import Header from './../components/Header'
import PortfolioItem from './../components/PortfolioItem'
import bg from './../layouts/bg-home.jpg'
import archiveButton from './../components/archive_white.svg'

const PageWrapper = styled.div`
	background: black url('${props => props.bg || bg}');
	background-size: cover;
	background-attachment: fixed;
	background-repeat: no-repeat;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;

  @media (min-width: 720px) {
	}
`
const ListWrapper = styled.div`
  padding-top: 100px;
  @media (min-width: 480px) {
    padding-top: 140px;
  }
  @media (min-width: 720px) {
    padding-top: 0;
  }
`
const ToArchive = styled.div`
  position: absolute;
  bottom: 150px;
  left: 50%;
  transform: translateX(-50%);
  img {
    width: 650px;
  }
`

const ToArchiveMobile = styled.div`
  margin-top: 100px;
  padding-bottom: 200px;
  img {
    width: 80%;
  }
`

//const getRandomInt = (min, max) =>
//  Math.floor(Math.random() * (max - min + 1)) + min

export default class Oeuvre extends React.Component {
  constructor(props) {
    super(props)
    this.pwRef = React.createRef()
  }
  state = { logoFlip: false, active: false, height: null, lastPos: 0 }

  getRef = node => {
    console.log('getref', node)
    this.parallaxRef = node
  }

  componentDidMount() {
    setTimeout(
      function() {
        this.setState({ active: true })
      }.bind(this),
      3000
    )

    console.log('refs', this.parallaxRef, this.pwRef)

    if (this.parallaxRef && window) {
      this.parallaxRef.container.onscroll = this.handleScroll
    } else {
      this.pwRef.current.addEventListener('scroll', this.handleScroll)
    }
    if (window && window.location.hash) {
      const toScroll = parseInt(window.location.hash.replace('#', ''))
      smoothscroll.polyfill()
      if (this.parallax) {
        setTimeout(
          function() {
            this.parallax.container.scroll({
              top: toScroll,
              behavior: 'smooth',
            })
          }.bind(this),
          500
        )
      } else {
        setTimeout(
          function() {
            this.pwRef.current.scroll({
              top: toScroll,
              behavior: 'smooth',
            })
          }.bind(this),
          500
        )
      }
    }
  }

  componentDidUpdate() {
    if (this.props.data && !this.state.height && this.parallaxRef) {
      const wrapper = this.parallaxRef.container.childNodes[0]
      //const wrapperHeight = wrapper.clientHeight
      const winHeight = window.innerHeight
      const items = this.props.data.allDatoCmsPagePortfolio.edges
      var offset = 0
      offset = items.reduce((current, e) => {
        return current + e.node.yOffset / 100
      }, 0)
      const maxHeight = offset * winHeight + winHeight / 1.2
      //const maxHeight = winHeight + wrapperHeight - offset * winHeight / 100
      this.setState({ height: maxHeight })
      wrapper.style.maxHeight = `${maxHeight + winHeight / 2}px`
    }
  }

  componentWillUnmount() {
    if (this.parallaxRef) {
      this.parallaxRef.container.onscroll = null
    } else {
      this.pwRef.current.removeEventListener('scroll', this.handleScroll)
    }
  }

  handleScroll = e => {
    if ((e.target.scrollTop || window.scrollY) > 300) {
      this.setState({
        logoFlip: true,
        lastPos: e.target.scrollTop || e.target.scrollingElement.scrollTop,
      })
    } else {
      this.setState({ logoFlip: false })
    }
  }

  render() {
    //console.log('props', this.props)
    if (!this.props.data) return <div>Loading...</div>

    const { data, color, bg } = this.props
    const items = data.allDatoCmsPagePortfolio.edges
    let offset = 0

    //console.log(this.props)

    // e.node.pictures[0].resolutions.aspectRatio > 1 ? i * 0.6 : i * 1

    return (
      <PageWrapper bg={bg.oeuvre.url} ref={this.pwRef}>
        <Header
          backto="/about"
          action="toabout"
          siteTitle="THE FEELING"
          mini={true}
          flipped={this.state.logoFlip}
          position="fixed"
          color={color}
          size="small"
          active={this.state.active}
        />

        <MediaQuery minWidth={720}>
          <Parallax
            className="parallaxer"
            ref={this.getRef}
            pages={items.length}
          >
            {items &&
              items.map((e, i) => {
                //const speed = e.node.speed / 30 || 0
                const speed = e.node.speed / 100 || 0
                //const fact = e.node.scrollPageHeight / 100 || 0.7
                //const fact = 1
                //const off = 0 + i * 0.5 - speed / 20 - e.node.yOffset
                offset -= e.node.yOffset
                const off = i === 0 ? 0 : 0 - offset / 100

                //console.log(
                //  i,
                //  e.node.title,
                //  `speed: ${speed}`,
                //  `orig yOffset: ${e.node.yOffset}`,
                //  `acc offset: ${off}`,
                //  `width: ${e.node.width}`
                //)
                var border = 'none'
                switch (i) {
                  case 0:
                    border = '3px solid red'
                    break
                  case 1:
                    border = '3px solid purple'
                    break
                  case 2:
                    border = '3px solid yellow'
                    break
                  case 3:
                    border = '3px solid black'
                    break
                  default:
                    border = 'none'
                    break
                }

                return (
                  <ParallaxLayer
                    key={i}
                    offset={off}
                    speed={speed}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      pointerEvents: 'none',
                      border: 'none',
                      //border: border,
                      //borderTop: '3px solid blue',
                    }}
                  >
                    <PortfolioItem lastPos={this.state.lastPos} data={e.node} />
                  </ParallaxLayer>
                )
              })}

            <ToArchive>
              <Link to="/ye-olden-stuffe">
                <img alt="Ye olden stuffe" src={archiveButton} />
              </Link>
            </ToArchive>
          </Parallax>
        </MediaQuery>
        <MediaQuery maxWidth={719}>
          <ListWrapper>
            {items &&
              items.map((e, i) => (
                <PortfolioItem
                  lastPos={this.state.lastPos}
                  key={`e${i}`}
                  data={e.node}
                />
              ))}
          </ListWrapper>
          <ToArchiveMobile>
            <Link to="/ye-olden-stuffe">
              <img alt="Ye olden stuffe" src={archiveButton} />
            </Link>
          </ToArchiveMobile>
        </MediaQuery>
      </PageWrapper>
    )
  }
}

export const query = graphql`
  query PortfolioQuery {
    allDatoCmsPagePortfolio(sort: { fields: [position] }) {
      edges {
        node {
          title
          width
          xPosition
          speed
          slug
          yOffset
          previewImage {
            url
          }
          previewText
          previewTextNode {
            childMarkdownRemark {
              html
            }
          }
          themeColor {
            hex
            rgb
          }
          textColor {
            hex
            rgb
          }

          subPages {
            mediaType
            text
            externalLink
            image {
              url
              resolutions {
                aspectRatio
              }
            }
          }
        }
      }
    }
  }
`

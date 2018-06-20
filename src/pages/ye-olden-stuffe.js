import React from 'react'
import styled from 'styled-components'
import smoothscroll from 'smoothscroll-polyfill'
import MediaQuery from 'react-responsive'
import Link from 'gatsby-link'
import { Parallax } from 'react-spring'
import Header from './../components/Header'
import PortfolioItem from './../components/PortfolioItem'
import bg from './../components/archiv_hintergrund4.jpg'

const PageWrapper = styled.div`
	background: black url('${props => props.bg || bg}') no-repeat;
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
		overflow-y: initial;
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

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export default class Archive extends React.Component {
  state = { logoFlip: false, active: false, height: null, lastPos: 0 }

  componentDidMount() {
    setTimeout(
      function() {
        this.setState({ active: true })
      }.bind(this),
      3000
    )

    if (this.parallax) {
      this.parallax.container.onscroll = this.handleScroll
    } else {
      this.pw.addEventListener('scroll', this.handleScroll)
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
            this.pw.scroll({
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
    if (this.props.data && !this.state.height && this.parallax) {
      const wrapper = this.parallax.container.childNodes[0]
      const wrapperHeight = wrapper.clientHeight
      const winHeight = window.innerHeight
      const items = this.props.data.allDatoCmsPageArchive.edges
      var offset = 0
      offset = items.reduce((current, e) => {
        return current + e.node.yOffset
      }, 0)
      const maxHeight = winHeight + wrapperHeight - offset * winHeight / 100
      this.setState({ height: maxHeight })
      wrapper.style.maxHeight = `${maxHeight + winHeight}px`
    }
  }

  componentWillUnmount() {
    if (this.parallax) {
      this.parallax.container.onscroll = null
    } else {
      this.pw.removeEventListener('scroll', this.handleScroll)
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
    if (!this.props.data) return <div>Loading...</div>

    const { data, color, bg } = this.props
    const items = data.allDatoCmsPageArchive.edges
    let offset = 0

    // e.node.pictures[0].resolutions.aspectRatio > 1 ? i * 0.6 : i * 1

    return (
      <PageWrapper bg={bg.archive.url} innerRef={ref => (this.pw = ref)}>
        <Header
          backto="/oeuvre"
          action="backhome"
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
            ref={ref => (this.parallax = ref)}
            pages={items.length}
          >
            {items &&
              items.map((e, i) => {
                const speed = e.node.speed / 30 || 0
                //const fact = e.node.scrollPageHeight / 100 || 0.7
                const fact = 1
                //const off = 0 + i * 0.5 - speed / 20 - e.node.yOffset
                offset -= e.node.yOffset
                const off = i == 0 ? 0 : 0 - offset / 100

                return (
                  <Parallax.Layer
                    key={i}
                    offset={off}
                    speed={speed}
                    factor={fact}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      pointerEvents: 'none',
                    }}
                  >
                    <PortfolioItem
                      lastPos={this.state.lastPos}
                      path="ye-olden-stuffe"
                      data={e.node}
                    />
                  </Parallax.Layer>
                )
              })}
          </Parallax>
        </MediaQuery>
        <MediaQuery maxWidth={719}>
          <ListWrapper>
            {items &&
              items.map((e, i) => (
                <PortfolioItem
                  lastPos={this.state.lastPos}
                  path="ye-olden-stuffe"
                  key={`e${i}`}
                  data={e.node}
                />
              ))}
          </ListWrapper>
        </MediaQuery>
      </PageWrapper>
    )
  }
}

export const query = graphql`
  query ArchiveQuery {
    allDatoCmsPageArchive(sort: { fields: [position] }) {
      edges {
        node {
          title
          info
          width
          xPosition
          speed
          slug
          yOffset
          themeColor {
            hex
          }
          textColor {
            hex
          }
          pictures {
            url
            resolutions {
              aspectRatio
            }
          }
        }
      }
    }
  }
`

import React from 'react'
import styled from 'styled-components'
import MediaQuery from 'react-responsive'
import Link from 'gatsby-link'
import { Parallax } from 'react-spring'
import Header from './../components/Header'
import PortfolioItem from './../components/PortfolioItem'
import bg from './../layouts/bg-home.jpg'
import archiveButton from './../components/archive_white.svg'

const PageWrapper = styled.div`
	background: black url('${bg}') no-repeat;
	background-attachment: fixed;
	background-size: cover;
	height: 100vh;
	overflow-y: scroll;

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
const ToArchive = styled.div`
  position: absolute;
  bottom: 150px;
  left: 50%;
  transform: translateX(-50%);
  img {
    width: 450px;
  }
`

const ToArchiveMobile = styled.div`
  margin-top: 100px;
  margin-bottom: 200px;
  img {
    width: 50%;
  }
`

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export default class Oeuvre extends React.Component {
  state = { logoFlip: false, active: false, height: null }

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
      if (window && document) {
        document.addEventListener('scroll', this.handleScroll)
      }
    }
  }

  componentDidUpdate() {
    if (this.props.data && !this.state.height && this.parallax) {
      console.log('update', this.state.height, this.parallax)
      const wrapper = this.parallax.container.childNodes[0]
      const wrapperHeight = wrapper.clientHeight
      const winHeight = window.innerHeight
      console.log('wrapper', wrapper.style.height, winHeight)
      const items = this.props.data.allDatoCmsPagePortfolio.edges
      var offset = 0
      offset = items.reduce((current, e) => {
        return current + e.node.yOffset
      }, 0)
      const maxHeight = winHeight + wrapperHeight - offset * winHeight / 100
      this.setState({ height: maxHeight })
      wrapper.style.maxHeight = `${maxHeight}px`
    }
  }

  handleScroll = e => {
    if ((e.target.scrollTop || window.scrollY) > 300) {
      this.setState({ logoFlip: true })
    } else {
      this.setState({ logoFlip: false })
    }
  }

  render() {
    if (!this.props.data) return <div>Loading...</div>

    const { data, color } = this.props
    const items = data.allDatoCmsPagePortfolio.edges
    let offset = 0

    // e.node.pictures[0].resolutions.aspectRatio > 1 ? i * 0.6 : i * 1

    return (
      <PageWrapper ref={ref => (this.pw = ref)}>
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
            ref={ref => (this.parallax = ref)}
            pages={items.length}
          >
            {items &&
              items.map((e, i) => {
                const speed = e.node.speed / 30 || 0
                //const fact = e.node.scrollPageHeight / 100 || 0.7
                const fact = 1
                //const off = 0 + i * 0.5 - speed / 20 - e.node.yOffset
                //console.log('node', e.node.yOffset)
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
                      //borderBottom: '1px solid red',
                      //borderTop: '1px solid blue',
                    }}
                  >
                    <PortfolioItem data={e.node} />
                  </Parallax.Layer>
                )
              })}

            <ToArchive>
              <Link to="/ye-olden-stuffe">
                <img src={archiveButton} />
              </Link>
            </ToArchive>
          </Parallax>
        </MediaQuery>
        <MediaQuery maxWidth={719}>
          <ListWrapper>
            {items &&
              items.map((e, i) => (
                <PortfolioItem key={`e${i}`} data={e.node} />
              ))}
          </ListWrapper>
          <ToArchiveMobile>
            <Link to="/ye-olden-stuffe">
              <img src={archiveButton} />
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
          info
          width
          xPosition
          speed
          slug
          yOffset
          scrollPageHeight
          previewImage {
            url
          }
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

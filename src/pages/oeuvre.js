import React from 'react'
import styled from 'styled-components'
import MediaQuery from 'react-responsive'
import Link from 'gatsby-link'
import { Parallax } from 'react-spring'
import Header from './../components/Header'
import PortfolioItem from './../components/PortfolioItem'

const PageWrapper = styled.div``
const ListWrapper = styled.div`
  padding-top: 160px;
  @media (min-width: 720px) {
    padding-top: 0;
  }
`

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export default class Oeuvre extends React.Component {
  state = { logoFlip: false }

  componentDidMount() {
    if (this.parallax) {
      this.parallax.container.onscroll = this.handleScroll
    } else {
      if (window && document) {
        document.addEventListener('scroll', this.handleScroll)
      }
    }
  }

  handleScroll = e => {
    ;(e.target.scrollTop || window.scrollY) > 300
      ? this.setState({ logoFlip: true })
      : this.setState({ logoFlip: false })
  }

  render() {
    const { data } = this.props
    const items = data.allDatoCmsPagePortfolio.edges
    let offset = 0

    // e.node.pictures[0].resolutions.aspectRatio > 1 ? i * 0.6 : i * 1

    return (
      <PageWrapper ref={ref => (this.pw = ref)}>
        <Header
          backto="/about"
          action="toabout"
          size="small"
          siteTitle="THE FEELING"
          flipped={this.state.logoFlip}
          position="fixed"
        />

        <MediaQuery minWidth={720}>
          <Parallax ref={ref => (this.parallax = ref)} pages={items.length}>
            {items &&
              items.map((e, i) => {
                const speed = e.node.speed / 30 || 0
                //const fact = e.node.scrollPageHeight / 100 || 0.7
                const fact = 1
                //const off = 0 + i * 0.5 - speed / 20 - e.node.yOffset
                offset -= e.node.yOffset
                const off = i == 0 ? 0 : 0 - offset / 100
                /*
              console.log(
                'i: ',
                i,
                'offset: ',
                off,
                'factor: ',
                fact,
                'speed: ',
                speed
							)
							*/
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
          </Parallax>
        </MediaQuery>
        <MediaQuery maxWidth={719}>
          <ListWrapper>
            {items &&
              items.map((e, i) => (
                <PortfolioItem key={`e${i}`} data={e.node} />
              ))}
          </ListWrapper>
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

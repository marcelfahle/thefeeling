import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import { Parallax } from 'react-spring'
import Header from './../components/Header'
import PortfolioItem from './../components/PortfolioItem'

const PageWrapper = styled.div``
const Items = styled.div`
  overflow-x: hidden;
  width: 100%;

  .parallaxr {
    margin: 0;
  }
`

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export default class Oeuvre extends React.Component {
  render() {
    const { data } = this.props
    const items = data.allDatoCmsPagePortfolio.edges
    let offset = 0
    const isSlower = getRandomInt(0, 1) ? true : false

    // e.node.pictures[0].resolutions.aspectRatio > 1 ? i * 0.6 : i * 1

    return (
      <PageWrapper>
        <Header size="small" siteTitle="THE FEELING" />
        <Parallax
          ref={ref => (this.parallax = ref)}
          pages={items.length * 0.65}
        >
          {items.map((e, i) => {
            return (
              <Parallax.Layer
                key={i}
                offset={i * 0.6}
                speed={e.node.speed / 30}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <PortfolioItem data={e.node} />
              </Parallax.Layer>
            )
          })}
        </Parallax>
      </PageWrapper>
    )
  }
}

export const query = graphql`
  query PortfolioQuery {
    allDatoCmsPagePortfolio {
      edges {
        node {
          title
          info
          width
          pos
          speed
          slug
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

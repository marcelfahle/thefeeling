import React from 'react'
import styled from 'styled-components'
import { Parallax } from 'react-scroll-parallax'
import Header from './../components/Header'
import PortfolioItem from './../components/PortfolioItem'

const PageWrapper = styled.div``
const Items = styled.div`
  padding-top: 80px;
  overflow-x: hidden;
  width: 100%;

  .parallaxr {
    margin: 0;
  }
`

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export default ({ data }) => {
  const items = data.allDatoCmsPagePortfolio.edges
  const offset = getRandomInt(50, 140)
  const isSlower = getRandomInt(0, 1) ? true : false

  return (
    <PageWrapper>
      <Header size="small" siteTitle="THE FEELING" />
      <Items>
        {items.map((e, i) => (
          <Parallax
            className="parallaxr"
            offsetYMin={-offset * (i + 1) + 'px'}
            offsetYMax={offset * (i + 1) + 'px'}
            slowerScrollRate={isSlower}
            slowerScrollRate
            tag="figure"
            key={e.title}
          >
            <PortfolioItem data={e.node} />
          </Parallax>
        ))}
      </Items>
    </PageWrapper>
  )
}

export const query = graphql`
  query PortfolioQuery {
    allDatoCmsPagePortfolio {
      edges {
        node {
          title
          info
          pictures {
            url
          }
        }
      }
    }
  }
`

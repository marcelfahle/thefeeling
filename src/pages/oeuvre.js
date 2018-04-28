import React from 'react'
import styled from 'styled-components'
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

const InfoBox = styled.div`
  background: ${props => props.bgColor || 'black'};
  color: ${props => props.textColor || 'white'};
  width: 250px;
  height: 100px;
  margin-left: 2%;
  text-align: left;
  padding: 6px 10px;
  font-size: 28px;
  line-height: 1.1;
  p {
    margin: 0;
    padding: 0;
  }
`
const CounterBox = styled.div`
  background: ${props => props.bgColor || 'black'};
  color: ${props => props.textColor || 'white'};
  width: 100px;
  height: 100px;
  margin-left: auto;
  margin-right: 2%;
  text-align: center;
  padding: 6px 10px;
  font-size: 40px;
  line-height: 1.1;
  p {
    margin: 0;
    padding: 0;
  }
`

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export default class Oeuvre extends React.Component {
  render() {
    const { data } = this.props
    const items = data.allDatoCmsPagePortfolio.edges
    const offset = getRandomInt(50, 140)
    const isSlower = getRandomInt(0, 1) ? true : false

    // e.node.pictures[0].resolutions.aspectRatio > 1 ? i * 0.6 : i * 1

    return (
      <PageWrapper>
        <Header size="small" siteTitle="THE FEELING" />
        <Items>
          <Parallax ref={ref => (this.parallax = ref)} pages={items.length}>
            {items.map((e, i) => (
              <div key={e.title}>
                <Parallax.Layer
                  offset={i * (e.node.width / 100)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxWidth: '100%',
                    maxHeight: '100vh',
                  }}
                  speed={e.node.speed}
                  onClick={() => this.parallax.scrollTo(i)}
                >
                  <PortfolioItem data={e.node} />
                </Parallax.Layer>
              </div>
            ))}
          </Parallax>
        </Items>
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

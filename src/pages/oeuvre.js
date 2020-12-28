import React from 'react'
import { graphql } from 'gatsby'
import PortfolioScroller from './../components/PortfolioScroller'

export default function Oeuvre({ data, color, bg }) {
  if (!data || !data.allDatoCmsPagePortfolio) {
    console.log('loading... ', data)
    return <div>Loading...</div>
  }
  return (
    <PortfolioScroller
      data={data}
      items={data.allDatoCmsPagePortfolio.edges}
      color={color}
      bg={bg.oeuvre.url}
      toArchiveLink={true}
      backTo="/about"
      headerAction="toabout"
      path="oeuvre"
    />
  )
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
          baseFontSize
          baseFontSizeMobile
          imageOpacity
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

import React from 'react'
import { graphql } from 'gatsby'
import PortfolioScroller from './../components/PortfolioScroller2'

export default function Oeuvre({ data, color, bg }) {
  if (!data || !data.allDatoCmsPagePortfolio) {
    console.log('loading... ', data)
    return <div>Loading...</div>
  }
  return (
    <div>
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
    </div>
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
            format
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

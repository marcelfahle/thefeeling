import React from 'react'
import {graphql} from 'gatsby'

import PortfolioScroller from './../components/PortfolioScroller'

export default function Archive({data, color, bg}) {
	if (!data || !data.allDatoCmsPageArchive) return <div>Loading...</div>
	return (
		<PortfolioScroller
			data={data}
			items={data.allDatoCmsPageArchive.edges}
			color={color}
			bg={bg.archive.url}
			toArchiveLink={false}
			backTo="/oeuvre"
			headerAction="backhome"
			path="ye-olden-stuffe"
		/>
	)
}

export const query = graphql`
  query ArchiveQuery {
    allDatoCmsPageArchive(sort: { fields: [position] }) {
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

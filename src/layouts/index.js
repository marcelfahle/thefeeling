import React from 'react'
import Helmet from 'react-helmet'
import styled, { createGlobalStyle } from 'styled-components'
import { graphql, StaticQuery } from 'gatsby'

//import 'react-modal-video/scss/modal-video.scss';

const GlobalStyle = createGlobalStyle`
	html, body { 
		height: -webkit-fill-available;
	}
	html {
	}
	body {
		margin: 0;
		> div {
		}
	}
`

const Wrapper = styled.div`
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  text-align: center;
`

const colors = [
  {
    leftBg: '#e53212',
    leftText: '#2b632d',
    rightBg: '#c78800',
    rightText: '#ffed00',
  },
  {
    leftBg: '#009ee3',
    leftText: '#273582',
    rightBg: '#e53212',
    rightText: '#c78800',
  },
  {
    leftBg: '#009ee3',
    leftText: '#ffffff',
    rightBg: '#2b632d',
    rightText: '#c78800',
  },
  {
    leftBg: '#b51614',
    leftText: '#009ee3',
    rightBg: '#273582',
    rightText: '#e30513',
  },
  {
    leftBg: '#ffed00',
    leftText: '#273582',
    rightBg: '#e30513',
    rightText: '#b51614',
  },
]
const color = colors[Math.floor(Math.random() * colors.length)]

export default ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
        bg: datoCmsBackground {
          oeuvre {
            url
          }
          oeuvreDetail {
            url
          }
          archive {
            url
          }
          archiveDetail {
            url
          }
          about {
            url
          }
        }
      }
    `}
    render={(data) => (
      <Wrapper>
        <GlobalStyle />
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: '' },
            { name: 'keywords', content: '' },
            { name: 'viewport', content: 'width=device-width, minimal-ui' },
          ]}
        />
        {/*children(Object.assign({}, { data }, { bg: data.bg, color: color }))*/}
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { bg: data.bg, color: color })
        )}
      </Wrapper>
    )}
  />
)

//Layout.propTypes = {
//  children: PropTypes.func,
//}

import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import styled, { injectGlobal } from 'styled-components'

injectGlobal`
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

const Layout = props => (
  <Wrapper>
    <Helmet
      title={props.data.site.siteMetadata.title}
      meta={[
        { name: 'description', content: '' },
        { name: 'keywords', content: '' },
      ]}
    />
    <div>
      {props.children(
        Object.assign({}, props, { bg: props.data.bg, color: color })
      )}
    </div>
  </Wrapper>
)

Layout.propTypes = {
  children: PropTypes.func,
}

export default Layout

export const query = graphql`
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
`

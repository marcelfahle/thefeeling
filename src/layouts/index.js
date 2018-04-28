import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import styled, { injectGlobal } from 'styled-components'
import bg from './bg-home.jpg'

injectGlobal`
	html {
		height: 100%;
	}
	body {
		margin: 0;
		background: white;
		height: 100%;
		background: url('${bg}') no-repeat;
		background-size: cover;
		> div {
			height: 100%;
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

const Layout = ({ children, data }) => (
  <Wrapper>
    <Helmet
      title={data.site.siteMetadata.title}
      meta={[
        { name: 'description', content: '' },
        { name: 'keywords', content: '' },
      ]}
    />
    <div>{children()}</div>
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
  }
`

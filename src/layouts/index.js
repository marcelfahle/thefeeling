import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import styled, { injectGlobal } from 'styled-components'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { reducer as jPlayers } from 'react-jplayer'
import { reducer as jPlaylists } from 'react-jplaylist'
import { ParallaxProvider } from 'react-scroll-parallax'

const store = createStore(
  combineReducers({ jPlayers, jPlaylists }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

injectGlobal`
	html {
		height: 100%;
	}
	body {
		margin: 0;
		background: black;
		height: 100%;
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
  background: black;
`

const Layout = ({ children, data }) => (
  <Provider store={store}>
    <ParallaxProvider>
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
    </ParallaxProvider>
  </Provider>
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

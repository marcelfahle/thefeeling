import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

import Logo from './Logo'
import Home from './Home'
import AboutButton from './AboutButton'

const StyledHeader = styled.div`
  position: absolute;
  left: ${props => (props.size == 'big' ? 50 : 4.5)}%;
  transform: ${props => (props.size == 'big' ? 'translateX(-50%)' : '0')};
  margin-top: 25px;
  max-width: 500px;
  width: ${props => (props.size == 'big' ? 'calc(100% - 50px)' : '350px')};
  transition: all 0.8 ease;
  z-index: 50;

  a {
    perspective: 600;
    position: relative;
  }
`

const Flipper = styled.div`
  position: absolute;
  transform-style: preserve-3d;
  transition: all 0.4s ease-in-out;
  width: ${props => (props.size == 'big' ? 'calc(100% - 50px)' : '350px')};
  height: 55px;

  &:hover {
    transform: rotateX(180deg);
  }

  svg {
    left: 0;
    backface-visibility: hidden;
    position: absolute;
  }
  svg.back {
    transform: rotateX(180deg);
  }
`

export default ({
  siteTitle,
  backto = '/',
  action = 'default',
  size = 'big',
}) => (
  <StyledHeader size={size}>
    <div>
      <Link to={backto}>
        {action === 'backhome' ? (
          <Flipper size={size}>
            <Logo siteTitle={siteTitle} />
            <Home className="back" siteTitle={siteTitle} />
          </Flipper>
        ) : action === 'toabout' ? (
          <Flipper size={size}>
            <Logo siteTitle={siteTitle} />
            <AboutButton className="back" siteTitle={siteTitle} />
          </Flipper>
        ) : (
          <Logo siteTitle={siteTitle} />
        )}
      </Link>
    </div>
  </StyledHeader>
)

import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

import Logo from './Logo'
import Home from './Home'
import AboutButton from './AboutButton'

const StyledHeader = styled.div`
  position: absolute;
  width: 100%;
  max-width: ${props => (props.size == 'big' ? '500px' : 'none')};
  height: 55px;

  margin-top: 25px;
  transition: all 0.8 ease;
  z-index: 50;

  @media (min-width: 720px) {
    left: ${props => (props.size == 'big' ? '50%' : 'auto')};
    transform: ${props => (props.size == 'big' ? 'translateX(-50%)' : '0')};
  }

  a {
    perspective: 600;
    display: block;
    position: relative;
  }
`

const Flipper = styled.div`
  position: absolute;
  transform-style: preserve-3d;
  transition: all 0.4s ease-in-out;
  width: calc(100% - 50px);
  max-width: 500px;
  left: 50%;
  transform: translateX(-50%);
  height: 55px;

  &:hover {
    transform: translateX(-50%) rotateX(180deg);
    @media (min-width: 720px) {
      transform: rotateX(180deg);
    }
  }

  @media (min-width: 720px) {
    left: 100px;
    transform: none;
    width: ${props => (props.size == 'big' ? 'calc(100% - 50px)' : '350px')};
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

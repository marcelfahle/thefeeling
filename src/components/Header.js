import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

import Logo from './Logo'
import Home from './Home'
import AboutButton from './AboutButton'

const StyledHeader = styled.div`
  position: ${props => props.pos};
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
  width: ${props => (props.mini ? 'calc(65% - 50px)' : 'calc(100% - 50px)')};
  max-width: 500px;
  left: 50%;
  transform: translateX(-50%);
  height: 55px;

  &:hover,
  &.flipped {
    transform: translateX(-50%) rotateX(180deg);
    @media (min-width: 720px) {
      transform: rotateX(180deg);
    }
  }

  @media (min-width: 720px) {
    left: 4.5%;
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

const Wrapper = styled.div`
  position: absolute;
  max-width: 350px;
  width: ${props => (props.mini ? 'calc(75% - 50px)' : 'calc(100% - 50px)')};
  left: ${props => (props.mini ? '25px' : '50%')};
  transform: ${props => (props.mini ? 'none' : 'translateX(-50%)')};
  height: 55px;
  pointer-events: none;

  @media (min-width: 720px) {
    left: 4.5%;
    transform: none;
    width: ${props => (props.size == 'big' ? 'calc(100% - 50px)' : '350px')};
  }
`

export default ({
  siteTitle,
  backto = '/',
  action = 'default',
  size = 'big',
  flipped = false,
  position = 'absolute',
  mini = false,
}) => (
  <StyledHeader pos={position} size={size}>
    <div>
      <Link to={backto}>
        {action === 'backhome' ? (
          <Flipper size={size} className={flipped ? 'flipped' : ''}>
            <Logo siteTitle={siteTitle} />
            <Home className="back" siteTitle={siteTitle} />
          </Flipper>
        ) : action === 'toabout' ? (
          <Flipper size={size} className={flipped ? 'flipped' : ''}>
            <Logo siteTitle={siteTitle} />
            <AboutButton className="back" siteTitle={siteTitle} />
          </Flipper>
        ) : action === 'static' ? (
          <Wrapper mini={mini} size={size}>
            <Logo siteTitle={siteTitle} />
          </Wrapper>
        ) : (
          <Logo siteTitle={siteTitle} />
        )}
      </Link>
    </div>
  </StyledHeader>
)

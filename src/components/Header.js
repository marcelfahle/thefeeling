import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import classNames from 'classnames'

import Logo from './Logo'
import Home from './Home'
import AboutButton from './AboutButton'

const StyledHeader = styled.div`
  position: ${props => props.pos};
  width: 100%;
  display: block;
	width: calc(100vw - 50px);
	padding-top: 12.6%;
	max-width: 500px;
	top: 25px;
	left 50%;
  transform: translateX(-50%);

  transition: all 0.8 ease;
  z-index: 50;

  > div {
	position: absolute;
	top: 0;
	bottom: 0;
	width: 100%;
  }
  a {
    perspective: 600;
    display: block;
    position: relative;
    width: 100%;
		height: 100%;
  }


  @media (orientation: landscape) and (max-height: 480px) {
    top: -180px;
		height: 0.1px;
	}
  @media (min-width: 720px) {
		left: ${props => (props.size == 'big' ? '50%' : '25px')};
		transform: ${props => (props.size == 'big' ? 'translateX(-50%)' : 'none')};
    width: ${props => (props.size == 'big' ? '500px' : '350px')};
		padding-top: 0;
    height: 55px;
  }
`

const Flipper = styled.div`
	position:absolute;
  transform-style: preserve-3d;
  transition: all 0.4s ease-in-out;
	width: 100%;
	height: 100%;
	top: 0;

	/*left: ${props => (props.mini ? '25px' : '50%')}; */
  transform: ${props => (props.mini ? 'none' : 'translateX(-50%)')};

  &.flipped {
    transform: ${props =>
      props.mini ? 'rotateX(180deg)' : 'translateX(-50%) rotateX(180deg)'};
		/*left: ${props => (props.mini ? '25px' : '50%')};*/
    @media (min-width: 720px) {
      transform: rotateX(180deg);
      left: 4.5%;
    }
  }


  svg {
		top: 0;
    left: 0;
    backface-visibility: hidden;
    position: absolute;
  }
  svg.back {
    transform: rotateX(180deg);
  }


  @media (min-width: 720px) {
    left: 4.5%;
    transform: none;
		/*width: ${props => (props.size == 'big' ? 'calc(100% - 50px)' : '350px')};*/
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
    max-width: 500px;
    width: ${props => (props.size == 'big' ? 'calc(100% - 50px)' : '350px')};
  }
  transition: top 0.8s ease;
  top: 0;
  @media (orientation: landscape) and (max-height: 480px) {
    top: -100px;
  }
`

export default ({
  siteTitle,
  color = {
    leftBg: '#e53212',
    leftText: '#2b632d',
    rightBg: '#c78800',
    rightText: '#ffed00',
  },
  backto = '/',
  action = 'default',
  size = 'big',
  flipped = false,
  position = 'relative',
  mini = false,
  active = true,
}) => {
  var cx = classNames({
    flipped,
    noFlip: !active,
  })
  return (
    <StyledHeader pos={position} size={size}>
      <div>
        <Link to={backto}>
          {action === 'backhome' ? (
            <Flipper mini={mini} size={size} className={cx}>
              <Logo color={color} siteTitle={siteTitle} />
              <Home color={color} className="back" siteTitle={siteTitle} />
            </Flipper>
          ) : action === 'toabout' ? (
            <Flipper mini={mini} size={size} className={cx}>
              <Logo color={color} siteTitle={siteTitle} />
              <AboutButton
                color={color}
                className="back"
                siteTitle={siteTitle}
              />
            </Flipper>
          ) : action === 'static' ? (
            <Wrapper mini={mini} size={size}>
              <Logo color={color} siteTitle={siteTitle} />
            </Wrapper>
          ) : (
            <Logo color={color} siteTitle={siteTitle} />
          )}
        </Link>
      </div>
    </StyledHeader>
  )
}

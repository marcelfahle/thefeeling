import React from 'react'
import { default as RouterLink } from 'gatsby-link'
import styled from 'styled-components'

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const Item = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 30px;
  @media (min-width: 720px) {
    text-align: left;
  }
`

const FirstImage = styled.img`
  width: calc(100vw - 50px);
  max-width: 500px;
  transition: all 0.8 ease;

  @media (min-width: 720px) {
    width: auto;
    max-width: ${props =>
      !props.width || props.width == 100
        ? '100%'
        : props.width + '%'};
  }
`

const Link = styled(RouterLink)`
  pointer-events: auto;
  transition: all 0.8 ease;

  @media (min-width: 720px) {
    margin-left: 25px;
    margin-left: ${props => props.pos || 0}%;
  }
`

export default ({ data, lastPos = 0, path = 'oeuvre' }) => (
  <Item>
    <Link pos={data.xPosition} to={`/${path}/${data.slug}#${lastPos}`}>
      <FirstImage
        width={data.width}
        src={
          (data.previewImage && data.previewImage.url) || data.pictures[0].url
        }
      />
    </Link>
  </Item>
)

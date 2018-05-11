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
        ? 'calc(100% - 100px)'
        : props.width + '%'};
    max-height: calc(100vh - 70px);
  }
`

const Link = styled(RouterLink)`
  pointer-events: auto;
  transition: all 0.8 ease;
  > img {
    border: 5px solid transparent;
  }
  &:hover > img {
    border: 5px solid ${props => props.themeColor || '#53212'};
  }
  @media (min-width: 720px) {
    margin-left: 25px;
    margin-left: ${props => props.pos || 0}%;
  }
`

export default ({ data }) => (
  <Item>
    <Link
      pos={data.xPosition}
      themeColor={data.themeColor.hex}
      to={`/oeuvre/${data.slug}`}
    >
      <FirstImage
        width={data.width}
        src={
          (data.previewImage && data.previewImage.url) || data.pictures[0].url
        }
      />
    </Link>
  </Item>
)

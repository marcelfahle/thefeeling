import React from 'react'
import { default as RouterLink } from 'gatsby-link'
import styled from 'styled-components'

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const Item = styled.div`
  width: 100%;
`

const FirstImage = styled.img`
  width: auto;
  max-width: ${props =>
    !props.width || props.width == 100
      ? 'calc(100% - 100px)'
      : props.width + '%'};
  max-height: calc(100vh - 70px);
`

const Link = styled(RouterLink)`
  margin-left: ${props => props.pos || 0}%;
  pointer-events: auto;
  &:hover > img {
    border: 5px solid ${props => props.themeColor || '#53212'};
  }
`

export default ({ data }) => (
  <Item>
    <Link
      pos={data.xPosition}
      themeColor={data.themeColor.hex}
      to={`/oeuvre/${data.slug}`}
    >
      <FirstImage width={data.width} src={data.pictures[0].url} />
    </Link>
  </Item>
)

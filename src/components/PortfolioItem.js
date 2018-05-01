import React from 'react'
import Link from 'gatsby-link'
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
  margin-left: ${props => props.pos || 0}%;
`

export default ({ data }) => (
  <Item>
    <Link
      to={`/oeuvre/${data.slug}`}
      style={{ display: 'block', textAlign: 'left' }}
    >
      <FirstImage
        pos={data.xPosition}
        width={data.width}
        src={data.pictures[0].url}
      />
    </Link>
  </Item>
)

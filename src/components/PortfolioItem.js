import React from 'react'
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
  margin-left: ${props =>
    props.pos === 'left'
      ? getRandomInt(2, 8)
      : props.pos === 'right'
        ? getRandomInt(70, 80)
        : 50}%;
  transform: translateX(-50%);
`

export default ({ data }) => (
  <Item>
    <FirstImage pos={data.pos} width={data.width} src={data.pictures[0].url} />
  </Item>
)

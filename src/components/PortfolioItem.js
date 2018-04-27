import React from 'react'
import styled from 'styled-components'

const Item = styled.div`
  margin-bottom: 150px;
`

const FirstImage = styled.img`
  max-width: calc(100% - 100px);
  margin: 0 auto;
`

export default ({ data }) => (
  <Item>
    <FirstImage src={data.pictures[0].url} />
  </Item>
)

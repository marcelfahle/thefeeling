import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

import Logo from './Logo'

const StyledHeader = styled.div`
  position: absolute;
  left: ${props => (props.size == 'big' ? 50 : 2)}%;
  transform: ${props => (props.size == 'big' ? 'translateX(-50%)' : '0')};
  margin-top: 25px;
  max-width: 500px;
  width: ${props => (props.size == 'big' ? 'calc(100% - 50px)' : '350px')};
  transition: all 0.8 ease;
  z-index: 50;
`

export default ({ siteTitle, size = 'big' }) => (
  <StyledHeader size={size}>
    <div>
      <Link to="/">
        <Logo siteTitle={siteTitle} />
      </Link>
    </div>
  </StyledHeader>
)

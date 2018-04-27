import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

import Logo from './Logo'

const StyledHeader = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 25px;
  max-width: 500px;
  width: calc(100% - 50px);
  z-index: 50;
`

export default ({ siteTitle }) => (
  <StyledHeader>
    <div>
      <Link to="/">
        <Logo siteTitle={siteTitle} />
      </Link>
    </div>
  </StyledHeader>
)

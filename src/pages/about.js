import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import Header from './../components/Header'
import bg from './../components/quer_1.jpg'

const PageWrapper = styled.div`
		background: url('${bg}') no-repeat;
		background-size: cover;
  height: 100vh;
`

const Content = styled.div`
  position: absolute;
`

const About = () => (
  <PageWrapper>
    <Header
      backto="/oeuvre"
      action="backhome"
      size="small"
      siteTitle="THE FEELING"
    />
    <Content />
  </PageWrapper>
)

export default About

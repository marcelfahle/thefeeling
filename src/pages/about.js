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
  width: 50%;
  height: 100vh;
  left: 0;
  overflow-y: scroll;
`

const Block = styled.div`
  background: #ffed00;
  color: black;
  width: 100%;
  max-width: 640px;
  text-align: left;
  font-size: 24px;
  padding: 1px 24px;
  box-sizing: border-box;
  margin-right: 0;
  margin-left: auto;
  margin-top: 160px;
  &:last-child {
    margin-bottom: 100px;
  }
`

const About = ({ data }) => (
  <PageWrapper>
    <Header
      backto="/oeuvre"
      action="backhome"
      size="small"
      siteTitle="THE FEELING"
    />
    <Content>
      <Block
        dangerouslySetInnerHTML={{
          __html: data.datoCmsPageAbout.aboutNode.childMarkdownRemark.html,
        }}
      />
      <Block
        dangerouslySetInnerHTML={{
          __html: data.datoCmsPageAbout.contactNode.childMarkdownRemark.html,
        }}
      />
    </Content>
  </PageWrapper>
)

export default About

export const query = graphql`
  query AboutQuery {
    datoCmsPageAbout {
      aboutNode {
        childMarkdownRemark {
          html
        }
      }
      contactNode {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`

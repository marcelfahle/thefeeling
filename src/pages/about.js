import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import Header from './../components/Header'
import bg from './../components/quer_1.jpg'

const PageWrapper = styled.div`
  position: relative;
	background: url('${bg}') no-repeat;
	background-size: cover;
	background-attachment: fixed;
	background-repeat: no-repeat;
	transform: translateZ(0);
	will-change: transform;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  overflow: hidden;
`

const Content = styled.div`
  width: calc(100% - 50px);
  left: 0;
  margin-top: 130px;
  margin-left: 25px;
  margin-right: 25px;
  transition: all 0.8 ease;

  @media (min-width: 720px) {
    margin-left: 100px;
    max-width: calc(100% - 125px);
    > div {
      text-align: left;
    }
  }
  @media (min-width: 960px) {
    > div {
      > div {
        display: inline-block;
        flex-grow: 1;
        vertical-align: top;
      }
      > div:nth-child(odd) {
        width: 300px;
        margin-top: 24px;
      }
      > div:nth-child(even) {
        width: calc(100% - 320px);
      }
    }
  }
`

const Label = styled.div`
  background: #ffed00;
  color: black;
  display: inline-block;
  font-size: 24px;
  padding: 1px 24px;
  margin-bottom: 25px;
  margin-left: 0;
  transition: all 0.8 ease;
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
  transition: all 0.8 ease;

  margin-bottom: 50px;
  &:last-child {
    margin-bottom: 100px;
  }
`

const About = ({ data, color }) => (
  <PageWrapper>
    <Header
      backto="/oeuvre"
      action="backhome"
      size="small"
      siteTitle="THE FEELING"
      mini={true}
      color={color}
      position="fixed"
    />
    <Content>
      <div>
        <div>
          <Label>{data.datoCmsPageAbout.aboutLabel}</Label>
        </div>
        <div>
          <Block
            dangerouslySetInnerHTML={{
              __html: data.datoCmsPageAbout.aboutNode.childMarkdownRemark.html,
            }}
          />
        </div>
        <div>
          <Label>{data.datoCmsPageAbout.contactLabel}</Label>
        </div>
        <div>
          <Block
            dangerouslySetInnerHTML={{
              __html:
                data.datoCmsPageAbout.contactNode.childMarkdownRemark.html,
            }}
          />
        </div>
        <div>
          <Label>{data.datoCmsPageAbout.legalLabel}</Label>
        </div>
        <div>
          <Block
            dangerouslySetInnerHTML={{
              __html: data.datoCmsPageAbout.legalNode.childMarkdownRemark.html,
            }}
          />
        </div>
      </div>
    </Content>
  </PageWrapper>
)

export default About

export const query = graphql`
  query AboutQuery {
    datoCmsPageAbout {
      aboutLabel
      contactLabel
      legalLabel
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
      legalNode {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`

import React, { useState, useEffect, useRef } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import styled from 'styled-components'
import Header from './../components/Header'
import bg from './../components/quer_1.jpg'

const PageWrapper = styled.div`
  position: absolute;
  background: url('${(props) => props.bg || bg}') no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`

const Content = styled.div`
  width: calc(100% - 50px);
  left: 0;
  margin-top: 130px;
  margin-left: 25px;
  margin-right: 25px;
  transition: all 0.8 ease;
  overflow-x: hidden;

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
  a {
    color: black;
  }
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

const About = ({ bg, color }) => {
  const containerEl = useRef(null)
  const data = useStaticQuery(graphql`
    query AboutQuery {
      datoCmsPageAbout {
        content {
          label
          bodyNode {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    }
  `)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolling = containerEl.current.scrollTop > 300
      if (isScrolling !== hasScrolled) {
        setHasScrolled(!hasScrolled)
      }
    }
    containerEl.current.addEventListener('scroll', handleScroll, {
      passive: true,
    })
    return () => {
      containerEl.current.removeEventListener('scroll', handleScroll)
    }
  }, [hasScrolled])

  if (!data) return null
  return (
    <PageWrapper bg={bg.about.url} ref={containerEl}>
      <Header
        backto="/oeuvre"
        action="backhome"
        size="small"
        siteTitle="THE FEELING"
        mini={true}
        color={color}
        position="fixed"
        flipped={hasScrolled}
      />
      <Content>
        <div>
          {data.datoCmsPageAbout.content.map((c) => (
            <>
              <div>
                <Label>{c.label}</Label>
              </div>
              <div>
                <Block
                  dangerouslySetInnerHTML={{
                    __html: c.bodyNode.childMarkdownRemark.html,
                  }}
                />
              </div>
            </>
          ))}
        </div>
      </Content>
    </PageWrapper>
  )
}

export default About

//class About extends React.Component {
//  state = { logoFlip: false }
//
//  componentDidMount() {
//    this.page && this.page.addEventListener('scroll', this.handleScroll)
//  }
//
//  handleScroll = e => {
//    if (this.page.scrollTop > 300) {
//      this.setState({ logoFlip: true })
//    } else {
//      this.setState({ logoFlip: false })
//    }
//  }
//  render() {
//    const { data, color, bg } = this.props
//
//    return (
//    )
//  }
//}
//
//export default About
//
//export const query = graphql`
//`

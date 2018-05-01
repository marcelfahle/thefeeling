import React from 'react'
import styled from 'styled-components'
import Header from './../components/Header'
import { Parallax, Transition } from 'react-spring'

const Image = styled.img`
  height: auto;
  max-width: 80vw;
  max-height: 80vh;
`

const Wrapper = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;
  .container > div > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const InfoBox = styled.div`
  position: absolute;
  background: ${props => props.bgColor || 'black'};
  color: ${props => props.textColor || 'white'};
  width: 250px;
  height: 100px;
  margin-left: 4.5%;
  bottom: 35px;
  text-align: left;
  padding: 6px 10px;
  font-size: 28px;
  line-height: 1.1;
  p {
    margin: 0;
    padding: 0;
  }
`
const CounterBox = styled.div`
  position: absolute;
  background: ${props => props.bgColor || 'black'};
  color: ${props => props.textColor || 'white'};
  width: 100px;
  height: 100px;
  right: 4.5%;
  bottom: 35px;
  text-align: center;
  padding: 6px 10px;
  font-size: 40px;
  line-height: 1.1;
  p {
    margin: 0;
    padding: 0;
  }
`

export default class SingleWork extends React.Component {
  state = { current: 1 }
  scroll = to => {
    this.setState({ current: to + 1 })
    this.refs.parallax.scrollTo(to)
  }
  render() {
    const {
      data: { work },
      data: {
        work: { pictures: pics },
      },
    } = this.props
    return (
      <Wrapper>
        <Header size="small" siteTitle="THE FEELING" />
        <Parallax
          className="container"
          ref="parallax"
          pages={pics.length}
          horizontal
          scrolling={false}
        >
          {pics.map((e, i) => (
            <Parallax.Layer
              offset={i}
              speed={0}
              onClick={() => this.scroll(i + 1 >= pics.length ? 0 : i + 1)}
            >
              <Image src={e.url} />
            </Parallax.Layer>
          ))}
        </Parallax>
        <InfoBox bgColor={work.themeColor.hex} textColor={work.textColor.hex}>
          <p
            dangerouslySetInnerHTML={{
              __html: work.infoNode.childMarkdownRemark.html,
            }}
          />
        </InfoBox>
        <CounterBox
          bgColor={work.themeColor.hex}
          textColor={work.textColor.hex}
        >
          <p>{this.state.current}</p>
          <p>{pics.length}</p>
        </CounterBox>
      </Wrapper>
    )
  }
}

export const query = graphql`
  query WorkQuery($slug: String) {
    work: datoCmsPagePortfolio(slug: { eq: $slug }) {
      title
      infoNode {
        childMarkdownRemark {
          html
        }
      }
      width
      themeColor {
        hex
      }
      textColor {
        hex
      }
      pictures {
        url
        resolutions {
          aspectRatio
        }
      }
    }
  }
`

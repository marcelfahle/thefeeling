import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import Header from './../components/Header'
import CloseIcon from './../components/CloseIcon'
import Smile from './../components/icons8-happy-96.png'
import BackArrow from './../components/icons8-undo-96.png'
import { Parallax, Transition } from 'react-spring'

const Image = styled.img`
  height: auto;
  max-width: 80vw;
  max-height: calc(100vh - 200px);
`

const Wrapper = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;
  z-index: 49;
  .container > div > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &.default {
    cursor: url(${Smile}), auto;
  }
  &.left {
    cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHASURBVHhe7d27TcQAFETRjQmARuiIIuiLLggIKIUibF5gJyutZD5ngdEcybL80QS3APtUVVVVVVVVVVVVVX/dsiyP67reb5c/QmxGmlBPE2qd89uc7rbb3yI2I+2hdnP9Osft9vhLxGak81C7uf8yp5vttU8Rm5EuhdrN8+ft1cPEZqQDod7neNheP0RsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsRhKhxGYkEUpsxhKxxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGY0EUxsRhPBxGa0A8H66WLtUrC53493X8t5sLnu5+uvbQ825/7A4bdMqP7CpKqqqqqqqqqqquofOJ0+AGIJEJ5SYMMhAAAAAElFTkSuQmCC)
        48 48,
      auto;
  }
  &.right {
    cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAG7SURBVHhe7d2xTcRQFETRjQmARuiIIuiLLggIKIUi7H0IEyBtwq6PLA1zJMuyJU9wC/g+VVVVVVVVVVVVVdWe1nV9XJbleXvchdiMNKEeJtTH3Ne5v2yvbyI2I02c+7nev0L9uDWY2Iw0Xe4mzNt3ot+uDTaf7r4Za4K8bm0uuiaY2Iw1MZ7m+tzaXPTXYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzmggmNqOJYGIzloglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNiOJUGIzkgglNmNNiB5dfKTp0cO7jzZRenz90aZPf+BwtOnUX5hUVVVVVVVVVVVV/VOn0xkp1RCeWq6/XAAAAABJRU5ErkJggg==)
        48 48,
      auto;
  }
`

const InfoBox = styled.div`
  position: absolute;
  background: ${props => props.bgColor || 'black'};
  color: ${props => props.textColor || 'white'};
  margin-left: 4.5%;
  bottom: 35px;
  text-align: left;
  padding: 6px 10px;
  font-size: 20px;
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
  right: 4.5%;
  bottom: 35px;
  text-align: center;
  padding: 6px 10px;
  font-size: 20px;
  line-height: 1.1;
  p {
    margin: 0;
    padding: 0;
  }
`
const TextContent = styled.div`
  background: ${props => props.bgColor || 'black'};
  color: ${props => props.textColor || 'white'};
  min-width: 240px;
  max-width: 800px;
  padding: 6px 10px;
  text-align: left;
  font-size: 40px;
`

const CloseButton = styled(Link)`
  position: absolute;
  display: inline-block;
  right: 50px;
  top: 25px;
  width: 54px;
  height: 54px;
  cursor: url(${BackArrow}) 48 48, auto;
  z-index: 51;
`

export default class SingleWork extends React.Component {
  state = { current: 1, cursor: 'default' }

  componentDidMount() {
    if (window && document) {
      document.addEventListener('mousemove', this.onMouseMove)
      //document.addEventListener('touchmove', onTouchMove);
      //document.addEventListener('touchstart', onTouchMove);
    }
  }

  onMouseMove = e => {
    const w = document.documentElement.clientWidth
    const mx = e.clientX

    const dir = mx > w / 2 ? 'right' : 'left'

    this.setState({ cursor: dir })
  }

  scroll = to => {
    this.setState({ current: to + 1 })
    this.refs.parallax.scrollTo(to)
  }

  handleClick = (pics, i, e) => {
    const w = document.documentElement.clientWidth
    const mx = e.clientX

    const dir = mx > w / 2 ? 1 : -1

    this.scroll(i + 1 >= pics.length ? 0 : i + dir)
  }

  render() {
    const {
      data: { work },
      data: {
        work: {
          pictures: pics,
          descriptionNode: {
            childMarkdownRemark: { html: desc },
          },
        },
      },
    } = this.props

    if (desc != '') {
      const d = { type: 'text', content: desc }
      if (pics.length == 1 || !pics[1].type) pics.splice(1, 0, d)
    }

    return (
      <Wrapper className={this.state.cursor}>
        <Header
          backto="/oeuvre"
          action="static"
          size="small"
          siteTitle="THE FEELING"
        />

        <CloseButton to="/oeuvre">
          <CloseIcon />
        </CloseButton>

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
              key={i}
              speed={0}
              onClick={e => this.handleClick(pics, i, e)}
            >
              {e.type && e.type == 'text' ? (
                <TextContent
                  bgColor={work.themeColor.hex}
                  textColor={work.textColor.hex}
                  dangerouslySetInnerHTML={{ __html: e.content }}
                />
              ) : (
                <Image src={e.url} />
              )}
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
      descriptionNode {
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

import * as React from 'react'
import styled from 'styled-components'
import smoothscroll from 'smoothscroll-polyfill'
import { useMediaQuery } from 'react-responsive'
import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons'
import Header from './../components/Header'
import PortfolioItem from './../components/PortfolioItem'

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 })
  return isDesktop ? children : null
}
const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 991 })
  return isMobile ? children : null
}

const PageWrapper = styled.div`
  background: black url('${(props) => props.bg}');
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  padding-bottom: 44px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;

  @media (min-width: 720px) {
  }
`
const ListWrapper = styled.div`
  padding-top: 100px;
  @media (min-width: 480px) {
    padding-top: 140px;
  }
  @media (min-width: 720px) {
    padding-top: 0;
  }
`

export default class PortfolioScroller extends React.Component {
  constructor(props) {
    super(props)
    this.pwRef = React.createRef()
  }
  state = {
    logoFlip: false,
    active: true,
    height: null,
    lastPos: 0,
    totalHeight: 0,
  }

  componentDidMount() {
    //setTimeout(
    //  function () {
    //    this.setState({ active: true })
    //  }.bind(this),
    //  300
    //)

    //console.log('refs', this.parallaxRef, this.pwRef)

    console.log('SCROLL ATTACH', this.parallaxRef, window, this.pwRef)
    if (this.parallaxRef && window) {
      this.parallaxRef.container.onscroll = this.handleScroll
    } else {
      this.pwRef.current.addEventListener('scroll', this.handleScroll)
    }

    if (this.props.data && window && !this.state.height && this.parallaxRef) {
      this.calculateHeight()
    }

    if (window && window.location.hash) {
      const toScroll = parseInt(window.location.hash.replace('#', ''))
      smoothscroll.polyfill()
      if (this.parallaxRef) {
        setTimeout(
          function () {
            this.parallaxRef.container.scroll({
              top: toScroll,
              behavior: 'smooth',
            })
          }.bind(this),
          1000
        )
      } else {
        setTimeout(
          function () {
            this.pwRef.current.scroll({
              top: toScroll,
              behavior: 'smooth',
            })
          }.bind(this),
          700
        )
      }
    }
  }

  componentDidUpdate() {
    if (this.props.data && window && !this.state.height && this.parallaxRef) {
      this.calculateHeight()
    }
  }

  componentWillUnmount() {
    if (this.parallaxRef) {
      this.parallaxRef.container.onscroll = null
    } else {
      this.pwRef.current.removeEventListener('scroll', this.handleScroll)
    }
  }

  calculateHeight = () => {
    const winHeight = window.innerHeight
    const items = this.props.items
    var offset = 0
    offset = items.reduce((current, e) => {
      return current + e.node.yOffset / 100
    }, 0)
    const maxHeight = offset * winHeight + winHeight / 1.2
    this.setState({ height: maxHeight })
  }

  handleScroll = (e) => {
    console.log(e.target.scrollTop, window.scrollY)
    if ((e.target.scrollTop || window.scrollY) > 300) {
      this.setState({
        logoFlip: true,
        lastPos: e.target.scrollTop || e.target.scrollingElement.scrollTop,
      })
    } else {
      this.setState({ logoFlip: false })
    }
  }

  realPageNum = (items) => {
    if (typeof window !== 'undefined' && window.innerHeight) {
      return Math.ceil(this.state.height / window.innerHeight)
    } else {
      console.log('items', items.length)
      return items.length
    }
  }

  render() {
    if (!this.props.data) return <div>Loading...</div>

    const {
      data,
      color,
      bg,
      backTo = '/about',
      headerAction = 'toabout',
      items,
    } = this.props
    let offset = 0
    let off = 0

    return (
      <PageWrapper bg={bg} ref={this.pwRef}>
        <Header
          backto={backTo}
          action={headerAction}
          siteTitle="THE FEELING"
          mini={true}
          flipped={this.state.logoFlip}
          position="fixed"
          color={color}
          size="small"
          active={this.state.active}
        />

        <div id="thisblows">
          <Desktop>
            <Parallax
              className="parallaxer"
              ref={(ref) => (this.parallaxRef = ref)}
              pages={this.realPageNum(items)}
            >
              {items &&
                items.map((e, i) => {
                  const speed = e.node.speed / 100 || 0
                  offset -= e.node.yOffset
                  off = i === 0 ? 0 : 0 - offset / 100

                  return (
                    <ParallaxLayer
                      key={i}
                      offset={off}
                      speed={speed}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        pointerEvents: 'none',
                        border: 'none',
                      }}
                    >
                      <PortfolioItem
                        path={this.props.path}
                        lastPos={this.state.lastPos}
                        data={e.node}
                      />
                    </ParallaxLayer>
                  )
                })}
            </Parallax>
          </Desktop>
          <Mobile>
            <ListWrapper>
              {items &&
                items.map((e, i) => (
                  <PortfolioItem
                    path={this.props.path}
                    lastPos={this.state.lastPos}
                    key={`e${i}`}
                    data={e.node}
                  />
                ))}
            </ListWrapper>
          </Mobile>
        </div>
      </PageWrapper>
    )
  }
}

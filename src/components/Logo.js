import React from 'react'
import styled from 'styled-components'

const Logo = styled.svg`
  polygon,
  path {
    transition: fill 0.4s ease;
  }
`

class TheLogo extends React.Component {
  render() {
    const { siteTitle, className = 'front', color } = this.props
    return (
      <Logo
        viewBox="0 0 300 46"
        version="1.1"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        ariaLabelledby="title"
      >
        <g>
          <title>{siteTitle}</title>
          <defs />
          <g
            id="Page-1"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g id="Logo_THEFEELING">
              <rect
                id="ROT"
                fill={color.leftBg}
                x="0"
                y="0"
                width="150"
                height="46"
              />

              <path
                d="M123.4,32.6 C123.4,37.2 126,38.3 130.3,38.3 L136.1,38.3 C141.5,38.3 143.8,38.1 143.8,33.6 L143.8,29.2 L133,29.2 L133,32.4 L139,32.4 L139,32.9 C139,34.4 137.7,34.6 136.5,34.6 L131.4,34.6 C129,34.6 128.4,34 128.4,31.3 L128.4,29.4 C128.4,26.7 129,26.1 131.4,26.1 L136.6,26.1 C138.1,26.1 139,26.3 139,27.8 L143.7,27.8 L143.7,27.3 C143.7,24.3 142.9,22.3 137.5,22.3 L130.3,22.3 C126,22.3 123.4,23.4 123.4,28 L123.4,32.6 Z M98.2,38.1 L103,38.1 L103,26.7 L112,38.1 L119.4,38.1 L119.4,22.5 L114.6,22.5 L114.6,33.9 L105.6,22.5 L98.2,22.5 L98.2,38.1 Z M88.8,38.1 L93.6,38.1 L93.6,22.5 L88.8,22.5 L88.8,38.1 Z M69.9,38.1 L85.5,38.1 L85.5,34.1 L74.7,34.1 L74.7,22.5 L69.9,22.5 L69.9,38.1 Z M48.6,38.1 L66,38.1 L66,34.3 L53.4,34.3 L53.4,31.8 L65,31.8 L65,28.6 L53.3,28.6 L53.3,26 L65.6,26 L65.6,22.4 L48.5,22.4 L48.5,38.1 L48.6,38.1 Z M27.2,38.1 L44.6,38.1 L44.6,34.3 L32,34.3 L32,31.8 L43.7,31.8 L43.7,28.6 L32,28.6 L32,26 L44.3,26 L44.3,22.4 L27.2,22.4 L27.2,38.1 Z M6.9,38.1 L11.7,38.1 L11.7,32.8 L22.7,32.8 L22.7,29.2 L11.7,29.2 L11.7,26.3 L23.2,26.3 L23.2,22.5 L6.9,22.5 L6.9,38.1 Z"
                id="Shape"
                fill={color.leftText}
              />

              <path
                d="M82,16.5 L90.7,16.5 L90.7,14.6 L84.4,14.6 L84.4,13.3 L90.2,13.3 L90.2,11.7 L84.4,11.7 L84.4,10.4 L90.6,10.4 L90.6,8.6 L82,8.6 L82,16.5 Z M70,16.5 L72.4,16.5 L72.4,13.5 L77.5,13.5 L77.5,16.5 L79.9,16.5 L79.9,8.7 L77.5,8.7 L77.5,11.5 L72.4,11.5 L72.4,8.7 L70,8.7 L70,16.5 Z M59.3,10.6 L62.7,10.6 L62.7,16.5 L65.1,16.5 L65.1,10.6 L68.5,10.6 L68.5,8.7 L59.4,8.7 L59.4,10.6 L59.3,10.6 Z"
                id="Shape"
                fill={color.leftText}
              />

              <rect
                id="ORANGE"
                fill={color.rightBg}
                x="150"
                y="0"
                width="150"
                height="46"
              />

              <path
                d="M273.2,32.5 C273.2,37.1 275.8,38.2 280.1,38.2 L285.9,38.2 C291.3,38.2 293.6,38 293.6,33.5 L293.6,29 L282.8,29 L282.8,32.2 L288.8,32.2 L288.8,32.7 C288.8,34.2 287.5,34.4 286.3,34.4 L281.2,34.4 C278.8,34.4 278.2,33.8 278.2,31.1 L278.2,29.2 C278.2,26.5 278.8,25.9 281.2,25.9 L286.4,25.9 C287.9,25.9 288.8,26.1 288.8,27.6 L293.5,27.6 L293.5,27.1 C293.5,24.1 292.7,22.1 287.3,22.1 L280.1,22.1 C275.8,22.1 273.2,23.2 273.2,27.8 L273.2,32.5 Z M248,37.9 L252.8,37.9 L252.8,26.5 L261.8,37.9 L269.2,37.9 L269.2,22.3 L264.4,22.3 L264.4,33.7 L255.4,22.3 L248,22.3 L248,37.9 Z M238.6,37.9 L243.4,37.9 L243.4,22.3 L238.6,22.3 L238.6,37.9 Z M219.7,37.9 L235.3,37.9 L235.3,33.9 L224.5,33.9 L224.5,22.3 L219.7,22.3 L219.7,37.9 Z M198.3,37.9 L215.7,37.9 L215.7,34.1 L203.1,34.1 L203.1,31.6 L214.8,31.6 L214.8,28.4 L203.1,28.4 L203.1,25.9 L215.4,25.9 L215.4,22.3 L198.3,22.3 L198.3,37.9 Z M177,37.9 L194.4,37.9 L194.4,34.1 L181.8,34.1 L181.8,31.6 L193.5,31.6 L193.5,28.4 L181.8,28.4 L181.8,25.9 L194.1,25.9 L194.1,22.3 L177,22.3 L177,37.9 Z M156.7,37.9 L161.5,37.9 L161.5,32.6 L172.5,32.6 L172.5,29 L161.5,29 L161.5,26.1 L173,26.1 L173,22.3 L156.7,22.3 L156.7,37.9 Z"
                id="Shape"
                fill={color.rightText}
              />

              <path
                d="M231.8,16.4 L240.5,16.4 L240.5,14.5 L234.2,14.5 L234.2,13.2 L240,13.2 L240,11.6 L234.2,11.6 L234.2,10.3 L240.4,10.3 L240.4,8.5 L231.9,8.5 L231.9,16.4 L231.8,16.4 Z M219.8,16.4 L222.2,16.4 L222.2,13.4 L227.3,13.4 L227.3,16.4 L229.7,16.4 L229.7,8.6 L227.3,8.6 L227.3,11.4 L222.2,11.4 L222.2,8.6 L219.8,8.6 L219.8,16.4 Z M209,10.5 L212.4,10.5 L212.4,16.4 L214.8,16.4 L214.8,10.5 L218.2,10.5 L218.2,8.6 L209,8.6 L209,10.5 Z"
                id="Shape"
                fill={color.rightText}
              />
            </g>
          </g>
        </g>
      </Logo>
    )
  }
}

TheLogo.displayName = 'Logo'

export default TheLogo

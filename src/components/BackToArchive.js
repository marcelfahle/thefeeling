import React from 'react'
import styled from 'styled-components'

const Home = styled.svg`
  polygon,
  path {
    transition: fill 0.4s ease;
  }
`

export default ({ siteTitle, className = 'front', color }) => (
  <Home
    viewBox="0 0 300 46"
    version="1.1"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    ariaLabelledby="title"
  >
    <g>
      <title>{siteTitle}</title>

      <g
        id="Page-1"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g id="TheFeeling_back_home" fillRule="nonzero">
          <polygon
            id="Shape"
            fill={color.leftBg}
            points="0 0 0 46 150 46 150 0"
          />

          <polygon
            id="Shape"
            fill={color.rightBg}
            points="150 0 150 46 300 46 300 0"
          />

          <path
            d="M45.1,29.2 C45.1,32.2 44.9,32.4 43.4,32.7 L42.4,32.9 C42.1,33 42.1,33.9 42.4,34.1 C44.3,34 45.9,34 47.5,34 C48.5,34 49.7,34.1 50.9,34.1 C52.9,34.1 55.4,34 57.5,33.3 C59.6,32.6 61.4,30.8 61.4,27.8 C61.4,24.6 59.2,22.9 56.5,22.3 C56.2,22.2 56,22.1 56,22 C56,21.8 56.3,21.7 56.7,21.6 C57.7,21.3 60.1,20.2 60.1,17.5 C60.1,15.6 59.2,14.2 57.8,13.3 C56.3,12.4 54.2,12.1 51.1,12.1 C47.8,12.1 45.4,12.2 42.9,12.4 C42.4,12.4 42.5,13.4 42.8,13.6 L43.7,13.7 C45.1,13.9 45.2,14.2 45.2,17.6 L45.2,29.2 L45.1,29.2 Z M49.6,15.4 C49.6,13.9 49.6,13.7 51.2,13.7 C53.5,13.7 55.3,15.1 55.3,18 C55.3,20 54.2,21.8 51.4,21.8 C49.7,21.8 49.7,21.7 49.7,20.9 L49.7,15.4 L49.6,15.4 Z M49.6,24.5 C49.6,23.2 49.6,23.1 51.4,23.1 C54.6,23.1 56.2,25.1 56.2,28 C56.2,30.7 54.9,32.6 52.5,32.6 C49.9,32.6 49.6,31 49.6,28.4 L49.6,24.5 Z M75,25.1 C75.2,21.7 73.5,20.3 70.8,20.3 C68.5,20.3 66.4,21.4 65.3,22.3 C64.5,22.9 63.7,24 63.7,24.8 C63.7,25.3 63.9,25.6 64.5,25.6 C65.1,25.6 66.4,25.2 66.9,24.8 C67.2,24.6 67.4,24.3 67.5,23.7 C67.7,22.3 68.4,21.8 69.2,21.8 C70.6,21.8 71.1,23.4 71.1,24.6 C71.1,25 71.1,25.4 71,25.7 C71,26 70.8,26.2 70.2,26.4 C69.3,26.7 68.4,26.9 67.1,27.3 C64.7,28 63.7,29 63.7,30.7 C63.7,33 65.5,34.2 67.4,34.2 C68.6,34.2 69.6,33.6 70.2,33.1 C70.5,32.9 70.7,32.7 70.9,32.7 C71.1,32.7 71.2,32.8 71.4,33 C72.3,33.8 73,34.2 74.2,34.2 C76.1,34.2 77.6,32.9 78,32.4 C78.1,32.1 77.9,31.7 77.6,31.6 C77.1,31.9 76.7,32 76.3,32 C75.6,32 74.7,31.4 74.8,29.2 L75,25.1 Z M70.8,30.7 C70.8,31.7 70.6,32.3 69.5,32.3 C68.6,32.3 67.8,31.4 67.8,30.3 C67.8,28.7 69.1,28.2 70.6,28 C70.8,28 70.9,28.1 70.8,28.6 L70.8,30.7 Z M86.9,20.3 C82.4,20.3 78.7,23.1 78.7,27.8 C78.7,31.7 81.5,34.5 85.7,34.5 C88.8,34.5 90.8,32.6 91.5,31 C91.5,30.5 91,30.2 90.6,30.3 C89.9,31.5 88.9,31.9 87.7,31.9 C84.7,31.9 83,29.3 83,26.7 C83,24.4 84.2,22 86.3,22 C87.5,22 88.8,23.2 89.7,24.5 C89.8,24.6 90.1,24.7 90.2,24.7 C90.6,24.7 91.1,23.8 91.1,22.8 C91.1,21.9 90.8,21.4 90.4,21.1 C89.5,20.6 88.1,20.3 86.9,20.3 Z M94.4,30.2 C94.4,32.5 94.3,32.8 93.1,32.9 L92.5,33 C92.2,33.2 92.2,34 92.5,34.2 C93.7,34.1 95,34.1 96.5,34.1 C98,34.1 99.4,34.1 100.5,34.2 C100.8,34 100.8,33.2 100.5,33 L100,32.9 C98.8,32.8 98.7,32.5 98.7,30.2 L98.7,28.3 C98.7,27.7 98.9,27.5 99.1,27.5 C99.4,27.5 99.7,27.6 99.9,28 L102.2,31.6 C102.5,32 102.8,32.5 102.8,32.7 C102.8,32.8 102.6,32.9 102.3,33 L101.9,33.1 C101.6,33.4 101.7,34.1 102,34.3 C102.9,34.2 104.1,34.2 106.1,34.2 C108,34.2 109.2,34.2 110.3,34.3 C110.6,34.2 110.7,33.4 110.4,33.1 L109.9,33 C109,32.8 108.4,32.7 108,32.2 C107.2,31.4 104.3,27 103.7,25.9 C103.5,25.6 103.5,25.4 103.5,25.3 C103.5,25.2 103.5,25.1 103.7,24.9 C104.2,24.4 104.7,23.9 105.9,23 C106.8,22.3 107.5,22 108.1,21.8 L109.2,21.6 C109.4,21.3 109.4,20.6 109.1,20.4 C107.2,20.7 104.4,20.9 102.9,20.9 L102.1,20.9 C101.8,21 101.7,21.8 102,22.1 L102.8,22.2 C103.1,22.2 103.4,22.4 103.4,22.5 C103.4,22.7 103.2,23.1 102.6,23.8 L101.2,25.4 C100.5,26.2 99.8,26.3 99.3,26.3 C98.9,26.3 98.8,26.2 98.8,25.8 L98.8,15.4 C98.8,13.3 98.8,11.9 98.9,10.6 C98.8,10.4 98.5,10.4 98.3,10.4 C96.6,11.1 94.6,11.9 93.3,12.2 C93.1,12.4 93.1,13 93.3,13.2 L93.9,13.5 C94.6,13.9 94.6,14.3 94.6,15.6 L94.6,30.2 L94.4,30.2 Z"
            id="Shape"
            fill={color.leftText}
          />

          <path
            d="M184.5,26.5 C185.7,26.5 185.9,26.6 186.1,27.1 L187,29.9 C187.4,31.1 187.6,31.9 187.6,32.1 C187.6,32.3 187.5,32.5 186.7,32.7 L185.6,32.9 C185.2,33.2 185.3,33.9 185.7,34.1 C187.2,34 188.5,34 190.2,34 C191.9,34 193.7,34 195.3,34.1 C195.6,33.9 195.5,33.1 195.3,32.9 L194,32.7 C192.8,32.5 192.5,31.7 191.8,29.8 L187.3,16.9 C186.5,14.6 186.1,13.3 185.8,12.4 C185.7,11.9 185.5,11.7 185,11.7 C184.9,11.7 183.7,13.3 182.1,13.7 C182.2,14.7 181.6,15.8 180.9,17.9 L177.9,26 C177,28.4 176.4,30 175.8,31.3 C175.2,32.6 174.6,32.9 173.8,33 L172.9,33.1 C172.7,33.4 172.6,34.1 173,34.3 C174.5,34.3 175.3,34.2 176.4,34.2 C177.8,34.2 179,34.2 180.1,34.3 C180.4,34.1 180.4,33.4 180.2,33.1 L179.2,32.9 C178.3,32.7 177.8,32.5 177.8,32.3 C177.8,32 177.8,31.8 178,31.1 L179.3,27.3 C179.5,26.7 179.6,26.6 180.4,26.6 L184.5,26.6 L184.5,26.5 Z M181.3,24.8 C180.5,24.8 180.3,24.7 180.6,23.8 L181.4,21.3 C181.9,19.8 182.6,18 182.8,17.2 C183.1,17.9 183.7,19.7 184.2,21.1 L185.1,23.8 C185.4,24.7 185.2,24.8 184.4,24.8 L181.3,24.8 Z M197.7,30.2 C197.7,32.5 197.6,32.8 196.5,32.9 L195.9,33 C195.6,33.2 195.6,34 195.9,34.2 C197,34.1 198.4,34.1 199.8,34.1 C201.4,34.1 202.7,34.1 204.3,34.2 C204.6,34 204.6,33.2 204.3,33 L203.2,32.9 C202.1,32.8 202,32.5 202,30.2 L202,25.2 C202,23.9 202.2,23.2 202.6,23.2 C202.8,23.2 203.1,23.2 203.9,23.9 C204.3,24.3 204.7,24.5 205.2,24.5 C206.3,24.5 207.3,23.9 207.3,22.4 C207.3,21.1 206.4,20.5 205.5,20.5 C204.1,20.5 203.2,21.6 202.3,22.1 C202,22 202,21.9 202,21.7 C202,21.4 202.1,20.9 202.1,20.3 C202,20.1 201.8,20 201.5,20 C200.5,20.7 198.2,21.6 196.7,22 C196.5,22.2 196.5,22.8 196.7,23 L197.2,23.3 C197.8,23.7 197.8,24.1 197.8,25.4 L197.8,30.2 L197.7,30.2 Z M216.5,20.3 C212,20.3 208.3,23.1 208.3,27.8 C208.3,31.7 211.1,34.5 215.3,34.5 C218.4,34.5 220.4,32.6 221.1,31 C221.1,30.5 220.6,30.2 220.2,30.3 C219.5,31.5 218.5,31.9 217.3,31.9 C214.3,31.9 212.6,29.3 212.6,26.7 C212.6,24.4 213.8,22 215.9,22 C217.1,22 218.4,23.2 219.3,24.5 C219.4,24.6 219.7,24.7 219.8,24.7 C220.2,24.7 220.7,23.8 220.7,22.8 C220.7,21.9 220.4,21.4 220,21.1 C219.1,20.6 217.7,20.3 216.5,20.3 Z M224.1,30.2 C224.1,32.5 224,32.8 222.9,32.9 L222.3,33 C222,33.2 222,34 222.3,34.2 C223.4,34.1 224.8,34.1 226.2,34.1 C227.8,34.1 228.8,34.1 229.9,34.2 C230.2,34 230.2,33.2 229.9,33 L229.3,32.9 C228.5,32.8 228.4,32.5 228.4,30.7 L228.4,24.8 C228.4,24.2 228.5,23.8 228.7,23.6 C229,23.2 229.6,22.8 230.5,22.8 C232.1,22.8 232.8,23.9 232.8,25 L232.8,30.7 C232.8,32.5 232.7,32.7 231.9,32.9 L231.3,33 C231,33.2 231,34 231.3,34.2 C232,34.1 233.4,34.1 234.9,34.1 C236.5,34.1 237.9,34.1 238.9,34.2 C239.2,34 239.2,33.2 238.9,33 L238.4,32.9 C237.2,32.8 237.1,32.5 237.1,30.2 L237.1,24.5 C237.1,22.2 235.7,20.3 232.9,20.3 C231.3,20.3 229.8,21.1 229.1,21.6 C228.8,21.8 228.6,21.9 228.6,21.9 C228.4,21.9 228.4,21.8 228.4,21.5 L228.4,15.4 C228.4,13.3 228.4,11.9 228.5,10.6 C228.4,10.4 228.1,10.4 227.9,10.4 C226.2,11.1 224.2,11.9 222.9,12.2 C222.7,12.4 222.7,13 222.9,13.2 L223.5,13.5 C224.2,13.9 224.2,14.3 224.2,15.6 L224.2,30.2 L224.1,30.2 Z M247.1,24.1 C247.1,22.6 247.1,21.2 247.2,20.2 C247.1,20 246.9,19.9 246.6,19.9 C245.6,20.5 243.3,21.4 241.7,21.8 C241.5,22 241.5,22.6 241.7,22.8 L242.2,23.1 C242.8,23.5 242.8,23.9 242.8,25.2 L242.8,30.2 C242.8,32.5 242.7,32.8 241.6,32.9 L241,33 C240.7,33.2 240.7,34 241,34.2 C242.1,34.1 243.5,34.1 245,34.1 C246.5,34.1 247.8,34.1 249,34.2 C249.3,34 249.3,33.2 249,33 L248.4,32.9 C247.3,32.8 247.2,32.5 247.2,30.2 L247.2,24.1 L247.1,24.1 Z M245,12.9 C243.7,12.9 242.5,13.9 242.5,15.3 C242.5,16.7 243.4,17.6 244.8,17.6 C246.1,17.6 247.3,16.8 247.3,15.2 C247.4,13.9 246.4,12.9 245,12.9 Z M250.5,22 C251.3,22.2 251.5,22.5 252.3,24.1 C254.4,28.5 255.1,30.1 256.8,34.2 C257,34.3 257.3,34.4 257.6,34.4 C257.9,34.4 258.2,34.3 258.4,34.2 C259.9,30.7 261.4,27.1 263.1,23.7 C263.8,22.4 264,22.1 265,21.9 L265.6,21.8 C265.8,21.6 265.9,20.8 265.5,20.6 C264.8,20.6 264,20.7 263,20.7 C262,20.7 261.4,20.7 260.3,20.6 C260,20.8 260,21.6 260.3,21.8 L260.8,21.9 C261.4,22 261.6,22.1 261.6,22.3 C261.6,22.5 261.5,22.8 261.4,23.1 C260.7,25.1 259.9,26.9 259.2,28.5 C258.5,26.9 257.8,25.2 257.1,23.4 C256.9,22.9 256.8,22.4 256.8,22.2 C256.8,22 257,22 257.4,21.9 L257.9,21.8 C258.1,21.6 258.1,20.8 257.8,20.6 C256.6,20.6 255.4,20.7 254.1,20.7 C252.4,20.7 251.2,20.7 250,20.6 C249.6,20.7 249.6,21.5 249.9,21.8 L250.5,22 Z M276.8,26.2 C277.8,26.2 278,25.7 278,25.1 C278,22.6 276.2,20.3 272.7,20.3 C268.6,20.3 265.6,23.5 265.6,27.7 C265.6,31.3 268,34.4 272.5,34.4 C274.5,34.4 276.9,33.4 278.3,30.6 C278.3,30 277.8,29.8 277.4,29.8 C276.5,31.3 275.3,31.5 274.3,31.5 C271.2,31.5 269.6,29.1 269.6,26.6 C269.6,26.1 269.7,26 270.4,26 L276.8,26 L276.8,26.2 Z M271.5,24.7 C270.4,24.7 270,24.7 270,24.2 C270,23.1 271.2,21.8 272.6,21.8 C273.7,21.8 274.3,22.5 274.3,23.6 C274.3,23.9 274.2,24.3 274.1,24.4 C273.7,24.6 273.2,24.7 272.7,24.7 L271.5,24.7 Z"
            id="Shape"
            fill={color.rightText}
          />
        </g>
      </g>
    </g>
  </Home>
)
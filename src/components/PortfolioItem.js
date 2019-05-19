import React from 'react'
import { default as RouterLink } from 'gatsby-link'
import styled from 'styled-components'

//const getRandomInt = (min, max) =>
//  Math.floor(Math.random() * (max - min + 1)) + min

const Item = styled.div`
  width: 100%;
  text-align: center;
  //margin-bottom: 30px;
  //border: 2px solid red;
  @media (min-width: 720px) {
    text-align: left;
  }
`

const FirstImage = styled.img`
  width: calc(100vw - 50px);
  max-width: 500px;
  transition: all 0.8 ease;

  /*border: 2px solid green; */

  @media (min-width: 720px) {
    width: 100%;
    max-width: ${props =>
      !props.width || props.width === 100 ? '100%' : props.width + '%'};
  }
`

const TextElement = styled.div`
  display: inline-block;
  padding: 20px;
  border: 1px solid red;
`

const Link = styled(RouterLink)`
  pointer-events: auto;
  transition: all 0.8 ease;

  @media (min-width: 720px) {
    margin-left: 25px;
    margin-left: ${props => props.pos || 0}%;
  }
`
const ExternalLink = styled.a`
  pointer-events: auto;
  transition: all 0.8 ease;

  @media (min-width: 720px) {
    margin-left: 25px;
    margin-left: ${props => props.pos || 0}%;
  }
`

const NoLink = styled.span`
  pointer-events: auto;
  transition: all 0.8 ease;

  @media (min-width: 720px) {
    margin-left: 25px;
    margin-left: ${props => props.pos || 0}%;
  }
`

const hasImage = data => data.previewImage && data.previewImage.url

const Img = ({ data }) => (
  <FirstImage
    width={`${data.width}%`}
    style={{ left: data.xPosition }}
    src={data.previewImage.url}
  />
)

const createMarkup = html => {
  return { __html: html }
}

const Txt = ({ data }) => (
  <TextElement
    style={{
      width: `${data.width}%`,
      left: data.xPosition,
      backgroundColor: data.themeColor ? data.themeColor.hex : 'transparent',
      color: data.textColor ? data.textColor.hex : 'transparent',
      fontSize: 24,
    }}
    dangerouslySetInnerHTML={createMarkup(
      data.previewText ? data.previewText : 'No Data'
    )}
  />
)

export default ({ data, lastPos = 0, path = 'oeuvre' }) => (
  <Item>
    {data.subPages &&
    data.subPages[0] &&
    data.subPages[0].externalLink !== '' ? (
      <ExternalLink
        pos={data.xPosition}
        href={data.subPages[0].externalLink}
        target="_blank"
      >
        {hasImage(data) ? <Img data={data} /> : <p>No image</p>}
      </ExternalLink>
    ) : data.subPages && data.subPages.length === 0 ? (
      <NoLink pos={data.xPosition} target="_blank">
        {hasImage(data) ? <Img data={data} /> : <Txt data={data} />}
      </NoLink>
    ) : (
      <Link pos={data.xPosition} to={`/${path}/${data.slug}#${lastPos}`}>
        {hasImage(data) ? <Img data={data} /> : <Txt data={data} />}
      </Link>
    )}
  </Item>
)

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

const hasImage = data =>
  data.subPages &&
  data.subPages.length > 0 &&
  data.subPages[0].image &&
  data.subPages[0].image.url

const Img = ({ data }) => (
  <FirstImage
    width={data.width}
    style={{ opacity: data.subPages[0].opacity / 100 }}
    src={data.subPages[0].image.url}
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
    ) : data.subPages && data.subPages.length === 1 ? (
      <NoLink pos={data.xPosition} target="_blank">
        {hasImage(data) ? <Img data={data} /> : <p>No image</p>}
      </NoLink>
    ) : (
      <Link pos={data.xPosition} to={`/${path}/${data.slug}#${lastPos}`}>
        {hasImage(data) ? <Img data={data} /> : <p>No image</p>}
      </Link>
    )}
  </Item>
)

import React from 'react'
import { default as RouterLink } from 'gatsby-link'
import styled, {css} from 'styled-components'

//const getRandomInt = (min, max) =>
//  Math.floor(Math.random() * (max - min + 1)) + min

const Item = styled.div`
  width: 100%;
  text-align: center;
  position: relative;
  //margin-bottom: 30px;
  //border: 2px solid red;
  @media (min-width: 720px) {
    text-align: left;
  }
`

const FirstImage = styled.img`
/*
  width: calc(100vw - 50px);
  max-width: 500px;
  left: 25px;

  */
  width: 100%;
  transition: all 0.8 ease;
  opacity: ${props => props.opacity};
  margin: 0 auto;
  /*border: 2px solid green; */
  @media (min-width: 720px) {
    width: 100%;
    /*
    left: ${props => (!props.left || props.left ? `${props.left}%` : 0)};
    max-width: ${props =>
      !props.mwidth || props.mwidth === 100 ? '100%' : props.mwidth + '%'};
      */
  }
`

const TextElement = styled.div`
  ${props => !props.hasImage ? 
  `
  position: relative;
  text-align:center;   
  ` :  
  `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  `};
/*
  top: 0;
  left: ${props => (props.left ? `${props.left}%` : 'auto')};
  max-width: calc(
    ${props =>
        !props.width || props.width === 100 ? '100%' : props.width + '%'} - 40px
  ${props => (props.hasImage ? `height: calc(100% - 40px)` : '')};
  max-width: ${props => !props.mwidth || props.mwidth === 100 ? '100%' : props.mwidth + '%'};
  */
  display: block;
  width: 100%;
  overflow: hidden;
  font-size: ${props => props.baseFontSize}px;
  p {
    font-size: 1em;
  }
  h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }
  h2 {
    font-size: 1.5em;
    margin: 0.75em 0;
  }
  h3 {
    font-size: 1.17em;
    margin: 0.83em 0;
  }
  h4 {
    margin: 1.12em 0;
  }
  h5 {
    font-size: 0.83em;
    margin: 1.5em 0;
  }
  h6 {
    font-size: 0.75em;
    margin: 1.67em 0;
  }
`

const linkStyles = css`
  pointer-events: auto;
  transition: all 0.8 ease;
  //border:5px solid green;

  position: absolute;
  display: block;
  text-align: center;
  top: 0;
  width: 100%;
  left: ${props => (props.left ? `${props.left}%` : 'auto')};
  max-width: ${props =>!props.mwidth || props.mwidth === 100 ? '100%' : props.mwidth + '%'};

  @media (max-width: 720px) {
    position: relative;
    margin: 0 auto;
    left: auto;
    max-width: 80%;
  }
`

const Link = styled(RouterLink)`
  ${linkStyles}
`
const ExternalLink = styled.a`
  ${linkStyles}
  //border:5px solid purple;
`
const NoLink = styled.span`
  ${linkStyles}
  //border:5px solid red;
`

const hasImage = data => data.previewImage && data.previewImage.url

const Img = ({ data }) => (
  <FirstImage
  mwidth={data.width}
    left={data.xPosition}
    opacity={data.imageOpacity ? data.imageOpacity / 100 : 1}
    src={data.previewImage.url}
  />
)

const createMarkup = html => {
  return { __html: html }
}

const Txt = ({ data }) => (
  <TextElement
    width={data.width}
    left={data.xPosition}
    baseFontSize={data.baseFontSize}
    hasImage={hasImage(data)}
    style={{
      backgroundColor: data.themeColor ? data.themeColor.hex : 'transparent',
      color: data.textColor ? data.textColor.hex : 'transparent',
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
      left={data.xPosition} mwidth={data.width} 
        href={data.subPages[0].externalLink}
        target="_blank"
      >
        {hasImage(data) ? <Img data={data} /> : null}
        {data.previewText && data.previewText !== '' && <Txt data={data} />}
      </ExternalLink>
    ) : data.subPages && data.subPages.length === 0 ? (
      <NoLink  left={data.xPosition}  mwidth={data.width} target="_blank">
        {hasImage(data) ? <Img data={data} /> : null}
        {data.previewText && data.previewText !== '' && <Txt data={data} />}
      </NoLink>
    ) : (
      <Link left={data.xPosition} mwidth={data.width} to={`/${path}/${data.slug}#${lastPos}`}>
        {hasImage(data) ? <Img data={data} /> : null}
        {data.previewText && data.previewText !== '' && <Txt data={data} />}
      </Link>
    )}
  </Item>
)

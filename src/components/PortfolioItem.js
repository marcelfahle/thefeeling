import React from 'react'
import { default as RouterLink } from 'gatsby-link'
import styled, { css } from 'styled-components'

//const getRandomInt = (min, max) =>
//  Math.floor(Math.random() * (max - min + 1)) + min

const Item = styled.div`
  width: 100%;
  text-align: center;
  position: relative;
  margin-bottom: 30px;
  //margin-bottom: 30px;
  //border: 2px solid red;
  @media (min-width: 720px) {
    text-align: left;
    margin-bottom: 10px;
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
  /* border: 2px solid green; */
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
  padding: 20px;
  top: 0;
  bottom: 5px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  ${props =>
    !props.hasImage
      ? `
          position: relative;
          text-align:center;   
        `
      : `
          position: absolute;
          padding: 20px;
          width: calc(100% - 40px);
          bottom: 5px;
  `};
/*
  top: 0;
  left: ${props => (props.left ? `${props.left}%` : 'auto')};
  max-width: calc(
    ${props =>
    !props.width || props.width === 100 ? '100%' : props.width + '%'} - 40px
  ${props => (props.hasImage ? `height: calc(100% - 40px)` : '')};
  max-width: ${props =>
    !props.mwidth || props.mwidth === 100 ? '100%' : props.mwidth + '%'};
  */
  overflow: hidden;
  font-size: ${props => props.baseFontSizeMobile}px;
	@media (min-width: 720px) {
		font-size: ${props => props.baseFontSize}px;
	}
  p {
    font-size: 1em;
  }
  p:first-child {
    margin-top: 0;
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
  text-decoration: none;
  //border:5px solid green;

  // TODO: why was this here?
  //position: absolute;
  display: block;
  text-align: center;
  top: 0;
  width: 100%;
  position: relative;
  left: ${props => (props.left ? `${props.left}%` : 'auto')};
  max-width: ${props =>
    !props.mwidth || props.mwidth === 100 ? '100%' : props.mwidth + '%'};

  @media (max-width: 720px) {
    margin: 0 auto;
    left: auto;
    max-width: 80%;
  }
`

const Link = styled(RouterLink)`
  ${linkStyles};
`
const ExternalLink = styled.a`
  ${linkStyles};
`
const NoLink = styled.span`
  ${linkStyles} //border:5px solid red;;;;;;;;;;;;;;;;;;;;;;;;;;;;
`

const hasImage = data => data.previewImage && data.previewImage.url

const Img = ({ data }) => {

  const processImageUrl = (url, format) => {
    if (format === 'gif') {
      // Remove URL parameters / optimizations if it's a GIF
      // customer requirements is to preserve transparency in gifs on mobile
      const urlObj = new URL(url);
      const cleanUrl = `${urlObj.origin}${urlObj.pathname}`;
      return cleanUrl;
    }
    // Return the original URL if not a GIF
    return url;
  };

  // Process the image URL based on its format
  const processedUrl = processImageUrl(data.previewImage.url, data.previewImage.format);

  return <FirstImage
    mwidth={data.width}
    left={data.xPosition}
    opacity={data.imageOpacity ? data.imageOpacity / 100 : 1}
    src={processedUrl}
  />
}

const createMarkup = html => {
  return { __html: html }
}

const Txt = ({ data }) => (
  <TextElement
    width={data.width}
    left={data.xPosition}
    baseFontSize={data.baseFontSize}
    baseFontSizeMobile={data.baseFontSizeMobile}
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
        left={data.xPosition}
        mwidth={data.width}
        href={data.subPages[0].externalLink}
        target="_blank"
      >
        {hasImage(data) ? <Img data={data} /> : null}
        {data.previewText && data.previewText !== '' && <Txt data={data} />}
      </ExternalLink>
    ) : data.slug === 'ye-olden-stuffe' ? (
      <Link left={data.xPosition} mwidth={data.width} to={`/${data.slug}`}>
        {hasImage(data) ? <Img data={data} /> : null}
      </Link>
    ) : data.subPages && data.subPages.length === 0 ? (
      <NoLink left={data.xPosition} mwidth={data.width} target="_blank">
        {hasImage(data) ? <Img data={data} /> : null}
        {data.previewText && data.previewText !== '' && <Txt data={data} />}
      </NoLink>
    ) : (
      <Link
        left={data.xPosition}
        mwidth={data.width}
        to={`/${path}/${data.slug}#${lastPos}`}
      >
        {hasImage(data) ? <Img data={data} /> : null}
        {data.previewText && data.previewText !== '' && <Txt data={data} />}
      </Link>
    )}
  </Item>
)

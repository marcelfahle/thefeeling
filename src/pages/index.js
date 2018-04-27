import React from 'react'

import BackgroundVideoPlayer from '../components/BackgroundVideoPlayer2'

function IndexPage({ data }) {
  return (
    <div>
      <BackgroundVideoPlayer playlist={data.datoCmsPageHome.videoPlaylist} />
    </div>
  )
}

export default IndexPage

export const query = graphql`
  query IndexQuery {
    datoCmsPageHome {
      videoPlaylist {
        videoUrl
        logoColors
      }
    }
  }
`

import React from 'react'

import BackgroundVideoPlayer from '../components/BackgroundVideoPlayer'

function IndexPage({ data, color }) {
  return (
    <div>
      <BackgroundVideoPlayer
        color={color}
        playlist={data.datoCmsPageHome.videoPlaylist}
      />
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

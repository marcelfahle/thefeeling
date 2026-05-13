import React, { useState, useEffect } from 'react'

import BackgroundVideoPlayer from '../components/BackgroundVideoPlayer'

const BOLD_PLAYLIST_FUNCTION =
  process.env.NODE_ENV === 'development'
    ? '/api/bold-playlist'
    : '/.netlify/functions/bold-playlist'

function IndexPage({ color }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    const transform = (data) =>
      data.videos.map((v) => ({
        videoUrl: `https://stream.mux.com/${v.playback_id}/medium.mp4`,
      }))

    const getData = async () => {
      try {
        const response = await fetch(BOLD_PLAYLIST_FUNCTION)
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          )
        }
        let actualData = await response.json()
        setData(transform(actualData))
      } catch (err) {
        setData(null)
      }
    }
    getData()
  }, [])

  return (
    <div>{data && <BackgroundVideoPlayer color={color} playlist={data} />}</div>
  )
}

export default IndexPage

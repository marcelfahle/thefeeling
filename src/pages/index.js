import React, { useState, useEffect } from 'react'
import { graphql } from 'gatsby'

import BackgroundVideoPlayer from '../components/BackgroundVideoPlayer'

function IndexPage({ color }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const transform = (data) =>
      data.videos.map((v) => ({
        videoUrl: `https://stream.mux.com/${v.playback_id}/medium.mp4`,
      }))

    const getData = async () => {
      try {
        const response = await fetch(
          `https://app.boldvideo.io/api/playlists/geg8b`,
          {
            headers: {
              Authorization: process.env.GATSBY_BOLD_API,
              'Content-Type': 'application/json; charset=utf-8',
            },
          }
        )
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          )
        }
        let actualData = await response.json()
        setData(transform(actualData))
        setError(null)
      } catch (err) {
        setError(err.message)
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [])

  return (
    <div>{data && <BackgroundVideoPlayer color={color} playlist={data} />}</div>
  )
}

export default IndexPage

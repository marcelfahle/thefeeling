const PLAYLIST_URL = 'https://app.boldvideo.io/api/playlists/geg8b'
const VIDEO_URL = 'https://app.boldvideo.io/api/videos'

function getAuthorization() {
  return process.env.BOLD_API || process.env.GATSBY_BOLD_API
}

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  }
}

function proxiedResponse(response, body) {
  return {
    statusCode: response.status,
    headers: {
      'Content-Type':
        response.headers.get('content-type') ||
        'application/json; charset=utf-8',
    },
    body,
  }
}

async function proxyBoldPlaylist() {
  const authorization = getAuthorization()

  if (!authorization) {
    return jsonResponse(500, { error: 'Missing Bold API token' })
  }

  try {
    const response = await fetch(PLAYLIST_URL, {
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json; charset=utf-8',
      },
    })

    return proxiedResponse(response, await response.text())
  } catch (error) {
    return jsonResponse(502, { error: 'Could not load Bold playlist' })
  }
}

async function proxyBoldVideo(id) {
  const authorization = getAuthorization()

  if (!id || !/^[a-z0-9-]+$/i.test(id)) {
    return jsonResponse(400, { error: 'Missing or invalid video id' })
  }

  if (!authorization) {
    return jsonResponse(500, { error: 'Missing Bold API token' })
  }

  try {
    const response = await fetch(`${VIDEO_URL}/${id}`, {
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json; charset=utf-8',
      },
    })

    return proxiedResponse(response, await response.text())
  } catch (error) {
    return jsonResponse(502, { error: 'Could not load Bold video' })
  }
}

function sendGatsbyResponse(res, response) {
  Object.entries(response.headers || {}).forEach(([key, value]) => {
    res.setHeader(key, value)
  })

  res.status(response.statusCode).send(response.body)
}

module.exports = {
  proxyBoldPlaylist,
  proxyBoldVideo,
  sendGatsbyResponse,
}

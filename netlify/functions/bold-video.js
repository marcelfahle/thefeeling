const { proxyBoldVideo } = require('../../src/server/boldProxy')

exports.handler = async (event) => {
  const id = event.queryStringParameters && event.queryStringParameters.id

  return proxyBoldVideo(id)
}

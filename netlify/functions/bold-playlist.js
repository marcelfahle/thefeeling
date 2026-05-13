const { proxyBoldPlaylist } = require('../../src/server/boldProxy')

exports.handler = async () => {
  return proxyBoldPlaylist()
}

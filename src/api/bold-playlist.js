const { proxyBoldPlaylist, sendGatsbyResponse } = require('../server/boldProxy')

module.exports = async function boldPlaylist(req, res) {
  sendGatsbyResponse(res, await proxyBoldPlaylist())
}

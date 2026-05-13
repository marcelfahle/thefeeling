const { proxyBoldVideo, sendGatsbyResponse } = require('../server/boldProxy')

module.exports = async function boldVideo(req, res) {
  sendGatsbyResponse(res, await proxyBoldVideo(req.query && req.query.id))
}

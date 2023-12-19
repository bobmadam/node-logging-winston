const httpResp = require('./httpResp')
const logger = require('./logger')

async function recordHit(req, res, next) {
  res.locals = {}
  res.locals.response = {}
  if (req.method === 'GET') {
    logger.http(`${req.method} ${req.url} ${JSON.stringify(req.query)}`)
  } else if (req.method === 'POST') {
    logger.http(`${req.method} ${req.url} ${JSON.stringify(req.body)}`)
  }

  res.locals.status = httpResp.HTTP_NOTFOUND
  res.locals.response.rc = httpResp.HTTP_NOTFOUND
  res.locals.response.rd = ``
  res.locals.response.data = {}
  next()
}

function printForwardRequestResponse(req, res, next) {
  const { response, status } = res.locals
  logger.http(`${JSON.stringify(response)}`)
  res
    .set('Content-Type', 'application/json')
    .status(status || 200)
    .send(response)

  next()
}

module.exports = {
  recordHit,
  printForwardRequestResponse,
}

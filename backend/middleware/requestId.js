/**
 * Attach X-Request-Id to each request for tracing and logs.
 */

const { randomUUID } = require('crypto');

function requestId(req, res, next) {
  const id = req.headers['x-request-id'] || randomUUID();
  req.id = id;
  res.setHeader('X-Request-Id', id);
  next();
}

module.exports = { requestId };

/**
 * Global error handler. All route handlers should pass errors via next(err).
 * Returns JSON for API routes; preserves status when set on error object.
 */

function errorHandler(err, _req, res, _next) {
  const requestId = res.getHeader?.('X-Request-Id') || '';
  const status = err.status ?? err.statusCode ?? 500;
  const message = err.message || 'Internal server error';

  if (status >= 500) {
    console.error(`[${requestId}]`, err.message, err.stack);
  }

  res.status(status).json({
    error: message,
    ...(requestId && { requestId }),
  });
}

module.exports = { errorHandler };

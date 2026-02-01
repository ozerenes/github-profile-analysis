/**
 * Central config: env, limits, constants.
 * Single source of truth for PDF size and port.
 */

const MAX_PDF_MB = 10;
const MAX_PDF_BYTES = MAX_PDF_MB * 1024 * 1024;

const config = {
  port: Number(process.env.PORT) || 3001,
  maxPdfBytes: MAX_PDF_BYTES,
  maxPdfMb: MAX_PDF_MB,
  jsonBodyLimit: '1mb',
};

module.exports = { config, MAX_PDF_BYTES, MAX_PDF_MB };

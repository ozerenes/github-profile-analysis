/**
 * Extract text from a PDF buffer.
 * Returns { text, error }. Empty or image-only PDFs return short text or error.
 */

const pdfParse = require('pdf-parse');

const MIN_EXTRACTED_LENGTH = 10;

async function extractTextFromPdf(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    return { text: null, error: 'No PDF data' };
  }

  try {
    const data = await pdfParse(buffer);
    const text = (data.text || '').trim().replace(/\s+/g, ' ');

    if (text.length < MIN_EXTRACTED_LENGTH) {
      return {
        text: text || null,
        error: 'PDF produced little or no text (may be image-only or empty)',
      };
    }

    return { text, error: null };
  } catch (err) {
    const message = err.message || 'PDF parsing failed';
    if (/password|encrypted/i.test(message)) {
      return { text: null, error: 'PDF is encrypted or password-protected' };
    }
    if (/invalid|corrupt|malformed/i.test(message)) {
      return { text: null, error: 'PDF appears corrupted or invalid' };
    }
    return { text: null, error: message };
  }
}

module.exports = { extractTextFromPdf };

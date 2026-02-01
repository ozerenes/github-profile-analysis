/**
 * Orchestrates data ingestion: validate → PDF extract → URL fetch → normalized payload.
 * Single entry point for the pipeline up to "raw input" for AI.
 */

const { validateInputs } = require('./validation');
const { extractTextFromPdf } = require('./pdf');
const { fetchAllUrls } = require('./urls');

async function ingest(pdfBuffer, urlInputs = {}) {
  const validation = validateInputs(pdfBuffer, urlInputs);
  if (!validation.valid) {
    return { success: false, error: validation.error, data: null };
  }

  const pdfResult = await extractTextFromPdf(pdfBuffer);
  if (pdfResult.error && !pdfResult.text) {
    return { success: false, error: pdfResult.error, data: null };
  }

  const cvText = pdfResult.text || '';
  const urls = validation.urls;
  const urlContent = await fetchAllUrls(urls);

  const data = {
    cvText,
    cvExtractionNote: pdfResult.error || null,
    github: urlContent.github,
    linkedin: urlContent.linkedin,
    portfolio: urlContent.portfolio,
  };

  return { success: true, error: null, data };
}

module.exports = { ingest };

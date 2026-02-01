/**
 * Controllers for ingest, extract-profile, and full analyze.
 * Handle req/res only; delegate to services and lib.
 */

const { ingest } = require('../lib/ingestion');
const { extractProfile } = require('../lib/profileExtraction');
const { runFullAnalysis, urlInputs } = require('../services/analyzeService');

async function postIngest(req, res, next) {
  try {
    const buffer = req.file?.buffer;
    const result = await ingest(buffer, urlInputs(req.body));
    if (!result.success) {
      return next(Object.assign(new Error(result.error), { status: 400 }));
    }
    res.json({ data: result.data });
  } catch (err) {
    next(err);
  }
}

async function postExtractProfile(req, res, next) {
  try {
    const buffer = req.file?.buffer;
    const ingestResult = await ingest(buffer, urlInputs(req.body));
    if (!ingestResult.success) {
      return next(Object.assign(new Error(ingestResult.error), { status: 400 }));
    }
    const extractResult = await extractProfile(ingestResult.data);
    if (!extractResult.success) {
      return next(Object.assign(new Error(extractResult.error), { status: 502 }));
    }
    res.json({ profile: extractResult.profile });
  } catch (err) {
    next(err);
  }
}

async function postAnalyze(req, res, next) {
  try {
    const buffer = req.file?.buffer;
    const result = await runFullAnalysis(buffer, urlInputs(req.body));
    if (!result.success) {
      const status = result.error?.includes('required') || result.error?.includes('CV') ? 400 : 502;
      return next(Object.assign(new Error(result.error), { status }));
    }
    res.json({ report: result.report });
  } catch (err) {
    next(err);
  }
}

module.exports = { postIngest, postExtractProfile, postAnalyze };

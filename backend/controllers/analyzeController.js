/**
 * Controllers for ingest, extract-profile (and later analyze).
 * Handle req/res only; delegate to lib.
 */

const { ingest } = require('../lib/ingestion');
const { extractProfile } = require('../lib/profileExtraction');

function urlInputs(body) {
  return {
    githubUrl: body?.githubUrl || body?.github,
    linkedinUrl: body?.linkedinUrl || body?.linkedin,
    portfolioUrl: body?.portfolioUrl || body?.portfolio,
  };
}

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

module.exports = { postIngest, postExtractProfile };

/**
 * Controllers for ingest (and later extract-profile, analyze).
 * Handle req/res only; delegate to lib.
 */

const { ingest } = require('../lib/ingestion');

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

module.exports = { postIngest };

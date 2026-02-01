/**
 * Controllers for score (role-fit, learning-roadmap, report added in later phases).
 * Handle req/res only; delegate to lib.
 */

const { scoreJobPotential } = require('../lib/jobPotential');

function requireProfile(req, res, next) {
  const profile = req.body?.profile;
  if (!profile) {
    return next(Object.assign(new Error('Missing profile in body'), { status: 400 }));
  }
  req.profile = profile;
  next();
}

async function postScore(req, res, next) {
  try {
    const result = scoreJobPotential(req.profile);
    res.json({
      overall_job_potential_score: result.overall_job_potential_score,
      explanation: result.explanation,
      breakdown: result.breakdown,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  requireProfile,
  postScore,
};

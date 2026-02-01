/**
 * Controllers for score, role-fit (learning-roadmap, report added in later phases).
 * Handle req/res only; delegate to lib.
 */

const { scoreJobPotential } = require('../lib/jobPotential');
const { analyzeRoleFit } = require('../lib/roleFit');
const { generateLearningRoadmap } = require('../lib/learningRoadmap');

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

async function postRoleFit(req, res, next) {
  try {
    const jobPotentialScore = req.body?.jobPotentialScore;
    const result = await analyzeRoleFit(req.profile, { jobPotentialScore });
    if (!result.success) {
      return next(Object.assign(new Error(result.error), { status: 502 }));
    }
    res.json({
      best_fit_roles: result.roleFit.best_fit_roles,
      roles_to_avoid: result.roleFit.roles_to_avoid,
    });
  } catch (err) {
    next(err);
  }
}

async function postLearningRoadmap(req, res, next) {
  try {
    const roleFit = req.body?.roleFit ?? null;
    const result = await generateLearningRoadmap(req.profile, { roleFit });
    if (!result.success) {
      return next(Object.assign(new Error(result.error), { status: 502 }));
    }
    res.json({
      short_term: result.roadmap.short_term,
      mid_term: result.roadmap.mid_term,
      long_term: result.roadmap.long_term,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  requireProfile,
  postScore,
  postRoleFit,
  postLearningRoadmap,
};

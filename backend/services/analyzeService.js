/**
 * Orchestration: ingest → extract → score → role fit → roadmap → report.
 * Single entry for full analysis; used by POST /api/analyze.
 */

const { ingest } = require('../lib/ingestion');
const { extractProfile } = require('../lib/profileExtraction');
const { scoreJobPotential } = require('../lib/jobPotential');
const { analyzeRoleFit } = require('../lib/roleFit');
const { generateLearningRoadmap } = require('../lib/learningRoadmap');
const { buildReport } = require('../lib/report');

function urlInputs(body) {
  return {
    githubUrl: body?.githubUrl || body?.github,
    linkedinUrl: body?.linkedinUrl || body?.linkedin,
    portfolioUrl: body?.portfolioUrl || body?.portfolio,
  };
}

async function runFullAnalysis(pdfBuffer, urlInputsPayload) {
  const ingestResult = await ingest(pdfBuffer, urlInputsPayload);
  if (!ingestResult.success) {
    return { success: false, error: ingestResult.error, report: null };
  }

  const extractResult = await extractProfile(ingestResult.data);
  if (!extractResult.success) {
    return { success: false, error: extractResult.error, report: null };
  }

  const profile = extractResult.profile;
  const jobPotential = scoreJobPotential(profile);

  const roleFitResult = await analyzeRoleFit(profile, {
    jobPotentialScore: jobPotential.overall_job_potential_score,
  });
  if (!roleFitResult.success) {
    return { success: false, error: roleFitResult.error, report: null };
  }

  const roadmapResult = await generateLearningRoadmap(profile, {
    roleFit: roleFitResult.roleFit,
  });
  if (!roadmapResult.success) {
    return { success: false, error: roadmapResult.error, report: null };
  }

  const report = buildReport(profile, jobPotential, roleFitResult.roleFit, roadmapResult.roadmap);

  return { success: true, error: null, report };
}

module.exports = { runFullAnalysis, urlInputs };

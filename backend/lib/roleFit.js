/**
 * Role fit analysis: best-fit roles and roles to avoid, with reasons.
 * Uses OpenAI or Gemini via llm.js.
 */

const { complete, parseJsonFromModel } = require('./llm');

const ROLE_FIT_SCHEMA = {
  type: 'object',
  properties: {
    best_fit_roles: {
      type: 'array',
      items: {
        type: 'object',
        properties: { role: { type: 'string' }, reason: { type: 'string' } },
        required: ['role', 'reason'],
        additionalProperties: false,
      },
    },
    roles_to_avoid: {
      type: 'array',
      items: {
        type: 'object',
        properties: { role: { type: 'string' }, reason: { type: 'string' } },
        required: ['role', 'reason'],
        additionalProperties: false,
      },
    },
  },
  required: ['best_fit_roles', 'roles_to_avoid'],
  additionalProperties: false,
};

function buildProfileSummary(profile) {
  const p = profile || {};
  return JSON.stringify(
    {
      current_seniority_level: p.current_seniority_level,
      primary_roles: p.primary_roles,
      core_technical_skills: p.core_technical_skills,
      secondary_skills: p.secondary_skills,
      evidence_of_experience: p.evidence_of_experience,
      consistency_score: p.consistency_score,
      strengths: p.strengths,
      red_flags: p.red_flags,
      missing_information: p.missing_information,
    },
    null,
    2
  );
}

function normalizeRoleFit(raw) {
  const best = Array.isArray(raw.best_fit_roles)
    ? raw.best_fit_roles.map((r) => ({
        role: String(r?.role ?? '').trim(),
        reason: String(r?.reason ?? '').trim(),
      }))
    : [];
  const avoid = Array.isArray(raw.roles_to_avoid)
    ? raw.roles_to_avoid.map((r) => ({
        role: String(r?.role ?? '').trim(),
        reason: String(r?.reason ?? '').trim(),
      }))
    : [];
  return { best_fit_roles: best, roles_to_avoid: avoid };
}

const SYSTEM_PROMPT = `You are a career advisor. Recommend which job roles the person should target and which to avoid for now, based ONLY on the structured profile provided.

RULES:
- Base every recommendation on evidence in the profile. Do NOT invent skills or experience.
- best_fit_roles: 2-5 roles the person is well positioned for. Give a short evidence-based reason for each.
- roles_to_avoid: 1-4 roles to avoid for now (e.g. seniority mismatch, missing skills). Give a short reason for each.
- If the profile is very thin, give fewer items and say "limited evidence in profile" in the reason.

Tüm cevapları Türkçe ver: role ve reason metinleri Türkçe olsun.

Output ONLY a single valid JSON object with exactly two keys: best_fit_roles (array of { role: string, reason: string }), roles_to_avoid (array of { role: string, reason: string }). No markdown, no text outside the JSON.`;

async function analyzeRoleFit(profile, options = {}) {
  if (!profile || typeof profile !== 'object') {
    return { success: false, error: 'Profile is required', roleFit: null };
  }
  const profileSummary = buildProfileSummary(profile);
  const scoreContext =
    options.jobPotentialScore != null
      ? ` Job potential score (0-100): ${options.jobPotentialScore}.`
      : '';
  const userContent = `Structured professional profile:\n${profileSummary}\n${scoreContext}\n\nReturn best_fit_roles and roles_to_avoid with reasons based only on this profile.`;
  const { text, error } = await complete(SYSTEM_PROMPT, userContent, 2048);
  if (error) return { success: false, error, roleFit: null };
  const parsed = parseJsonFromModel(text);
  if (!parsed)
    return { success: false, error: 'Invalid or incomplete JSON from model', roleFit: null };
  try {
    const roleFit = normalizeRoleFit(parsed);
    return { success: true, error: null, roleFit };
  } catch (e) {
    return { success: false, error: e.message || 'Invalid role fit structure', roleFit: null };
  }
}

module.exports = { analyzeRoleFit, normalizeRoleFit, ROLE_FIT_SCHEMA };

/**
 * Learning roadmap: short (0-3mo), mid (3-6mo), long (6-12mo).
 * Uses OpenAI or Gemini via llm.js.
 */

const { complete, parseJsonFromModel } = require('./llm');

const ROADMAP_ITEM = {
  type: 'object',
  properties: {
    outcome: { type: 'string' },
    actions: { type: 'array', items: { type: 'string' } },
  },
  required: ['outcome', 'actions'],
  additionalProperties: false,
};

const ROADMAP_SCHEMA = {
  type: 'object',
  properties: {
    short_term: { type: 'array', items: ROADMAP_ITEM },
    mid_term: { type: 'array', items: ROADMAP_ITEM },
    long_term: { type: 'array', items: ROADMAP_ITEM },
  },
  required: ['short_term', 'mid_term', 'long_term'],
  additionalProperties: false,
};

function buildContext(profile, roleFit) {
  const parts = [];
  parts.push(
    'Profile summary: ' +
      JSON.stringify({
        current_seniority_level: profile?.current_seniority_level,
        primary_roles: profile?.primary_roles,
        core_technical_skills: profile?.core_technical_skills,
        strengths: profile?.strengths,
        red_flags: profile?.red_flags,
        missing_information: profile?.missing_information,
      })
  );
  if (roleFit?.best_fit_roles?.length) {
    parts.push(
      'Best-fit roles to support: ' + roleFit.best_fit_roles.map((r) => r.role).join(', ')
    );
  }
  if (roleFit?.roles_to_avoid?.length) {
    parts.push(
      'Gaps to address: ' + roleFit.roles_to_avoid.map((r) => r.role + ': ' + r.reason).join('; ')
    );
  }
  return parts.join('\n');
}

function normalizeRoadmapItem(item) {
  if (!item || typeof item !== 'object') return { outcome: '', actions: [] };
  const actions = Array.isArray(item.actions)
    ? item.actions.map((a) => String(a ?? '').trim())
    : [];
  return { outcome: String(item.outcome ?? '').trim(), actions };
}

function normalizeRoadmap(raw) {
  const short = Array.isArray(raw.short_term) ? raw.short_term.map(normalizeRoadmapItem) : [];
  const mid = Array.isArray(raw.mid_term) ? raw.mid_term.map(normalizeRoadmapItem) : [];
  const long = Array.isArray(raw.long_term) ? raw.long_term.map(normalizeRoadmapItem) : [];
  return { short_term: short, mid_term: mid, long_term: long };
}

const SYSTEM_PROMPT = `You are a career and learning advisor. Generate a personalized learning roadmap from the profile and optional role-fit context.

RULES:
- Base the roadmap ONLY on the profile and, if provided, best-fit roles and roles to avoid. Do NOT invent skills or goals.
- short_term (0-3 months): 2-4 items. Highest priority, realistic, outcome-oriented.
- mid_term (3-6 months): 2-4 items. Build on short-term outcomes.
- long_term (6-12 months): 2-4 items. Stretch goals, career positioning.
- Each item has "outcome" (one clear goal) and "actions" (2-4 concrete steps). Be specific and achievable.
- If the profile is very thin, suggest fewer items.

Tüm çıktıyı Türkçe ver: outcome ve actions metinleri Türkçe olsun.

Output ONLY a single valid JSON object with exactly three keys: short_term, mid_term, long_term. Each is an array of { outcome: string, actions: string[] }. No markdown, no text outside the JSON.`;

async function generateLearningRoadmap(profile, options = {}) {
  if (!profile || typeof profile !== 'object') {
    return { success: false, error: 'Profile is required', roadmap: null };
  }
  const context = buildContext(profile, options.roleFit);
  const userContent = `Context:\n${context}\n\nGenerate short_term, mid_term, and long_term learning roadmap items. Each item: outcome (string), actions (array of 2-4 strings).`;
  const { text, error } = await complete(SYSTEM_PROMPT, userContent, 2048);
  if (error) return { success: false, error, roadmap: null };
  const parsed = parseJsonFromModel(text);
  if (!parsed)
    return { success: false, error: 'Invalid or incomplete JSON from model', roadmap: null };
  try {
    const roadmap = normalizeRoadmap(parsed);
    return { success: true, error: null, roadmap };
  } catch (e) {
    return { success: false, error: e.message || 'Invalid roadmap structure', roadmap: null };
  }
}

module.exports = { generateLearningRoadmap, normalizeRoadmap, ROADMAP_SCHEMA };

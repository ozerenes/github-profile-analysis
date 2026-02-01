/**
 * AI module: convert raw ingestion payload into a structured professional profile.
 * Output is strict JSON. CV = source of truth; no hallucination of missing data.
 * Uses OpenAI or Gemini via llm.js (set LLM_PROVIDER=gemini + GEMINI_API_KEY for free tier).
 */

const { complete, parseJsonFromModel } = require('./llm');

const PROFILE_SCHEMA = {
  type: 'object',
  properties: {
    current_seniority_level: {
      type: 'string',
      description:
        'One of: intern, junior, mid, senior, lead, principal, executive, or "unclear" if not determinable from evidence',
    },
    primary_roles: { type: 'array', items: { type: 'string' } },
    core_technical_skills: { type: 'array', items: { type: 'string' } },
    secondary_skills: { type: 'array', items: { type: 'string' } },
    evidence_of_experience: { type: 'array', items: { type: 'string' } },
    consistency_score: { type: 'integer', minimum: 0, maximum: 100 },
    strengths: { type: 'array', items: { type: 'string' } },
    red_flags: { type: 'array', items: { type: 'string' } },
    missing_information: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'current_seniority_level',
    'primary_roles',
    'core_technical_skills',
    'secondary_skills',
    'evidence_of_experience',
    'consistency_score',
    'strengths',
    'red_flags',
    'missing_information',
  ],
  additionalProperties: false,
};

function buildUserMessage(data) {
  const parts = [];
  parts.push('## CV (primary source of truth)\n' + (data.cvText || '(no text extracted)'));
  if (data.cvExtractionNote) parts.push('\nNote: ' + data.cvExtractionNote);
  parts.push(
    '\n## GitHub profile (optional signal)\n' +
      (data.github && data.github !== 'unavailable' ? data.github.slice(0, 6000) : 'not available')
  );
  parts.push(
    '\n## LinkedIn (optional signal)\n' +
      (data.linkedin && data.linkedin !== 'unavailable'
        ? data.linkedin.slice(0, 6000)
        : 'not available')
  );
  parts.push(
    '\n## Portfolio (optional signal)\n' +
      (data.portfolio && data.portfolio !== 'unavailable'
        ? data.portfolio.slice(0, 6000)
        : 'not available')
  );
  return parts.join('\n');
}

function normalizeProfile(raw) {
  return {
    current_seniority_level: String(raw.current_seniority_level ?? 'unclear').trim(),
    primary_roles: Array.isArray(raw.primary_roles) ? raw.primary_roles.map(String) : [],
    core_technical_skills: Array.isArray(raw.core_technical_skills)
      ? raw.core_technical_skills.map(String)
      : [],
    secondary_skills: Array.isArray(raw.secondary_skills) ? raw.secondary_skills.map(String) : [],
    evidence_of_experience: Array.isArray(raw.evidence_of_experience)
      ? raw.evidence_of_experience.map(String)
      : [],
    consistency_score: Math.min(100, Math.max(0, Number(raw.consistency_score) || 0)),
    strengths: Array.isArray(raw.strengths) ? raw.strengths.map(String) : [],
    red_flags: Array.isArray(raw.red_flags) ? raw.red_flags.map(String) : [],
    missing_information: Array.isArray(raw.missing_information)
      ? raw.missing_information.map(String)
      : [],
  };
}

const SYSTEM_PROMPT = `You are a professional profile analyst. Extract a structured profile from the CV and optional links (GitHub, LinkedIn, portfolio).

RULES:
- CV is the PRIMARY source of truth. Only infer from other links to support or weaken conclusions.
- Do NOT invent data. If something is not stated or evidenced, use "unclear" or list in missing_information.
- evidence_of_experience: only concrete facts (job titles, years, companies, projects, certs). No interpretations.
- strengths / red_flags: interpretations must be supported by evidence_of_experience.
- consistency_score (0-100): how aligned the profile is across sources; 0 if almost no usable data.

Tüm metin çıktılarını Türkçe ver: primary_roles, strengths, red_flags, missing_information ve diğer string alanları Türkçe yaz.

Output ONLY a single valid JSON object with exactly these keys (all required): current_seniority_level (string: intern|junior|mid|senior|lead|principal|executive|unclear), primary_roles (array of strings), core_technical_skills (array of strings), secondary_skills (array of strings), evidence_of_experience (array of strings), consistency_score (integer 0-100), strengths (array of strings), red_flags (array of strings), missing_information (array of strings). No markdown, no explanation outside the JSON.`;

async function extractProfile(ingestionData) {
  const userContent = buildUserMessage(ingestionData);
  const { text, error } = await complete(SYSTEM_PROMPT, userContent, 4096);
  if (error) return { success: false, error, profile: null };
  const parsed = parseJsonFromModel(text);
  if (!parsed)
    return { success: false, error: 'Invalid or incomplete JSON from model', profile: null };
  try {
    const profile = normalizeProfile(parsed);
    return { success: true, error: null, profile };
  } catch (e) {
    return { success: false, error: e.message || 'Invalid profile structure', profile: null };
  }
}

module.exports = { extractProfile, normalizeProfile, PROFILE_SCHEMA };

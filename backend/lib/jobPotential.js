/**
 * Job potential scoring: market readiness, profile clarity, skill depth, positioning.
 * Rule-based from profile only. Returns overall_job_potential_score (0-100) + short explanation.
 */

function scoreMarketReadiness(profile) {
  const roles = profile.primary_roles?.length ?? 0;
  const skills = profile.core_technical_skills?.length ?? 0;
  const evidence = profile.evidence_of_experience?.length ?? 0;
  const seniorityClear =
    profile.current_seniority_level && profile.current_seniority_level.toLowerCase() !== 'unclear';

  let s = 0;
  if (roles >= 1) s += 25;
  else if (roles === 0) s += 0;
  if (skills >= 6) s += 30;
  else if (skills >= 3) s += 25;
  else if (skills >= 1) s += 15;
  if (evidence >= 6) s += 30;
  else if (evidence >= 3) s += 25;
  else if (evidence >= 1) s += 15;
  if (seniorityClear) s += 20;
  return Math.min(100, s);
}

function scoreProfileClarity(profile) {
  const consistency = Math.max(0, Math.min(100, Number(profile.consistency_score) || 0));
  const missing = profile.missing_information?.length ?? 0;
  const redFlags = profile.red_flags?.length ?? 0;
  const penalty = Math.min(40, missing * 8 + redFlags * 6);
  return Math.max(0, Math.min(100, consistency - penalty));
}

function scoreSkillDepth(profile) {
  const core = profile.core_technical_skills?.length ?? 0;
  const secondary = profile.secondary_skills?.length ?? 0;
  const evidence = profile.evidence_of_experience?.length ?? 0;

  let s = 0;
  if (core >= 6) s += 50;
  else if (core >= 3) s += 35;
  else if (core >= 1) s += 20;
  if (secondary >= 4) s += 20;
  else if (secondary >= 1) s += 10;
  if (evidence >= 5) s += 30;
  else if (evidence >= 2) s += 15;
  return Math.min(100, s);
}

function scorePositioningStrength(profile) {
  const roles = profile.primary_roles?.length ?? 0;
  const strengths = profile.strengths?.length ?? 0;
  const redFlags = profile.red_flags?.length ?? 0;
  const seniorityClear =
    profile.current_seniority_level && profile.current_seniority_level.toLowerCase() !== 'unclear';

  let s = 0;
  if (roles >= 3) s += 50;
  else if (roles === 2) s += 40;
  else if (roles === 1) s += 25;
  if (strengths > redFlags) s += 25;
  else if (strengths === redFlags && strengths > 0) s += 15;
  else if (redFlags > 0) s += Math.max(0, 25 - redFlags * 5);
  if (seniorityClear) s += 25;
  return Math.min(100, s);
}

function buildExplanation(profile, overall, breakdown) {
  const parts = [];
  if (overall >= 70) {
    parts.push('Güçlü iş potansiyeli.');
  } else if (overall >= 50) {
    parts.push('Orta düzeyde iş potansiyeli.');
  } else {
    parts.push('Mevcut profille iş potansiyeli sınırlı.');
  }

  const low = [];
  const high = [];
  if (breakdown.market_readiness < 50) low.push('pazar hazırlığı');
  else if (breakdown.market_readiness >= 70) high.push('pazar hazırlığı');
  if (breakdown.profile_clarity < 50) low.push('profil netliği');
  else if (breakdown.profile_clarity >= 70) high.push('profil netliği');
  if (breakdown.skill_depth < 50) low.push('beceri derinliği');
  else if (breakdown.skill_depth >= 70) high.push('beceri derinliği');
  if (breakdown.positioning_strength < 50) low.push('konumlandırma');
  else if (breakdown.positioning_strength >= 70) high.push('konumlandırma');

  if (high.length) parts.push('Güçlü yönler: ' + high.join(', ') + '.');
  if (low.length) parts.push('Eksikler: ' + low.join(', ') + '.');

  const missing = profile.missing_information?.length ?? 0;
  const redFlags = profile.red_flags?.length ?? 0;
  if (missing > 0 || redFlags > 0) {
    parts.push('Eksik bilgileri ve endişeleri gidermek puana olumlu yansır.');
  }

  return parts.join(' ');
}

function scoreJobPotential(profile) {
  if (!profile || typeof profile !== 'object') {
    return {
      overall_job_potential_score: 0,
      explanation: 'Profil sağlanmadı.',
      breakdown: null,
    };
  }

  const market_readiness = scoreMarketReadiness(profile);
  const profile_clarity = scoreProfileClarity(profile);
  const skill_depth = scoreSkillDepth(profile);
  const positioning_strength = scorePositioningStrength(profile);

  const breakdown = {
    market_readiness: Math.round(market_readiness),
    profile_clarity: Math.round(profile_clarity),
    skill_depth: Math.round(skill_depth),
    positioning_strength: Math.round(positioning_strength),
  };

  const overall = Math.round(
    breakdown.market_readiness * 0.25 +
      breakdown.profile_clarity * 0.25 +
      breakdown.skill_depth * 0.25 +
      breakdown.positioning_strength * 0.25
  );
  const overall_job_potential_score = Math.max(0, Math.min(100, overall));
  const explanation = buildExplanation(profile, overall_job_potential_score, breakdown);

  return {
    overall_job_potential_score,
    explanation,
    breakdown,
  };
}

module.exports = {
  scoreJobPotential,
  scoreMarketReadiness,
  scoreProfileClarity,
  scoreSkillDepth,
  scorePositioningStrength,
};

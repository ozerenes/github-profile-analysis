/**
 * Final report assembly: merge profile, score, role fit, roadmap into a clean report.
 * Sections: Professional Summary, Job Potential Analysis, Best Roles to Target,
 * Key Gaps, Learning Roadmap, Final Recommendations.
 */

function buildProfessionalSummary(profile) {
  if (!profile) return 'Profil verisi yok.';
  const seniority = profile.current_seniority_level || 'belirsiz';
  const roles = profile.primary_roles?.length ? profile.primary_roles.join(', ') : 'belirtilmemiş';
  const skills = profile.core_technical_skills?.length
    ? profile.core_technical_skills.join(', ')
    : 'belirtilmemiş';
  const strengths = profile.strengths?.length ? profile.strengths.join('; ') : 'belirlenmedi';
  const evidenceCount = profile.evidence_of_experience?.length ?? 0;

  const parts = [];
  parts.push(`Profil ${seniority} düzeyinde, odak alanları: ${roles}.`);
  parts.push(`Temel teknik beceriler: ${skills}.`);
  if (evidenceCount > 0) parts.push(`Deneyim kanıtı: ${evidenceCount} madde.`);
  parts.push(`Güçlü yönler: ${strengths}.`);
  return parts.join(' ');
}

function buildKeyGaps(profile, roleFit) {
  const gaps = [];
  (profile?.red_flags || []).forEach((r) =>
    gaps.push({ type: 'red_flag', title: 'Endişe', detail: r })
  );
  (profile?.missing_information || []).forEach((m) =>
    gaps.push({ type: 'missing', title: 'Eksik bilgi', detail: m })
  );
  (roleFit?.roles_to_avoid || []).forEach((r) =>
    gaps.push({ type: 'role_to_avoid', title: `Şimdilik kaçının: ${r.role}`, detail: r.reason })
  );
  return gaps;
}

function buildFinalRecommendations(profile, jobPotential, roleFit, roadmap) {
  const parts = [];
  if (roleFit?.best_fit_roles?.length) {
    const roles = roleFit.best_fit_roles.map((r) => r.role).join(', ');
    parts.push(`Başvurularınızı şu rollere odaklayın: ${roles}.`);
  }
  const score = jobPotential?.overall_job_potential_score;
  if (score != null && score < 70) {
    parts.push(
      'İş potansiyelini artırmak için profil netliğini ve kanıtları güçlendirin (Ana Eksikler ve Öğrenme Yol Haritasına bakın).'
    );
  }
  const gapCount =
    (profile?.red_flags?.length ?? 0) +
    (profile?.missing_information?.length ?? 0) +
    (roleFit?.roles_to_avoid?.length ?? 0);
  if (gapCount > 0) {
    parts.push('Daha kıdemli veya geniş rollere yönelmeden önce yukarıdaki eksikleri giderin.');
  }
  if (roadmap?.short_term?.length) {
    parts.push(
      'Önce kısa vadeli öğrenme maddeleriyle başlayın; ardından orta ve uzun vadeli yol haritasını takip edin.'
    );
  }
  if (parts.length === 0)
    parts.push(
      'Sonraki adımları planlamak için İş Potansiyeli Analizi ve Öğrenme Yol Haritasını kullanın.'
    );
  return parts.join(' ');
}

function buildReport(profile, jobPotential, roleFit, roadmap) {
  const report = {
    professional_summary: buildProfessionalSummary(profile),
    job_potential_analysis: {
      overall_job_potential_score: jobPotential?.overall_job_potential_score ?? null,
      explanation: jobPotential?.explanation ?? null,
      breakdown: jobPotential?.breakdown ?? null,
    },
    best_roles_to_target: Array.isArray(roleFit?.best_fit_roles) ? roleFit.best_fit_roles : [],
    key_gaps: buildKeyGaps(profile, roleFit),
    learning_roadmap: {
      short_term: Array.isArray(roadmap?.short_term) ? roadmap.short_term : [],
      mid_term: Array.isArray(roadmap?.mid_term) ? roadmap.mid_term : [],
      long_term: Array.isArray(roadmap?.long_term) ? roadmap.long_term : [],
    },
    final_recommendations: buildFinalRecommendations(profile, jobPotential, roleFit, roadmap),
  };
  return report;
}

module.exports = { buildReport, buildProfessionalSummary, buildKeyGaps, buildFinalRecommendations };

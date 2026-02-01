/**
 * Unit tests for report: buildReport, buildProfessionalSummary, buildKeyGaps, buildFinalRecommendations.
 * Run: node --test server/lib/report.test.js
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const {
  buildReport,
  buildProfessionalSummary,
  buildKeyGaps,
  buildFinalRecommendations,
} = require('./report');

describe('report', () => {
  describe('buildProfessionalSummary', () => {
    it('returns fallback when profile is null', () => {
      assert.strictEqual(buildProfessionalSummary(null), 'Profil verisi yok.');
    });

    it('includes seniority, roles, skills, strengths', () => {
      const profile = {
        current_seniority_level: 'senior',
        primary_roles: ['Backend'],
        core_technical_skills: ['Node', 'Postgres'],
        strengths: ['Ownership'],
        evidence_of_experience: ['5y at X'],
      };
      const summary = buildProfessionalSummary(profile);
      assert.ok(summary.includes('senior'));
      assert.ok(summary.includes('Backend'));
      assert.ok(summary.includes('Node'));
      assert.ok(summary.includes('Ownership'));
      assert.ok(summary.includes('1 madde') || summary.includes('madde'));
    });
  });

  describe('buildKeyGaps', () => {
    it('returns empty array when no profile or roleFit gaps', () => {
      assert.deepStrictEqual(buildKeyGaps(null, null), []);
      assert.deepStrictEqual(buildKeyGaps({}, {}), []);
    });

    it('includes red_flags and missing_information from profile', () => {
      const profile = { red_flags: ['Gap A'], missing_information: ['Missing B'] };
      const gaps = buildKeyGaps(profile, null);
      assert.strictEqual(gaps.length, 2);
      assert.strictEqual(gaps[0].type, 'red_flag');
      assert.strictEqual(gaps[0].title, 'Endişe');
      assert.strictEqual(gaps[0].detail, 'Gap A');
      assert.strictEqual(gaps[1].type, 'missing');
      assert.strictEqual(gaps[1].detail, 'Missing B');
    });

    it('includes roles_to_avoid from roleFit', () => {
      const roleFit = { roles_to_avoid: [{ role: 'CTO', reason: 'Too senior' }] };
      const gaps = buildKeyGaps(null, roleFit);
      assert.strictEqual(gaps.length, 1);
      assert.ok(gaps[0].title.includes('CTO'));
      assert.strictEqual(gaps[0].detail, 'Too senior');
    });
  });

  describe('buildFinalRecommendations', () => {
    it('returns fallback when nothing to recommend', () => {
      const text = buildFinalRecommendations(null, null, null, null);
      assert.ok(text.length > 0);
      assert.ok(text.includes('İş Potansiyeli') || text.includes('Yol Haritası'));
    });

    it('includes best_fit_roles when present', () => {
      const roleFit = { best_fit_roles: [{ role: 'Engineer', reason: 'Fit' }] };
      const text = buildFinalRecommendations(null, null, roleFit, null);
      assert.ok(text.includes('Engineer'));
    });

    it('includes low score advice when score < 70', () => {
      const jobPotential = { overall_job_potential_score: 50 };
      const text = buildFinalRecommendations(null, jobPotential, null, null);
      assert.ok(text.includes('potansiyel') || text.includes('güçlendirin'));
    });
  });

  describe('buildReport', () => {
    it('returns object with all report sections', () => {
      const profile = {
        current_seniority_level: 'mid',
        primary_roles: ['Dev'],
        core_technical_skills: ['JS'],
        strengths: [],
        evidence_of_experience: [],
      };
      const jobPotential = { overall_job_potential_score: 60, explanation: 'Ok', breakdown: {} };
      const roleFit = { best_fit_roles: [], roles_to_avoid: [] };
      const roadmap = { short_term: [], mid_term: [], long_term: [] };

      const report = buildReport(profile, jobPotential, roleFit, roadmap);

      assert.ok(report.professional_summary.length > 0);
      assert.strictEqual(report.job_potential_analysis.overall_job_potential_score, 60);
      assert.strictEqual(report.job_potential_analysis.explanation, 'Ok');
      assert.deepStrictEqual(report.best_roles_to_target, []);
      assert.ok(Array.isArray(report.key_gaps));
      assert.ok(Array.isArray(report.learning_roadmap.short_term));
      assert.ok(Array.isArray(report.learning_roadmap.mid_term));
      assert.ok(Array.isArray(report.learning_roadmap.long_term));
      assert.ok(report.final_recommendations.length > 0);
    });

    it('handles null jobPotential, roleFit, roadmap', () => {
      const profile = {
        current_seniority_level: 'junior',
        primary_roles: [],
        core_technical_skills: [],
        strengths: [],
        evidence_of_experience: [],
      };
      const report = buildReport(profile, null, null, null);
      assert.strictEqual(report.job_potential_analysis.overall_job_potential_score, null);
      assert.deepStrictEqual(report.best_roles_to_target, []);
      assert.deepStrictEqual(report.learning_roadmap.short_term, []);
    });
  });
});

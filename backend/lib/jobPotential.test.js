/**
 * Unit tests for jobPotential: scoring and explanation.
 * Run: node --test server/lib/jobPotential.test.js
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const {
  scoreJobPotential,
  scoreMarketReadiness,
  scoreProfileClarity,
  scoreSkillDepth,
  scorePositioningStrength,
} = require('./jobPotential');

describe('jobPotential', () => {
  describe('scoreJobPotential', () => {
    it('returns zero score and message when profile is missing', () => {
      const result = scoreJobPotential(null);
      assert.strictEqual(result.overall_job_potential_score, 0);
      assert.strictEqual(result.explanation, 'Profil sağlanmadı.');
      assert.strictEqual(result.breakdown, null);
    });

    it('returns zero when profile is not an object', () => {
      const result = scoreJobPotential(42);
      assert.strictEqual(result.overall_job_potential_score, 0);
    });

    it('returns breakdown with all four dimensions', () => {
      const profile = {
        current_seniority_level: 'senior',
        primary_roles: ['Engineer'],
        core_technical_skills: ['JS', 'Node', 'React'],
        secondary_skills: ['SQL'],
        evidence_of_experience: ['5y at X', 'Led Y'],
        consistency_score: 80,
        strengths: ['Communication'],
        red_flags: [],
        missing_information: [],
      };
      const result = scoreJobPotential(profile);
      assert.ok(typeof result.overall_job_potential_score === 'number');
      assert.ok(
        result.overall_job_potential_score >= 0 && result.overall_job_potential_score <= 100
      );
      assert.ok(typeof result.explanation === 'string' && result.explanation.length > 0);
      assert.deepStrictEqual(Object.keys(result.breakdown).sort(), [
        'market_readiness',
        'positioning_strength',
        'profile_clarity',
        'skill_depth',
      ]);
    });
  });

  describe('scoreMarketReadiness', () => {
    it('scores higher with more roles, skills, evidence, and clear seniority', () => {
      const empty = {
        primary_roles: [],
        core_technical_skills: [],
        evidence_of_experience: [],
        current_seniority_level: 'unclear',
      };
      const full = {
        primary_roles: ['A', 'B'],
        core_technical_skills: ['a', 'b', 'c', 'd', 'e', 'f'],
        evidence_of_experience: ['1', '2', '3', '4', '5', '6'],
        current_seniority_level: 'senior',
      };
      assert.ok(scoreMarketReadiness(full) > scoreMarketReadiness(empty));
    });

    it('returns value between 0 and 100', () => {
      const profile = {
        primary_roles: ['X'],
        core_technical_skills: ['a'],
        evidence_of_experience: [],
        current_seniority_level: 'mid',
      };
      const s = scoreMarketReadiness(profile);
      assert.ok(s >= 0 && s <= 100);
    });
  });

  describe('scoreProfileClarity', () => {
    it('penalizes missing_information and red_flags', () => {
      const clean = { consistency_score: 80, missing_information: [], red_flags: [] };
      const noisy = { consistency_score: 80, missing_information: ['X'], red_flags: ['Y'] };
      assert.ok(scoreProfileClarity(clean) > scoreProfileClarity(noisy));
    });

    it('caps result between 0 and 100', () => {
      const profile = { consistency_score: 200, missing_information: [], red_flags: [] };
      assert.strictEqual(scoreProfileClarity(profile), 100);
    });
  });

  describe('scoreSkillDepth', () => {
    it('scores higher with more core and secondary skills and evidence', () => {
      const low = {
        core_technical_skills: ['a'],
        secondary_skills: [],
        evidence_of_experience: [],
      };
      const high = {
        core_technical_skills: ['a', 'b', 'c', 'd', 'e', 'f'],
        secondary_skills: ['x', 'y', 'z', 'w'],
        evidence_of_experience: ['1', '2', '3', '4', '5'],
      };
      assert.ok(scoreSkillDepth(high) > scoreSkillDepth(low));
    });
  });

  describe('scorePositioningStrength', () => {
    it('scores higher with more roles and clear seniority', () => {
      const weak = {
        primary_roles: [],
        strengths: [],
        red_flags: ['x'],
        current_seniority_level: 'unclear',
      };
      const strong = {
        primary_roles: ['A', 'B', 'C'],
        strengths: ['S'],
        red_flags: [],
        current_seniority_level: 'lead',
      };
      assert.ok(scorePositioningStrength(strong) > scorePositioningStrength(weak));
    });
  });
});

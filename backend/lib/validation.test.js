/**
 * Unit tests for validation: PDF and URL inputs.
 * Run: node --test server/lib/validation.test.js
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { validatePdf, validateInputs, isPdfBuffer, MAX_PDF_BYTES } = require('./validation');

const PDF_MAGIC = Buffer.from('%PDF', 'utf8');

describe('validation', () => {
  describe('isPdfBuffer', () => {
    it('returns true for buffer starting with %PDF', () => {
      const buf = Buffer.concat([PDF_MAGIC, Buffer.alloc(100, 0)]);
      assert.strictEqual(isPdfBuffer(buf), true);
    });

    it('returns false for empty or short buffer', () => {
      assert.strictEqual(isPdfBuffer(Buffer.alloc(0)), false);
      assert.strictEqual(isPdfBuffer(Buffer.alloc(2)), false);
    });

    it('returns false for non-PDF magic', () => {
      assert.strictEqual(isPdfBuffer(Buffer.from('xxxx')), false);
    });

    it('returns false for non-buffer', () => {
      assert.strictEqual(isPdfBuffer(null), false);
      assert.strictEqual(isPdfBuffer('string'), false);
    });
  });

  describe('validatePdf', () => {
    it('returns error when buffer is missing or empty', () => {
      assert.deepStrictEqual(validatePdf(null), { valid: false, error: 'CV is required' });
      assert.deepStrictEqual(validatePdf(Buffer.alloc(0)), {
        valid: false,
        error: 'CV is required',
      });
    });

    it('returns error when buffer is not a PDF', () => {
      const result = validatePdf(Buffer.from('not a pdf'));
      assert.strictEqual(result.valid, false);
      assert.strictEqual(result.error, 'File must be a valid PDF');
    });

    it('returns valid for small valid PDF buffer', () => {
      const buf = Buffer.concat([PDF_MAGIC, Buffer.alloc(100)]);
      const result = validatePdf(buf);
      assert.strictEqual(result.valid, true);
    });

    it('returns error when buffer exceeds MAX_PDF_BYTES', () => {
      const buf = Buffer.concat([PDF_MAGIC, Buffer.alloc(MAX_PDF_BYTES)]);
      const result = validatePdf(buf);
      assert.strictEqual(result.valid, false);
      assert.ok(result.error.includes('under'));
    });
  });

  describe('validateInputs', () => {
    const validPdf = Buffer.concat([PDF_MAGIC, Buffer.alloc(200)]);

    it('returns error when PDF is invalid', () => {
      const result = validateInputs(null, {});
      assert.strictEqual(result.valid, false);
      assert.strictEqual(result.error, 'CV is required');
    });

    it('returns valid and null urls when no URLs provided', () => {
      const result = validateInputs(validPdf, {});
      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.urls.github, null);
      assert.strictEqual(result.urls.linkedin, null);
      assert.strictEqual(result.urls.portfolio, null);
    });

    it('accepts valid GitHub URL', () => {
      const result = validateInputs(validPdf, { githubUrl: 'https://github.com/username' });
      assert.strictEqual(result.valid, true);
      assert.ok(result.urls.github.includes('github.com'));
    });

    it('rejects invalid GitHub URL', () => {
      const result = validateInputs(validPdf, { githubUrl: 'https://github.com' });
      assert.strictEqual(result.valid, false);
      assert.ok(result.error.includes('GitHub'));
    });

    it('accepts valid LinkedIn profile URL', () => {
      const result = validateInputs(validPdf, { linkedinUrl: 'https://linkedin.com/in/johndoe' });
      assert.strictEqual(result.valid, true);
      assert.ok(result.urls.linkedin.includes('linkedin.com'));
    });

    it('rejects invalid LinkedIn URL', () => {
      const result = validateInputs(validPdf, { linkedinUrl: 'https://linkedin.com/company/foo' });
      assert.strictEqual(result.valid, false);
      assert.ok(result.error.includes('LinkedIn'));
    });

    it('accepts valid portfolio URL', () => {
      const result = validateInputs(validPdf, { portfolioUrl: 'https://example.com' });
      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.urls.portfolio, 'https://example.com');
    });

    it('normalizes URL without protocol to https', () => {
      const result = validateInputs(validPdf, { githubUrl: 'github.com/foo' });
      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.urls.github, 'https://github.com/foo');
    });
  });
});

/**
 * Input validation for ingestion.
 * - CV: required PDF, size/type checks.
 * - URLs: optional, well-formed (GitHub, LinkedIn, portfolio).
 */

const { MAX_PDF_BYTES } = require('../config');
const PDF_MAGIC = Buffer.from('%PDF', 'utf8');

const GITHUB_REGEX = /^https?:\/\/(www\.)?github\.com\/[^/?#]+\/?$/i;

function isValidLinkedInProfileUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const u = url.trim();
  if (!u) return false;
  try {
    const parsed = new URL(u.startsWith('http') ? u : `https://${u}`);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    if (host !== 'linkedin.com') return false;
    const match = parsed.pathname.match(/^\/in\/([^/]+)\/?$/i);
    return Boolean(match && match[1].length > 0);
  } catch {
    return false;
  }
}

function isPdfBuffer(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 4) return false;
  return buffer.subarray(0, 4).equals(PDF_MAGIC);
}

function validatePdf(buffer) {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'CV is required' };
  }
  if (!isPdfBuffer(buffer)) {
    return { valid: false, error: 'File must be a valid PDF' };
  }
  if (buffer.length > MAX_PDF_BYTES) {
    return { valid: false, error: `PDF must be under ${MAX_PDF_BYTES / 1024 / 1024}MB` };
  }
  return { valid: true };
}

function normalizeUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

function validateGitHubUrl(url) {
  const u = normalizeUrl(url);
  if (!u) return { valid: false, value: null };
  return GITHUB_REGEX.test(u) ? { valid: true, value: u } : { valid: false, value: u };
}

function validateLinkedInUrl(url) {
  const u = normalizeUrl(url);
  if (!u) return { valid: false, value: null };
  return isValidLinkedInProfileUrl(u) ? { valid: true, value: u } : { valid: false, value: u };
}

function validatePortfolioUrl(url) {
  const u = normalizeUrl(url);
  if (!u) return { valid: false, value: null };
  try {
    const parsed = new URL(u);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
      ? { valid: true, value: u }
      : { valid: false, value: u };
  } catch {
    return { valid: false, value: u };
  }
}

function validateInputs(pdfBuffer, { githubUrl, linkedinUrl, portfolioUrl } = {}) {
  const pdfResult = validatePdf(pdfBuffer);
  if (!pdfResult.valid) {
    return { valid: false, error: pdfResult.error };
  }

  const errors = [];
  const gh = validateGitHubUrl(githubUrl);
  if (githubUrl && !gh.valid) errors.push('Invalid GitHub URL');
  const li = validateLinkedInUrl(linkedinUrl);
  if (linkedinUrl && !li.valid) errors.push('Invalid LinkedIn URL');
  const port = validatePortfolioUrl(portfolioUrl);
  if (portfolioUrl && !port.valid) errors.push('Invalid portfolio URL');

  if (errors.length > 0) {
    return { valid: false, error: errors.join('; ') };
  }

  return {
    valid: true,
    urls: {
      github: gh.valid ? gh.value : null,
      linkedin: li.valid ? li.value : null,
      portfolio: port.valid ? port.value : null,
    },
  };
}

module.exports = {
  validatePdf,
  validateInputs,
  isPdfBuffer,
  MAX_PDF_BYTES,
};

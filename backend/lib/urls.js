/**
 * Fetch public profile pages and return extractable text (or "unavailable").
 * No auth; best-effort. Timeouts and errors yield "unavailable".
 */

const FETCH_TIMEOUT_MS = 8000;
const MAX_TEXT_LENGTH = 8000;

async function fetchUrl(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'ProfessionalPresenceAnalyzer/1.0 (compatible; analysis bot)',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    });
    clearTimeout(timeout);

    if (!res.ok) return { ok: false, text: null, status: res.status };
    const html = await res.text();
    const text = stripHtmlToText(html);
    return { ok: true, text: text.slice(0, MAX_TEXT_LENGTH), status: res.status };
  } catch (err) {
    clearTimeout(timeout);
    const isAbort = err.name === 'AbortError';
    return { ok: false, text: null, error: isAbort ? 'timeout' : err.message };
  }
}

function stripHtmlToText(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const UNAVAILABLE = 'unavailable';

async function fetchGitHub(url) {
  if (!url) return UNAVAILABLE;
  const { ok, text } = await fetchUrl(url);
  if (!ok || !text) return UNAVAILABLE;
  return text;
}

async function fetchLinkedIn(url) {
  if (!url) return UNAVAILABLE;
  const { ok, text } = await fetchUrl(url);
  if (!ok || !text) return UNAVAILABLE;
  if (/sign in|log in|login/i.test(text) && text.length < 500) return UNAVAILABLE;
  return text;
}

async function fetchPortfolio(url) {
  if (!url) return UNAVAILABLE;
  const { ok, text } = await fetchUrl(url);
  if (!ok || !text) return UNAVAILABLE;
  return text;
}

async function fetchAllUrls(urls) {
  const [github, linkedin, portfolio] = await Promise.all([
    fetchGitHub(urls.github),
    fetchLinkedIn(urls.linkedin),
    fetchPortfolio(urls.portfolio),
  ]);
  return { github, linkedin, portfolio };
}

module.exports = { fetchAllUrls, fetchUrl, UNAVAILABLE };

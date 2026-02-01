/**
 * API client: calls backend /api/analyze (multipart) and returns { report }.
 * In dev, Vite proxies /api to http://localhost:3001.
 * In production, set VITE_API_URL to backend base URL (e.g. https://api.example.com).
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

export async function runAnalysis({ file, githubUrl, linkedinUrl, portfolioUrl }) {
  const formData = new FormData();
  formData.append('cv', file);
  if (githubUrl?.trim()) formData.append('githubUrl', githubUrl.trim());
  if (linkedinUrl?.trim()) formData.append('linkedinUrl', linkedinUrl.trim());
  if (portfolioUrl?.trim()) formData.append('portfolioUrl', portfolioUrl.trim());

  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    body: formData,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || res.statusText || 'Request failed');
  }
  return body;
}

export async function healthCheck() {
  const res = await fetch(`${API_BASE}/health`);
  const data = await res.json().catch(() => ({}));
  return res.ok && data.status === 'ok';
}

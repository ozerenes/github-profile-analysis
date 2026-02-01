/**
 * LLM abstraction: OpenAI or Gemini (free tier).
 * Set LLM_PROVIDER=gemini and GEMINI_API_KEY to use Gemini; else OPENAI_API_KEY for OpenAI.
 */

const OpenAI = require('openai').default;

function useGemini() {
  const p = (process.env.LLM_PROVIDER || '').toLowerCase();
  return p === 'gemini' || process.env.USE_GEMINI === 'true';
}

async function completeWithOpenAI(system, user, maxTokens = 4096) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { text: null, error: 'OPENAI_API_KEY is not set' };
  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    response_format: { type: 'json_object' },
    max_tokens: maxTokens,
  });
  const raw = response.choices?.[0]?.message?.content;
  if (!raw || typeof raw !== 'string') return { text: null, error: 'No response content' };
  return { text: raw.trim(), error: null };
}

async function completeWithGemini(system, user, maxTokens = 4096) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: system,
    generationConfig: {
      responseMimeType: 'application/json',
      maxOutputTokens: maxTokens,
      temperature: 0.3,
    },
  });
  const result = await model.generateContent(user);
  const response = result.response;
  if (!response) return { text: null, error: 'No response from Gemini' };
  let text;
  try {
    text = response.text ? response.text() : null;
  } catch (e) {
    return { text: null, error: e.message || 'No text in response' };
  }
  if (!text || typeof text !== 'string') return { text: null, error: 'No response content' };
  return { text: text.trim(), error: null };
}

async function complete(system, user, maxTokens = 4096) {
  try {
    if (useGemini()) {
      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      if (!apiKey)
        return { text: null, error: 'GEMINI_API_KEY or GOOGLE_API_KEY is not set (use Gemini)' };
      return await completeWithGemini(system, user, maxTokens);
    }
    return await completeWithOpenAI(system, user, maxTokens);
  } catch (err) {
    const msg = err.message || 'LLM request failed';
    if (err.status === 401) return { text: null, error: 'Invalid API key' };
    if (err.status === 429) return { text: null, error: 'Rate limit exceeded' };
    return { text: null, error: msg };
  }
}

/**
 * Parse JSON from model output. Strips markdown, extracts {...}, then parse with optional jsonrepair.
 */
function parseJsonFromModel(text) {
  if (!text || typeof text !== 'string') return null;
  let raw = text.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
  const first = raw.indexOf('{');
  if (first !== -1) {
    let depth = 0;
    let end = -1;
    for (let i = first; i < raw.length; i++) {
      if (raw[i] === '{') depth++;
      else if (raw[i] === '}') {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    if (end !== -1) raw = raw.slice(first, end + 1);
  }
  try {
    return JSON.parse(raw);
  } catch {
    raw = raw.replace(/,(\s*[}\]])/g, '$1');
    try {
      return JSON.parse(raw);
    } catch {
      try {
        const { jsonrepair } = require('jsonrepair');
        return JSON.parse(jsonrepair(raw));
      } catch {
        return null;
      }
    }
  }
}

module.exports = { complete, useGemini, parseJsonFromModel };

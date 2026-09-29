// ============================================================================
// NAVORA AI Career Advisor  OpenRouter backend
// ----------------------------------------------------------------------------
// A tiny, dependency-free Node HTTP server (Node >= 18) that:
//    POST /api/career-advice    structured AI career advice from the student's
//                                 completed questionnaire answers
//    POST /api/advisor/chat     free-form advisor chat (plain-text replies)
//    GET  /api/health, /health  liveness probe
//
// The browser NEVER talks to the AI provider directly. It only ever calls this
// server, the only process that reads OPENROUTER_*and holds the API key.
//
// Env vars (loaded from .env at the project root):
//   OPENROUTER_API_KEY     (required  your OpenRouter API key)
//   OPENROUTER_BASE_URL    (default https://openrouter.ai/api/v1)
//   OPENROUTER_SITE_URL    (default https://navora.in)
//   OPENROUTER_APP_NAME    (default NAVORA)
//   AI_PRIMARY_MODEL       (default meta-llama/llama-3-70b-instruct)
//   AI_FALLBACK_MODELS     (comma-separated fallback models)
//   MAX_MODEL_ATTEMPTS     (default 3)
//   OPENROUTER_TIMEOUT_MS  (default 30000)
//   AI_RATE_LIMIT_PER_MIN  (default 30)
//   PORT                   (default 3001)
// ============================================================================


import http from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ADVICE_SYSTEM_PROMPT, buildChatSystemPrompt } from './ai/systemPrompt.mjs';
import { buildAdviceUserPrompt, serializeChatContext, buildChatMessages } from './ai/contextBuilder.mjs';
import { isLeakyResponse, RETRY_CORRECTION_INSTRUCTION, SAFE_FALLBACK_MESSAGE, buildSafeFallback } from './ai/responseValidator.mjs';
import { HYDERABAD_INSTITUTIONS, filterInstitutions } from '../src/data/hyderabadInstitutions.js';
import { getUserEntitlement, planFeatures } from './entitlement.mjs';
import {
  bearerToken, verifySupabaseUser, getSubscriptionRow, incrementAiUsage,
  getAiUsageCount, isAdminUser, isServiceRoleConfigured, upsertSubscriptionRow,
  findPaymentByProviderId, insertPaymentRow, updatePaymentStatus, activateProForPayment,
} from './supabaseAdmin.mjs';
import {
  verifyRazorpaySignature, mapRazorpayToNavora, detectProvider,
  createRazorpayOrder, verifyPaymentSignature, fetchRazorpayPayment,
  isRazorpayConfigured, razorpayPublicKey, PRO_AMOUNT_PAISE, PRO_CURRENCY,
} from './payments.mjs';
import { buildRoadmap } from './roadmap.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

//  Best-effort local .env loading (so OPENROUTER_* are read even when the
// server is started without --env-file). Runs before config defaults resolve.

try {
  const envPath = join(ROOT, '.env');
  const raw = readFileSync(envPath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
} catch {
  // No .env present  rely on process.env / defaults.


}

//  Configuration -----------------------------------------------------------
// The browser NEVER talks to OpenRouter directly; only this server process
// holds the API key (read from the environment / .env at the project root).
const OPENROUTER_API_KEY = (process.env.OPENROUTER_API_KEY || '').trim();
const OPENROUTER_BASE_URL = (process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/+$/, '');
const OPENROUTER_SITE_URL = (process.env.OPENROUTER_SITE_URL || 'https://navora.in').replace(/\/+$/, '');
const OPENROUTER_APP_NAME = (process.env.OPENROUTER_APP_NAME || 'NAVORA').trim();
const PORT = Number(process.env.PORT) || 3001;
const MAX_BODY_BYTES = 1024 * 512; // 512 KB

// Centralised model roster. The primary model is tried first; on transient
// provider failures (HTTP 429 / 5xx / timeout / network) the request is
// retried against each fallback in turn, so a single rate-limited or flaky
// provider never breaks the AI Advisor. OPENROUTER_MODEL is still honoured
// for backwards compatibility and is treated as the primary model.
const DEFAULT_PRIMARY_MODEL = 'nvidia/nemotron-3-super-120b-a12b:free';
const AI_PRIMARY_MODEL = (process.env.AI_PRIMARY_MODEL || process.env.OPENROUTER_MODEL || DEFAULT_PRIMARY_MODEL).trim();
const DEFAULT_FALLBACK_MODELS = [
  'google/gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'openrouter/free',
];
const AI_FALLBACK_MODELS = (process.env.AI_FALLBACK_MODELS || DEFAULT_FALLBACK_MODELS.join(','))
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// Maximum number of distinct models to attempt before giving up entirely.
const MAX_MODEL_ATTEMPTS = Math.max(1, Number(process.env.MAX_MODEL_ATTEMPTS) || 3);

// De-duplicate (primary first) while preserving order, then cap to the limit.
const AI_MODELS = Array.from(new Set([AI_PRIMARY_MODEL, ...AI_FALLBACK_MODELS])).slice(0, MAX_MODEL_ATTEMPTS);

// Per-request timeout (ms). A single model gets this long before it is treated
// as a temporary failure and we move on to the next model.
const OPENROUTER_TIMEOUT_MS = Math.max(1000, Number(process.env.OPENROUTER_TIMEOUT_MS) || 30000);

// In-memory per-IP rate limit for the AI endpoints (requests per minute).
const AI_RATE_LIMIT_PER_MIN = Number(process.env.AI_RATE_LIMIT_PER_MIN) || 30;

// CORS allowlist (no wildcard for authenticated APIs). Comma-separated env.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function corsOrigin(req) {
  const origin = String(req.headers?.origin || '').trim();
  if (origin && ALLOWED_ORIGINS.includes(origin)) return origin;
  // Same-origin / non-browser (no Origin header): no CORS header needed.
  return null;
}

function setSecurityHeaders(res, req) {
  const origin = corsOrigin(req);
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-Frame-Options', 'DENY');
  // HSTS only makes sense over HTTPS; harmless to send, proxies strip if needed.
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
}

// Hard token cap used ONLY as a safety net for the free-form advisor chat.
// Words are not tokens, so the chat system prompt is the primary length
// control; this just stops a reply from running away into a long essay.
const CHAT_MAX_TOKENS = Number(process.env.CHAT_MAX_TOKENS) || 160;

function missingApiKey() {
  return !OPENROUTER_API_KEY && !process.env.GEMINI_API_KEY;
}

//  Lightweight server-side logging (never logs secrets or student PII) -------
const log = {
  info: (...a) => console.log('[AI]', ...a),
  warn: (...a) => console.warn('[AI]', ...a),
  err: (...a) => console.error('[AI]', ...a),
};

//  Small helpers ------------------------------------------------------------
function isRetryableHttpStatus(status) {
  // 429 (rate limit), 408/529 (transient) and 5xx are worth retrying.
  return status === 429 || status === 408 || status === 529 || (status >= 500 && status < 600);
}

function parseRetryAfter(header) {
  if (!header) return null;
  const trimmed = String(header).trim();
  const asSeconds = Number(trimmed);
  if (!Number.isNaN(asSeconds) && asSeconds >= 0) return Math.min(asSeconds, 60) * 1000; // seconds -> ms, capped at 60s
  const asDate = Date.parse(trimmed);
  if (!Number.isNaN(asDate)) {
    const ms = asDate - Date.now();
    return ms > 0 ? Math.min(ms, 60000) : 0;
  }
  return null;
}

function jitter(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//  In-memory per-IP rate limiter (fixed window) -----------------------------
const _rateLimitStore = new Map();
function rateLimitClient(ip) {
  const now = Date.now();
  const entry = _rateLimitStore.get(ip);
  if (!entry || now >= entry.resetAt) {
    const fresh = { count: 1, resetAt: now + 60000 };
    _rateLimitStore.set(ip, fresh);
    return { limited: false };
  }
  entry.count += 1;
  if (entry.count > AI_RATE_LIMIT_PER_MIN) {
    return { limited: true, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { limited: false };
}

// ADVICE_SYSTEM_PROMPT, buildAdviceUserPrompt, PROFILE_LABELS and fmtAnswerValue
// now live in server/ai/ — single source of truth via NAVORA_AI_RULES.md
// Aliased here for backwards-compat within this file where needed:
function buildUserPrompt(body) { return buildAdviceUserPrompt(body); }

//  Helpers ------------------------------------------------------------------
function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  // Security headers are applied by the caller (handleApiRequest) before routing;
  // keep cache-busting here for all API payloads.
  if (!res.getHeader('X-Content-Type-Options')) res.setHeader('X-Content-Type-Options', 'nosniff');
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {});
      } catch {
        reject(Object.assign(new Error('Invalid JSON body'), { code: 'INVALID_JSON' }));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Single attempt against OpenRouter for ONE model, with an AbortController
 * timeout and the OpenRouter-recommended attribution headers
 * (HTTP-Referer / X-Title). Resolves with { content, model }.
 *
 * Rejects with a typed Error whose `.code` is one of:
 *   HTTP_<status>   provider returned non-2xx (401, 402, 429, 5xx...)
 *   TIMEOUT         request exceeded OPENROUTER_TIMEOUT_MS
 *   NETWORK_ERROR   fetch threw (DNS / connection refused / ECONNRESET...)
 *   EMPTY_RESPONSE  provider returned no usable content
 * Each error also carries `.status` (HTTP-ish), `.retryable` (bool) and
 * `.retryAfter` (ms, when the provider supplied a Retry-After header).
 */
async function callOpenRouterOnce(model, messages, opts = {}) {
  if (!OPENROUTER_API_KEY && process.env.GEMINI_API_KEY) {
    try {
      // Specifier is held in a variable on purpose: a *literal* import('@google/genai')
      // makes esbuild (used by Vite to bundle vite.config.ts -> server/server.mjs)
      // try to resolve the package at startup. @google/genai@2.24.0 ships without
      // dist/node/index.mjs, so that resolution fails and the dev server / build
      // cannot even load the config. A non-literal specifier is left as a runtime
      // import — only evaluated on this optional Gemini fallback path.
      const GENAI_PACKAGE = '@google/genai';
      const { GoogleGenAI } = await import(GENAI_PACKAGE);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const systemMsg = messages.find((m) => m.role === 'system')?.content || '';
      const chatMessages = messages.filter((m) => m.role !== 'system');
      const contents = chatMessages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(m.content || '') }],
      }));
      if (contents.length === 0) {
        contents.push({ role: 'user', parts: [{ text: 'Hello' }] });
      }

      const res = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          systemInstruction: systemMsg || undefined,
          temperature: 0.7,
          thinkingConfig: { thinkingBudget: 0 },
          maxOutputTokens: opts.maxTokens ? Math.max(opts.maxTokens * 3, 500) : 1200,
        },
      });
      const content = String(res.text || '').trim();
      if (!content) {
        throw Object.assign(new Error('Empty response from Gemini'), {
          code: 'EMPTY_RESPONSE', status: 502, retryable: true, retryAfter: null,
        });
      }
      return { content, model: 'gemini-3.6-flash' };
    } catch (err) {
      if (err?.code === 'EMPTY_RESPONSE') throw err;
      throw Object.assign(new Error(`Gemini request failed: ${err.message}`), {
        code: 'NETWORK_ERROR', status: 502, retryable: true, retryAfter: null, raw: err,
      });
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error('OPENROUTER_TIMEOUT')), OPENROUTER_TIMEOUT_MS);
  try {
    const res = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': OPENROUTER_SITE_URL,
        'X-Title': OPENROUTER_APP_NAME,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        // Disable provider reasoning/thinking fields — we only want final content
        reasoning: { exclude: true },
        // Hard token cap only for requests that opt in (the free-form advisor
        // chat) so a reply can't run away into a long essay. Omitted for
        // /api/career-advice, which needs room for its JSON output. (Words !=
        // tokens, so the chat system prompt is the primary length control.)
        ...(opts.maxTokens ? { max_tokens: opts.maxTokens } : {}),
      }),
      signal: controller.signal,
    });

    const retryAfter = parseRetryAfter(res.headers?.get('retry-after'));

    if (!res.ok) {
      let detail = '';
      try {
        detail = await res.text();
      } catch {
        /* ignore */
      }
      const err = new Error(`OpenRouter responded with HTTP ${res.status}`);
      err.code = `HTTP_${res.status}`;
      err.status = res.status;
      err.detail = detail;
      err.retryable = isRetryableHttpStatus(res.status);
      err.retryAfter = retryAfter;
      throw err;
    }

    const data = await res.json();
    const content = String(data?.choices?.[0]?.message?.content || '').trim();
    if (!content) {
      throw Object.assign(new Error('Empty response from OpenRouter'), {
        code: 'EMPTY_RESPONSE', status: 502, retryable: true, retryAfter: null,
      });
    }
    return { content, model: data?.model || model };
  } catch (err) {
    // Timeout / AbortError -> a single, consistent TIMEOUT error.
    if (controller.signal.aborted || err?.name === 'AbortError' || err?.message?.includes('OPENROUTER_TIMEOUT')) {
      throw Object.assign(new Error('OPENROUTER_TIMEOUT'), {
        code: 'TIMEOUT', status: 408, retryable: true, retryAfter: null,
      });
    }
    // Already a typed error (HTTP_* / EMPTY_RESPONSE) -> rethrow unchanged.
    if (err?.code && typeof err.code === 'string') throw err;
    // Underlying fetch/network failure (DNS, connection refused, ECONNRESET...).
    throw Object.assign(new Error(`OpenRouter request failed: ${err.message}`), {
      code: 'NETWORK_ERROR', status: 502, retryable: true, retryAfter: null, raw: err,
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Request generation from OpenRouter with transparent model fallback.
 *
 * Strategy (429-aware):
 *   - For each model in AI_MODELS (capped at MAX_MODEL_ATTEMPTS):
 *       * attempt the request once
 *       * on HTTP 429 (rate limit) -> DO NOT retry same model, immediately switch to next model
 *       * on other transient errors (5xx / 408 / 529 / timeout / network / empty) -> retry SAME model once after backoff
 *       * if it still fails, fall through to next fallback model
 *   - non-retryable errors (401 auth, 402 credits, 400/422 malformed,
 *     404/403 model/route problems) abort immediately across ALL models
 *   - if every model is exhausted:
 *       * if all failures were 429 -> throw ALL_RATE_LIMITED (caller returns safe fallback)
 *       * otherwise -> throw SERVICE_UNAVAILABLE
 *
 * Resolves with { content, model } or rejects with a classified Error.
 */
async function requestWithFallback(messages, opts = {}) {
  const models = AI_MODELS;
  let lastError = null;
  let rateLimitedCount = 0;

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    log.info(`Trying model: ${model} (attempt ${i + 1}/${models.length})`);

    let modelFailedWith429 = false;

    // One attempt, plus one retry only for non-429 transient errors.
    for (let retry = 0; retry < 2; retry++) {
      try {
        return await callOpenRouterOnce(model, messages, opts);
      } catch (err) {
        lastError = err;
        if (!err?.retryable) {
          // Non-retryable (auth, credits, bad request) -> give up across ALL models.
          log.warn(`Model ${model} -> non-retryable error ${err.code}`);
          throw err;
        }
        const is429 = err.status === 429 || err.code === 'HTTP_429';
        if (is429) {
          // 429: never retry same model — immediately switch to next fallback.
          log.warn(`Model ${model} -> rate-limited ${err.code} (HTTP 429), switching immediately`);
          modelFailedWith429 = true;
          break;
        }
        log.warn(`Model ${model} -> retryable ${err.code}${err.status ? ' (HTTP ' + err.status + ')' : ''}`);
        if (retry === 1) break; // already retried once; move on to next model

        const wait = (err.retryAfter != null && err.retryAfter > 0) ? err.retryAfter : jitter(500, 1000);
        log.info(`Retrying same model after ${wait}ms`);
        await sleep(wait);
      }
    }

    if (modelFailedWith429) rateLimitedCount += 1;

    if (i < models.length - 1) {
      const gap = jitter(300, 700);
      log.info(`Switching to fallback model: ${models[i + 1]} (after ${gap}ms)`);
      await sleep(gap);
    }
  }

  // If every attempted model failed with 429, signal a dedicated code so callers
  // can return the safe student-facing fallback instead of SERVICE_UNAVAILABLE.
  if (rateLimitedCount === models.length && lastError && (lastError.status === 429 || lastError.code === 'HTTP_429')) {
    log.warn(`All ${models.length} models rate-limited (429), returning safe fallback`);
    throw Object.assign(new Error('All models rate-limited'), {
      code: 'ALL_RATE_LIMITED',
      status: 429,
      retryable: false,
      detail: lastError?.detail,
    });
  }

  log.err('All models failed', lastError?.code || 'UNKNOWN');
  throw Object.assign(new Error('AI Advisor unavailable'), {
    code: 'SERVICE_UNAVAILABLE',
    status: 503,
    retryable: false,
    detail: lastError?.detail,
  });
}

/**
 * Robustly extract a JSON object from a model reply string (strips markdown
 * fences and any surrounding prose, then parses the first {...} block).
 */
function parseModelJson(raw) {
  let text = (typeof raw === 'string' ? raw : (raw && typeof raw === 'object' ? JSON.stringify(raw) : String(raw || ''))).trim();
  text = text.replace(/^\s*```(?:json)?\s*|\s*```\s*$/gi, '');
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) text = text.slice(start,end + 1);
  try {
    return JSON.parse(text);
  } catch {
    throw Object.assign(new Error('AI response was not valid JSON'), { code: 'INVALID_AI_RESPONSE' });
  }
}

/**
 * Wrap raw model content into the structured advice contract.
 * Produces the rich NAVORA schema ANDthe backwards-compatible shape
 * (recommendedCareers / alternativeCareers) the existing frontend renders.

 */
function normalizeAdvice(raw) {
  const parsed = parseModelJson(raw);
  const str = (v, fallback = '') => {
    if (typeof v === 'string') return v.trim();
    if (v && typeof v === 'object' && typeof v.label === 'string') return v.label.trim();
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    return v != null ? String(v .trim()) : fallback;
  };
  const strArray = (v, max) => {
    const limit = typeof max === 'number' ? max : 6;
    if (Array.isArray(v)) return v.map(str).filter(Boolean).slice(0, limit);
    if (typeof v === 'string' && v.trim()) return [str(v)];
    if (v && typeof v === 'object' && typeof v.label === 'string') return [str(v)];
    return [];
  };

  const profileSummary = str(parsed.profile_summary || parsed.profileSummary) || null;
  const keyObservations = strArray(parsed.key_observations || parsed.keyObservations, 6);
   const reflectionQuestion = str(parsed.reflection_question || parsed.reflectionQuestion) || null;
   const actionPlan = strArray(parsed.action_plan || parsed.actionPlan, 8);

  const careers = (parsed.recommended_careers || parsed.recommendedCareers) || [];
   const alternativesRaw = (parsed.alternatives || parsed.alternativeCareers) || [];

 // Backwards-compatible shape the UI already renders.
 const recommendedCareers = careers
    .filter((c) => c && typeof c === 'object' && str(c.career || c.title))
    .map((c) => {
      const next = c.next_step || (Array.isArray(c.nextSteps) ? c.nextSteps[0] : null);
      return {
        title: str(c.career || c.title),
        whySuit: str(c.why_it_fits || c.whySuit || str(c.reason)),
        degree: str(c.study_route || c.degree),
        skills: strArray(c.skills),
        exams: strArray(c.exams, 8),
        nextSteps: next ? [str(next)] : [],
      };
    });

  if (recommendedCareers.length === 0) {
    throw Object.assign(new Error('AI response contained no careers'), { code: 'INVALID_AI_RESPONSE' });
  }

  const alternativeCareers = alternativesRaw
    .filter((a) => a && typeof a === 'object' && str(a.career || a.title))
    .map((a) => ({ title: str(a.career || a.title), note: str(a.note || str(a.why_it_fits)) }));

  const strongestRaw = parsed.strongest_recommendation || parsed.strongestRecommendation || {};
   const strongestName = str(strongestRaw.career || strongestRaw.title);
   const strongestRecommendation = strongestName
    ? { career: strongestName, reason: str(strongestRaw.reason || strongestRaw.why) }
    : null;

  return {
    recommendedCareers,             // backwards-compatible
    alternativeCareers,            // backwards-compatible
    profileSummary: profileSummary || null,
    keyObservations: keyObservations || null,
    strongestRecommendation: strongestRecommendation || null,
    actionPlan: actionPlan.length ? actionPlan : null,
    reflectionQuestion: reflectionQuestion || null,
  };
}

//  Input validation for career advice ---------------------------------------
function validateAdviceRequest(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw Object.assign(new Error('Request body must be a JSON object'), { code: 'INVALID_ANSWERS' });
  }

  const hasAnswers =
    body.answers && typeof body.answers === 'object' && !Array.isArray(body.answers)
      ? Object.keys(body.answers).length > 0
      : false;

  const summary = body.summary && typeof body.summary === 'object' ? body.summary : {};
  const hasContext =
    Boolean(summary.stageLabel) ||
    Boolean(summary.streamLabel) ||
    (Array.isArray(summary.selections) && summary.selections.length > 0);

  if (!hasAnswers && !hasContext) {
    throw Object.assign(
      new Error('No completed questionnaire answers were provided'),
      { code: 'INVALID_ANSWERS' },
    );
  }
}
// buildChatSystemPrompt, serializeChatContext, isLeakyResponse, RETRY_CORRECTION_INSTRUCTION, SAFE_FALLBACK_MESSAGE
// now live in server/ai/ — single source of truth via NAVORA_AI_RULES.md

//  Auth + entitlement helpers (server is the ONLY authority) -----------------
function todayStr() { return new Date().toISOString().slice(0, 10); }

/** Read raw request bytes (for webhook signature verification). */
function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/**
 * Authenticate request -> { user } or null. Never trusts body/query/headers
 * like x-plan, ?plan=pro, {isPro:true} — only the verified Supabase JWT.
 */
async function authenticate(req) {
  const token = bearerToken(req);
  if (!token) return null;
  return verifySupabaseUser(token);
}

/** Resolve authoritative entitlement for a user id (fail-safe: free). */
async function entitlementFor(userId) {
  try {
    if (!userId || !isServiceRoleConfigured()) {
      return { plan: 'free', status: 'active', features: planFeatures('free'), currentPeriodEnd: null, used: null };
    }
    const sub = await getSubscriptionRow(userId);
    const ent = getUserEntitlement(sub);
    const used = await getAiUsageCount(userId, todayStr());
    return { ...ent, used };
  } catch {
    return { plan: 'free', status: 'active', features: planFeatures('free'), currentPeriodEnd: null, used: null };
  }
}

/**
 * Server-side AI quota gate. Atomically increments usage, then compares to
 * the plan limit. Returns { allowed, used, limit, plan }.
 * Fail-safe: if the counter is unavailable, authed users are treated as free
 * with usage unknown -> allow but do not grant Pro.
 */
async function checkAiQuota(userId, plan) {
  const limit = plan === 'pro' ? 30 : 5;
  if (!userId) return { allowed: true, used: 0, limit, plan: 'free', demo: true };
  const { count } = await incrementAiUsage(userId, todayStr());
  if (count == null) {
    const used = await getAiUsageCount(userId, todayStr());
    return { allowed: true, used: used ?? 0, limit, plan, degraded: true };
  }
  return { allowed: count <= limit, used: count, limit, plan };
}

function quotaExceeded(res, q) {
  return sendJson(res, 429, {
    success: false,
    message: 'AI daily limit reached. Upgrade to NAVORA Pro for a higher limit.',
    error: 'AI daily limit reached',
    limit: q.limit,
    used: q.used,
    plan: q.plan,
    upgradeRequired: true,
  });
}

//  Route handlers -------------------------------------------------------------
async function handleCareerAdvice(req, res) {
  let body;
  try {
    body = await readBody(req);
  } catch {
    return sendJson(res, 400, { success: false, message: 'I’m having trouble responding right now. Please try again.' });
  }

  // Unified path: if caller sent chat messages (frontend chat via /api/career-advice), handle as chat
  if (Array.isArray(body?.messages) && body.messages.length) {
    // Reuse advisor chat logic via internal delegation — keeps ONE authoritative path
    req.url = '/api/advisor/chat';
    return handleAdvisorChat(req, res);
  }

  try {
    validateAdviceRequest(body);
  } catch (err) {
    return sendJson(res, 400, {
      success: false, message: 'I’m having trouble responding right now. Please try again.',
    });
  }

  if (missingApiKey()) {
    return sendConfigError(res);
  }

  // Auth is optional here (questionnaire runs pre-login) but quota is server-side:
  // authed users get plan quota (3 free / 20 pro); anonymous gets IP rate-limit only.
  const authUser = await authenticate(req);
  let quotaPlan = 'free';
  if (authUser) {
    const ent = await entitlementFor(authUser.id);
    quotaPlan = ent.plan;
    const q = await checkAiQuota(authUser.id, quotaPlan);
    if (!q.allowed) return quotaExceeded(res, q);
  }

  const userPrompt = buildUserPrompt(body);
  let response = null;
  let advice = null;
  log.info('Career advice request received');
  // One retry when the model returns unparseable JSON (free models sometimes
  // ignore the format). Model fallback / timeout / retry is handled
  // transparently inside requestWithFallback().
  for (let attempt = 0; attempt < 2 && !advice; attempt++) {
    const messages = [
      { role: 'system', content: ADVICE_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ];
    if (attempt > 0) {
      messages.push({ role: 'assistant', content: response ? response.content : '' });
      messages.push({ role: 'user', content: 'Your previous reply was not valid JSON. Reply again with ONLY the raw JSON object matching the schema. No markdown fences, no explanation.' });
    }
    try {
      response = await requestWithFallback(messages);
    } catch (err) {
      // All models 429 -> safe fallback, not SERVICE_UNAVAILABLE
      if (err?.code === 'ALL_RATE_LIMITED' || err?.status === 429) {
        log.warn('Career-advice: all models 429, returning safe fallback');
        return sendJson(res, 200, { success: true, message: buildSafeFallback(body) });
      }
      return mapOpenRouterError(res, err, body);
    }

    // Leakage check before parsing — if JSON contains internal reasoning leakage, retry
    if (isLeakyResponse(response.content)) {
      log.warn('Leakage detected in career-advice raw response');
      if (attempt === 0) continue; // will retry with JSON correction instruction
      return sendJson(res, 200, { success: true, message: buildSafeFallback(body) });
    }

    try {
      advice = normalizeAdvice(response.content);
    } catch (err) {
      if (err.code !== 'INVALID_AI_RESPONSE' || attempt === 1) {
        log.err('model returned unparseable JSON', err.message);
        return sendJson(res, 502, { success: false, message: 'I’m having trouble responding right now. Please try again.' });
      }
    }
  }
  log.info('Advice generated', response.model);
  // Return legacy structured shape for existing Recommendations page, but also ensure clean contract is available
  // New clients should use /api/advisor/chat with {success, message}
  return sendJson(res, 200, { ...advice, model: response.model, success: true });
}


async function handleAdvisorChat(req, res) {
  let body;
  try {
    body = await readBody(req);
  } catch {
    return sendJson(res, 400, { success: false, message: 'I’m having trouble responding right now. Please try again.' });
  }

  const history = Array.isArray(body?.messages) ? body.messages : [];
  const last = history[history.length - 1];
  if (!last || typeof last.content !== 'string' || !last.content.trim()) {
    return sendJson(res, 400, { success: false, message: 'I’m having trouble responding right now. Please try again.' });
  }
  // Validate history shape (length + per-message caps) before AI provider call.
  if (history.length > 40) {
    return sendJson(res, 400, { success: false, message: 'I’m having trouble responding right now. Please try again.' });
  }
  for (const m of history) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string' || m.content.length > 4000) {
      return sendJson(res, 400, { success: false, message: 'I’m having trouble responding right now. Please try again.' });
    }
  }

  // Advisor chat requires an authenticated Supabase user (page is behind login).
  // IP limit alone is not authorization — JWT identity resolves the quota.
  // Auth is checked before provider config so unauthenticated callers always get 401.
  const chatUser = await authenticate(req);
  if (!chatUser) {
    return sendJson(res, 401, { success: false, message: 'Please sign in to use the AI Advisor.' });
  }

  if (missingApiKey()) {
    return sendConfigError(res);
  }
  const chatEnt = await entitlementFor(chatUser.id);
  const chatQuota = await checkAiQuota(chatUser.id, chatEnt.plan);
  if (!chatQuota.allowed) return quotaExceeded(res, chatQuota);

  // --- Debug logging (structural, no PII) before OpenRouter call ---
  const ctxDbg = body?.context && typeof body.context === 'object' ? body.context : {};
  const rpDbg = ctxDbg.resolvedProfile || body?.resolvedProfile || null;
  const hasContext = Boolean(ctxDbg && (ctxDbg.stageLabel || ctxDbg.stream || ctxDbg.field || (Array.isArray(ctxDbg.selections) && ctxDbg.selections.length)));
  const hasResolvedProfile = Boolean(rpDbg && typeof rpDbg === 'object' && Object.keys(rpDbg).length > 0);
  const profileFields = hasResolvedProfile ? Object.keys(rpDbg).filter(k => {
    const v = rpDbg[k];
    if (Array.isArray(v)) return v.length > 0;
    return Boolean(v);
  }) : [];
  log.info(`Chat history messages: ${history.length}`);
  log.info(`Has context: ${hasContext}`);
  log.info(`Has resolved profile: ${hasResolvedProfile}`);
  log.info(`Stage: ${ctxDbg.stageLabel || rpDbg?.education_level || rpDbg?.current_stage || 'none'}`);
  log.info(`Stream: ${(ctxDbg.stream?.label || ctxDbg.field?.label || rpDbg?.stream || rpDbg?.degree || 'none')}`);
  log.info(`Profile fields: ${profileFields.length ? profileFields.join(',') : 'none'}`);

  // Cap history to 20 turns — delegates to contextBuilder (profile+history+current preserved)
  const messages = buildChatMessages(history);

  const systemPrompt = buildChatSystemPrompt(serializeChatContext(body));
  log.info('Advisor chat request received');

  let response;
  try {
    response = await requestWithFallback(
      [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      { maxTokens: CHAT_MAX_TOKENS },
    );
  } catch (err) {
    // All models 429 -> contextual safe fallback, not generic onboarding
    if (err?.code === 'ALL_RATE_LIMITED') {
      log.warn('FALLBACK USED: all models rate-limited (429) -> contextual fallback');
      const fb = buildSafeFallback(body);
      log.info(`Chat response generated by: fallback`);
      log.info(`Response length: ${fb.length}`);
      log.info(`Used fallback: true`);
      return sendJson(res, 200, { success: true, message: fb });
    }
    // Other provider errors -> map but also log fallback if needed
    return mapOpenRouterError(res, err, body);
  }

  // Server-side leakage validation + ONE retry — only genuine leakage triggers fallback
  let finalContent = String(response.content || '').trim();
  // VALID responses must be returned directly; only leaky/invalid triggers retry/fallback
  if (isLeakyResponse(finalContent)) {
    log.warn('Leakage detected in first response, retrying with correction');
    try {
      const retryResponse = await requestWithFallback(
        [
          { role: 'system', content: systemPrompt },
          ...messages,
          { role: 'assistant', content: finalContent },
          { role: 'user', content: RETRY_CORRECTION_INSTRUCTION },
        ],
        { maxTokens: CHAT_MAX_TOKENS },
      );
      const retryContent = String(retryResponse.content || '').trim();
      if (isLeakyResponse(retryContent)) {
        log.warn('FALLBACK USED: leakage after retry');
        finalContent = buildSafeFallback(body);
        log.info(`Chat response generated by: fallback`);
        log.info(`Response length: ${finalContent.length}`);
        log.info(`Used fallback: true`);
        return sendJson(res, 200, { success: true, message: finalContent });
      }
      finalContent = retryContent;
      // Log retry success as normal response
      log.info(`Chat response generated by: ${retryResponse.model}`);
      log.info(`Response length: ${finalContent.length}`);
      log.info(`Used fallback: false`);
      return sendJson(res, 200, { success: true, message: finalContent });
    } catch (e) {
      log.warn('FALLBACK USED: retry failed');
      finalContent = buildSafeFallback(body);
      log.info(`Chat response generated by: fallback`);
      log.info(`Response length: ${finalContent.length}`);
      log.info(`Used fallback: true`);
      return sendJson(res, 200, { success: true, message: finalContent });
    }
  }

  log.info(`Chat response generated by: ${response.model}`);
  log.info(`Response length: ${finalContent.length}`);
  log.info(`Used fallback: false`);
  return sendJson(res, 200, { success: true, message: finalContent });
}

function handleHealth(req, res) {
  return sendJson(res, 200, {
    ok: true,
    status: 'up',
    provider: 'openrouter',
    apiKeyConfigured: !missingApiKey(),
    models: AI_MODELS,
    primaryModel: AI_PRIMARY_MODEL,
    maxModelAttempts: MAX_MODEL_ATTEMPTS,
    timeoutMs: OPENROUTER_TIMEOUT_MS,
    rateLimitPerMin: AI_RATE_LIMIT_PER_MIN,
  });
}

function sendConfigError(res) {
  // Do not expose internal config details to client — generic user-facing message, details logged server-side only
  log.err('CONFIG_ERROR: OPENROUTER_API_KEY missing');
  return sendJson(res, 500, {
    success: false,
    message: 'I’m having trouble responding right now. Please try again.',
  });
}

function mapOpenRouterError(res, err, body) {
  const code = err?.code || 'UNKNOWN';
  // All models 429 is handled as safe fallback at call-site, but keep here as safety net
  if (code === 'ALL_RATE_LIMITED') {
    log.warn('mapOpenRouterError: ALL_RATE_LIMITED -> safe fallback');
    return sendJson(res, 200, { success: true, message: buildSafeFallback(body) });
  }
  if (err?.message && code !== 'TIMEOUT') log.err('provider error', err.message, code);
  // Generic user-facing message — never expose raw provider errors, stack traces, or metadata
  const generic = 'I’m having trouble responding right now. Please try again.';

  if (code === 'SERVICE_UNAVAILABLE') {
    return sendJson(res, 503, { success: false, message: generic });
  }
  if (
    err?.name === 'AbortError' ||
    err?.message === 'OPENROUTER_TIMEOUT' ||
    err?.cause?.message === 'OPENROUTER_TIMEOUT' ||
    code === 'TIMEOUT' ||
    code === 'OPENROUTER_TIMEOUT'
  ) {
    return sendJson(res, 504, { success: false, message: generic });
  }
  if (code === 'EMPTY_RESPONSE') {
    return sendJson(res, 502, { success: false, message: generic });
  }
  if (code === 'NETWORK_ERROR') {
    return sendJson(res, 502, { success: false, message: generic });
  }
  if (code === 'HTTP_401') {
    return sendJson(res, 401, { success: false, message: generic });
  }
  if (code === 'HTTP_402') {
    return sendJson(res, 402, { success: false, message: generic });
  }
  if (code === 'HTTP_429') {
    return sendJson(res, 429, { success: false, message: generic });
  }
  if (code === 'HTTP_400') {
    return sendJson(res, 400, { success: false, message: generic });
  }
  if (typeof code === 'string' && code.startsWith('HTTP_')) {
    return sendJson(res, 502, { success: false, message: generic });
  }
  return sendJson(res, 502, { success: false, message: generic });
}

//  HTTP server request handler -----------------------------------------------
export async function handleApiRequest(req, res) {
  const { method, url } = req;
  const path = (url || '/').split('?')[0];

  setSecurityHeaders(res, req);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Basic per-IP throttling on the AI endpoints (protects the API key from abuse).
  if (method === 'POST' && (path === '/api/career-advice' || path === '/api/advisor/chat')) {
    const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').toString().split(',')[0].trim();
    const rl = rateLimitClient(clientIp || 'unknown');
    if (rl.limited) {
      return sendJson(res, 429, {
        success: false, message: 'I’m having trouble responding right now. Please try again.',
      });
    }
  }

  if (path === '/api/health' && method === 'GET') return handleHealth(req, res);
  if (path === '/health' && method === 'GET') return handleHealth(req, res);

  // College Discovery & Details Endpoints
  if (path === '/api/colleges' && method === 'GET') {
    const urlObj = new URL(req.url, 'http://localhost');
    const query = Object.fromEntries(urlObj.searchParams.entries());
    const filtered = filterInstitutions({
      level: query.level,
      course: query.course,
      city: query.city,
      institutionType: query.type,
      budget: query.budget,
      hostel: query.hostel,
      searchQuery: query.q || query.search,
      sortBy: query.sort
    });
    return sendJson(res, 200, { success: true, count: filtered.length, data: filtered });
  }

  if (path.startsWith('/api/colleges/') && method === 'GET') {
    const slug = path.replace('/api/colleges/', '').trim();
    if (slug === 'compare') {
      const urlObj = new URL(req.url, 'http://localhost');
      const slugs = (urlObj.searchParams.get('colleges') || '').split(',').map(s => s.trim()).filter(Boolean);
      const matched = slugs.map(s => HYDERABAD_INSTITUTIONS.find(i => i.slug === s || i.id === s)).filter(Boolean);
      return sendJson(res, 200, { success: true, count: matched.length, data: matched });
    }
    const found = HYDERABAD_INSTITUTIONS.find(i => i.slug === slug || i.id === slug);
    if (!found) {
      return sendJson(res, 404, { success: false, message: 'Institution not found' });
    }
    return sendJson(res, 200, { success: true, data: found });
  }

  if (path === '/api/career-advice' && method === 'POST') return handleCareerAdvice(req, res);
  if (path === '/api/advisor/chat' && method === 'POST') return handleAdvisorChat(req, res);

  // Entitlement — backend verifies plan before paid functionality.
  // The ONLY trusted inputs are the verified JWT identity + server subscription row.
  // ?plan= / ?isPro= / body.plan / x-plan headers are NEVER read here.
  if (path === '/api/entitlement' && method === 'GET') {
    const user = await authenticate(req);
    if (!user) return sendJson(res, 401, { success: false, message: 'Sign in required.' });
    const ent = await entitlementFor(user.id);
    return sendJson(res, 200, { success: true, ...ent });
  }
  if (path === '/api/entitlement/check' && method === 'POST') {
    let body = {};
    try { body = await readBody(req); } catch { body = {}; }
    const feature = typeof body?.feature === 'string' ? body.feature.slice(0, 80) : 'default';
    const user = await authenticate(req);
    // Fail-safe: unknown/anonymous => free (never auto-promote).
    const ent = user ? await entitlementFor(user.id) : { plan: 'free', features: planFeatures('free') };
    const PRO_ONLY = new Set([
      'personalized_roadmap', 'pdf_reports', 'full_global_study',
      'course_comparison', 'detailed_fees', 'personalized_scholarships',
      'full_career_map', 'application_planning',
    ]);
    if (PRO_ONLY.has(feature) && ent.plan !== 'pro') {
      return sendJson(res, 403, { success: false, allowed: false, plan: 'free', message: 'This feature requires NAVORA Pro. Upgrade to unlock.' });
    }
    return sendJson(res, 200, { success: true, allowed: true, plan: ent.plan });
  }
  if (path === '/api/entitlement/subscription' && method === 'GET') {
    const user = await authenticate(req);
    if (!user) return sendJson(res, 401, { success: false, message: 'Sign in required.' });
    const ent = await entitlementFor(user.id);
    return sendJson(res, 200, { plan: ent.plan, status: ent.status, currentPeriodEnd: ent.currentPeriodEnd });
  }
  if (path === '/api/entitlement/checkout' && method === 'POST') {
    // Provider-ready stub: never activates Pro. Real checkout URL comes from env.
    const checkoutUrl = (process.env.RAZORPAY_CHECKOUT_URL || process.env.VITE_CHECKOUT_URL || '').trim();
    return sendJson(res, 200, {
      success: true,
      checkout_url: checkoutUrl || null,
      provider: 'razorpay',
      configured: Boolean(checkoutUrl),
      message: checkoutUrl
        ? 'Redirect to the provider checkout. Pro activates only after webhook verification.'
        : 'Checkout requires RAZORPAY configuration. Pro activation only after webhook verification.',
    });
  }
  if (path === '/api/entitlement/webhook' && method === 'POST') {
    // Verified-webhook path ONLY. Rejects invalid signatures; never trusts body plan.
    let raw;
    try { raw = await readRawBody(req); } catch {
      return sendJson(res, 400, { success: false, message: 'Invalid payload.' });
    }
    const provider = detectProvider(req);
    if (provider !== 'razorpay') {
      log.warn('Webhook rejected: unknown provider / missing signature header');
      return sendJson(res, 400, { success: false, message: 'Unknown provider.' });
    }
    const secret = (process.env.RAZORPAY_WEBHOOK_SECRET || process.env.PAYMENT_WEBHOOK_SECRET || '').trim();
    if (!secret) {
      log.err('Webhook misconfigured: RAZORPAY_WEBHOOK_SECRET missing');
      return sendJson(res, 500, { success: false, message: 'Webhook not configured.' });
    }
    const signature = String(req.headers['x-razorpay-signature'] || '');
    if (!verifyRazorpaySignature(raw, signature, secret)) {
      log.warn('Webhook rejected: invalid signature');
      return sendJson(res, 401, { success: false, message: 'Invalid signature.' });
    }
    let event = null;
    try { event = JSON.parse(raw.toString('utf8')); } catch {
      return sendJson(res, 400, { success: false, message: 'Invalid JSON.' });
    }
    const mapped = mapRazorpayToNavora(event);
    if (!mapped) {
      log.info('Webhook ignored: event does not change entitlement');
      return sendJson(res, 200, { success: true, ignored: true });
    }
    // Identify user: prefer notes.user_id set at checkout; else provider customer lookup.
    const notesUser = event?.payload?.subscription?.entity?.notes?.user_id
      || event?.payload?.payment?.entity?.notes?.user_id
      || null;
    if (!notesUser) {
      log.warn('Webhook: no user linkage (notes.user_id missing); manual reconciliation required');
      return sendJson(res, 200, { success: true, reconcilationRequired: true });
    }
    try {
      await upsertSubscriptionRow({
        user_id: notesUser,
        plan: mapped.plan,
        status: mapped.status,
        provider: 'razorpay',
        provider_customer_id: mapped.providerCustomerId,
        provider_subscription_id: mapped.providerSubscriptionId,
        current_period_start: mapped.startAt,
        current_period_end: mapped.endAt,
        updated_at: new Date().toISOString(),
      });
      log.info('Webhook: subscription updated for user');
      return sendJson(res, 200, { success: true });
    } catch (err) {
      log.err('Webhook upsert failed', err?.message || 'unknown');
      return sendJson(res, 500, { success: false, message: 'Update failed.' });
    }
  }

  // Admin authorization probe (frontend route guard helper; mutations must re-check).
  if (path === '/api/admin/check' && method === 'GET') {
    const user = await authenticate(req);
    if (!user) return sendJson(res, 401, { success: false, admin: false });
    const admin = await isAdminUser(user.id);
    if (!admin) return sendJson(res, 403, { success: false, admin: false });
    return sendJson(res, 200, { success: true, admin: true });
  }

  // Dashboard bundle: entitlement + usage + subscription + admin in one call.
  // Assessment/answers/saved items stay client-side (existing architecture).
  if (path === '/api/dashboard' && method === 'GET') {
    const user = await authenticate(req);
    if (!user) return sendJson(res, 401, { success: false, message: 'Sign in required.' });
    const ent = await entitlementFor(user.id);
    const admin = await isAdminUser(user.id);
    return sendJson(res, 200, {
      success: true,
      plan: ent.plan,
      status: ent.status,
      features: ent.features,
      aiUsed: ent.used ?? 0,
      aiLimit: ent.plan === 'pro' ? 30 : 5,
      expiresAt: ent.expiresAt || ent.currentPeriodEnd || null,
      admin,
    });
  }

  // Personalized roadmap — PRO ONLY. Answers are posted (already completed
  // client-side); entitlement is verified before anything is returned.
  if (path === '/api/roadmap' && method === 'POST') {
    const user = await authenticate(req);
    if (!user) return sendJson(res, 401, { success: false, message: 'Sign in required.' });
    const ent = await entitlementFor(user.id);
    if (ent.plan !== 'pro') {
      return sendJson(res, 403, { success: false, allowed: false, plan: 'free', message: 'Personalized roadmap requires NAVORA Pro. Upgrade to unlock.' });
    }
    let body = {};
    try { body = await readBody(req); } catch {
      return sendJson(res, 400, { success: false, message: 'Invalid request.' });
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return sendJson(res, 400, { success: false, message: 'Invalid request.' });
    }
    const answers = body.answers && typeof body.answers === 'object' ? body.answers : {};
    const userType = typeof body.userType === 'string' ? body.userType.slice(0, 40) : null;
    if (!Object.keys(answers).length && !userType) {
      return sendJson(res, 400, { success: false, message: 'Complete your assessment first to generate a roadmap.' });
    }
    return sendJson(res, 200, { success: true, roadmap: buildRoadmap(answers, userType) });
  }

  // ── Razorpay payments (one-time annual Pro, ₹999 = 99900 paise) ──
  if (path === '/api/payments/create-pro-order' && method === 'POST') {
    const user = await authenticate(req);
    if (!user) return sendJson(res, 401, { success: false, message: 'Sign in required.' });
    const ent = await entitlementFor(user.id);
    if (ent.plan === 'pro') {
      return sendJson(res, 200, {
        success: true, alreadyPro: true, plan: 'pro',
        expiresAt: ent.expiresAt || ent.currentPeriodEnd || null,
        message: 'You already have NAVORA Pro.',
      });
    }
    if (!isRazorpayConfigured()) {
      return sendJson(res, 503, {
        success: false, configured: false,
        message: 'Payments are not configured yet. Set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET (Test Mode).',
      });
    }
    try {
      const order = await createRazorpayOrder({
        receipt: `navora_${user.id.slice(0, 12)}_${Date.now()}`.slice(0, 40),
        notes: { user_id: user.id, product: 'navora_pro_annual' },
      });
      try {
        await insertPaymentRow({
          user_id: user.id,
          provider: 'razorpay',
          provider_order_id: order.id,
          provider_payment_id: null,
          amount: order.amount ?? PRO_AMOUNT_PAISE,
          currency: order.currency || PRO_CURRENCY,
          status: 'created',
        });
      } catch (e) { log.warn('order audit insert failed', e?.message || ''); }
      return sendJson(res, 200, {
        success: true,
        orderId: order.id,
        amount: order.amount ?? PRO_AMOUNT_PAISE,
        currency: order.currency || PRO_CURRENCY,
        keyId: razorpayPublicKey(),
      });
    } catch (err) {
      log.err('create-pro-order failed', err?.message || 'unknown');
      return sendJson(res, 502, { success: false, message: 'Could not start checkout. Please try again.' });
    }
  }

  if (path === '/api/payments/verify-pro-payment' && method === 'POST') {
    const user = await authenticate(req);
    if (!user) return sendJson(res, 401, { success: false, message: 'Sign in required.' });
    let body = {};
    try { body = await readBody(req); } catch {
      return sendJson(res, 400, { success: false, message: 'Invalid request.' });
    }
    const orderId = typeof body?.razorpay_order_id === 'string' ? body.razorpay_order_id.trim() : '';
    const paymentId = typeof body?.razorpay_payment_id === 'string' ? body.razorpay_payment_id.trim() : '';
    const signature = typeof body?.razorpay_signature === 'string' ? body.razorpay_signature.trim() : '';
    if (!orderId || !paymentId || !signature || orderId.length > 64 || paymentId.length > 64 || signature.length > 256) {
      return sendJson(res, 400, { success: false, message: 'Invalid payment details.' });
    }
    // ONLY a valid cryptographic signature activates Pro — never checkout closure.
    if (!verifyPaymentSignature(orderId, paymentId, signature)) {
      await updatePaymentStatus(paymentId, 'failed');
      return sendJson(res, 400, { success: false, message: 'Your payment could not be completed.' });
    }
    try {
      const result = await activateProForPayment({
        userId: user.id, orderId, paymentId, amount: PRO_AMOUNT_PAISE, currency: PRO_CURRENCY,
      });
      log.info('Pro activated via verified payment');
      return sendJson(res, 200, {
        success: true, plan: 'pro', expiresAt: result.expiresAt,
        alreadyActive: result.alreadyActive === true,
        message: 'Welcome to NAVORA Pro. Your Pro access is now active.',
      });
    } catch (err) {
      log.err('verify-pro-payment activation failed', err?.message || 'unknown');
      return sendJson(res, 500, { success: false, message: 'Payment verified but activation failed. Contact support.' });
    }
  }

  // Razorpay payment webhook (payment.captured etc.). Idempotent: same payment
  // id processed twice => single activation. Reconciliation requires notes.user_id.
  if (path === '/api/payments/razorpay-webhook' && method === 'POST') {
    let raw;
    try { raw = await readRawBody(req); } catch {
      return sendJson(res, 400, { success: false, message: 'Invalid payload.' });
    }
    const secret = (process.env.RAZORPAY_WEBHOOK_SECRET || '').trim();
    if (!secret) {
      log.err('Razorpay webhook misconfigured: RAZORPAY_WEBHOOK_SECRET missing');
      return sendJson(res, 500, { success: false, message: 'Webhook not configured.' });
    }
    const signature = String(req.headers['x-razorpay-signature'] || '');
    if (!verifyRazorpaySignature(raw, signature, secret)) {
      log.warn('Razorpay webhook rejected: invalid signature');
      return sendJson(res, 401, { success: false, message: 'Invalid signature.' });
    }
    let event = null;
    try { event = JSON.parse(raw.toString('utf8')); } catch {
      return sendJson(res, 400, { success: false, message: 'Invalid JSON.' });
    }
    const type = event?.event || '';
    const entity = event?.payload?.payment?.entity || {};
    if (type === 'payment.captured' && entity?.id) {
      const userId = entity?.notes?.user_id || null;
      if (!userId) {
        log.warn('Razorpay webhook: captured payment without notes.user_id; reconciliation required');
        return sendJson(res, 200, { success: true, reconcilationRequired: true });
      }
      // Confirm server-side with Razorpay when configured (payload is not trusted alone).
      const confirmed = await fetchRazorpayPayment(entity.id);
      const status = confirmed?.status || entity.status;
      if (status !== 'captured') {
        log.warn('Razorpay webhook: payment not captured, ignoring');
        return sendJson(res, 200, { success: true, ignored: true });
      }
      try {
        await activateProForPayment({
          userId,
          orderId: entity.order_id || null,
          paymentId: entity.id,
          amount: entity.amount ?? PRO_AMOUNT_PAISE,
          currency: (entity.currency || PRO_CURRENCY).toUpperCase(),
        });
        return sendJson(res, 200, { success: true });
      } catch (err) {
        log.err('Razorpay webhook activation failed', err?.message || 'unknown');
        return sendJson(res, 500, { success: false, message: 'Update failed.' });
      }
    }
    if (type === 'payment.failed' && entity?.id) {
      await updatePaymentStatus(entity.id, 'failed');
      return sendJson(res, 200, { success: true, ignored: true });
    }
    return sendJson(res, 200, { success: true, ignored: true });
  }

  return sendJson(res, 404, { success: false, message: 'I’m having trouble responding right now. Please try again.' });
}

export const server = http.createServer(handleApiRequest);

const isDirectRun = process.argv[1] && (process.argv[1].endsWith('server.mjs') || process.argv[1].endsWith('server.js'));
if (isDirectRun) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI] NAVORA AI Career Advisor backend listening on http://localhost:${PORT}`);
    console.log(`[AI] Provider       : ${OPENROUTER_API_KEY ? 'OpenRouter' : (process.env.GEMINI_API_KEY ? 'Gemini' : 'None')}`);
    console.log(`[AI] Base URL       : ${OPENROUTER_BASE_URL}`);
    console.log(`[AI] Models         : ${AI_MODELS.join(', ')}`);
    console.log(`[AI] Primary model  : ${OPENROUTER_API_KEY ? AI_PRIMARY_MODEL : 'gemini-2.5-flash'}`);
    console.log(`[AI] Max attempts   : ${MAX_MODEL_ATTEMPTS}`);
    console.log(`[AI] Timeout (ms)   : ${OPENROUTER_TIMEOUT_MS}`);
    console.log(`[AI] Rate limit     : ${AI_RATE_LIMIT_PER_MIN} req/min per IP`);
    console.log(`[AI] API key set    : ${!missingApiKey()}`);
  });
}
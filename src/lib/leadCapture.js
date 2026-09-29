// ============================================================================
// NAVORA — LEAD CAPTURE (Supabase backup of every filling detail)
// ============================================================================
// Mirrors what the user fills in the browser (localStorage `novera-state-v1`)
// into the Supabase table `lead_captures`, so the admin can read it in the
// dashboard like a Google Sheet:
//
//   created_at | name | email | phone | user_type | onboarding_name | answers
//              | recommendation | source_page | user_id | user_agent
//
// Applied migration: supabase/migrations/20261004000001_lead_captures.sql
//
// Design rules (matches src/lib/officialLinks.js + assessmentResults.js):
//   - NEVER throws — backup must not break the user's journey.
//   - Works pre-login (anon) AND post-login (authenticated) — RLS allows both.
//   - Failed inserts are queued locally and retried on the next call.
//   - Each step is captured at most once per browser session (dedupe).
// ============================================================================

import { supabase } from './supabase';

export const TABLE = 'lead_captures';
const LOCAL_KEY = 'navora_lead_captures_v1'; // local mirror + retry queue
const SEEN_KEY = 'navora_lead_seen_v1'; // step dedupe markers (sessionStorage)
const MAX_LOCAL_ROWS = 50;

/* ── Safe storage helpers ───────────────────────────────────── */

function readLocal() {
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(rows) {
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(rows.slice(-MAX_LOCAL_ROWS)));
  } catch {
    /* quota exceeded — local mirror is best-effort only */
  }
}

/** All captured rows kept in this browser (newest last). */
export function getLocalCaptures() {
  return readLocal();
}

export function clearLocalCaptures() {
  try {
    window.localStorage.removeItem(LOCAL_KEY);
    window.sessionStorage.removeItem(SEEN_KEY);
  } catch {
    /* ignore */
  }
}

/* ── Session + identity resolution ──────────────────────────── */

function sessionId() {
  try {
    let id = window.sessionStorage.getItem('navora_lead_session');
    if (!id) {
      id = 'ls_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      window.sessionStorage.setItem('navora_lead_session', id);
    }
    return id;
  } catch {
    return 'ls_anon';
  }
}

/** Read the persisted UserContext state (same envelope UserContext writes). */
function readContextState() {
  try {
    const raw = window.localStorage.getItem('novera-state-v1');
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed?.data && typeof parsed.data === 'object' ? parsed.data : parsed || {};
  } catch {
    return {};
  }
}

async function getSessionUser() {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session?.user || null;
  } catch {
    return null;
  }
}

/**
 * Merge identity from (in order): caller input > context user > live session.
 * Same precedence as resolveIdentity() in src/lib/officialLinks.js.
 */
async function resolveLeadIdentity(override = {}) {
  const state = readContextState();
  const contextUser = state.user || {};
  const sessionUser = await getSessionUser();

  const name =
    override.name ||
    contextUser.name ||
    state.onboardingData?.name ||
    sessionUser?.user_metadata?.full_name ||
    (sessionUser?.email ? sessionUser.email.split('@')[0] : '') ||
    sessionUser?.phone ||
    '';

  const email = override.email || contextUser.email || sessionUser?.email || '';

  const phone =
    override.phone ||
    contextUser.phone ||
    sessionUser?.phone ||
    sessionUser?.user_metadata?.phone ||
    '';

  const userId = override.userId || sessionUser?.id || contextUser.id || null;

  return { name, email, phone, userId, state };
}

/* ── Row builder ────────────────────────────────────────────── */

function buildRow({ identity, payload }) {
  const safeJson = (v) => (v && typeof v === 'object' ? v : null);
  return {
    user_id: identity.userId ? String(identity.userId) : null,
    name: identity.name || null,
    email: identity.email || null,
    phone: identity.phone || null,
    user_type: payload.userType || identity.state.userType || null,
    onboarding_name: payload.onboardingName ?? identity.state.onboardingData?.name ?? null,
    answers: safeJson(payload.answers) || {},
    recommendation: safeJson(payload.recommendation),
    source_page: payload.sourcePage || 'unknown',
    user_agent: typeof navigator !== 'undefined' ? String(navigator.userAgent || '').slice(0, 400) : null,
  };
}

/* ── Insert + retry queue ───────────────────────────────────── */

async function insertRows(rows) {
  try {
    const { error } = await supabase.from(TABLE).insert(rows);
    if (error) {
      console.warn(
        '[leadCapture] insert failed — apply supabase/migrations/20261004000001_lead_captures.sql in the Supabase dashboard.',
        error.message,
      );
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[leadCapture] insert exception:', err?.message || err);
    return false;
  }
}

/** Retry any rows queued locally by earlier failed inserts. */
export async function flushPendingCaptures() {
  const queued = readLocal().filter((r) => r && r.__pending);
  if (!queued.length) return { flushed: 0 };
  const batch = queued.map(({ __pending, __at, __session, ...row }) => row);
  const ok = await insertRows(batch);
  if (ok) {
    writeLocal(readLocal().filter((r) => !r || !r.__pending));
    return { flushed: batch.length };
  }
  return { flushed: 0 };
}

/**
 * Capture one filling event into Supabase (+ local mirror).
 *
 * @param {object} input
 * @param {string} [input.sourcePage]  'onboarding' | 'assessment_step' | 'assessment_result' | 'login' | 'phone_prompt'
 * @param {string} [input.stepKey]     dedupe key, e.g. 'student_class12:stream'
 * @param {boolean} [input.once]       when true, skip if stepKey already captured this session
 * @param {string} [input.userType] [input.onboardingName]
 * @param {object} [input.answers] [input.recommendation]
 * @param {string} [input.name] [input.email] [input.phone] [input.userId] — explicit overrides
 * @returns {Promise<{saved:boolean, skipped?:boolean, row?:object}>}
 */
export async function saveLeadCapture(input = {}) {
  const { stepKey, once = false } = input;

  if (once && stepKey) {
    try {
      const seen = JSON.parse(window.sessionStorage.getItem(SEEN_KEY) || '{}');
      if (seen[stepKey]) return { saved: false, skipped: true };
      seen[stepKey] = Date.now();
      window.sessionStorage.setItem(SEEN_KEY, JSON.stringify(seen));
    } catch {
      /* ignore — dedupe is best-effort */
    }
  }

  try {
    // Opportunistic retry of anything queued earlier in this session.
    await flushPendingCaptures();

    const identity = await resolveLeadIdentity(input);
    const row = buildRow({ identity, payload: input });

    // Local mirror first — survives offline / missing remote table.
    writeLocal([...readLocal(), { ...row, __session: sessionId(), __at: new Date().toISOString() }]);

    const ok = await insertRows([row]);
    if (!ok) {
      // Mark as pending so the next capture retries it.
      const rows = readLocal();
      const last = rows[rows.length - 1];
      if (last && !last.__pending) last.__pending = true;
      writeLocal(rows);
      return { saved: false, row };
    }
    return { saved: true, row };
  } catch (err) {
    console.warn('[leadCapture] unexpected failure:', err?.message || err);
    return { saved: false };
  }
}

/** Turn the assessment engine output into a compact, readable recommendation. */
export function summarizeRecommendation({ careerEngine, result } = {}) {
  try {
    const ranked = careerEngine?.ranked || [];
    if (ranked.length) {
      return {
        primary: ranked[0]?.career?.title || ranked[0]?.career?.id || null,
        level: ranked[0]?.level || null,
        score: typeof ranked[0]?.score === 'number' ? Math.round(ranked[0].score) : null,
        top: ranked.slice(0, 5).map((r) => ({
          career: r?.career?.title || r?.career?.id || null,
          score: typeof r?.score === 'number' ? Math.round(r.score) : null,
          level: r?.level || null,
        })),
        direction: careerEngine?.primary?.title || careerEngine?.primary?.id || null,
      };
    }
    // Non class-12 flows (graduation / parent) carry their own result shape.
    if (result && typeof result === 'object') {
      return {
        primary: result.primaryCareer || result.title || result.headline || null,
        highlights: Array.isArray(result.highlights) ? result.highlights.slice(0, 5) : undefined,
        raw: result,
      };
    }
    return null;
  } catch {
    return null;
  }
}

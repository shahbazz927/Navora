// ============================================================================
// NAVORA backend Supabase helpers (dependency-free, fetch-based).
// - verifySupabaseUser(): validates the Supabase JWT by calling Auth getUser.
//   Never decode-and-trust; the Auth server is the verifier.
// - Service-role REST helpers for subscriptions / ai_usage / profiles.
//   SERVICE ROLE KEY NEVER LEAVES THE SERVER.
// ============================================================================

function supabaseUrl() {
  return (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
}
function anonKey() {
  return (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim();
}
function serviceKey() {
  return (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
}
function restHeaders(key) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
}

export function isSupabaseServerConfigured() {
  return Boolean(supabaseUrl() && anonKey());
}
export function isServiceRoleConfigured() {
  return Boolean(supabaseUrl() && serviceKey());
}

/** Extract Bearer token from request headers. Returns '' when absent. */
export function bearerToken(req) {
  const h = req.headers?.authorization || req.headers?.Authorization || '';
  const m = String(h).match(/^Bearer\s+(.+)$/i);
  return (m ? m[1] : '').trim();
}

/**
 * Verify Supabase JWT -> { id, email } or null.
 * Local mock tokens (local_jwt_*) are NEVER accepted here.
 */
export async function verifySupabaseUser(accessToken) {
  const token = String(accessToken || '').trim();
  if (!token || token.startsWith('local_jwt_')) return null;
  const url = supabaseUrl();
  const anon = anonKey();
  if (!url || !anon) return null;
  try {
    const res = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: anon, Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const user = await res.json();
    if (!user?.id) return null;
    return { id: user.id, email: user.email || null };
  } catch {
    return null;
  }
}

/** Service-role: fetch subscription row for user (canonical `status` col). */
export async function getSubscriptionRow(userId) {
  if (!isServiceRoleConfigured() || !userId) return null;
  try {
    const res = await fetch(
      `${supabaseUrl()}/rest/v1/subscriptions?user_id=eq.${encodeURIComponent(userId)}&select=*`,
      { headers: restHeaders(serviceKey()) },
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return Array.isArray(rows) ? rows[0] || null : null;
  } catch {
    return null;
  }
}

/** Service-role: upsert subscription (webhook path ONLY). */
export async function upsertSubscriptionRow(row) {
  if (!isServiceRoleConfigured()) throw new Error('SERVICE_ROLE_NOT_CONFIGURED');
  const res = await fetch(`${supabaseUrl()}/rest/v1/subscriptions`, {
    method: 'POST',
    headers: { ...restHeaders(serviceKey()), Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`SUBSCRIPTION_UPSERT_FAILED: ${res.status} ${t.slice(0, 200)}`);
  }
  return true;
}

/**
 * Atomically increment today's AI usage via RPC increment_ai_usage().
 * Returns { count } or { count: null } when service-role is unavailable
 * (caller must then fail-safe: allow anon demo path only, never grant Pro).
 */
export async function incrementAiUsage(userId, dateStr) {
  if (!isServiceRoleConfigured() || !userId) return { count: null };
  try {
    const res = await fetch(`${supabaseUrl()}/rest/v1/rpc/increment_ai_usage`, {
      method: 'POST',
      headers: restHeaders(serviceKey()),
      body: JSON.stringify({ p_user_id: userId, p_date: dateStr || new Date().toISOString().slice(0, 10) }),
    });
    if (!res.ok) return { count: null };
    const count = await res.json();
    return { count: typeof count === 'number' ? count : null };
  } catch {
    return { count: null };
  }
}

/** Service-role: read today's AI usage count (for entitlement display). */
export async function getAiUsageCount(userId, dateStr) {
  if (!isServiceRoleConfigured() || !userId) return null;
  try {
    const day = dateStr || new Date().toISOString().slice(0, 10);
    const res = await fetch(
      `${supabaseUrl()}/rest/v1/ai_usage?user_id=eq.${encodeURIComponent(userId)}&usage_date=eq.${day}&select=request_count`,
      { headers: restHeaders(serviceKey()) },
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return Array.isArray(rows) && rows[0] ? Number(rows[0].request_count) || 0 : 0;
  } catch {
    return null;
  }
}

/** Service-role: is this user an admin? */
export async function isAdminUser(userId) {
  if (!isServiceRoleConfigured() || !userId) return false;
  try {
    const res = await fetch(
      `${supabaseUrl()}/rest/v1/profiles?user_id=eq.${encodeURIComponent(userId)}&select=role`,
      { headers: restHeaders(serviceKey()) },
    );
    if (!res.ok) return false;
    const rows = await res.json();
    return Array.isArray(rows) && rows[0]?.role === 'admin';
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------- payments
/** Find a payment record by provider payment id (idempotency lookup). */
export async function findPaymentByProviderId(paymentId) {
  if (!isServiceRoleConfigured() || !paymentId) return null;
  try {
    const res = await fetch(
      `${supabaseUrl()}/rest/v1/payments?provider=eq.razorpay&provider_payment_id=eq.${encodeURIComponent(paymentId)}&select=*`,
      { headers: restHeaders(serviceKey()) },
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return Array.isArray(rows) ? rows[0] || null : null;
  } catch {
    return null;
  }
}

/** Insert a payment audit row. Returns row or null. Duplicate => returns existing. */
export async function insertPaymentRow(row) {
  if (!isServiceRoleConfigured()) throw new Error('SERVICE_ROLE_NOT_CONFIGURED');
  if (row?.provider_payment_id) {
    const existing = await findPaymentByProviderId(row.provider_payment_id);
    if (existing) return { row: existing, duplicate: true };
  }
  const res = await fetch(`${supabaseUrl()}/rest/v1/payments`, {
    method: 'POST',
    headers: { ...restHeaders(serviceKey()), Prefer: 'return=representation' },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    // 409 (unique violation from a parallel webhook) => treat as duplicate
    if (res.status === 409 && row?.provider_payment_id) {
      const existing = await findPaymentByProviderId(row.provider_payment_id);
      if (existing) return { row: existing, duplicate: true };
    }
    const t = await res.text().catch(() => '');
    throw new Error(`PAYMENT_INSERT_FAILED: ${res.status} ${t.slice(0, 200)}`);
  }
  const rows = await res.json().catch(() => []);
  return { row: Array.isArray(rows) ? rows[0] : null, duplicate: false };
}

/** Mark a payment row status (paid/failed). Best-effort. */
export async function updatePaymentStatus(paymentId, status) {
  if (!isServiceRoleConfigured() || !paymentId) return;
  try {
    await fetch(
      `${supabaseUrl()}/rest/v1/payments?provider=eq.razorpay&provider_payment_id=eq.${encodeURIComponent(paymentId)}`,
      {
        method: 'PATCH',
        headers: restHeaders(serviceKey()),
        body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
      },
    );
  } catch { /* audit only */ }
}

/**
 * Idempotent Pro activation for a verified Razorpay payment.
 * - Same payment verified twice => single subscription, single paid record.
 * - started_at = server now, expires_at = now + 365 days.
 * Returns { subscription, alreadyActive }.
 */
export async function activateProForPayment({ userId, orderId, paymentId, amount, currency }) {
  if (!isServiceRoleConfigured()) throw new Error('SERVICE_ROLE_NOT_CONFIGURED');
  const now = new Date();
  const expires = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

  const { duplicate } = await insertPaymentRow({
    user_id: userId,
    provider: 'razorpay',
    provider_order_id: orderId || null,
    provider_payment_id: paymentId,
    amount: amount ?? 99900,
    currency: currency || 'INR',
    status: 'paid',
  });

  // Refresh/extend from server now (never trust client timestamps).
  await upsertSubscriptionRow({
    user_id: userId,
    plan: 'pro',
    status: 'active',
    provider: 'razorpay',
    provider_customer_id: null,
    provider_subscription_id: null,
    provider_order_id: orderId || null,
    provider_payment_id: paymentId,
    amount: amount ?? 99900,
    currency: currency || 'INR',
    started_at: now.toISOString(),
    current_period_start: now.toISOString(),
    current_period_end: expires.toISOString(),
    expires_at: expires.toISOString(),
    updated_at: now.toISOString(),
  });
  return { expiresAt: expires.toISOString(), alreadyActive: duplicate };
}

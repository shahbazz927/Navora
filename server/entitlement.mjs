// ============================================================================
// NAVORA canonical entitlement config — SINGLE SOURCE OF TRUTH (backend)
// Frontend (src/lib/entitlements.js) mirrors these values for display only.
// Backend remains authoritative: never trust plan/isPro from client.
// Spec: Free 5 AI/day, Pro 30 AI/day; college 2/10; country 2/10;
//       university 0 / 20-per-month; saved 5 / unlimited.
// ============================================================================

export const FREE_PLAN = {
  id: 'free',
  aiDailyLimit: 5,
  collegeComparisonLimit: 2,
  countryComparisonLimit: 2,
  universityComparisonLimit: 0,
  universityComparisonPeriod: 'month',
  savedLimit: 5,
  fullCareerMap: false,
  fullCourses: false,
  personalizedRoadmap: false,
  personalizedScholarships: false,
  pdfReports: false,
  courseComparison: false,
  detailedFees: false,
  fullGlobalStudy: false,
};

export const PRO_PLAN = {
  id: 'pro',
  aiDailyLimit: 30,
  collegeComparisonLimit: 10,
  countryComparisonLimit: 10,
  universityComparisonLimit: 20,
  universityComparisonPeriod: 'month',
  savedLimit: Infinity,
  fullCareerMap: true,
  fullCourses: true,
  personalizedRoadmap: true,
  personalizedScholarships: true,
  pdfReports: true,
  courseComparison: true,
  detailedFees: true,
  fullGlobalStudy: true,
};

const INFINITE = 'unlimited';
function serializable(plan) {
  const out = { ...plan };
  for (const k of Object.keys(out)) if (out[k] === Infinity) out[k] = INFINITE;
  return out;
}
export function planFeatures(planId) {
  return serializable(planId === 'pro' ? PRO_PLAN : FREE_PLAN);
}

/**
 * Resolve effective plan from a subscriptions row.
 * Fail-safe: unknown/expired/cancelled-past-period => free.
 * A Pro subscription is active only while status=active AND
 * (expires_at is null [legacy rows] OR expires_at > now).
 * - active => pro (subject to expiry above)
 * - trialing/past_due => pro (grace)
 * - cancelled => pro only while current_period_end/expires_at is in the future
 * - expired / null / anything else => free
 */
export function isExpired(sub) {
  const exp = sub?.expires_at || sub?.current_period_end || null;
  if (!exp) return false; // legacy row without expiry: do not force-demote
  try { return new Date(exp) <= new Date(); } catch { return false; }
}

export function resolvePlan(sub) {
  if (!sub || sub.plan !== 'pro') return 'free';
  const status = sub.status || 'expired';
  if (status === 'expired') return 'free';
  if (isExpired(sub)) return 'free';
  if (status === 'active' || status === 'trialing' || status === 'past_due') return 'pro';
  if (status === 'cancelled') {
    try {
      const end = sub.current_period_end ? new Date(sub.current_period_end) : null;
      if (end && end > new Date()) return 'pro';
    } catch { /* fall through to free */ }
    return 'free';
  }
  return 'free';
}

/** Build the entitlement object returned to frontend + used for enforcement. */
export function getUserEntitlement(subRow) {
  const plan = resolvePlan(subRow);
  const status = subRow?.status || (plan === 'pro' ? 'active' : 'active');
  return {
    plan,
    status: plan === 'free' ? (subRow?.status || 'active') : status,
    features: planFeatures(plan),
    // server-computed, never client-supplied
    currentPeriodEnd: subRow?.expires_at || subRow?.current_period_end || null,
    expiresAt: subRow?.expires_at || null,
  };
}

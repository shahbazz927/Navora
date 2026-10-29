// ============================================================================
// NAVORA canonical entitlement config — SINGLE SOURCE OF TRUTH (backend)
// Frontend (src/lib/entitlements.js) mirrors these values for display only.
// Backend remains authoritative: never trust plan/isPro from client.
//
// PAID MODE IS OFF: there is a single plan and it unlocks everything —
// no feature gates, no quotas, no expiry. A stored subscription row no
// longer changes what a user can do; every signed-in user gets full access.
// ============================================================================

export const FREE_PLAN = {
  id: 'free',
  aiDailyLimit: Infinity,
  collegeComparisonLimit: Infinity,
  countryComparisonLimit: Infinity,
  universityComparisonLimit: Infinity,
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

// One plan, full access — the plan id is ignored while paid mode is off.
export function planFeatures() {
  return serializable(FREE_PLAN);
}

/**
 * Resolve the effective plan. Paid mode is off, so this is always 'free' —
 * kept as a function so the paid tier can be switched back on in one place.
 */
export function resolvePlan() {
  return 'free';
}

/** Build the entitlement object returned to frontend + used for enforcement. */
export function getUserEntitlement() {
  return {
    plan: 'free',
    status: 'active',
    features: planFeatures(),
    currentPeriodEnd: null,
    expiresAt: null,
  };
}

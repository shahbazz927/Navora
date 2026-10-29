// Centralized entitlement config — single source of truth.
//
// PAID MODE IS OFF: there is exactly one plan and it unlocks everything.
// Every limit is Infinity and every feature flag is on, so nothing in the
// product is gated. Re-introducing a paid tier later means adding a second
// entry here and re-wiring the callers that branch on `isPro`.
export const PLANS = {
  free: {
    id: 'free',
    name: 'NAVORA',
    shortName: 'Free',
    price: 0,
    currency: 'INR',
    billing: 'forever',
    label: 'Free',
    ai_daily_limit: Infinity,
    career_recommendation_limit: Infinity,
    college_compare_limit: Infinity,
    country_compare_limit: Infinity,
    university_compare_limit: Infinity,
    saved_limit: Infinity,
    personalized_roadmap: true,
    pdf_reports: true,
    full_global_study: true,
    course_comparison: true,
    detailed_fees: true,
    conversation_history: true,
    profile_aware: true,
  },
};

export function getPlan() {
  return PLANS.free;
}

// Feature gates — everything is open while paid mode is off.
export function canAccess(feature) {
  const p = getPlan();
  const map = {
    personalized_roadmap: p.personalized_roadmap,
    pdf_reports: p.pdf_reports,
    full_global_study: p.full_global_study,
    course_comparison: p.course_comparison,
    detailed_fees: p.detailed_fees,
    conversation_history: p.conversation_history,
  };
  return map[feature] ?? true;
}

export function limitFor(kind) {
  return getPlan()[kind] ?? Infinity;
}

// Analytics helper (no PII)
export function track(event, data={}) {
  try {
    if (typeof window !== 'undefined' && window.gtag) window.gtag('event', event, data);
    // also console for dev
    if (import.meta.env?.DEV) console.log('[analytics]', event, data);
  } catch {}
}

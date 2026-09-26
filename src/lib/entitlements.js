// Centralized entitlement config — single source of truth
export const PLANS = {
  free: {
    id: 'free',
    name: 'NAVORA Free',
    shortName: 'Free',
    price: 0,
    currency: 'INR',
    billing: 'forever',
    label: '₹0 Forever',
    ai_daily_limit: 5,
    career_recommendation_limit: 3,
    college_compare_limit: 2,
    country_compare_limit: 2,
    university_compare_limit: 0,
    saved_limit: 5,
    personalized_roadmap: false,
    pdf_reports: false,
    full_global_study: false,
    course_comparison: false,
    detailed_fees: false,
    conversation_history: false,
    profile_aware: false,
  },
  pro: {
    id: 'pro',
    name: 'NAVORA Pro',
    shortName: 'Pro',
    price: 999,
    currency: 'INR',
    billing: 'yearly',
    label: '₹999/year',
    monthlyEquivalent: 83,
    ai_daily_limit: 30,
    career_recommendation_limit: Infinity,
    college_compare_limit: 10,
    country_compare_limit: 10,
    university_compare_limit: 20, // per month
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

export function getPlan(planId) {
  return PLANS[planId] || PLANS.free;
}

export function isPro(planId) {
  return planId === 'pro';
}

// Feature gates — pure functions, testable
export function canAccess(planId, feature) {
  const p = getPlan(planId);
  const map = {
    personalized_roadmap: p.personalized_roadmap,
    pdf_reports: p.pdf_reports,
    full_global_study: p.full_global_study,
    course_comparison: p.course_comparison,
    detailed_fees: p.detailed_fees,
    conversation_history: p.conversation_history,
  };
  return map[feature] ?? false;
}

export function limitFor(planId, kind) {
  return getPlan(planId)[kind] ?? 0;
}

// Analytics helper (no PII)
export function track(event, data={}) {
  try {
    if (typeof window !== 'undefined' && window.gtag) window.gtag('event', event, data);
    // also console for dev
    if (import.meta.env?.DEV) console.log('[analytics]', event, data);
  } catch {}
}

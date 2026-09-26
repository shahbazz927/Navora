// Dashboard data helpers — real user data only, no fabrication.

export function relativeTime(iso) {
  if (!iso) return '';
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '';
  const mins = Math.max(0, Math.floor((Date.now() - t) / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d === 1 ? '' : 's'} ago`;
  const m = Math.floor(d / 30);
  return `${m} month${m === 1 ? '' : 's'} ago`;
}

function str(v) {
  if (v == null) return '';
  if (typeof v === 'string') return v.trim();
  if (Array.isArray(v)) return v.map(str).filter(Boolean).join(', ');
  if (typeof v === 'object') return str(v.label ?? v.value ?? v.name);
  return String(v);
}

/**
 * Profile completion (0–100) from actual fields.
 * Fields: academic info, stream/degree, subjects, interests, strengths,
 * goals, budget, location, work/style preferences.
 */
export function profileCompletion(answers = {}, onboarding = {}) {
  const a = answers || {};
  const checks = [
    Boolean(str(a.stream || a.streamV2 || a.currentDegree || a.degree)),
    Boolean(str(a.marks || a.percentage || a.cgpa || a.board)),
    Boolean(str(a.board || a.university)),
    Boolean((Array.isArray(a.subjects) ? a.subjects : [a.favoriteSubject]).filter(Boolean).length),
    Boolean(str(a.interests || a.interest || a.interestArea || a.subjectInterests)),
    Boolean(str(a.strengths || a.skills)),
    Boolean(str(a.goal || a.futureDirection || a.careerGoal || a.motivation)),
    Boolean(str(a.budget || a.budgetId)),
    Boolean(str(a.preferredLocation || a.location || a.city || a.preference)),
    Boolean(str(a.workStyle || a.work || a.studyCommitment || onboarding?.studyPreference)),
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

/** First name from profile sources. Returns '' when unknown. */
export function firstName({ onboarding = {}, user } = {}) {
  const full = (onboarding?.name || user?.user_metadata?.full_name || '').trim();
  if (full) return full.split(/\s+/)[0];
  const email = user?.email || '';
  if (email.includes('@')) return email.split('@')[0];
  return '';
}

/**
 * Real recent activity assembled from existing client state:
 * assessment save, chat messages, saved colleges/scholarships, comparisons.
 * Sorted newest-first. Empty array => genuine "no activity yet".
 */
export function buildActivity({ answers, chatHistory = [], savedColleges = [], savedScholarships = [], comparisonItems = [], remoteCreatedAt } = {}) {
  const items = [];
  const savedAt = answers?.lastSavedAt || remoteCreatedAt;
  if (savedAt) {
    items.push({
      id: 'assessment',
      icon: 'assessment',
      text: 'You completed your Interest Assessment',
      at: savedAt,
    });
  }
  const lastAssistant = [...chatHistory].reverse().find((m) => m?.role === 'assistant' && m?.timestamp);
  const lastUser = [...chatHistory].reverse().find((m) => m?.role === 'user' && m?.timestamp);
  const lastChat = lastUser && (!lastAssistant || new Date(lastUser.timestamp) >= new Date(lastAssistant.timestamp))
    ? lastUser : lastAssistant;
  if (lastChat) {
    const q = String(lastChat.content || '').slice(0, 60);
    items.push({
      id: 'chat',
      icon: 'chat',
      text: lastChat.role === 'user' ? `You asked AI Advisor about “${q}${q.length >= 60 ? '…' : ''}”` : 'You chatted with AI Advisor',
      at: lastChat.timestamp,
    });
  }
  if (savedColleges.length) {
    items.push({ id: 'saved-colleges', icon: 'college', text: `You saved ${savedColleges.length} college${savedColleges.length === 1 ? '' : 's'} to your shortlist`, at: savedAt || new Date().toISOString() });
  }
  if (savedScholarships.length) {
    items.push({ id: 'saved-scholarships', icon: 'scholarship', text: `You saved ${savedScholarships.length} scholarship${savedScholarships.length === 1 ? '' : 's'}`, at: savedAt || new Date().toISOString() });
  }
  if (comparisonItems.length) {
    items.push({ id: 'compare', icon: 'compare', text: `You compared ${comparisonItems.length} course${comparisonItems.length === 1 ? '' : 's'}`, at: savedAt || new Date().toISOString() });
  }
  return items
    .filter((i) => i.at && !Number.isNaN(new Date(i.at).getTime()))
    .sort((x, y) => new Date(y.at) - new Date(x.at))
    .slice(0, 6);
}

// Scholarship eligibility matching — keeps Availability vs Eligibility strictly separate (§6, §27)
// Availability = "scholarship is linked to this institution" (via college_scholarships)
// Eligibility = "does YOUR profile appear to satisfy listed criteria?" — never claims definite eligibility
// Uses only existing NAVORA profile fields; does not ask what we already know

export const PROFILE_MATCH = {
  YOU_MAY_BE_ELIGIBLE: 'YOU_MAY_BE_ELIGIBLE',
  POTENTIAL_MATCH: 'POTENTIAL_MATCH',
  MORE_INFO_REQUIRED: 'MORE_INFO_REQUIRED',
  DOES_NOT_APPEAR: 'DOES_NOT_APPEAR',
};

export function getMatchLabel(match) {
  switch (match) {
    case PROFILE_MATCH.YOU_MAY_BE_ELIGIBLE: return 'You may be eligible';
    case PROFILE_MATCH.POTENTIAL_MATCH: return 'Potential match';
    case PROFILE_MATCH.MORE_INFO_REQUIRED: return 'More information required';
    case PROFILE_MATCH.DOES_NOT_APPEAR: return 'Does not appear to meet the listed requirements';
    default: return 'More information required';
  }
}

// Normalize profile from UserContext answers + onboardingData
export function normalizeProfile({ answers = {}, onboardingData = {}, institution = null } = {}) {
  const stream = (answers.stream || answers.streamV2 || answers.academicStream || answers.class12Stream || '').toString().toLowerCase();
  const degree = (answers.degree || answers.currentDegree || answers.targetDegree || answers.graduationDegree || '').toString().toLowerCase();
  const state = (answers.state || answers.domicileState || onboardingData.state || institution?.state || '').toString();
  // percentage / cgpa may be in answers.percentage, cgpa, marks, academicScore
  const percentage = answers.percentage != null ? Number(answers.percentage) : answers.marks != null ? Number(answers.marks) : answers.academicScore != null ? Number(answers.academicScore) : null;
  const cgpa = answers.cgpa != null ? Number(answers.cgpa) : null;
  const income = answers.familyIncome != null ? Number(answers.familyIncome) : answers.income != null ? Number(answers.income) : answers.annualIncome != null ? Number(answers.annualIncome) : null;
  const gender = (answers.gender || onboardingData.gender || '').toString().toLowerCase();
  const category = (answers.category || answers.casteCategory || '').toString().toUpperCase();
  const disability = answers.disability ? true : false;
  const educationLevel = (() => {
    const lvl = (answers.educationLevel || answers.level || '').toString().toUpperCase();
    if (lvl) return lvl;
    if (degree.includes('b.tech') || degree.includes('b.e') || degree.includes('b.com') || degree.includes('b.sc') || degree.includes('bba') || degree.includes('bca') || degree.includes('ba')) return 'UG';
    if (degree.includes('m.tech') || degree.includes('mba') || degree.includes('mca') || degree.includes('m.sc')) return 'PG';
    if (stream.includes('mpc') || stream.includes('bipc') || stream.includes('mec') || stream.includes('cec')) return 'UG';
    return null;
  })();
  const course = degree || (answers.course || '').toString();
  const nationality = (answers.nationality || onboardingData.nationality || 'India').toString();
  return { stream, degree, course, educationLevel, state, percentage: Number.isFinite(percentage)?percentage:null, cgpa: Number.isFinite(cgpa)?cgpa:null, income: Number.isFinite(income)?income:null, gender, category, disability, nationality, rawAnswers: answers };
}

export function evaluateEligibility(scholarship, profile) {
  // Returns { match, reasons: [{ok:bool, text}], missing: [] }
  if (!scholarship) return { match: PROFILE_MATCH.MORE_INFO_REQUIRED, reasons: [], missing: [] };
  const reasons = [];
  let fail = false;
  let missing = 0;

  const has = (arr) => Array.isArray(arr) && arr.length > 0;

  // Education level
  if (has(scholarship.education_levels)) {
    if (!profile.educationLevel) { reasons.push({ ok: null, text: 'Education level not in profile — cannot confirm' }); missing++; }
    else {
      const ok = scholarship.education_levels.some(l => l.toLowerCase() === profile.educationLevel.toLowerCase() || profile.educationLevel.toLowerCase().includes(l.toLowerCase()));
      reasons.push({ ok, text: ok ? `Education level matches (${profile.educationLevel})` : `Requires ${scholarship.education_levels.join('/')} — your profile shows ${profile.educationLevel || 'unknown'}` });
      if (!ok) fail = true;
    }
  }

  // Course / degree
  if (has(scholarship.eligible_courses) || has(scholarship.eligible_degrees)) {
    const list = [...(scholarship.eligible_courses||[]), ...(scholarship.eligible_degrees||[])];
    const probe = `${profile.course} ${profile.degree} ${profile.stream}`.toLowerCase();
    if (!probe.trim()) { reasons.push({ ok: null, text: 'Course not in profile — cannot confirm course eligibility' }); missing++; }
    else {
      const ok = list.some(c => probe.includes(String(c).toLowerCase()));
      if (!ok) { // not a hard fail — course lists are often non-exhaustive, treat as neutral unless explicit mismatch
        reasons.push({ ok: null, text: `Course criteria: ${list.slice(0,3).join(', ')} — your course: ${profile.course || profile.degree || 'not specified'}` });
        missing++;
      } else reasons.push({ ok: true, text: `Your course appears eligible (${profile.course || profile.degree})` });
    }
  }

  // Percentage
  if (scholarship.minimum_percentage != null) {
    if (profile.percentage == null) { reasons.push({ ok: null, text: `Requires ${scholarship.minimum_percentage}% — your score not in profile` }); missing++; }
    else {
      const ok = profile.percentage >= Number(scholarship.minimum_percentage);
      reasons.push({ ok, text: ok ? `Your score ${profile.percentage}% meets minimum ${scholarship.minimum_percentage}%` : `Requires ${scholarship.minimum_percentage}% — your score ${profile.percentage}% appears below` });
      if (!ok) fail = true;
    }
  }
  if (scholarship.minimum_cgpa != null) {
    if (profile.cgpa == null) { reasons.push({ ok: null, text: `Requires CGPA ${scholarship.minimum_cgpa} — not in profile` }); missing++; }
    else {
      const ok = profile.cgpa >= Number(scholarship.minimum_cgpa);
      reasons.push({ ok, text: ok ? `Your CGPA ${profile.cgpa} meets minimum` : `Requires CGPA ${scholarship.minimum_cgpa}` });
      if (!ok) fail = true;
    }
  }

  // Income
  if (scholarship.income_limit != null) {
    if (profile.income == null) { reasons.push({ ok: null, text: `Income limit ₹${Number(scholarship.income_limit).toLocaleString('en-IN')} — your family income not in profile` }); missing++; }
    else {
      const ok = profile.income <= Number(scholarship.income_limit);
      reasons.push({ ok, text: ok ? `Your family income appears within limit` : `Income limit ₹${Number(scholarship.income_limit).toLocaleString('en-IN')} — appears above your bracket` });
      if (!ok) fail = true;
    }
  }

  // State / domicile
  if (has(scholarship.eligible_states)) {
    if (!profile.state) { reasons.push({ ok: null, text: `State eligibility: ${scholarship.eligible_states.join(', ')} — your state not in profile` }); missing++; }
    else {
      const ok = scholarship.eligible_states.some(s => s.toLowerCase() === profile.state.toLowerCase());
      reasons.push({ ok, text: ok ? `Your state ${profile.state} is eligible` : `Requires domicile in ${scholarship.eligible_states.join('/')} — your state ${profile.state}` });
      if (!ok) fail = true;
    }
  }

  // Nationality
  if (has(scholarship.eligible_nationalities)) {
    const ok = scholarship.eligible_nationalities.some(n => n.toLowerCase() === profile.nationality.toLowerCase() || n.toLowerCase() === 'india' && profile.nationality.toLowerCase() === 'india');
    if (!ok) { reasons.push({ ok:false, text:`Requires nationality: ${scholarship.eligible_nationalities.join(', ')}` }); fail = true; }
    else reasons.push({ ok:true, text:`Nationality requirement satisfied` });
  }

  // Gender — only where legally appropriate (§5)
  if (scholarship.gender_requirement && scholarship.gender_requirement.toLowerCase() !== 'any' && scholarship.gender_requirement.toLowerCase() !== 'all') {
    if (!profile.gender) { reasons.push({ ok:null, text:`Gender requirement: ${scholarship.gender_requirement} — not in profile` }); missing++; }
    else {
      const ok = profile.gender.toLowerCase() === scholarship.gender_requirement.toLowerCase();
      reasons.push({ ok, text: ok ? `Gender requirement satisfied` : `Requires ${scholarship.gender_requirement}` });
      if (!ok) fail = true;
    }
  }

  // Category
  if (has(scholarship.category_requirement)) {
    const cats = scholarship.category_requirement.map(c=>c.toUpperCase());
    if (!profile.category) { reasons.push({ ok:null, text:`Category: ${cats.join('/')} — your category not in profile` }); missing++; }
    else {
      const ok = cats.includes(profile.category) || cats.includes('GENERAL') || cats.includes('ALL');
      reasons.push({ ok, text: ok ? `Category ${profile.category} eligible` : `Requires ${cats.join('/')} — your category ${profile.category}` });
      if (!ok) fail=true;
    }
  }

  let match;
  if (fail) match = PROFILE_MATCH.DOES_NOT_APPEAR;
  else if (missing > 0) match = reasons.length === 0 ? PROFILE_MATCH.MORE_INFO_REQUIRED : PROFILE_MATCH.MORE_INFO_REQUIRED;
  else if (reasons.length === 0) match = PROFILE_MATCH.POTENTIAL_MATCH;
  else match = PROFILE_MATCH.YOU_MAY_BE_ELIGIBLE;

  // If no hard checks but some neutral, downgrade to potential
  if (match === PROFILE_MATCH.YOU_MAY_BE_ELIGIBLE && missing>0) match = PROFILE_MATCH.POTENTIAL_MATCH;

  return { match, reasons, missing };
}

export function isScholarshipActive(s) {
  if (!s) return false;
  if (s.status === 'expired' || s.verification_status === 'EXPIRED') return false;
  if (s.application_deadline) {
    const d = new Date(s.application_deadline);
    if (!isNaN(d) && d < new Date(new Date().toDateString())) return false;
  }
  return s.status === 'active' || !s.status;
}

export function deadlineBucket(s) {
  if (!s?.application_deadline) return 'unknown';
  const d = new Date(s.application_deadline); const now = new Date(); const diff = (d - now)/86400000;
  if (diff < 0) return 'expired';
  if (diff <= 30) return 'closing_soon';
  if (diff <= 90) return 'open';
  return 'upcoming';
}

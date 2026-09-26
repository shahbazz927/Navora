// ============================================================================
// NAVORA — College Discovery Repository & Data Engine
// Normalized data access layer with Supabase persistence and localStorage fallback
// ============================================================================

import { HYDERABAD_INSTITUTIONS, DATA_STATUS } from '../data/hyderabadInstitutionsData';
import { supabase } from './supabase';

const STORAGE_SAVED_KEY = 'navora_saved_colleges_v1';
const STORAGE_CUSTOM_INSTITUTIONS_KEY = 'navora_custom_institutions_v1';

// Load any admin additions/updates from localStorage
function getMergedInstitutions() {
  let custom = [];
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_INSTITUTIONS_KEY);
    if (raw) custom = JSON.parse(raw);
  } catch {}

  const map = new Map();
  // Base verified list
  HYDERABAD_INSTITUTIONS.forEach((inst) => map.set(inst.id, { ...inst }));
  // Overwrite or append with admin edits
  custom.forEach((inst) => map.set(inst.id, { ...(map.get(inst.id) || {}), ...inst }));

  return Array.from(map.values());
}

/**
 * Filter & search institutions with pagination and sorting
 */
export async function getInstitutions({
  search = '',
  level = 'ALL', // 'UG', 'PG', 'Integrated', 'ALL'
  course = '',
  specialization = '',
  city = '',
  state = '',
  institutionType = '',
  budgetRange = '', // 'under-50k', '50k-1lakh', etc.
  hostelRequired = 'either', // 'required', 'not_required', 'either'
  entranceExam = '',
  sort = 'relevance', // 'relevance', 'fee_asc', 'fee_desc', 'verified_date', 'name_asc'
  page = 1,
  pageSize = 9,
} = {}) {
  // Attempt Supabase query if available and table exists
  try {
    const { data: dbData, error } = await supabase.from('institutions').select('*');
    if (!error && Array.isArray(dbData) && dbData.length > 0) {
      // Use database data
    }
  } catch {
    // Continue with in-memory repository
  }

  let list = getMergedInstitutions();

  // Search filter (name, shortName, city, degrees, specializations)
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter((inst) => {
      const matchName = inst.name.toLowerCase().includes(q) || inst.shortName.toLowerCase().includes(q);
      const matchLoc = inst.location.toLowerCase().includes(q) || inst.city.toLowerCase().includes(q) || inst.subLocation.toLowerCase().includes(q);
      const matchAffil = (inst.universityAffiliation || '').toLowerCase().includes(q);
      const matchType = (inst.institutionType || '').toLowerCase().includes(q);
      const matchDegree = (inst.majorDegrees || []).some((d) => d.toLowerCase().includes(q));
      const matchCourses = (inst.coursesList || []).some(
        (c) =>
          c.courseName.toLowerCase().includes(q) ||
          c.degree.toLowerCase().includes(q) ||
          (c.specialization || '').toLowerCase().includes(q)
      );
      return matchName || matchLoc || matchAffil || matchType || matchDegree || matchCourses;
    });
  }

  // Academic Level filter ('UG', 'PG', 'Integrated')
  if (level && level !== 'ALL') {
    list = list.filter((inst) => (inst.levels || []).includes(level));
  }

  // Course filter
  if (course && course !== 'ALL') {
    list = list.filter((inst) =>
      (inst.majorDegrees || []).some((d) => d.toLowerCase() === course.toLowerCase()) ||
      (inst.coursesList || []).some((c) => c.degree.toLowerCase() === course.toLowerCase())
    );
  }

  // Specialization filter
  if (specialization && specialization !== 'ALL') {
    const specLower = specialization.toLowerCase();
    list = list.filter((inst) =>
      (inst.coursesList || []).some((c) => (c.specialization || '').toLowerCase().includes(specLower))
    );
  }

  // Location / City filter
  if (city && city !== 'ALL') {
    const cityLower = city.toLowerCase();
    list = list.filter(
      (inst) =>
        inst.city.toLowerCase().includes(cityLower) ||
        (inst.subLocation || '').toLowerCase().includes(cityLower) ||
        inst.location.toLowerCase().includes(cityLower)
    );
  }

  // Institution Type filter
  if (institutionType && institutionType !== 'All Types' && institutionType !== 'ALL') {
    list = list.filter((inst) => inst.institutionType === institutionType);
  }

  // Hostel requirement
  if (hostelRequired === 'required') {
    list = list.filter((inst) => inst.hostelAvailable === true);
  } else if (hostelRequired === 'not_required') {
    list = list.filter((inst) => inst.hostelAvailable === false);
  }

  // Entrance Exam filter
  if (entranceExam && entranceExam !== 'ALL') {
    const examLower = entranceExam.toLowerCase();
    list = list.filter((inst) =>
      (inst.entranceExams || []).some((e) => e.toLowerCase().includes(examLower)) ||
      (inst.coursesList || []).some((c) => (c.entranceExam || '').toLowerCase().includes(examLower))
    );
  }

  // Budget Range filter
  if (budgetRange && budgetRange !== 'ALL') {
    if (budgetRange === 'under-50k') {
      list = list.filter((inst) => (inst.minAnnualFee || 0) <= 50000);
    } else if (budgetRange === '50k-1lakh') {
      list = list.filter((inst) => (inst.minAnnualFee || 0) <= 100000 && (inst.maxAnnualFee || inst.minAnnualFee || 0) >= 50000);
    } else if (budgetRange === '1lakh-2lakh') {
      list = list.filter((inst) => (inst.minAnnualFee || 0) <= 200000 && (inst.maxAnnualFee || inst.minAnnualFee || 0) >= 100000);
    } else if (budgetRange === '2lakh-5lakh') {
      list = list.filter((inst) => (inst.minAnnualFee || 0) <= 500000 && (inst.maxAnnualFee || inst.minAnnualFee || 0) >= 200000);
    } else if (budgetRange === '5lakh-plus') {
      list = list.filter((inst) => (inst.maxAnnualFee || inst.minAnnualFee || 0) >= 500000);
    }
  }

  // Sorting
  if (sort === 'fee_asc') {
    list.sort((a, b) => (a.minAnnualFee || 0) - (b.minAnnualFee || 0));
  } else if (sort === 'fee_desc') {
    list.sort((a, b) => (b.minAnnualFee || 0) - (a.minAnnualFee || 0));
  } else if (sort === 'verified_date') {
    list.sort((a, b) => new Date(b.verifiedDate || 0) - new Date(a.verifiedDate || 0));
  } else if (sort === 'name_asc') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // Relevance / verified priority
    list.sort((a, b) => (b.verificationStatus === DATA_STATUS.VERIFIED ? 1 : 0) - (a.verificationStatus === DATA_STATUS.VERIFIED ? 1 : 0));
  }

  const total = list.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const items = list.slice(start, start + pageSize);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Get single institution by slug or ID
 */
export async function getInstitutionBySlug(slugOrId) {
  const list = getMergedInstitutions();
  const match = list.find((inst) => inst.slug === slugOrId || inst.id === slugOrId);
  return match || null;
}

/**
 * Get multiple institutions for factual comparison
 */
export async function getCompareColleges(ids = []) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const list = getMergedInstitutions();
  return ids.map((id) => list.find((inst) => inst.id === id || inst.slug === id)).filter(Boolean);
}

/**
 * Saved colleges management (tied to Supabase auth or localStorage)
 */
export function getSavedCollegeIds(userId = null) {
  try {
    const raw = localStorage.getItem(`${STORAGE_SAVED_KEY}_${userId || 'guest'}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveCollege(institutionId, userId = null) {
  const current = getSavedCollegeIds(userId);
  if (!current.includes(institutionId)) {
    const updated = [...current, institutionId];
    try {
      localStorage.setItem(`${STORAGE_SAVED_KEY}_${userId || 'guest'}`, JSON.stringify(updated));
    } catch {}
    // If authenticated with Supabase, write to saved_colleges
    if (userId) {
      supabase.from('saved_colleges').insert({ user_id: userId, institution_id: institutionId }).catch(() => {});
    }
    return updated;
  }
  return current;
}

export function removeSavedCollege(institutionId, userId = null) {
  const current = getSavedCollegeIds(userId);
  const updated = current.filter((id) => id !== institutionId);
  try {
    localStorage.setItem(`${STORAGE_SAVED_KEY}_${userId || 'guest'}`, JSON.stringify(updated));
  } catch {}
  if (userId) {
    supabase.from('saved_colleges').delete().eq('user_id', userId).eq('institution_id', institutionId).catch(() => {});
  }
  return updated;
}

export function isCollegeSaved(institutionId, userId = null) {
  const current = getSavedCollegeIds(userId);
  return current.includes(institutionId);
}

/**
 * Match colleges based on NAVORA student questionnaire profile
 */
export function getMatchingCollegesForProfile(answers = {}, userType = 'class12') {
  const list = getMergedInstitutions();
  if (!answers || Object.keys(answers).length === 0) return [];

  const stream = (answers.stream || answers.streamV2 || '').toLowerCase();
  const degree = (answers.currentDegree || answers.degree || '').toLowerCase();

  return list.filter((inst) => {
    // MPC / Science PCM: Engineering & Technology, Architecture, Computer Science
    if (stream === 'mpc' || stream === 'science_pcm') {
      return (
        (inst.majorDegrees || []).some((d) => ['B.Tech', 'B.Sc', 'BCA', 'B.E.'].includes(d)) ||
        inst.institutionType.includes('Engineering') ||
        inst.institutionType.includes('Technology')
      );
    }
    // BiPC / Science PCB: Medical, Pharmacy, Nursing, Life Sciences
    if (stream === 'bipc' || stream === 'science_pcb') {
      return (
        (inst.majorDegrees || []).some((d) => ['MBBS', 'B.Pharm', 'Pharm.D', 'B.Sc'].includes(d)) ||
        inst.institutionType.includes('Medical') ||
        inst.institutionType.includes('Pharmacy')
      );
    }
    // MEC / Commerce: Commerce, BBA, Finance, Economics
    if (stream === 'mec' || stream === 'commerce') {
      return (
        (inst.majorDegrees || []).some((d) => ['B.Com', 'BBA', 'BCA', 'MBA'].includes(d)) ||
        inst.description.toLowerCase().includes('commerce') ||
        inst.description.toLowerCase().includes('management')
      );
    }
    // CEC / Arts / Humanities: Law, Arts, Commerce, Public Policy
    if (stream === 'cec' || stream === 'arts') {
      return (
        (inst.majorDegrees || []).some((d) => ['BA', 'B.Com', 'BA LL.B.', 'BBA'].includes(d)) ||
        inst.institutionType.includes('Law') ||
        inst.description.toLowerCase().includes('languages')
      );
    }
    // Graduate flow: PG colleges (MBA, MCA, M.Tech, M.Sc, etc.)
    if (userType === 'graduate' || degree) {
      return (inst.levels || []).includes('PG');
    }
    return true;
  });
}

/**
 * Admin CRUD operations
 */
export function adminSaveInstitution(institutionData) {
  let custom = [];
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_INSTITUTIONS_KEY);
    if (raw) custom = JSON.parse(raw);
  } catch {}

  const existingIndex = custom.findIndex((c) => c.id === institutionData.id);
  const updatedRecord = {
    ...institutionData,
    updatedAt: new Date().toISOString(),
    verificationStatus: institutionData.verificationStatus || DATA_STATUS.VERIFIED,
    verifiedDate: institutionData.verifiedDate || new Date().toISOString().split('T')[0],
  };

  if (existingIndex >= 0) {
    custom[existingIndex] = updatedRecord;
  } else {
    custom.push(updatedRecord);
  }

  try {
    localStorage.setItem(STORAGE_CUSTOM_INSTITUTIONS_KEY, JSON.stringify(custom));
  } catch {}

  return updatedRecord;
}

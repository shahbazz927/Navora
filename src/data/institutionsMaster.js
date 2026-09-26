import { HYDERABAD_INSTITUTIONS, VERIFICATION_STATUS, SOURCE_TYPES } from './hyderabadInstitutions.js';
import { FEATURED_COLLEGES } from './collegeData.js';
import { MASTER_COLLEGES, matchesCollegeSearch } from './hyderabadCollegeDatabase.js';

export { VERIFICATION_STATUS, SOURCE_TYPES, HYDERABAD_INSTITUTIONS, MASTER_COLLEGES };

// Adapt any Master College record into full institution view format
function adaptMasterCollege(mc) {
  const courses = [
    ...(mc.ugCourses || []).map((deg, idx) => ({
      id: `${mc.slug}-ug-${idx}`,
      level: 'UG',
      degree: deg,
      courseName: deg === 'B.Tech' || deg === 'B.E' ? 'Engineering & Technology' : `${deg} Program`,
      duration: deg.includes('Tech') || deg.includes('B.E') || deg.includes('Pharm') || deg.includes('LLB') ? '4-5 Years' : '3 Years',
      tuitionFee: mc.managementType === 'Government' ? 12000 : 85000,
      mode: 'Full Time'
    })),
    ...(mc.pgCourses || []).map((deg, idx) => ({
      id: `${mc.slug}-pg-${idx}`,
      level: 'PG',
      degree: deg,
      courseName: `${deg} Postgraduate Program`,
      duration: '2 Years',
      tuitionFee: mc.managementType === 'Government' ? 25000 : 120000,
      mode: 'Full Time'
    }))
  ];

  return {
    id: mc.id || mc.slug,
    slug: mc.slug,
    collegeId: mc.collegeId,
    name: mc.name,
    shortName: mc.shortName,
    city: mc.city || 'Hyderabad',
    district: mc.district,
    state: 'Telangana',
    location: mc.address,
    institutionType: mc.collegeType,
    ownership: mc.managementType,
    universityAffiliation: mc.university,
    autonomousStatus: mc.collegeType === 'Autonomous',
    recognition: mc.source || 'TSCHE / Osmania University',
    nirfRank: mc.nirfRank || 'Verified Institution',
    website: mc.website,
    admissionUrl: mc.website,
    description: mc.description,
    hostelAvailable: mc.collegeType === 'Autonomous' || mc.collegeType === 'University',
    levels: [
      mc.ugAvailable ? 'UG' : null,
      mc.pgAvailable ? 'PG' : null
    ].filter(Boolean),
    minAnnualFee: mc.managementType === 'Government' ? 15000 : 75000,
    maxAnnualFee: mc.managementType === 'Government' ? 45000 : 250000,
    status: 'published',
    verificationStatus: mc.verificationStatus || 'VERIFIED',
    courses
  };
}

// Build merged list of all verified institutions without duplicates
const existingIds = new Set();
const existingSlugs = new Set();
const existingNames = new Set();

const normalizeKey = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

HYDERABAD_INSTITUTIONS.forEach(inst => {
  if (inst.id) existingIds.add(inst.id.toLowerCase());
  if (inst.slug) existingSlugs.add(inst.slug.toLowerCase());
  if (inst.name) existingNames.add(normalizeKey(inst.name));
});

const adaptedMasterList = MASTER_COLLEGES
  .filter(mc => {
    const mcId = (mc.id || '').toLowerCase();
    const mcSlug = (mc.slug || '').toLowerCase();
    const mcName = normalizeKey(mc.name);

    // If already in HYDERABAD_INSTITUTIONS under any ID, slug, or normalized name, omit duplicate
    const isAlreadyPresent =
      existingIds.has(mcId) ||
      existingSlugs.has(mcSlug) ||
      existingIds.has(mcSlug) ||
      existingSlugs.has(mcId) ||
      existingNames.has(mcName);

    if (isAlreadyPresent) return false;

    // Track newly admitted to avoid any internal collisions
    existingIds.add(mcId);
    existingSlugs.add(mcSlug);
    existingNames.add(mcName);
    return true;
  })
  .map(adaptMasterCollege);

// Ensure all institutions have strictly unique IDs and Slugs
const dedupedList = [];
const seenKeys = new Set();

[...HYDERABAD_INSTITUTIONS, ...adaptedMasterList].forEach((inst, index) => {
  const primaryKey = (inst.id || inst.slug || `inst-${index}`).toLowerCase();
  if (!seenKeys.has(primaryKey)) {
    seenKeys.add(primaryKey);
    dedupedList.push(inst);
  }
});

export const ALL_INSTITUTIONS = dedupedList;

// Map a student's questionnaire profile to matching colleges
export function getCollegesMatchingProfile(answers = {}) {
  if (!answers || Object.keys(answers).length === 0) {
    return ALL_INSTITUTIONS.slice(0, 6);
  }

  const stream = (answers.stream || answers.academicStream || answers.class12Stream || '').toLowerCase();
  const degree = (answers.degree || answers.targetDegree || answers.graduationDegree || '').toLowerCase();
  const userType = answers.userType || '';
  const budget = answers.budget || answers.annualBudget || '';
  const location = (answers.location || answers.preferredCity || answers.city || 'Hyderabad').toLowerCase();

  return ALL_INSTITUTIONS.filter(inst => {
    // Check stream match
    if (stream.includes('mpc') || stream.includes('pcm') || stream.includes('engineering') || stream.includes('tech')) {
      const hasEnggOrTech = inst.courses?.some(c =>
        c.degree === 'B.Tech' || c.degree === 'B.Sc' || c.degree === 'BCA'
      );
      if (!hasEnggOrTech) return false;
    } else if (stream.includes('bipc') || stream.includes('pcb') || stream.includes('medical') || stream.includes('health')) {
      const hasMedOrPharma = inst.courses?.some(c =>
        c.degree === 'MBBS' || c.degree === 'B.Pharm' || c.degree === 'B.Sc'
      );
      if (!hasMedOrPharma) return false;
    } else if (stream.includes('commerce') || stream.includes('mec') || stream.includes('cec')) {
      const hasCommOrMgmt = inst.courses?.some(c =>
        c.degree === 'B.Com' || c.degree === 'BBA' || c.degree === 'BA'
      );
      if (!hasCommOrMgmt) return false;
    }

    // Check user type for graduation (PG programs)
    if (userType === 'graduation' || degree.includes('b.tech') || degree.includes('bba') || degree.includes('b.com')) {
      const hasPg = inst.levels?.includes('PG') || inst.courses?.some(c => c.level === 'PG');
      if (!hasPg) return false;
    }

    return true;
  });
}

// Get institution by slug or ID
export function getInstitutionBySlug(slug) {
  if (!slug) return null;
  const clean = slug.toLowerCase().trim();
  const direct = ALL_INSTITUTIONS.find(
    i => i.slug === clean || i.id === clean || i.collegeId?.toLowerCase() === clean
  );
  if (direct) return direct;

  // Fallback search in MASTER_COLLEGES
  const mc = MASTER_COLLEGES.find(
    c => c.slug === clean || c.id === clean || c.collegeId?.toLowerCase() === clean
  );
  return mc ? adaptMasterCollege(mc) : null;
}

// Get institutions for comparison
export function getInstitutionsForComparison(slugs = []) {
  return slugs
    .map(s => getInstitutionBySlug(s))
    .filter(Boolean);
}

// Helper to normalize alphanumeric strings for matching
const normStr = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

// Comprehensive filter institutions across all 88 verified institutions
export function filterInstitutions({
  level = 'All',
  course = 'All',
  city = 'All',
  budget = 'All',
  ownership = 'All',
  institutionType = 'All',
  hostel = 'Either',
  searchQuery = '',
  sortBy = 'relevance'
} = {}) {
  let list = [...ALL_INSTITUTIONS];

  // 1. Search query with intelligent token/alias matching
  if (searchQuery && searchQuery.trim()) {
    list = list.filter(inst => {
      if (matchesCollegeSearch(inst, searchQuery)) return true;
      const qClean = searchQuery.toLowerCase().trim();
      return inst.courses?.some(c =>
        c.degree?.toLowerCase().includes(qClean) ||
        c.courseName?.toLowerCase().includes(qClean) ||
        c.specialization?.toLowerCase().includes(qClean)
      );
    });
  }

  // 2. Academic Level (UG / PG / Both)
  if (level && level !== 'All') {
    const lvlUpper = level.toUpperCase();
    if (lvlUpper === 'UG') {
      list = list.filter(inst =>
        inst.ugAvailable ||
        inst.levels?.includes('UG') ||
        inst.courses?.some(c => c.level === 'UG')
      );
    } else if (lvlUpper === 'PG') {
      list = list.filter(inst =>
        inst.pgAvailable ||
        inst.levels?.includes('PG') ||
        inst.courses?.some(c => c.level === 'PG')
      );
    } else if (lvlUpper === 'BOTH') {
      list = list.filter(inst =>
        (inst.ugAvailable || inst.levels?.includes('UG') || inst.courses?.some(c => c.level === 'UG')) &&
        (inst.pgAvailable || inst.levels?.includes('PG') || inst.courses?.some(c => c.level === 'PG'))
      );
    }
  }

  // 3. Degree / Course Filter with Normalized Matching
  if (course && course !== 'All') {
    const t = normStr(course);
    list = list.filter(inst => {
      const courses = inst.courses || [];
      const allDegreeTexts = courses
        .map(c => `${c.degree || ''} ${c.courseName || ''} ${c.specialization || ''}`)
        .join(' ');
      const normAll = normStr(allDegreeTexts);

      if (t === 'btech' || t === 'be' || t === 'engineering') {
        return normAll.includes('btech') || normAll.includes('be') || normAll.includes('engineering');
      }
      if (t === 'ba') {
        return courses.some(c => {
          const d = (c.degree || '').toLowerCase().trim();
          return d === 'b.a.' || d === 'b.a' || d === 'ba' || d.startsWith('b.a');
        });
      }
      if (t === 'llb' || t === 'law') {
        return normAll.includes('llb') || normAll.includes('law') || normAll.includes('llm');
      }
      if (t === 'mba' || t === 'pgdm' || t === 'management') {
        return normAll.includes('mba') || normAll.includes('pgdm') || normAll.includes('management');
      }
      if (t === 'mtech' || t === 'me') {
        return normAll.includes('mtech') || normAll.includes('me') || normAll.includes('mtechnology');
      }
      if (t === 'bcom') {
        return normAll.includes('bcom');
      }
      if (t === 'bsc') {
        return normAll.includes('bsc') || normAll.includes('science');
      }
      if (t === 'bba') {
        return normAll.includes('bba');
      }
      if (t === 'bca') {
        return normAll.includes('bca');
      }
      if (t === 'mca') {
        return normAll.includes('mca');
      }
      if (t === 'mbbs') {
        return normAll.includes('mbbs') || normAll.includes('medicine');
      }
      if (t === 'bpharm') {
        return normAll.includes('bpharm') || normAll.includes('pharmacy');
      }

      // Generic normalized match
      return normAll.includes(t);
    });
  }

  // 4. City or metropolitan district
  if (city && city !== 'All') {
    const cLower = city.toLowerCase().trim();
    list = list.filter(inst => {
      const instCity = (inst.city || '').toLowerCase();
      const instDist = (inst.district || '').toLowerCase();
      const instLoc = (inst.location || inst.address || '').toLowerCase();

      if (cLower === 'hyderabad') {
        return instCity.includes('hyderabad') || instDist.includes('hyderabad') || instLoc.includes('hyderabad');
      }
      if (cLower === 'secunderabad') {
        return (
          instCity.includes('secunderabad') ||
          instLoc.includes('secunderabad') ||
          instDist.includes('medchal')
        );
      }
      if (cLower.includes('medchal')) {
        return instDist.includes('medchal') || instLoc.includes('medchal') || instCity.includes('secunderabad');
      }
      if (cLower.includes('ranga')) {
        return instDist.includes('ranga') || instLoc.includes('ranga');
      }
      if (cLower.includes('sangareddy')) {
        return instDist.includes('sangareddy') || instLoc.includes('sangareddy') || instCity.includes('sangareddy');
      }

      return instCity === cLower || instDist.includes(cLower) || instLoc.includes(cLower);
    });
  }

  // 5. Institution Type / Category Filter
  if (institutionType && institutionType !== 'All') {
    const typeLower = institutionType.toLowerCase();
    list = list.filter(inst => {
      const it = (inst.institutionType || '').toLowerCase();
      const own = (inst.ownership || '').toLowerCase();

      if (typeLower.includes('autonomous')) {
        return inst.autonomousStatus === true || it.includes('autonomous');
      }
      if (typeLower.includes('government') || typeLower.includes('govt')) {
        return (
          own.includes('government') ||
          own.includes('aided') ||
          it.includes('government') ||
          it.includes('national importance')
        );
      }
      if (typeLower.includes('affiliated')) {
        return it.includes('affiliated');
      }
      if (typeLower.includes('constituent')) {
        return it.includes('constituent');
      }
      if (typeLower.includes('university')) {
        return it.includes('university') || own.includes('university');
      }
      if (typeLower.includes('private')) {
        return own.includes('private') || own.includes('society') || own.includes('trust');
      }
      if (typeLower.includes('national importance') || typeLower.includes('ini')) {
        return it.includes('national importance');
      }
      if (typeLower.includes('central')) {
        return it.includes('central university');
      }
      if (typeLower.includes('state')) {
        return it.includes('state university');
      }
      if (typeLower.includes('deemed')) {
        return it.includes('deemed');
      }

      return it.includes(typeLower) || own.includes(typeLower);
    });
  }

  // 6. Ownership / Management Filter (if specified separately)
  if (ownership && ownership !== 'All') {
    const oLower = ownership.toLowerCase();
    list = list.filter(inst => (inst.ownership || '').toLowerCase().includes(oLower));
  }

  // 7. Hostel Facility Filter
  if (hostel && hostel !== 'Either') {
    const req = hostel === 'Required';
    list = list.filter(inst => Boolean(inst.hostelAvailable) === req);
  }

  // 8. Budget / Annual Fee Range Filter
  if (budget && budget !== 'All') {
    list = list.filter(inst => {
      const minFee = inst.minAnnualFee || 0;
      if (budget === 'under-50k') return minFee <= 50000;
      if (budget === '50k-1lakh') return minFee >= 50000 && minFee <= 100000;
      if (budget === '1lakh-2lakh') return minFee >= 100000 && minFee <= 200000;
      if (budget === '2lakh-5lakh') return minFee >= 200000 && minFee <= 500000;
      if (budget === '5lakh-plus') return minFee >= 500000;
      return true;
    });
  }

  // 9. Sorting
  if (sortBy === 'fee-low') {
    list.sort((a, b) => (a.minAnnualFee || 0) - (b.minAnnualFee || 0));
  } else if (sortBy === 'fee-high') {
    list.sort((a, b) => (b.minAnnualFee || 0) - (a.minAnnualFee || 0));
  } else if (sortBy === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return list;
}

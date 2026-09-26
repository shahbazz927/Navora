/**
 * NOVERA — Assessment Flow Configuration
 *
 * Single source of truth for the restructured questionnaire architecture:
 *
 *   TOP LEVEL: Class 12 · Graduation · Parent
 *
 *   Class 12   → student_class12   (degree/career direction after Class 12)
 *   Graduation → student_graduation (career/skills from existing degree)
 *   Parent     → parent_class10 | parent_class12 | parent_graduation
 *
 * Class 10 exists ONLY inside the Parent flow (parent_class10). There is no
 * student_class10 and no Class 10 option at the top level.
 *
 * The graduation cascade (family → degree → specialization → interests → skills)
 * reuses the authoritative degree configuration in graduationDegreeConfig.js so
 * MBBS is directly visible and every degree/specialization surfaces only its
 * own relevant interests and skills — never mixed categories.
 */
import graduationDegrees, {
  getSpecializations,
  getDegreeByRef,
} from './graduationDegreeConfig.js';
import {
  getGraduationProfile,
  resolveGraduationProfile,
  getGraduationDirections as getEngineGraduationDirections,
  gradDirectionForFamily as engineGradDirectionForFamily,
  GRAD_STAGE_IDS as ENGINE_GRAD_STAGE_IDS,
  GRAD_STAGE_LABELS as ENGINE_GRAD_STAGE_LABELS,
  getGraduationStageState,
  buildGraduationResult as engineBuildGraduationResult,
  sanitizeGraduationAnswers as engineSanitize,
} from './graduationEngine.js';
import {
  GRAD_DIRECTION as ENGINE_GRAD_DIRECTION,
  GRAD_DIRECTION_BY_FAMILY as ENGINE_GRAD_DIRECTION_BY_FAMILY,
  GRAD_DIRECTIONS_BY_PROFILE as ENGINE_GRAD_DIRECTIONS_BY_PROFILE,
} from './graduationPathwayData.js';
import { evaluateParentClass10 } from './parentClass10Pathways.js';

export const TOP_LEVEL_HEADING = 'What kind of guidance are you looking for?';
export const TOP_LEVEL_SUPPORT =
  "Tell us where you or your child is right now, and we'll guide you from there.";

export const TOP_LEVEL_OPTIONS = [
  {
    value: 'class12',
    title: 'Class 12',
    description:
      "I've completed Class 12 and want help choosing the right degree or career direction.",
    emoji: '🎓',
  },
  {
    value: 'graduation',
    title: 'Graduation',
    description:
      "I'm already pursuing graduation and want guidance on skills, careers and what to do next.",
    emoji: '🎒',
  },
  {
    value: 'parent',
    title: 'Parent',
    description: "I'm looking for education or career guidance for my child.",
    emoji: '👨‍👩‍👧',
  },
];

export const PARENT_STAGE_HEADING = 'Where is your child in their education journey?';
export const PARENT_STAGE_SUPPORT =
  'A few simple questions will help us understand what kind of guidance would be most useful.';

export const PARENT_STAGE_OPTIONS = [
  { value: 'class10', title: 'Class 10', description: 'Your child is completing or has just completed Class 10.', emoji: '🎒' },
  { value: 'class12', title: 'Class 12', description: 'Your child has completed Class 12.', emoji: '🎓' },
  { value: 'graduation', title: 'Graduation', description: 'Your child is already pursuing graduation.', emoji: '🏛️' },
];

export const FLOWS = {
  student_class12: { label: 'Class 12 Guidance', speaks: 'student', resultTitle: 'Your Degree & Career Direction' },
  student_graduation: { label: 'Graduation Career & Skills Guidance', speaks: 'student', resultTitle: 'Your Career Direction' },
  parent_class10: { label: 'Parent · Class 10 Guidance', speaks: 'parent', resultTitle: "Your Child's Academic Direction" },
  parent_class12: { label: 'Parent · Class 12 Guidance', speaks: 'parent', resultTitle: "Your Child's Degree & Career Direction" },
  parent_graduation: { label: 'Parent · Graduation Guidance', speaks: 'parent', resultTitle: "Your Child's Career Direction" },
};

export const GRADUATION_FAMILIES = [
  'Engineering',
  'Medicine & Healthcare',
  'Computer Applications',
  'Commerce & Finance',
  'Business & Management',
  'Science',
  'Arts & Humanities',
  'Law',
  'Design & Creative',
  'Agriculture & Environment',
  'Education',
  'Other Professional Programs',
];

export function degreesForFamily(family) {
  return graduationDegrees.filter((d) => d.family === family);
}

export function degreeHasSpecializations(degreeLabel) {
  const d = getDegreeByRef(degreeLabel);
  return Boolean(d && Array.isArray(d.specializations) && d.specializations.length > 0);
}

export function specOptions(degreeLabel) {
  return getSpecializations(degreeLabel).map((s) => ({ value: s.label, label: s.label }));
}

export function resolveProfile(degree, specialization) {
  const profile = getGraduationProfile(degree, specialization);
  if (!profile) return null;
  // Backwards-compatible shape for older callers (degreeProfiles-style).
  return {
    ...profile,
    careers: profile.careers,
    interests: profile.interests,
    skills: profile.skills,
    experiences: profile.experiences,
    requiredSkills: profile.requiredSkills,
  };
}

// ── Graduation degree stage (stable IDs, duration-aware labels) ──
export const GRAD_DEGREE_STAGE_IDS = ['year_1', 'year_2', 'year_3', 'final_year', 'recently_graduated'];
const DEGREE_DURATION_YEARS = {
  'MBBS': 5, 'BDS': 5, 'BAMS': 5, 'BHMS': 5, 'BUMS': 5, 'BSMS': 5, 'BNYS': 5,
  'B.Sc Nursing': 4, 'BPT / Physiotherapy': 4, 'BOT / Occupational Therapy': 4,
  'B.Pharm': 4, 'Pharm.D': 6, 'B.Sc Medical Laboratory Technology': 3, 'B.Sc Radiology / Medical Imaging': 3,
  'B.Sc Optometry': 4, 'B.Sc Cardiac Care Technology': 3, 'B.Sc Anaesthesia Technology': 3, 'B.Sc Operation Theatre Technology': 3,
  'B.Sc Respiratory Therapy': 3, 'B.Sc Dialysis Technology': 3, 'B.Sc Emergency / Trauma Care': 3, 'Other Healthcare Degree': 3,
  'B.Tech / B.E.': 4, 'BCA': 3, 'B.Sc Computer Science': 3, 'B.Sc Information Technology': 3, 'B.Sc Data Science': 3, 'B.Sc Artificial Intelligence': 3, 'B.Sc Cybersecurity': 3, 'B.Sc Computer Applications': 3, 'Other Computing Degree': 3,
  'B.Com': 3, 'BBA': 3, 'B.Sc': 3, 'BA': 3, 'Law': 3, 'Design / Creative': 4, 'Agriculture / Environment': 4,
  'Education': 2, 'Hotel Management': 4, 'Hospitality': 3, 'Tourism': 3, 'Aviation': 3, 'Logistics': 3, 'Event Management': 3, 'Other': 3,
};
export function gradDegreeStageOptions(degreeLabel) {
  const dur = DEGREE_DURATION_YEARS[degreeLabel] || 3;
  const all = [
    { value: 'year_1', label: '1st year' },
    { value: 'year_2', label: '2nd year' },
    { value: 'year_3', label: '3rd year' },
    { value: 'final_year', label: 'Final year' },
    { value: 'recently_graduated', label: 'Recently graduated' },
  ];
  if (dur <= 2) {
    return all.filter((o) => o.value !== 'year_3');
  }
  if (dur === 3) {
    // For 3-year programmes, 3rd year IS final year — hide duplicate 3rd year entry and keep final_year
    return all.filter((o) => o.value !== 'year_3');
  }
  return all;
}
export function gradDegreeStageLabel(stageId) {
  const all = gradDegreeStageOptions('__any__');
  // fallback map covers filtered cases too
  const map = { year_1: '1st year', year_2: '2nd year', year_3: '3rd year', final_year: 'Final year', recently_graduated: 'Recently graduated' };
  return map[stageId] || stageId;
}
// ── Class 12 (student wording) ───────────────────────────────
export const CLASS12_STREAM_HEADING = 'First, what did you study in Class 11 and 12?';
export const CLASS12_STREAMS = [
  { value: 'mpc', label: 'MPC' },
  { value: 'bipc', label: 'BiPC' },
  { value: 'mec', label: 'MEC' },
  { value: 'cec', label: 'CEC' },
  { value: 'diploma', label: 'Diploma / Polytechnic' },
  { value: 'hotel_management', label: 'Hotel Management / Hospitality' },
  { value: 'not_sure', label: 'Not Sure / Exploring' },
];

// Backward-compat: keep legacy ids as aliases so stored answers never break.
const STREAM_ALIASES = {
  science_pcm: 'mpc', science_pcb: 'bipc',
  mpc: 'mpc', bipc: 'bipc', mec: 'mec', cec: 'cec',
  diploma: 'diploma', hotel_management: 'hotel_management',
  commerce: 'mec', arts: 'cec',
  'diploma_polytechnic': 'diploma', polytechnic: 'diploma',
  'hotel_management_hospitality': 'hotel_management', hospitality: 'hotel_management', hotel: 'hotel_management',
  other: 'not_sure', not_sure: 'not_sure',
  'maths_physics_chemistry': 'mpc', 'biology_physics_chemistry': 'bipc',
  'mathematics_economics_commerce': 'mec', 'civics_economics_commerce': 'cec',
};

// Resolve either a stored stream id ('mpc') or a legacy label ('MPC') or alias ('science_pcm').
export function resolveStreamId(raw) {
  if (!raw) return '';
  const norm = String(raw).toLowerCase().trim().replace(/[\s/_-]+/g, '_');
  if (STREAM_ALIASES[norm]) return STREAM_ALIASES[norm];
  if (CLASS12_STREAMS.some((s) => s.value === norm)) return norm;
  // label match (case-insensitive, slash-tolerant)
  const byLabel = CLASS12_STREAMS.find((s) => s.label.toLowerCase().replace(/[\s/_-]+/g,'_') === norm);
  if (byLabel) return byLabel.value;
  // legacy commerce/arts label fallback
  if (norm === 'commerce' || norm === 'commerce_business_studies') return 'mec';
  if (norm === 'arts' || norm === 'arts_humanities') return 'cec';
  return '';
}

export const CLASS12_SUBJECTS_HEADING = 'Which subjects did you study or enjoy the most?';
export const PARENT_CLASS12_SUBJECTS_HEADING = 'Which subjects did your child study or enjoy the most?';

// Subjects are rendered according to the selected stream — never mixed.
// For Diploma/Hotel the question is reinterpreted as "type of diploma / hospitality focus" via heading override in AssessmentFlow.
export const CLASS12_SUBJECTS = {
  mpc: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Other'],
  bipc: ['Biology', 'Physics', 'Chemistry', 'Other'],
  mec: ['Mathematics', 'Economics', 'Commerce', 'Other'],
  cec: ['Civics', 'Economics', 'Commerce', 'Other'],
  diploma: ['Engineering / Technical Diploma', 'Computer / IT', 'Electronics / Electrical', 'Mechanical / Automobile', 'Civil / Construction', 'Design / Creative', 'Other Diploma Field', 'Not sure'],
  hotel_management: ['Hotel Operations', 'Food & Beverage', 'Culinary Arts', 'Bakery / Pastry', 'Travel & Tourism', 'Event Management', 'Hospitality Management', 'Guest Relations / Front Office', 'International Hospitality', 'Other'],
  commerce: ['Accountancy', 'Economics', 'Business Studies', 'Mathematics', 'Other'],
  arts: ['History', 'Political Science', 'Economics', 'Psychology', 'Sociology', 'Languages / Literature', 'Other'],
  other: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Commerce / Business', 'Humanities', 'Computers', 'Hospitality & Travel', 'Practical Workshop & Hands-on', 'Other'],
  not_sure: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Commerce / Business', 'Humanities', 'Computers', 'Hospitality & Travel', 'Practical Workshop & Hands-on', 'Other'],
};

export const CLASS12_THINK_HEADING = 'Now that Class 12 is complete, what are you thinking about?';

// Re-export for callers that still import CLASS12_DIRECTIONS
export const CLASS12_DIRECTIONS = null;

export const CLASS12_STREAM_DIRECTIONS = {
  mpc: ['Engineering', 'Computer Science / Software', 'AI / Data / Computing', 'Architecture / Design', 'Mathematics / Analytics', 'Pure Science / Research', 'Diploma / Polytechnic (Alternative)', 'Other', 'Still exploring'],
  bipc: ['Medicine', 'Dentistry', 'Allied Health', 'Pharmacy', 'Biotechnology', 'Microbiology', 'Genetics', 'Life Sciences', 'Agriculture', 'Environmental / Life-Science', 'Research', 'Diploma (Alternative)', 'Other', 'Still exploring'],
  mec: ['Finance', 'Accounting', 'Economics', 'Business', 'Management', 'Banking', 'Financial Services', 'Business Analytics', 'Entrepreneurship', 'Professional Courses (CA/CMA)', 'Hotel Management (Alternative)', 'Diploma / Polytechnic (Alternative)', 'Other', 'Still exploring'],
  cec: ['Commerce / Business', 'Management', 'Law', 'Public Administration', 'Government / Public-Service', 'Humanities / Social Sciences', 'Psychology', 'Media / Communication', 'Hospitality / Hotel Management', 'Diploma (Alternative)', 'Other', 'Still exploring'],
  diploma: ['Engineering / Technical Diploma', 'Computer / IT', 'Electronics / Electrical', 'Mechanical / Automobile', 'Civil / Construction', 'Design / Creative', 'Other Diploma Field', 'Not sure'],
  hotel_management: ['Hotel Operations', 'Food & Beverage', 'Culinary Arts', 'Bakery / Pastry', 'Travel & Tourism', 'Event Management', 'Hospitality Management', 'Guest Relations / Front Office', 'International Hospitality', 'Other', 'Still exploring'],
  not_sure: ['Technology & Computers', 'Healthcare & Life Sciences', 'Business & Finance', 'Law & Government', 'Design & Creative', 'Hospitality / Travel / Food', 'Technical / Hands-on Work', 'People / Customer-facing Work', 'Research & Science', 'Diploma / Polytechnic', 'Hotel Management / Hospitality', 'Not sure yet'],
  // legacy aliases for stored answers
  commerce: ['Finance', 'Accounting', 'Economics', 'Business', 'Management', 'Banking', 'Financial Services', 'Business Analytics', 'Entrepreneurship', 'Other', 'Still exploring'],
  arts: ['Commerce / Business', 'Management', 'Law', 'Public Administration', 'Government / Public-Service', 'Humanities / Social Sciences', 'Psychology', 'Media / Communication', 'Other', 'Still exploring'],
};

export const CLASS12_WORK_HEADING = 'What kind of work do you think you would enjoy in the long run?';
export const CLASS12_WORK_HEADING_DIPLOMA = 'What kind of technical work appeals to you most?';
export const CLASS12_WORK_HEADING_HOTEL = 'What kind of hospitality work appeals to you most?';
export const CLASS12_WORK_HEADING_NOT_SURE = 'What kind of work sounds most like you?';

// Work areas depend on the selected stream — only relevant categories are shown.
export const CLASS12_WORK_AREAS = {
  mpc: [
    'Computer Science & Software', 'AI & Machine Learning', 'Electronics & Robotics',
    'Engineering', 'Mathematics & Data', 'Architecture & Design',
    'Defence / Government', 'Exploring',
  ],
  bipc: [
    'Medicine & Patient Care', 'Pharmacy & Medicines', 'Biological Sciences & Research',
    'Psychology & Human Behaviour', 'Agriculture & Life Sciences', 'Nutrition & Food Science',
    'Allied Healthcare', 'Exploring',
  ],
  mec: [
    'Finance & Investment', 'Business Analytics & Data', 'Accounting & Auditing',
    'Banking & Financial Services', 'Economics & Policy', 'Business Management', 'Entrepreneurship', 'Exploring',
  ],
  cec: [
    'Law & Justice', 'Government & Public Service', 'Business Management', 'Economics & Policy',
    'Finance & Commerce', 'Social Sciences & Humanities', 'Media & Communication', 'Hospitality & Service', 'Exploring',
  ],
  diploma: [
    'Hands-on Technical Work', 'Computer & IT Systems', 'Electronics & Electrical', 'Mechanical & Automobile', 'Civil & Construction', 'Design & Creative Technical', 'Exploring',
  ],
  hotel_management: [
    'Hotel Operations & Front Office', 'Food & Beverage Service', 'Culinary / Kitchen', 'Travel & Tourism', 'Event Management', 'Guest Relations & Customer Service', 'Hospitality Management', 'Exploring',
  ],
  not_sure: [
    'Technology & Computers', 'Healthcare & Life Sciences', 'Business & Finance', 'Government / Public Service',
    'Design & Creative', 'Hospitality / Travel / Food', 'Technical / Hands-on Work', 'People / Customer-facing', 'Research & Science', 'Exploring',
  ],
  commerce: [
    'Finance & Investment', 'Accounting', 'Business Management', 'Economics',
    'Marketing', 'Banking', 'Entrepreneurship', 'Exploring',
  ],
  arts: [
    'Psychology', 'Law', 'Economics', 'Journalism & Media', 'Political Science / Public Policy',
    'Sociology', 'Languages & Literature', 'Design & Creative Fields', 'Education', 'Exploring',
  ],
  other: [
    'Technology', 'Healthcare', 'Business & Finance', 'Government / Public Service',
    'Design & Creative', 'Hospitality / Travel', 'Skilled trades / Practical work', 'Not sure',
  ],
};

// ── Context-aware follow-up: "What attracts you most about this path?" ──────
// The question wording and options depend on BOTH the stream (Step 1) and the
// chosen direction (Step: interest). Falls back to stream-level and then
// generic options so every combination renders something meaningful.
export const CLASS12_ATTRACT_HEADING = 'What attracts you most about this path?';
export const PARENT_CLASS12_ATTRACT_HEADING = 'What seems to attract your child most about this path?';

const CLASS12_ATTRACT_BY_STREAM = {
  mpc: {
    'Computer Science / Software': ['Software development', 'Cybersecurity', 'Data Science', 'Cloud / Systems', 'Application development', 'Not sure'],
    'AI / Data / Computing': ['Building intelligent systems', 'Solving complex problems', 'Working with data', 'Creating new technology', 'AI research', 'Still figuring it out'],
    Engineering: ['Designing and building things', 'Solving physical problems', 'Machines & mechanisms', 'Infrastructure & construction', 'Innovation & new products', 'Still figuring it out'],
    'Architecture / Design': ['Designing spaces', 'Creativity & aesthetics', 'Blending art with engineering', 'Urban planning', 'Sustainable design', 'Still figuring it out'],
    'Mathematics / Analytics': ['Solving abstract problems', 'Patterns & logic', 'Data & probability', 'Quantitative modelling', 'Teaching mathematics', 'Still figuring it out'],
    'Pure Science / Research': ['Understanding how nature works', 'Laboratory research', 'Experiments & discovery', 'Space & physics', 'Teaching & academia', 'Still figuring it out'],
    'Diploma / Polytechnic (Alternative)': ['Hands-on technical training', 'Early employment', 'Lateral entry to degree', 'Practical skills', 'Industry readiness', 'Still figuring it out'],
    // legacy keys for alias
    'Computer Science': ['Software development', 'Cybersecurity', 'Data Science', 'Cloud / Systems', 'Application development', 'Not sure'],
    'Artificial Intelligence / Data Science': ['Building intelligent systems', 'Solving complex problems', 'Working with data', 'Creating new technology', 'AI research', 'Still figuring it out'],
    Architecture: ['Designing spaces', 'Creativity & aesthetics', 'Blending art with engineering', 'Urban planning', 'Sustainable design', 'Still figuring it out'],
    'Pure Sciences': ['Understanding how nature works', 'Laboratory research', 'Experiments & discovery', 'Space & physics', 'Teaching & academia', 'Still figuring it out'],
    'Mathematics / Statistics': ['Solving abstract problems', 'Patterns & logic', 'Data & probability', 'Quantitative modelling', 'Teaching mathematics', 'Still figuring it out'],
  },
  bipc: {
    Medicine: ['Understanding diseases', 'Diagnosing problems', 'Treating patients', 'Solving complex medical problems', 'Helping people directly', 'Still figuring it out'],
    Dentistry: ['Oral healthcare', 'Precision work', 'Patient interaction', 'Cosmetic dentistry', 'Clinical practice', 'Still figuring it out'],
    'Allied Health': ['Diagnostics & lab technology', 'Patient support', 'Medical equipment', 'Healthcare technology', 'Working alongside doctors', 'Still figuring it out'],
    Pharmacy: ['Understanding medicines', 'Drug development', 'Helping patients with medication', 'Pharmaceutical industry', 'Research', 'Still figuring it out'],
    Biotechnology: ['Lab research', 'Genetic engineering', 'Innovating in healthcare', 'Scientific problem solving', 'Working on new technology', 'Still figuring it out'],
    Microbiology: ['Microbes & lab work', 'Disease research', 'Diagnostics', 'Research & discovery', 'Lab precision', 'Still figuring it out'],
    Genetics: ['Genes & heredity', 'Genetic counselling', 'Research', 'Diagnostics', 'Lab work', 'Still figuring it out'],
    'Life Sciences': ['Understanding living organisms', 'Research & experiments', 'Lab work', 'Environmental biology', 'Scientific discovery', 'Still figuring it out'],
    Agriculture: ['Farming & food systems', 'Agri research', 'Environment & sustainability', 'Rural development', 'Agri-business', 'Still figuring it out'],
    'Environmental / Life-Science': ['Environment & sustainability', 'Field research', 'Conservation', 'Lab & outdoor work', 'Sustainability', 'Still figuring it out'],
    Research: ['Lab & discovery', 'Scientific questioning', 'Experiments', 'Research papers', 'Curiosity', 'Still figuring it out'],
    'Diploma (Alternative)': ['Hands-on healthcare training', 'Early employment', 'Practical skills', 'Lab technician roles', 'Industry readiness', 'Still figuring it out'],
  },
  mec: {
    Finance: ['Understanding markets', 'Analysing companies', 'Managing money', 'Wealth creation', 'Business news & trends', 'Still figuring it out'],
    Accounting: ['Numbers & accuracy', 'Auditing & compliance', 'Financial records', 'Taxation', 'Structured, precise work', 'Still figuring it out'],
    Economics: ['Understanding markets & policy', 'Data & trends', 'Solving economic problems', 'Research', 'Global affairs', 'Still figuring it out'],
    Business: ['Business models', 'Strategy', 'Operations', 'Growth', 'Market understanding', 'Still figuring it out'],
    Management: ['Leading teams', 'Strategy & planning', 'Organising operations', 'Business growth', 'Entrepreneurial thinking', 'Still figuring it out'],
    Banking: ['Financial services', 'Customer relationships', 'Loans & credit', 'A stable career', 'Understanding money flows', 'Still figuring it out'],
    'Financial Services': ['Wealth management', 'Advisory', 'Markets', 'Client service', 'Finance operations', 'Still figuring it out'],
    'Business Analytics': ['Working with data', 'Business insights', 'Dashboards & tools', 'Better decision-making', 'Problem solving', 'Still figuring it out'],
    Entrepreneurship: ['Building something of my own', 'New ideas', 'Taking initiative', 'Solving real problems', 'Independence', 'Still figuring it out'],
    'Professional Courses (CA/CMA)': ['Professional qualification', 'Structured study', 'Long-term credential', 'Finance credibility', 'Rigour', 'Still figuring it out'],
    'Hotel Management (Alternative)': ['Hospitality & service', 'Travel & tourism', 'Guest experience', 'Event & hotel ops', 'International exposure', 'Still figuring it out'],
    'Diploma / Polytechnic (Alternative)': ['Hands-on business/technical training', 'Early employment', 'Practical skills', 'Industry readiness', 'Entrepreneurial prep', 'Still figuring it out'],
  },
  cec: {
    'Commerce / Business': ['Understanding markets', 'Analysing companies', 'Managing money', 'Business operations', 'Entrepreneurial work', 'Still figuring it out'],
    Management: ['Leading teams', 'Strategy & planning', 'Organising operations', 'Business growth', 'Entrepreneurial thinking', 'Still figuring it out'],
    Law: ['Arguing & reasoning', 'Justice & fairness', 'Courtrooms & cases', 'Constitution & rights', 'Corporate law', 'Still figuring it out'],
    'Public Administration': ['Governance & policy', 'Serving the public', 'Civil services', 'Administration', 'Social impact', 'Still figuring it out'],
    'Government / Public-Service': ['Governance & policy', 'Serving the public', 'Civil services', 'Administration', 'Social impact', 'Still figuring it out'],
    'Humanities / Social Sciences': ['Understanding society', 'People & cultures', 'Research', 'Social change', 'Public issues', 'Still figuring it out'],
    Psychology: ['Understanding human behaviour', 'Helping people', 'Counselling', 'Research on the mind', 'Mental health', 'Still figuring it out'],
    'Media / Communication': ['Storytelling', 'Current affairs', 'Writing & reporting', 'Digital media', 'Public speaking', 'Still figuring it out'],
    'Hospitality / Hotel Management': ['Hotel & hospitality service', 'Guest experience', 'Tourism & events', 'Food & beverage', 'International hospitality', 'Still figuring it out'],
    'Diploma (Alternative)': ['Practical training', 'Early employment', 'Skill-based career', 'Industry readiness', 'Hands-on work', 'Still figuring it out'],
  },
  diploma: {
    'Engineering / Technical Diploma': ['Workshop & machines', 'Building & fixing', 'Site work', 'Practical engineering', 'Hands-on creation', 'Still figuring it out'],
    'Computer / IT': ['Software & apps', 'Networking & systems', 'Hardware & support', 'Coding & troubleshooting', 'IT services', 'Still figuring it out'],
    'Electronics / Electrical': ['Circuits & wiring', 'Devices & repair', 'Electrical systems', 'Automation', 'Practical electronics', 'Still figuring it out'],
    'Mechanical / Automobile': ['Engines & vehicles', 'Machines & tools', 'Workshop & assembly', 'Automobile service', 'Mechanical design', 'Still figuring it out'],
    'Civil / Construction': ['Buildings & sites', 'Surveying & drafting', 'Construction management', 'Infrastructure', 'Site supervision', 'Still figuring it out'],
    'Design / Creative': ['Visual design', 'Drafting & aesthetics', 'Creative production', 'Portfolio work', 'Hands-on design', 'Still figuring it out'],
    'Other Diploma Field': ['Practical skills', 'Early employment', 'Industry training', 'Hands-on work', 'Skill mastery', 'Still figuring it out'],
  },
  hotel_management: {
    'Hotel Operations': ['Front office & guest service', 'Housekeeping & operations', 'Hotel administration', 'Guest experience', 'Hospitality standards', 'Still figuring it out'],
    'Food & Beverage': ['Restaurant service', 'Bar & beverage', 'Guest relations', 'Service excellence', 'Hospitality & food', 'Still figuring it out'],
    'Culinary Arts': ['Cooking & kitchen', 'Menu creation', 'Culinary techniques', 'Food innovation', 'Chef career', 'Still figuring it out'],
    'Bakery / Pastry': ['Baking & confectionery', 'Pastry arts', 'Dessert creation', 'Bakery operations', 'Creative food', 'Still figuring it out'],
    'Travel & Tourism': ['Destinations & tours', 'Itinerary planning', 'Customer experience', 'Tour operations', 'Travel agency work', 'Still figuring it out'],
    'Event Management': ['Event planning', 'Coordination & logistics', 'Client management', 'Hospitality events', 'Large-scale operations', 'Still figuring it out'],
    'Hospitality Management': ['Managing hospitality businesses', 'Leadership & service', 'Hotel & resort management', 'Business & hospitality', 'International hospitality', 'Still figuring it out'],
    'Guest Relations / Front Office': ['Guest communication', 'Front desk & concierge', 'Customer delight', 'Problem solving for guests', 'Front office ops', 'Still figuring it out'],
    'International Hospitality': ['Global hospitality standards', 'Cruise / airline hospitality', 'International hotels', 'Cross-cultural service', 'Global mobility', 'Still figuring it out'],
  },
  not_sure: {
    'Technology & Computers': ['Building & coding', 'Gadgets & apps', 'Problem solving with tech', 'Innovation', 'Digital work', 'Still figuring it out'],
    'Healthcare & Life Sciences': ['Helping & healing', 'Biology & labs', 'People care', 'Research & discovery', 'Health services', 'Still figuring it out'],
    'Business & Finance': ['Money & markets', 'Business strategy', 'Numbers & analysis', 'Entrepreneurial work', 'Finance operations', 'Still figuring it out'],
    'Hospitality / Travel / Food': ['Guest service & travel', 'Food & culinary', 'Events & tourism', 'People & hospitality', 'International exposure', 'Still figuring it out'],
    'Technical / Hands-on Work': ['Building & fixing', 'Workshop & machines', 'Practical creation', 'Hands-on industry', 'Technical mastery', 'Still figuring it out'],
  },
  commerce: {
    'Commerce & Finance': ['Understanding markets', 'Analysing companies', 'Managing money', 'Wealth creation', 'Business news & trends', 'Still figuring it out'],
    Accounting: ['Numbers & accuracy', 'Auditing & compliance', 'Financial records', 'Taxation', 'Structured, precise work', 'Still figuring it out'],
    Banking: ['Financial services', 'Customer relationships', 'Loans & credit', 'A stable career', 'Understanding money flows', 'Still figuring it out'],
    Investment: ['Investing & markets', 'Stock analysis', 'Portfolio building', 'Risk & returns', 'Financial research', 'Still figuring it out'],
    'Business Management': ['Leading teams', 'Strategy & planning', 'Organising operations', 'Business growth', 'Entrepreneurial thinking', 'Still figuring it out'],
    Economics: ['Understanding markets & policy', 'Data & trends', 'Solving economic problems', 'Research', 'Global affairs', 'Still figuring it out'],
    'Business Analytics': ['Working with data', 'Business insights', 'Dashboards & tools', 'Better decision-making', 'Problem solving', 'Still figuring it out'],
    'Professional Finance': ['Financial analysis', 'Corporate finance', 'Certifications like CA / CFA', 'Wealth management', 'Precision & rigour', 'Still figuring it out'],
    Entrepreneurship: ['Building something of my own', 'New ideas', 'Taking initiative', 'Solving real problems', 'Independence', 'Still figuring it out'],
  },
  arts: {
    Psychology: ['Understanding human behaviour', 'Helping people', 'Counselling', 'Research on the mind', 'Mental health', 'Still figuring it out'],
    Law: ['Arguing & reasoning', 'Justice & fairness', 'Courtrooms & cases', 'Constitution & rights', 'Corporate law', 'Still figuring it out'],
    'Journalism / Media': ['Storytelling', 'Current affairs', 'Writing & reporting', 'Digital media', 'Public speaking', 'Still figuring it out'],
    Economics: ['Markets & policy', 'Data & analysis', 'Global issues', 'Research', 'Financial reasoning', 'Still figuring it out'],
    'Social Sciences': ['Understanding society', 'People & cultures', 'Research', 'Social change', 'Public issues', 'Still figuring it out'],
    Languages: ['Literature & writing', 'Languages & communication', 'Creative writing', 'Translation', 'Teaching', 'Still figuring it out'],
    Design: ['Creativity & aesthetics', 'Visual expression', 'Designing products', 'Problem solving through design', 'Technology & art', 'Still figuring it out'],
    'Public Administration': ['Governance & policy', 'Serving the public', 'Civil services', 'Administration', 'Social impact', 'Still figuring it out'],
    'Teaching / Education': ['Sharing knowledge', 'Mentoring others', 'Academic depth', 'Shaping young minds', 'A structured career', 'Still figuring it out'],
  },
};

const CLASS12_ATTRACT_GENERIC = {
  mpc: ['Solving interesting problems', 'Building & creating things', 'Working with technology', 'Research & discovery', 'Understanding how things work', 'Still figuring it out'],
  bipc: ['Understanding living things', 'Helping people stay healthy', 'Lab & research work', 'Scientific discovery', 'Working with people', 'Still figuring it out'],
  mec: ['Understanding business & numbers', 'Markets & money', 'Data & decision-making', 'Leading & organising', 'Building a quantitative career', 'Still figuring it out'],
  cec: ['Understanding law & society', 'Governance & commerce', 'Policy & people', 'Commerce & civic life', 'Making a social impact', 'Still figuring it out'],
  diploma: ['Practical, hands-on work', 'Building & fixing things', 'Industry skills', 'Early employment', 'Technical mastery', 'Still figuring it out'],
  hotel_management: ['Hospitality & people', 'Service & guest experience', 'Food, travel & events', 'Creating memorable experiences', 'Working with people globally', 'Still figuring it out'],
  commerce: ['Understanding business', 'Working with numbers', 'Markets & money', 'Leading & organising', 'Building a career in finance', 'Still figuring it out'],
  arts: ['Understanding people & society', 'Writing & communication', 'Creative expression', 'Research & ideas', 'Making a social impact', 'Still figuring it out'],
  other: ['Solving problems', 'Working with people', 'Creative work', 'Practical, hands-on work', 'Learning new things', 'Still figuring it out'],
  not_sure: ['Solving problems', 'Working with people', 'Creative work', 'Practical, hands-on work', 'Hospitality & service', 'Technical work', 'Still figuring it out'],
};

export function attractOptionsFor(streamId, interest) {
  const byInterest = CLASS12_ATTRACT_BY_STREAM[streamId] || {};
  return byInterest[interest] || CLASS12_ATTRACT_GENERIC[streamId] || CLASS12_ATTRACT_GENERIC.other;
}

export const CLASS12_SKILLS_HEADING = 'What are you already good at?';

// Skills depend on the stream + chosen direction — only relevant strengths
// are shown. Falls back to stream-level and then the generic list.
const CLASS12_SKILLS_BY_STREAM = {
  mpc: {
    'Computer Science / Software': ['Programming basics', 'Problem Solving', 'Mathematics', 'Logical Reasoning', 'Computers & Tools', 'Attention to detail'],
    'AI / Data / Computing': ['Mathematics', 'Statistics & Probability', 'Working with data', 'Logical Reasoning', 'Coding fundamentals', 'Analytical thinking'],
    Engineering: ['Physics & Maths fundamentals', 'Problem Solving', 'Practical Work', 'Building & tinkering', 'Logical Reasoning', 'Teamwork'],
    'Architecture / Design': ['Drawing & Sketching', 'Creativity', 'Spatial thinking', 'Mathematics', 'Design sense', 'Practical Work'],
    'Mathematics / Analytics': ['Mathematics', 'Logical Reasoning', 'Pattern recognition', 'Analytical thinking', 'Problem Solving', 'Attention to detail'],
    'Pure Science / Research': ['Scientific Thinking', 'Physics', 'Chemistry', 'Lab & observation skills', 'Curiosity & questioning', 'Mathematics'],
    'Diploma / Polytechnic (Alternative)': ['Practical Work', 'Problem Solving', 'Hands-on technical skills', 'Workshop aptitude', 'Teamwork', 'Attention to detail'],
    'Computer Science': ['Programming basics', 'Problem Solving', 'Mathematics', 'Logical Reasoning', 'Computers & Tools', 'Attention to detail'],
    'Artificial Intelligence / Data Science': ['Mathematics', 'Statistics & Probability', 'Working with data', 'Logical Reasoning', 'Coding fundamentals', 'Analytical thinking'],
    Architecture: ['Drawing & Sketching', 'Creativity', 'Spatial thinking', 'Mathematics', 'Design sense', 'Practical Work'],
    'Pure Sciences': ['Scientific Thinking', 'Physics', 'Chemistry', 'Lab & observation skills', 'Curiosity & questioning', 'Mathematics'],
    'Mathematics / Statistics': ['Mathematics', 'Logical Reasoning', 'Pattern recognition', 'Analytical thinking', 'Problem Solving', 'Attention to detail'],
  },
  bipc: {
    Medicine: ['Biology', 'Chemistry', 'Memory & recall', 'Empathy & care', 'Scientific Thinking', 'Handling pressure'],
    Dentistry: ['Biology', 'Fine motor precision', 'Patience & care', 'Chemistry', 'Attention to detail', 'Communication'],
    'Allied Health': ['Biology', 'Lab & equipment handling', 'Attention to detail', 'Empathy & care', 'Teamwork', 'Scientific Thinking'],
    Pharmacy: ['Chemistry', 'Biology', 'Attention to detail', 'Memory & recall', 'Scientific Thinking', 'Communication'],
    Biotechnology: ['Biology', 'Chemistry', 'Lab skills', 'Scientific Thinking', 'Analytical thinking', 'Research & documentation'],
    Microbiology: ['Biology', 'Lab skills', 'Scientific Thinking', 'Attention to detail', 'Research & documentation', 'Analytical thinking'],
    Genetics: ['Biology', 'Scientific Thinking', 'Research & documentation', 'Analytical thinking', 'Lab skills', 'Attention to detail'],
    'Life Sciences': ['Biology', 'Observation & lab skills', 'Scientific Thinking', 'Curiosity & questioning', 'Writing & documentation', 'Analytical thinking'],
    Agriculture: ['Biology', 'Practical / field work', 'Observation skills', 'Environment awareness', 'Problem Solving', 'Patience'],
    'Environmental / Life-Science': ['Biology', 'Field observation', 'Environment awareness', 'Scientific Thinking', 'Practical Work', 'Analytical thinking'],
    Research: ['Biology', 'Chemistry', 'Scientific Thinking', 'Lab skills', 'Curiosity & questioning', 'Research & documentation'],
    'Allied Healthcare': ['Biology', 'Lab & equipment handling', 'Attention to detail', 'Empathy & care', 'Teamwork', 'Scientific Thinking'],
  },
  mec: {
    Finance: ['Analysis', 'Mathematics', 'Current affairs / market awareness', 'Research & reading', 'Decision making', 'Excel & data handling'],
    Accounting: ['Numbers & accuracy', 'Accounting basics', 'Attention to detail', 'Excel & data handling', 'Discipline & routine', 'Analysis'],
    Economics: ['Analytical thinking', 'Data interpretation', 'Writing & expression', 'Current affairs awareness', 'Mathematics', 'Communication'],
    Business: ['Leadership', 'Communication', 'Organisation & planning', 'Teamwork', 'Business Thinking', 'Problem Solving'],
    Management: ['Leadership', 'Communication', 'Organisation & planning', 'Teamwork', 'Business Thinking', 'Problem Solving'],
    Banking: ['Communication', 'Numbers & accounting basics', 'Business Thinking', 'Trust & reliability', 'Current affairs awareness', 'Analysis'],
    'Financial Services': ['Communication', 'Numbers & accounting basics', 'Analysis', 'Client handling', 'Business Thinking', 'Excel & data handling'],
    'Business Analytics': ['Excel & data handling', 'Analytical thinking', 'Mathematics', 'Computers & Tools', 'Problem Solving', 'Attention to detail'],
    Entrepreneurship: ['Creativity', 'Leadership', 'Communication', 'Risk taking & initiative', 'Problem Solving', 'Business Thinking'],
    'Professional Courses (CA/CMA)': ['Numbers & accuracy', 'Discipline & routine', 'Attention to detail', 'Accounting basics', 'Analysis', 'Mathematics'],
    'Finance & Investment': ['Analysis', 'Mathematics', 'Current affairs / market awareness', 'Research & reading', 'Decision making', 'Excel & data handling'],
  },
  cec: {
    'Commerce / Business': ['Business Thinking', 'Numbers & accounting basics', 'Current affairs awareness', 'Communication', 'Analysis', 'Excel & data handling'],
    Management: ['Leadership', 'Communication', 'Organisation & planning', 'Teamwork', 'Business Thinking', 'Problem Solving'],
    'Business Management': ['Leadership', 'Communication', 'Organisation & planning', 'Teamwork', 'Business Thinking', 'Problem Solving'],
    Law: ['Reading & comprehension', 'Argumentation & reasoning', 'Writing', 'Memory & recall', 'Confidence & speaking', 'Analysis'],
    'Public Administration': ['Reading & comprehension', 'Writing', 'Current affairs awareness', 'Leadership', 'Organisation & planning', 'Communication'],
    'Government / Public-Service': ['Reading & comprehension', 'Writing', 'Current affairs awareness', 'Leadership', 'Organisation & planning', 'Communication'],
    'Humanities / Social Sciences': ['Understanding people & society', 'Reading & comprehension', 'Research & writing', 'Empathy & listening', 'Analysis', 'Communication'],
    Psychology: ['Empathy & listening', 'Understanding people', 'Communication', 'Observation', 'Writing', 'Patience'],
    'Media / Communication': ['Writing', 'Communication', 'Storytelling', 'Current affairs awareness', 'Creativity', 'Research & interviewing'],
    'Hospitality / Hotel Management': ['Communication', 'Customer service', 'Hospitality & people', 'Organisation & planning', 'Practical Work', 'Multitasking'],
  },
  diploma: {
    'Engineering / Technical Diploma': ['Practical Work', 'Workshop & machines', 'Problem Solving', 'Hands-on engineering', 'Teamwork', 'Attention to detail'],
    'Computer / IT': ['Computers & Tools', 'Problem Solving', 'Logical Reasoning', 'Attention to detail', 'Practical Work', 'Communication'],
    'Electronics / Electrical': ['Practical Work', 'Problem Solving', 'Attention to detail', 'Hands-on technical', 'Logical Reasoning', 'Measurement & testing'],
    'Mechanical / Automobile': ['Practical Work', 'Workshop & machines', 'Problem Solving', 'Hands-on engineering', 'Attention to detail', 'Teamwork'],
    'Civil / Construction': ['Practical Work', 'Site supervision', 'Measurement & planning', 'Teamwork', 'Problem Solving', 'Attention to detail'],
    'Design / Creative': ['Creativity', 'Drawing & Sketching', 'Visual sense', 'Practical Work', 'Observation', 'Problem Solving'],
    'Other Diploma Field': ['Practical Work', 'Problem Solving', 'Hands-on technical', 'Attention to detail', 'Teamwork', 'Communication'],
  },
  hotel_management: {
    'Hotel Operations': ['Communication', 'Customer service', 'Organisation & planning', 'Multitasking', 'Hospitality & people', 'Attention to detail'],
    'Food & Beverage': ['Customer service', 'Communication', 'Teamwork', 'Organisation & planning', 'Attention to detail', 'Hospitality & people'],
    'Culinary Arts': ['Creativity', 'Practical Work', 'Attention to detail', 'Time management', 'Teamwork', 'Taste & presentation'],
    'Bakery / Pastry': ['Creativity', 'Precision & detail', 'Practical Work', 'Time management', 'Aesthetics', 'Patience'],
    'Travel & Tourism': ['Communication', 'Organisation & planning', 'Geography & culture', 'Customer service', 'Hospitality & people', 'Multitasking'],
    'Event Management': ['Organisation & planning', 'Leadership', 'Communication', 'Multitasking', 'Problem Solving', 'Creativity'],
    'Hospitality Management': ['Leadership', 'Communication', 'Organisation & planning', 'Customer service', 'Business Thinking', 'Teamwork'],
    'Guest Relations / Front Office': ['Communication', 'Empathy & listening', 'Problem Solving', 'Customer service', 'Hospitality & people', 'Multitasking'],
    'International Hospitality': ['Communication', 'Customer service', 'Cultural awareness', 'Organisation & planning', 'Hospitality & people', 'Adaptability'],
  },
  commerce: {
    'Commerce & Finance': ['Business Thinking', 'Numbers & accounting basics', 'Current affairs awareness', 'Communication', 'Analysis', 'Excel & data handling'],
    Accounting: ['Numbers & accuracy', 'Accounting basics', 'Attention to detail', 'Excel & data handling', 'Discipline & routine', 'Analysis'],
    Banking: ['Communication', 'Numbers & accounting basics', 'Business Thinking', 'Trust & reliability', 'Current affairs awareness', 'Analysis'],
    Investment: ['Analysis', 'Numbers & accuracy', 'Current affairs / market awareness', 'Mathematics', 'Research & reading', 'Decision making'],
    'Business Management': ['Leadership', 'Communication', 'Organisation & planning', 'Teamwork', 'Business Thinking', 'Problem Solving'],
    Economics: ['Analytical thinking', 'Writing & expression', 'Current affairs awareness', 'Data interpretation', 'Mathematics', 'Communication'],
    'Business Analytics': ['Excel & data handling', 'Analytical thinking', 'Mathematics', 'Computers & Tools', 'Problem Solving', 'Attention to detail'],
    'Professional Finance': ['Numbers & accuracy', 'Accounting basics', 'Analysis', 'Discipline & routine', 'Attention to detail', 'Mathematics'],
    Entrepreneurship: ['Creativity', 'Leadership', 'Communication', 'Risk taking & initiative', 'Problem Solving', 'Business Thinking'],
  },
  arts: {
    Psychology: ['Empathy & listening', 'Understanding people', 'Communication', 'Observation', 'Writing', 'Patience'],
    Law: ['Reading & comprehension', 'Argumentation & reasoning', 'Writing', 'Memory & recall', 'Confidence & speaking', 'Analysis'],
    'Journalism / Media': ['Writing', 'Communication', 'Storytelling', 'Current affairs awareness', 'Creativity', 'Research & interviewing'],
    Economics: ['Analytical thinking', 'Data interpretation', 'Writing & expression', 'Current affairs awareness', 'Mathematics', 'Communication'],
    'Social Sciences': ['Understanding people & society', 'Reading & comprehension', 'Research & writing', 'Empathy & listening', 'Analysis', 'Communication'],
    Languages: ['Writing', 'Reading & comprehension', 'Communication', 'Creativity', 'Memory & recall', 'Storytelling'],
    Design: ['Creativity', 'Drawing & Sketching', 'Visual sense', 'Practical Work', 'Observation', 'Problem Solving'],
    'Public Administration': ['Reading & comprehension', 'Writing', 'Current affairs awareness', 'Leadership', 'Organisation & planning', 'Communication'],
    'Teaching / Education': ['Communication', 'Patience', 'Explanation & clarity', 'Empathy & listening', 'Organisation & planning', 'Leadership'],
  },
};

const CLASS12_SKILLS_GENERIC = {
  mpc: ['Problem Solving', 'Mathematics', 'Physics', 'Chemistry', 'Computers', 'Communication'],
  bipc: ['Biology', 'Chemistry', 'Scientific Thinking', 'Empathy & care', 'Communication', 'Practical Work'],
  mec: ['Mathematics', 'Analytical thinking', 'Economics', 'Business Thinking', 'Excel & data handling', 'Communication'],
  cec: ['Civics & Political awareness', 'Economics', 'Commerce basics', 'Communication', 'Analysis', 'Writing'],
  diploma: ['Practical Work', 'Problem Solving', 'Hands-on technical', 'Attention to detail', 'Teamwork', 'Computers'],
  hotel_management: ['Customer service', 'Communication', 'Organisation & planning', 'Hospitality & people', 'Teamwork', 'Multitasking'],
  commerce: ['Business Thinking', 'Communication', 'Numbers & accounting basics', 'Analysis', 'Leadership', 'Excel & data handling'],
  arts: ['Writing', 'Communication', 'Creativity', 'Understanding people & society', 'Analysis', 'Leadership'],
  not_sure: ['Problem Solving', 'Communication', 'Practical Work', 'Creativity', 'Analysis', 'Teamwork'],
};

export function skillsFor(streamId, interest) {
  const byInterest = CLASS12_SKILLS_BY_STREAM[streamId] || {};
  const list = byInterest[interest] || CLASS12_SKILLS_GENERIC[streamId] || CLASS12_SKILLS;
  return [...new Set([...list, 'Other', 'Not sure yet'])];
}
export const CLASS12_SKILLS = ['Problem Solving', 'Mathematics', 'Communication', 'Writing', 'Biology', 'Scientific Thinking', 'Computers', 'Creativity', 'Leadership', 'Business Thinking', 'Analysis', 'Practical Work', 'Other', 'Not sure yet'];

export const CLASS12_PRIORITY_HEADING = 'What matters most when choosing your next step?';
export const CLASS12_PRIORITIES = ['Good career opportunities', 'Good earning potential', 'Job stability', 'My interest', 'Higher studies', 'Government career', 'Opportunities abroad', 'Entrepreneurship', 'I want help understanding my options'];

// ── Parent Class 12 (parent wording) — separate questionnaire ──
export const PARENT_CLASS12_STREAM_HEADING = 'What did your child study in Class 11 and 12?';
export const PARENT_CLASS12_THINK_HEADING = 'Now that Class 12 is complete, what are they thinking about?';
export const PARENT_CLASS12_WORK_HEADING = 'What kind of work do you feel would keep your child interested in the long run?';
export const PARENT_CLASS12_PRIORITY_HEADING = 'When choosing a degree, what matters most to you?';
export const PARENT_CLASS12_CLARITY_HEADING = 'How clear is the decision right now?';
export const PARENT_CLASS12_CLARITY = ["We've already decided", 'We have two or three options', 'We know the field but not the degree', "We're completely confused"];

// New parent-specific headings / options — separate from student flow
export const PARENT_CLASS12_STRENGTHS_HEADING = 'What is your child naturally good at?';
export const PARENT_CLASS12_INTERESTS_HEADING = 'What does your child enjoy or talk about most?';
export const PARENT_CLASS12_PREFERRED_HEADING = 'What education direction would you prefer for your child?';
export const PARENT_CLASS12_EXPECTATIONS_HEADING = 'What career expectations do you have for your child?';
export const PARENT_CLASS12_CONSTRAINTS_HEADING = 'What practical constraints or concerns matter most?';
export const PARENT_CLASS12_AGREEMENT_HEADING = 'Do you and your child agree on the direction?';

export const PARENT_CLASS12_STRENGTHS = ['Analytical & problem-solving', 'Communication & people skills', 'Creativity & design', 'Practical & hands-on work', 'Leadership & organising', 'Memory & academics', 'Not sure yet'];
export const PARENT_CLASS12_INTERESTS = ['Technology & computers', 'Healthcare & life sciences', 'Business & finance', 'Law & government', 'Creative & design', 'Hospitality / travel / food', 'Technical / practical work', 'People / customer-facing work', 'Research & science', 'Not sure yet'];
export const PARENT_CLASS12_PREFERRED = ['Degree (B.Tech / B.Sc / B.Com / BA)', 'Diploma / Polytechnic', 'Hotel Management / Hospitality', 'Professional course (CA / Law / etc.)', 'Still exploring', 'Need guidance'];
export const PARENT_CLASS12_EXPECTATIONS = ['Stable government job', 'High earning & growth', 'Creative & passion-driven', 'Healthcare & service', 'Business & entrepreneurship', 'Study abroad / global exposure', "Open to my child's choice"];
export const PARENT_CLASS12_CONSTRAINTS = ['Budget / affordability', 'Location / distance from home', 'Course duration', 'Entrance exam difficulty', 'Job security after course', 'No major constraints'];
export const PARENT_CLASS12_AGREEMENT = ['We completely agree', 'We mostly agree but have some differences', 'We have different views', "We're not sure / need help understanding options", 'Need help exploring alternatives like Diploma & Hospitality'];

// ── Parent Class 10 (parent wording; ONLY inside parent) ─────
export const PARENT_CLASS10_HEADINGS = {
  subjects: 'Which subjects does your child enjoy most at school?',
  mathComfort: 'How comfortable is your child with Mathematics?',
  bioInterest: 'How interested is your child in Biology and life sciences?',
  careerFields: 'Which general career or work fields interest them?',
  educationPreference: 'What type of education pathway are you considering after Class 10?',
  careerInMind: 'Is there a specific career or goal they already have in mind?',
  // Legacy aliases for backwards compatibility
  enjoy: 'Which subjects does your child enjoy most at school?',
  strongest: 'How comfortable is your child with Mathematics?',
  future: 'Which general career or work fields interest them?',
  clarity: 'What type of education pathway are you considering after Class 10?',
  priority: 'What matters most to you when choosing their direction?',
};

// ── Result builders ──────────────────────────────────────────
// DELEGATE: The canonical Graduation result is the eligibility-first engine
// in graduationEngine.js (buildGraduationResult). This wrapper keeps backwards
// compatibility for callers that import from assessmentConfig.js while ensuring
// ONE source of truth.
export function buildGraduationResult(answers, isParent = false) {
  return engineBuildGraduationResult(answers, isParent);
}
// Also re-export helpers that consumers may expect from this module
export { engineSanitize as sanitizeGraduationAnswers };
export const GRAD_STAGE_IDS = ENGINE_GRAD_STAGE_IDS;
export const GRAD_STAGE_LABELS = ENGINE_GRAD_STAGE_LABELS;

// When a student is still exploring (no specific interest), their answer to
// "what kind of work would you enjoy" points us toward a concrete direction
// within the stream. Keys must match CLASS12_WORK values; values must match a
// key in CLASS12_REC[stream].interestDegree so no degrees are invented.
const CLASS12_WORK_TO_INTEREST = {
  mpc: {
    'Computer Science & Software': 'Computer Science / Software',
    'AI & Machine Learning': 'AI / Data / Computing',
    'Electronics & Robotics': 'Engineering',
    Engineering: 'Engineering',
    'Mathematics & Data': 'Mathematics / Analytics',
    'Architecture & Design': 'Architecture / Design',
    'Defence / Government': 'Engineering',
  },
  bipc: {
    'Medicine & Patient Care': 'Medicine',
    'Pharmacy & Medicines': 'Pharmacy',
    'Biological Sciences & Research': 'Life Sciences',
    'Psychology & Human Behaviour': 'Allied Health',
    'Agriculture & Life Sciences': 'Agriculture',
    'Nutrition & Food Science': 'Allied Health',
    'Allied Healthcare': 'Allied Health',
  },
  mec: {
    'Finance & Investment': 'Finance',
    'Business Analytics & Data': 'Business Analytics',
    'Accounting & Auditing': 'Accounting',
    'Banking & Financial Services': 'Banking',
    'Economics & Policy': 'Economics',
    'Business Management': 'Management',
    Entrepreneurship: 'Entrepreneurship',
  },
  cec: {
    'Law & Justice': 'Law',
    'Government & Public Service': 'Government / Public-Service',
    'Business Management': 'Management',
    'Economics & Policy': 'Humanities / Social Sciences',
    'Finance & Commerce': 'Commerce / Business',
    'Social Sciences & Humanities': 'Humanities / Social Sciences',
    'Media & Communication': 'Media / Communication',
    'Hospitality & Service': 'Hospitality / Hotel Management',
  },
  diploma: {
    'Hands-on Technical Work': 'Engineering / Technical Diploma',
    'Computer & IT Systems': 'Computer / IT',
    'Electronics & Electrical': 'Electronics / Electrical',
    'Mechanical & Automobile': 'Mechanical / Automobile',
    'Civil & Construction': 'Civil / Construction',
    'Design & Creative Technical': 'Design / Creative',
  },
  hotel_management: {
    'Hotel Operations & Front Office': 'Hotel Operations',
    'Food & Beverage Service': 'Food & Beverage',
    'Culinary / Kitchen': 'Culinary Arts',
    'Travel & Tourism': 'Travel & Tourism',
    'Event Management': 'Event Management',
    'Guest Relations & Customer Service': 'Guest Relations / Front Office',
    'Hospitality Management': 'Hospitality Management',
  },
  not_sure: {
    'Technology & Computers': 'Technology & Computers',
    'Healthcare & Life Sciences': 'Healthcare & Life Sciences',
    'Business & Finance': 'Business & Finance',
    'Hospitality / Travel / Food': 'Hospitality / Travel / Food',
    'Technical / Hands-on Work': 'Technical / Hands-on Work',
    'People / Customer-facing': 'People / Customer-facing Work',
    'Research & Science': 'Research & Science',
    'Design & Creative': 'Design & Creative',
    'Government / Public Service': 'Law & Government',
  },
  commerce: {
    'Finance & Investment': 'Investment',
    Accounting: 'Accounting',
    'Business Management': 'Business Management',
    Economics: 'Commerce & Finance',
    Marketing: 'Business Management',
    Banking: 'Banking',
    Entrepreneurship: 'Entrepreneurship',
  },
  arts: {
    Psychology: 'Psychology',
    Law: 'Law',
    Economics: 'Economics',
    'Journalism & Media': 'Journalism / Media',
    'Political Science / Public Policy': 'Public Administration',
    Sociology: 'Sociology',
    'Design & Creative Fields': 'Design',
    Education: 'Teaching / Education',
  },
};

const CLASS12_REC = {
  mpc: {
    base: {
      degree: 'B.Tech (Engineering)',
      why: ['MPC is the direct feeder for engineering, technology and quantitative degrees.', 'Your interests and priorities point to a technical, problem-solving foundation.'],
      alternatives: ['B.Sc Computer Science / Data Science', 'B.Sc Mathematics & Statistics', 'B.Arch'],
      careers: ['Software Engineer', 'Data Scientist', 'Electronics Engineer', 'Research Scientist'],
    },
    interestDegree: {
      Engineering: { degree: 'B.Tech — Core Engineering', careers: ['Mechanical Engineer', 'Civil Engineer'] },
      'Computer Science / Software': { degree: 'B.Tech CS / B.Sc Computer Science', careers: ['Software Engineer', 'Full-stack Developer'] },
      'AI / Data / Computing': { degree: 'B.Tech AI / B.Sc Data Science', careers: ['AI Engineer', 'Data Scientist', 'ML Engineer'] },
      'Architecture / Design': { degree: 'B.Arch', careers: ['Architect', 'Urban Planner'] },
      'Mathematics / Analytics': { degree: 'B.Sc Mathematics / Statistics', careers: ['Actuary', 'Data Analyst', 'Statistician'] },
      'Pure Science / Research': { degree: 'B.Sc (Pure Sciences)', careers: ['Research Scientist', 'Scientist (ISRO/DRDO)'] },
      'Diploma / Polytechnic (Alternative)': { degree: 'Diploma → B.Tech (Lateral Entry)', careers: ['Mechanical Engineer', 'Software Engineer', 'Civil Engineer'] },
    },
    exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'NATA'],
    skills: ['Physics & Maths fundamentals', 'Problem solving', 'Coding fundamentals'],
  },
  bipc: {
    base: {
      degree: 'MBBS / Medicine',
      why: ['BiPC is the standard route into medicine and the health sciences.', 'Your choices favour a people-focused, scientific career in healthcare.'],
      alternatives: ['BDS (Dentistry)', 'B.Pharm (Pharmacy)', 'B.Sc Biotechnology / Life Sciences'],
      careers: ['Doctor (MBBS → MD/MS)', 'Pharmacist', 'Biotechnologist', 'Clinical Researcher'],
    },
    interestDegree: {
      Medicine: { degree: 'MBBS / Medicine', careers: ['Doctor', 'Surgeon', 'Medical Researcher'] },
      Dentistry: { degree: 'BDS (Dentistry)', careers: ['Dentist', 'Orthodontist'] },
      'Allied Health': { degree: 'B.Sc Allied Health Sciences', careers: ['Lab Technologist', 'Radiology Technologist'] },
      Pharmacy: { degree: 'B.Pharm / Pharm.D', careers: ['Pharmacist', 'Clinical Pharmacologist'] },
      Biotechnology: { degree: 'B.Sc / B.Tech Biotechnology', careers: ['Biotechnologist', 'Research Associate'] },
      Microbiology: { degree: 'B.Sc Microbiology', careers: ['Microbiologist', 'Lab Scientist'] },
      Genetics: { degree: 'B.Sc Genetics / Biotechnology', careers: ['Geneticist', 'Genetic Counsellor'] },
      'Life Sciences': { degree: 'B.Sc Life Sciences', careers: ['Research Assistant', 'Lab Scientist'] },
      Agriculture: { degree: 'B.Sc Agriculture', careers: ['Agri Scientist', 'Agri-business Officer'] },
      'Environmental / Life-Science': { degree: 'B.Sc Environmental Science', careers: ['Environmental Scientist', 'Conservationist'] },
      Research: { degree: 'B.Sc + M.Sc (Research)', careers: ['Research Scientist', 'Lab Researcher'] },
      'Diploma (Alternative)': { degree: 'Diploma in Medical Lab / Nursing', careers: ['Lab Technologist', 'Nurse'] },
    },
    exams: ['NEET UG'],
    skills: ['Biology & Chemistry depth', 'Scientific reasoning', 'Patient empathy'],
  },
  mec: {
    base: {
      degree: 'B.Com / BBA (Finance & Analytics)',
      why: ['MEC blends mathematics with commerce — ideal for finance, analytics and economics.', 'Your quantitative base opens both professional qualifications and data-driven degrees.'],
      alternatives: ['B.Com + CA / CMA', 'BBA Business Analytics', 'BA Economics'],
      careers: ['Financial Analyst', 'Business Analyst', 'Chartered Accountant', 'Data Analyst'],
    },
    interestDegree: {
      Finance: { degree: 'B.Com Finance / CFA path', careers: ['Financial Analyst', 'Investment Banker'] },
      Accounting: { degree: 'B.Com + CA / ACCA', careers: ['Chartered Accountant', 'Auditor'] },
      Economics: { degree: 'BA/B.Sc Economics', careers: ['Economist', 'Policy Analyst'] },
      Business: { degree: 'BBA / B.Com', careers: ['Business Manager', 'Entrepreneur'] },
      Management: { degree: 'BBA + MBA', careers: ['Business Manager', 'Consultant'] },
      Banking: { degree: 'B.Com (Banking & Finance)', careers: ['Bank Officer', 'Financial Consultant'] },
      'Financial Services': { degree: 'B.Com Financial Services', careers: ['Financial Advisor', 'Wealth Manager'] },
      'Business Analytics': { degree: 'BBA Business Analytics / B.Sc Data Science', careers: ['Business Analyst', 'Data Analyst'] },
      Entrepreneurship: { degree: 'BBA (Entrepreneurship)', careers: ['Entrepreneur', 'Startup Founder'] },
      'Professional Courses (CA/CMA)': { degree: 'B.Com + CA / CMA', careers: ['Chartered Accountant', 'Cost Accountant'] },
      'Hotel Management (Alternative)': { degree: 'BHM / Diploma in Hospitality', careers: ['Hotel Manager', 'Hospitality Manager'] },
      'Diploma / Polytechnic (Alternative)': { degree: 'Diploma in Business / Computer Applications', careers: ['Business Associate', 'IT Support Specialist'] },
    },
    exams: ['CUET', 'CA Foundation', 'IPMAT', 'NPAT'],
    skills: ['Mathematics & quantitative aptitude', 'Excel & data handling', 'Business reasoning'],
  },
  cec: {
    base: {
      degree: 'BA LLB / B.Com / BA (CEC pathway)',
      why: ['CEC combines civics, economics and commerce — strong for law, governance and business.', 'Your blend of civic awareness and commerce reasoning opens people-and-policy pathways.'],
      alternatives: ['BBA (Management)', 'BA Economics', 'BA Political Science'],
      careers: ['Lawyer', 'Civil Servant', 'Business Manager', 'Policy Analyst'],
    },
    interestDegree: {
      'Commerce / Business': { degree: 'B.Com (Finance)', careers: ['Financial Analyst', 'Commerce Specialist'] },
      Management: { degree: 'BBA + MBA', careers: ['Business Manager', 'Consultant'] },
      Law: { degree: 'BA LLB / Bachelor of Law', careers: ['Lawyer', 'Corporate Counsel'] },
      'Public Administration': { degree: 'BA Public Administration', careers: ['Civil Services', 'Administrator'] },
      'Government / Public-Service': { degree: 'BA Public Administration', careers: ['Civil Services', 'Administrator'] },
      'Humanities / Social Sciences': { degree: 'BA Humanities / Social Sciences', careers: ['Sociologist', 'Policy Analyst'] },
      Psychology: { degree: 'BA Psychology', careers: ['Psychologist', 'Counsellor'] },
      'Media / Communication': { degree: 'BA Journalism / Mass Communication', careers: ['Journalist', 'Media Professional'] },
      'Hospitality / Hotel Management': { degree: 'BHM / BA Hospitality', careers: ['Hotel Manager', 'Event Manager'] },
      'Diploma (Alternative)': { degree: 'Diploma in Office Management / Tourism', careers: ['Office Administrator', 'Tourism Officer'] },
    },
    exams: ['CLAT', 'CUET', 'IPMAT', 'NCHMCT JEE'],
    skills: ['Civic & legal reasoning', 'Commerce fundamentals', 'Communication & analysis'],
  },
  diploma: {
    base: {
      degree: 'Diploma → B.Tech / BCA (Lateral Entry)',
      why: ['Diploma is a hands-on, employment-ready pathway with lateral entry to degrees.', 'Your preference for practical, workshop-based learning points to a technical diploma.'],
      alternatives: ['Diploma → Direct employment', 'B.Tech lateral entry', 'Advanced Diploma / Certification'],
      careers: ['Mechanical Engineer (Diploma)', 'Software Support Engineer', 'Civil Site Supervisor'],
    },
    interestDegree: {
      'Engineering / Technical Diploma': { degree: 'Diploma in Engineering (Mechanical/Electrical)', careers: ['Mechanical Engineer', 'Electrical Technician'] },
      'Computer / IT': { degree: 'Diploma in Computer Engineering / IT', careers: ['Software Engineer', 'IT Support Specialist'] },
      'Electronics / Electrical': { degree: 'Diploma in Electronics / Electrical', careers: ['Electronics Technician', 'Electrical Engineer'] },
      'Mechanical / Automobile': { degree: 'Diploma in Mechanical / Automobile', careers: ['Mechanical Engineer', 'Automobile Technician'] },
      'Civil / Construction': { degree: 'Diploma in Civil Engineering', careers: ['Civil Engineer', 'Site Supervisor'] },
      'Design / Creative': { degree: 'Diploma in Design / Architecture Assistant', careers: ['Design Associate', 'Draftsperson'] },
      'Other Diploma Field': { degree: 'Diploma (Selected Field) → Lateral Degree', careers: ['Technical Specialist', 'Supervisor'] },
    },
    exams: ['POLYCET / State Diploma Entrance', 'Lateral Entry (ECET)'],
    skills: ['Hands-on technical ability', 'Workshop & tools', 'Problem Solving'],
  },
  hotel_management: {
    base: {
      degree: 'BHM / Diploma in Hotel Management',
      why: ['Hospitality rewards service, people skills and operational excellence.', 'Your interest in guest experience, food and travel points to hospitality.'],
      alternatives: ['Diploma in Hospitality', 'B.Sc Hospitality & Hotel Administration', 'BBA Hospitality Management'],
      careers: ['Hotel Manager', 'Event Manager', 'Guest Relations Manager'],
    },
    interestDegree: {
      'Hotel Operations': { degree: 'BHM — Hotel Operations', careers: ['Hotel Manager', 'Front Office Manager'] },
      'Food & Beverage': { degree: 'Diploma in Food & Beverage Service', careers: ['F&B Manager', 'Restaurant Manager'] },
      'Culinary Arts': { degree: 'Diploma in Culinary Arts', careers: ['Chef', 'Culinary Specialist'] },
      'Bakery / Pastry': { degree: 'Diploma in Bakery & Confectionery', careers: ['Pastry Chef', 'Baker'] },
      'Travel & Tourism': { degree: 'BHM — Travel & Tourism', careers: ['Travel Manager', 'Tourism Officer'] },
      'Event Management': { degree: 'BHM / Diploma in Event Management', careers: ['Event Manager', 'Wedding Planner'] },
      'Hospitality Management': { degree: 'BHM — Hospitality Management', careers: ['Hospitality Manager', 'Resort Manager'] },
      'Guest Relations / Front Office': { degree: 'BHM — Front Office', careers: ['Guest Relations Manager', 'Front Office Executive'] },
      'International Hospitality': { degree: 'BHM — International Hospitality', careers: ['Cruise Hospitality Manager', 'Airline Hospitality'] },
    },
    exams: ['NCHMCT JEE', 'State Hospitality Entrance'],
    skills: ['Customer service', 'Communication', 'Hospitality operations'],
  },
  not_sure: {
    base: {
      degree: 'Exploratory — shortlist by work preference',
      why: ['Not sure is a valid starting point — we use work interests and strengths to narrow options.', 'Explore 2–3 short tasters before committing to a stream-specific degree.'],
      alternatives: ['B.Sc / B.Com / BA — general degree to keep options open', 'Diploma / Skill-based pathway (if practical work appeals)', 'BHM / Hospitality (if people & service appeals)'],
      careers: ['Business Analyst', 'Software Engineer', 'Hotel Manager', 'Teacher'],
    },
    interestDegree: {
      'Technology & Computers': { degree: 'B.Tech / B.Sc Computer Science', careers: ['Software Engineer', 'Data Scientist'] },
      'Healthcare & Life Sciences': { degree: 'MBBS / B.Sc Life Sciences', careers: ['Doctor', 'Lab Scientist'] },
      'Business & Finance': { degree: 'B.Com / BBA', careers: ['Financial Analyst', 'Business Manager'] },
      'Hospitality / Travel / Food': { degree: 'BHM / Diploma in Hospitality', careers: ['Hotel Manager', 'Chef'] },
      'Technical / Hands-on Work': { degree: 'Diploma → B.Tech (Lateral)', careers: ['Mechanical Engineer', 'Civil Engineer'] },
      'Diploma / Polytechnic': { degree: 'Diploma → Lateral Degree', careers: ['Technical Specialist', 'Engineer'] },
      'Hotel Management / Hospitality': { degree: 'BHM / Diploma in Hospitality', careers: ['Hotel Manager', 'Event Manager'] },
    },
    exams: ['CUET', 'College-specific merit', 'NCHMCT JEE', 'POLYCET'],
    skills: ['Curiosity & exploration', 'Communication', 'Problem Solving'],
  },
  // legacy aliases
  commerce: {
    base: {
      degree: 'B.Com (Hons) / BBA',
      why: ['Commerce is the natural entry into business, accounting and finance.', 'Your priorities align with a stable, growth-oriented career track.'],
      alternatives: ['B.Com + CA / CS', 'BBA (Management)', 'BA Economics'],
      careers: ['Accountant', 'Financial Analyst', 'Banking Professional', 'Business Manager'],
    },
    interestDegree: {
      Accounting: { degree: 'B.Com + CA / ACCA', careers: ['Chartered Accountant', 'Auditor'] },
      'Commerce & Finance': { degree: 'B.Com (Finance)', careers: ['Financial Analyst', 'Investment Banker'] },
      Banking: { degree: 'B.Com (Banking)', careers: ['Bank Officer', 'Relationship Manager'] },
      Investment: { degree: 'B.Com Finance / CFA path', careers: ['Investment Analyst', 'Portfolio Manager'] },
      'Business Management': { degree: 'BBA + MBA', careers: ['Business Manager', 'Consultant'] },
      Entrepreneurship: { degree: 'BBA (Entrepreneurship)', careers: ['Entrepreneur', 'Startup Founder'] },
    },
    exams: ['CUET', 'CA Foundation', 'IPMAT', 'NPAT'],
    skills: ['Accounting basics', 'Excel & data analysis', 'Business communication'],
  },
  arts: {
    base: {
      degree: 'BA (your chosen discipline)',
      why: ['Arts offers flexible, people- and idea-driven pathways.', 'Your interests point toward a career built on thinking, empathy and communication.'],
      alternatives: ['BA LLB (Law)', 'BA Psychology', 'B.Des (Design)'],
      careers: ['Content / Media Professional', 'HR Specialist', 'Political Analyst', 'Journalist'],
    },
    interestDegree: {
      Law: { degree: 'BA LLB / Bachelor of Law', careers: ['Lawyer', 'Corporate Counsel'] },
      Psychology: { degree: 'BA Psychology', careers: ['Psychologist', 'Counsellor'] },
      Design: { degree: 'B.Des (Design)', careers: ['Product Designer', 'UX Designer'] },
      'Journalism / Media': { degree: 'BA Journalism / Mass Communication', careers: ['Journalist', 'Content Strategist'] },
      'Teaching / Education': { degree: 'BA + B.Ed', careers: ['Teacher', 'Education Consultant'] },
      'Public Administration': { degree: 'BA Public Administration', careers: ['Civil Services', 'Administrator'] },
      Economics: { degree: 'BA Economics', careers: ['Economist', 'Policy Analyst'] },
      Sociology: { degree: 'BA Sociology / Social Work', careers: ['Sociologist', 'Social Worker'] },
    },
    exams: ['CUET', 'CLAT', 'NID / UCEED'],
    skills: ['Reading & writing', 'Critical thinking', 'Communication'],
  },
};

export function buildClass12Result(answers, isParent = false) {
  // Accept either stored ids ('mpc') or legacy label values ('MPC').
  const raw = answers.stream || '';
  // resolveStreamId handles aliases (science_pcm, other, label variants) → canonical id
  const resolved = resolveStreamId(raw) || raw;
  const stream = CLASS12_REC[resolved] ? resolved : (CLASS12_REC[raw] ? raw : 'not_sure');
  const rec = CLASS12_REC[stream] || CLASS12_REC.not_sure;
  const subject = isParent ? 'your child' : 'you';
  const their = isParent ? 'their' : 'your';

  if (!rec) {
    return {
      headline: 'General degree direction',
      degrees: ['Speak to a counsellor to shortlist the right degree'],
      why: [], alternatives: [], careers: [], exams: [], skills: [],
      next: 'Explore stream-aligned degrees and talk through your options.',
    };
  }

  // Parent flow aliases - map new parent keys to student-equivalent
  const interest = answers.interest || answers.interests || answers.preferred || '';
  const work = answers.work || answers.preferred || '';
  const skillsRaw = answers.skills || answers.strengths || [];
  const skills = Array.isArray(skillsRaw) ? skillsRaw : skillsRaw ? [skillsRaw] : [];
  const priority = answers.priority || answers.expectations || '';
  const clarity = answers.clarity || answers.agreement || answers.constraints || '';

  const exploring = !interest || interest === 'Still exploring';

  // If no specific interest yet, use the kind of work they enjoy to land on a
  // concrete direction within the stream (never invents a degree).
  let targetInterest = interest;
  if (exploring && work && CLASS12_WORK_TO_INTEREST[stream]?.[work]) {
    targetInterest = CLASS12_WORK_TO_INTEREST[stream][work];
  }

  const over = targetInterest ? rec.interestDegree[targetInterest] : null;
  const degree = over ? over.degree : rec.base.degree;
  const careers = over ? over.careers : rec.base.careers;

  const why = [rec.base.why[0]];

  if (over && !exploring) {
    why.push(`${degree} is a strong match for ${their} interest in ${targetInterest.toLowerCase()} and the ${stream.toUpperCase()} stream.`);
  } else if (over && exploring) {
    why.push(`Since ${subject} is still exploring, we used ${their} interest in ${work.toLowerCase()} to point toward ${degree}.`);
  } else if (exploring) {
    why.push(`Since ${subject} is still exploring, we’ve started with the most common path from the ${stream.toUpperCase()} stream — we can narrow it down together.`);
  }

  if (priority) {
    why.push(`You said “${priority.toLowerCase()}” matters most, so we’ve kept that in view while shortlisting.`);
  }

  const nextParts = [
    `Shortlist colleges offering ${degree}, and start building the foundations listed above while ${subject} prepares for ${rec.exams.join(', ')}.`,
  ];
  if (skills && skills.length) {
    nextParts.push(`Build on ${subject}'s strengths in ${skills.slice(0, 3).join(', ').toLowerCase()}.`);
  }
  if (isParent && clarity) {
    nextParts.push(`Because ${subject} ${clarity.toLowerCase()}, revisit this once the decision settles a little.`);
  }

  return {
    headline: degree,
    degrees: [degree, ...rec.base.alternatives],
    why,
    alternatives: rec.base.alternatives,
    careers,
    exams: rec.exams,
    skills: rec.skills,
    next: nextParts.join(' '),
  };
}

export function buildParentClass10Result(answers) {
  // Directly delegate to the dedicated Parent Class 10 Pathway & Gateway Engine
  return evaluateParentClass10(answers);
}

export const CLASS12_STEPS = [
  { key: 'stream', single: true },
  { key: 'subjects', streamDep: true, multi: true, max: 3 },
  { key: 'interest', streamDep: true, single: true },
  { key: 'work', streamDep: true, single: true },
  { key: 'attract', streamDep: true, single: true },
  { key: 'skills', multi: true, max: 4 },
  { key: 'priority', single: true },
];

export const CLASS10_STEPS = [
  { key: 'subjects', multi: true, max: 3 },
  { key: 'mathComfort', single: true },
  { key: 'bioInterest', single: true },
  { key: 'careerFields', multi: true, max: 3 },
  { key: 'educationPreference', single: true },
  { key: 'careerInMind', single: true },
];

export const PARENT_CLASS10_SUBJECTS = [
  'Mathematics',
  'Physical Sciences (Physics & Chemistry)',
  'Biological Sciences (Botany & Zoology)',
  'Computer Science / Coding & Technology',
  'Commerce & Business Studies',
  'Economics',
  'Social Sciences (History, Civics, Geography)',
  'Languages & Literature',
  'Arts, Design & Creative Work',
  'Practical Workshop & Hands-on Work (Machines, Electronics)',
];

export const PARENT_CLASS10_MATH_COMFORT = [
  'Loves Mathematics — solves complex problems with enthusiasm',
  'Comfortable with Mathematics — performs well consistently',
  'Average with Mathematics — prefers applied/practical math over abstract proofs',
  'Finds Mathematics stressful — prefers paths with minimal or no advanced math',
];

export const PARENT_CLASS10_BIO_INTEREST = [
  'High interest — fascinated by living systems, medicine & healthcare',
  'Moderate interest — curious about biology as a science subject',
  'Low interest — prefers non-biological sciences or commerce',
  'Strongly dislikes Biology — definitely wants to avoid life sciences',
];

export const PARENT_CLASS10_CAREER_FIELDS = [
  'Engineering & Technology',
  'Medicine, Healthcare & Pharma',
  'Commerce, Accounting & Banking',
  'Business, Management & Entrepreneurship',
  'Law, Civics & Public Policy',
  'Social Sciences, Psychology & Humanities',
  'Media, Journalism & Communications',
  'Design, Architecture & Creative Arts',
  'Civil Services, Defense & Armed Forces',
  'Hands-on Technical & Engineering Trades',
  'Undecided — open to discovering what fits',
];

export const PARENT_CLASS10_EDUCATION_PREF = [
  'Intermediate / 10+2 leading to a 3 or 4-year University Degree',
  '3-Year Polytechnic Diploma (Hands-on technical study + lateral entry option)',
  'Vocational / ITI Program (Practical skill certification & early employment)',
  'Not sure yet — we want to compare the options',
];

export const PARENT_CLASS10_CAREER_IN_MIND = [
  'Software Engineer / Data Scientist / Technologist',
  'Doctor / Surgeon / Medical Specialist',
  'Chartered Accountant / Investment Banker / Financial Analyst',
  'Civil Servant (UPSC / State PSC) / Public Administrator',
  'Lawyer / Corporate Counsel / Judge',
  'Defense Officer (Army / Navy / Air Force) / Commercial Pilot',
  'Architect / Urban Planner / Industrial Designer',
  'Polytechnic Engineer / Technical Specialist',
  'Creative Artist / Media Producer / Journalist',
  'Healthcare Professional (Pharmacy / Nursing / Allied Health)',
  'Business Owner / Corporate Manager',
  'No specific career yet — keeping options open',
];

// Legacy aliases for backward compatibility
export const PARENT_CLASS10_ENJOY = PARENT_CLASS10_SUBJECTS;
export const PARENT_CLASS10_STRONGEST = PARENT_CLASS10_MATH_COMFORT;
export const PARENT_CLASS10_FUTURE = PARENT_CLASS10_CAREER_FIELDS;
export const PARENT_CLASS10_CLARITY = PARENT_CLASS10_EDUCATION_PREF;
export const PARENT_CLASS10_PRIORITY = PARENT_CLASS10_CAREER_IN_MIND;

// ── Graduation direction data — SINGLE SOURCE: graduationPathwayData.js
// These re-exports keep backwards compatibility for callers that import from
// assessmentConfig.js while ensuring ONE authoritative copy.
export const GRAD_DIRECTION = ENGINE_GRAD_DIRECTION;
export const GRAD_DIRECTIONS_BY_PROFILE = ENGINE_GRAD_DIRECTIONS_BY_PROFILE;
export const GRAD_DIRECTION_BY_FAMILY = ENGINE_GRAD_DIRECTION_BY_FAMILY;

/**
 * Resolve the career direction options to show for a graduation student,
 * based on the broad field (family) they selected. Falls back to the generic
 * list when no tailored set exists.
 */
// Delegated — canonical logic lives in graduationEngine.js / graduationPathwayData.js
export function gradDirectionForFamily(family = '') {
  return engineGradDirectionForFamily(family);
}
export function getGraduationDirections(input = {}) {
  return getEngineGraduationDirections(input);
}
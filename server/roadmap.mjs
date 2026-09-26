// ============================================================================
// NAVORA roadmap builder (server-side, Pro-gated at the endpoint).
// Input: questionnaire answers + userType the user already completed client-side.
// Output: structured 30-day action plan + pathway milestones personalized from
// those answers. No fabricated fees, rankings, dates, or guarantees.
// ============================================================================

function str(v) {
  if (v == null) return '';
  if (typeof v === 'string') return v.trim();
  if (Array.isArray(v)) return v.map(str).filter(Boolean).join(', ');
  if (typeof v === 'object') return str(v.label ?? v.value ?? v.name);
  return String(v);
}
function list(v) {
  const arr = Array.isArray(v) ? v : v != null ? [v] : [];
  return arr.map(str).filter(Boolean);
}

/**
 * Build a personalized roadmap skeleton from real answers.
 * Every task references the user's own data; generic where data is missing.
 */
export function buildRoadmap(answers = {}, userType = null) {
  const a = answers && typeof answers === 'object' ? answers : {};
  const stream = str(a.stream || a.streamV2 || a.currentStream);
  const degree = str(a.currentDegree || a.degree || a.gradDegree);
  const interests = list(a.interests || a.interest || a.subjectInterests).slice(0, 3);
  const goal = str(a.goal || a.futureDirection || a.careerGoal);
  const budget = str(a.budget || a.budgetId);
  const location = str(a.preferredLocation || a.location || a.city);

  const focusBits = [stream, degree].filter(Boolean);
  const focus = focusBits.length ? focusBits.join(' · ') : (userType || 'your stage');
  const interestBit = interests.length ? interests.join(', ') : 'your interests';

  const weeks = [
    {
      week: 1,
      title: 'Research suitable courses and career pathways',
      tasks: [
        `Shortlist 3–5 courses connected to ${interestBit}${stream ? ` within the ${stream} stream` : ''}.`,
        'For each course, note duration, eligibility and the next entrance (if any).',
        goal ? `Match each option against your stated goal: ${goal}.` : 'Write one line on why each option fits you.',
      ],
    },
    {
      week: 2,
      title: 'Shortlist colleges',
      tasks: [
        `Build a list of 6–8 colleges offering your shortlisted courses${location ? ` in/near ${location}` : ''}.`,
        'Record each college\'s official admission route from its own website.',
        budget ? `Flag options outside your indicated budget (${budget}) for a second look.` : 'Flag options that strain your budget for a second look.',
      ],
    },
    {
      week: 3,
      title: 'Check eligibility and entrance requirements',
      tasks: [
        'Verify eligibility criteria and required subjects for every shortlisted college.',
        'List entrance exams with their official notification pages (timings change yearly).',
        'Prepare the documents most applications ask for (marksheets, ID, category certificate if applicable).',
      ],
    },
    {
      week: 4,
      title: 'Finalize your application strategy',
      tasks: [
        'Rank your shortlist into ambitious / fit / value picks and set application order.',
        'Note each deadline on a calendar with a 2-week buffer.',
        degree ? `If continuing from ${degree}, confirm lateral-entry / PG-entrance rules early.` : 'Confirm application mode (counselling vs direct) for each pick.',
      ],
    },
  ];

  const milestones = [
    { label: 'Current stage', value: focus },
    { label: 'Focus areas', value: interestBit },
    ...(goal ? [{ label: 'Stated goal', value: goal }] : []),
    { label: 'Outcome', value: 'Submitted, in-order applications with verified requirements' },
  ];

  return {
    generatedAt: new Date().toISOString(),
    focus,
    weeks,
    milestones,
    disclaimer:
      'Guidance based on the answers you provided. Verify fees, eligibility, deadlines and requirements with each institution and official notifications before applying.',
  };
}

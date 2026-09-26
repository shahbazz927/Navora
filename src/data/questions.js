// DEPRECATED — Class 12 flow now lives in src/data/assessmentConfig.js + AssessmentFlow.jsx
// This file is kept for backwards-compat only; new Class 12 logic (MEC/CEC/not_sure) must be added there.
export const questions = {
  class10: [
    {
      id: 'stream',
      question: 'Do you have a stream in mind after 10th?',
      type: 'single',
      options: [
        { value: 'mpc', label: 'MPC — Maths, Physics, Chemistry', stream: 'science' },
        { value: 'bipc', label: 'BiPC — Biology, Physics, Chemistry', stream: 'science' },
        { value: 'commerce', label: 'Commerce', stream: 'commerce' },
        { value: 'arts', label: 'Arts / Humanities', stream: 'arts' },
        { value: 'diploma', label: 'Diploma / Polytechnic', stream: 'diploma' },
        { value: 'iti', label: 'ITI / Vocational', stream: 'iti' },
        { value: 'not_decided', label: 'Not decided yet', stream: 'none' },
      ],
    },
    {
      id: 'interest',
      question: 'Which subjects do you enjoy the most?',
      type: 'multiple',
      options: [],
    },
    {
      id: 'learning_style',
      question: 'How do you prefer to learn new concepts?',
      type: 'single',
      options: [
        { value: 'practical', label: 'Through experiments and hands-on work' },
        { value: 'analytical', label: 'Through analysis and problem-solving' },
        { value: 'creative', label: 'Through creative projects and presentations' },
        { value: 'reading', label: 'Through reading and research' },
      ],
    },
    {
      id: 'career_goal',
      question: 'What kind of career appeals to you?',
      type: 'single',
      options: [
        { value: 'doctor', label: 'Doctor or Healthcare Professional' },
        { value: 'engineer', label: 'Engineer or Technologist' },
        { value: 'business', label: 'Business Owner or Entrepreneur' },
        { value: 'creative', label: 'Creative Professional (Design, Writing, Media)' },
        { value: 'teacher', label: 'Teacher or Educator' },
        { value: 'scientist', label: 'Researcher or Scientist' },
      ],
    },
    {
      id: 'work_style',
      question: 'How do you prefer to work?',
      type: 'single',
      options: [
        { value: 'team', label: 'In a team, collaborating with others' },
        { value: 'independent', label: 'Independently, with autonomy' },
        { value: 'leadership', label: 'Leading a team or project' },
        { value: 'flexible', label: 'Flexible, mixing both' },
      ],
    },
    {
      id: 'strengths',
      question: 'What are your strongest skills?',
      type: 'multiple',
      options: [
        { value: 'math', label: 'Mathematical ability' },
        { value: 'communication', label: 'Communication and articulation' },
        { value: 'problem_solving', label: 'Problem-solving and logic' },
        { value: 'creativity', label: 'Creativity and imagination' },
        { value: 'leadership', label: 'Leadership and organization' },
        { value: 'empathy', label: 'Empathy and understanding people' },
      ],
    },
  ],
  // REMOVED: Class 12 now lives in assessmentConfig.js — kept as empty arrays so legacy imports do not break but no old questions can render
  class12: [],
  class12_discovery: [],
  // DEPRECATED — Graduation question flow is now the single universal flow in
  // graduationDegreeConfig.js + graduationEngine.js + graduationPathwayData.js
  // and rendered via AssessmentFlow.jsx STEPS_BY_FLOW.student_graduation.
  // Kept only to avoid breaking legacy imports; do not add new graduation
  // logic here. See src/data/assessmentConfig.js + src/data/graduationEngine.js.
  graduate: [
    {
      id: 'degree',
      question: 'What degree are you pursuing or have completed?',
      type: 'single',
      dynamic: 'degreeCategories',
      options: [],
    },
    {
      id: 'interests',
      question: 'What area of your field interests you most?',
      type: 'multiple',
      maxSelect: 2,
      subtitle: 'Pick up to 2 — from your degree-specific list',
      dynamic: 'degreeInterests',
      options: [],
    },
    {
      id: 'skills',
      question: 'What skills are you currently strongest in?',
      type: 'multiple',
      maxSelect: 2,
      subtitle: 'Pick up to 2 — supporting evidence, not the eligibility gate',
      dynamic: 'degreeSkills',
      options: [],
    },
    {
      id: 'experience',
      question: 'What experience have you gained so far?',
      type: 'multiple',
      dynamic: 'degreeExperience',
      options: [],
    },
    {
      id: 'career',
      question: 'What are you thinking about next?',
      type: 'single',
      dynamic: 'degreeCareers',
      options: [],
    },
  ],
  parent: [
    {
      id: 'child_class',
      question: 'What class is your child currently in?',
      type: 'single',
      options: [
        { value: 'class10', label: 'Class 10' },
        { value: 'class11', label: 'Class 11' },
        { value: 'class12', label: 'Class 12' },
        { value: 'graduate', label: 'Graduate / College Student' },
      ],
    },
    {
      id: 'concern',
      question: 'What is your biggest concern about your child\'s education?',
      type: 'single',
      options: [
        { value: 'career', label: 'Career prospects and job market' },
        { value: 'fees', label: 'Fees and return on investment' },
        { value: 'college', label: 'College reputation and ranking' },
        { value: 'location', label: 'Location and safety' },
        { value: 'future', label: 'Future growth opportunities' },
        { value: 'support', label: 'Student support and guidance' },
      ],
    },
    {
      id: 'budget',
      question: 'What is your budget for your child\'s education?',
      type: 'single',
      options: [
        { value: 'low', label: 'Under ₹5 Lakh' },
        { value: 'medium', label: '₹5-15 Lakh' },
        { value: 'high', label: '₹15-30 Lakh' },
        { value: 'very_high', label: 'Above ₹30 Lakh' },
      ],
    },
    {
      id: 'preference',
      question: 'Do you have a preference for college location?',
      type: 'single',
      options: [
        { value: 'metro', label: 'Metro city (Delhi, Mumbai, Bangalore)' },
        { value: 'tier2', label: 'Tier 2 city' },
        { value: 'anywhere', label: 'Anywhere in India' },
        { value: 'abroad', label: 'Abroad' },
      ],
    },
    {
      id: 'child_interest',
      question: 'What subjects or areas does your child enjoy?',
      type: 'multiple',
      options: [
        { value: 'science', label: 'Science and Technology' },
        { value: 'math', label: 'Mathematics' },
        { value: 'commerce', label: 'Commerce and Business' },
        { value: 'arts', label: 'Arts and Humanities' },
        { value: 'sports', label: 'Sports and Physical Activities' },
        { value: 'creative', label: 'Creative Arts (Design, Music, Writing)' },
      ],
    },
  ],
};

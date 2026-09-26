import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Briefcase,
  Users,
  ArrowRight,
  Sparkles,
  Calculator,
  Stethoscope,
  TrendingUp,
  Palette,
  Laptop,
  Sprout,
  BookOpen,
  School,
  Building2,
  CheckCircle2,
  Compass,
} from 'lucide-react';

const CLASS_12_STREAMS = [
  {
    id: 'mpc',
    name: 'MPC (Maths, Physics, Chemistry)',
    badge: 'STEM & Tech Core',
    description: 'Pathways across Engineering, Architecture, Physical Sciences, Defense, Data Science & Emerging Tech.',
    degrees: ['B.Tech / B.E.', 'B.Arch', 'BS-MS Dual (IISER)', 'NDA / Indian Navy (10+2 B.Tech)', 'B.Sc Statistics & Computing'],
    careers: ['Software Engineer', 'Robotics Architect', 'Civil / Infrastructure Engineer', 'Data Scientist', 'Commercial Pilot'],
    link: '/questions?stream=MPC',
    accent: '#2451E0',
  },
  {
    id: 'bipc',
    name: 'BiPC (Biology, Physics, Chemistry)',
    badge: 'Healthcare & Life Sciences',
    description: 'Dedicated medicine, allied healthcare, clinical research, biotechnology, veterinary & pharma avenues.',
    degrees: ['MBBS', 'BDS', 'B.Pharm / Pharm.D', 'B.Sc Biotechnology', 'B.V.Sc (Veterinary)', 'B.Sc Nursing / Allied Health'],
    careers: ['Medical Doctor / Surgeon', 'Clinical Pharmacologist', 'Biotech Researcher', 'Healthcare Administrator', 'Geneticist'],
    link: '/questions?stream=BiPC',
    accent: '#0D9488',
  },
  {
    id: 'commerce',
    name: 'Commerce (Accounts, Economics, Business)',
    badge: 'Finance & Enterprise',
    description: 'Professional accounting, corporate finance, investment banking, capital markets, and law integrations.',
    degrees: ['B.Com (Hons)', 'Chartered Accountancy (CA)', 'Company Secretary (CS)', 'BBA Finance', 'Integrated B.Com LL.B.'],
    careers: ['Chartered Accountant', 'Investment Analyst', 'Corporate Auditor', 'Chief Financial Officer', 'Management Consultant'],
    link: '/questions?stream=Commerce',
    accent: '#B45309',
  },
  {
    id: 'arts',
    name: 'Arts & Humanities',
    badge: 'Social Sciences & Media',
    description: 'Public policy, civil services, corporate law, journalism, design, international relations & psychology.',
    degrees: ['B.A. (Hons) Economics / Pol. Science', '5-Yr Integrated B.A. LL.B.', 'B.Des', 'B.A. Journalism & Mass Comm', 'B.A. Psychology'],
    careers: ['Civil Services (UPSC)', 'Corporate Lawyer / Litigator', 'UX / Product Designer', 'Foreign Policy Analyst', 'Behavioral Researcher'],
    link: '/questions?stream=Arts',
    accent: '#7C3AED',
  },
  {
    id: 'undecided',
    name: 'Undecided / Exploring',
    badge: 'Diagnostic Guidance',
    description: 'Not sure which direction matches your aptitudes? Take our 2-minute diagnostic assessment to map your genuine strengths.',
    degrees: ['Interdisciplinary Exploration', 'Aptitude Mapping', 'Stream Comparison Matrix'],
    careers: ['Personalized career roadmap tailored to your cognitive strengths and work-style preferences'],
    link: '/get-started',
    accent: '#2451E0',
    special: true,
  },
];

const GRADUATION_AREAS = [
  {
    id: 'eng',
    title: 'Engineering & Technology',
    icon: Laptop,
    degrees: 'B.Tech / B.E.',
    focus: 'Software, AI, Embedded Systems, Mechanical, Civil & Core Tech',
    nextSteps: ['M.Tech / MS Abroad (GATE/GRE)', 'Product Management', 'Core Engineering R&D', 'Tech Startups'],
  },
  {
    id: 'med',
    title: 'Medical & Healthcare',
    icon: Stethoscope,
    degrees: 'MBBS / BDS / Allied',
    focus: 'Clinical practice, Hospital Management, Public Health & Pharma',
    nextSteps: ['MD/MS Residency (NEET-PG)', 'MPH / Health Informatics', 'Hospital Administration (MHA)', 'Clinical Research'],
  },
  {
    id: 'bca',
    title: 'Computer Applications',
    icon: Laptop,
    degrees: 'BCA / B.Sc IT',
    focus: 'Application architecture, Cloud computing, Cybersecurity & DevOps',
    nextSteps: ['MCA (NITs / NIMCET)', 'Full-Stack Specialization', 'Cloud Solutions Engineer', 'Data Engineering'],
  },
  {
    id: 'comm',
    title: 'Commerce & Finance',
    icon: TrendingUp,
    degrees: 'B.Com / BAF / BBI',
    focus: 'Corporate accounting, Taxation, Equity research & Wealth management',
    nextSteps: ['CA Final / CFA Level 1', 'M.Com / M.Sc Finance', 'Investment Banking Analyst', 'Treasury & Risk Management'],
  },
  {
    id: 'mgmt',
    title: 'Business Management',
    icon: Briefcase,
    degrees: 'BBA / BMS / BBM',
    focus: 'Strategic leadership, Brand marketing, Operations & Venture creation',
    nextSteps: ['MBA (CAT / XAT / GMAT)', 'Management Trainee in FMCG', 'Growth Operations', 'Consulting Associate'],
  },
  {
    id: 'science',
    title: 'BSc / Science & Research',
    icon: Calculator,
    degrees: 'B.Sc Physics/Maths/Chem',
    focus: 'Pure sciences, Mathematical modeling, Lab diagnostics & Teaching',
    nextSteps: ['M.Sc (IIT-JAM / CUET-PG)', 'Integrated Ph.D.', 'Scientific Officer (BARC/ISRO)', 'Data & Quantitative Analytics'],
  },
  {
    id: 'arts-grad',
    title: 'Arts & Social Sciences',
    icon: BookOpen,
    degrees: 'B.A. (Hons)',
    focus: 'Public policy, Developmental economics, Journalism, Sociology & Law',
    nextSteps: ['Civil Services (UPSC CSE)', '3-Year LL.B. (DU/NLUs)', 'Master in Public Policy (MPP)', 'Media & Strategic Communications'],
  },
  {
    id: 'design',
    title: 'Design & Creative',
    icon: Palette,
    degrees: 'B.Des / BFA / Animation',
    focus: 'Digital product design (UI/UX), Industrial design, Visual communication',
    nextSteps: ['M.Des (CEED / NID PG)', 'Lead UX Designer', 'Spatial / Game Design', 'Creative Direction'],
  },
  {
    id: 'agri',
    title: 'Agriculture & Environment',
    icon: Sprout,
    degrees: 'B.Sc Agriculture / Forestry',
    focus: 'Agri-business management, Sustainable food tech, Precision farming',
    nextSteps: ['ICAR AIEEA PG', 'Agri-tech Startups', 'Food Processing Quality Control', 'Soil & Environmental Sciences'],
  },
  {
    id: 'edu',
    title: 'Education & Teaching',
    icon: School,
    degrees: 'B.Ed / Integrated B.Ed',
    focus: 'Pedagogy, Curriculum development, EdTech instructional design',
    nextSteps: ['M.Ed / CTET / State TET', 'Instructional Designer', 'Higher Secondary Lecturer', 'Academic Content Leadership'],
  },
];

const PARENT_STAGES = [
  {
    stage: 'Class 10 Parents',
    subtitle: 'Stream Selection Decision',
    summary: 'Clear, unbiased breakdown of MPC, BiPC, CEC/MEC, HEC, and Polytechnic pathways. Understand what each subject group genuinely demands and where it leads.',
    questions: [
      'Is MPC compulsory for a high-paying future?',
      'What are the realistic options if my child doesn’t want Math or Biology?',
      'How does a 3-year Polytechnic Diploma compare with Intermediate?',
    ],
    cta: 'Explore Class 10 Parent Guide',
    link: '/parents',
  },
  {
    stage: 'Class 12 Parents',
    subtitle: 'Degree, Entrance & College Direction',
    summary: 'Evaluating degrees, entrance cutoffs (JEE, NEET, CUET, CLAT), genuine tuition costs, college accreditation, and campus placement track records.',
    questions: [
      'How to evaluate college reputation versus advertised placement packages?',
      'What is a safe alternative pathway if entrance rank is lower than expected?',
      'Are 4-year honors degrees now preferred over 3-year standard degrees?',
    ],
    cta: 'Explore Class 12 Parent Guide',
    link: '/parents',
  },
  {
    stage: 'Graduation Parents',
    subtitle: 'Postgraduate & Career Transition',
    summary: 'Guiding your child through higher studies (MBA, M.Tech, MS Abroad) versus immediate campus placement or competitive government exams.',
    questions: [
      'Should my child gain 2 years of work experience before doing an MBA?',
      'What are the real total costs and visa considerations of studying abroad?',
      'How to support a child looking to switch fields after their bachelor’s?',
    ],
    cta: 'Explore Graduation Parent Guide',
    link: '/parents',
  },
];

export default function StudentPathwaySection() {
  const [activeTab, setActiveTab] = useState('class12');

  return (
    <section className="py-20 sm:py-24 bg-surface border-t border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200 px-3.5 py-1 text-xs font-semibold text-brand-700 uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5" />
              Comprehensive Academic Catalog
            </span>
            <h2 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-tight">
              Tailored pathways for your exact academic stage.
            </h2>
            <p className="mt-3 text-base text-ink-2 leading-relaxed">
              Whether you are finishing Class 12, completing graduation, or a parent seeking reassurance — explore structured directions with zero ambiguity.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 rounded-2xl bg-paper border border-line shrink-0">
            {[
              { id: 'class12', label: 'Class 12 Streams', icon: GraduationCap },
              { id: 'graduation', label: 'Graduation Fields', icon: Briefcase },
              { id: 'parents', label: 'For Parents', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-500 text-white shadow-brand'
                      : 'text-ink-2 hover:text-ink hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Class 12 Streams */}
        {activeTab === 'class12' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CLASS_12_STREAMS.map((st) => (
              <div
                key={st.id}
                className={`flex flex-col justify-between rounded-2xl border p-6 sm:p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-lg ${
                  st.special
                    ? 'bg-gradient-to-br from-brand-50 via-white to-brand-100/50 border-brand-300'
                    : 'bg-paper border-line hover:border-brand-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="px-2.5 py-1 rounded-md text-[0.72rem] font-bold tracking-wide"
                      style={{
                        backgroundColor: `${st.accent}15`,
                        color: st.accent,
                      }}
                    >
                      {st.badge}
                    </span>
                    {st.special && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
                        <Sparkles className="w-3.5 h-3.5" /> Recommended
                      </span>
                    )}
                  </div>
                  <h3 className="font-ui font-bold text-xl text-ink">
                    {st.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-ink-2 leading-relaxed">
                    {st.description}
                  </p>

                  <div className="mt-5 space-y-3">
                    <div>
                      <p className="text-[0.7rem] font-bold uppercase tracking-wider text-ink-3 mb-1.5">
                        Key Degree Pathways
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {st.degrees.slice(0, 3).map((d) => (
                          <span
                            key={d}
                            className="text-[0.72rem] font-medium px-2 py-0.5 rounded-md bg-white border border-line text-ink-2"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[0.7rem] font-bold uppercase tracking-wider text-ink-3 mb-1.5">
                        Career Trajectory
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {st.careers.slice(0, 3).map((c) => (
                          <span
                            key={c}
                            className="text-[0.72rem] font-medium px-2 py-0.5 rounded-md bg-brand-50/70 border border-brand-100 text-brand-800"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-line flex items-center justify-between">
                  <Link
                    to={st.link}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 group"
                  >
                    {st.special ? 'Start Diagnostic' : 'Explore Stream'}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <span className="text-xs text-ink-3">2-min evaluation</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Graduation Fields (10 Areas) */}
        {activeTab === 'graduation' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {GRADUATION_AREAS.map((grad) => {
              const Icon = grad.icon;
              return (
                <div
                  key={grad.id}
                  className="bg-paper border border-line rounded-2xl p-5 flex flex-col justify-between hover:border-brand-200 hover:shadow-card transition-all"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-ui font-bold text-sm text-ink">
                      {grad.title}
                    </h3>
                    <p className="text-[0.75rem] font-medium text-brand-600 mt-0.5">
                      {grad.degrees}
                    </p>
                    <p className="text-xs text-ink-2 mt-2 leading-relaxed">
                      {grad.focus}
                    </p>

                    <div className="mt-3.5 pt-3 border-t border-line space-y-1">
                      <p className="text-[0.68rem] font-bold uppercase tracking-wider text-ink-3">
                        Strategic Next Steps
                      </p>
                      {grad.nextSteps.slice(0, 2).map((ns) => (
                        <p key={ns} className="text-xs text-ink-2 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-brand-400" />
                          {ns}
                        </p>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/assessment?type=graduation&field=${grad.id}`}
                    className="mt-4 pt-3 border-t border-line inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    View Graduate Paths <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Separate Parents Experience */}
        {activeTab === 'parents' && (
          <div className="grid md:grid-cols-3 gap-6">
            {PARENT_STAGES.map((ps) => (
              <div
                key={ps.stage}
                className="bg-paper border border-line rounded-2xl p-7 flex flex-col justify-between hover:border-brand-200 hover:shadow-card transition-all"
              >
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-navy/10 text-navy font-semibold text-xs mb-3">
                    {ps.stage}
                  </span>
                  <h3 className="font-ui font-bold text-xl text-ink">
                    {ps.subtitle}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-ink-2 leading-relaxed">
                    {ps.summary}
                  </p>

                  <div className="mt-5 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-3">
                      Common Parent Concerns Addressed:
                    </p>
                    {ps.questions.map((q) => (
                      <div key={q} className="flex items-start gap-2 text-xs text-ink-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-7 pt-5 border-t border-line">
                  <Link
                    to={ps.link}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-ui font-semibold text-xs sm:text-sm shadow-brand transition-colors w-full justify-center"
                  >
                    {ps.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

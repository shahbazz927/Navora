import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  GraduationCap,
  Briefcase,
  Wrench,
  Building2,
  GitFork,
  ArrowRight,
  CheckCircle2,
  Compass,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';

const PATHWAY_STAGES = [
  {
    step: '01',
    id: 'profile',
    title: 'Student Profile',
    icon: User,
    summary: 'Interests, natural strengths, subject comfort & learning preferences',
    details: 'Everything starts with the student: mathematical inclination, creative expression, analytical rigor, or hands-on experimentation. We identify what makes your child thrive before looking at courses.',
    tags: ['Learning Style', 'Subject Strengths', 'Work Preferences'],
    highlight: 'Foundation of all guidance',
  },
  {
    step: '02',
    id: 'stream',
    title: 'Academic Stream',
    icon: Compass,
    summary: 'MPC, BiPC, Commerce, Humanities, Polytechnic, or Vocational',
    details: 'Streams after Class 10/12 chosen with full visibility of entrance eligibility, core subjects, workload realities, and future flexibility across boards.',
    tags: ['Board Alignment', 'Subject Combinations', 'Workload Check'],
    highlight: 'Key decision fork',
  },
  {
    step: '03',
    id: 'degree',
    title: 'Degree Options',
    icon: GraduationCap,
    summary: 'B.Tech, MBBS, B.Com (Hons), BA LLB, B.Des, Integrated Masters, B.Voc',
    details: 'Accredited undergraduate programs matched to curriculum rigor, duration (3 vs 4 vs 5 years), internship structures, and recognized degrees.',
    tags: ['Degree Structure', 'Duration & Credits', 'Eligibility Rules'],
    highlight: 'Accredited qualifications',
  },
  {
    step: '04',
    id: 'careers',
    title: 'Career Options',
    icon: Briefcase,
    summary: 'High-growth industry roles, civil services, corporate functions & startups',
    details: 'Real-world career trajectories with 10-year growth horizons, starting compensation bands, work-life demands, and industry automation vulnerability.',
    tags: ['Industry Outlook', 'Pay Trajectories', 'Role Evolution'],
    highlight: 'Sustainable futures',
  },
  {
    step: '05',
    id: 'skills',
    title: 'Required Skills',
    icon: Wrench,
    summary: 'Analytical reasoning, coding, legal drafting, diagnostic acumen & communication',
    details: 'What the industry actually hires for beyond textbook marks: portfolio building, practical certifications, communication, and problem-solving.',
    tags: ['Core Competencies', 'Applied Tooling', 'Soft Skills'],
    highlight: 'Employability edge',
  },
  {
    step: '06',
    id: 'colleges',
    title: 'College Options',
    icon: Building2,
    summary: 'Tier-1 institutes, Central Universities, top autonomous colleges & abroad',
    details: 'Verified institutional data on NIRF ranking, entrance exam percentiles (JEE, NEET, CUET, CLAT), annual fees, and genuine placement track records.',
    tags: ['Verified Cutoffs', 'Fee Structures', 'Campus Placements'],
    highlight: 'Accredited campuses',
  },
  {
    step: '07',
    id: 'alternatives',
    title: 'Alternative Pathways',
    icon: GitFork,
    summary: 'Safe lateral switches, interdisciplinary bridges & dual qualifications',
    details: 'No student should be locked into a corner. We outline viable parallel plans: lateral entry diplomas, management transitions, design shifts, or government routes.',
    tags: ['Backup Security', 'Lateral Mobility', 'Cross-Domain Bridges'],
    highlight: 'Zero dead-ends',
  },
  {
    step: '08',
    id: 'next-steps',
    title: 'Next Steps',
    icon: CheckCircle2,
    summary: 'Personalized action timeline, exam registration dates & mentoring check-ins',
    details: 'Immediate, practical milestones: which entrance exams to register for, target percentile benchmarks, recommended books/materials, and next counselor review.',
    tags: ['Exam Calendar', 'Preparation Plan', 'Counselor Review'],
    highlight: 'Actionable execution',
  },
];

export default function CareerPathwayVisualizer() {
  const [activeStage, setActiveStage] = useState(0);
  const current = PATHWAY_STAGES[activeStage];

  return (
    <section className="py-20 sm:py-24 bg-paper border-t border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200 px-4 py-1.5 text-xs font-semibold text-brand-700 uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" />
            End-to-End Progression Architecture
          </span>
          <h2 className="font-ui font-bold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight">
            More than a course directory. <br className="hidden sm:inline" />
            <span className="text-brand-500">A connected career roadmap.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink-2 leading-relaxed">
            NAVORA systematically connects every phase of a student’s journey from self-discovery to practical milestones — ensuring you never choose blind.
          </p>
        </div>

        {/* Desktop / Tablet Progressive Pipeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-8">
          {PATHWAY_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStage === idx;
            const isCompleted = idx < activeStage;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(idx)}
                className={`relative text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                  isActive
                    ? 'bg-brand-500 border-brand-500 text-white shadow-brand ring-2 ring-brand-200'
                    : isCompleted
                    ? 'bg-white border-brand-200 text-ink hover:border-brand-300'
                    : 'bg-white border-line text-ink-2 hover:border-brand-200 hover:text-ink'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span
                    className={`text-[0.7rem] font-bold font-ui px-2 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : isCompleted
                        ? 'bg-brand-50 text-brand-700'
                        : 'bg-paper text-ink-3'
                    }`}
                  >
                    {stage.step}
                  </span>
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : isCompleted ? 'text-brand-500' : 'text-ink-3'
                    }`}
                  />
                </div>
                <div>
                  <p
                    className={`text-xs font-bold leading-tight ${
                      isActive ? 'text-white' : 'text-ink'
                    }`}
                  >
                    {stage.title}
                  </p>
                </div>
                {idx < PATHWAY_STAGES.length - 1 && (
                  <span className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight
                      className={`w-3.5 h-3.5 ${
                        idx < activeStage ? 'text-brand-500' : 'text-ink-4'
                      }`}
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Stage Deep-Dive Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="bg-white border border-line rounded-[1.75rem] p-6 sm:p-10 shadow-card"
          >
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold border border-brand-100">
                    Step {current.step} of 08
                  </span>
                  <span className="text-xs font-semibold text-ink-3 uppercase tracking-wider">
                    {current.highlight}
                  </span>
                </div>

                <h3 className="font-ui font-bold text-2xl sm:text-3xl text-ink">
                  {current.title}
                </h3>
                <p className="mt-2 text-base font-medium text-brand-600">
                  {current.summary}
                </p>
                <p className="mt-4 text-sm sm:text-base text-ink-2 leading-relaxed max-w-2xl">
                  {current.details}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {current.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-lg bg-paper border border-line px-3 py-1.5 text-xs font-medium text-ink-2"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-paper rounded-2xl p-6 border border-line">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-3">
                  Why this matters
                </p>
                <div className="space-y-3 text-xs sm:text-sm text-ink-2">
                  <p className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                    <span>Eliminates the trap of choosing an isolated college or course without a career horizon.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Integrates verified eligibility criteria and alternative contingency exits from day one.</span>
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-line flex items-center justify-between">
                  <button
                    onClick={() =>
                      setActiveStage((prev) => (prev + 1) % PATHWAY_STAGES.length)
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 cursor-pointer"
                  >
                    Next stage in roadmap
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-ink-3">
                    {activeStage + 1} / {PATHWAY_STAGES.length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

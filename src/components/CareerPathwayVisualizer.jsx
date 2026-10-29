import { useState } from 'react';
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
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import CareerPathwayMap from './CareerPathwayMap';
import { IllustrationPathwayBlueprint } from './EditorialIllustrations';

const PATHWAY_STAGES = [
  {
    step: '01',
    id: 'profile',
    title: 'Student profile',
    icon: User,
    summary: 'Interests, strengths, subject comfort, and constraints',
    details: 'Start with the student. Their interests, strengths, subject comfort, budget, and location preferences shape every option that follows.',
    tags: ['Interests', 'Subject strengths', 'Practical constraints'],
  },
  {
    step: '02',
    id: 'stream',
    title: 'Academic stream',
    icon: Compass,
    summary: 'MPC, BiPC, Commerce, Humanities, polytechnic, or vocational',
    details: 'Compare streams by subject combinations, entrance eligibility, workload, and how much flexibility each one keeps open.',
    tags: ['Subject combinations', 'Entrance eligibility', 'Flexibility'],
  },
  {
    step: '03',
    id: 'degree',
    title: 'Degree options',
    icon: GraduationCap,
    summary: 'B.Tech, MBBS, B.Com, BA LLB, B.Des, integrated masters, B.Voc',
    details: 'Compare accredited undergraduate programmes by structure, duration, eligibility rules, and the qualification they award.',
    tags: ['Course structure', 'Duration', 'Eligibility'],
  },
  {
    step: '04',
    id: 'careers',
    title: 'Career options',
    icon: Briefcase,
    summary: 'Roles to research across industry, public service, and enterprise',
    details: 'See the roles a path can lead to, and the questions worth asking about demand, working conditions, and how the role changes over time.',
    tags: ['Typical roles', 'Entry routes', 'Questions to ask'],
  },
  {
    step: '05',
    id: 'skills',
    title: 'Required skills',
    icon: Wrench,
    summary: 'Skills, portfolios, and certifications to build',
    details: 'Identify the practical skills, portfolios, and certifications that institutions and employers commonly expect, so preparation starts early.',
    tags: ['Core skills', 'Portfolio', 'Certifications'],
  },
  {
    step: '06',
    id: 'colleges',
    title: 'College options',
    icon: Building2,
    summary: 'Institutions with location, fees, and entrance details',
    details: 'Open institutional records for location, annual fees, entrance requirements, courses offered, and hostel availability. Sources are shown on each college page.',
    tags: ['Fees', 'Entrance exams', 'Courses offered'],
  },
  {
    step: '07',
    id: 'alternatives',
    title: 'Alternative pathways',
    icon: GitFork,
    summary: 'Lateral entry, bridge programmes, and parallel plans',
    details: 'No single result should close every door. See the lateral entry routes, bridge programmes, and related fields worth keeping open.',
    tags: ['Lateral entry', 'Related fields', 'Backup routes'],
  },
  {
    step: '08',
    id: 'next-steps',
    title: 'Next steps',
    icon: CheckCircle2,
    summary: 'Exams to check, documents to collect, details to confirm',
    details: 'Turn the shortlist into action: entrance exams and official deadlines to verify, documents to collect, and details to confirm directly with each institution.',
    tags: ['Exam checks', 'Documents', 'Verification'],
  },
];

export default function CareerPathwayVisualizer() {
  const [activeStage, setActiveStage] = useState(0);
  const current = PATHWAY_STAGES[activeStage];

  return (
    <section className="py-16 sm:py-24 bg-paper border-t border-line" aria-labelledby="pathway-visualizer-heading">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-3xl">
            <p className="eyebrow text-brand-700">THE FULL PICTURE · PATHWAY ARCHITECTURE</p>
            <h2 id="pathway-visualizer-heading" className="mt-2 font-display font-bold text-3xl sm:text-4xl text-ink tracking-[-0.024em] text-balance">
              A course only makes sense in context.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-ink-2 leading-relaxed max-w-2xl">
              Education is a multi-step sequence, not a one-off exam score. Explore how each educational stage branches into verified degrees, specialisations, practical skill portfolios, and long-term career trajectories.
            </p>
          </div>
          <div className="hidden lg:flex shrink-0 items-center justify-end">
            <IllustrationPathwayBlueprint className="w-36 h-36" />
          </div>
        </div>

        {/* ── Primary Interactive Pathway Explorer ────────────── */}
        <div className="mb-14">
          <CareerPathwayMap defaultStage="class10" />
        </div>

        {/* ── Secondary Methodology: The 8-Stage Advisory Framework ── */}
        <div className="border-t border-line/80 pt-12">
          <div className="max-w-2xl mb-8">
            <span className="badge badge-neutral mb-2">Advisory Methodology</span>
            <h3 className="font-ui font-bold text-2xl text-ink">
              The 8 Dimensions of Informed Decision-Making
            </h3>
            <p className="text-sm text-ink-2 mt-1.5">
              Select each dimension to review how NAVORA evaluates fit and prevents blind spots.
            </p>
          </div>

          {/* Stage selector tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-8" role="tablist" aria-label="Career pathway stages">
            {PATHWAY_STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = activeStage === idx;
              const isCompleted = idx < activeStage;
              return (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveStage(idx)}
                  className={`relative text-left p-3.5 rounded-card border transition-all cursor-pointer flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                    isActive
                      ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                      : isCompleted
                      ? 'bg-white border-brand-200 text-ink hover:border-brand-300'
                      : 'bg-white border-line text-ink-2 hover:border-brand-300 hover:text-ink'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span
                      className={`text-[0.7rem] font-bold font-ui px-2 py-0.5 rounded-control ${
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
                      aria-hidden="true"
                    />
                  </div>
                  <p className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-ink'}`}>
                    {stage.title}
                  </p>
                  {idx < PATHWAY_STAGES.length - 1 && (
                    <span className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10" aria-hidden="true">
                      <ChevronRight className={`w-3.5 h-3.5 ${idx < activeStage ? 'text-brand-500' : 'text-ink-4'}`} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active stage detail */}
          <div className="bg-white border border-line rounded-panel p-6 sm:p-8" role="tabpanel">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="badge badge-neutral">Dimension {current.step} of 08</span>
                </div>

                <h3 className="font-display font-bold text-2xl text-ink">{current.title}</h3>
                <p className="mt-2 text-base font-medium text-brand-700">{current.summary}</p>
                <p className="mt-4 text-sm sm:text-base text-ink-2 leading-relaxed max-w-2xl">
                  {current.details}
                </p>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {current.tags.map((tag) => (
                    <li
                      key={tag}
                      className="inline-flex items-center rounded-control bg-paper border border-line px-3 py-1.5 text-xs font-medium text-ink-2"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-4 bg-paper rounded-card p-5 border border-line">
                <p className="text-xs font-semibold text-ink-3 uppercase tracking-wider">Advisory Practice</p>
                <ul className="mt-3 space-y-3 text-sm text-ink-2">
                  <li className="flex items-start gap-2">
                    <Layers className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Compare options against constraints, not algorithmic hype.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Confirm dates, fees, and syllabus directly with institutions.</span>
                  </li>
                </ul>
                <div className="mt-5 pt-4 border-t border-line flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveStage((prev) => (prev + 1) % PATHWAY_STAGES.length)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800 cursor-pointer"
                  >
                    Next dimension
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <span className="text-xs text-ink-3">
                    {activeStage + 1} / {PATHWAY_STAGES.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

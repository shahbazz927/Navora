import React, { useState } from 'react';
import {
  BookOpen,
  Code2,
  FolderGit2,
  Briefcase,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Layers,
  Award,
  Clock,
  RotateCcw
} from 'lucide-react';

export const ROADMAP_TRACKS = {
  software_ai: {
    id: 'software_ai',
    title: 'Software Engineering & AI Systems',
    stageBadge: 'Tech & Engineering',
    summary: 'From fundamental algorithmic thinking to production-grade distributed architectures and machine learning systems.',
    phases: [
      {
        step: 1,
        phase: 'Learn',
        duration: 'Month 1 · Weeks 1–4',
        title: 'Algorithmic Foundations & Core Syntax',
        objective: 'Master memory management, asymptotic complexity (Big-O), and modern language semantics.',
        tasks: [
          'Master Python 3 or C++ data structures (arrays, trees, graphs, hash maps).',
          'Understand time and space complexity with formal Big-O proofs.',
          'Complete CS50 / MIT 6.006 open lecture fundamentals.',
        ],
        deliverable: 'Synthesize standard algorithmic benchmarks in a structured notes repo.',
        suggestedNext: 'Begin daily LeetCode/HackerRank easy-medium problems.',
      },
      {
        step: 2,
        phase: 'Practise',
        duration: 'Month 2 · Weeks 5–8',
        title: 'System Design & Problem Sets',
        objective: 'Implement 50+ medium data structure problems and learn REST / GraphQL API patterns.',
        tasks: [
          'Solve 50 curated LeetCode Medium problems covering two-pointers, BFS/DFS, and dynamic programming.',
          'Build and test RESTful endpoints with FastAPI or Node.js with input validation.',
          'Write comprehensive unit tests with pytest or Jest achieving >80% coverage.',
        ],
        deliverable: 'Documented API server with automated CI/CD test runner.',
        suggestedNext: 'Outline architecture for full-stack capstone project.',
      },
      {
        step: 3,
        phase: 'Build a Project',
        duration: 'Month 3 · Weeks 9–12',
        title: 'Production Capstone Application',
        objective: 'Design and deploy a full-stack, authenticated application with real-world database persistence.',
        tasks: [
          'Architect a real-world SaaS / ML dashboard (e.g., automated document analysis or real-time event pipeline).',
          'Deploy on AWS / Vercel with PostgreSQL database and Redis caching.',
          'Implement OAuth2 authentication, rate limiting, and structured logging.',
        ],
        deliverable: 'Live deployed application with open-source GitHub repository and clean README.',
        suggestedNext: 'Schedule code review with an industry mentor.',
      },
      {
        step: 4,
        phase: 'Prepare',
        duration: 'Month 4 · Weeks 13–15',
        title: 'Interview & Code Evaluation Prep',
        objective: 'Simulate high-pressure technical whiteboard sessions and curate portfolio case studies.',
        tasks: [
          'Conduct 5 timed mock technical interviews (Pramp or peer sessions).',
          'Structure STAR-format responses for system architecture trade-offs.',
          'Format resume to 1-page standard emphasizing measurable project outcomes.',
        ],
        deliverable: 'Single-page ATS-compliant engineering resume and Loom project walkthrough.',
        suggestedNext: 'Map target tech companies, internships, and campus placement drives.',
      },
      {
        step: 5,
        phase: 'Review',
        duration: 'Month 4+ · Week 16 onwards',
        title: 'Mentor Critique & Application Launch',
        objective: 'Undergo code audit, refine edge cases, and submit verified applications.',
        tasks: [
          'Gather senior engineer code review on capstone pull requests.',
          'Audit accessibility (WCAG AA), security headers, and bundle performance.',
          'Submit targeted internship/job applications with custom engineering briefs.',
        ],
        deliverable: 'Final vetted portfolio with verified application tracking log.',
        suggestedNext: 'Maintain continuous contributions and track interview feedback loops.',
      },
    ],
  },

  data_analytics: {
    id: 'data_analytics',
    title: 'Data Science & Quantitative Analytics',
    stageBadge: 'Analytics & Quant',
    summary: 'Empirical data analysis, statistical modeling, machine learning pipelines, and executive dashboards.',
    phases: [
      {
        step: 1,
        phase: 'Learn',
        duration: 'Weeks 1–3',
        title: 'Probability, Linear Algebra & SQL',
        objective: 'Build quantitative foundation in multivariate calculus, Bayes theorem, and SQL query optimization.',
        tasks: [
          'Master window functions, CTEs, and index optimization in PostgreSQL.',
          'Review matrix operations, eigenvalues, and gradient descent mathematically.',
          'Study exploratory data analysis methods with Pandas, NumPy, and Seaborn.',
        ],
        deliverable: 'Comprehensive SQL query playbook analyzing a multi-table database.',
        suggestedNext: 'Pick a public domain dataset from Kaggle or government portal.',
      },
      {
        step: 2,
        phase: 'Practise',
        duration: 'Weeks 4–7',
        title: 'Applied Predictive Modeling',
        objective: 'Train, evaluate, and interpret supervised and unsupervised machine learning algorithms.',
        tasks: [
          'Build end-to-end regression and classification models with scikit-learn.',
          'Perform rigorous cross-validation and feature importance analysis (SHAP values).',
          'Handle imbalanced datasets using SMOTE and precision-recall trade-offs.',
        ],
        deliverable: 'Jupyter notebook demonstrating disciplined hypothesis testing and cross-validation.',
        suggestedNext: 'Package the model into an interactive dashboard.',
      },
      {
        step: 3,
        phase: 'Build a Project',
        duration: 'Weeks 8–11',
        title: 'End-to-End Analytics Pipeline',
        objective: 'Create a live data pipeline that ingests, cleans, scores, and visualizes live trends.',
        tasks: [
          'Build an ETL pipeline ingesting live financial or climate telemetry.',
          'Serve predictions via a FastAPI endpoint with containerized Docker workflow.',
          'Publish an executive dashboard in Streamlit / Tableau with clear business KPIs.',
        ],
        deliverable: 'Interactive Streamlit analytics portal with executive executive summary.',
        suggestedNext: 'Draft an analytical article breaking down your methodology.',
      },
      {
        step: 4,
        phase: 'Prepare',
        duration: 'Weeks 12–14',
        title: 'Technical Case Defense',
        objective: 'Prepare to defend data decisions, metric choices, and statistical trade-offs under interrogation.',
        tasks: [
          'Prepare slide deck explaining business impact vs technical complexity.',
          'Practice explaining A/B testing design, p-values, and statistical power.',
          'Review SQL live-coding challenges under 30-minute time constraints.',
        ],
        deliverable: '5-slide executive presentation and data science case deck.',
        suggestedNext: 'Connect with senior data scientists on LinkedIn for informational interviews.',
      },
      {
        step: 5,
        phase: 'Review',
        duration: 'Week 15 onwards',
        title: 'Production Review & Pipeline Audit',
        objective: 'Verify reproducibility, data drift handling, and governance ethics.',
        tasks: [
          'Audit data pipeline against fairness, data drift, and data privacy regulations.',
          'Ensure 100% reproducible execution using uv/pip-tools and Docker.',
          'Submit applications for analyst/data science positions.',
        ],
        deliverable: 'Reproducible repository with MIT license and data governance brief.',
        suggestedNext: 'Begin tracking responses and interviewing.',
      },
    ],
  },

  finance_ca: {
    id: 'finance_ca',
    title: 'Finance, Investment & Corporate Accounting',
    stageBadge: 'Corporate & Finance',
    summary: 'Financial statement analysis, corporate valuation, taxation, and investment banking casework.',
    phases: [
      {
        step: 1,
        phase: 'Learn',
        duration: 'Weeks 1–4',
        title: 'Accounting Standards & Corporate Reporting',
        objective: 'Master double-entry mechanics, Ind-AS / IFRS standards, and cash flow statement reconciliation.',
        tasks: [
          'Study balance sheet, income statement, and cash flow statement interconnectivity.',
          'Understand revenue recognition (Ind-AS 115) and lease accounting (Ind-AS 116).',
          'Learn basic corporate finance ratios (ROE, ROCE, DuPont analysis).',
        ],
        deliverable: 'Reconciled 3-statement financial model for a publicly listed Indian firm.',
        suggestedNext: 'Advance to discounted cash flow (DCF) modeling.',
      },
      {
        step: 2,
        phase: 'Practise',
        duration: 'Weeks 5–8',
        title: 'Financial Modeling & Valuation',
        objective: 'Build dynamic financial forecasts, debt schedules, and sensitivity tables in Excel.',
        tasks: [
          'Construct a 5-year forecast model with historical revenue driver breakdowns.',
          'Implement WACC calculation and Discounted Cash Flow (DCF) valuation.',
          'Build comparable company analysis (Trading Comps) and transaction precedents.',
        ],
        deliverable: 'Dynamic valuation spreadsheet with Monte Carlo / sensitivity scenarios.',
        suggestedNext: 'Draft an equity research or M&A investment memo.',
      },
      {
        step: 3,
        phase: 'Build a Project',
        duration: 'Weeks 9–12',
        title: 'Comprehensive Investment Memo',
        objective: 'Author an institutional-quality buy/sell equity report on a selected public sector or mid-cap enterprise.',
        tasks: [
          'Analyze competitive moats, market share trends, and regulatory headwinds.',
          'Stress-test EBITDA margins under rising interest rate scenarios.',
          'Deliver an actionable recommendation (Buy/Hold/Sell) with target price.',
        ],
        deliverable: '12-page Equity Research Report formatted to institutional standards.',
        suggestedNext: 'Present your thesis to a peer or finance professor for feedback.',
      },
      {
        step: 4,
        phase: 'Prepare',
        duration: 'Weeks 13–15',
        title: 'Financial Case & Technical Drilling',
        objective: 'Master spontaneous technical questions on accounting adjustments and valuation multiples.',
        tasks: [
          'Practice rapid-fire walk-through of: "If depreciation increases by $10, how does it affect 3 statements?"',
          'Complete ICAI or CFA Level 1 practice question sets.',
          'Refine commercial awareness on current RBI policy and capital market events.',
        ],
        deliverable: 'Personal finance casebook with 30 solved interview questions.',
        suggestedNext: 'Submit for articleship or boutique advisory analyst roles.',
      },
      {
        step: 5,
        phase: 'Review',
        duration: 'Week 16 onwards',
        title: 'Audit & Final Articleship Readiness',
        objective: 'Review work ethics, compliance procedures, and client communication readiness.',
        tasks: [
          'Audit financial spreadsheets for formula errors and circular references.',
          'Confirm documentation for professional body examinations (ICAI / CFA).',
          'Submit applications to target audit and corporate finance firms.',
        ],
        deliverable: 'Complete verified professional credentials portfolio.',
        suggestedNext: 'Attend scheduled interviews with clear casework notes.',
      },
    ],
  },

  design_ux: {
    id: 'design_ux',
    title: 'Product & UX/UI Design',
    stageBadge: 'Design & Product',
    summary: 'Design thinking, user research, wireframing, high-fidelity design systems, and usability testing.',
    phases: [
      {
        step: 1,
        phase: 'Learn',
        duration: 'Weeks 1–3',
        title: 'Design Foundations & Heuristics',
        objective: 'Master typography, visual hierarchy, Figma auto-layout, and Nielsen Norman usability heuristics.',
        tasks: [
          'Study Nielsen Norman 10 Usability Heuristics with real product audits.',
          'Master Figma auto-layout, components, variants, and design token structures.',
          'Learn WCAG AA contrast rules and accessible interface conventions.',
        ],
        deliverable: 'Complete redesign critique of an existing broken mobile experience.',
        suggestedNext: 'Formulate a user research problem statement for a capstone.',
      },
      {
        step: 2,
        phase: 'Practise',
        duration: 'Weeks 4–7',
        title: 'User Research & Wireframing',
        objective: 'Conduct user interviews, map journey flows, and build low-fidelity wireframe prototypes.',
        tasks: [
          'Conduct 5 qualitative user interviews around a defined pain point.',
          'Map user journey flows, task diagrams, and information architecture.',
          'Create clickable low-fidelity wireframe flows in Figma.',
        ],
        deliverable: 'Documented user research synthesis deck with empathy maps and flow charts.',
        suggestedNext: 'Translate wireframes into a cohesive high-fidelity design system.',
      },
      {
        step: 3,
        phase: 'Build a Project',
        duration: 'Weeks 8–11',
        title: 'End-to-End Product Case Study',
        objective: 'Craft a comprehensive product case study solving a real user workflow from problem to verified prototype.',
        tasks: [
          'Build a scalable component design system (colors, typography, buttons, inputs).',
          'Produce high-fidelity interactive prototype with micro-interactions.',
          'Conduct usability test with 5 target users and iterate on findings.',
        ],
        deliverable: 'Polished Behance/web case study detailing research, wireframes, and final UI.',
        suggestedNext: 'Publish case study online and share for design critique.',
      },
      {
        step: 4,
        phase: 'Prepare',
        duration: 'Weeks 12–14',
        title: 'Portfolio Presentation & App Critique',
        objective: 'Prepare whiteboard design challenges and hone portfolio storytelling.',
        tasks: [
          'Practice 45-minute whiteboard design challenge frameworks.',
          'Prepare storytelling slides explaining design decisions and measured metrics.',
          'Format portfolio site for mobile and desktop review.',
        ],
        deliverable: 'Interactive online portfolio website featuring at least 2 in-depth case studies.',
        suggestedNext: 'Submit for design internships or product studio roles.',
      },
      {
        step: 5,
        phase: 'Review',
        duration: 'Week 15 onwards',
        title: 'Design Review & Launch',
        objective: 'Receive senior design lead feedback and validate developer handoff specifications.',
        tasks: [
          'Review Figma file handoff specs (tokens, spacing, asset exports) for engineering teams.',
          'Participate in design portfolio review on ADPList or peer community.',
          'Submit applications to tech startups and design agencies.',
        ],
        deliverable: 'Production-ready Figma file with documented handoff guide.',
        suggestedNext: 'Begin design interviews and take-home challenges.',
      },
    ],
  },
};

export default function SkillRoadmap({
  defaultTrack = 'software_ai',
  careerTitle = '',
  educationStage = '',
  onProgressUpdate,
}) {
  const [selectedTrackKey, setSelectedTrackKey] = useState(() => {
    if (careerTitle) {
      const lower = careerTitle.toLowerCase();
      if (lower.includes('data') || lower.includes('analyst') || lower.includes('statistic')) return 'data_analytics';
      if (lower.includes('finance') || lower.includes('account') || lower.includes('ca ') || lower.includes('invest')) return 'finance_ca';
      if (lower.includes('design') || lower.includes('ux') || lower.includes('product')) return 'design_ux';
    }
    return defaultTrack in ROADMAP_TRACKS ? defaultTrack : 'software_ai';
  });

  const [activeStep, setActiveStep] = useState(1);
  const [checkedTasks, setCheckedTasks] = useState({});

  const track = ROADMAP_TRACKS[selectedTrackKey] || ROADMAP_TRACKS.software_ai;
  const currentPhase = track.phases.find((p) => p.step === activeStep) || track.phases[0];

  const toggleTask = (phaseIdx, taskIdx) => {
    const key = `${selectedTrackKey}-p${phaseIdx}-t${taskIdx}`;
    setCheckedTasks((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      if (onProgressUpdate) onProgressUpdate(updated);
      return updated;
    });
  };

  const getPhaseCompletedCount = (phaseIdx) => {
    const phase = track.phases[phaseIdx];
    if (!phase) return 0;
    return phase.tasks.filter((_, tIdx) => checkedTasks[`${selectedTrackKey}-p${phaseIdx}-t${tIdx}`]).length;
  };

  const totalTasks = track.phases.reduce((acc, p) => acc + p.tasks.length, 0);
  const totalCompleted = Object.keys(checkedTasks).filter((k) => k.startsWith(selectedTrackKey) && checkedTasks[k]).length;
  const overallPercentage = Math.round((totalCompleted / totalTasks) * 100);

  return (
    <div className="w-full bg-white border border-line rounded-panel overflow-hidden shadow-card" aria-label="Personalised Skill Roadmap">
      {/* ── Roadmap Header ──────────────────────────────────── */}
      <div className="bg-paper-subtle border-b border-line px-5 py-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-primary">Skill & Portfolio Roadmap</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                <Clock className="w-3 h-3" />
                Actionable 5-Phase Timeline
              </span>
            </div>
            <h3 className="font-ui font-bold text-lg sm:text-xl text-ink">
              Structured Pathway: Learn → Practise → Build → Prepare → Review
            </h3>
          </div>

          {/* Overall completion pill */}
          <div className="flex items-center gap-3 self-start md:self-auto bg-white border border-line px-3.5 py-1.5 rounded-card">
            <div>
              <p className="text-[11px] text-ink-3">Roadmap Progress</p>
              <p className="font-ui font-bold text-sm text-ink">{totalCompleted} of {totalTasks} Tasks ({overallPercentage}%)</p>
            </div>
            <div className="w-12 h-2 rounded-full bg-paper-deep overflow-hidden">
              <div
                className="h-full bg-brand-600 transition-all duration-300"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Track selector buttons */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Skill tracks">
          {Object.values(ROADMAP_TRACKS).map((t) => {
            const isSelected = selectedTrackKey === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setSelectedTrackKey(t.id);
                  setActiveStep(1);
                }}
                className={`shrink-0 px-3.5 py-2 rounded-control text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-white text-ink-2 hover:text-ink hover:bg-paper border border-line'
                }`}
              >
                <span>{t.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Track Summary Strip ───────────────────────────────── */}
      <div className="bg-brand-50/50 border-b border-brand-100/60 px-5 sm:px-8 py-3 text-xs sm:text-sm text-ink-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p>
          <strong className="text-ink font-semibold">{track.title}:</strong> {track.summary}
        </p>
        {educationStage && (
          <span className="text-xs text-brand-700 font-medium shrink-0">
            Tailored for: {educationStage}
          </span>
        )}
      </div>

      {/* ── 5-Phase Stepper Navigation ─────────────────────────── */}
      <div className="p-5 sm:px-8 sm:pt-6 sm:pb-4 border-b border-line bg-paper/50">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {track.phases.map((phase, pIdx) => {
            const isActive = activeStep === phase.step;
            const completedCount = getPhaseCompletedCount(pIdx);
            const isAllPhaseDone = completedCount === phase.tasks.length;

            return (
              <button
                key={phase.step}
                type="button"
                onClick={() => setActiveStep(phase.step)}
                className={`p-3 rounded-card text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-white border-brand-500 ring-2 ring-brand-500/30 shadow-xs'
                    : isAllPhaseDone
                    ? 'bg-white border-emerald-300 text-ink'
                    : 'bg-white border-line text-ink-2 hover:border-brand-200'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-brand-500 text-white'
                        : isAllPhaseDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-paper text-ink-3'
                    }`}
                  >
                    PHASE 0{phase.step}
                  </span>
                  {isAllPhaseDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <span className="text-[11px] text-ink-4">
                      {completedCount}/{phase.tasks.length}
                    </span>
                  )}
                </div>
                <p className={`font-ui font-bold text-xs sm:text-sm leading-tight ${isActive ? 'text-brand-700' : 'text-ink'}`}>
                  {phase.phase}
                </p>
                <p className="text-[11px] text-ink-3 mt-0.5 truncate">{phase.duration}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Phase Detail Panel ──────────────────────────── */}
      <div className="p-5 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-line">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-primary">
                Phase {currentPhase.step}: {currentPhase.phase}
              </span>
              <span className="text-xs text-ink-3">· {currentPhase.duration}</span>
            </div>
            <h4 className="font-ui font-bold text-xl sm:text-2xl text-ink">
              {currentPhase.title}
            </h4>
            <p className="mt-2 text-sm text-ink-2 max-w-2xl leading-relaxed">
              {currentPhase.objective}
            </p>
          </div>

          {/* Quick Deliverable Card */}
          <div className="lg:w-80 shrink-0 bg-brand-50/60 border border-brand-100 rounded-card p-4">
            <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wider block mb-1">
              Key Deliverable / Artifact
            </span>
            <p className="text-xs font-semibold text-ink leading-relaxed">
              {currentPhase.deliverable}
            </p>
          </div>
        </div>

        {/* Actionable Task Checkpoints */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-ui font-bold text-sm text-ink uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              Actionable Checkpoints & Milestones
            </h5>
            <span className="text-xs text-ink-3">
              Tap checkbox to mark milestone completed
            </span>
          </div>

          <div className="space-y-3">
            {currentPhase.tasks.map((task, tIdx) => {
              const taskKey = `${selectedTrackKey}-p${currentPhase.step - 1}-t${tIdx}`;
              const isChecked = !!checkedTasks[taskKey];

              return (
                <div
                  key={task}
                  onClick={() => toggleTask(currentPhase.step - 1, tIdx)}
                  className={`p-4 rounded-card border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-line hover:border-brand-200 hover:bg-paper'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // handled by parent div onClick
                    className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                    aria-label={task}
                  />
                  <div className="flex-1">
                    <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isChecked ? 'line-through text-ink-3' : 'text-ink'}`}>
                      {task}
                    </p>
                  </div>
                  {isChecked && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                      Done
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggested Next Action & Stepper Buttons */}
        <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-ink-2">
            <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
            <span>
              <strong>Suggested Next Action:</strong> {currentPhase.suggestedNext}
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {currentPhase.step > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep(currentPhase.step - 1)}
                className="px-3.5 py-2 rounded-control text-xs font-semibold text-ink-2 hover:text-ink bg-white border border-line hover:bg-paper cursor-pointer transition-colors"
              >
                Previous Phase
              </button>
            )}
            {currentPhase.step < 5 ? (
              <button
                type="button"
                onClick={() => setActiveStep(currentPhase.step + 1)}
                className="px-4 py-2 rounded-control text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 cursor-pointer transition-colors inline-flex items-center gap-1.5"
              >
                Next: Phase 0{currentPhase.step + 1}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-control border border-emerald-200">
                Final Review Phase
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


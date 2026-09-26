import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Sparkles,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  BrainCircuit,
  GraduationCap,
  Briefcase,
  Layers,
} from 'lucide-react';
import counselorAvatar from '../assets/images/indian_student_mentor_1789576867854.jpg';

const SAMPLE_QUESTIONS = [
  'I am completing B.Tech in CSE with a 7.8 CGPA. Should I target GATE for M.Tech or direct campus placements?',
  'I took BiPC in Class 12. If I do not qualify for NEET-UG, what are my strongest alternative medical careers?',
  'What are the realistic post-study work visa rules for an MS in Germany vs the USA in 2025?',
  'My child is confused between MPC and Commerce with Maths after Class 10. How should we decide?',
];

export default function AIAdvisorPreviewSection() {
  const navigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = useState(SAMPLE_QUESTIONS[0]);

  const handleAskAdvisor = (query) => {
    navigate('/advisor', { state: { initialPrompt: query } });
  };

  return (
    <section className="py-20 sm:py-24 bg-paper border-t border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Capabilities */}
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200 px-3.5 py-1 text-xs font-semibold text-brand-700 uppercase tracking-wider mb-4">
              <BrainCircuit className="w-3.5 h-3.5" />
              Context-Aware Guidance
            </span>
            <h2 className="font-ui font-bold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight">
              Meet Your <br className="hidden sm:inline" />
              <span className="text-brand-500">AI Career Advisor.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-ink-2 leading-relaxed">
              Get practical guidance based on your academic background, interests, skills and goals.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-line text-brand-600 flex items-center justify-center shrink-0 shadow-xs">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-ui font-semibold text-ink text-sm">
                    30-Year Veteran Counseling Persona
                  </p>
                  <p className="text-xs text-ink-2 mt-0.5">
                    Speaks with calm authority, empathy, and real-world clarity. Never outputs generic fluff or repetitive questionnaire loops.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-line text-brand-600 flex items-center justify-center shrink-0 shadow-xs">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-ui font-semibold text-ink text-sm">
                    Remembers Your Session Profile
                  </p>
                  <p className="text-xs text-ink-2 mt-0.5">
                    Once you share your stream, graduation field, or goals, NAVORA remembers them throughout the consultation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-line text-brand-600 flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-ui font-semibold text-ink text-sm">
                    Concise, Action-Oriented Responses
                  </p>
                  <p className="text-xs text-ink-2 mt-0.5">
                    Respects your time with 30–80 word direct breakdowns, pinpointing entrance exams, eligibility, and verified trade-offs.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/advisor"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-ui font-semibold text-sm shadow-brand transition-all hover:-translate-y-0.5"
              >
                Talk to NAVORA AI →
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-ink-3">
                No sign-in required to begin
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Counselor Showcase Card */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-line rounded-[2rem] p-6 sm:p-8 shadow-card-lg">
              {/* Counselor Header */}
              <div className="flex items-center justify-between pb-5 border-b border-line">
                <div className="flex items-center gap-3">
                  <img
                    src={counselorAvatar}
                    alt="Senior Education Counselor"
                    className="w-12 h-12 rounded-full object-cover border-2 border-brand-200 shadow-sm"
                  />
                  <div>
                    <h3 className="font-ui font-bold text-sm text-ink">
                      Senior Academic Advisor
                    </h3>
                    <p className="text-xs text-ink-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Active consultation ready
                    </p>
                  </div>
                </div>
                <span className="text-[0.7rem] font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
                  30 Yrs Experience
                </span>
              </div>

              {/* Sample Dialog Preview */}
              <div className="mt-5 space-y-4 text-xs sm:text-sm">
                <div className="bg-paper p-3.5 rounded-2xl border border-line text-ink-2">
                  <p className="font-semibold text-ink text-xs mb-1">Student asked:</p>
                  <p className="italic">{selectedQuestion}</p>
                </div>

                <div className="bg-brand-50/70 p-4 rounded-2xl border border-brand-100 text-ink space-y-2">
                  <p className="font-semibold text-brand-800 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> NAVORA Advisor perspective:
                  </p>
                  <p className="text-xs leading-relaxed text-ink-2">
                    "With a 7.8 CGPA, you sit in the sweet spot. If your financial plan supports 2 years of study and you enjoy deep algorithms, GATE gives you IIT/NIT M.Tech credentials with full stipend. But if immediate earnings matter, secure a product engineering placement first — top tier firms value 2 years of production system experience over an average master's degree."
                  </p>
                  <span className="text-[0.68rem] text-ink-3 block pt-1">
                    Grounded • 56 words • Zero fluff
                  </span>
                </div>
              </div>

              {/* Quick Prompt Selectors */}
              <div className="mt-6 pt-5 border-t border-line">
                <p className="text-[0.7rem] font-bold uppercase tracking-wider text-ink-3 mb-2.5">
                  Try asking the counselor:
                </p>
                <div className="space-y-1.5">
                  {SAMPLE_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setSelectedQuestion(q);
                        handleAskAdvisor(q);
                      }}
                      className="w-full text-left p-2.5 rounded-xl border border-line text-[0.78rem] text-ink-2 hover:border-brand-300 hover:bg-brand-50/50 hover:text-ink transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <span className="truncate pr-2">{q}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-brand-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Scale,
  MessageCircle,
  BookOpen,
  Check,
  Zap,
  GraduationCap,
  School,
  University,
  Users,
  Target,
  TrendingUp,
  Lightbulb,
  ShieldCheck,
  Globe,
  Award,
  Briefcase,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import Button from '../components/Button';
import Logo from '../components/Logo';
import Swoosh from '../components/Swoosh';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/AnimatedPage';
import { useScrollTop } from '../hooks/useLocalStorage';
import { personas } from '../data/personas';

// High-craft custom sub-components
import CoreJourneySection from '../components/CoreJourneySection';
import StudentExplorationSection from '../components/StudentExplorationSection';
import CareerPathwayVisualizer from '../components/CareerPathwayVisualizer';
import FindYourCourseSection from '../components/FindYourCourseSection';

// Authentic images
import heroStudentImage from '../assets/images/hero_library_student_1789742031075.jpg';
import mentorImage from '../assets/images/indian_student_mentor_1789576867854.jpg';
import campusImage from '../assets/images/indian_student_campus_1789576886839.jpg';

export default function Landing() {
  useScrollTop();

  return (
    <div className="bg-paper min-h-screen text-ink overflow-hidden">
      {/* ── 1. Hero Section (Styled with Global Study cinematic contrast & colors) ─── */}
      <section className="relative pt-12 pb-20 sm:pb-28 lg:pt-16 lg:pb-32 overflow-hidden border-b border-line">
        {/* Background Image Container with Global Study scrim */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={heroStudentImage}
            alt="Students studying in university library"
            className="w-full h-full object-cover object-[70%_25%]"
          />
          {/* Global Study gradient scrim: rich slate tone keeping background image vividly visible while providing high text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/15" />
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="max-w-2xl py-4 sm:py-8 lg:py-12">
            {/* Hero Content - Unboxed with Global Study typography colors */}
            <FadeIn>
              <h1 className="font-ui font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-[-0.03em] leading-[1.08] drop-shadow-md text-balance">
                Navigate Your Future <br />
                <span className="text-brand-300 drop-shadow-sm">With Clarity.</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-100 drop-shadow leading-relaxed max-w-xl">
                NAVORA helps students understand their education options, career pathways, courses, colleges, global study opportunities and next steps — before making important decisions.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link to="/get-started">
                  <span className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-ui font-semibold text-base px-7 py-3.5 shadow-xl shadow-brand-950/40 transition-all hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto">
                    Start Your Path →
                  </span>
                </Link>
                <Link to="/study-abroad">
                  <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 border border-white/30 text-white backdrop-blur-md font-ui font-semibold text-base px-6 py-3.5 shadow-md transition-all hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto">
                    <Globe className="w-4 h-4 text-brand-300" />
                    Explore Global Study
                  </span>
                </Link>
              </div>

              {/* Value Props */}
              <div className="mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-6 border-t border-white/15">
                {[
                  'Free & Confidential',
                  'Takes ~2 minutes',
                  'Verified NIRF data',
                  'No sponsored listings',
                ].map((label) => (
                  <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/40 backdrop-blur-sm border border-white/10 text-xs sm:text-sm text-slate-200 font-medium">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" strokeWidth={3.5} />
                    </span>
                    {label}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 2. Education Ecosystem Trust Bar ───────────────────────────────── */}
      <section className="border-b border-line bg-surface py-8">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {[
              { icon: School, label: 'CBSE, ICSE & State Boards', sub: 'Class 10 & 12 curriculum mapping' },
              { icon: University, label: 'Indian Premier Institutions', sub: 'IITs, AIIMS, NLUs, Central Unis' },
              { icon: Globe, label: '14 Global Study Destinations', sub: 'US, UK, Germany, Canada, EU' },
              { icon: Users, label: 'Dedicated Parent Guides', sub: 'Transparent fees & career outcomes' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-paper border border-line text-brand-600 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="font-ui font-bold text-xs text-ink leading-tight">{item.label}</p>
                    <p className="text-[0.72rem] text-ink-3">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. NAVORA Core Journey (01 Learn, 02 Explore, 03 Decide, 04 Grow) */}
      <CoreJourneySection />

      {/* ── 4. Student Exploration Section (Student with Laptop) ──────────── */}
      <StudentExplorationSection />

      {/* ── 5. Visual Connected Career Roadmap ────────────────────────────── */}
      <CareerPathwayVisualizer />

      {/* ── 5b. Find the Right Course for You (course discovery + counselling) */}
      <FindYourCourseSection />

      {/* ── 6. Dedicated Parent Callout ────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-surface border-t border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="bg-navy rounded-[2rem] p-8 sm:p-14 text-white relative overflow-hidden shadow-card-lg">
            <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold uppercase tracking-wider mb-4">
                  <Users className="w-3.5 h-3.5" /> For Parents
                </span>
                <h2 className="font-ui font-bold text-3xl sm:text-4xl text-white tracking-tight text-balance">
                  Guiding your child shouldn’t feel like guesswork.
                </h2>
                <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
                  We provide parents with an objective, stress-free perspective: transparent fee ranges, realistic entrance exam competition, and practical alternative pathways so you can plan with complete peace of mind.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    to="/parents"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-ui font-semibold text-sm shadow-brand transition-all"
                  >
                    Open Parent Resource Hub →
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-3 text-xs">
                {[
                  {
                    title: 'After Class 10: Stream Selection',
                    desc: 'MPC, BiPC, Commerce, Humanities & Polytechnic trade-offs laid out plainly.',
                  },
                  {
                    title: 'After Class 12: Degree & Cutoffs',
                    desc: 'Entrance cutoffs, accreditation, hostel safety, and verified placements.',
                  },
                  {
                    title: 'After Graduation: Higher Studies',
                    desc: 'MBA vs Immediate Job vs Studying Abroad with full financial modeling.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="font-bold text-white text-sm">{item.title}</p>
                    <p className="text-white/70 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. Final Call to Action ────────────────────────────────────────── */}
      <section className="bg-brand-950 text-white relative overflow-hidden py-24 sm:py-28 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-brand-300 mb-3 block">
            NAVIGATE YOUR FUTURE.
          </span>
          <h2 className="font-ui font-bold text-3xl sm:text-5xl tracking-[-0.03em] text-white text-balance">
            Start your education journey with total confidence.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed max-w-xl mx-auto">
            Take the 2-minute diagnostic, explore accredited college pathways, or consult with our veteran AI advisor.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link to="/get-started">
              <span className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-ui font-semibold text-base px-8 py-3.5 shadow-brand transition-all hover:-translate-y-0.5 cursor-pointer">
                Start Your Path →
              </span>
            </Link>
            <Link to="/advisor">
              <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-ui font-semibold text-base px-7 py-3.5 border border-white/20 transition-all cursor-pointer">
                <MessageCircle className="w-4 h-4" />
                Talk to AI Advisor
              </span>
            </Link>
          </div>

          <p className="mt-8 text-xs sm:text-sm text-white/60">
            Free • Private by Design • No Account Required To Start
          </p>
        </div>
      </section>
    </div>
  );
}

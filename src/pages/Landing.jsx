import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useScrollTop } from '../hooks/useLocalStorage';
import heroPhoto from '../assets/images/navora_hero_desktop_hd.jpg';
import heroPhoto2x from '../assets/images/navora_hero_desktop_2x.jpg';

import CoreJourneySection from '../components/CoreJourneySection';
import StudentExplorationSection from '../components/StudentExplorationSection';
import CareerPathwayVisualizer from '../components/CareerPathwayVisualizer';
import FindYourCourseSection from '../components/FindYourCourseSection';

const SCOPE_ITEMS = [
  'Class 10 stream choices',
  'Class 12 degrees and entrance exams',
  'Graduation and higher study routes',
  'Parent guidance',
  'Global study',
];

function ThreeStepIntro() {
  const steps = [
    {
      number: '1',
      title: 'Pick your stream or interest',
      description: "Tell us what you're interested in or your current education level.",
    },
    {
      number: '2',
      title: 'See matching courses & careers',
      description: 'Explore personalized course options, career paths, and future opportunities.',
    },
    {
      number: '3',
      title: 'Chat with a career mentor',
      description: 'Ask questions, get guidance, and plan your next step.',
    },
  ];

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative flex flex-col items-start">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-[#c9d1e6] flex items-center justify-center text-[#0F1F4D] font-semibold">
                  {step.number}
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute left-[60px] right-[-40px] top-5 h-px bg-[#d8deee]">
                    <div className="absolute right-0 -top-1 w-2 h-2 border-t border-r border-[#9aa3c7] rotate-45"></div>
                  </div>
                )}
              </div>
              <h3 className="mt-5 text-lg sm:text-xl font-semibold text-[#0F1F4D] tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#3f4b6b] leading-relaxed max-w-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  useScrollTop();

  return (
    <div className="bg-white min-h-screen text-[#0F1F4D]">
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[80px] sm:pt-[90px] lg:pt-[100px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[28px] overflow-hidden">
            <img
              src={heroPhoto}
              srcSet={`${heroPhoto} 919w, ${heroPhoto2x} 1838w`}
              sizes="(min-width: 1440px) 1376px, (min-width: 1024px) calc(100vw - 64px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
              alt="Two students exploring their education and career options"
              width={919}
              height={611}
              fetchPriority="high"
              decoding="async"
              className="block w-full h-auto object-contain object-center"
            />
            <div className="relative z-10 flex items-center xl:absolute xl:inset-0">
              <div className="w-full px-6 sm:px-10 lg:px-16 py-10 sm:py-12 xl:py-10">
                <div className="max-w-xl">
                  <p className="text-xs sm:text-sm tracking-[0.32em] uppercase text-[#1f2f4d]/80 font-semibold">
                    EDUCATION / CAREER / A BRIGHTER TOMORROW
                  </p>
                  <h1 className="mt-4 font-serif text-[38px] leading-[1.08] sm:text-[48px] lg:text-[64px] text-[#0F1F4D] tracking-tight">
                    Navigate your future
                    <br />
                    with <span className="italic text-[#2451E0]">confidence.</span>
                  </h1>
                  <p className="mt-5 text-base sm:text-lg text-[#3f4b6b] leading-relaxed max-w-lg">
                    Explore the right courses, career paths and scholarships that match your interests, strengths and goals, all in one place.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      to="/get-started"
                      className="inline-flex items-center gap-2 rounded-full bg-[#0F1F4D] text-white px-7 py-3 text-sm sm:text-base font-semibold hover:bg-[#0b173a] transition-colors shadow-[0_12px_40px_rgba(15,31,77,0.2)]"
                    >
                      Start Your Journey
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="mt-10 flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="inline-flex items-center rounded-full border border-[#d7deee] bg-white/90 px-4 py-2 text-sm text-[#0F1F4D] shadow-sm backdrop-blur-[1px]">
                      Courses
                    </div>
                    <div className="inline-flex items-center rounded-full border border-[#d7deee] bg-white/90 px-4 py-2 text-sm text-[#0F1F4D] shadow-sm backdrop-blur-[1px]">
                      Career Paths
                    </div>
                    <div className="inline-flex items-center rounded-full border border-[#d7deee] bg-white/90 px-4 py-2 text-sm text-[#0F1F4D] shadow-sm backdrop-blur-[1px]">
                      Scholarships
                    </div>
                    <div className="inline-flex items-center rounded-full border border-[#d7deee] bg-white/90 px-4 py-2 text-sm text-[#0F1F4D] shadow-sm backdrop-blur-[1px]">
                      Top Institutes
                    </div>
                  </div>
                  <div className="mt-8 hidden lg:block">
                    <p className="text-2xl font-serif italic text-[#0F1F4D] leading-snug">
                      Better Choices
                      <br />
                      Brighter Future
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ThreeStepIntro />

      {/* ── 2. Scope bar ─────────────────────────────────────────────────── */}
      <section className="border-b border-line bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-2">
            {SCOPE_ITEMS.map((item, index) => (
              <li key={item} className="flex items-center gap-5">
                {index > 0 && <span className="hidden sm:inline text-line-strong" aria-hidden="true">|</span>}
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 3. How NAVORA works ──────────────────────────────────────────── */}
      <div id="how-it-works" className="scroll-mt-20">
        <CoreJourneySection />
      </div>

      {/* ── 4. Student exploration ───────────────────────────────────────── */}
      <StudentExplorationSection />

      {/* ── 5. Connected career roadmap ──────────────────────────────────── */}
      <CareerPathwayVisualizer />

      {/* ── 6. Course discovery and counselling ──────────────────────────── */}
      <FindYourCourseSection />

      {/* ── 7. Parent callout ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-surface border-t border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="bg-brand-950 rounded-panel p-8 sm:p-12 text-white">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <p className="text-sm font-semibold text-brand-300">For parents and guardians</p>
                <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl text-white tracking-[-0.024em] text-balance">
                  Guiding your child should not feel like guesswork.
                </h2>
                <p className="mt-4 text-sm sm:text-base text-white/75 leading-relaxed max-w-xl">
                  See transparent fee ranges, realistic entrance exam requirements,
                  and practical alternative pathways. The aim is a calm, shared
                  understanding of the options, not pressure to pick one.
                </p>

                <div className="mt-8">
                  <Link to="/parents" className="btn btn-primary btn-md">
                    Open the parent hub
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-white/15 pt-6 lg:pt-0 lg:pl-8 space-y-4">
                {[
                  {
                    title: 'After Class 10: stream selection',
                    desc: 'MPC, BiPC, Commerce, Humanities, and polytechnic trade-offs explained plainly.',
                  },
                  {
                    title: 'After Class 12: degrees and cutoffs',
                    desc: 'Entrance requirements, accreditation, hostel arrangements, and verified details.',
                  },
                  {
                    title: 'After graduation: higher study',
                    desc: 'Compare postgraduate study, work, and study-abroad routes with realistic costs.',
                  },
                ].map((item) => (
                  <div key={item.title}>
                    <p className="font-semibold text-white text-sm">{item.title}</p>
                    <p className="text-sm text-white/70 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Closing action ────────────────────────────────────────────── */}
      <section className="bg-brand-950 text-white border-t border-white/10 py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-brand-300">
            NAVIGATE YOUR FUTURE.
          </p>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-5xl tracking-[-0.028em] text-white text-balance">
            Start with the questions. Leave with a plan.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/75 leading-relaxed max-w-xl mx-auto">
            Take the short assessment, explore colleges that fit your profile, or
            ask the AI Advisor a specific question.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/get-started" className="btn btn-primary btn-lg">
              Start the assessment
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link to="/advisor" className="btn btn-lg border border-white/30 text-white hover:bg-white/10">
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              Ask the AI Advisor
            </Link>
          </div>

          <p className="mt-8 text-xs sm:text-sm text-white/70">
            Free to start · Private by design · No account needed to begin
          </p>
        </div>
      </section>
    </div>
  );
}

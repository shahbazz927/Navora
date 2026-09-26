import { Link } from 'react-router-dom';
import {
  BookOpen,
  Compass,
  Scale,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const JOURNEY_STEPS = [
  {
    num: '01',
    phase: 'Learn',
    headline: 'Understand yourself, your interests, strengths and academic background.',
    description: 'We begin by diagnosing your natural cognitive strengths, subject inclinations, and learning pace — without asking for predetermined career targets.',
    icon: BookOpen,
    accent: '#2451E0',
  },
  {
    num: '02',
    phase: 'Explore',
    headline: 'Discover degrees, careers, colleges and opportunities.',
    description: 'Broaden your horizon across 100+ accredited degrees, emerging tech roles, government opportunities, and global study pathways matched to your profile.',
    icon: Compass,
    accent: '#0D9488',
  },
  {
    num: '03',
    phase: 'Decide',
    headline: 'Compare pathways based on your priorities.',
    description: 'Weigh real trade-offs: total tuition costs, entrance competition difficulty, curriculum demands, and verified placement outcomes side by side.',
    icon: Scale,
    accent: '#B45309',
  },
  {
    num: '04',
    phase: 'Grow',
    headline: 'Build a practical direction for your next stage.',
    description: 'Transform insight into execution with exam timelines, skill-building roadmaps, alternative contingencies, and on-demand counselor follow-ups.',
    icon: TrendingUp,
    accent: '#7C3AED',
  },
];

export default function CoreJourneySection() {
  return (
    <section className="py-20 sm:py-24 bg-surface border-t border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200 px-3.5 py-1 text-xs font-semibold text-brand-700 uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            NAVORA Philosophy
          </span>
          <h2 className="font-ui font-bold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight text-balance">
            Your future doesn&rsquo;t start with a course.{' '}
            <span className="text-brand-500">It starts with understanding your options.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink-2 leading-relaxed">
            Four deliberate stages that take students and parents from uncertainty to informed, confident educational decisions.
          </p>
        </div>

        {/* 4 Connected Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {JOURNEY_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-paper border border-line rounded-[1.75rem] p-7 flex flex-col justify-between hover:border-brand-300 hover:shadow-card-lg transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: step.accent }}
                    >
                      Step {step.num}
                    </span>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${step.accent}15`,
                        color: step.accent,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-ui font-bold text-xl text-ink mb-2">
                    {step.phase}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-ink leading-snug mb-3">
                    {step.headline}
                  </p>
                  <p className="text-xs text-ink-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-line flex items-center justify-between">
                  <span className="text-[0.7rem] font-bold uppercase tracking-wider text-ink-3">
                    Phase {step.num}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: step.accent }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA banner below steps */}
        <div className="mt-12 p-6 sm:p-8 rounded-[1.75rem] bg-navy text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card-lg">
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-brand-300">
              LEARN • EXPLORE • DECIDE • GROW
            </p>
            <h3 className="text-xl sm:text-2xl font-bold font-ui text-white mt-1">
              Not sure about your next step? Let’s figure it out together.
            </h3>
            <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
              Takes just two minutes. No pressure, completely free, and designed to help you choose with confidence.
            </p>
          </div>
          <Link
            to="/get-started"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-ui font-semibold text-sm shadow-brand transition-all hover:-translate-y-0.5"
          >
            Start Your Path →
          </Link>
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  GraduationCap,
  Globe,
  MessageSquare,
  Scale,
  Search,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import Button from '../components/Button';
import Logo from '../components/Logo';
import Swoosh from '../components/Swoosh';
import { FadeIn } from '../components/AnimatedPage';
import { useScrollTop } from '../hooks/useLocalStorage';
import { ABOUT_IMAGES } from './About';

const FRAMEWORK_PILLARS = [
  {
    step: '01',
    title: 'LEARN',
    subtitle: 'Start with where you actually are.',
    desc: 'Your subjects, academic standing, genuine interests, and real constraints. Never pretend to be someone else.',
    icon: BookOpen,
  },
  {
    step: '02',
    title: 'EXPLORE',
    subtitle: 'Look beyond the first option you hear about.',
    desc: 'Popular trends are not your only choice. Map hidden specialisations, creative streams, and emerging fields.',
    icon: Search,
  },
  {
    step: '03',
    title: 'DECIDE',
    subtitle: 'Understand the reasons, trade-offs and consequences.',
    desc: 'Every path has costs, timelines, and barriers. See them clearly before you commit years of your life.',
    icon: Scale,
  },
  {
    step: '04',
    title: 'GROW',
    subtitle: 'Turn the decision into something you can act on.',
    desc: 'A decision is meaningless without next steps: target institutions, required exams, skills, and timelines.',
    icon: Target,
  },
];

const PRODUCT_STEPS = [
  {
    num: '01',
    title: 'Tell us where you are',
    desc: 'Class 12 student, nearing graduation, exploring as a parent, or looking into global study.',
  },
  {
    num: '02',
    title: 'Answer the questions that matter',
    desc: 'Academic interests, subject comfort, career priorities, budget, and location preferences.',
  },
  {
    num: '03',
    title: 'Explore relevant paths',
    desc: 'Degrees, specialisations, and real-world roles mapped directly to your answers.',
  },
  {
    num: '04',
    title: 'Understand alternatives and trade-offs',
    desc: 'Compare timelines, entry difficulty, financial requirements, and employment realities.',
  },
  {
    num: '05',
    title: 'Decide what to explore next',
    desc: 'Concrete action points: exams, required skills, colleges, and deeper advisor conversations.',
  },
];

const ECOSYSTEM_MODULES = [
  {
    title: 'CLASS 12',
    desc: 'Understand degree and career directions after school.',
    link: '/get-started',
    icon: GraduationCap,
  },
  {
    title: 'GRADUATION',
    desc: 'Explore postgraduate options, careers, specialisations and skills based on your existing degree and interests.',
    link: '/get-started',
    icon: BookOpen,
  },
  {
    title: 'PARENTS',
    desc: 'Understand the options your child is considering and support the conversation.',
    link: '/parents',
    icon: Users,
  },
  {
    title: 'GLOBAL STUDY',
    desc: 'Explore countries, education pathways, costs and post-study considerations.',
    link: '/study-abroad',
    icon: Globe,
  },
  {
    title: 'AI ADVISOR',
    desc: "Have a contextual conversation that remembers what you've already told it.",
    link: '/advisor',
    icon: MessageSquare,
  },
];

export default function HowItWorks() {
  useScrollTop();

  return (
    <div className="bg-paper min-h-screen text-ink overflow-x-hidden">
      {/* ── 1. HERO ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24 text-center">
          <FadeIn>
            <p className="eyebrow text-brand-600 mb-3 font-semibold">How it works</p>
            <h1 className="font-ui font-bold text-3xl sm:text-5xl lg:text-6xl text-ink tracking-[-0.03em] text-balance leading-tight">
              From confusion to a clear next step.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-ink-2 leading-relaxed max-w-2xl mx-auto">
              NAVORA guides you through a simple thinking framework, a short
              questionnaire, and honest comparisons — so you understand your
              options before you commit years of your life.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/get-started">
                <Button variant="primary" size="lg">
                  Start Your Path <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="secondary" size="lg">
                  About NAVORA
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 2. THE FRAMEWORK ────────────────────────────── */}
      <section className="border-b border-line bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-28">
          <FadeIn className="max-w-3xl mb-14">
            <span className="eyebrow text-brand-600 block mb-2 font-semibold">The Framework</span>
            <h2 className="font-ui font-bold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-[-0.03em]">
              How we think about a good decision.
            </h2>
            <p className="mt-4 text-ink-2 text-base leading-relaxed">
              Making a thoughtful choice isn&apos;t a one-time guess. It&apos;s a steady way of thinking that protects you from hasty commitments.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FRAMEWORK_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="relative flex flex-col justify-between p-6 sm:p-7 rounded-[1.6rem] bg-paper border border-line hover:border-brand-200 transition-all card-lift"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="font-display italic text-2xl font-bold text-brand-200">
                        {pillar.step}
                      </span>
                    </div>
                    <h3 className="font-ui font-bold text-xl text-ink tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-brand-700">
                      {pillar.subtitle}
                    </p>
                    <p className="mt-3 text-xs text-ink-2 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. THE PRODUCT FLOW ─────────────────────────── */}
      <section className="border-b border-line bg-paper">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            <FadeIn className="lg:col-span-6">
              <span className="eyebrow text-brand-600 block mb-2 font-semibold">How The Product Works</span>
              <h2 className="font-ui font-bold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-[-0.03em] leading-tight">
                It starts with questions.
              </h2>
              <div className="mt-6 space-y-4 text-ink-2 text-base leading-relaxed">
                <p className="text-lg font-medium text-ink">
                  NAVORA doesn&apos;t begin by telling you what career you should choose.
                </p>
                <p className="text-lg font-semibold text-brand-700">
                  It begins by understanding you.
                </p>
              </div>

              <div className="mt-8 space-y-3.5">
                {PRODUCT_STEPS.map((step) => (
                  <div
                    key={step.num}
                    className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-line hover:border-brand-200 transition-colors"
                  >
                    <span className="font-ui font-bold text-sm text-brand-600 bg-brand-50 border border-brand-100 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                      {step.num}
                    </span>
                    <div>
                      <h4 className="font-ui font-semibold text-sm text-ink">{step.title}</h4>
                      <p className="text-xs text-ink-3 mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="lg:col-span-6">
              <div className="rounded-[1.6rem] bg-white p-2.5 border border-line shadow-card overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden aspect-[16/11] bg-paper">
                  <img
                    src={ABOUT_IMAGES.questions.url}
                    alt={ABOUT_IMAGES.questions.alt}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-white/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="eyebrow text-brand-700 text-[0.62rem]">Objective Assessment</p>
                        <p className="text-xs font-semibold text-ink">Personalized fit based on real constraints</p>
                      </div>
                    </div>
                    <span className="text-[0.68rem] px-2 py-1 rounded-md bg-paper border border-line text-ink-2 font-semibold">
                      Decision-Ready
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[0.72rem] text-ink-3 mt-2.5 text-center">
                Independent research backed by transparent, unhyped criteria
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 4. THE ROLE OF AI ───────────────────────────── */}
      <section className="border-b border-line bg-surface">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-20 lg:py-24 text-center">
          <FadeIn>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 mb-6">
              <BrainCircuit className="w-7 h-7" />
            </div>

            <h2 className="font-ui font-bold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-[-0.03em]">
              AI helps. It doesn&apos;t decide your life.
            </h2>

            <div className="mt-6 space-y-4 text-base sm:text-lg text-ink-2 leading-relaxed max-w-2xl mx-auto">
              <p>
                AI can help organise information, identify patterns, and explain possibilities quickly.
              </p>
              <p className="font-medium text-ink">
                But a career decision is personal.
              </p>
              <p>
                That&apos;s why NAVORA uses AI as a guide through the questions and possibilities — not as a machine that claims to know your perfect future.
              </p>
            </div>

            <div className="mt-10 grid sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
              <div className="p-5 rounded-xl bg-paper border border-line">
                <p className="font-semibold text-sm text-ink mb-1">No False Certainty</p>
                <p className="text-xs text-ink-3 leading-relaxed">
                  We don&apos;t pretend an algorithm can predict the next 20 years of your life.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-paper border border-line">
                <p className="font-semibold text-sm text-ink mb-1">Transparent Reasoning</p>
                <p className="text-xs text-ink-3 leading-relaxed">
                  Every recommendation explains why a path fits and what trade-offs it carries.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-paper border border-line">
                <p className="font-semibold text-sm text-ink mb-1">You Hold The Choice</p>
                <p className="text-xs text-ink-3 leading-relaxed">
                  The goal is to build your confidence and clarity, not to hand down orders.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 5. THE ECOSYSTEM ────────────────────────────── */}
      <section className="border-b border-line bg-paper">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-28">
          <FadeIn className="max-w-2xl mb-12">
            <span className="eyebrow text-brand-600 block mb-2 font-semibold">The Platform</span>
            <h2 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em]">
              One platform. Five focused ways to navigate.
            </h2>
            <p className="mt-3 text-ink-2 text-base">
              Each module is built around where you currently stand in your educational journey.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {ECOSYSTEM_MODULES.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  to={item.link}
                  className="group flex flex-col justify-between p-5 rounded-2xl bg-surface border border-line hover:border-brand-300 hover:shadow-card transition-all"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-4 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-ui font-bold text-sm text-ink mb-1.5 flex items-center justify-between">
                      {item.title}
                      <ArrowUpRight className="w-3.5 h-3.5 text-ink-3 group-hover:text-brand-600 transition-colors" />
                    </h3>
                    <p className="text-xs text-ink-3 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CTA ────────────────────────────────── */}
      <section className="bg-brand-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-dark opacity-90" />
        <div className="absolute inset-0 bg-noise opacity-60" />
        <Swoosh variant="dark" />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 py-20 lg:py-28 text-center">
          <FadeIn>
            <Logo size="md" tone="light" onSurface className="mb-7 inline-flex" />

            <h2 className="font-ui font-bold text-4xl sm:text-5xl lg:text-6xl tracking-[-0.03em] text-balance">
              Ready to see how it works for you?
            </h2>

            <p className="mt-5 text-white/85 text-lg sm:text-xl leading-relaxed max-w-lg mx-auto">
              Answer a few questions. Understand your options. Take the next step with clarity.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link to="/get-started">
                <Button variant="primary" size="lg" className="shadow-brand">
                  Start Your Path <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/advisor">
                <Button variant="secondary" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                  Talk to NAVORA AI
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

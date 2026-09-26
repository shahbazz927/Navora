import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Sparkles,
  Target,
  BookOpen,
  Scale,
  Users,
  Check,
  Globe,
  GraduationCap,
  MessageSquare,
  HelpCircle,
  BrainCircuit,
  Search,
  ArrowUpRight,
} from 'lucide-react';
import Button from '../components/Button';
import Logo from '../components/Logo';
import Swoosh from '../components/Swoosh';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/AnimatedPage';
import { useScrollTop } from '../hooks/useLocalStorage';

// Authentic Indian student photography generated to reflect real students and mentors
import heroImg from '../assets/images/indian_student_hero_1789576848020.jpg';
import problemImg from '../assets/images/indian_student_mentor_1789576867854.jpg';
import visionImg from '../assets/images/indian_student_campus_1789576886839.jpg';
import missionImg from '../assets/images/indian_students_study_1789576906791.jpg';
import questionsImg from '../assets/images/indian_student_laptop_1789576926360.jpg';

/**
 * Authentic supporting educational photography featuring Indian students and mentors.
 * Designed to capture real, thoughtful students, candid mentorship discussions,
 * and authentic academic environments.
 */
export const ABOUT_IMAGES = {
  hero: {
    url: heroImg,
    alt: 'Indian college student thoughtfully reviewing educational pathways in a university library',
    caption: 'Standing at an important decision point',
  },
  problem: {
    url: problemImg,
    alt: 'Candid conversation between an Indian academic mentor and a student discussing future directions',
    caption: 'Well-intentioned advice rarely shows the whole picture',
  },
  vision: {
    url: visionImg,
    alt: 'Indian university student walking across campus looking forward with clarity and purpose',
    caption: 'Choosing with understanding, not pressure',
  },
  mission: {
    url: missionImg,
    alt: 'Indian college students engaged in collaborative study around an academic library table',
    caption: 'Better questions, clearer options, informed choices',
  },
  questions: {
    url: questionsImg,
    alt: 'Indian student carefully evaluating career pathways and degree options on a laptop',
    caption: 'Understanding the decision before making it',
  },
};

export default function About() {
  useScrollTop();

  return (
    <div className="bg-paper min-h-screen text-ink overflow-x-hidden">
      {/* ── 1. HERO — FULL BACKGROUND IMAGE ─────────────────────── */}
      <section className="relative overflow-hidden border-b border-line min-h-[460px] sm:min-h-[540px] lg:min-h-[620px] flex items-center">
        {/* Background photo covering the section */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={ABOUT_IMAGES.hero.url}
            alt={ABOUT_IMAGES.hero.alt}
            className="w-full h-full object-cover object-[65%_20%] sm:object-[70%_25%]"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          {/* Responsive gradient scrim: vertical on mobile so full-width text has complete contrast, horizontal on laptop */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/90 sm:bg-gradient-to-r sm:from-slate-950/90 sm:via-slate-950/65 sm:to-slate-950/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/25" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-20 lg:py-24 w-full">
          <div className="max-w-2xl lg:max-w-3xl">
            <FadeIn>
              <p className="eyebrow text-slate-300 tracking-[0.16em] uppercase text-[0.68rem] sm:text-xs mb-2.5 sm:mb-3 font-semibold">
                NAVIGATE YOUR FUTURE.
              </p>

              <h1 className="font-ui font-bold text-2xl sm:text-4xl md:text-5xl lg:text-[3.9rem] text-white text-balance tracking-[-0.03em] leading-[1.15] sm:leading-[1.06] drop-shadow-md">
                Choosing what to study next sounds simple.{' '}
                <span className="block font-display italic font-medium text-brand-300 mt-1 sm:mt-1.5 text-xl sm:text-3xl md:text-4xl lg:text-[3.4rem] drop-shadow-sm">
                  Until you&apos;re the one who has to choose.
                </span>
              </h1>

              <div className="mt-5 sm:mt-7 space-y-3 sm:space-y-4 max-w-2xl text-sm sm:text-base lg:text-lg text-slate-100 drop-shadow leading-relaxed">
                <p>
                  Parents have an opinion. Teachers have advice. Friends have suggestions.
                  The internet has thousands of answers.
                </p>
                <p className="font-medium text-white">
                  NAVORA was built to help you make sense of all of it.
                </p>
              </div>

              <div className="mt-7 sm:mt-9 flex flex-wrap items-center gap-2 sm:gap-3.5 pt-5 sm:pt-6 border-t border-white/15 text-[0.72rem] sm:text-xs text-slate-200">
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-950/50 backdrop-blur-sm border border-white/10 font-medium">
                  Free to explore
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-950/50 backdrop-blur-sm border border-white/10 font-medium">
                  No sponsored rankings
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-950/50 backdrop-blur-sm border border-white/10 font-medium">
                  Built by students, for students
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 2. THE PROBLEM — THE ADVICE PARADOX ──────────── */}
      <section className="border-b border-line bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            <FadeIn className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-[1.6rem] bg-white p-2.5 border border-line shadow-card overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden aspect-[16/11] bg-paper">
                  <img
                    src={ABOUT_IMAGES.problem.url}
                    alt={ABOUT_IMAGES.problem.alt}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-white/60">
                    <p className="eyebrow text-brand-700 text-[0.62rem]">Candid Mentorship</p>
                    <p className="text-xs font-semibold text-ink mt-0.5">{ABOUT_IMAGES.problem.caption}</p>
                  </div>
                </div>
              </div>
              <p className="text-[0.72rem] text-ink-3 mt-2.5 text-center">
                Mentors share what worked for them, but every student faces a different context
              </p>
            </FadeIn>

            <FadeIn delay={0.1} className="lg:col-span-6 order-1 lg:order-2">
              <span className="eyebrow text-brand-600 block mb-2 font-semibold">The Advice Paradox</span>
              <h2 className="font-ui font-bold text-3xl sm:text-4xl lg:text-[2.6rem] text-ink tracking-[-0.03em] leading-tight">
                Most students aren&apos;t short of advice.
              </h2>
              <p className="mt-2 font-display italic text-2xl sm:text-3xl text-brand-700 font-medium">
                They&apos;re short of clarity.
              </p>

              <div className="mt-6 space-y-4 text-ink-2 leading-relaxed text-base">
                <p>
                  When you&apos;re deciding what to study, the advice usually comes from people who care about you.
                </p>
                <div className="p-4 rounded-xl bg-paper border border-line space-y-2.5 my-3 text-sm text-ink">
                  <p className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                    <span>Your parents may tell you what they believe is safest.</span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                    <span>A teacher may recommend what they know best.</span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                    <span>A friend may tell you what worked for them.</span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                    <span>A senior may share their own experience.</span>
                  </p>
                </div>
                <p>
                  None of that advice is necessarily wrong.
                </p>
                <p className="font-semibold text-ink">
                  The problem is that it is rarely the whole picture.
                </p>
                <p>
                  That&apos;s the gap we wanted NAVORA to address.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 3. FOUNDER STORY — WE STARTED WITH A PROBLEM ── */}
      <section className="border-b border-line bg-paper">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-20 lg:py-28">
          <FadeIn>
            <span className="inline-flex items-center gap-2 rounded-full bg-white border border-brand-100 px-4 py-1.5 shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="eyebrow text-brand-700">The Starting Point</span>
            </span>

            <h2 className="font-ui font-bold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-[-0.03em] leading-tight">
              We didn&apos;t start with an AI idea.{' '}
              <span className="block font-display italic font-medium text-gradient mt-1">
                We started with a problem.
              </span>
            </h2>

            <div className="mt-8 space-y-5 text-lg text-ink-2 leading-relaxed">
              <p>
                Before NAVORA, we were students making many of the same decisions ourselves.
              </p>
              <p>
                When it was time to think about education and careers, we did what most students do.
                We asked people around us. Parents. Teachers. Friends. Seniors. Relatives.
              </p>
              <p>
                Their advice helped.
              </p>
              <p className="text-ink font-medium">
                But we also realised something:
              </p>
              <blockquote className="pl-6 border-l-4 border-brand-500 py-1 text-ink italic font-display text-xl sm:text-2xl my-6">
                &ldquo;Everyone was giving us an answer from their own experience.&rdquo;
              </blockquote>
              <p>
                What was missing was a place where we could step back and ask:
              </p>
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-3.5">
              {[
                'What are all the options?',
                'What happens after this degree?',
                'What alternatives do I have?',
                'What skills will I need?',
                'What if my interests change?',
                'And which path actually makes sense for my situation?',
              ].map((question, i) => (
                <div
                  key={question}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-surface border border-line text-sm font-medium text-ink"
                >
                  <span className="w-6 h-6 rounded-lg bg-brand-50 text-brand-700 border border-brand-100 flex items-center justify-center font-bold text-xs shrink-0">
                    {i + 1}
                  </span>
                  <span>{question}</span>
                </div>
              ))}
            </div>

            <p className="mt-9 text-lg font-semibold text-brand-700">
              NAVORA began with that question.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── 4. PREMIUM VISION SECTION ───────────────────── */}
      <section className="border-b border-line bg-surface overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            <FadeIn className="lg:col-span-6">
              <span className="eyebrow text-brand-600 block mb-2 font-semibold">Our Vision</span>
              <h2 className="font-ui font-bold text-3xl sm:text-4xl lg:text-[2.5rem] text-ink tracking-[-0.03em] leading-tight">
                A world where students choose with understanding, not pressure.
              </h2>
              <div className="mt-6 space-y-4 text-ink-2 leading-relaxed text-base">
                <p>
                  We want education decisions to be based on a clearer understanding of the options in front of you — not simply on what everyone around you says you should do.
                </p>
                <p>
                  The future will always involve uncertainty.
                </p>
                <p className="p-4 rounded-xl bg-brand-50 border border-brand-100 text-ink font-medium">
                  Our goal isn&apos;t to remove that uncertainty. It&apos;s to help students enter it better prepared.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="lg:col-span-6">
              <div className="rounded-[1.6rem] bg-white p-2.5 border border-line shadow-card overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden aspect-[16/11] bg-paper">
                  <img
                    src={ABOUT_IMAGES.vision.url}
                    alt={ABOUT_IMAGES.vision.alt}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-white/60">
                    <p className="eyebrow text-brand-700 text-[0.62rem]">A Healthier Outlook</p>
                    <p className="text-xs font-semibold text-ink mt-0.5">{ABOUT_IMAGES.vision.caption}</p>
                  </div>
                </div>
              </div>
              <p className="text-[0.72rem] text-ink-3 mt-2.5 text-center">
                Preparation replaces anxiety when options and trade-offs are made clear
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 5. MISSION SECTION ──────────────────────────── */}
      <section className="border-b border-line bg-paper overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            <FadeIn className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-[1.6rem] bg-white p-2.5 border border-line shadow-card overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden aspect-[16/11] bg-paper">
                  <img
                    src={ABOUT_IMAGES.mission.url}
                    alt={ABOUT_IMAGES.mission.alt}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-white/60">
                    <p className="eyebrow text-brand-700 text-[0.62rem]">Actionable Guidance</p>
                    <p className="text-xs font-semibold text-ink mt-0.5">{ABOUT_IMAGES.mission.caption}</p>
                  </div>
                </div>
              </div>
              <p className="text-[0.72rem] text-ink-3 mt-2.5 text-center">
                A collaborative space where curiosity leads to practical, structured outcomes
              </p>
            </FadeIn>

            <FadeIn delay={0.1} className="lg:col-span-6 order-1 lg:order-2">
              <span className="eyebrow text-brand-600 block mb-2 font-semibold">Our Mission</span>
              <h2 className="font-ui font-bold text-3xl sm:text-4xl lg:text-[2.5rem] text-ink tracking-[-0.03em] leading-tight">
                Ask better questions. Understand more options. Make better-informed decisions.
              </h2>
              <div className="mt-6 space-y-4 text-ink-2 leading-relaxed text-base">
                <p>
                  NAVORA brings structured questions, education pathways, career information, and AI-assisted guidance into one place.
                </p>
                <p>
                  We want students to understand not only what a path is, but where it can lead, what it may require, what alternatives exist, and what they can do next.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2.5">
                {['Structured Questions', 'Transparent Pathways', 'Realistic Trade-Offs', 'Tangible Next Steps'].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line text-xs font-medium text-ink"
                  >
                    <Check className="w-3.5 h-3.5 text-brand-600" />
                    {item}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 6. HOW WE THINK ABOUT A GOOD DECISION ───────── */}
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
            {[
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
            ].map((pillar) => {
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

      {/* ── 7. IT STARTS WITH QUESTIONS (PRODUCT FLOW) ──── */}
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
                {[
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
                ].map((step) => (
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

                  {/* Contextual UI indicator */}
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

      {/* ── 8. THE ROLE OF AI — HONEST & REASSURING ──────── */}
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

      {/* ── 9. THE NAVORA ECOSYSTEM ─────────────────────── */}
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
            {[
              {
                title: 'CLASS 12',
                desc: 'Understand degree and career directions after school.',
                link: '/class-12',
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
                desc: 'Have a contextual conversation that remembers what you&apos;ve already told it.',
                link: '/advisor',
                icon: MessageSquare,
              },
            ].map((item) => {
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

      {/* ── 10. THE FOUNDERS ────────────────────────────── */}
      <section className="border-b border-line bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-28">
          <FadeIn className="max-w-3xl mx-auto text-center mb-14">
            <span className="eyebrow text-brand-600 block mb-2 font-semibold">Leadership</span>
            <h2 className="font-ui font-bold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-[-0.03em]">
              Two students. One problem we couldn&apos;t ignore.
            </h2>
            <p className="mt-4 text-base text-ink-2 max-w-xl mx-auto leading-relaxed">
              We&apos;ve been on the student side of these decisions. NAVORA is our attempt to make the process clearer for the students coming after us.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Shahbaz */}
            <FadeIn className="flex">
              <div className="w-full flex flex-col bg-paper border-2 border-brand-100 rounded-[1.6rem] overflow-hidden shadow-card card-lift hover:border-brand-300 transition-all">
                <div className="relative">
                  <img
                    src="https://drive.google.com/thumbnail?id=13-ZWTE9G-8lmXZRuFL8-E30gSbUd7da2&sz=w800"
                    alt="Shahbaz — Co-Founder of NAVORA"
                    className="w-full h-[320px] sm:h-[360px] object-cover object-top bg-surface"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = '/founders/shahbaz.jpg'; }}
                  />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-brand-200 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[0.7rem] font-bold text-ink uppercase tracking-wider">Co-Founder</span>
                  </div>
                </div>

                <div className="p-7 flex flex-col gap-4 flex-1">
                  <div>
                    <h3 className="font-ui font-bold text-2xl text-ink">Shahbaz</h3>
                    <p className="eyebrow text-brand-600 text-xs mt-0.5">Co-Founder</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-brand-50/70 border border-brand-100 space-y-1">
                    <p className="text-xs font-semibold text-ink">BBA — Osmania University</p>
                    <p className="text-xs font-semibold text-ink">MBA — Osmania University</p>
                  </div>

                  <p className="text-ink-2 leading-relaxed text-sm">
                    His background in business and management contributes to NAVORA&apos;s focus on structured decision-making, practical education pathways, and understanding how academic choices connect with real-world opportunities.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Azhar */}
            <FadeIn delay={0.08} className="flex">
              <div className="w-full flex flex-col bg-paper border-2 border-brand-100 rounded-[1.6rem] overflow-hidden shadow-card card-lift hover:border-brand-300 transition-all">
                <div className="relative">
                  <img
                    src="https://drive.google.com/thumbnail?id=1NRbaeQgMxuJ4OZc0oOHEJu0EnYfnAVQf&sz=w800"
                    alt="Azhar — Co-Founder of NAVORA"
                    className="w-full h-[320px] sm:h-[360px] object-cover object-top bg-surface"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = '/founders/azhar.jpg'; }}
                  />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-brand-200 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[0.7rem] font-bold text-ink uppercase tracking-wider">Co-Founder</span>
                  </div>
                </div>

                <div className="p-7 flex flex-col gap-4 flex-1">
                  <div>
                    <h3 className="font-ui font-bold text-2xl text-ink">Azhar</h3>
                    <p className="eyebrow text-brand-600 text-xs mt-0.5">Co-Founder</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-brand-50/70 border border-brand-100 space-y-1">
                    <p className="text-xs font-semibold text-ink">BBA — Osmania University</p>
                    <p className="text-xs font-semibold text-ink">MS in Business Finance — Riga Technical University</p>
                  </div>

                  <p className="text-ink-2 leading-relaxed text-sm">
                    His background in business and finance contributes to NAVORA&apos;s focus on helping students look beyond the name of a course and consider financial requirements, realistic living costs, and long-term career direction.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.15} className="mt-12 text-center">
            <blockquote className="inline-block p-6 rounded-2xl bg-paper border border-line max-w-2xl text-ink font-medium italic text-base leading-relaxed">
              &ldquo;We&apos;ve been on the student side of these decisions. NAVORA is our attempt to make the process clearer for the students coming after us.&rdquo;
            </blockquote>
          </FadeIn>
        </div>
      </section>

      {/* ── 11. PHILOSOPHY / MEMORABLE EDITORIAL SECTION ── */}
      <section className="border-b border-line bg-paper py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <FadeIn>
            <p className="eyebrow text-brand-600 mb-4 font-semibold">Our Philosophy</p>
            <h2 className="font-ui font-bold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-[-0.03em] leading-tight">
              We don&apos;t think there is one perfect career.
            </h2>

            <div className="mt-8 space-y-3 font-display italic text-2xl sm:text-3xl text-brand-700">
              <p>There are different paths.</p>
              <p>Different priorities.</p>
              <p>Different circumstances.</p>
              <p className="text-ink">And different versions of you at different stages of life.</p>
            </div>

            <p className="mt-8 text-lg font-medium text-ink-2 leading-relaxed">
              NAVORA exists to help you understand those choices before you make them.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── 12. FINAL CTA — "STILL FIGURING IT OUT?" ─────── */}
      <section className="bg-brand-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-dark opacity-90" />
        <div className="absolute inset-0 bg-noise opacity-60" />
        <Swoosh variant="dark" />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 py-20 lg:py-28 text-center">
          <FadeIn>
            <Logo size="md" tone="light" onSurface className="mb-7 inline-flex" />

            <h2 className="font-ui font-bold text-4xl sm:text-5xl lg:text-6xl tracking-[-0.03em] text-balance">
              Still figuring it out?
            </h2>

            <div className="mt-5 space-y-2 text-white/85 text-lg sm:text-xl leading-relaxed max-w-lg mx-auto">
              <p>That&apos;s okay.</p>
              <p>You don&apos;t need to have your whole future figured out today.</p>
              <p className="font-semibold text-white">You can start with one question.</p>
            </div>

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

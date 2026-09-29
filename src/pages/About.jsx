import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
} from 'lucide-react';
import Button from '../components/Button';
import Logo from '../components/Logo';
import Swoosh from '../components/Swoosh';
import { FadeIn } from '../components/AnimatedPage';
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

      {/* ── CROSS-LINK: HOW IT WORKS ──────────────────── */}
      <section className="border-b border-line bg-surface">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-20 text-center">
          <FadeIn>
            <p className="eyebrow text-brand-600 mb-3 font-semibold">How it works</p>
            <h2 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em]">
              Wondering how NAVORA actually guides you?
            </h2>
            <p className="mt-4 text-ink-2 leading-relaxed max-w-xl mx-auto">
              See the thinking framework, the questionnaire flow, and the tools — step by step.
            </p>
            <div className="mt-7">
              <Link to="/how-it-works">
                <Button variant="primary" size="lg">
                  See How It Works <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 6. THE FOUNDERS ────────────────────────────── */}
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

      {/* ── 7. PHILOSOPHY / MEMORABLE EDITORIAL SECTION ── */}
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

      {/* ── 8. FINAL CTA — "STILL FIGURING IT OUT?" ─────── */}
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

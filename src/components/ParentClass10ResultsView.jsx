import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  RotateCcw,
  Bookmark,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Compass,
  ArrowRight,
  BookOpen,
  Check,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Info,
} from 'lucide-react';
import Button from './Button';
import { PATHWAYS_DATA } from '../data/parentClass10Pathways.js';

export default function ParentClass10ResultsView({
  result,
  answers = {},
  onRetake,
  onSaveDashboard,
  onBack,
}) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [expandedGateway, setExpandedGateway] = useState(null);
  const [selectedAltPathway, setSelectedAltPathway] = useState(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedAltPathway(null);
    };
    if (selectedAltPathway) {
      window.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedAltPathway]);

  const {
    pathwayCode = 'MPC',
    primaryPathway,
    isUndecided = false,
    whyThisFits = [],
    gateways = [],
    alternativePathways = [],
    actionSteps = [],
  } = result || {};

  const handleSave = () => {
    if (onSaveDashboard) onSaveDashboard();
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const pathway = primaryPathway || {
    code: pathwayCode,
    name: `${pathwayCode} Stream`,
    badge: 'Recommended Stream',
    color: '#0284c7',
    summary: 'A structured foundation matching your child’s stated school interests and strengths.',
    subjectsInPlusTwo: ['Core Stream Subjects', 'Language & Electives'],
    gateways: [],
  };

  return (
    <div className="min-h-screen bg-paper-gradient text-ink pb-20">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-paper/85 border-b border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-2 hover:text-ink transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to questions</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onRetake}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line text-xs font-semibold text-ink-2 hover:text-ink hover:bg-white transition-colors cursor-pointer"
              title="Retake Class 10 assessment"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>

            <Button
              size="sm"
              variant={saved ? 'secondary' : 'primary'}
              onClick={handleSave}
              className="cursor-pointer"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-brand-600" />
                  <span>Saved to dashboard</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Save pathway</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-10">
        
        {/* Hero Section */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs font-semibold text-brand-800">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Your Child’s Class 10 Pathway</span>
          </div>

          <div className="space-y-2">
            <h1 className="font-ui font-extrabold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-[-0.025em] leading-[1.12]">
              Recommended Pathway: <span className="text-brand-700">{pathway.code}</span>
            </h1>
            <p className="font-ui font-semibold text-xl sm:text-2xl text-ink-2">
              {pathway.name}
            </p>
          </div>

          <p className="text-base sm:text-lg text-ink-2 leading-relaxed max-w-3xl">
            {pathway.summary}
          </p>

          {/* Core Subjects in 10+2 / Intermediate */}
          <div className="pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-2.5">
              Core subjects in this pathway (Class 11 &amp; 12):
            </p>
            <div className="flex flex-wrap gap-2">
              {(pathway.subjectsInPlusTwo || []).map((sub, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-line text-xs sm:text-sm font-medium text-ink shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5 mr-1.5 text-brand-600 opacity-80" />
                  {sub}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Undecided / Balanced Notice if applicable */}
        {isUndecided && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6 sm:p-7 shadow-xs">
            <div className="flex items-start gap-4">
              <span className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                <Compass className="w-6 h-6" />
              </span>
              <div className="space-y-2">
                <h3 className="font-ui font-bold text-lg text-amber-950">
                  Multiple Pathways Fit Your Child’s Strengths
                </h3>
                <p className="text-sm text-amber-900/90 leading-relaxed">
                  Your child demonstrates well-rounded capability across multiple fields. We have highlighted <strong>{pathway.code}</strong> as the primary starting candidate, but their interests also strongly support the alternative pathways detailed below. We recommend comparing their gateways side-by-side before deciding on junior college admissions.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── Section: Why this fits ─────────────────────────────── */}
        <section className="rounded-2xl border border-line bg-white p-6 sm:p-8 shadow-card space-y-6">
          <div className="border-b border-line pb-4">
            <h2 className="font-ui font-bold text-xl sm:text-2xl text-ink">
              Why this fits
            </h2>
            <p className="text-sm text-ink-3 mt-1">
              Directly synthesized from your child’s stated school subjects, learning comfort, and interests.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-5">
            {whyThisFits.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-xl bg-surface/70 border border-line/60"
              >
                <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-ink leading-relaxed">
                    {reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section: Future Gateways ───────────────────────────── */}
        <section className="space-y-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Future Educational &amp; Career Trajectory
            </span>
            <h2 className="font-ui font-bold text-2xl sm:text-3xl text-ink mt-1">
              Future Gateways
            </h2>
            <p className="text-sm sm:text-base text-ink-2 mt-1.5 max-w-2xl">
              Each pathway opens distinct university degrees, entrance exams, and career directions. Here are the authentic future gateways unlocked by <strong>{pathway.code}</strong>:
            </p>
          </div>

          <div className="space-y-4">
            {gateways.map((gw, idx) => {
              const isOpen = expandedGateway === gw.id || idx === 0;
              const toggle = () => setExpandedGateway(isOpen ? null : gw.id);

              return (
                <article
                  key={gw.id || idx}
                  className="rounded-2xl border border-line bg-white shadow-card overflow-hidden transition-all"
                >
                  <div
                    onClick={toggle}
                    className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-surface/40 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <span className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 font-bold text-sm flex items-center justify-center shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="space-y-1">
                        <h3 className="font-ui font-bold text-lg sm:text-xl text-ink">
                          {gw.title}
                        </h3>
                        <p className="text-sm text-ink-2 leading-relaxed">
                          {gw.summary}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Toggle gateway details"
                      className="text-ink-3 hover:text-ink p-1 rounded-md transition-colors"
                    >
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-line/60 bg-surface/30 space-y-5">
                      {/* Example Courses */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-2 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-brand-600" />
                          Example Accredited Courses &amp; Degrees:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(gw.courses || []).map((course, cIdx) => (
                            <span
                              key={cIdx}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-line text-xs sm:text-sm font-medium text-ink shadow-2xs"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Possible Career Directions */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-2 flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-emerald-600" />
                          Possible Career Directions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(gw.careers || []).map((career, crIdx) => (
                            <span
                              key={crIdx}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm font-medium text-emerald-900"
                            >
                              {career}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Entrance & Progression Gateways */}
                      {gw.entranceRoutes && gw.entranceRoutes.length > 0 && (
                        <div className="pt-1">
                          <p className="text-xs font-semibold text-ink-3">
                            Key Entrance &amp; Admission Gateways: <span className="text-ink font-medium">{gw.entranceRoutes.join(' · ')}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* ── Section: Alternative Pathways ──────────────────────── */}
        {alternativePathways && alternativePathways.length > 0 && (
          <section className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Flexibility &amp; Viable Options
              </span>
              <h2 className="font-ui font-bold text-2xl sm:text-3xl text-ink mt-1">
                Alternative Pathways
              </h2>
              <p className="text-sm sm:text-base text-ink-2 mt-1.5">
                Class 10 decisions should never feel like a dead end. These alternative streams could also fit your child’s profile:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {alternativePathways.map((alt, idx) => (
                <div
                  key={alt.id || idx}
                  className="rounded-2xl border border-line bg-white p-6 shadow-card flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-surface border border-line text-xs font-bold text-ink">
                        {alt.code}
                      </span>
                      <span className="text-xs font-semibold text-ink-3">
                        {alt.badge}
                      </span>
                    </div>

                    <h3 className="font-ui font-bold text-lg text-ink">
                      {alt.name}
                    </h3>

                    <div className="space-y-1.5 pt-1">
                      <p className="text-xs font-bold text-ink-3 uppercase tracking-wider">
                        Why it could also fit:
                      </p>
                      <p className="text-sm text-ink-2 leading-relaxed">
                        {alt.whyItCouldFit}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <p className="text-xs font-bold text-ink-3 uppercase tracking-wider">
                        Gateways it unlocks:
                      </p>
                      <p className="text-sm text-ink font-medium leading-relaxed">
                        {alt.gatewaysOpened}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-line/60 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-ink-3">
                      Top gateways: <span className="text-ink-2 font-medium">{(alt.topGateways || []).join(', ')}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedAltPathway(alt)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold hover:bg-brand-100 hover:border-brand-300 transition-colors shadow-xs cursor-pointer ml-auto"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                      <span>Want to know</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Section: Practical Action Steps for Parents ────────── */}
        <section className="rounded-2xl border border-line bg-white p-6 sm:p-8 shadow-card space-y-5">
          <div>
            <h2 className="font-ui font-bold text-xl sm:text-2xl text-ink">
              Next Steps for You &amp; Your Child
            </h2>
            <p className="text-sm text-ink-3 mt-1">
              Practical counselor recommendations before Class 11 junior college admissions finalize.
            </p>
          </div>

          <div className="space-y-4">
            {actionSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="space-y-0.5">
                  <h4 className="font-ui font-semibold text-sm sm:text-base text-ink">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Advisor Counselor Bridge CTA ───────────────────────── */}
        <section className="rounded-2xl border border-brand-200 bg-brand-50/50 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-800 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              NAVORA 30-Year Experienced Counselor
            </span>
            <h3 className="font-ui font-bold text-xl text-ink">
              Have specific questions about {pathway.code} colleges or combinations?
            </h3>
            <p className="text-sm text-ink-2 max-w-xl">
              Discuss fee structures, board choices (CBSE vs State vs ISC), entrance coaching balance, or doubts with NAVORA’s senior education counselor.
            </p>
          </div>

          <Link
            to="/advisor"
            state={{
              userContext: `Parent of Class 10 student. Evaluated pathway: ${pathway.code} (${pathway.name}). Enjoys: ${(Array.isArray(answers.subjects) ? answers.subjects : []).join(', ')}. Comfort with math: ${answers.mathComfort || 'Comfortable'}. Career fields: ${(Array.isArray(answers.careerFields) ? answers.careerFields : []).join(', ')}. Looking for advice on Class 11 stream selection.`,
            }}
            className="shrink-0"
          >
            <Button size="lg" shine className="cursor-pointer">
              <span>Talk to Counselor</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </section>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-line">
          <button
            type="button"
            onClick={onRetake}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-2 hover:text-ink transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake questionnaire</span>
          </button>

          <Button
            size="md"
            onClick={handleSave}
            className="cursor-pointer"
          >
            <Bookmark className="w-4 h-4" />
            <span>Save to Parent Dashboard</span>
          </Button>
        </div>

      </main>

      {/* ── Modal: Alternative Pathway Full Details ─────────────── */}
      <AnimatePresence>
        {selectedAltPathway && (() => {
          const altData = PATHWAYS_DATA[selectedAltPathway.id] || selectedAltPathway;
          const fullGateways = selectedAltPathway.gateways?.length
            ? selectedAltPathway.gateways
            : (altData.gateways || []);
          const subjectsList = selectedAltPathway.subjectsInPlusTwo?.length
            ? selectedAltPathway.subjectsInPlusTwo
            : (altData.subjectsInPlusTwo || []);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedAltPathway(null)}
                className="fixed inset-0 bg-ink/60 backdrop-blur-xs transition-opacity"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-3xl max-h-[88vh] bg-white rounded-3xl border border-line shadow-2xl flex flex-col overflow-hidden z-10 my-auto"
              >
                {/* Modal Header */}
                <div className="sticky top-0 z-10 px-6 sm:px-8 py-5 bg-white/95 backdrop-blur-md border-b border-line flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="px-3 py-1 rounded-xl text-xs font-bold tracking-wide shrink-0"
                      style={{
                        backgroundColor: altData.accentBg || '#f0f9ff',
                        color: altData.color || '#0284c7',
                        border: `1px solid ${altData.accentBorder || '#bae6fd'}`,
                      }}
                    >
                      {selectedAltPathway.code}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-ink-3 uppercase tracking-wider">
                        Alternative Pathway Deep Dive
                      </p>
                      <h3 className="font-ui font-bold text-lg sm:text-xl text-ink leading-tight">
                        {selectedAltPathway.name}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedAltPathway(null)}
                    className="w-9 h-9 rounded-full bg-surface border border-line flex items-center justify-center text-ink-2 hover:text-ink hover:bg-white transition-colors cursor-pointer shrink-0"
                    aria-label="Close details"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="overflow-y-auto px-6 sm:px-8 py-6 space-y-7 text-ink">
                  {/* Summary & Why Fits */}
                  <div className="rounded-2xl border border-line bg-surface/50 p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Compass className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="font-ui font-semibold text-sm sm:text-base text-ink">
                          Why this pathway could also fit your child
                        </h4>
                        <p className="text-sm text-ink-2 leading-relaxed mt-1">
                          {selectedAltPathway.whyItCouldFit}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-line/60 flex flex-col sm:flex-row sm:items-baseline gap-1.5 text-xs sm:text-sm text-ink-2">
                      <strong className="text-ink font-semibold shrink-0">Key unlocked gateways:</strong>
                      <span>{selectedAltPathway.gatewaysOpened}</span>
                    </div>
                  </div>

                  {/* Subjects Studied in 11th & 12th */}
                  {subjectsList.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-brand-600" />
                        <h4 className="font-ui font-bold text-base text-ink">
                          Core Subjects Studied in +2 / Intermediate
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {subjectsList.map((sub, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center px-3 py-1.5 rounded-xl bg-white border border-line text-xs sm:text-sm font-medium text-ink shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 mr-1.5 shrink-0" />
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gateways, Degrees & Careers */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-brand-600" />
                        <h4 className="font-ui font-bold text-base text-ink">
                          Future Gateways, Accredited Courses &amp; Careers
                        </h4>
                      </div>
                      <span className="text-xs font-semibold text-ink-3">
                        {fullGateways.length} Gateways
                      </span>
                    </div>

                    <div className="space-y-4">
                      {fullGateways.map((gw, gIdx) => (
                        <div
                          key={gw.id || gIdx}
                          className="rounded-2xl border border-line bg-white p-5 space-y-3.5 shadow-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">
                                {gIdx + 1}
                              </span>
                              <h5 className="font-ui font-bold text-sm sm:text-base text-ink">
                                {gw.title}
                              </h5>
                            </div>
                            {gw.summary && (
                              <p className="text-xs sm:text-sm text-ink-2 mt-1 pl-7 leading-relaxed">
                                {gw.summary}
                              </p>
                            )}
                          </div>

                          {/* Courses */}
                          {gw.courses && gw.courses.length > 0 && (
                            <div className="pl-7 space-y-1.5">
                              <p className="text-xs font-bold text-brand-700 uppercase tracking-wider flex items-center gap-1.5">
                                <GraduationCap className="w-3.5 h-3.5" />
                                Undergraduate Courses &amp; Degrees:
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {gw.courses.map((course, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className="inline-flex items-center px-2.5 py-1 rounded-lg bg-sky-50/70 border border-sky-200 text-xs font-medium text-sky-900"
                                  >
                                    {course}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Careers */}
                          {gw.careers && gw.careers.length > 0 && (
                            <div className="pl-7 space-y-1.5">
                              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5" />
                                Target Career Roles:
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {gw.careers.map((career, crIdx) => (
                                  <span
                                    key={crIdx}
                                    className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs font-medium text-emerald-900"
                                  >
                                    {career}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Entrance Routes */}
                          {gw.entranceRoutes && gw.entranceRoutes.length > 0 && (
                            <div className="pl-7 pt-1 border-t border-line/50">
                              <p className="text-xs text-ink-3">
                                <span className="font-semibold text-ink">Key Entrance Exams / Admissions:</span>{' '}
                                {gw.entranceRoutes.join(' · ')}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Counselor Advice Note */}
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-700" />
                      <h4 className="font-ui font-semibold text-sm text-amber-900">
                        Senior Counselor Note: Comparing {selectedAltPathway.code} vs. {pathway.code}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                      If your child decides to choose <strong>{selectedAltPathway.code}</strong> instead of the recommended <strong>{pathway.code}</strong>, verify that they are fully comfortable with the daily classroom subjects and long-term career demands. This option remains fully valid and provides accredited professional mobility across higher education in India.
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 z-10 px-6 sm:px-8 py-4 bg-white/95 backdrop-blur-md border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedAltPathway(null)}
                    className="text-xs sm:text-sm font-semibold text-ink-2 hover:text-ink transition-colors cursor-pointer"
                  >
                    Back to assessment results
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Link
                      to="/advisor"
                      state={{
                        userContext: `Parent evaluating alternative pathway: ${selectedAltPathway.code} (${selectedAltPathway.name}) for Class 10 child. Primary recommendation was ${pathway.code}. Please advise on curriculum difficulty, board choices, and college admissions.`,
                      }}
                      className="w-full sm:w-auto"
                    >
                      <Button size="sm" shine className="w-full cursor-pointer">
                        <Sparkles className="w-3.5 h-3.5 mr-1" />
                        <span>Ask Counselor about {selectedAltPathway.code}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

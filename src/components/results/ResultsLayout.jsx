import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, X, Sparkles, Map, PieChart, Layers } from 'lucide-react';
import Button from '../Button';
import ResultsHeader from './ResultsHeader';
import ResultsContext from './ResultsContext';
import ResultsFilters from './ResultsFilters';
import CompareBar from './CompareBar';
import CompareView from './CompareView';
import ExamCalendar from './ExamCalendar';
import NextSteps from './NextSteps';
import SkillRoadmap from '../SkillRoadmap';
import StudentProfileVisualizer from '../StudentProfileVisualizer';

export default function ResultsLayout({
  onBack, header, context, filters, counts, activeFilter, onFilter,
  compareCount, onCompare, onClearCompare,
  items, renderCard,
  sidebarExams, sidebarNextColleges,
  nextSteps, stepsChecked, onToggleStep,
  onRetake, onSave, toast, setToast,
  compareOpen, setCompareOpen, compareItems, compareRows,
  answers = {}, flowKey = '', primaryCareer = null,
}) {
  const [activeResultsView, setActiveResultsView] = useState('recommendations'); // 'recommendations' | 'skill_roadmap' | 'profile_visual'

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 lg:py-10">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to questionnaire
        </button>

        <div className="mt-6">
          <ResultsHeader {...header} />
          <ResultsContext items={context} />
        </div>

        {/* ── View Switcher: Career Matches vs Skill Roadmap vs Profile Visualizer ── */}
        <div className="mt-6 bg-white border border-line rounded-2xl p-2 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Results view switcher">
            <button
              type="button"
              role="tab"
              aria-selected={activeResultsView === 'recommendations'}
              onClick={() => setActiveResultsView('recommendations')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all ${
                activeResultsView === 'recommendations'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-ink-2 hover:text-ink hover:bg-paper'
              }`}
            >
              <Layers className="w-4 h-4" />
              Career Matches ({items.length})
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeResultsView === 'skill_roadmap'}
              onClick={() => setActiveResultsView('skill_roadmap')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all ${
                activeResultsView === 'skill_roadmap'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-ink-2 hover:text-ink hover:bg-paper'
              }`}
            >
              <Map className="w-4 h-4" />
              Actionable Skill Roadmap
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeResultsView === 'profile_visual'}
              onClick={() => setActiveResultsView('profile_visual')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all ${
                activeResultsView === 'profile_visual'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-ink-2 hover:text-ink hover:bg-paper'
              }`}
            >
              <PieChart className="w-4 h-4" />
              Profile Visualisation
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-ink-3 px-2">
            <span>Verified Results</span>
          </div>
        </div>

        {/* ── Subviews ── */}
        {activeResultsView === 'skill_roadmap' ? (
          <div className="mt-6">
            <SkillRoadmap
              careerTitle={primaryCareer?.title || ''}
              educationStage={flowKey}
            />
          </div>
        ) : activeResultsView === 'profile_visual' ? (
          <div className="mt-6">
            <StudentProfileVisualizer
              answers={answers}
              flowKey={flowKey}
              showEdit={false}
            />
          </div>
        ) : (
          <>
            {filters && <ResultsFilters filters={filters} active={activeFilter} counts={counts} onChange={onFilter} />}
            <CompareBar count={compareCount} onCompare={onCompare} onClear={onClearCompare} />
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
              <div className="space-y-4 min-w-0">
                {items.map((it, idx) => renderCard(it, idx))}
                {nextSteps && <NextSteps steps={nextSteps} checked={stepsChecked || {}} onToggle={onToggleStep || (() => {})} />}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  {onRetake && <Button variant="secondary" size="lg" onClick={onRetake}>Retake this flow</Button>}
                  {onSave && <Button variant="primary" size="lg" shine onClick={onSave}>Save to dashboard ✓</Button>}
                </div>
                <p className="text-center text-xs text-ink-3 max-w-2xl mx-auto leading-relaxed">
                  Guidance, not a prediction. Educational pathways do not guarantee admission or employment. Verify eligibility, fees and dates with official sources.
                </p>
              </div>
              <aside className="space-y-4 lg:sticky lg:top-24">
                {sidebarExams && <ExamCalendar exams={sidebarExams} />}
                {sidebarNextColleges}
                <section className="bg-brand-950 border border-white/10 rounded-[14px] p-5 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-600/20 blur-2xl pointer-events-none" />
                  <p className="relative text-sm font-semibold text-white">Not fully convinced?</p>
                  <p className="relative mt-1 text-sm text-white/70 leading-relaxed">That&apos;s completely okay. Let&apos;s talk it through 1-on-1 with a career counselor.</p>
                  <Link to="/support" className="relative mt-3 inline-flex">
                    <Button size="sm" className="bg-brand-600 hover:bg-brand-700 text-white border-0">
                      Talk to a Career Counselor
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </section>
              </aside>
            </div>
          </>
        )}
      </div>

      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-brand-950 text-white text-sm font-medium rounded-full pl-4 pr-3 py-2.5 max-w-[92vw]">
          <Check className="w-4 h-4 shrink-0" /><span className="truncate">{toast}</span>
          <button type="button" onClick={() => setToast('')} aria-label="Dismiss" className="p-1 rounded-full hover:bg-white/15 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <CompareView open={compareOpen} onClose={() => setCompareOpen(false)} items={compareItems || []} rows={compareRows || []} />
    </div>
  );
}

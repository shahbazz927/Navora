import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  Briefcase,
  Layers,
  Sparkles,
  Wallet,
  MapPin,
  Target,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Pencil
} from 'lucide-react';
import { buildStudentProfile } from '../data/careerEngine';

// Domain definitions to categorize stated answers strictly without fabricating psychological scores
const DOMAINS = [
  {
    id: 'tech',
    label: 'Technology & Computing',
    keywords: ['software', 'programming', 'ai', 'data', 'coding', 'machine learning', 'robotics', 'cloud', 'cybersecurity', 'electronics', 'hardware', 'engineering', 'math', 'physics'],
    color: 'bg-brand-600',
    softColor: 'bg-brand-50 text-brand-700 border-brand-200',
  },
  {
    id: 'business',
    label: 'Management & Finance',
    keywords: ['finance', 'business', 'accounting', 'management', 'consulting', 'economics', 'marketing', 'strategy', 'investment', 'enterprise', 'commerce'],
    color: 'bg-amber-600',
    softColor: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    id: 'healthcare',
    label: 'Healthcare & Life Sciences',
    keywords: ['medicine', 'medical', 'biology', 'pharma', 'health', 'clinical', 'biotechnology', 'genetics', 'doctor', 'patient', 'therapy'],
    color: 'bg-emerald-600',
    softColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    id: 'creative',
    label: 'Design & Creative Media',
    keywords: ['design', 'ux', 'ui', 'creative', 'architecture', 'media', 'journalism', 'visual', 'writing', 'arts', 'film', 'product design'],
    color: 'bg-purple-600',
    softColor: 'bg-purple-50 text-purple-800 border-purple-200',
  },
  {
    id: 'policy',
    label: 'Law, Policy & Public Service',
    keywords: ['law', 'policy', 'civil services', 'upsc', 'litigation', 'government', 'social', 'advocacy', 'international', 'diplomacy'],
    color: 'bg-teal-600',
    softColor: 'bg-teal-50 text-teal-800 border-teal-200',
  },
];

export default function StudentProfileVisualizer({ answers = {}, flowKey = '', userType = '', showEdit = true }) {
  const profile = useMemo(() => {
    return buildStudentProfile(answers, flowKey || userType || '');
  }, [answers, flowKey, userType]);

  const hasAnswers = answers && Object.keys(answers).length > 0;

  // Calculate domain distribution strictly from stated interests and strengths
  const domainBreakdown = useMemo(() => {
    const rawTokens = [
      ...(profile.interests || []),
      ...(profile.strengths || []),
      ...(profile.workPrefs || []),
    ];

    if (rawTokens.length === 0) return [];

    let totalMatches = 0;
    const scores = DOMAINS.map((domain) => {
      let count = 0;
      const matchedTokens = [];
      rawTokens.forEach((tok) => {
        const lower = String(tok).toLowerCase();
        if (domain.keywords.some((kw) => lower.includes(kw))) {
          count++;
          matchedTokens.push(tok);
        }
      });
      totalMatches += count;
      return { ...domain, count, matchedTokens: [...new Set(matchedTokens)] };
    });

    if (totalMatches === 0) return [];

    return scores
      .map((s) => ({
        ...s,
        percentage: Math.round((s.count / totalMatches) * 100),
      }))
      .filter((s) => s.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [profile]);

  // Extract constraints
  const budget = answers.budget || answers.budgetId || answers.annualBudget || null;
  const location = answers.location || answers.preferredLocation || answers.city || null;
  const priority = answers.priority || answers.expectations || answers.clarity || answers.goal || null;
  const workPref = answers.work || answers.workStyle || answers.workEnvironment || answers.future || null;

  if (!hasAnswers) {
    return (
      <div className="bg-white border border-line rounded-panel p-6 sm:p-8 text-center" aria-label="Student Profile Visualisation - No Data">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 mx-auto flex items-center justify-center mb-3">
          <Compass className="w-6 h-6 text-brand-600" />
        </div>
        <h3 className="font-ui font-bold text-lg text-ink">No Assessment Data Yet</h3>
        <p className="text-xs sm:text-sm text-ink-2 max-w-md mx-auto mt-1.5 leading-relaxed">
          Complete NAVORA’s 2-minute diagnostic assessment to map your stated subject affinities, preferred working style, and practical constraints.
        </p>
        <Link
          to="/get-started"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 shadow-brand transition-colors"
        >
          Begin Diagnostic Assessment
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-line rounded-panel overflow-hidden shadow-card" aria-label="Student Profile Summary & Assessment Insights">
      {/* ── Visualizer Header ───────────────────────────────── */}
      <div className="bg-paper-subtle border-b border-line px-5 py-4 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-primary">Assessment Profile</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3" />
              Verified Responses
            </span>
          </div>
          <h3 className="font-ui font-bold text-lg sm:text-xl text-ink">
            Stated Interests & Decision Profile
          </h3>
        </div>

        {showEdit && (
          <Link
            to="/account"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-white border border-line px-3 py-1.5 rounded-control transition-colors self-start sm:self-auto"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Profile
          </Link>
        )}
      </div>

      <div className="p-5 sm:p-8 space-y-8">
        {/* ── 1. Stated Interests Distribution (Horizontal Stacked Bar) ── */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
            <div>
              <h4 className="font-ui font-bold text-sm sm:text-base text-ink flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-600" />
                Stated Interest & Domain Distribution
              </h4>
              <p className="text-xs text-ink-3">
                Calculated strictly from your {profile.interestLabels?.length || 0} stated interest and strength selections.
              </p>
            </div>
            <span className="text-[11px] text-ink-4 italic">No synthetic aptitude estimation</span>
          </div>

          {domainBreakdown.length > 0 ? (
            <div className="space-y-3">
              {/* Stacked visual bar */}
              <div
                className="w-full h-3.5 rounded-full bg-paper-deep overflow-hidden flex"
                role="progressbar"
                aria-label="Distribution of stated interests by domain"
              >
                {domainBreakdown.map((item) => (
                  <div
                    key={item.id}
                    style={{ width: `${item.percentage}%` }}
                    className={`${item.color} h-full transition-all duration-500`}
                    title={`${item.label}: ${item.percentage}%`}
                  />
                ))}
              </div>

              {/* Breakdown detail rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {domainBreakdown.map((item) => (
                  <div key={item.id} className="p-3 bg-paper rounded-card border border-line flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                        <span className="text-xs font-bold text-ink">{item.label}</span>
                      </div>
                      <span className="text-xs font-semibold text-brand-700 tabular-nums">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="text-[11px] text-ink-3 truncate">
                      {item.count} selection{item.count > 1 ? 's' : ''} recorded
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-card bg-paper border border-line text-xs text-ink-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-ink-4 shrink-0" />
              <span>
                Specific domain tags were not captured in this assessment version. Your general preferences are listed below.
              </span>
            </div>
          )}
        </div>

        {/* ── 2. Verified Answers & Strengths Chips ───────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-line">
          {/* Stated Interests */}
          <div>
            <h5 className="font-ui font-bold text-xs uppercase tracking-wider text-ink-3 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Stated Specific Interests ({profile.interestLabels?.length || 0})
            </h5>
            {profile.interestLabels?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.interestLabels.map((lbl) => (
                  <span
                    key={lbl}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-control bg-brand-50 border border-brand-200 text-xs font-semibold text-brand-800"
                  >
                    <CheckCircle2 className="w-3 h-3 text-brand-600" />
                    {lbl}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-3 italic">None explicitly selected</p>
            )}
          </div>

          {/* Stated Strengths / Skills */}
          <div>
            <h5 className="font-ui font-bold text-xs uppercase tracking-wider text-ink-3 mb-3 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-teal-600" />
              Stated Strengths & Comfort Areas ({profile.strengthLabels?.length || 0})
            </h5>
            {profile.strengthLabels?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.strengthLabels.map((lbl) => (
                  <span
                    key={lbl}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-control bg-teal-50 border border-teal-200 text-xs font-semibold text-teal-800"
                  >
                    <CheckCircle2 className="w-3 h-3 text-teal-600" />
                    {lbl}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-3 italic">None explicitly selected</p>
            )}
          </div>
        </div>

        {/* ── 3. Decision Priorities & Constraints Matrix ─────── */}
        <div className="pt-2 border-t border-line">
          <h5 className="font-ui font-bold text-xs uppercase tracking-wider text-ink-3 mb-3 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-brand-700" />
            Decision Priorities & Practical Constraints
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Preferred Work Environment */}
            <div className="p-3.5 bg-paper rounded-card border border-line">
              <span className="text-[11px] font-bold text-ink-3 uppercase tracking-wider block mb-1">
                Work Preference
              </span>
              <p className="text-xs sm:text-sm font-semibold text-ink">
                {workPref ? String(workPref).replace(/_/g, ' ') : (
                  <span className="text-ink-4 italic font-normal">Not specified</span>
                )}
              </p>
            </div>

            {/* Core Priority */}
            <div className="p-3.5 bg-paper rounded-card border border-line">
              <span className="text-[11px] font-bold text-ink-3 uppercase tracking-wider block mb-1">
                Key Decision Factor
              </span>
              <p className="text-xs sm:text-sm font-semibold text-ink">
                {priority ? String(priority).replace(/_/g, ' ') : (
                  <span className="text-ink-4 italic font-normal">Balanced exploration</span>
                )}
              </p>
            </div>

            {/* Annual Budget Constraint */}
            <div className="p-3.5 bg-paper rounded-card border border-line">
              <span className="text-[11px] font-bold text-ink-3 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Wallet className="w-3 h-3 text-ink-3" />
                Budget Band
              </span>
              <p className="text-xs sm:text-sm font-semibold text-ink">
                {budget ? String(budget).replace(/_/g, ' ') : (
                  <span className="text-ink-4 italic font-normal">Open / Scholarship seeker</span>
                )}
              </p>
            </div>

            {/* Location Preference */}
            <div className="p-3.5 bg-paper rounded-card border border-line">
              <span className="text-[11px] font-bold text-ink-3 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-ink-3" />
                Preferred Location
              </span>
              <p className="text-xs sm:text-sm font-semibold text-ink">
                {location ? String(location).replace(/_/g, ' ') : (
                  <span className="text-ink-4 italic font-normal">Pan-India & Global</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ── Governance Footnote ──────────────────────────────── */}
        <div className="bg-paper border border-line rounded-xl p-3.5 text-xs text-ink-2 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <span>
            <strong>Data Integrity Principle:</strong> NAVORA does not score personality traits or fabricate percentile aptitudes. All indicators above represent direct, transparent summaries of stated answers provided during your consultation questionnaire.
          </span>
        </div>
      </div>
    </div>
  );
}


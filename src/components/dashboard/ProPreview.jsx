import { Lock, ArrowRight } from 'lucide-react';
import { SectionTitle } from './DashboardHeader';

const PREVIEWS = [
  { key: 'personalized_roadmap', title: 'Personalized Roadmap', desc: 'Your interests turned into a structured education plan.' },
  { key: 'course_comparison', title: 'Advanced Career Pathways', desc: 'Alternative routes matched to your profile.' },
  { key: 'detailed_fees', title: 'Detailed College Comparison', desc: 'Fees, eligibility and admissions side by side.' },
  { key: 'pdf_reports', title: 'Reports', desc: 'Downloadable plans to share with family.' },
  { key: 'full_global_study', title: 'Global Study', desc: 'Course-country matching and post-study routes.' },
];

export default function ProPreview({ onUnlock }) {
  return (
    <section aria-labelledby="pro-preview">
      <SectionTitle title="Go further with Pro" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PREVIEWS.map((f) => (
          <button
            key={f.key}
            onClick={() => onUnlock(f.key)}
            className="text-left bg-white border border-line rounded-2xl p-4 hover:border-violet-300 hover:shadow-sm transition-all group"
            aria-label={`${f.title}, available with Pro`}
          >
            <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-violet-700 bg-violet-50 border border-violet-100 rounded-full px-2.5 py-1">
              <Lock className="w-3 h-3" /> Locked
            </span>
            <span className="block text-sm font-semibold text-ink mt-2.5">{f.title}</span>
            <span className="block text-xs text-ink-2 mt-1 leading-relaxed">{f.desc}</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 mt-2.5 group-hover:text-brand-700">
              Available with Pro <ArrowRight className="w-3 h-3" />
            </span>
          </button>
        ))}
        <button
          onClick={() => onUnlock('default')}
          className="text-left rounded-2xl p-4 bg-[#0A192F] text-white hover:bg-brand-950 transition-colors group"
        >
          <span className="block font-ui font-bold text-[1.05rem] leading-snug">Upgrade to NAVORA Pro</span>
          <span className="block text-xs text-white/65 mt-1 leading-relaxed">Deeper personalization, comparisons, roadmaps and reports.</span>
          <span className="inline-flex items-center gap-1.5 mt-3 text-sm font-bold">₹999/year <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></span>
        </button>
      </div>
    </section>
  );
}

export function UpgradeBanner({ onUpgrade }) {
  return (
    <section className="bg-gradient-to-r from-violet-700 via-brand-700 to-brand-600 text-white rounded-[1.4rem] p-6 sm:p-8 relative overflow-hidden" aria-labelledby="upgrade-cta">
      <div className="absolute -bottom-20 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="flex-1">
          <h2 id="upgrade-cta" className="font-ui font-bold text-2xl tracking-[-0.02em]">Upgrade to NAVORA Pro</h2>
          <p className="text-sm text-white/75 mt-1.5">Get personalized career plans, detailed comparisons, roadmaps, reports and more.</p>
          <p className="mt-2 font-ui font-bold text-lg">₹999<span className="text-sm font-medium text-white/70">/year</span></p>
        </div>
        <button
          onClick={onUpgrade}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-white text-ink font-semibold text-sm px-7 py-3 hover:bg-brand-50 transition-colors"
        >
          Go Pro <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

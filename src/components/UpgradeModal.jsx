import { useEffect } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { track } from '../lib/entitlements';

const FEATURE_COPY = {
  personalized_roadmap: { title:'Unlock Personalized Roadmaps', desc:'Turn your career exploration into a structured education plan with NAVORA Pro.' },
  pdf_reports: { title:'Unlock Downloadable Reports', desc:'Get personalized career & education roadmap PDFs to share with family.' },
  full_global_study: { title:'Unlock Detailed Global Study Guidance', desc:'Country comparisons, course-country matching, scholarships & post-study info.' },
  course_comparison: { title:'Unlock Course Comparison', desc:'Compare courses on eligibility, pathway, career options and more.' },
  detailed_fees: { title:'Unlock Detailed College Information', desc:'Detailed fees, eligibility, admission info and comparisons.' },
  ai_limit: { title:'Continue with NAVORA Pro', desc:'You reached today’s Free AI Advisor limit. Pro gives you 30 messages/day.' },
  college_compare: { title:'Compare more colleges with Pro', desc:'Free: up to 2 at a time. Pro: up to 10.' },
  country_compare: { title:'Compare more countries with Pro', desc:'Free: up to 2. Pro: up to 10.' },
  default: { title:'Unlock with NAVORA Pro', desc:'Your complete NAVORA guidance experience — ₹999/year.' },
};

export default function UpgradeModal({ open, onClose, feature='default' }){
  const copy = FEATURE_COPY[feature] || FEATURE_COPY.default;
  useEffect(()=>{
    if(open) track('upgrade_modal_open', { feature });
    const h=(e)=>{ if(e.key==='Escape') onClose(); };
    if(open) window.addEventListener('keydown', h);
    return ()=>window.removeEventListener('keydown', h);
  },[open, feature, onClose]);
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-line max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 w-8 h-8 rounded-full bg-paper border border-line flex items-center justify-center hover:bg-paper/80">
          <X className="w-4 h-4" />
        </button>
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-brand-600 bg-brand-50 border border-brand-100 rounded-full px-3 py-1">
          <Sparkles className="w-3.5 h-3.5" /> NAVORA Pro — ₹999/year
        </div>
        <h3 className="font-ui font-bold text-xl text-ink mt-3">{copy.title}</h3>
        <p className="text-sm text-ink-2 mt-1 leading-relaxed">{copy.desc}</p>
        <ul className="mt-4 space-y-1.5 text-sm text-ink-2">
          {['Detailed career pathways','Personalized roadmap','College comparison (up to 10)','Advanced AI Advisor (30/day)','Global Study tools','Downloadable reports'].map(f=>(
            <li key={f} className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />{f}</li>
          ))}
        </ul>
        <div className="mt-6 flex gap-2">
          <Link to="/pricing" onClick={()=>track('upgrade_cta_clicked',{feature})} className="flex-1 inline-flex justify-center items-center rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-3 text-sm">Upgrade to Pro — ₹999/year</Link>
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-line text-sm font-medium hover:bg-paper">Maybe later</button>
        </div>
        <p className="text-xs text-ink-3 mt-3 text-center">≈ ₹83/month · No fake discounts · Cancel anytime</p>
      </div>
    </div>
  );
}

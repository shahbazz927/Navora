import { useEffect, useState } from 'react';
import { X, Sparkles, Check, PartyPopper, Loader2 } from 'lucide-react';
import { track } from '../lib/entitlements';
import { startProCheckout } from '../lib/razorpay';

const FEATURE_COPY = {
  personalized_roadmap: { title: 'Unlock Personalized Roadmaps', desc: 'Turn your career exploration into a structured education plan with NAVORA Pro.' },
  pdf_reports: { title: 'Unlock Downloadable Reports', desc: 'Get personalized career & education roadmap PDFs to share with family.' },
  full_global_study: { title: 'Unlock Detailed Global Study Guidance', desc: 'Country comparisons, course-country matching, scholarships & post-study info.' },
  course_comparison: { title: 'Unlock Course Comparison', desc: 'Compare courses on eligibility, pathway, career options and more.' },
  detailed_fees: { title: 'Unlock Detailed College Information', desc: 'Detailed fees, eligibility, admission info and comparisons.' },
  ai_limit: { title: 'Continue with NAVORA Pro', desc: 'You reached today’s Free AI Advisor limit. Pro gives you 30 messages/day.' },
  college_compare: { title: 'Compare more colleges with Pro', desc: 'Free: up to 2 at a time. Pro: up to 10.' },
  country_compare: { title: 'Compare more countries with Pro', desc: 'Free: up to 2. Pro: up to 10.' },
  university_compare: { title: 'Compare universities with Pro', desc: 'University comparison is a Pro feature: up to 20/month.' },
  default: { title: 'Unlock with NAVORA Pro', desc: 'Your complete NAVORA guidance experience — ₹999/year.' },
};

const BENEFITS = [
  'Detailed career pathways',
  'Personalized roadmap',
  'College comparison (up to 10)',
  'Advanced AI Advisor (30/day)',
  'Global Study tools',
  'Downloadable reports',
];

// One reusable modal: locked-feature pitch + real Razorpay checkout + result states.
export default function UpgradeModal({ open, onClose, feature = 'default', prefill, onProActivated }) {
  const copy = FEATURE_COPY[feature] || FEATURE_COPY.default;
  const [phase, setPhase] = useState('pitch'); // pitch|starting|verifying|success|error
  const [message, setMessage] = useState('');
  const [expiresAt, setExpiresAt] = useState(null);

  useEffect(() => {
    if (open) {
      track('upgrade_modal_open', { feature });
      setPhase('pitch');
      setMessage('');
      setExpiresAt(null);
    }
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, feature, onClose]);

  if (!open) return null;

  const startCheckout = () => {
    track('pro_checkout_started', { feature });
    setPhase('starting');
    setMessage('');
    startProCheckout({
      prefill,
      onSuccess: ({ expiresAt: exp, alreadyActive }) => {
        setExpiresAt(exp);
        setPhase('success');
        track('pro_checkout_succeeded', { feature, alreadyActive: !!alreadyActive });
        onProActivated?.();
      },
      onFailure: (msg) => {
        setMessage(msg || 'Your payment could not be completed.');
        setPhase('error');
      },
      onCancel: () => {
        // Checkout closed: return quietly, no success claims.
        if (phase === 'starting') setPhase('pitch');
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={copy.title}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={phase === 'verifying' ? undefined : onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-line max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 w-8 h-8 rounded-full bg-paper border border-line flex items-center justify-center hover:bg-paper/80">
          <X className="w-4 h-4" />
        </button>

        {phase === 'success' ? (
          <div className="text-center py-4">
            <span className="inline-flex w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 items-center justify-center">
              <PartyPopper className="w-7 h-7" />
            </span>
            <h3 className="font-ui font-bold text-xl text-ink mt-4">Welcome to NAVORA Pro</h3>
            <p className="text-sm text-ink-2 mt-1">Your Pro access is now active{expiresAt ? ` until ${new Date(expiresAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}.</p>
            <button onClick={onClose} className="mt-6 w-full inline-flex justify-center rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-3 text-sm">
              Continue to NAVORA
            </button>
          </div>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-brand-600 bg-brand-50 border border-brand-100 rounded-full px-3 py-1">
              <Sparkles className="w-3.5 h-3.5" /> NAVORA Pro — ₹999/year
            </div>
            <h3 className="font-ui font-bold text-xl text-ink mt-3">{copy.title}</h3>
            <p className="text-sm text-ink-2 mt-1 leading-relaxed">{copy.desc}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-ink-2">
              {BENEFITS.map((f) => (
                <li key={f} className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />{f}</li>
              ))}
            </ul>

            {phase === 'error' && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
                <p className="text-sm font-medium text-red-800">{message}</p>
                <button onClick={startCheckout} className="mt-1 text-sm font-semibold text-brand-700 hover:text-brand-800">Try Again</button>
              </div>
            )}

            <div className="mt-6 flex gap-2">
              <button
                onClick={startCheckout}
                disabled={phase === 'starting'}
                className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-5 py-3 text-sm"
              >
                {phase === 'starting' && <Loader2 className="w-4 h-4 animate-spin" />}
                {phase === 'starting' ? 'Opening checkout…' : 'Upgrade to Pro — ₹999/year'}
              </button>
              <button onClick={onClose} className="px-5 py-3 rounded-xl border border-line text-sm font-medium hover:bg-paper">Maybe later</button>
            </div>
            <p className="text-xs text-ink-3 mt-3 text-center">One-time annual access · 365 days · Secure payment via Razorpay</p>
          </>
        )}
      </div>
    </div>
  );
}

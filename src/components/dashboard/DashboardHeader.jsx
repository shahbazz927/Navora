import { Link } from 'react-router-dom';
import { BadgeCheck, Sparkles } from 'lucide-react';
import { firstName } from '../../lib/dashboard';

export function SectionTitle({ title, action }) {
  return (
    <div className="flex items-baseline justify-between gap-3 mb-3">
      <h2 className="font-ui font-bold text-[1.15rem] tracking-[-0.02em] text-ink">{title}</h2>
      {action}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-paper-deep rounded-xl ${className}`} aria-hidden="true" />;
}

export function SectionError({ onRetry }) {
  return (
    <div className="bg-white border border-line rounded-2xl p-5 text-sm" role="alert">
      <p className="font-semibold text-ink">Something went wrong.</p>
      <button onClick={onRetry} className="mt-2 text-brand-600 font-semibold hover:text-brand-700">
        Try again
      </button>
    </div>
  );
}

export function EmptyState({ title, desc, ctaLabel, ctaTo }) {
  return (
    <div className="bg-white border border-line rounded-2xl p-6 text-center">
      <p className="font-semibold text-ink text-sm">{title}</p>
      <p className="text-sm text-ink-2 mt-1">{desc}</p>
      {ctaLabel && ctaTo && (
        <Link
          to={ctaTo}
          className="mt-4 inline-flex items-center rounded-xl bg-ink text-white text-sm font-semibold px-5 py-2.5 hover:bg-brand-950 transition-colors"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}

export default function DashboardHeader({ isPro, user, onboarding, planLabel }) {
  const name = firstName({ onboarding, user });
  const hello = name ? `Hello, ${name} 👋` : 'Hello there 👋';
  const sub = isPro
    ? "Your personalized journey is ready. Here's your complete roadmap."
    : "Your future is full of possibilities. Let's explore them together!";
  const initial = (onboarding?.name || user?.user_metadata?.full_name || user?.email || '?').charAt(0).toUpperCase();

  return (
    <header className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-ui font-bold text-[1.5rem] sm:text-[1.75rem] tracking-[-0.02em] text-ink leading-tight">
          {hello}
        </h1>
        <p className="text-sm text-ink-2 mt-1">{sub}</p>
        <p className="mt-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 border text-xs font-semibold ${
              isPro ? 'bg-violet-50 border-violet-200 text-violet-800' : 'bg-white border-line text-ink-3'
            }`}
          >
            {isPro ? <Sparkles className="w-3.5 h-3.5" /> : <BadgeCheck className="w-3.5 h-3.5" />}
            {planLabel}
          </span>
        </p>
      </div>
      <Link to="/account" className="flex items-center gap-2.5 shrink-0 group" aria-label="Your profile and settings">
        <span className="hidden sm:block text-right leading-tight">
          <span className="block text-sm font-semibold text-ink truncate max-w-[10rem]">
            {onboarding?.name || user?.user_metadata?.full_name || user?.email || 'Account'}
          </span>
          <span className="block text-xs text-ink-3 group-hover:text-ink">View account</span>
        </span>
        <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-brand-950 text-white font-ui font-semibold">
          {initial}
        </span>
      </Link>
    </header>
  );
}

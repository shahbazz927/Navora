import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Compass } from 'lucide-react';

export default function CareerAssessmentHero({ completed, userType }) {
  if (completed) {
    return (
      <section className="bg-brand-950 text-white rounded-[1.4rem] p-6 sm:p-8 relative overflow-hidden" aria-labelledby="assess-hero">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-brand-600/25 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-200">Career profile</p>
          <h2 id="assess-hero" className="font-ui font-bold text-2xl sm:text-[1.7rem] tracking-[-0.02em] mt-2">
            Your Career Profile Is Ready
          </h2>
          <p className="text-sm text-white/70 mt-2 max-w-xl">
            Explore career pathways based on your interests, strengths and goals.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              to={userType ? `/recommendations/${userType}` : '/get-started'}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-ink text-sm font-semibold px-5 py-2.5 hover:bg-brand-50 transition-colors"
            >
              View My Results <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="bg-brand-950 text-white rounded-[1.4rem] p-6 sm:p-8 relative overflow-hidden" aria-labelledby="assess-hero">
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-brand-600/25 blur-3xl" aria-hidden="true" />
      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-200">Get started</p>
        <h2 id="assess-hero" className="font-ui font-bold text-2xl sm:text-[1.7rem] tracking-[-0.02em] mt-2">
          Discover Your Best Career Paths
        </h2>
        <p className="text-sm text-white/70 mt-2 max-w-xl">
          Take a quick assessment to get personalized career suggestions based on your interests, skills and goals.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            to="/get-started"
            className="inline-flex items-center gap-2 rounded-xl bg-white text-ink text-sm font-semibold px-5 py-2.5 hover:bg-brand-50 transition-colors"
          >
            Start Career Quiz <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
            <Clock className="w-3.5 h-3.5" /> Takes 5–7 minutes
          </span>
        </div>
      </div>
    </section>
  );
}

export function AssessmentHeroSkeleton() {
  return <div className="rounded-[1.4rem] bg-white border border-line p-6 sm:p-8 animate-pulse" aria-hidden="true"><div className="h-5 w-48 bg-paper-deep rounded mb-3" /><div className="h-3 w-full bg-paper-deep rounded mb-2" /><div className="h-3 w-2/3 bg-paper-deep rounded" /></div>;
}

import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';

export default function CareerAssessmentHero({ completed, userType }) {
  if (completed) {
    return (
      <section className="bg-brand-950 text-white rounded-panel p-6 sm:p-8" aria-labelledby="assess-hero">
        <p className="text-xs font-semibold text-brand-200">Career profile</p>
        <h2 id="assess-hero" className="font-display font-bold text-2xl sm:text-[1.7rem] tracking-[-0.02em] mt-2">
          Your career profile is ready
        </h2>
        <p className="text-sm text-white/70 mt-2 max-w-xl">
          Explore career pathways based on your interests, strengths, and goals.
        </p>
        <div className="mt-5">
          <Link
            to={userType ? `/recommendations/${userType}` : '/get-started'}
            className="inline-flex items-center gap-2 rounded-control bg-white text-ink text-sm font-semibold px-5 py-2.5 hover:bg-brand-50 transition-colors"
          >
            View my results <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-brand-950 text-white rounded-panel p-6 sm:p-8" aria-labelledby="assess-hero">
      <p className="text-xs font-semibold text-brand-200">Get started</p>
      <h2 id="assess-hero" className="font-display font-bold text-2xl sm:text-[1.7rem] tracking-[-0.02em] mt-2">
        Discover your best career paths
      </h2>
      <p className="text-sm text-white/70 mt-2 max-w-xl">
        Take a short assessment to get career suggestions based on your interests,
        skills, and goals.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          to="/get-started"
          className="inline-flex items-center gap-2 rounded-control bg-white text-ink text-sm font-semibold px-5 py-2.5 hover:bg-brand-50 transition-colors"
        >
          Start career quiz <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
        <span className="inline-flex items-center gap-1.5 text-xs text-white/65">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" /> Takes 5 to 7 minutes
        </span>
      </div>
    </section>
  );
}

export function AssessmentHeroSkeleton() {
  return (
    <div className="rounded-panel bg-white border border-line p-6 sm:p-8 animate-pulse" aria-hidden="true">
      <div className="h-5 w-48 bg-paper-deep rounded mb-3" />
      <div className="h-3 w-full bg-paper-deep rounded mb-2" />
      <div className="h-3 w-2/3 bg-paper-deep rounded" />
    </div>
  );
}

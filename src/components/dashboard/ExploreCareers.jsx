import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Briefcase } from 'lucide-react';
import { SectionTitle } from './DashboardHeader';

// Curated from the real NAVORA career database (src/data/careers.js) —
// shown only when the user has no personalized recommendations yet.
const POPULAR_IDS = ['software-engineer', 'data-scientist', 'ux-designer', 'business-analyst'];

export default function ExploreCareers({ personalized = [], popular = [], userType }) {
  const hasPersonal = personalized.length > 0;
  const cards = hasPersonal ? personalized.slice(0, 4) : popular.filter((c) => POPULAR_IDS.includes(c.id)).slice(0, 4);
  const recPath = userType ? `/recommendations/${userType}` : '/get-started';

  return (
    <section aria-labelledby="explore-careers">
      <SectionTitle
        title={hasPersonal ? 'Your Career Matches' : 'Explore Popular Careers'}
        action={<Link to={recPath} className="text-sm font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>}
      />
      {cards.length === 0 ? (
        <p className="text-sm text-ink-2 bg-white border border-line rounded-2xl p-5">
          Take the assessment to see careers matched to your profile. <Link to="/get-started" className="text-brand-600 font-semibold">Start now →</Link>
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {cards.map((c, i) => (
            <Link
              key={c.career?.id || c.id || i}
              to={recPath}
              className="group bg-white border border-line rounded-2xl p-4 hover:border-brand-200 hover:shadow-sm transition-all flex items-center gap-3"
            >
              <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 font-ui font-bold">
                {hasPersonal ? <span className="text-sm">{i + 1}</span> : <Briefcase className="w-4 h-4" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink truncate group-hover:text-brand-700">{c.title}</span>
                <span className="block text-xs text-ink-3 truncate">{c.career?.category || c.category || ''}{c.band ? ` · ${c.band}` : ''}</span>
              </span>
              <ArrowUpRight className="w-4 h-4 text-ink-3 group-hover:text-brand-600 shrink-0" />
            </Link>
          ))}
        </div>
      )}
      {!hasPersonal && (
        <p className="text-xs text-ink-3 mt-2">Popular starting points — your assessment unlocks matches picked for you.</p>
      )}
    </section>
  );
}

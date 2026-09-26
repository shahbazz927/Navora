import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionTitle, EmptyState } from './DashboardHeader';

const ALIGN_WORDS = ['Strong alignment with your profile', 'Good alignment with your interests', 'Potential pathway based on your preferences', 'Alternative pathway worth exploring'];

export default function CareerPaths({ items = [], userType }) {
  const recPath = userType ? `/recommendations/${userType}` : '/get-started';
  return (
    <section aria-labelledby="career-paths">
      <SectionTitle
        title="Your Recommended Career Paths"
        action={<Link to={recPath} className="text-sm font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>}
      />
      {items.length === 0 ? (
        <EmptyState title="No recommendations yet" desc="Complete your profile and assessment to unlock career pathways picked for you." ctaLabel="Complete Profile" ctaTo="/get-started" />
      ) : (
        <ol className="bg-white border border-line rounded-2xl divide-y divide-line/70">
          {items.slice(0, 4).map((c, i) => (
            <li key={c.career?.id || i}>
              <Link to={recPath} className="group flex items-center gap-4 px-4 sm:px-5 py-4">
                <span className="w-9 h-9 rounded-xl bg-brand-950 text-white font-ui font-bold text-sm flex items-center justify-center shrink-0" aria-hidden="true">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink group-hover:text-brand-700 truncate">{c.title}</span>
                  <span className="block text-xs text-ink-2 mt-0.5">“{ALIGN_WORDS[Math.min(i, 3)]}”{c.career?.description ? ` — ${c.career.description.slice(0, 90)}${c.career.description.length > 90 ? '…' : ''}` : ''}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-ink-3 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

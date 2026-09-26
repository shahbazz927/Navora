import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, GitCompare } from 'lucide-react';
import { SectionTitle, EmptyState } from './DashboardHeader';

export default function CollegeRecs({ colleges = [] }) {
  return (
    <section aria-labelledby="college-recs">
      <SectionTitle
        title="College Recommendations"
        action={<Link to="/colleges" className="text-sm font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>}
      />
      {colleges.length === 0 ? (
        <EmptyState title="No college matches yet" desc="Complete your profile to see colleges matched to your courses and goals." ctaLabel="Complete Profile" ctaTo="/get-started" />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {colleges.slice(0, 4).map((c) => {
            const fee = c.minAnnualFee ? `₹${Number(c.minAnnualFee).toLocaleString('en-IN')}/yr` : null;
            const course = c.courses?.[0] ? `${c.courses[0].degree || ''} ${c.courses[0].specialization || ''}`.trim() : '';
            return (
              <article key={c.slug || c.id} className="bg-white border border-line rounded-2xl p-4 flex flex-col hover:border-brand-200 hover:shadow-sm transition-all">
                <h3 className="text-sm font-semibold text-ink leading-snug line-clamp-2">{c.name}</h3>
                <p className="text-xs text-ink-3 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.location || c.city || 'Information unavailable'}</p>
                {course && <p className="text-xs text-ink-2 mt-2">{course}</p>}
                <p className="text-xs mt-1.5">
                  <span className="text-ink-3">Fees: </span>
                  {fee ? <span className="font-semibold text-ink">{fee}</span> : <span className="text-ink-3">Information unavailable</span>}
                </p>
                <p className="text-xs mt-1">
                  <span className="text-ink-3">Admission: </span>
                  {c.courses?.[0]?.entrance_exam ? <span className="text-ink-2">{c.courses[0].entrance_exam}</span> : <span className="text-ink-3">Information unavailable</span>}
                </p>
                <div className="mt-3 flex gap-2">
                  <Link to={`/colleges/${c.slug}`} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-ink text-white hover:bg-brand-950 transition-colors">View</Link>
                  <Link to="/colleges/compare" className="inline-flex items-center gap-1 text-xs font-semibold px-3.5 py-2 rounded-lg border border-line hover:border-brand-200 transition-colors">
                    <GitCompare className="w-3 h-3" /> Compare
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

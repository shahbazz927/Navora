import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Award, ArrowRight, Bookmark, ShieldCheck } from 'lucide-react';
import { SCHOLARSHIPS } from '../data/scholarships';
import { normalizeProfile, evaluateEligibility, getMatchLabel, isScholarshipActive } from '../lib/scholarshipMatching';
import { useUser } from '../context/UserContext';
import { useSavedScholarships } from '../hooks/useSavedScholarships';
import { useScrollTop } from '../hooks/useLocalStorage';

// Public scholarship discovery index. Lists ONLY verified records from the
// existing master data (src/data/scholarships.js, merged India + abroad).
// Detail pages (/scholarships/:scholarshipId) already exist — this page is
// the missing entry point that links to them. No invented data.
export default function Scholarships() {
  useScrollTop();
  const { answers, onboardingData } = useUser();
  const { isSaved, toggle } = useSavedScholarships();
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('all'); // all | india | abroad
  const [level, setLevel] = useState('all'); // all | UG | PG | Diploma
  const [matchedOnly, setMatchedOnly] = useState(false);

  const hasProfile = answers && Object.keys(answers).length > 0;
  const profile = useMemo(
    () => (hasProfile ? normalizeProfile({ answers, onboardingData }) : null),
    [answers, onboardingData, hasProfile],
  );

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SCHOLARSHIPS.map((s) => {
      const abroad = (s.country || 'India') !== 'India';
      const evalRes = profile ? evaluateEligibility(s, profile) : { match: null, reasons: [] };
      return { s, abroad, match: evalRes.match, reasons: evalRes.reasons };
    }).filter(({ s, abroad, match }) => {
      if (region === 'india' && abroad) return false;
      if (region === 'abroad' && !abroad) return false;
      if (level !== 'all' && !(s.education_levels || []).includes(level)) return false;
      if (matchedOnly && hasProfile && !(match === 'YOU_MAY_BE_ELIGIBLE' || match === 'POTENTIAL_MATCH')) return false;
      if (q) {
        const hay = `${s.name} ${s.provider_name} ${s.country || ''} ${(s.eligible_courses || []).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, region, level, matchedOnly, profile, hasProfile]);

  const indiaCount = SCHOLARSHIPS.filter((s) => (s.country || 'India') === 'India').length;
  const abroadCount = SCHOLARSHIPS.length - indiaCount;

  return (
    <div className="min-h-screen bg-paper-gradient">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 lg:py-14">
        <p className="inline-flex items-center gap-2 eyebrow text-brand-600 mb-3">
          <Award className="w-4 h-4" /> Scholarships
        </p>
        <h1 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em] text-balance">
          Scholarships worth knowing about
        </h1>
        <p className="mt-3 text-ink-2 leading-relaxed max-w-2xl">
          Verified Indian and abroad scholarships from NAVORA&apos;s master list — with official sources,
          eligibility rules and deadlines. Final eligibility is always decided by the provider.
        </p>

        {/* Filters */}
        <div className="mt-8 bg-white border border-line rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, provider, course or country…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-line bg-paper text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-brand-400 focus:bg-white"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `All (${SCHOLARSHIPS.length})` },
              { id: 'india', label: `India (${indiaCount})` },
              { id: 'abroad', label: `Abroad (${abroadCount})` },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setRegion(r.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${region === r.id ? 'bg-brand-500 text-white border-brand-500' : 'bg-paper text-ink-2 border-line hover:border-brand-300'}`}
              >
                {r.label}
              </button>
            ))}
            <span className="w-px h-5 bg-line mx-1" aria-hidden="true" />
            {['all', 'UG', 'PG', 'Diploma'].map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${level === l ? 'bg-ink text-white border-ink' : 'bg-paper text-ink-2 border-line hover:border-brand-300'}`}
              >
                {l === 'all' ? 'All levels' : l}
              </button>
            ))}
            {hasProfile && (
              <button
                onClick={() => setMatchedOnly(!matchedOnly)}
                className={`ml-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${matchedOnly ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-paper text-ink-2 border-line hover:border-brand-300'}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Matching my profile
              </button>
            )}
          </div>
          {!hasProfile && (
            <p className="text-xs text-ink-3">
              Tip: <Link to="/get-started" className="text-brand-600 font-semibold underline">complete the assessment</Link> to see profile-based eligibility matches here.
            </p>
          )}
        </div>

        {/* Results */}
        <p className="mt-6 text-sm text-ink-2">
          Showing <span className="font-bold text-ink">{items.length}</span> scholarship{items.length === 1 ? '' : 's'}
        </p>
        {items.length === 0 ? (
          <div className="mt-4 bg-white border border-line rounded-2xl p-10 text-center">
            <Award className="w-10 h-10 text-ink-3 mx-auto mb-3" />
            <h3 className="font-ui font-semibold text-lg text-ink">No scholarships match these filters</h3>
            <p className="text-sm text-ink-2 mt-1">Try a different search term or clear the filters.</p>
            <button
              onClick={() => { setQuery(''); setRegion('all'); setLevel('all'); setMatchedOnly(false); }}
              className="mt-4 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            {items.map(({ s, abroad, match }) => {
              const saved = isSaved(s.id);
              const active = isScholarshipActive(s);
              return (
                <article key={s.id} className="bg-white border border-line rounded-2xl p-5 hover:border-brand-200 hover:shadow-card transition-all flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-ui font-semibold text-ink leading-snug">{s.name}</h2>
                      <p className="text-xs text-ink-3 mt-1">{s.provider_name}</p>
                    </div>
                    <button
                      onClick={() => toggle(s.id)}
                      title={saved ? 'Unsave' : 'Save scholarship'}
                      aria-label={saved ? 'Unsave scholarship' : 'Save scholarship'}
                      className={`p-2 rounded-lg border shrink-0 ${saved ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-paper border-line text-ink-3 hover:text-ink'}`}
                    >
                      <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${abroad ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                      {abroad ? s.country : 'India'}
                    </span>
                    {s.scholarship_type && <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-paper text-ink-2 border border-line">{s.scholarship_type}</span>}
                    {(s.education_levels || []).slice(0, 3).map((l) => (
                      <span key={l} className="px-2 py-0.5 text-xs font-medium rounded-full bg-paper text-ink-2 border border-line">{l}</span>
                    ))}
                    {!active && <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-500 border border-slate-200">Check status</span>}
                  </div>
                  <p className="text-sm text-ink-2 mt-3 leading-relaxed line-clamp-2">{s.description}</p>
                  <div className="mt-2 text-xs text-ink-3">
                    <span className="font-semibold text-ink-2">{s.tuition_coverage || (s.award_amount ? `${s.award_currency || 'INR'} ${Number(s.award_amount).toLocaleString('en-IN')}` : 'As per scheme')}</span>
                    {' · '}Deadline: {s.application_deadline ? new Date(s.application_deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'See official source'}
                  </div>
                  {hasProfile && match && (
                    <p className="mt-2 text-xs font-semibold text-brand-700">{getMatchLabel(match)}</p>
                  )}
                  <Link
                    to={`/scholarships/${s.id}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-800"
                  >
                    View eligibility & details <ArrowRight className="w-4 h-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        <p className="mt-8 text-xs text-ink-3 leading-relaxed max-w-3xl mx-auto text-center">
          Scholarship availability, eligibility and deadlines can change. Verify the latest information on the
          official provider website before applying. NAVORA does not guarantee awards.
        </p>
      </div>
    </div>
  );
}

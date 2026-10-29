import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  Check,
  ClipboardList,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { ALL_INSTITUTIONS } from '../data/institutionsMaster';

const formatFeeShort = (amount) => {
  if (!amount) return 'See college page';
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh / yr`;
  return `₹${amount.toLocaleString('en-IN')} / yr`;
};

// Real directory entries — slugs resolve to working /colleges/:slug routes.
// Tuition, location, levels, entry routes and hostel values below come
// straight from these records. No rankings or placement figures are shown.
const COMPARE_SLUGS = ['iit-hyderabad', 'iiit-hyderabad'];
const compareColleges = COMPARE_SLUGS.map((slug) =>
  ALL_INSTITUTIONS.find((i) => i.slug === slug),
).filter(Boolean);

const btechEntry = (college) =>
  college.courses?.find((c) => c.degree === 'B.Tech')?.entranceExam || 'See college page';

// Static field rows for the Step 1 mock. They mirror the dimensions the real
// questionnaire asks about (stage, interests, budget, location) and collect
// nothing — the working questionnaire lives at /get-started.
const PROFILE_FIELDS = [
  { label: 'I am exploring as', value: 'Class 12 student' },
  { label: 'Interests', value: 'Science & technology' },
  { label: 'Yearly budget', value: '₹1–2 lakh' },
  { label: 'Preferred location', value: 'Hyderabad' },
];

// Clearly labelled static example — NAVORA has no deadline tracker or
// auto-generated plan, so this checklist is illustrative only.
const PLAN_ITEMS = [
  { text: 'Shortlist 3–5 colleges from the directory', done: true },
  { text: 'Open each college page for fees & eligibility', done: true },
  { text: 'Note entrance exams and official deadlines', done: false },
  { text: 'Confirm costs and dates with the institution', done: false },
];

const Badge = ({ children }) => (
  <span className="shrink-0 text-[0.68rem] font-semibold uppercase tracking-wider px-2 py-1 rounded-md bg-paper border border-line text-ink-3">
    {children}
  </span>
);

function StepRail({ num, isLast }) {
  return (
    <div className="relative flex md:justify-center" aria-hidden="true">
      <span className="w-11 h-11 rounded-lg bg-brand-950 text-white font-ui font-bold text-sm flex items-center justify-center shrink-0 relative z-10">
        {num}
      </span>
      {!isLast && (
        <span className="absolute top-12 bottom-[-2.75rem] left-[1.375rem] md:left-1/2 md:-translate-x-1/2 w-px bg-line-strong" />
      )}
    </div>
  );
}

export default function CoreJourneySection() {
  return (
    <section aria-labelledby="how-navora-works" className="py-16 sm:py-20 lg:py-24 bg-paper border-t border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section heading */}
        <div className="max-w-2xl">
          <p className="eyebrow text-brand-700">How it works</p>
          <h2 id="how-navora-works" className="mt-3 font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.025em] text-balance">
            How NAVORA works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink-2 leading-relaxed">
            Turn confusing education choices into clear, practical next steps.
          </p>
        </div>

        {/* Connected three-step journey */}
        <ol className="mt-12 lg:mt-14 space-y-12 lg:space-y-16 list-none">
          {/* ── Step 1: Understand Yourself ─────────────────── */}
          <li className="grid md:grid-cols-[3rem_1fr] gap-4 md:gap-6">
            <StepRail num="01" isLast={false} />
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Step 1 · Understand yourself
                </p>
                <h3 className="mt-2 font-ui font-bold text-2xl text-ink tracking-tight">
                  Start with your goals
                </h3>
                <p className="mt-3 text-sm sm:text-base text-ink-2 leading-relaxed">
                  Share your interests, current education level, academic profile, budget and preferred location to organize your education priorities.
                </p>
                <Link
                  to="/get-started"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-ui font-semibold text-sm px-5 py-2.5 transition-colors"
                >
                  Start the questions
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="bg-surface border border-line rounded-xl shadow-card overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-line">
                  <p className="font-ui font-bold text-sm text-ink">Your starting point</p>
                  <Badge>Sample preview</Badge>
                </div>
                <dl className="px-5 py-4 space-y-2.5">
                  {PROFILE_FIELDS.map((field) => (
                    <div key={field.label} className="rounded-lg border border-line bg-paper px-3.5 py-2.5">
                      <dt className="text-[0.68rem] font-semibold uppercase tracking-wider text-ink-3">
                        {field.label}
                      </dt>
                      <dd className="mt-0.5 text-sm font-semibold text-ink">{field.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="px-5 pb-4 text-xs text-ink-3">
                  Illustrative example only. The real questionnaire opens at “Start the questions”.
                </p>
              </div>
            </div>
          </li>

          {/* ── Step 2: Explore Your Options ────────────────── */}
          <li className="grid md:grid-cols-[3rem_1fr] gap-4 md:gap-6">
            <StepRail num="02" isLast={false} />
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
              <div className="lg:order-2">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Step 2 · Explore your options
                </p>
                <h3 className="mt-2 font-ui font-bold text-2xl text-ink tracking-tight">
                  Compare your options
                </h3>
                <p className="mt-3 text-sm sm:text-base text-ink-2 leading-relaxed">
                  Explore courses and colleges using available information about eligibility, fees, location and entrance requirements.
                </p>
                <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
                  <Link
                    to="/colleges"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-ui font-semibold text-sm px-5 py-2.5 transition-colors"
                  >
                    Explore colleges
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/colleges/compare"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-surface text-ink font-ui font-semibold text-sm px-5 py-2.5 border border-line-strong hover:border-brand-400 transition-colors"
                  >
                    <Scale className="w-4 h-4 text-brand-600" aria-hidden="true" />
                    Compare colleges
                  </Link>
                </div>
              </div>
              <div className="lg:order-1 bg-surface border border-line rounded-xl shadow-card overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-line">
                  <p className="font-ui font-bold text-sm text-ink">Side-by-side comparison</p>
                  <Badge>Real directory data</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[26rem] text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-line">
                        <th scope="col" className="text-left font-semibold text-ink-3 px-5 py-3 w-1/3">
                          <span className="sr-only">Detail</span>
                        </th>
                        {compareColleges.map((college) => (
                          <th key={college.slug} scope="col" className="text-left px-3 py-3">
                            <Link
                              to={`/colleges/${college.slug}`}
                              className="font-bold text-ink hover:text-brand-700 leading-snug"
                            >
                              {college.shortName || college.name}
                            </Link>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-ink-2">
                      <tr className="border-b border-line">
                        <th scope="row" className="text-left font-semibold text-ink-3 px-5 py-2.5">Annual tuition</th>
                        {compareColleges.map((college) => (
                          <td key={college.slug} className="px-3 py-2.5 font-semibold text-ink">
                            {formatFeeShort(college.minAnnualFee)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-line">
                        <th scope="row" className="text-left font-semibold text-ink-3 px-5 py-2.5">Location</th>
                        {compareColleges.map((college) => (
                          <td key={college.slug} className="px-3 py-2.5">
                            {college.city}, {college.state}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-line">
                        <th scope="row" className="text-left font-semibold text-ink-3 px-5 py-2.5">B.Tech entry</th>
                        {compareColleges.map((college) => (
                          <td key={college.slug} className="px-3 py-2.5">{btechEntry(college)}</td>
                        ))}
                      </tr>
                      <tr>
                        <th scope="row" className="text-left font-semibold text-ink-3 px-5 py-2.5">Hostel</th>
                        {compareColleges.map((college) => (
                          <td key={college.slug} className="px-3 py-2.5">
                            {college.hostelAvailable ? 'Available on campus' : 'See college page'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="px-5 py-3.5 border-t border-line text-xs text-ink-3">
                  Figures from the NAVORA directory. Full details and sources are on each college page.
                </p>
              </div>
            </div>
          </li>

          {/* ── Step 3: Plan Your Next Move ─────────────────── */}
          <li className="grid md:grid-cols-[3rem_1fr] gap-4 md:gap-6">
            <StepRail num="03" isLast />
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Step 3 · Plan your next move
                </p>
                <h3 className="mt-2 font-ui font-bold text-2xl text-ink tracking-tight">
                  Create your next-step plan
                </h3>
                <p className="mt-3 text-sm sm:text-base text-ink-2 leading-relaxed">
                  Organize application requirements, important deadlines and the information you need to verify before making a decision.
                </p>
                <Link
                  to="/colleges/saved"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-ui font-semibold text-sm px-5 py-2.5 transition-colors"
                >
                  <Bookmark className="w-4 h-4" aria-hidden="true" />
                  Open your saved list
                </Link>
                <p className="mt-2.5 text-xs text-ink-3">
                  Bookmark colleges anywhere in the directory to build your shortlist.
                </p>
              </div>
              <div className="bg-surface border border-line rounded-xl shadow-card overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-line">
                  <span className="flex items-center gap-2 font-ui font-bold text-sm text-ink">
                    <ClipboardList className="w-4 h-4 text-brand-600" aria-hidden="true" />
                    Your next-step plan
                  </span>
                  <Badge>Example</Badge>
                </div>
                <ul className="px-5 py-4 space-y-2.5">
                  {PLAN_ITEMS.map((item) => (
                    <li key={item.text} className="flex items-start gap-2.5 text-sm text-ink-2">
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                          item.done
                            ? 'bg-brand-500 border-brand-500 text-white'
                            : 'bg-paper border-line-strong text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </span>
                      <span className={item.done ? 'text-ink' : undefined}>{item.text}</span>
                    </li>
                  ))}
                </ul>
                <p className="px-5 pb-4 text-xs text-ink-3">
                  Example only. NAVORA doesn’t track deadlines, so verify dates on official college and exam websites.
                </p>
              </div>
            </div>
          </li>
        </ol>

        {/* Trust strip — what each kind of information is */}
        <div className="mt-12 lg:mt-14 rounded-xl border border-line bg-surface px-5 py-4 sm:px-6">
          <ul className="grid sm:grid-cols-3 gap-3 text-xs text-ink-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" aria-hidden="true" />
              Directory figures carry their source on each college page.
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" aria-hidden="true" />
              Panels marked Sample or Example are illustrative, not recommendations.
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" aria-hidden="true" />
              Fees, deadlines and eligibility must be confirmed with the institution.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

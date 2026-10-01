import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  User,
  Compass,
  GraduationCap,
  Briefcase,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import Button from './Button';
import { FadeIn } from './AnimatedPage';
import { useUser } from '../context/UserContext';
import { normalizePhone } from '../lib/officialLinks';
import { saveLeadCapture } from '../lib/leadCapture';

// The visual is intentionally CSS/DOM based (no stock imagery) so it stays
// lightweight and on-brand. It communicates: Student -> Interests -> Courses -> Career.
const PATHWAY = [
  { icon: User, label: 'Student profile', sub: 'Your interests, strengths & academic background' },
  { icon: Compass, label: 'Interests & strengths', sub: 'What you enjoy and naturally do well' },
  { icon: GraduationCap, label: 'Matching courses', sub: 'Streams, degrees and programmes that fit' },
  { icon: Briefcase, label: 'Career paths', sub: 'Roles and long-term directions to aim for' },
];

export default function FindYourCourseSection() {
  const navigate = useNavigate();
  const { answers, userType } = useUser();

  // Reuse the completion signal the app already trusts (RequireAnswers, the
  // Login redirect and CareerAssessmentHero): a non-empty answers object means
  // the questionnaire is done, so send those users straight to their results.
  const hasCompleted = Boolean(answers && Object.keys(answers).length > 0);
  const courseTarget = hasCompleted
    ? userType
      ? `/recommendations/${userType}`
      : '/dashboard'
    : '/get-started';

  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmedPhone, setConfirmedPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const normalized = normalizePhone(phone);
    if (!normalized) {
      setError('Please enter a valid 10-digit mobile number (e.g. 98765 43210).');
      return;
    }
    setSubmitting(true);
    // Reuse the existing lead-capture pipeline (Supabase `lead_captures`) — the
    // same mechanism used by the phone prompt, login and questionnaire steps.
    try {
      await saveLeadCapture({
        sourcePage: 'counselling',
        stepKey: `counselling:${normalized}`,
        once: true,
        phone: normalized,
        userType: userType || 'counselling',
        answers: {},
      });
    } finally {
      setConfirmedPhone(normalized);
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <section
      id="find-right-course"
      aria-labelledby="find-course-heading"
      className="py-20 sm:py-24 bg-paper border-t border-line"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <FadeIn className="relative rounded-[2rem] border border-line bg-surface shadow-card-lg overflow-hidden">
          <span
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-600 via-brand-400 to-brand-600"
            aria-hidden="true"
          />

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 p-6 sm:p-10 lg:p-14">
            {/* ── Left: message + primary CTA ───────────────────────────── */}
            <div className="flex flex-col justify-center">
              <p className="inline-flex items-center gap-2 self-start rounded-full bg-brand-50 border border-brand-200 px-3.5 py-1.5 text-brand-700 eyebrow">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Personalized Course Guidance
              </p>

              <h2
                id="find-course-heading"
                className="mt-5 font-ui font-bold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight text-balance"
              >
                Find the Right Course for You
              </h2>

              <p className="mt-4 text-base sm:text-lg text-ink-2 leading-relaxed max-w-xl">
                Not sure what to study next? Discover courses and career paths that match your
                interests, strengths, academic background, and goals.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  className="group w-full sm:w-auto"
                  onClick={() => navigate(courseTarget)}
                >
                  Find My Course
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Button>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-3">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  Free to start · Takes about 2 minutes
                </span>
              </div>
            </div>

            {/* ── Right: CSS-based education pathway visual ─────────────── */}
            <div className="relative">
              <div
                className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-brand-100/70 via-transparent to-brand-200/50 blur-2xl"
                aria-hidden="true"
              />
              <div className="relative rounded-[1.75rem] border border-line bg-paper/70 p-5 sm:p-6 shadow-card">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-white border border-brand-100 text-brand-600 flex items-center justify-center shadow-xs">
                      <Compass className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-3">
                      Your pathway
                    </p>
                  </div>
                  <span className="rounded-full bg-white border border-line px-2.5 py-1 text-[0.68rem] font-semibold text-ink-3">
                    Guided
                  </span>
                </div>

                <ol className="relative space-y-4">
                  <span
                    className="absolute left-5 top-3 bottom-3 w-px -translate-x-1/2 bg-gradient-to-b from-brand-300 via-brand-200 to-brand-100"
                    aria-hidden="true"
                  />
                  {PATHWAY.map((step) => {
                    const Icon = step.icon;
                    return (
                      <li key={step.label} className="relative flex items-start gap-3.5">
                        <span className="relative z-10 w-10 h-10 rounded-xl bg-white border border-brand-100 text-brand-600 flex items-center justify-center shrink-0 shadow-xs">
                          <Icon className="w-4 h-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 pt-1">
                          <p className="font-ui font-semibold text-sm text-ink leading-tight">
                            {step.label}
                          </p>
                          <p className="text-xs text-ink-3 leading-snug mt-0.5">{step.sub}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-5 pt-4 border-t border-line flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-xs text-ink-2 leading-relaxed">
                    Every suggestion is tied to your own answers — never sponsored placements.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Counselling CTA — integrated into the same premium card ──── */}
          <div className="border-t border-line bg-paper/50 p-6 sm:p-10 lg:px-14 lg:py-12">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6">
                <p className="eyebrow text-brand-600">Counselling</p>
                <h3 className="mt-2 font-ui font-bold text-2xl sm:text-3xl text-ink tracking-tight">
                  Need Personal Guidance?
                </h3>
                <p className="mt-3 font-ui font-semibold text-brand-700">
                  Talk to a NAVORA Career Counselor
                </p>
                <p className="mt-2 text-sm sm:text-base text-ink-2 leading-relaxed">
                  Get 1-on-1 guidance to understand your options and make a confident decision about
                  your education and career.
                </p>
              </div>

              <div className="lg:col-span-6">
                {submitted ? (
                  <div
                    role="status"
                    className="rounded-2xl border border-brand-200 bg-brand-50/70 p-5 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-ui font-semibold text-sm text-ink">Request received</p>
                      <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                        Thanks — a NAVORA career counsellor will reach out on {confirmedPhone}.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <label
                      htmlFor="counsellor-phone"
                      className="block text-xs font-semibold uppercase tracking-wider text-ink-2 mb-1.5"
                    >
                      Mobile Number
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                      <div className="relative flex-1">
                        <span
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-3"
                          aria-hidden="true"
                        >
                          +91
                        </span>
                        <input
                          id="counsellor-phone"
                          name="phone"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (error) setError(null);
                          }}
                          aria-invalid={error ? 'true' : 'false'}
                          aria-describedby={error ? 'counsellor-phone-error' : undefined}
                          placeholder="98765 43210"
                          className={`w-full pl-12 pr-3.5 py-3 rounded-xl text-sm bg-white border outline-none transition-colors text-ink placeholder:text-ink-4 ${
                            error
                              ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
                              : 'border-line focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15'
                          }`}
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={submitting}
                        className="w-full sm:w-auto shrink-0"
                      >
                        Talk to an Expert
                      </Button>
                    </div>
                    {error && (
                      <p id="counsellor-phone-error" role="alert" className="mt-2 text-xs font-medium text-error">
                        {error}
                      </p>
                    )}
                  </form>
                )}
                <p className="mt-3 text-[0.72rem] text-ink-3 leading-relaxed">
                  By continuing, you agree to our{' '}
                  <Link to="/terms" className="font-semibold text-brand-700 link-underline">
                    Terms &amp; Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="font-semibold text-brand-700 link-underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}


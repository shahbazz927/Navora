import { useEffect, useState } from 'react';
import { Lock, User, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { saveLeadCapture } from '../lib/leadCapture';

const SESSION_KEY = 'navora_result_unlocked_v1';

export function isResultUnlocked() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function markResultUnlocked() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* ignore */
  }
}

function normalizeIndianMobile(input) {
  const digits = String(input || '').replace(/\D/g, '');
  let ten = digits;
  // Allow +91 prefix or leading 0
  if (ten.length === 12 && ten.startsWith('91')) ten = ten.slice(2);
  if (ten.length === 11 && ten.startsWith('0')) ten = ten.slice(1);
  if (/^[6-9]\d{9}$/.test(ten)) return ten;
  return null;
}

/**
 * ResultGate — blurs career-direction results until visitor provides
 * name + 10-digit mobile number. Unlock lasts for the browser session.
 *
 * Usage:
 *   <ResultGate flowKey="student_class12">
 *     <YourResults... />
 *   </ResultGate>
 */
export default function ResultGate({ children, flowKey = 'unknown', title = 'Your Career Direction' }) {
  const { user, setUser, onboardingData, userType, answers } = useUser();
  const [locked, setLocked] = useState(() => !isResultUnlocked());
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [saving, setSaving] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  // Pre-fill from known identity (context / onboarding) if available
  useEffect(() => {
    try {
      const knownName = user?.name || onboardingData?.name || '';
      const knownPhone = user?.phone || '';
      if (knownName && !name) setName(knownName);
      if (knownPhone && !phone) setPhone(knownPhone);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock body scroll while gate is shown
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanName = String(name || '').trim();
    let ok = true;
    if (cleanName.length < 2) {
      setNameError('Please enter your full name.');
      ok = false;
    } else {
      setNameError('');
    }
    const normalized = normalizeIndianMobile(phone);
    if (!normalized) {
      setPhoneError('Enter a valid 10-digit mobile number starting with 6-9.');
      ok = false;
    } else {
      setPhoneError('');
    }
    if (!ok) return;

    setSaving(true);
    try {
      // Persist identity to context so 2nd result page in same session skips typing
      try {
        setUser({ ...(user || {}), name: cleanName, phone: normalized });
      } catch {
        /* ignore */
      }
      // Sheet-style log in Supabase (best-effort, never blocks unlock)
      saveLeadCapture({
        sourcePage: 'result_gate',
        stepKey: `result_gate:${normalized}`,
        once: false,
        userType: userType || flowKey || 'result_gate',
        name: cleanName,
        phone: normalized,
        answers: { flow: flowKey, ...(answers || {}) },
      });
    } finally {
      try {
        window.sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* ignore */
      }
      setSaving(false);      setJustUnlocked(true);
      setLocked(false);
    }
  };

  return (
    <div className="relative">
      {/* Blurred results behind the gate */}
      <div
        aria-hidden={locked}
        className={locked ? 'pointer-events-none select-none blur-[7px] saturate-[1.1]' : ''}
      >
        {children}
      </div>

      {locked && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Unlock ${title}`}
        >
          {/* Dim backdrop — results stay faintly visible but unreadable */}
          <div className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]" />

          <div className="relative w-full max-w-md overflow-hidden rounded-[1.6rem] border border-line bg-white shadow-card-lg">
            {/* Top banner */}
            <div
              className="px-6 pb-5 pt-6 text-white"
              style={{ background: 'linear-gradient(135deg,#0f1f4d,#0a1638)' }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white/80">
                <Lock className="h-3 w-3" />
                Your career direction match
              </span>
              <h2 className="mt-3 font-ui text-2xl font-bold tracking-[-0.02em]">
                See {title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                Your personalised result is ready. Enter your name and mobile
                number to unlock it instantly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6" noValidate>
              <div>
                <label
                  htmlFor="result-gate-name"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-ink-3"
                >
                  <User className="h-3.5 w-3.5" /> Full name
                </label>
                <input
                  id="result-gate-name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Ananya Sharma"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                  className={`w-full rounded-xl border bg-paper px-4 py-3 text-[0.95rem] text-ink outline-none transition placeholder:text-ink-3/60 focus:ring-2 ${
                    nameError
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                      : 'border-line focus:border-brand-500 focus:ring-brand-100'
                  }`}
                />
                {nameError && <p className="mt-1.5 text-xs font-medium text-red-600">{nameError}</p>}
              </div>

              <div>
                <label
                  htmlFor="result-gate-phone"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-ink-3"
                >
                  <Phone className="h-3.5 w-3.5" /> Mobile number
                </label>
                <div
                  className={`flex overflow-hidden rounded-xl border bg-paper transition focus-within:ring-2 ${
                    phoneError
                      ? 'border-red-400 focus-within:border-red-500 focus-within:ring-red-100'
                      : 'border-line focus-within:border-brand-500 focus-within:ring-brand-100'
                  }`}
                >
                  <span className="flex items-center border-r border-line bg-white px-3.5 text-sm font-bold text-ink-2">
                    +91
                  </span>
                  <input
                    id="result-gate-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={13}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(ev) => setPhone(ev.target.value)}
                    className="w-full bg-transparent px-4 py-3 text-[0.95rem] text-ink outline-none placeholder:text-ink-3/60"
                  />
                </div>
                {phoneError ? (
                  <p className="mt-1.5 text-xs font-medium text-red-600">{phoneError}</p>
                ) : (
                  <p className="mt-1.5 text-[0.72rem] text-ink-3">
                    10-digit Indian mobile number starting with 6-9. No OTP, no spam.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-950 px-5 py-3.5 font-ui text-[0.95rem] font-bold text-white shadow-card transition hover:bg-brand-900 disabled:cursor-wait disabled:opacity-70"
              >
                {saving ? 'Unlocking…' : 'Unlock my result'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <p className="flex items-center justify-center gap-1.5 text-center text-[0.72rem] text-ink-3">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                You will only be asked once in this session.
              </p>
            </form>
          </div>
        </div>
      )}

      {justUnlocked && !locked && (
        <span className="sr-only" role="status">
          Result unlocked
        </span>
      )}
    </div>
  );
}

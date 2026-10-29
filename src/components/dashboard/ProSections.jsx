import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, FileText } from 'lucide-react';
import { SectionTitle, EmptyState } from './DashboardHeader';
import { supabase } from '../../lib/supabase';

async function authHeaders() {
  try {
    const { data } = await supabase.auth.getSession();
    const t = data?.session?.access_token;
    if (t && !String(t).startsWith('local_jwt_')) return { Authorization: `Bearer ${t}` };
  } catch {}
  return {};
}

const CHECK_KEY = 'navora_action_checks_v1';

function loadChecks(uid) {
  try {
    const all = JSON.parse(localStorage.getItem(CHECK_KEY) || '{}');
    return all[uid || 'anon'] || {};
  } catch { return {}; }
}
function saveChecks(uid, v) {
  try {
    const all = JSON.parse(localStorage.getItem(CHECK_KEY) || '{}');
    all[uid || 'anon'] = v;
    localStorage.setItem(CHECK_KEY, JSON.stringify(all));
  } catch {}
}

export function CourseCompareCard() {
  return (
    <section className="bg-white border border-line rounded-2xl p-5 sm:p-6" aria-labelledby="course-compare">
      <h2 id="course-compare" className="font-ui font-bold text-[1.15rem] tracking-[-0.02em] text-ink">Course Comparison</h2>
      <p className="text-sm text-ink-2 mt-1.5 leading-relaxed">
        Not sure which course is right? Compare courses side by side based on fees, duration, eligibility, subjects and career pathways.
      </p>
      <Link to="/compare" className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-ink text-white text-sm font-semibold px-5 py-2.5 hover:bg-brand-950 transition-colors">
        Compare Courses <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
}

export function ActionPlan({ userId }) {
  const [roadmap, setRoadmap] = useState(null);
  const [checks, setChecks] = useState(() => loadChecks(userId));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const sessionAns = (() => { try { return JSON.parse(localStorage.getItem('novera-state-v1') || '{}')?.data?.answers || {}; } catch { return {}; } })();
        const res = await fetch('/api/roadmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
          body: JSON.stringify({ answers: sessionAns, userType: null }),
        });
        const j = await res.json().catch(() => null);
        if (live && j?.success) setRoadmap(j.roadmap);
        else if (live) setFailed(true);
      } catch {
        if (live) setFailed(true);
      }
    })();
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (key) => {
    setChecks((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveChecks(userId, next);
      return next;
    });
  };

  if (!roadmap) {
    return (
      <section id="action-plan" aria-labelledby="action-plan-h">
        <SectionTitle title="Your 30-Day Action Plan" />
        {failed ? (
          <p className="text-sm text-ink-2 bg-white border border-line rounded-2xl p-5">Your action plan will appear here once your roadmap loads.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3" aria-hidden="true">
            {[1, 2, 3, 4].map((w) => (
              <div key={w} className="bg-white border border-line rounded-2xl p-4 animate-pulse"><div className="h-4 w-20 bg-paper-deep rounded mb-2" /><div className="h-3 w-full bg-paper-deep rounded" /></div>
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <section id="action-plan" aria-labelledby="action-plan-h">
      <SectionTitle title="Your 30-Day Action Plan" action={<span className="text-xs text-ink-3">Track your progress</span>} />
      <div className="grid sm:grid-cols-2 gap-3">
        {roadmap.weeks.map((w) => (
          <div key={w.week} className="bg-white border border-line rounded-2xl p-4">
            <p className="text-xs font-semibold text-brand-700">Week {w.week}</p>
            <p className="text-sm font-semibold text-ink mt-1">{w.title}</p>
            <ul className="mt-2.5 space-y-2">
              {w.tasks.map((t, i) => {
                const key = `${w.week}-${i}`;
                const done = !!checks[key];
                return (
                  <li key={key}>
                    <label className="flex items-start gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggle(key)}
                        className="mt-0.5 w-4 h-4 rounded accent-brand-600"
                        aria-label={`Week ${w.week} task ${i + 1}`}
                      />
                      <span className={`text-[0.83rem] leading-relaxed ${done ? 'line-through text-ink-3' : 'text-ink-2 group-hover:text-ink'}`}>{t}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ReportsCard({ hasAssessment }) {
  const openPrintReport = () => {
    window.print();
  };
  return (
    <section className="bg-white border border-line rounded-2xl p-5 sm:p-6" aria-labelledby="reports">
      <div className="flex items-center justify-between mb-3">
        <h2 id="reports" className="font-ui font-bold text-[1.15rem] tracking-[-0.02em] text-ink">Your Reports</h2>
        {hasAssessment && (
          <button onClick={openPrintReport} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        )}
      </div>
      {!hasAssessment ? (
        <p className="text-sm text-ink-2">Complete your assessment to generate your first report.</p>
      ) : (
        <ul className="space-y-2">
          {[
            'Career Assessment Report',
            'Personalized Education Roadmap',
            'Career Pathway Report',
          ].map((name) => (
            <li key={name} className="flex items-center gap-3 border border-line rounded-xl px-4 py-3">
              <FileText className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="flex-1 text-sm font-medium text-ink">{name}</span>
              <button onClick={openPrintReport} className="text-xs font-semibold text-brand-600 hover:text-brand-700">Print / PDF</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

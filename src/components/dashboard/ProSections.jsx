import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, FileText, CheckCircle2, Sparkles, Map } from 'lucide-react';
import { SectionTitle, EmptyState } from './DashboardHeader';
import { supabase } from '../../lib/supabase';
import SkillRoadmap from '../SkillRoadmap';

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
      <h2 id="course-compare" className="font-ui font-bold text-[1.15rem] tracking-[-0.02em] text-ink">Course & College Comparison</h2>
      <p className="text-sm text-ink-2 mt-1.5 leading-relaxed">
        Compare institutions and degrees side by side based on verified tuition, estimated living costs, scholarships, eligibility, and post-study work routes.
      </p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        <Link to="/colleges/compare" className="inline-flex items-center gap-1.5 rounded-xl bg-ink text-white text-xs sm:text-sm font-semibold px-4 py-2.5 hover:bg-brand-950 transition-colors">
          Compare Colleges <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link to="/global-study" className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-line text-ink text-xs sm:text-sm font-semibold px-4 py-2.5 hover:bg-paper transition-colors">
          Compare Global Study <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}

export function ActionPlan({ userId, answers = {}, userType = '', primaryCareer = '' }) {
  const [activeTab, setActiveTab] = useState('skills'); // 'skills' | 'calendar'
  const [roadmap, setRoadmap] = useState(null);
  const [checks, setChecks] = useState(() => loadChecks(userId));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const sessionAns = (() => {
          try {
            return JSON.parse(localStorage.getItem('novera-state-v1') || '{}')?.data?.answers || answers || {};
          } catch {
            return answers || {};
          }
        })();
        const res = await fetch('/api/roadmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
          body: JSON.stringify({ answers: sessionAns, userType: userType || null }),
        });
        const j = await res.json().catch(() => null);
        if (live && j?.success) setRoadmap(j.roadmap);
        else if (live) setFailed(true);
      } catch {
        if (live) setFailed(true);
      }
    })();
    return () => { live = false; };
  }, [userType]);

  const toggle = (key) => {
    setChecks((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveChecks(userId, next);
      return next;
    });
  };

  return (
    <section id="action-plan" aria-labelledby="action-plan-h" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SectionTitle
          title="Your Preparation & Skill Roadmap"
          action={
            <div className="flex items-center gap-1 bg-paper border border-line p-1 rounded-control">
              <button
                type="button"
                onClick={() => setActiveTab('skills')}
                className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === 'skills' ? 'bg-white text-brand-700 shadow-xs' : 'text-ink-2 hover:text-ink'
                }`}
              >
                5-Phase Skill Timeline
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === 'calendar' ? 'bg-white text-brand-700 shadow-xs' : 'text-ink-2 hover:text-ink'
                }`}
              >
                30-Day Checkpoints
              </button>
            </div>
          }
        />
      </div>

      {activeTab === 'skills' ? (
        <SkillRoadmap
          careerTitle={primaryCareer}
          educationStage={userType}
        />
      ) : (
        <div className="space-y-4">
          {!roadmap ? (
            failed ? (
              <p className="text-sm text-ink-2 bg-white border border-line rounded-2xl p-5">
                The 30-day checklist is syncing. Use the 5-Phase Skill Timeline above to guide your preparation.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3" aria-hidden="true">
                {[1, 2, 3, 4].map((w) => (
                  <div key={w} className="bg-white border border-line rounded-2xl p-4 animate-pulse">
                    <div className="h-4 w-20 bg-paper-deep rounded mb-2" />
                    <div className="h-3 w-full bg-paper-deep rounded" />
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {roadmap.weeks.map((w) => (
                <div key={w.week} className="bg-white border border-line rounded-2xl p-4 shadow-card">
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
                              className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                              aria-label={`Week ${w.week} task ${i + 1}`}
                            />
                            <span className={`text-[0.83rem] leading-relaxed ${done ? 'line-through text-ink-3' : 'text-ink-2 group-hover:text-ink'}`}>
                              {t}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
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
          <button onClick={openPrintReport} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        )}
      </div>
      {!hasAssessment ? (
        <p className="text-sm text-ink-2">Complete your assessment to generate your first verified report.</p>
      ) : (
        <ul className="space-y-2">
          {[
            'Career Assessment Report',
            'Personalized Education Roadmap',
            'Career Pathway & Skill Report',
          ].map((name) => (
            <li key={name} className="flex items-center gap-3 border border-line rounded-xl px-4 py-3">
              <FileText className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="flex-1 text-sm font-medium text-ink">{name}</span>
              <button onClick={openPrintReport} className="text-xs font-semibold text-brand-600 hover:text-brand-700 cursor-pointer">Print / PDF</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

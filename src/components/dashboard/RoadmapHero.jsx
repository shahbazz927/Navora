import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Map, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { profileCompletion } from '../../lib/dashboard';
import { Skeleton } from './DashboardHeader';

async function authHeaders() {
  try {
    const { data } = await supabase.auth.getSession();
    const t = data?.session?.access_token;
    if (t && !String(t).startsWith('local_jwt_')) return { Authorization: `Bearer ${t}` };
  } catch {}
  return {};
}

export default function RoadmapHero({ answers, userType, onboarding }) {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const pct = profileCompletion(answers, onboarding);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await fetch('/api/roadmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
          body: JSON.stringify({ answers: answers || {}, userType: userType || null }),
        });
        const j = await res.json().catch(() => null);
        if (live && j?.success && j.roadmap) setRoadmap(j.roadmap);
        else if (live) setFailed(true);
      } catch {
        if (live) setFailed(true);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
  }, [userType]);

  return (
    <section className="bg-[#0A192F] text-white rounded-[1.4rem] overflow-hidden relative" aria-labelledby="roadmap-hero">
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-brand-600/20 blur-3xl" aria-hidden="true" />
      <div className="relative grid lg:grid-cols-[1.4fr_0.8fr]">
        <div className="p-6 sm:p-8">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-violet-300">
            <Map className="w-3.5 h-3.5" /> Pro roadmap
          </p>
          <h2 id="roadmap-hero" className="font-ui font-bold text-2xl sm:text-[1.7rem] tracking-[-0.02em] mt-2">
            Your Personalized Education Roadmap
          </h2>
          <p className="text-sm text-white/65 mt-2 max-w-xl">
            Based on your profile, interests and goals, here are your recommended pathways and next steps.
          </p>
          {loading ? (
            <div className="mt-5 space-y-2" aria-hidden="true">
              <Skeleton className="h-3 w-3/4 !bg-white/10" />
              <Skeleton className="h-3 w-1/2 !bg-white/10" />
            </div>
          ) : roadmap ? (
            <ul className="mt-5 space-y-2">
              {roadmap.weeks.map((w) => (
                <li key={w.week} className="flex items-start gap-2.5 text-sm text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                  <span><strong className="text-white">Week {w.week}:</strong> {w.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-sm text-white/60">
              {failed ? 'Roadmap is unavailable right now — your plan below still applies.' : 'Complete your assessment to generate your roadmap.'}
            </p>
          )}
          <div className="mt-6">
            <a href="#action-plan" className="inline-flex items-center gap-2 rounded-xl bg-white text-ink text-sm font-semibold px-5 py-2.5 hover:bg-brand-50 transition-colors">
              View Full Roadmap <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div className="p-5 sm:p-6 bg-white/[0.05] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-center">
          <div className="bg-white text-ink rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-3">Your Progress</p>
            <p className="font-ui font-bold text-4xl mt-1" aria-label={`${pct}% profile completed`}>{pct}%</p>
            <div className="h-2 bg-paper-deep rounded-full mt-3 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-brand-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-ink-2 mt-2">Profile completed</p>
            {pct < 100 && (
              <Link to="/account" className="mt-3 inline-flex text-xs font-semibold text-brand-600 hover:text-brand-700">
                Complete your profile for better recommendations →
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { PLANS } from '../lib/entitlements';

// UI cache only — NEVER authorization. Backend (/api/entitlement) decides.
const STORAGE_KEY = 'navora_subscription_v1';

function loadCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}
function saveCache(v) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch {}
}

// Deprecated local counters kept as no-op fallbacks so old imports don't crash.
// Quota is enforced server-side; these must not gate features.
export function getAiUsage() {
  try {
    const raw = localStorage.getItem('navora_ai_usage');
    const data = raw ? JSON.parse(raw) : {};
    const k = new Date().toISOString().slice(0, 10);
    return data[k] || 0;
  } catch { return 0; }
}
export function incAiUsage() { return getAiUsage(); }

export function useSubscription() {
  const [ent, setEnt] = useState(() => {
    const cached = loadCache();
    // Cached plan is display-only; treated as free until server confirms.
    if (cached?.plan === 'pro') return { plan: 'free', status: 'active', features: PLANS.free, serverVerified: false };
    return { plan: 'free', status: 'active', features: PLANS.free, serverVerified: false };
  });
  const [loading, setLoading] = useState(true);

  const fetchRemote = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token || String(session.access_token).startsWith('local_jwt_')) {
        setEnt({ plan: 'free', status: 'active', features: PLANS.free, serverVerified: false, used: 0 });
        setLoading(false);
        return;
      }
      const res = await fetch('/api/entitlement', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.status === 401) {
        setEnt({ plan: 'free', status: 'active', features: PLANS.free, serverVerified: false, used: 0 });
        setLoading(false);
        return;
      }
      const j = await res.json().catch(() => null);
      if (j?.success && (j.plan === 'pro' || j.plan === 'free')) {
        const next = {
          plan: j.plan,
          status: j.status || 'active',
          features: { ...PLANS[j.plan], ...(j.features || {}) },
          used: typeof j.used === 'number' ? j.used : 0,
          currentPeriodEnd: j.currentPeriodEnd || null,
          serverVerified: true,
        };
        setEnt(next);
        saveCache({ plan: next.plan, status: next.status });
      } else {
        // Fail-safe: lookup failed => Free, never Pro.
        setEnt((p) => ({ ...p, plan: 'free', features: PLANS.free, serverVerified: false }));
      }
    } catch {
      setEnt((p) => ({ ...p, plan: 'free', features: PLANS.free, serverVerified: false }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRemote(); }, [fetchRemote]);

  // Re-fetch when auth state changes (login/logout/refresh).
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(() => fetchRemote());
    return () => sub?.subscription?.unsubscribe();
  }, [fetchRemote]);

  const isPro = ent.serverVerified === true && ent.plan === 'pro' && ent.status !== 'expired';
  const plan = isPro ? { ...PLANS.pro, ...(ent.features || {}) } : { ...PLANS.free, ...(isPro ? {} : ent.features || {}) };
  const sub = { plan: isPro ? 'pro' : 'free', status: ent.status, expires_at: ent.currentPeriodEnd, currentPeriodEnd: ent.currentPeriodEnd };

  // Server verification helper (sends JWT; never trusts local state).
  const verifyFeature = useCallback(async (feature) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/entitlement/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ feature }),
      });
      const j = await res.json().catch(() => null);
      return j?.allowed === true;
    } catch { return false; }
  }, []);

  const aiLimit = plan.ai_daily_limit;
  const aiUsed = typeof ent.used === 'number' ? ent.used : getAiUsage();

  return { sub, plan, isPro, loading, fetchRemote, verifyFeature, aiUsed, aiLimit, entitlement: ent };
}

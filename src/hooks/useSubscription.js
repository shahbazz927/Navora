import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { PLANS } from '../lib/entitlements';

// UI cache only — NEVER authorization. Backend (/api/entitlement) decides.
const STORAGE_KEY = 'navora_subscription_v1';

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
    // Paid mode is off: the only plan is the free plan, which unlocks everything.
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
      if (j?.success) {
        const next = {
          plan: 'free',
          status: j.status || 'active',
          features: { ...PLANS.free, ...(j.features || {}) },
          used: typeof j.used === 'number' ? j.used : 0,
          currentPeriodEnd: j.currentPeriodEnd || null,
          serverVerified: true,
        };
        setEnt(next);
        saveCache({ plan: next.plan, status: next.status });
      } else {
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

  // No paid tier — `isPro` stays false, `plan` carries every feature.
  const isPro = false;
  const plan = { ...PLANS.free, ...(ent.features || {}) };
  const sub = { plan: 'free', status: ent.status, expires_at: null, currentPeriodEnd: null };

  // Server verification helper (sends JWT; never trusts local state).
  const verifyFeature = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/entitlement/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ feature: 'default' }),
      });
      const j = await res.json().catch(() => null);
      return j?.allowed === true;
    } catch { return false; }
  }, []);

  const aiLimit = plan.ai_daily_limit;
  const aiUsed = typeof ent.used === 'number' ? ent.used : getAiUsage();

  return { sub, plan, isPro, loading, fetchRemote, verifyFeature, aiUsed, aiLimit, entitlement: ent };
}

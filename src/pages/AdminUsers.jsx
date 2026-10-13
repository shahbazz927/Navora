import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Search, Users, Crown, UserCheck,
  ArrowLeft, ExternalLink, RefreshCw, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const PAGE_SIZE = 25;

function fmtDate(v) {
  if (!v) return '—';
  try { return new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return '—'; }
}

function PlanBadge({ plan }) {
  if (plan === 'pro') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Crown className="w-3 h-3" /> Pro
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
      Free
    </span>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [proCount, setProCount] = useState(null);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);
  const [grantTarget, setGrantTarget] = useState(null);
  const [grantDays, setGrantDays] = useState(365);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search.trim()); setOffset(0); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (!token) { setError('Sign in as admin to view users.'); setLoading(false); return; }
      const params = new URLSearchParams({
        search: debounced, plan: planFilter,
        limit: String(PAGE_SIZE), offset: String(offset),
      });
      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await res.json().catch(() => null);
      if (!res.ok || !j?.success) {
        setError(j?.message || (res.status === 403 ? 'Admin access required.' : 'Could not load users.'));
        setUsers([]);
      } else {
        setUsers(j.users || []);
        setTotal(j.total || 0);
        setProCount(typeof j.proCount === 'number' ? j.proCount : null);
      }
    } catch {
      setError('Could not load users. Check connection.');
    } finally {
      setLoading(false);
    }
  }, [debounced, planFilter, offset]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const stats = useMemo(() => {
    const proInPage = users.filter((u) => u.plan === 'pro').length;
    return { proInPage, shown: users.length };
  }, [users]);

  async function authedPost(url, body) {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    });
    return { res, j: await res.json().catch(() => null) };
  }

  const handleGrant = async () => {
    if (!grantTarget) return;
    setActionId(grantTarget.user_id);
    try {
      const { res, j } = await authedPost('/api/admin/users/grant-pro', {
        user_id: grantTarget.user_id, days: Number(grantDays) || 365,
      });
      if (res.ok && j?.success) {
        setNotice(`Pro activated for ${grantTarget.email || grantTarget.full_name || 'user'} until ${fmtDate(j.expiresAt)}.`);
        setGrantTarget(null);
        fetchUsers();
      } else {
        setError(j?.message || 'Grant failed.');
      }
    } catch { setError('Grant failed.'); }
    finally { setActionId(null); setTimeout(() => setNotice(''), 4000); }
  };

  const handleRevoke = async (u) => {
    if (!window.confirm(`Remove Pro from ${u.email || u.full_name || u.user_id}? They go back to Free.`)) return;
    setActionId(u.user_id);
    try {
      const { res, j } = await authedPost('/api/admin/users/revoke-pro', { user_id: u.user_id });
      if (res.ok && j?.success) {
        setNotice(`Moved ${u.email || 'user'} back to Free.`);
        fetchUsers();
      } else {
        setError(j?.message || 'Revoke failed.');
      }
    } catch { setError('Revoke failed.'); }
    finally { setActionId(null); setTimeout(() => setNotice(''), 4000); }
  };

  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-[#0A192F] text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link to="/admin/colleges" className="inline-flex items-center gap-1 hover:text-white"><ArrowLeft className="w-3.5 h-3.5" /> Colleges admin</Link>
            <span>/</span><span className="text-slate-200">Users & Plans</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-400/20 text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin only
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Users & Plans</h1>
              <p className="text-xs sm:text-sm text-slate-300 font-light mt-1">See every user, their plan, expiry — give or remove Pro manually.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchUsers} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/20 border border-white/10">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>
              <Link to="/pricing" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500">
                View Pricing <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6 max-w-lg">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1"><Users className="w-3 h-3" /> Total</p>
              <p className="text-xl font-extrabold mt-0.5">{total}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-amber-300/80 font-bold flex items-center gap-1"><Crown className="w-3 h-3" /> Pro</p>
              <p className="text-xl font-extrabold mt-0.5">{proCount ?? stats.proInPage}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1"><UserCheck className="w-3 h-3" /> Shown</p>
              <p className="text-xl font-extrabold mt-0.5">{stats.shown}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {notice && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{notice}</div>
        )}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">{error}</div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pro', 'free'].map((f) => (
              <button
                key={f}
                onClick={() => { setPlanFilter(f); setOffset(0); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold capitalize border transition-colors ${planFilter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[820px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                <th className="p-3.5">User</th>
                <th className="p-3.5">Plan</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Expires</th>
                <th className="p-3.5">Joined</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Loading users…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">No users found.</td></tr>
              ) : users.map((u) => (
                <tr key={u.user_id} className="hover:bg-slate-50/70">
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">{u.full_name || '—'}</p>
                    <p className="text-slate-500">{u.email || u.user_id.slice(0, 8) + '…'}</p>
                    {u.role === 'admin' && (
                      <span className="inline-block mt-1 px-1.5 py-px rounded text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200">admin</span>
                    )}
                  </td>
                  <td className="p-3.5"><PlanBadge plan={u.plan} /></td>
                  <td className="p-3.5 text-slate-600">
                    {u.status}
                    {u.provider && <span className="block text-[11px] text-slate-400">via {u.provider}</span>}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-700">{fmtDate(u.expires_at)}</td>
                  <td className="p-3.5 text-slate-500">{fmtDate(u.created_at)}</td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    {u.plan === 'pro' ? (
                      <button
                        disabled={actionId === u.user_id}
                        onClick={() => handleRevoke(u)}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {actionId === u.user_id ? 'Working…' : 'Remove Pro'}
                      </button>
                    ) : (
                      <button
                        disabled={actionId === u.user_id}
                        onClick={() => { setGrantTarget(u); setGrantDays(365); }}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
                      >
                        Give Pro
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
          <p>Page {page} of {pageCount} · {total} users</p>
          <div className="flex gap-2">
            <button
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50"
            ><ChevronLeft className="w-4 h-4" /></button>
            <button
              disabled={offset + PAGE_SIZE >= total}
              onClick={() => setOffset(offset + PAGE_SIZE)}
              className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50"
            ><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Grant modal */}
      {grantTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-2xl">
            <h3 className="font-bold text-slate-900">Give Pro access</h3>
            <p className="text-xs text-slate-500 mt-1">
              {grantTarget.email || grantTarget.full_name || grantTarget.user_id}
            </p>
            <label className="block text-xs font-bold text-slate-700 mt-4 mb-1">Duration (days)</label>
            <input
              type="number" min={1} max={3650} value={grantDays}
              onChange={(e) => setGrantDays(Number(e.target.value))}
              className="w-full p-2 border border-slate-200 rounded-lg text-sm"
            />
            <div className="flex gap-2 mt-2">
              {[30, 90, 365].map((d) => (
                <button key={d} onClick={() => setGrantDays(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${grantDays === d ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  {d}d
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setGrantTarget(null)} className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold hover:bg-slate-50">Cancel</button>
              <button onClick={handleGrant} disabled={actionId === grantTarget.user_id}
                className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 disabled:opacity-50">
                {actionId === grantTarget.user_id ? 'Activating…' : `Activate Pro · ${grantDays}d`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

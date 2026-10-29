import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Search, Users, UserCheck,
  ArrowLeft, RefreshCw, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const PAGE_SIZE = 25;

function fmtDate(v) {
  if (!v) return '—';
  try { return new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return '—'; }
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        search: debounced,
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
      }
    } catch {
      setError('Could not load users. Check connection.');
    } finally {
      setLoading(false);
    }
  }, [debounced, offset]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const stats = useMemo(() => ({ shown: users.length }), [users]);

  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-[#0A192F] text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link to="/admin/colleges" className="inline-flex items-center gap-1 hover:text-white"><ArrowLeft className="w-3.5 h-3.5" /> Colleges admin</Link>
            <span>/</span><span className="text-slate-200">Users</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-400/20 text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin only
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Users</h1>
              <p className="text-xs sm:text-sm text-slate-300 font-light mt-1">Every account has full access — paid mode is currently off.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchUsers} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/20 border border-white/10">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-6 max-w-sm">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1"><Users className="w-3 h-3" /> Total</p>
              <p className="text-xl font-extrabold mt-0.5">{total}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1"><UserCheck className="w-3 h-3" /> Shown</p>
              <p className="text-xl font-extrabold mt-0.5">{stats.shown}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
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
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                <th className="p-3.5">User</th>
                <th className="p-3.5">Phone</th>
                <th className="p-3.5">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={3} className="p-8 text-center text-slate-400">Loading users…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={3} className="p-8 text-center text-slate-400">No users found.</td></tr>
              ) : users.map((u) => (
                <tr key={u.user_id} className="hover:bg-slate-50/70">
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">{u.full_name || '—'}</p>
                    <p className="text-slate-500">{u.email || u.user_id.slice(0, 8) + '…'}</p>
                    {u.role === 'admin' && (
                      <span className="inline-block mt-1 px-1.5 py-px rounded text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200">admin</span>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-500">{u.phone || '—'}</td>
                  <td className="p-3.5 text-slate-500">{fmtDate(u.created_at)}</td>
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
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Server-authorized admin gate. Frontend hiding is UX only; the backend
// (/api/admin/check + RLS) is the authority. Non-admins get /403.
export default function RequireAdmin({ children }) {
  const [status, setStatus] = useState('checking');
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const token = data?.session?.access_token;
        if (!token || String(token).startsWith('local_jwt_')) {
          if (mounted) setStatus('denied');
          return;
        }
        const res = await fetch('/api/admin/check', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (mounted) setStatus(res.ok ? 'allowed' : 'denied');
      } catch {
        if (mounted) setStatus('denied');
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-paper">
        <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }
  if (status === 'denied') {
    return <Navigate to="/403" state={{ from: location.pathname }} replace />;
  }
  return children;
}

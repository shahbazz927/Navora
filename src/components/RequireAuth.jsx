import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../context/UserContext';
import { useAuthModal } from '../context/AuthModalContext';

// Gate that requires a valid Supabase session.
// While the session is being checked, a lightweight spinner is shown to avoid
// flashing protected content to a signed-out user.
export default function RequireAuth({ children }) {
  const [status, setStatus] = useState('checking'); // 'checking' | 'authed' | 'unauthed'
  const { setUser } = useUser();
  const { openAuthModal, isOpen } = useAuthModal();

  useEffect(() => {
    let mounted = true;

    const applySession = async (session) => {
      if (!mounted) return;
      if (session?.user) {
        const su = session.user;
        // Preserve any phone already in context; otherwise hydrate from
        // auth record (phone auth OR email-login metadata) + profiles table.
        let phone = su.phone || su.user_metadata?.phone || '';
        let profileName = '';
        if (!phone && su.id) {
          try {
            const { data } = await supabase.from('profiles').select('phone, full_name').eq('user_id', su.id).maybeSingle();
            if (data?.phone) phone = data.phone;
            if (data?.full_name) profileName = data.full_name;
          } catch {
            /* ignore — logging must not block auth */
          }
        }
        if (!mounted) return;
        setUser((prev) => ({
          ...(typeof prev === 'object' && prev ? prev : {}),
          email: su.email || '',
          phone: phone || (typeof prev === 'object' && prev?.phone) || '',
          name: su.user_metadata?.full_name || profileName || (su.email ? su.email.split('@')[0] : ''),
          avatarUrl: su.user_metadata?.avatar_url,
          loggedInAt: new Date(),
        }));
        setStatus('authed');
      } else {
        setUser(null);
        setStatus('unauthed');
      }
    };

    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setStatus('unauthed');
          return;
        }
        applySession(data?.session);
      } catch {
        setStatus('unauthed');
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stay on the same URL — open login popup over the current page instead of navigating to /login.
  useEffect(() => {
    if (status === 'unauthed' && !isOpen) openAuthModal('login');
  }, [status, isOpen, openAuthModal]);

  if (status === 'checking') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-paper">
        <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'unauthed') {
    // Background stays visible behind the AuthModal popup (URL unchanged).
    // Render a lightweight locked placeholder — real content reveals after login.
    return (
      <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-3 py-20 text-center px-6">
        <p className="text-lg font-semibold text-ink">Sign in to continue</p>
        <p className="text-sm text-ink-3 max-w-sm">This page needs authentication. The sign-in popup is open — complete it to unlock this page without leaving it.</p>
        {!isOpen && (
          <button
            onClick={() => openAuthModal('login')}
            className="mt-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm px-5 py-2.5 transition-colors cursor-pointer"
          >
            Open Sign In
          </button>
        )}
      </div>
    );
  }

  return children;
}
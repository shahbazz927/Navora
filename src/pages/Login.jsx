import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import loginLogo from '../assets/login-logo.png';
import AuthCard from '../components/auth/AuthCard';
import BackgroundEffects from '../components/auth/BackgroundEffects';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';
import { supabase } from '../lib/supabase';
import { useUser } from '../context/UserContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, answers } = useUser();

  const [authMode, setAuthMode] = useState('login');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function checkAuthSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data?.session?.user && mounted) {
          const user = data.session.user;
          let profilePhone = '';
          let profileName = '';
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('phone, full_name')
              .eq('user_id', user.id)
              .maybeSingle();
            if (profile?.phone) profilePhone = profile.phone;
            if (profile?.full_name) profileName = profile.full_name;
          } catch {
            /* ignore */
          }
          if (!mounted) return;
          setUser({
            email: user.email || '',
            phone: user.phone || user.user_metadata?.phone || profilePhone || '',
            name: user.user_metadata?.full_name || profileName || (user.email ? user.email.split('@')[0] : '') || user.phone || '',
            avatarUrl: user.user_metadata?.avatar_url,
            loggedInAt: new Date(),
          });
        }
      } catch {
        /* ignore */
      } finally {
        if (mounted) setIsCheckingAuth(false);
      }
    }
    checkAuthSession();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoginSuccess = (session) => {
    setUser(session);
    const from = location.state?.from;
    // Only same-origin absolute paths, to avoid open redirects.
    const safeFrom = typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : null;
    if (safeFrom) navigate(safeFrom, { replace: true });
    // Returning users with a completed questionnaire resume where they left off.
    else if (answers && Object.keys(answers).length > 0) navigate('/dashboard', { replace: true });
    else navigate('/get-started', { replace: true });
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-x-hidden bg-paper text-ink">
      <BackgroundEffects theme="light" />

      <main className="w-full max-w-md mx-auto py-8 flex flex-col items-center justify-center z-10">
        {isCheckingAuth ? (
          <div className="w-9 h-9 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        ) : (
          <div className="w-full">
            <div className="flex flex-col items-center mb-6">
              <img src={loginLogo} alt="NAVORA" className="h-12 w-auto object-contain mb-2" />
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                Welcome to <span className="text-brand-700">NAVORA</span>
              </h1>
            </div>

            <div className="w-full flex justify-center">
              <AuthCard
                mode={authMode}
                onModeChange={setAuthMode}
                onOpenForgotPassword={() => setIsForgotModalOpen(true)}
                onLoginSuccess={handleLoginSuccess}
              />
            </div>
          </div>
        )}
      </main>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        theme="light"
      />
    </div>
  );
}

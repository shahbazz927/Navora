import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import AuthCard from './AuthCard';
import ForgotPasswordModal from './ForgotPasswordModal';
import { useAuthModal } from '../../context/AuthModalContext';
import { useUser } from '../../context/UserContext';

// Global login popup. It opens over the current page without changing the URL.
export default function AuthModal() {
  const { isOpen, mode, setMode, closeAuthModal } = useAuthModal();
  const { setUser } = useUser();
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, closeAuthModal]);

  const handleLoginSuccess = (session) => {
    setUser(session);
    closeAuthModal();
  };

  if (!isOpen) {
    return (
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        theme="light"
      />
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-brand-950/60"
        role="dialog"
        aria-modal="true"
        aria-label="Sign in to NAVORA"
      >
        <div className="absolute inset-0" onClick={closeAuthModal} aria-hidden="true" />

        <div className="relative z-10 w-full max-w-[400px] max-h-[88vh] overflow-y-auto">
          <button
            onClick={closeAuthModal}
            aria-label="Close sign in"
            className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-control bg-paper border border-line flex items-center justify-center text-ink-2 hover:text-ink hover:bg-surface transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <AuthCard
            mode={mode}
            onModeChange={setMode}
            onOpenForgotPassword={() => setIsForgotOpen(true)}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        theme="light"
      />
    </>
  );
}

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import loginLogo from '../../assets/login-logo.png';
import AuthCard from './AuthCard';
import ForgotPasswordModal from './ForgotPasswordModal';
import { useAuthModal } from '../../context/AuthModalContext';
import { useUser } from '../../context/UserContext';

// Global login popup — opens OVER the current page.
// URL never changes. Background page stays visible (blurred/dimmed) behind.
export default function AuthModal() {
  const { isOpen, mode, setMode, closeAuthModal } = useAuthModal();
  const { setUser } = useUser();
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  // Lock body scroll + close on ESC while open
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
    // Stay on the same URL — just close the popup.
    // RequireAuth (protected pages) will auto-reveal content.
    closeAuthModal();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-3" role="dialog" aria-modal="true" aria-label="Sign in to NAVORA">
            {/* Backdrop — page visible behind, dimmed + blurred */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeAuthModal}
              className="absolute inset-0 bg-slate-900/55 backdrop-blur-[6px]"
            />

            {/* Popup card — compact */}
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-[360px] max-h-[85vh] overflow-y-auto rounded-2xl"
            >
              {/* Close */}
              <button
                onClick={closeAuthModal}
                aria-label="Close sign in"
                className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer shadow-sm"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Brand */}
              <div className="flex flex-col items-center mb-2">
                <img src={loginLogo} alt="NAVORA" className="h-7 w-auto object-contain drop-shadow-sm" />
                <h2 className="font-display text-base sm:text-lg font-bold tracking-tight text-white drop-shadow-md mt-1">
                  Welcome to <span className="text-sky-300">NAVORA</span>
                </h2>
              </div>

              <div className="flex justify-center">
                <AuthCard
                  mode={mode}
                  onModeChange={setMode}
                  onOpenForgotPassword={() => setIsForgotOpen(true)}
                  onLoginSuccess={handleLoginSuccess}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        theme="light"
      />
    </>
  );
}

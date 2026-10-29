import { useState } from 'react';
import { Mail, X, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { soundFx } from '../../utils/soundFx';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSending(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setErrorMessage(error.message || 'Failed to send recovery email.');
        soundFx.playError();
      } else {
        setIsSubmitted(true);
        soundFx.playSuccess();
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred.');
      soundFx.playError();
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setEmail('');
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-brand-950/60"
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-md p-6 rounded-panel bg-white border border-line text-ink"
        role="dialog"
        aria-modal="true"
        aria-label="Reset your password"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-ink-3 hover:text-ink rounded-control transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <div>
            <span className="w-11 h-11 rounded-control bg-brand-50 border border-brand-100 text-brand-700 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h3 className="font-display font-bold text-xl mb-1.5">Reset your password</h3>
            <p className="text-sm text-ink-2 mb-4 leading-relaxed">
              Enter the email address associated with your NAVORA account and we&apos;ll
              send you a recovery link.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-control bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" aria-hidden="true" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-3">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-control text-sm outline-none border bg-paper border-line focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 text-ink placeholder:text-ink-3"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 px-4 rounded-control text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send recovery link</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <span className="w-11 h-11 rounded-control bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
            </span>
            <h3 className="font-display font-bold text-lg mb-1">Check your inbox</h3>
            <p className="text-sm text-ink-2 mb-5 leading-relaxed">
              We have sent instructions to <span className="font-semibold text-ink">{email}</span>.
            </p>
            <button
              onClick={handleReset}
              className="w-full py-2.5 px-4 rounded-control text-sm font-semibold bg-ink text-white hover:bg-brand-950 transition-colors cursor-pointer"
            >
              Back to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

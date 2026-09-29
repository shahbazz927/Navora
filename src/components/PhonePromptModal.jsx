import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { normalizePhone } from '../lib/officialLinks';

// Collects name + phone number before the first gated official-link click
// is logged. Email-login users usually have no phone on their profile, so
// we ask once and keep it in UserContext + Supabase for subsequent clicks.
// On the 2nd open the saved number is auto-filled (editable).
export default function PhonePromptModal({ open, initialName = '', initialPhone = '', linkLabel = 'Official link', onSubmit, onClose }) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [error, setError] = useState(null);

  // Re-sync each time the modal opens so the 2nd visit shows saved values
  // instead of empty fields. Hooks must run before any early return.
  useEffect(() => {
    if (open) {
      setName(initialName || '');
      setPhone(initialPhone || '');
      setError(null);
    }
  }, [open, initialName, initialPhone]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!String(name || '').trim()) {
      setError('Please enter your name.');
      return;
    }
    const normalized = normalizePhone(phone);
    if (!normalized) {
      setError('Please enter a valid phone number with country code (e.g. +91 98765 43210).');
      return;
    }
    onSubmit({ name: String(name).trim(), phone: normalized });
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900">One quick step</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          To open <span className="font-semibold text-slate-700">{linkLabel}</span> on the official site,
          please confirm your name and phone number. We log this visit for verification.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="gated-link-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Full name
            </label>
            <input
              id="gated-link-name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div>
            <label htmlFor="gated-link-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Phone number
            </label>
            <input
              id="gated-link-phone"
              type="tel"
              placeholder="+91 98765 43210"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none text-slate-900 placeholder:text-slate-400"
            />
          </div>
          {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            Continue to official site
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

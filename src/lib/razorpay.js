// Razorpay checkout (frontend). Secret never touches the browser.
// Flow: create order (server) -> Checkout -> verify (server) -> Pro.

import { supabase } from './supabase';

let scriptPromise = null;

export function loadRazorpayScript() {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.async = true;
      s.onload = () => resolve(Boolean(window.Razorpay));
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });
  }
  return scriptPromise;
}

async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const t = data?.session?.access_token;
  if (!t || String(t).startsWith('local_jwt_')) throw new Error('NOT_AUTHENTICATED');
  return { Authorization: `Bearer ${t}` };
}

/**
 * Run the full Pro checkout. Callbacks: onSuccess({ expiresAt, alreadyActive }),
 * onFailure(message), onCancel(). Never resolves Pro from checkout closure —
 * only the server verification response counts.
 */
export async function startProCheckout({ prefill = {}, onSuccess, onFailure, onCancel } = {}) {
  let headers;
  try {
    headers = await authHeaders();
  } catch {
    onFailure?.('Please sign in to upgrade.');
    return;
  }

  let order;
  try {
    const res = await fetch('/api/payments/create-pro-order', { method: 'POST', headers });
    const j = await res.json().catch(() => null);
    if (j?.alreadyPro) {
      onSuccess?.({ expiresAt: j.expiresAt || null, alreadyActive: true });
      return;
    }
    if (!res.ok || !j?.success || !j?.orderId) {
      onFailure?.(res.status === 503
        ? 'Online payments are not enabled yet. Please try again later.'
        : 'Could not start checkout. Please try again.');
      return;
    }
    order = j;
  } catch {
    onFailure?.('Could not start checkout. Please check your connection and try again.');
    return;
  }

  const ready = await loadRazorpayScript();
  if (!ready) {
    onFailure?.('Could not load the payment window. Please try again.');
    return;
  }

  const rzp = new window.Razorpay({
    key: order.keyId,
    amount: order.amount,
    currency: order.currency,
    name: 'NAVORA',
    description: 'NAVORA Pro — annual access (365 days)',
    order_id: order.orderId,
    prefill: {
      email: prefill.email || '',
      name: prefill.name || '',
    },
    theme: { color: '#1D4ED8' },
    modal: { ondismiss: () => onCancel?.() },
    handler: async (resp) => {
      // Payment window closed with details — verify server-side before anything else.
      try {
        const vres = await fetch('/api/payments/verify-pro-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...headers },
          body: JSON.stringify({
            razorpay_order_id: resp?.razorpay_order_id || '',
            razorpay_payment_id: resp?.razorpay_payment_id || '',
            razorpay_signature: resp?.razorpay_signature || '',
          }),
        });
        const vj = await vres.json().catch(() => null);
        if (vres.ok && vj?.success) {
          onSuccess?.({ expiresAt: vj.expiresAt || null, alreadyActive: vj.alreadyActive === true });
        } else {
          onFailure?.('Your payment could not be completed.');
        }
      } catch {
        // Network failure after a possibly-successful payment: verification (or the
        // webhook) reconciles server-side; ask the user to refresh rather than repay.
        onFailure?.('We could not confirm your payment. If money was debited, wait a minute and refresh — your Pro access activates automatically once confirmed.');
      }
    },
  });
  rzp.on('payment.failed', () => onFailure?.('Your payment could not be completed.'));
  rzp.open();
}

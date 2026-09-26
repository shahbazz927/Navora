// ============================================================================
// NAVORA payment provider abstraction (Razorpay, one-time annual access).
// Product: NAVORA Pro — ₹999 (99900 paise) INR — 365 days.
// Test Mode during development; secrets in env, NEVER in frontend.
// Pro activates ONLY after verified payment signature / verified webhook.
// ============================================================================
import crypto from 'node:crypto';

export const PRO_AMOUNT_PAISE = 99900;
export const PRO_CURRENCY = 'INR';
export const PRO_PERIOD_DAYS = 365;

function razorpayKeys() {
  return {
    keyId: (process.env.RAZORPAY_KEY_ID || '').trim(),
    keySecret: (process.env.RAZORPAY_KEY_SECRET || '').trim(),
  };
}
export function isRazorpayConfigured() {
  const { keyId, keySecret } = razorpayKeys();
  return Boolean(keyId && keySecret);
}
export function razorpayPublicKey() {
  return (process.env.RAZORPAY_KEY_ID || '').trim();
}

/**
 * Create a Razorpay order via REST (server-to-server, Basic auth).
 * Returns { id, amount, currency } or throws.
 */
export async function createRazorpayOrder({ receipt, notes = {} }) {
  const { keyId, keySecret } = razorpayKeys();
  if (!keyId || !keySecret) throw new Error('RAZORPAY_NOT_CONFIGURED');
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64'),
    },
    body: JSON.stringify({
      amount: PRO_AMOUNT_PAISE,
      currency: PRO_CURRENCY,
      receipt: String(receipt || `navora_pro_${Date.now()}`).slice(0, 40),
      notes,
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`RAZORPAY_ORDER_FAILED: ${res.status} ${t.slice(0, 200)}`);
  }
  const order = await res.json();
  if (!order?.id) throw new Error('RAZORPAY_ORDER_INVALID');
  return order;
}

/**
 * Verify Razorpay checkout payment signature:
 * HMAC-SHA256(order_id + '|' + payment_id) with key_secret.
 */
export function verifyPaymentSignature(orderId, paymentId, signature) {
  try {
    const { keySecret } = razorpayKeys();
    if (!orderId || !paymentId || !signature || !keySecret) return false;
    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(String(signature).trim(), 'utf8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Fetch a payment from Razorpay (server-side confirmation for webhooks). */
export async function fetchRazorpayPayment(paymentId) {
  const { keyId, keySecret } = razorpayKeys();
  if (!keyId || !keySecret || !paymentId) return null;
  try {
    const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64') },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Verify a Razorpay webhook signature (HMAC-SHA256 of raw body).
 * Returns true only when signature matches. Uses timing-safe compare.
 */
export function verifyRazorpaySignature(rawBody, signature, secret) {
  try {
    if (!rawBody || !signature || !secret) return false;
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(String(signature).trim(), 'utf8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Map a verified Razorpay event -> NAVORA { plan, status, provider ids }.
 * Returns null when the event should not change entitlement.
 * Razorpay events: subscription.activated|charged|cancelled|halted|paused, payment.captured etc.
 */
export function mapRazorpayToNavora(event) {
  const type = event?.event || '';
  const entity = event?.payload?.subscription?.entity || event?.payload?.payment?.entity || {};
  const subId = entity?.id || null;
  const customerId = entity?.customer_id || null;
  const endAt = entity?.current_end_at
    ? new Date(Number(entity.current_end_at) * 1000).toISOString()
    : null;
  const startAt = entity?.current_start_at
    ? new Date(Number(entity.current_start_at) * 1000).toISOString()
    : null;

  if (type.startsWith('subscription.activated') || type.startsWith('subscription.charged')) {
    return { plan: 'pro', status: 'active', providerSubscriptionId: subId, providerCustomerId: customerId, startAt, endAt };
  }
  if (type.startsWith('subscription.cancelled')) {
    return { plan: 'pro', status: 'cancelled', providerSubscriptionId: subId, providerCustomerId: customerId, startAt, endAt };
  }
  if (type.startsWith('subscription.halted') || type.startsWith('subscription.paused')) {
    return { plan: 'free', status: 'expired', providerSubscriptionId: subId, providerCustomerId: customerId, startAt, endAt };
  }
  return null;
}

/** Resolve which provider sent this webhook (header sniffing). Currently: razorpay only. */
export function detectProvider(req) {
  if (req.headers?.['x-razorpay-signature']) return 'razorpay';
  return 'unknown';
}

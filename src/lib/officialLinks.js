// ============================================================================
// LOGIN-GATED OFFICIAL LINKS + SUPABASE CLICK LOGGING
// ============================================================================
// Colleges ("Official Website", "Admissions Portal", "View Official Source")
// and Scholarships ("Official application link", "Official source") outbound
// links require login. After login the click is logged to the
// `official_link_clicks` table with name + phone number + section.
//
// Flow:
//   logged out click -> pending link saved to sessionStorage -> /login
//   login success    -> return to `from` page -> hook resumes pending link
//   logged in click  -> phone prompt if number missing -> log + open URL

export const PENDING_LINK_KEY = 'navora_pending_official_link';

export function savePendingLink(payload) {
  try {
    sessionStorage.setItem(PENDING_LINK_KEY, JSON.stringify({ ...payload, savedAt: Date.now() }));
  } catch {
    /* ignore */
  }
}

export function getPendingLink() {
  try {
    const raw = sessionStorage.getItem(PENDING_LINK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Expire stale intents after 30 minutes
    if (parsed?.savedAt && Date.now() - parsed.savedAt > 30 * 60 * 1000) {
      sessionStorage.removeItem(PENDING_LINK_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingLink() {
  try {
    sessionStorage.removeItem(PENDING_LINK_KEY);
  } catch {
    /* ignore */
  }
}

export function normalizePhone(raw) {
  const cleaned = String(raw || '').replace(/[\s\-()]/g, '');
  if (/^\+\d{8,15}$/.test(cleaned)) return cleaned;
  const digits = cleaned.replace(/\D/g, '');
  // Default to India (+91) for a 10-digit mobile number
  if (/^[6-9]\d{9}$/.test(digits)) return `+91${digits}`;
  if (/^91[6-9]\d{9}$/.test(digits)) return `+${digits}`;
  return null;
}

export function openOfficialUrl(url) {
  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch {
    window.location.href = url;
  }
}

// Resolve display name / phone from (in order): UserContext user, then the
// live Supabase session user. Phone-logins carry phone; email-logins often
// don't — the caller prompts for it when missing.
export function resolveIdentity(contextUser, sessionUser) {
  const name =
    contextUser?.name ||
    sessionUser?.user_metadata?.full_name ||
    (sessionUser?.email ? sessionUser.email.split('@')[0] : '') ||
    sessionUser?.phone ||
    '';
  const phone = contextUser?.phone || sessionUser?.phone || sessionUser?.user_metadata?.phone || '';
  const email = contextUser?.email || sessionUser?.email || '';
  const userId = sessionUser?.id || contextUser?.id || null;
  return { name, phone, email, userId };
}

// Insert one click row. Never throws — logging must not break navigation.
export async function logOfficialLinkClick(supabase, { identity, payload }) {
  try {
    const row = {
      user_id: identity?.userId || null,
      name: identity?.name || null,
      phone: identity?.phone || null,
      email: identity?.email || null,
      section: payload?.section || 'colleges',
      college_slug: payload?.collegeSlug || null,
      college_name: payload?.collegeName || null,
      scholarship_id: payload?.scholarshipId || null,
      scholarship_name: payload?.scholarshipName || null,
      link_label: payload?.linkLabel || 'Official link',
      link_url: payload?.url || '',
    };
    const { error } = await supabase.from('official_link_clicks').insert(row);
    if (error) console.warn('[official-links] log insert failed:', error.message);
    return { error };
  } catch (err) {
    console.warn('[official-links] log insert failed:', err?.message || err);
    return { error: err };
  }
}

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
// live Supabase session user, then persisted profile row. Phone-logins carry
// phone; email-logins often don't — the caller prompts for it when missing.
export function resolveIdentity(contextUser, sessionUser, profileRow) {
  const name =
    contextUser?.name ||
    sessionUser?.user_metadata?.full_name ||
    profileRow?.full_name ||
    (sessionUser?.email ? sessionUser.email.split('@')[0] : '') ||
    sessionUser?.phone ||
    '';
  const phone =
    contextUser?.phone ||
    sessionUser?.phone ||
    sessionUser?.user_metadata?.phone ||
    profileRow?.phone ||
    '';
  const email = contextUser?.email || sessionUser?.email || profileRow?.email || '';
  const userId = sessionUser?.id || contextUser?.id || profileRow?.user_id || null;
  return { name, phone, email, userId };
}

// Load the persisted profile row (phone/name) for this user. Returns null
// when not signed in, table missing, or RLS denies — never throws.
export async function fetchPersistedProfile(supabase, userId) {
  if (!supabase || !userId) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, full_name, phone, email')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) {
      console.warn('[official-links] profiles fetch failed:', error.message);
      return null;
    }
    return data || null;
  } catch (err) {
    console.warn('[official-links] profiles fetch failed:', err?.message || err);
    return null;
  }
}

// Persist name+phone in TWO places so it is visible in Supabase:
//  1. auth.user_metadata via updateUser (survives reloads, cross-device)
//  2. public.profiles row (visible in Table Editor, queryable by admin)
// Never throws — returns { metadataError, profileError }.
export async function persistIdentityToSupabase(supabase, { userId, name, phone, email }) {
  const result = { metadataError: null, profileError: null };
  if (!supabase) return result;
  try {
    const { error } = await supabase.auth.updateUser({ data: { full_name: name, phone } });
    if (error) {
      console.warn('[official-links] auth metadata save failed:', error.message);
      result.metadataError = error;
    }
  } catch (err) {
    console.warn('[official-links] auth metadata save failed:', err?.message || err);
    result.metadataError = err;
  }
  if (userId) {
    try {
      const { error } = await supabase.from('profiles').upsert(
        {
          user_id: userId,
          full_name: name || null,
          phone: phone || null,
          email: email || null,
        },
        { onConflict: 'user_id' },
      );
      if (error) {
        console.warn('[official-links] profiles upsert failed:', error.message);
        result.profileError = error;
      }
    } catch (err) {
      console.warn('[official-links] profiles upsert failed:', err?.message || err);
      result.profileError = err;
    }
  }
  return result;
}

// Insert one click row. Never throws — logging must not break navigation.
// ALWAYS stores link_url + link_label so admin can see WHICH official link
// was clicked, plus who clicked (name/phone/email).
export async function logOfficialLinkClick(supabase, { identity, payload }) {
  try {
    const url = String(payload?.url || '').trim();
    if (!url) {
      const err = new Error('Missing official link URL — click not logged');
      console.warn('[official-links]', err.message, payload);
      return { error: err };
    }
    const row = {
      user_id: identity?.userId ? String(identity.userId) : null,
      name: identity?.name || null,
      phone: identity?.phone || null,
      email: identity?.email || null,
      section: payload?.section || 'colleges',
      college_slug: payload?.collegeSlug || null,
      college_name: payload?.collegeName || null,
      scholarship_id: payload?.scholarshipId ? String(payload.scholarshipId) : null,
      scholarship_name: payload?.scholarshipName || null,
      link_label: payload?.linkLabel || 'Official link',
      link_url: url,
    };
    const { error } = await supabase.from('official_link_clicks').insert(row);
    if (error) {
      console.warn(
        '[official-links] log insert failed — have you applied supabase/migrations/20261003000002_phone_persistence.sql in the Supabase dashboard? ',
        error.message,
        row,
      );
    }
    return { error };
  } catch (err) {
    console.warn('[official-links] log insert failed:', err?.message || err);
    return { error: err };
  }
}

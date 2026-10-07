import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../context/UserContext';
import {
  resolveIdentity,
  fetchPersistedProfile,
  persistIdentityToSupabase,
  logOfficialLinkClick,
  openOfficialUrl,
  normalizePhone,
} from '../lib/officialLinks';
import { saveLeadCapture } from '../lib/leadCapture';
import { isResultUnlocked, markResultUnlocked } from '../components/ResultGate';

// Name + phone gated outbound official links — NO login required.
//
// Usage (existing pages keep working unchanged):
//   const { gateLink, phoneModal, closePhoneModal, submitPhone } = useGatedOfficialLink();
//   <a href={url} onClick={(e) => gateLink(e, { url, linkLabel: 'Official Website', section: 'colleges', collegeSlug, collegeName })}>…</a>
//   <PhonePromptModal open={phoneModal.open} … onSubmit={submitPhone} onClose={closePhoneModal} />
//
// Behaviour:
//   - Session already unlocked (ResultGate or a previous official link) OR a
//     phone number is already known for this visitor -> log + open directly.
//   - Otherwise -> open the name + 10-digit mobile popup. The link opens only
//     after a valid submit. Cancel / close never opens the link.
//   - The phone prompt also accepts a logged-in session to persist the number
//     to the profile, but login is never required to proceed.
//
// Payload: { url, linkLabel, section, collegeSlug?, collegeName?, scholarshipId?, scholarshipName? }
export function useGatedOfficialLink() {
  const { user, setUser } = useUser();
  const [phoneModal, setPhoneModal] = useState({ open: false, payload: null, initialName: '', initialPhone: '' });

  const getKnownIdentity = useCallback(async () => {
    // Fast path: context or session-unlock already knows the visitor.
    let sessionUser = null;
    try {
      const { data } = await supabase.auth.getSession();
      sessionUser = data?.session?.user || null;
    } catch {
      sessionUser = null;
    }
    let profileRow = null;
    if (sessionUser?.id && !user?.phone && !sessionUser?.phone && !sessionUser?.user_metadata?.phone) {
      profileRow = await fetchPersistedProfile(supabase, sessionUser.id);
    }
    const identity = resolveIdentity(user, sessionUser, profileRow);
    // Backfill context so the next click skips the modal.
    if ((identity.phone || identity.name) && (!user?.phone || !user?.name)) {
      try {
        setUser({ ...(user || {}), name: identity.name || user?.name, phone: identity.phone || user?.phone, email: identity.email || user?.email });
      } catch {
        /* ignore */
      }
    }
    return { identity, sessionUser };
  }, [setUser, user]);

  const completeClick = useCallback(async (payload, identity) => {
    await logOfficialLinkClick(supabase, { identity, payload });
    openOfficialUrl(payload.url);
  }, []);

  const gateLink = useCallback(
    async (e, payload) => {
      if (e) e.preventDefault();
      if (!payload?.url) return;
      // Already gave name + number this session -> straight through (still logged).
      if (isResultUnlocked()) {
        const { identity } = await getKnownIdentity();
        await completeClick(payload, identity);
        return;
      }
      const { identity } = await getKnownIdentity();
      // Phone already known from a previous visit / login -> skip the popup,
      // but mark the session unlocked so later clicks stay instant.
      const digits = String(identity.phone || '').replace(/\D/g, '').slice(-10);
      if (/^[6-9]\d{9}$/.test(digits)) {
        markResultUnlocked();
        await completeClick(payload, identity);
        return;
      }
      setPhoneModal({ open: true, payload, initialName: identity.name || '', initialPhone: identity.phone || '' });
    },
    [completeClick, getKnownIdentity],
  );

  const closePhoneModal = useCallback(() => {
    setPhoneModal((s) => ({ ...s, open: false }));
  }, []);

  const submitPhone = useCallback(
    async ({ name, phone }) => {
      const payload = phoneModal.payload;
      if (!payload) {
        closePhoneModal();
        return;
      }
      // Modal already validates, but never trust the caller — re-normalize.
      const normalized = normalizePhone(phone);
      const cleanName = String(name || '').trim();
      if (!cleanName || !normalized) return;
      const national = String(normalized).replace(/\D/g, '').slice(-10);

      let sessionUser = null;
      try {
        const { data } = await supabase.auth.getSession();
        sessionUser = data?.session?.user || null;
      } catch {
        sessionUser = null;
      }
      const email = user?.email || sessionUser?.email || '';
      const nextUser = { ...(user || {}), name: cleanName, phone: normalized, email };
      try {
        setUser(nextUser);
      } catch {
        /* ignore */
      }
      // Session unlock FIRST so the link opens even if logging is slow/offline.
      markResultUnlocked();
      setPhoneModal({ open: false, payload: null, initialName: '', initialPhone: '' });

      // Best-effort persistence — never blocks opening the link.
      if (sessionUser?.id) {
        await persistIdentityToSupabase(supabase, {
          userId: sessionUser.id,
          name: cleanName,
          phone: normalized,
          email,
        });
      }
      saveLeadCapture({
        sourcePage: 'phone_prompt',
        stepKey: `phone:${national}`,
        userType: payload.section || 'phone_prompt',
        name: cleanName,
        phone: normalized,
        email,
        userId: sessionUser?.id || null,
        answers: {},
      });
      await completeClick(payload, resolveIdentity(nextUser, sessionUser, null));
    },
    [closePhoneModal, completeClick, phoneModal.payload, setUser, user],
  );

  return { gateLink, phoneModal, closePhoneModal, submitPhone };
}

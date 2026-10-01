import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from '../context/UserContext';
import { useAuthModal } from '../context/AuthModalContext';
import {
  savePendingLink,
  getPendingLink,
  clearPendingLink,
  resolveIdentity,
  fetchPersistedProfile,
  persistIdentityToSupabase,
  logOfficialLinkClick,
  openOfficialUrl,
} from '../lib/officialLinks';
import { saveLeadCapture } from '../lib/leadCapture';

// Login-gated outbound official links.
//
// Usage:
//   const { gateLink, phoneModal, closePhoneModal, submitPhone } = useGatedOfficialLink();
//   <a href={url} onClick={(e) => gateLink(e, { url, linkLabel: 'Official Website', section: 'colleges', collegeSlug, collegeName })}>…</a>
//   <PhonePromptModal open={phoneModal.open} … onSubmit={submitPhone} onClose={closePhoneModal} />
//
// Payload: { url, linkLabel, section, collegeSlug?, collegeName?, scholarshipId?, scholarshipName? }
export function useGatedOfficialLink() {
  const location = useLocation();
  const { openAuthModal } = useAuthModal();
  const { user, setUser } = useUser();
  const [phoneModal, setPhoneModal] = useState({ open: false, payload: null, initialName: '', initialPhone: '' });

  // Merge live session + context + persisted Supabase profile so a phone
  // number given once is found on the 2nd click (even after reload).
  const getIdentity = useCallback(
    async (sessionUser) => {
      let profileRow = null;
      if (sessionUser?.id) {
        // Skip extra fetch if context already has a phone number.
        if (!user?.phone && !sessionUser?.phone && !sessionUser?.user_metadata?.phone) {
          profileRow = await fetchPersistedProfile(supabase, sessionUser.id);
        }
      }
      const identity = resolveIdentity(user, sessionUser, profileRow);
      // Backfill context so subsequent clicks skip the modal (auto-fill).
      if (identity.phone && !user?.phone) {
        try {
          setUser({ ...(user || {}), name: identity.name, phone: identity.phone, email: identity.email });
        } catch {
          /* ignore */
        }
      }
      return identity;
    },
    [setUser, user],
  );

  const completeClick = useCallback(
    async (payload, identity) => {
      await logOfficialLinkClick(supabase, { identity, payload });
      clearPendingLink();
      openOfficialUrl(payload.url);
    },
    [],
  );

  const gateLink = useCallback(
    async (e, payload) => {
      if (e) e.preventDefault();
      if (!payload?.url) return;
      let sessionUser = null;
      try {
        const { data } = await supabase.auth.getSession();
        sessionUser = data?.session?.user || null;
      } catch {
        sessionUser = null;
      }
      // Not logged in -> remember intent, open popup on same page (no URL change).
      if (!sessionUser) {
        savePendingLink({ ...payload, returnPath: location.pathname });
        openAuthModal('login');
        return;
      }
      const identity = await getIdentity(sessionUser);
      // Logged in but no phone number yet -> ask once (pre-filled if we
      // know name/phone), then log + open. 2nd click auto-skips the modal.
      if (!identity.phone) {
        setPhoneModal({ open: true, payload, initialName: identity.name || '', initialPhone: identity.phone || '' });
        return;
      }
      await completeClick(payload, identity);
    },
    [completeClick, getIdentity, location.pathname, openAuthModal],
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
      let sessionUser = null;
      try {
        const { data } = await supabase.auth.getSession();
        sessionUser = data?.session?.user || null;
      } catch {
        sessionUser = null;
      }
      if (!sessionUser) {
        savePendingLink({ ...payload, returnPath: location.pathname });
        closePhoneModal();
        openAuthModal('login');
        return;
      }
      const email = user?.email || sessionUser?.email || '';
      const nextUser = { ...(user || {}), name, phone, email };
      try {
        setUser(nextUser);
      } catch {
        /* ignore */
      }
      // Persist to Supabase (auth metadata + profiles table) so the number
      // is visible in the dashboard and auto-filled next time.
      await persistIdentityToSupabase(supabase, {
        userId: sessionUser.id,
        name,
        phone,
        email,
      });
      // Also record the filled name + phone in lead_captures (Sheet-style log).
      saveLeadCapture({
        sourcePage: 'phone_prompt',
        stepKey: `phone:${phone}`,
        userType: 'phone_prompt',
        name,
        phone,
        email,
        userId: sessionUser.id,
        answers: {},
      });
      setPhoneModal({ open: false, payload: null, initialName: '', initialPhone: '' });
      await completeClick(payload, resolveIdentity(nextUser, sessionUser, null));
    },
    [closePhoneModal, completeClick, location.pathname, openAuthModal, phoneModal.payload, setUser, user],
  );

  // Popup flow: URL never changes, so resume the pending intent when auth
  // state flips to SIGNED_IN (login popup success on the same page).
  useEffect(() => {
    let cancelled = false;
    const resume = async () => {
      const pending = getPendingLink();
      if (!pending?.url || pending.returnPath !== location.pathname) return;
      let sessionUser = null;
      try {
        const { data } = await supabase.auth.getSession();
        sessionUser = data?.session?.user || null;
      } catch {
        sessionUser = null;
      }
      if (!sessionUser || cancelled) return;
      const profileRow = await fetchPersistedProfile(supabase, sessionUser.id);
      if (cancelled) return;
      const identity = resolveIdentity(user, sessionUser, profileRow);
      if (!identity.phone) {
        setPhoneModal({ open: true, payload: pending, initialName: identity.name || '', initialPhone: '' });
      } else {
        await completeClick(pending, identity);
      }
    };
    resume();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') resume();
    });
    return () => {
      cancelled = true;
      sub?.subscription?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return { gateLink, phoneModal, closePhoneModal, submitPhone };
}

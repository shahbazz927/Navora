import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from '../context/UserContext';
import {
  savePendingLink,
  getPendingLink,
  clearPendingLink,
  resolveIdentity,
  logOfficialLinkClick,
  openOfficialUrl,
} from '../lib/officialLinks';

// Login-gated outbound official links.
//
// Usage:
//   const { gateLink, phoneModal, closePhoneModal, submitPhone } = useGatedOfficialLink();
//   <a href={url} onClick={(e) => gateLink(e, { url, linkLabel: 'Official Website', section: 'colleges', collegeSlug, collegeName })}>…</a>
//   <PhonePromptModal open={phoneModal.open} … onSubmit={submitPhone} onClose={closePhoneModal} />
//
// Payload: { url, linkLabel, section, collegeSlug?, collegeName?, scholarshipId?, scholarshipName? }
export function useGatedOfficialLink() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser();
  const [phoneModal, setPhoneModal] = useState({ open: false, payload: null, initialName: '' });

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
      // Not logged in -> remember intent, send to login, come back after.
      if (!sessionUser) {
        savePendingLink({ ...payload, returnPath: location.pathname });
        navigate('/login', { state: { from: location.pathname } });
        return;
      }
      const identity = resolveIdentity(user, sessionUser);
      // Logged in but no phone number yet -> ask once, then log + open.
      if (!identity.phone) {
        setPhoneModal({ open: true, payload, initialName: identity.name || '' });
        return;
      }
      await completeClick(payload, identity);
    },
    [completeClick, location.pathname, navigate, user],
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
        navigate('/login', { state: { from: location.pathname } });
        return;
      }
      const nextUser = { ...(user || {}), name, phone };
      try {
        setUser(nextUser);
      } catch {
        /* ignore */
      }
      // Best-effort: persist onto the auth profile so it's there next time.
      try {
        await supabase.auth.updateUser({ data: { full_name: name, phone } });
      } catch {
        /* ignore */
      }
      setPhoneModal({ open: false, payload: null, initialName: '' });
      await completeClick(payload, resolveIdentity(nextUser, sessionUser));
    },
    [closePhoneModal, completeClick, location.pathname, navigate, phoneModal.payload, setUser, user],
  );

  // After login we land back on `returnPath` with the pending intent still in
  // sessionStorage — pick it up here: prompt for phone if needed, else log +
  // open automatically (user already clicked once, so popup blockers allow it
  // on this user-gesture-adjacent navigation in most browsers; if blocked,
  // the modal still offers an explicit continue button).
  useEffect(() => {
    let cancelled = false;
    (async () => {
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
      const identity = resolveIdentity(user, sessionUser);
      if (!identity.phone) {
        setPhoneModal({ open: true, payload: pending, initialName: identity.name || '' });
      } else {
        await completeClick(pending, identity);
      }
    })();
    return () => {
      cancelled = true;
    };
    // Run once per page mount — resuming exactly one pending intent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { gateLink, phoneModal, closePhoneModal, submitPhone };
}

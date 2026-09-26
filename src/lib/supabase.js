// ============================================================================
// SUPABASE CLIENT CONFIGURATION
// ============================================================================
// Credentials are read from Vite env vars (.env file at project root).
// When credentials are not set, a resilient local-storage mock client is
// provided so authentication and dashboard features function seamlessly.
//
// Required vars (optional for local/demo mode):
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  'https://wqpweslcmayzqhczcddi.supabase.co';
const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_pbNSi0fW7C73lcSpxMtosw_DP7-AoGo';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('placeholder.supabase.co')
);

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function createLocalMockSupabase() {
  const SESSION_KEY = 'navora_local_supabase_session';
  const RESULTS_KEY = 'navora_local_assessment_results';
  const listeners = new Set();

  function getLocalSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }

  function saveLocalSession(session) {
    try {
      if (session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {}
  }

  function notify(event, session) {
    listeners.forEach((fn) => {
      try {
        fn(event, session);
      } catch (err) {
        console.warn('[local-auth] listener error:', err);
      }
    });
  }

  return {
    auth: {
      async getSession() {
        const session = getLocalSession();
        return { data: { session }, error: null };
      },
      async getUser() {
        const session = getLocalSession();
        return { data: { user: session?.user || null }, error: null };
      },
      async signInWithPassword({ email, password }) {
        if (!email || !password) {
          return { data: { user: null, session: null }, error: { message: 'Email and password required' } };
        }
        const user = {
          id: 'local_usr_' + Math.abs(hashCode(email)),
          email: email.trim(),
          user_metadata: {
            full_name: email.split('@')[0],
          },
          created_at: new Date().toISOString(),
        };
        const session = {
          access_token: 'local_jwt_' + Date.now(),
          user,
          expires_at: Math.floor(Date.now() / 1000) + 86400 * 7,
        };
        saveLocalSession(session);
        notify('SIGNED_IN', session);
        return { data: { user, session }, error: null };
      },
      async signUp({ email, password, options }) {
        const user = {
          id: 'local_usr_' + Math.abs(hashCode(email)),
          email: email.trim(),
          user_metadata: {
            full_name: options?.data?.full_name || email.split('@')[0],
          },
          created_at: new Date().toISOString(),
        };
        const session = {
          access_token: 'local_jwt_' + Date.now(),
          user,
          expires_at: Math.floor(Date.now() / 1000) + 86400 * 7,
        };
        saveLocalSession(session);
        notify('SIGNED_IN', session);
        return { data: { user, session }, error: null };
      },
      async signOut() {
        saveLocalSession(null);
        notify('SIGNED_OUT', null);
        return { error: null };
      },
      async updateUser({ password, data }) {
        const session = getLocalSession();
        if (session?.user) {
          if (data) {
            session.user.user_metadata = { ...(session.user.user_metadata || {}), ...data };
          }
          saveLocalSession(session);
          notify('USER_UPDATED', session);
          return { data: { user: session.user }, error: null };
        }
        return { data: { user: null }, error: null };
      },
      onAuthStateChange(callback) {
        listeners.add(callback);
        const session = getLocalSession();
        setTimeout(() => {
          try {
            callback('INITIAL_SESSION', session);
          } catch {}
        }, 0);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                listeners.delete(callback);
              },
            },
          },
        };
      },
      async signInWithOAuth({ provider }) {
        const email = `student@${provider || 'guest'}.local`;
        const user = {
          id: 'local_oauth_' + (provider || 'guest'),
          email,
          user_metadata: { full_name: `${provider ? provider.toUpperCase() : 'Guest'} Student` },
          created_at: new Date().toISOString(),
        };
        const session = {
          access_token: 'local_jwt_' + Date.now(),
          user,
          expires_at: Math.floor(Date.now() / 1000) + 86400 * 7,
        };
        saveLocalSession(session);
        notify('SIGNED_IN', session);
        return { data: { user, session }, error: null };
      },
      async resetPasswordForEmail() {
        return { data: {}, error: null };
      },
      async resend() {
        return { data: {}, error: null };
      },
    },
    storage: {
      from(bucket) {
        return {
          async upload(path, file) {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => {
                try {
                  localStorage.setItem(`navora_storage_${bucket}_${path}`, String(reader.result));
                } catch {}
                resolve({ data: { path }, error: null });
              };
              reader.onerror = () => resolve({ data: null, error: new Error('Failed to read file') });
              reader.readAsDataURL(file);
            });
          },
          getPublicUrl(path) {
            const url = localStorage.getItem(`navora_storage_${bucket}_${path}`) || '';
            return { data: { publicUrl: url } };
          },
        };
      },
    },
    from(tableName) {
      const records = (() => {
        try {
          return JSON.parse(localStorage.getItem(`${RESULTS_KEY}_${tableName}`) || '[]');
        } catch {
          return [];
        }
      })();

      let currentData = [...records];

      const query = {
        insert(rows) {
          const rowList = Array.isArray(rows) ? rows : [rows];
          const newRows = rowList.map((r) => ({
            id: 'res_' + Math.random().toString(36).substring(2, 9),
            ...r,
          }));
          records.push(...newRows);
          try {
            localStorage.setItem(`${RESULTS_KEY}_${tableName}`, JSON.stringify(records));
          } catch {}
          currentData = newRows;
          return query;
        },
        upsert(rows) {
          return query.insert(rows);
        },
        select() {
          return query;
        },
        eq(col, val) {
          currentData = currentData.filter((r) => r[col] === val);
          return query;
        },
        order(col, { ascending = true } = {}) {
          currentData.sort((a, b) => {
            if (a[col] < b[col]) return ascending ? -1 : 1;
            if (a[col] > b[col]) return ascending ? 1 : -1;
            return 0;
          });
          return query;
        },
        limit(n) {
          currentData = currentData.slice(0, n);
          return query;
        },
        async single() {
          return { data: currentData[0] || null, error: null };
        },
        async maybeSingle() {
          return { data: currentData[0] || null, error: null };
        },
        then(resolve) {
          return Promise.resolve({ data: currentData, error: null }).then(resolve);
        },
      };

      return query;
    },
  };
}

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : createLocalMockSupabase();


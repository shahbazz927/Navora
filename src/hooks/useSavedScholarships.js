import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../context/UserContext';

const STORAGE_KEY = 'navora_saved_scholarships';

export function useSavedScholarships() {
  const { user } = useUser();
  const [savedIds, setSavedIds] = useState(() => {
    try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
  });

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const { data } = await supabase.from('saved_scholarships').select('scholarship_id').eq('user_id', user.id);
        if (data) {
          const dbIds = data.map(d=>d.scholarship_id);
          setSavedIds(prev => {
            const merged = Array.from(new Set([...prev, ...dbIds]));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            return merged;
          });
        }
      } catch {}
    })();
  }, [user?.id]);

  const toggle = async (id) => {
    const exists = savedIds.includes(id);
    const next = exists ? savedIds.filter(x=>x!==id) : [...savedIds, id];
    setSavedIds(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
    if (user?.id) {
      try {
        if (exists) await supabase.from('saved_scholarships').delete().match({ user_id: user.id, scholarship_id: id });
        else await supabase.from('saved_scholarships').insert([{ user_id: user.id, scholarship_id: id }]);
      } catch {}
    }
  };
  return { savedIds, toggle, isSaved: (id)=>savedIds.includes(id), count: savedIds.length };
}

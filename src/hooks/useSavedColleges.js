import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../context/UserContext';

const STORAGE_KEY = 'navora_saved_colleges';

export function useSavedColleges() {
  const { user } = useUser();
  const [savedSlugs, setSavedSlugs] = useState(() => {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  // Sync with Supabase when user logs in
  useEffect(() => {
    if (!user?.id || !supabase) return;

    async function fetchSavedFromDb() {
      try {
        const { data, error } = await supabase
          .from('saved_colleges')
          .select('institution_slug')
          .eq('user_id', user.id);

        if (!error && data) {
          const dbSlugs = data.map(d => d.institution_slug);
          setSavedSlugs(prev => {
            const merged = Array.from(new Set([...prev, ...dbSlugs]));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            return merged;
          });
        }
      } catch (err) {
        console.warn('Could not fetch saved colleges from Supabase:', err);
      }
    }

    fetchSavedFromDb();
  }, [user?.id]);

  const toggleSaveCollege = async (slug) => {
    if (!slug) return;
    const isAlreadySaved = savedSlugs.includes(slug);
    const nextSlugs = isAlreadySaved
      ? savedSlugs.filter(s => s !== slug)
      : [...savedSlugs, slug];

    setSavedSlugs(nextSlugs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSlugs));
    } catch {
      // ignore localstorage errors
    }

    // Attempt Supabase sync if logged in
    if (user?.id && supabase) {
      try {
        if (isAlreadySaved) {
          await supabase
            .from('saved_colleges')
            .delete()
            .match({ user_id: user.id, institution_slug: slug });
        } else {
          await supabase
            .from('saved_colleges')
            .insert([{ user_id: user.id, institution_slug: slug }]);
        }
      } catch (err) {
        console.warn('Supabase sync saved college failed:', err);
      }
    }
  };

  const isSaved = (slug) => savedSlugs.includes(slug);

  return {
    savedSlugs,
    toggleSaveCollege,
    isSaved,
    count: savedSlugs.length
  };
}

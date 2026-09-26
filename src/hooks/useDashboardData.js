import { useEffect, useMemo, useState, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { useSubscription } from './useSubscription';
import { useSavedColleges } from './useSavedColleges';
import { useSavedScholarships } from './useSavedScholarships';
import { fetchLatestResult } from '../lib/assessmentResults';
import { unifiedFromCareerEngine } from '../data/resultsAdapters';
import { getCollegesMatchingProfile } from '../data/institutionsMaster';
import { careers } from '../data/careers';
import { buildActivity, profileCompletion } from '../lib/dashboard';

/**
 * getDashboardData(userId) — one hook aggregating every dashboard source:
 * profile, assessment (remote-first), recommendations, colleges, activity,
 * AI usage, subscription. Sections consume slices; failures stay local.
 */
export function useDashboardData() {
  const { userType: localUserType, answers: localAnswers, onboardingData, chatHistory, comparisonItems, user } = useUser();
  const sub = useSubscription();
  const { savedSlugs } = useSavedColleges();
  const { savedIds } = useSavedScholarships();

  const [remote, setRemote] = useState(null);
  const [loadingRemote, setLoadingRemote] = useState(true);
  const [remoteError, setRemoteError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const retry = useCallback(() => setRetryKey((k) => k + 1), []);

  useEffect(() => {
    let live = true;
    (async () => {
      setLoadingRemote(true);
      setRemoteError(null);
      const res = await fetchLatestResult();
      if (!live) return;
      if (res?.error) setRemoteError(res.error);
      else if (res?.data) setRemote(res.data);
      setLoadingRemote(false);
    })();
    return () => { live = false; };
  }, [user?.email, retryKey]);

  const effective = useMemo(() => {
    if (remote?.assessment_data && remote?.result_data) {
      const a = remote.assessment_data || {};
      const flow = a.flow || remote.assessment_type || localUserType;
      let ut = localUserType;
      if (flow) {
        if (String(flow).includes('graduation')) ut = flow.includes('parent') ? 'parent' : 'graduate';
        else if (String(flow).includes('class12')) ut = flow.includes('parent') ? 'parent' : 'class12';
        else if (String(flow).includes('class10')) ut = 'parent';
      }
      return {
        userType: ut || localUserType,
        answers: a,
        remoteUnified: remote.result_data?.unified || null,
        source: 'supabase',
        createdAt: remote.created_at,
      };
    }
    return { userType: localUserType, answers: localAnswers, source: 'local', createdAt: localAnswers?.lastSavedAt || null };
  }, [remote, localUserType, localAnswers]);

  const answers = effective.answers || {};
  const hasAssessment = Object.keys(answers).length > 0 && !!effective.userType;

  const unified = useMemo(() => {
    if (effective.remoteUnified?.length) return effective.remoteUnified;
    if (!hasAssessment) return [];
    try {
      const flowKey = answers?.flow || (effective.userType === 'class12' ? 'student_class12' : effective.userType === 'graduate' ? 'student_graduation' : effective.userType);
      return unifiedFromCareerEngine(flowKey, answers);
    } catch { return []; }
  }, [effective, hasAssessment, answers]);

  const colleges = useMemo(() => {
    try { return getCollegesMatchingProfile(answers).slice(0, 4); } catch { return []; }
  }, [answers]);

  const courseCount = useMemo(() => {
    const top = unified[0];
    const routes = top?.career?.educationRoutes || [];
    return Array.isArray(routes) ? routes.length : 0;
  }, [unified]);

  const activity = useMemo(
    () => buildActivity({
      answers, chatHistory,
      savedColleges: savedSlugs || [], savedScholarships: savedIds || [],
      comparisonItems: comparisonItems || [], remoteCreatedAt: effective.createdAt,
    }),
    [answers, chatHistory, savedSlugs, savedIds, comparisonItems, effective.createdAt],
  );

  const completion = useMemo(() => profileCompletion(answers, onboardingData), [answers, onboardingData]);

  return {
    user, userType: effective.userType, answers, hasAssessment,
    unified, colleges, courseCount, activity, completion,
    loadingRemote, remoteError, retry,
    onboardingData, chatHistory, comparisonItems,
    savedSlugs: savedSlugs || [], savedIds: savedIds || [],
    popularCareers: careers,
    // entitlement (server-authoritative)
    isPro: sub.isPro, plan: sub.plan, sub: sub.sub,
    aiUsed: sub.aiUsed, aiLimit: sub.aiLimit, entitlementLoading: sub.loading,
    refreshEntitlement: sub.fetchRemote,
    expiresAt: sub.sub?.expires_at || sub.sub?.currentPeriodEnd || null,
  };
}

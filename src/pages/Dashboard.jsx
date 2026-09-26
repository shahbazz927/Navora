import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useScrollTop } from '../hooks/useLocalStorage';
import { useDashboardData } from '../hooks/useDashboardData';
import { useUser } from '../context/UserContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import FreeDashboard from '../components/dashboard/FreeDashboard';
import ProDashboard from '../components/dashboard/ProDashboard';
import UpgradeModal from '../components/UpgradeModal';
import { Skeleton } from '../components/dashboard/DashboardHeader';

export default function Dashboard() {
  useScrollTop();
  const location = useLocation();
  const d = useDashboardData();
  const { user } = useUser();
  const [upgradeFeature, setUpgradeFeature] = useState(null);
  const prevPro = useRef(d.isPro);

  const openUpgrade = (feature = 'default') => setUpgradeFeature(feature || 'default');

  // Scroll to Pro anchors (?view=roadmap / ?view=reports)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get('view');
    if (view === 'roadmap' || view === 'reports') {
      const t = setTimeout(() => {
        document.getElementById(view === 'roadmap' ? 'action-plan' : 'reports')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
      return () => clearTimeout(t);
    }
  }, [location.search, d.isPro]);

  useEffect(() => { prevPro.current = d.isPro; }, [d.isPro]);

  const prefill = {
    email: user?.email || '',
    name: d.onboardingData?.name || user?.user_metadata?.full_name || '',
  };

  return (
    <DashboardLayout isPro={d.isPro} user={user}>
      {d.entitlementLoading ? (
        <div className="space-y-6" aria-label="Loading dashboard">
          <div><Skeleton className="h-8 w-56" /><Skeleton className="h-4 w-80 mt-2" /></div>
          <Skeleton className="h-44 w-full !rounded-[1.4rem]" />
          <div className="grid sm:grid-cols-2 gap-3">
            <Skeleton className="h-24" /><Skeleton className="h-24" />
          </div>
          <Skeleton className="h-40 w-full !rounded-2xl" />
        </div>
      ) : (
        <>
          {d.remoteError && (
            <div className="mb-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3" role="alert">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900">We couldn’t load your saved result</p>
                <p className="text-sm text-amber-800/80">Showing local data instead. Nothing else is affected.</p>
              </div>
              <button onClick={d.retry} className="text-sm font-semibold text-amber-900 underline shrink-0">Try again</button>
            </div>
          )}
          {d.isPro ? (
            <ProDashboard d={d} onUpgrade={openUpgrade} />
          ) : (
            <FreeDashboard d={d} onUpgrade={openUpgrade} />
          )}
        </>
      )}

      <UpgradeModal
        open={upgradeFeature !== null}
        onClose={() => setUpgradeFeature(null)}
        feature={upgradeFeature || 'default'}
        prefill={prefill}
        onProActivated={() => d.refreshEntitlement()}
      />
    </DashboardLayout>
  );
}

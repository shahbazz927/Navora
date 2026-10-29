import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useScrollTop } from '../hooks/useLocalStorage';
import { useDashboardData } from '../hooks/useDashboardData';
import { useUser } from '../context/UserContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ProDashboard from '../components/dashboard/ProDashboard';
import { Skeleton } from '../components/dashboard/DashboardHeader';

export default function Dashboard() {
  useScrollTop();
  const location = useLocation();
  const d = useDashboardData();
  const { user } = useUser();

  // Scroll to the roadmap / reports anchors (?view=roadmap / ?view=reports)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get('view');
    if (view === 'roadmap' || view === 'reports') {
      const t = setTimeout(() => {
        document.getElementById(view === 'roadmap' ? 'action-plan' : 'reports')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
      return () => clearTimeout(t);
    }
  }, [location.search]);

  return (
    <DashboardLayout user={user}>
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
        <ProDashboard d={d} />
      )}
    </DashboardLayout>
  );
}

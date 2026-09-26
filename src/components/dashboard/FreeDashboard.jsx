import DashboardHeader from './DashboardHeader';
import CareerAssessmentHero, { AssessmentHeroSkeleton } from './CareerAssessmentHero';
import ExploreCareers from './ExploreCareers';
import QuickLinks from './QuickLinks';
import RecentActivity from './RecentActivity';
import AIAdvisorWidget from './AIAdvisorWidget';
import ProPreview, { UpgradeBanner } from './ProPreview';

export default function FreeDashboard({ d, onUpgrade }) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <DashboardHeader isPro={false} user={d.user} onboarding={d.onboardingData} planLabel="NAVORA Free · Explore your possibilities" />

      {d.loadingRemote && !d.hasAssessment ? (
        <AssessmentHeroSkeleton />
      ) : (
        <CareerAssessmentHero completed={d.hasAssessment} userType={d.userType} />
      )}

      <ExploreCareers personalized={d.unified} popular={d.popularCareers} userType={d.userType} />

      <QuickLinks />

      <RecentActivity items={d.activity} />

      <AIAdvisorWidget isPro={false} used={d.aiUsed} limit={d.aiLimit} onUpgrade={onUpgrade} />

      <ProPreview onUnlock={onUpgrade} />

      <UpgradeBanner onUpgrade={onUpgrade} />
    </div>
  );
}
